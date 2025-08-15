import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
function Navbar() {
  let { user } = useAuth();
  let navigate = useNavigate();
  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link
            to={"/settings"}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors text-purple-400 text-xl"
          >
            ⚙️
          </Link>
        </div>
        <div className="text-2xl font-bold text-purple-400">YouGram</div>
        <Link
          to={`/profile/${user?._id}`}
          className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <span className="text-lg">👤</span>
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
