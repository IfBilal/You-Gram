import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaRegComment,
  FaPen,
  FaEye,
} from "react-icons/fa";
import CommentCard from "../Feed/CommentCard";

function VideoPlayer() {
  const navigate = useNavigate();
  const { videoId } = useParams();
  const { user } = useAuth();
  const userId = user?._id;

  const [video, setVideo] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  const [comments, setComments] = useState([]);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const isOwner = video?.owner?._id === userId;

  useEffect(() => {
    fetchVideoData();
  }, []);

  const fetchVideoData = () => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE}/videos/${videoId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const videoData = res?.data?.data?.video;
        setVideo(videoData);
        setLikeCount(res?.data?.data?.likeCount || 0);
        setHasLiked(res?.data?.data?.hasLiked || false);
        setEditedTitle(videoData?.title);
        setEditedDescription(videoData?.description);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 498) {
          navigate("/");
        } else {
          navigate("/feed");
        }
      });
  };

  const loadMoreComments = () => {
    setLoadingComments(true);
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE
        }/comments/video/${videoId}?page=${commentPage + 1}`,
        { withCredentials: true }
      )
      .then((res) => {
        setCommentPage((prevPage) => prevPage + 1);
        setComments([...comments, ...res.data.data.comments]);
        setHasMoreComments(res.data.data.hasMore);
        setLoadingComments(false);
      })
      .catch((err) => {
        if (err.response?.status === 498) {
          navigate("/");
        }
        console.log(err);
      });
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/comments/c/${commentId}`,
        { withCredentials: true }
      )
      .then(() => {
        setComments(comments.filter((comment) => comment._id !== commentId));
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 498) {
          navigate("/");
        }
      });
  };

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      if (!editedTitle.trim()) return;

      axios
        .patch(
          `${import.meta.env.VITE_REACT_APP_API_BASE}/videos/${videoId}`,
          { title: editedTitle, description: editedDescription },
          { withCredentials: true }
        )
        .then(() => {
          setIsEditing(false);
          fetchVideoData();
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status === 498) {
            navigate("/");
          }
        });
    }
  };
  const handleLike = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE
        }/likes/toggle/video/${videoId}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        setHasLiked(!hasLiked);
        setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 498) {
          navigate("/");
        }
      });
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/comments/video/${videoId}`,
        { content: newComment },
        { withCredentials: true }
      )
      .then(() => {
        setCommentPage(1);
        setNewComment("");
        loadComments(); // Refresh comments
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 498) {
          navigate("/");
        }
      });
  };

  const loadComments = () => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE
        }/comments/video/${videoId}?page=1`,
        { withCredentials: true }
      )
      .then((res) => {
        setComments(res?.data?.data?.comments);
        setHasMoreComments(res?.data?.data?.hasMore);
      })
      .catch((err) => {
        if (err.response?.status === 498) {
          navigate("/");
        }
        console.log(err);
      });
  };

  const toggleComments = () => {
    if (!showComments && comments.length === 0) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  if (!video) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="w-full bg-black">
        <video
          src={video.videoFile}
          controls
          autoPlay
          controlsList="nodownload"
          className="w-full h-auto max-h-[80vh] object-contain mx-auto"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="max-w mx-auto px-4 py-6">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 mb-6">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              {isEditing ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full mb-3 px-4 py-3 bg-gray-700 text-white border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows="3"
                  />
                </div>
              ) : (
                <div className="w-full">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {video.title}
                  </h1>
                  <p className="text-gray-300">{video.description}</p>
                </div>
              )}

              {isOwner && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-gray-700"
                  >
                    <FaPen size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center">
                <Link to={`/profile/${video.owner.username}`}>
                  <img
                    src={video.owner.avatar}
                    alt={video.owner.username}
                    className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-purple-500"
                  />
                </Link>
                <div>
                  <Link to={`/profile/${video.owner.username}`}>
                    <p className="text-white font-medium">
                      {video.owner.username}
                    </p>
                  </Link>
                  <p className="text-gray-400 text-sm">
                    {formatDistanceToNow(new Date(video.createdAt))} ago
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center text-gray-400">
                  <FaEye className="mr-2" />
                  <span>{video.views} views</span>
                </div>

                <button
                  onClick={handleLike}
                  className={`flex items-center px-3 py-1 rounded-full ${
                    hasLiked
                      ? "text-purple-400 bg-purple-500/10"
                      : "text-gray-400 hover:text-purple-300 hover:bg-gray-700"
                  } transition-colors`}
                >
                  {hasLiked ? (
                    <FaHeart className="mr-2" />
                  ) : (
                    <FaRegHeart className="mr-2" />
                  )}
                  <span>{likeCount}</span>
                </button>

                <button
                  onClick={toggleComments}
                  className={`flex items-center px-3 py-1 rounded-full ${
                    showComments
                      ? "text-purple-400 bg-purple-500/10"
                      : "text-gray-400 hover:text-purple-300 hover:bg-gray-700"
                  } transition-colors`}
                >
                  {showComments ? (
                    <FaComment className="mr-2" />
                  ) : (
                    <FaRegComment className="mr-2" />
                  )}
                  <span>Comments</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
            <div className="p-6">
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className={`px-4 py-2 rounded-r-lg font-medium ${
                    newComment.trim()
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  } transition-colors`}
                >
                  Post
                </button>
              </div>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No comments yet
                  </p>
                ) : (
                  <>
                    {comments.map((comment) => (
                      <CommentCard
                        key={comment._id}
                        comment={comment}
                        handleDeleteComment={handleDeleteComment}
                      />
                    ))}
                    {hasMoreComments && (
                      <div className="text-center mt-4">
                        <button
                          onClick={loadMoreComments}
                          disabled={loadingComments}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                        >
                          {loadingComments ? "Loading..." : "Load More"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
