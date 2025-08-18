import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FaPlay, FaEye, FaTrash } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
function VideoCard({ video, handleDelete }) {
  const { user } = useAuth();
  let userId = user?._id;
  let isOwner = video.owner._id === userId;

  return (
    <div className="bg-gray-800 border mb-6 border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:border-purple-500">
      <Link to={`/video/${video._id}`} className="block">
        <div className="relative group">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-110 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-purple-600 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <FaPlay className="text-white text-xl ml-1" />
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center mb-3">
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="w-8 h-8 rounded-full mr-3 object-cover border border-purple-500"
          />
          <div className="flex-1 min-w-0">
            <div className="text-gray-400 text-sm truncate">
              @{video.owner.username}
            </div>
          </div>
          <div className="text-gray-500 text-xs mr-2">
            {formatDistanceToNow(new Date(video.createdAt))} ago
          </div>
          {isOwner && (
            <button
              onClick={() => handleDelete(video._id)}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            >
              <FaTrash size={16} />
            </button>
          )}
        </div>
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 hover:text-purple-300 transition-colors">
          {video.title}
        </h3>

        <div className="flex items-center text-gray-400 text-sm">
          <FaEye className="mr-1" />
          <span>{video.views} views</span>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
