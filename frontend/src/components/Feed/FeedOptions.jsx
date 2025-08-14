import React from "react";

function FeedOptions({ activeTab, setActiveTab }) {
  return (
    <div className="flex space-x-1 mb-6 bg-gray-800 p-1 border border-gray-700">
      <button
        onClick={() => setActiveTab("tweets")}
        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all capitalize flex items-center justify-center space-x-2 ${
          activeTab === "tweets"
            ? "bg-purple-600 text-white shadow-lg"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <span>Tweets</span>
      </button>

      <button
        onClick={() => setActiveTab("images")}
        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all capitalize flex items-center justify-center space-x-2 ${
          activeTab === "images"
            ? "bg-purple-600 text-white shadow-lg"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <span>Images</span>
      </button>

      <button
        onClick={() => setActiveTab("videos")}
        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all capitalize flex items-center justify-center space-x-2 ${
          activeTab === "videos"
            ? "bg-purple-600 text-white shadow-lg"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <span>Videos</span>
      </button>
    </div>
  );
}

export default FeedOptions;
