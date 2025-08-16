import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "./VideoCard";
import { useNavigate } from "react-router-dom";
function VideoFeed() {
  let navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  useEffect(() => {
    if (videos.length === 0) {
      axios
        .get(`${import.meta.env.VITE_REACT_APP_API_BASE}/videos?page=${page}`, {
          withCredentials: true,
        })
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
    }
  }, []);

  function loadMoreVideos() {
    if (!loadingVideos && hasMoreVideos) {
      setLoadingVideos(true);
      axios
        .get(
          `${import.meta.env.VITE_REACT_APP_API_BASE}/videos?page=${page + 1}`,
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
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
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
export default VideoFeed;
