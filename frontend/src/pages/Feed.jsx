import React, { useState } from "react";
import Navbar from "../components/Feed/Navbar";
import FeedOptions from "../components/Feed/FeedOptions";

function Feed() {
  const [activeTab, setActiveTab] = useState("tweets");
  return (
    <>
      <Navbar />
      <FeedOptions activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

export default Feed;
