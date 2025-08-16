import React, { useEffect, useState } from "react";
import Navbar from "../components/Feed/Navbar";
import FeedOptions from "../components/Feed/FeedOptions";
import TweetsFeed from "../components/Feed/TweetsFeed";
import ImageFeed from "../components/Feed/ImageFeed";
function Feed() {
  const [activeTab, setActiveTab] = useState("tweets");

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar className="sticky top-0 z-10 bg-gray-800 shadow-md" />
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full mt-4 px-4 py-4">
        <div className="w-full mb-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <FeedOptions activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
        <div className="w-full">{activeTab === "tweets" && <TweetsFeed />}</div>
        <div className="w-full">{activeTab === "images" && <ImageFeed />}</div>
      </div>
    </div>
  );
}

export default Feed;
