import React, { useEffect, useState } from "react";
import axios from "axios";
import TweetCard from "./TweetCard";
function TweetsFeed() {
  const [tweets, setTweets] = useState([]);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (tweets.length === 0) {
      axios
        .get(`${import.meta.env.VITE_REACT_APP_API_BASE}/tweets?page=${page}`, {
          withCredentials: true,
        })
        .then((res) => {
          setTweets(res.data?.data?.tweets);
          setHasMoreTweets(res.data?.data?.hasMore);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 498) {
            navigate("/");
          }
        });
    }
  }, []);
  function handleDelete(tweetId) {
    axios
      .delete(`${import.meta.env.VITE_REACT_APP_API_BASE}/tweets/${tweetId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setTweets(tweets.filter((tweet) => tweet._id !== tweetId));
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 498) {
          navigate("/");
        }
      });
  }
  function loadMoreTweets() {
    if (!loading && hasMoreTweets) {
      setLoading(true);
      axios
        .get(
          `${import.meta.env.VITE_REACT_APP_API_BASE}/tweets?page=${page + 1}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setTweets((prevTweets) => [...prevTweets, ...res.data.data.tweets]);
          setHasMoreTweets(res.data.data.hasMore);
          setPage((prevPage) => prevPage + 1);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 498) {
            navigate("/");
          }
          setLoading(false);
        });
    }
  }
  return (
    <div>
      {tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} handleDelete={handleDelete} />
      ))}
      {hasMoreTweets && (
        <div className="text-center mt-4">
          <button
            onClick={loadMoreTweets}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? "Loading..." : "Load More Tweets"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TweetsFeed;
