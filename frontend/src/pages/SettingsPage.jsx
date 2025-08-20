import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function UserSettingsPage() {
  const [activeSection, setActiveSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [accountInfo, setAccountInfo] = useState({
    fullname: "",
    username: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const { user, setUser, logout } = useAuth();

  const buttons = [
    {
      id: "logout",
      label: "Logout",
      icon: "🚪",
      color: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
    },
    {
      id: "avatar",
      label: "Change Avatar",
      icon: "👤",
      color:
        "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
    },
    {
      id: "cover",
      label: "Change Cover Image",
      icon: "🖼️",
      color: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    },
    {
      id: "account",
      label: "Change Account Info",
      icon: "✏️",
      color:
        "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
    },
    {
      id: "password",
      label: "Change Password",
      icon: "🔒",
      color:
        "from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800",
    },
    {
      id: "history",
      label: "Watch History",
      icon: "📺",
      color:
        "from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800",
    },
  ];

  const handleButtonClick = async (buttonId) => {
    if (buttonId === "logout") {
      axios
        .post(
          `${import.meta.env.VITE_REACT_APP_API_BASE}/users/logout`,
          {},
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res);
          navigate("/");
          logout();
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 498) {
            navigate("/");
          }
        });
      return;
    }

    if (buttonId === "history") {
      setLoading(true);
      axios
        .get(
          `${import.meta.env.VITE_REACT_APP_API_BASE}/users/watch-history/${
            user.username
          }`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setWatchHistory(res.data.data);
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

    setActiveSection(activeSection === buttonId ? "" : buttonId);
  };

  const handleAvatarSubmit = async () => {
    if (!avatarFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("updatedAvatar", avatarFile);

    axios
      .patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/users/updateAvatar`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((res) => {
        alert("Avatar updated successfully!");
        console.log(res);

        setAvatarFile(null);
        setActiveSection("");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 498) {
          navigate("/");
        }
        setLoading(false);
      });
  };

  const handleCoverSubmit = async () => {
    if (!coverFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("updatedCoverImage", coverFile);

    axios
      .patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/users/updateCover`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((res) => {
        alert("Cover Image updated successfully!");
        console.log(res);

        setCoverFile(null);
        setActiveSection("");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 498) {
          navigate("/");
        }
        setLoading(false);
      });
  };

  const handleAccountSubmit = async () => {
    setLoading(true);
    axios
      .patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/users/updateAccount`,
        accountInfo,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        alert("Account details updated successfully!");
        console.log(res);
        setUser(res.data.data);
        setActiveSection("");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 410) {
          alert("User with same username or email already exists!");
        }
        if (err.response?.status === 498) {
          navigate("/");
        }
        setLoading(false);
      });
  };

  const handlePasswordSubmit = async () => {
    setLoading(true);
    axios
      .patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE}/users/changePassword`,
        passwordData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        alert("Password updated successfully!");
        console.log(res);
        setActiveSection("");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 410) {
          alert("Incorrect old password!");
        }
        if (err.response?.status === 498) {
          navigate("/");
        }
        setLoading(false);
      });
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "avatar":
        return (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="text-purple-400 mr-3 text-2xl">👤</span>
              Change Avatar
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Select New Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setAvatarFile(e.target.files[0]);
                  }}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-colors"
                />
                {avatarFile && (
                  <p className="text-sm text-gray-400 mt-2">
                    Selected: {avatarFile.name}
                  </p>
                )}
              </div>
              <button
                onClick={handleAvatarSubmit}
                disabled={!avatarFile || loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed"
              >
                {loading ? "Uploading..." : "Update Avatar"}
              </button>
            </div>
          </div>
        );

      case "cover":
        return (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="text-blue-400 mr-3 text-2xl">🖼️</span>
              Change Cover Image
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Select New Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files[0])}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors"
                />
                {coverFile && (
                  <p className="text-sm text-gray-400 mt-2">
                    Selected: {coverFile.name}
                  </p>
                )}
              </div>
              <button
                onClick={handleCoverSubmit}
                disabled={!coverFile || loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed"
              >
                {loading ? "Uploading..." : "Update Cover Image"}
              </button>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="text-green-400 mr-3 text-2xl">✏️</span>
              Change Account Info
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  value={accountInfo.fullname}
                  onChange={(e) =>
                    setAccountInfo({ ...accountInfo, fullname: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={accountInfo.username}
                  onChange={(e) =>
                    setAccountInfo({ ...accountInfo, username: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Email
                </label>
                <input
                  type="text"
                  value={accountInfo.email}
                  onChange={(e) =>
                    setAccountInfo({ ...accountInfo, email: e.target.value })
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={handleAccountSubmit}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Account Info"}
              </button>
            </div>
          </div>
        );

      case "password":
        return (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="text-orange-400 mr-3 text-2xl">🔒</span>
              Change Password
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-gray-300 mb-2 font-medium">
                  Current Password
                </label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-11 text-gray-400 hover:text-white transition-colors text-lg"
                >
                  {showCurrentPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 font-medium">
                  New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-11 text-gray-400 hover:text-white transition-colors text-lg"
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button
                onClick={handlePasswordSubmit}
                disabled={
                  loading ||
                  !passwordData.currentPassword ||
                  !passwordData.newPassword
                }
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        );

      case "history":
        return (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="text-indigo-400 mr-3 text-2xl">📺</span>
              Watch History
            </h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
              </div>
            ) : watchHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📺</div>
                <p className="text-gray-400 text-lg">No watch history found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Your watched videos will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {watchHistory.map((video) => (
                  <div
                    key={video._id}
                    className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="flex space-x-4">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-32 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-600"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.3em' fill='%23ffffff' font-size='18'%3E📹%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                          {video.title}
                        </h4>
                        <div className="flex items-center space-x-3">
                          <img
                            src={video.owner.avatar}
                            alt={video.owner.fullname}
                            className="w-8 h-8 rounded-full object-cover bg-gray-600"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.3em' fill='%23ffffff' font-size='16'%3E👤%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <div>
                            <p className="text-gray-300 font-medium">
                              {video.owner.fullname}
                            </p>
                            <p className="text-gray-500 text-sm">
                              @{video.owner.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text">
            Account Settings
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {buttons.map((button) => {
            return (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                className={`group relative p-6 bg-gradient-to-r ${button.color} text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl">{button.icon}</span>
                  <span className="text-lg">{button.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {activeSection && (
          <div className="transition-all duration-300 ease-in-out animate-fadeIn">
            {renderActiveSection()}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default UserSettingsPage;
