import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageCard from "./ImageCard";
import { FaPlus, FaTimes, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ImageFeed() {
  let navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  useEffect(() => {
    if (images.length === 0) {
      axios
        .get(`${import.meta.env.VITE_REACT_APP_API_BASE}/images?page=${page}`, {
          withCredentials: true,
        })
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
    }
  }, []);

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
          `${import.meta.env.VITE_REACT_APP_API_BASE}/images?page=${page + 1}`,
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
  function toggleUploadForm() {
    setNewDescription("");
    setImageFile(null);
    setShowUploadForm(!showUploadForm);
  }
  function handleUploadImage() {
    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("description", newDescription);
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE}/images`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        setPage(1);
        setImageUploadLoading(false);
        setShowUploadForm(false);
        axios
          .get(`${import.meta.env.VITE_REACT_APP_API_BASE}/images?page=${1}`, {
            withCredentials: true,
          })
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
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 498) {
          navigate("/");
        }
        setImageUploadLoading(false);
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
              Upload an Image
            </>
          )}
        </button>
      </div>

      {showUploadForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-4">Upload a New Image</h3>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Choose Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (
                  e.target.files[0].type !== "image/jpeg" &&
                  e.target.files[0].type !== "image/png"
                ) {
                  alert("Only image files are allowed!");
                  e.target.value = "";
                  return;
                }
                setImageFile(e.target.files[0]);
              }}
              className="block w-full text-gray-300 border border-gray-600 rounded-lg bg-gray-700 focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Write a description for your image..."
              rows="3"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              maxLength="500"
            />
            <span
              className={`text-sm ${
                newDescription.length > 450 ? "text-red-400" : "text-gray-400"
              }`}
            >
              {newDescription.length}/500 characters
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
              onClick={handleUploadImage}
              disabled={
                !imageFile || !newDescription.trim() || imageUploadLoading
              }
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                imageFile && newDescription.trim() && !imageUploadLoading
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {imageUploadLoading ? (
                "Uploading..."
              ) : (
                <>
                  <FaImage className="mr-2" />
                  Post Image
                </>
              )}
            </button>
          </div>
        </div>
      )}
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

export default ImageFeed;
