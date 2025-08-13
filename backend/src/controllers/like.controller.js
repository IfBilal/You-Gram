import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.models.js";
import { Video } from "../models/video.models.js";
import { Image } from "../models/image.models.js";
import { Comment } from "../models/comment.models.js";

const toggleLike = asyncHandler(async (req, res) => {
  let { postId, postType } = req.params;
  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid id");
  }
  if (
    postType != "tweet" &&
    postType != "image" &&
    postType != "video" &&
    postType != "comment"
  )
    throw new ApiError(400, "Invalid Post Type");
  let model;
  switch (postType) {
    case "tweet":
      model = Tweet;
      break;
    case "video":
      model = Video;
      break;
    case "image":
      model = Image;
      break;
    case "comment":
      model = Comment;
      break;
  }

  const postExists = await model.findById(postId);
  if (!postExists) {
    throw new ApiError(404, `${postType} not found`);
  }
  let userId = req.user._id;
  try {
    let likeCheck = await Like.findOne({
      [postType]: postId,
      likedBy: userId,
    });
    if (!likeCheck) {
      let likeCreate = await Like.create({
        [postType]: postId,
        likedBy: userId,
      });
      return res.status(200).json(new ApiResponse(200, likeCreate, "Liked"));
    }
    let deletedLike = await Like.findByIdAndDelete(likeCheck._id);
    return res.status(200).json(new ApiResponse(200, deletedLike, "Unliked"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

export { toggleLike };
