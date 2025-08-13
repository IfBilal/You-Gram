import { Router } from "express";
import {
  deleteVideo,
  getUserVideos,
  getVideoById,
  publishAVideo,
  updateVideo,
  getFeedVideos,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImageAndVideo } from "../middlewares/multer.middleware.js";
import { uploadImages } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getFeedVideos)
  .post(
    uploadImageAndVideo.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router.route("/user/:userId").get(getUserVideos);

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(uploadImages.single("thumbnail"), updateVideo);

export default router;
