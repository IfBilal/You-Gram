import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

function CommentCard({ comment, handleDeleteComment }) {
  const [hasLiked, setHasLiked] = useState(comment?.hasLiked || false);
  const [likeCount, setLikeCount] = useState(comment?.likeCount || 0);
  const { user } = useAuth();
  // const userId = user?._id;
  const userId = "6883ab5a62359ad5baaf8849";
  const isOwner = comment?.owner === userId;

  const handleLike = () => {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/likes/toggle/comment/${
          comment._id
        }`
      )
      .then((res) => {
        setHasLiked(!hasLiked);
        setLikeCount((prev) => (hasLiked ? prev - 1 : prev + 1));
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!comment) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3 shadow-lg">
      <div className="flex items-start">
        <img
          src={comment.ownerAvatar}
          alt={comment.ownerUsername}
          className="w-8 h-8 rounded-full mr-3 object-cover border border-purple-500 hover:border-purple-300 transition-colors cursor-pointer"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-gray-400 text-xs hover:text-purple-300 transition-colors cursor-pointer">
                @{comment.ownerUsername}
              </span>
              <span className="text-gray-500 text-xs ml-2">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
            </div>

            {isOwner && (
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Delete comment"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z" />
                </svg>
              </button>
            )}
          </div>

          <div className="mb-3 text-gray-200 text-sm leading-relaxed">
            {comment.content}
          </div>

          <div className="flex items-center">
            <button
              onClick={handleLike}
              className={`flex items-center mr-4 ${
                hasLiked
                  ? "text-purple-400"
                  : "text-gray-400 hover:text-purple-300"
              } transition-colors`}
              title={hasLiked ? "Unlike" : "Like"}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={hasLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                className="mr-1"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="text-xs">{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
