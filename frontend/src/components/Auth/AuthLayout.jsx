import React from "react";
import { Link } from "react-router-dom";

function AuthLayout({ children, buttonLabel, buttonLink }) {
  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white relative">
      {
        <Link
          to={buttonLink}
          className="absolute top-6 right-6 bg-white text-purple-700 px-4 py-2 rounded font-semibold shadow-md hover:bg-gray-200 transition"
        >
          {buttonLabel}
        </Link>
      }

      <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-10">
        <h1 className="text-6xl font-bold text-purple-400 mb-4">Yougram</h1>
        <p className="text-lg text-gray-300">Connect. Share. Inspire.</p>
      </div>

      <div className="flex justify-center items-center w-full md:w-1/2 p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
