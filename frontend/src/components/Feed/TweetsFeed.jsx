import React, { useEffect, useState } from "react";
import axios from "axios";
import TweetCard from "./TweetCard";
import { FaPlus, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function TweetsFeed() {
  let navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTweetContent, setNewTweetContent] = useState("");
  const [NewTweetLoading, setNewTweetLoading] = useState(false);
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
  function toggleUploadForm() {
    setShowUploadForm(!showUploadForm);
    setNewTweetContent("");
  }
  function handleUploadTweet() {
    setNewTweetLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/tweets`,
        { content: newTweetContent },
        { withCredentials: true }
      )
      .then((res) => {
        setPage(1);
        setNewTweetLoading(false);
        setNewTweetContent("");
        setShowUploadForm(false);
        axios
          .get(
            `${import.meta.env.VITE_REACT_APP_API_BASE}/tweets?page=${1}`,
            {
              withCredentials: true,
            }
          )
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
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 498) {
          navigate("/");
        }
      });
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={toggleUploadForm}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            showUploadForm
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {showUploadForm ? (
            <>
              <FaTimes className="mr-2" />
              Cancel
            </>
          ) : (
            <>
              <FaPlus className="mr-2" />
              Upload a Tweet
            </>
          )}
        </button>
      </div>

      {showUploadForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-4">Create a New Tweet</h3>
          <textarea
            value={newTweetContent}
            onChange={(e) => setNewTweetContent(e.target.value)}
            placeholder="What's on your mind?"
            rows="4"
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            maxLength="280"
          />
          <div className="flex justify-between items-center mt-4">
            <span
              className={`text-sm ${
                newTweetContent.length > 250 ? "text-red-400" : "text-gray-400"
              }`}
            >
              {newTweetContent.length}/280 characters
            </span>
            <div className="flex space-x-3">
              <button
                onClick={toggleUploadForm}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadTweet}
                disabled={!newTweetContent.trim() || NewTweetLoading}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  newTweetContent.trim() && !NewTweetLoading
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {NewTweetLoading ? (
                  "Posting..."
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Post Tweet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
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
