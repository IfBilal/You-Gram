import React, { useEffect, useState } from "react";
import axios from "axios";
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
      {images.map((image) => (
        <ImageCard key={image._id} image={image} handleDelete={handleDelete} />
      ))}
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
