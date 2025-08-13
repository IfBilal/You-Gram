import { Router } from "express";
import {
  createImage,
  getUserImage,
  getFeedImages,
  updateImage,
  deleteImage,
} from "../controllers/image.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImages } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(getFeedImages)
  .post(uploadImages.single("image"), createImage);
router.route("/user/:userId").get(getUserImage);
router.route("/:imageId").patch(updateImage).delete(deleteImage);

export default router;
