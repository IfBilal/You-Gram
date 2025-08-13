import React, { useState, useRef } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_API_BASE;

function RegisterForm() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const responseRef = useRef(null);
  function setImage(e, imageType) {
    if (
      e.target.files[0].type !== "image/jpeg" &&
      e.target.files[0].type !== "image/png"
    ) {
      responseRef.current.textContent = "Only image files are allowed!";
      responseRef.current.className = "text-red-600 font-semibold text-center";
      e.target.value = "";
      return;
    }
    if (imageType === "avatar") {
      setAvatar(e.target.files[0]);
    } else {
      setCoverImage(e.target.files[0]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !fullname ||
      !username ||
      !email ||
      !password ||
      !avatar ||
      !coverImage
    ) {
      responseRef.current.textContent = "All fields are required!";
      responseRef.current.className = "text-red-600 font-semibold text-center";
      return;
    }

    let formData = new FormData();
    formData.append("username", username);
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("coverImage", coverImage);
    setLoading(true);
    axios
      .post(`${apiUrl}/users/register`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        responseRef.current.textContent = "User Created Successfully!";
        responseRef.current.className =
          "text-green-600 font-semibold text-center";
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          responseRef.current.textContent = "User already exists";
          responseRef.current.className =
            "text-red-600 font-semibold text-center";
        } else {
          responseRef.current.textContent = "Something went wrong!";
          responseRef.current.className =
            "text-red-600 font-semibold text-center";
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form className="max-w-md mx-auto mt-10 bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl text-purple-400 font-bold mb-6 text-center">
        Register
      </h2>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Full Name</label>
        <input
          type="text"
          name="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Avatar (image)</label>
        <input
          type="file"
          name="avatar"
          accept="image/jpeg, image/png"
          required
          onChange={(e) => setImage(e, "avatar")}
          className="w-full text-gray-400"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 mb-1">Cover Image (image)</label>
        <input
          type="file"
          name="coverImage"
          accept="image/jpeg, image/png"
          required
          onChange={(e) => setImage(e, "coverImage")}
          className="w-full text-gray-400"
        />
      </div>
      <p className="hidden" ref={responseRef}></p>
      <button
        type="submit"
        disabled={loading}
        className={`w-full ${
          loading
            ? "bg-purple-950 cursor-not-allowed"
            : "bg-purple-800  hover:bg-purple-900"
        } text-white font-semibold py-2 px-4 rounded transition`}
        onClick={(e) => handleSubmit(e)}
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}

export default RegisterForm;
