import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPhotoVideo } from "react-icons/fa";
import ImageCard from "../Feed/ImageCard";
import { useNavigate } from "react-router-dom";

function ProfileImages({ userId }) {
  let navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE
        }/images/user/${userId}?page=${1}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setImages(res.data?.data?.images);
        setHasMoreImages(res.data?.data?.hasMore);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 498) {
          navigate("/");
        }
      });
  }, [userId]);

  function handleDelete(imageId) {
    axios
      .delete(`${import.meta.env.VITE_REACT_APP_API_BASE}/images/${imageId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setImages(images.filter((image) => image._id !== imageId));
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 498) {
          navigate("/");
        }
      });
  }

  function loadMoreImages() {
    if (!loading && hasMoreImages) {
      setLoading(true);
      axios
        .get(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE
          }/images/user/${userId}?page=${page + 1}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setImages((prevImages) => [...prevImages, ...res.data.data.images]);
          setHasMoreImages(res.data.data.hasMore);
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
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 text-center border border-gray-700 shadow-2xl max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-purple-700/20 rounded-full flex items-center justify-center border border-purple-500/30">
              <FaPhotoVideo className="text-purple-400 text-3xl" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text">
              No Images Found
            </h1>

            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              This user hasn't shared any images yet. Check back later for
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
        images.map((image) => (
          <ImageCard
            key={image._id}
            image={image}
            handleDelete={handleDelete}
          />
        ))
      )}
      {hasMoreImages && (
        <div className="text-center mt-4">
          <button
            onClick={loadMoreImages}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? "Loading..." : "Load More Images"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileImages;
