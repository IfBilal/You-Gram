import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "./VideoCard";
import { FaPlus, FaTimes, FaVideo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function VideoFeed() {
  let navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUploadLoading, setVideoUploadLoading] = useState(false);
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

  function toggleUploadForm() {
    setTitle("");
    setDescription("");
    setVideoFile(null);
    setThumbnailFile(null);
    setShowUploadForm(!showUploadForm);
  }

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

  function handleUploadVideo() {
    setVideoUploadLoading(true);
    const formData = new FormData();
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnailFile);
    formData.append("title", title);
    formData.append("description", description);

    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE}/videos`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        setPage(1);
        setVideoUploadLoading(false);
        setShowUploadForm(false);
        axios
          .get(`${import.meta.env.VITE_REACT_APP_API_BASE}/videos?page=${1}`, {
            withCredentials: true,
          })
          .then((res) => {
            setVideos(res.data?.data?.videos);
            setHasMoreVideos(res.data?.data?.hasMore);
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
        setVideoUploadLoading(false);
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
              Upload a Video
            </>
          )}
        </button>
      </div>

      {showUploadForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-4">Upload a New Video</h3>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Choose Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (!file.type.startsWith("video/")) {
                    alert("Only video files are allowed!");
                    e.target.value = "";
                    return;
                  }
                  setVideoFile(file);
                }
              }}
              className="block w-full text-gray-300 border border-gray-600 rounded-lg bg-gray-700 focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Choose Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.type !== "image/jpeg" && file.type !== "image/png") {
                    alert(
                      "Only JPEG and PNG image files are allowed for thumbnail!"
                    );
                    e.target.value = "";
                    return;
                  }
                  setThumbnailFile(file);
                }
              }}
              className="block w-full text-gray-300 border border-gray-600 rounded-lg bg-gray-700 focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title..."
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              maxLength="100"
            />
            <span
              className={`text-sm ${
                title.length > 85 ? "text-red-400" : "text-gray-400"
              }`}
            >
              {title.length}/100 characters
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a description for your video..."
              rows="4"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              maxLength="1000"
            />
            <span
              className={`text-sm ${
                description.length > 900 ? "text-red-400" : "text-gray-400"
              }`}
            >
              {description.length}/1000 characters
            </span>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={toggleUploadForm}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadVideo}
              disabled={
                !videoFile ||
                !thumbnailFile ||
                !title.trim() ||
                !description.trim() ||
                videoUploadLoading
              }
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                videoFile &&
                thumbnailFile &&
                title.trim() &&
                description.trim() &&
                !videoUploadLoading
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {videoUploadLoading ? (
                "Uploading..."
              ) : (
                <>
                  <FaVideo className="mr-2" />
                  Post Video
                </>
              )}
            </button>
          </div>
        </div>
      )}
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
