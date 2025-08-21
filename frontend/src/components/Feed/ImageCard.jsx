import React, { useState } from "react";
import CommentCard from "./CommentCard";
import { useAuth } from "../../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaRegComment,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

function ImageCard({ image, handleDelete }) {
  let navigate = useNavigate();
  const [hasLiked, setHasLiked] = useState(image.hasLiked);
  const [likeCount, setLikeCount] = useState(image.likeCount);
  const { user } = useAuth();
  const userId = user?._id;

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(image.description);
  const [commentPage, setCommentPage] = useState(1);
  const [comments, setComments] = useState([]);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const isOwner = image.owner._id === userId;

  const [loadingComments, setLoadingComments] = useState(false);

  function loadMoreComments() {
    setCommentPage((prevPage) => prevPage + 1);
    setLoadingComments(true);
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/comments/image/${
          image._id
        }?page=${commentPage + 1}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setComments([...comments, ...res.data.data.comments]);
        setHasMoreComments(res.data.data.hasMore);
        setLoadingComments(false);
      })
      .catch((err) => {
        if (err.response.status === 498) {
          navigate("/");
        }
        console.log(err);
      });
  }

  const handleDeleteComment = (commentId) => {
    axios
      .delete(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/comments/c/${commentId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setComments(comments.filter((comment) => comment._id !== commentId));
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 498) {
          navigate("/");
        }
      });
  };

  function handleEdit() {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      if (!editedDescription.trim()) {
        return;
      } else {
        console.log(editedDescription);
        axios
          .patch(
            `${import.meta.env.VITE_REACT_APP_API_BASE}/images/${image._id}`,
            { description: editedDescription },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            setIsEditing(false);
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status === 498) {
              navigate("/");
            }
          });
      }
    }
  }

  function handleLike() {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/likes/toggle/image/${
          image._id
        }`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setHasLiked(!hasLiked);
        if (hasLiked) {
          setLikeCount(likeCount - 1);
        } else {
          setLikeCount(likeCount + 1);
        }
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 498) {
          navigate("/");
        }
      });
  }

  function addComment() {
    if (!newComment.trim()) return;
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/comments/image/${
          image._id
        }`,
        { content: newComment },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setCommentPage(1);
        axios
          .get(
            `${import.meta.env.VITE_REACT_APP_API_BASE}/comments/image/${
              image._id
            }?page=${1}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            setComments(res?.data?.data?.comments);
            setHasMoreComments(res?.data?.data?.hasMore);
          })
          .catch((err) => {
            if (err.response.status === 498) {
              navigate("/");
            }
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 498) {
          navigate("/");
        }
      });
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 shadow-lg">
      <div className="flex items-start mb-3">
        <Link to={`/profile/${image.owner.username}`}>
          <img
            src={image.owner.avatar}
            alt={image.owner.username}
            className="w-10 h-10 rounded-full mr-3 object-cover border border-purple-500 hover:border-purple-300 transition-colors"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/profile/${image.owner.username}`}
                className="hover:underline"
              >
                <div className="font-semibold text-white hover:text-purple-300 transition-colors">
                  {image.owner.fullname}
                </div>
              </Link>
              <Link
                to={`/profile/${image.owner.username}`}
                className="hover:underline"
              >
                <div className="text-gray-400 text-sm hover:text-purple-300 transition-colors">
                  @{image.owner.username}
                </div>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="text-gray-500 text-xs mr-2">
                {formatDistanceToNow(new Date(image.createdAt))} ago
              </div>
              {isOwner && (
                <div className="flex space-x-2 ml-2">
                  <button
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <FaPen size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <img
          src={image.imageFile}
          alt={image.description}
          className="w-full rounded-lg object-contain max-h-96 bg-gray-900"
          loading="lazy"
        />
      </div>
      {isEditing ? (
        <input
          type="text"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Enter image description..."
          className="w-full mb-4 px-3 py-2 bg-gray-700 text-white border border-purple-500 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      ) : (
        <div className="mb-4 text-gray-200">{editedDescription}</div>
      )}

      <div className="flex items-center text-gray-400 border-t border-gray-700 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center mr-6 ${
            hasLiked ? "text-purple-400" : "hover:text-purple-300"
          }`}
        >
          {hasLiked ? (
            <FaHeart className="mr-2" />
          ) : (
            <FaRegHeart className="mr-2" />
          )}
          <span className="text-sm">{likeCount}</span>
        </button>

        <button
          onClick={() => {
            if (!showComments && comments.length === 0) {
              axios
                .get(
                  `${import.meta.env.VITE_REACT_APP_API_BASE}/comments/image/${
                    image._id
                  }?page=${commentPage}`,
                  {
                    withCredentials: true,
                  }
                )
                .then((res) => {
                  setComments(res.data?.data?.comments);
                  setHasMoreComments(res.data?.data?.hasMore);
                })
                .catch((err) => {
                  console.log(err);
                  if (err.response.status === 498) {
                    navigate("/");
                  }
                });
            }
            setShowComments(!showComments);
          }}
          className={`flex items-center ${
            showComments ? "text-purple-400" : "hover:text-purple-300"
          }`}
        >
          {showComments ? (
            <FaComment className="mr-2" />
          ) : (
            <FaRegComment className="mr-2" />
          )}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex mt-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              onClick={() => {
                addComment();
                setNewComment("");
              }}
              className={`px-4 py-2 rounded-r-lg font-medium ${
                newComment.trim()
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              Post
            </button>
          </div>

          <div className="mt-4">
            {comments.length === 0 ? (
              <div className="text-center text-gray-500 mb-4 text-sm">
                No comments yet
              </div>
            ) : (
              <>
                {comments.map((comment, index) => (
                  <CommentCard
                    key={comment._id || index}
                    comment={comment}
                    handleDeleteComment={handleDeleteComment}
                  />
                ))}

                {hasMoreComments && (
                  <div className="text-center mt-4">
                    <button
                      onClick={loadMoreComments}
                      disabled={loadingComments}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {loadingComments ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageCard;
