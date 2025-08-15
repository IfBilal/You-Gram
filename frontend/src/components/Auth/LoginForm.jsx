import React, { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_REACT_APP_API_BASE;
function LoginForm() {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const responseRef = useRef(null);
  let navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      responseRef.current.textContent = "All fields are required!";
      responseRef.current.className = "text-red-600 font-semibold text-center";
      return;
    }
    setLoading(true);
    axios
      .post(
        `${apiUrl}/users/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setUser(res?.data?.data?.user);
        console.log(res.data?.data?.user);

        responseRef.current.textContent = "Logged in successfully";
        responseRef.current.className =
          "text-green-600 font-semibold text-center";
        navigate("/feed");
      })
      .catch((err) => {
        responseRef.current.textContent = err.response.data.message;
        responseRef.current.className =
          "text-red-600 font-semibold text-center";
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <form className="max-w-md mx-auto mt-10 bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl text-purple-400 font-bold mb-6 text-center">
        Login
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

      <div className="mb-6">
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

      <p className="hidden" ref={responseRef}></p>

      <button
        type="submit"
        disabled={loading}
        onClick={(e) => handleSubmit(e)}
        className={`w-full ${
          loading
            ? "bg-purple-950 cursor-not-allowed"
            : "bg-purple-800 hover:bg-purple-900"
        } text-white font-semibold py-2 px-4 rounded transition`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;
