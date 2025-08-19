import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaUsers, FaUserPlus, FaUserMinus, FaCog } from "react-icons/fa";
import axios from "axios";
import ProfileImages from "./ProfileImages";
import ProfileTweets from "./ProfileTweets";
import ProfileVideos from "./ProfileVideos";
function ProfileHeroSection() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [activeTab, setActiveTab] = useState("tweets");

  const isOwnProfile = user?.username === username;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE}/users/${username}`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserData(res?.data?.data);
        setIsSubscribed(res?.data?.data?.isSubscribed);
        setSubscriberCount(res?.data?.data?.subscriberCount);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 498) {
          navigate("/");
        } else {
          navigate("/feed");
        }
        setLoading(false);
      });
  }, [username, navigate]);

  const handleSubscribe = async () => {
    if (!userData || subscribing) return;

    setSubscribing(true);
    try {
      await axios
        .post(
          `${import.meta.env.VITE_REACT_APP_API_BASE}/subscriptions/c/${
            userData._id
          }`,
          {},
          { withCredentials: true }
        )
        .then((res) => {
          setUserData((prev) => ({
            ...prev,
            isSubscribed: !prev.isSubscribed,
            subscriberCount: prev.isSubscribed
              ? prev.subscribersCount - 1
              : prev.subscribersCount + 1,
          }));
          setIsSubscribed((prev) => !prev);
          setSubscriberCount((prev) => (prev += isSubscribed ? -1 : 1));
          setSubscribing(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status === 498) {
            navigate("/");
          }
          setSubscribing(false);
        });
    } catch (err) {
      console.log(err);
      if (err.response?.status === 498) {
        navigate("/");
      }
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="h-64 md:h-80 bg-gray-700 animate-pulse"></div>

        <div className="relative px-4 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-700 rounded-full border-4 border-gray-800 -mt-16 md:-mt-20 animate-pulse"></div>

              <div className="flex-1 pt-4">
                <div className="h-8 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                <div className="flex space-x-6">
                  <div className="h-5 bg-gray-700 rounded w-24 animate-pulse"></div>
                  <div className="h-5 bg-gray-700 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">User not found</h2>
          <p className="text-gray-400">
            The profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-800">
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={userData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Crect width='1200' height='400' fill='%23374151'/%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="relative px-4 pb-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={userData.avatar}
                alt={userData.fullname}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-800 shadow-xl object-cover -mt-16 md:-mt-20"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.3em' fill='%23ffffff' font-size='80'%3E👤%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <div className="flex-1 pt-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {userData.fullname}
                  </h1>
                  <p className="text-xl text-gray-400 mb-3">
                    @{userData.username}
                  </p>

                  <div className="flex items-center space-x-6 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FaUsers className="text-purple-400" />
                      <span className="font-medium">{subscriberCount}</span>
                      <span className="text-gray-400">
                        {subscriberCount === 1 ? "Subscriber" : "Subscribers"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {userData.subscribedToCount}
                      </span>
                      <span className="text-gray-400">Subscribed</span>
                    </div>
                  </div>
                </div>

                {!isOwnProfile && (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSubscribe}
                      disabled={subscribing}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        userData.isSubscribed
                          ? "bg-gray-600 hover:bg-red-600 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105"
                      }`}
                    >
                      {subscribing ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : isSubscribed ? (
                        <>
                          <FaUserMinus size={16} />
                          <span>Unsubscribe</span>
                        </>
                      ) : (
                        <>
                          <FaUserPlus size={16} />
                          <span>Subscribe</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("tweets")}
              className={`py-4 px-2 border-b-2 ${
                activeTab === "tweets"
                  ? "border-purple-400 text-purple-400"
                  : "border-transparent text-white"
              }  font-medium`}
            >
              Tweets
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`py-4 px-2 border-b-2 ${
                activeTab === "images"
                  ? "border-purple-400 text-purple-400"
                  : "border-transparent text-white"
              }  font-medium`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`py-4 px-2 border-b-2 ${
                activeTab === "videos"
                  ? "border-purple-400 text-purple-400"
                  : "border-transparent text-white"
              }  font-medium`}
            >
              Videos
            </button>
          </div>
        </div>
      </div>
      {activeTab === "tweets" && <ProfileTweets userId={userData._id} />}
      {activeTab === "images" && <ProfileImages userId={userData._id} />}
      {activeTab === "videos" && <ProfileVideos userId={userData._id} />}
    </div>
  );
}

export default ProfileHeroSection;
