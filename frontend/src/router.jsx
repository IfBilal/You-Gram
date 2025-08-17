import "./App.css";
import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
import Feed from "./pages/Feed";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import VideoPlayer from "./components/Video/VideoPlayer";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/video/:videoId" element={<VideoPlayer />} />
    </>
  )
);

export default router;
