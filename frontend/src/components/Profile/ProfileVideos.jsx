import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPhotoVideo } from "react-icons/fa";
import VideoCard from "../Feed/VideoCard";
import { useNavigate } from "react-router-dom";
function ProfileVideos({ userId }) {
  let navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE
        }/videos/user/${userId}?page=${page}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setVideos(res.data?.data?.videos);
        setHasMoreVideos(res.data?.data?.hasMore);
      })
      .catch((err) => {
        console.log(err);
        if (err.respone.status === 498) {
          navigate("/");
        }
      });
  }, [userId]);

  function handleDelete(videoId) {
    axios
      .delete(`${import.meta.env.VITE_REACT_APP_API_BASE}/videos/${videoId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setVideos(videos.filter((video) => video._id !== videoId));
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 498) {
          navigate("/");
        }
      });
  }

  function loadMoreVideos() {
    if (!loadingVideos && hasMoreVideos) {
      setLoadingVideos(true);
      axios
        .get(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE
          }/videos/user/${userId}?page=${page + 1}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setLoadingVideos(false);
          setVideos((prevVideos) => [
            ...prevVideos,
            ...res?.data?.data?.videos,
          ]);
          setHasMoreVideos(res?.data?.data?.hasMore);
          setPage((prevPage) => prevPage + 1);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 498) {
            navigate("/");
          }
        });
    }
  }

  return (
    <div>
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 text-center border border-gray-700 shadow-2xl max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-purple-700/20 rounded-full flex items-center justify-center border border-purple-500/30">
              <FaPhotoVideo className="text-purple-400 text-3xl" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text ">
              No Videos Found
            </h1>

            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              This user hasn't shared any Videos yet. Check back later for
              visual content!
            </p>

            <div className="flex justify-center space-x-2 opacity-60">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        videos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            handleDelete={handleDelete}
          />
        ))
      )}
      {hasMoreVideos && (
        <div className="text-center mt-4">
          <button
            onClick={loadMoreVideos}
            disabled={loadingVideos}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loadingVideos ? "Loading..." : "Load More Images"}
          </button>
        </div>
      )}
    </div>
  );
}
export default ProfileVideos;
