import { Router } from "express";
import {
  changePassword,
  getUserChannelProfile,
  getWatchHistory,
  logoutUser,
  registerUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controllers.js";
import { uploadImages } from "../middlewares/multer.middleware.js";
import { loginUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
let router = Router();

router.route("/register").post(
  uploadImages.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/watch-history/:username").get(verifyJWT, getWatchHistory);
router.route("/:username").get(verifyJWT, getUserChannelProfile);
router
  .route("/updateCover")
  .patch(uploadImages.single("updatedCoverImage"), verifyJWT, updateCoverImage);
router
  .route("/updateAvatar")
  .patch(uploadImages.single("updatedAvatar"), verifyJWT, updateAvatar);
router.route("/updateAccount").patch(verifyJWT, updateAccountDetails);
router.route("/changePassword").patch(verifyJWT, changePassword);
export default router;
