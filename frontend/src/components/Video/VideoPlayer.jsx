import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function VideoPlayer() {
  let navigate = useNavigate();
  let { videoId } = useParams();
  let [video, setVideo] = useState(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE}/videos/${videoId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setVideo(res?.data?.data?.video);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 498) {
          navigate("/");
        } else {
          navigate("/feed");
        }
      });
  }, []);
  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <video
        src={video?.videoFile}
        controls
        autoPlay
        controlsList="nodownload"
        className="w-full h-auto max-h-[600px] object-contain"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;
