import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { PAGINATION_LIMIT as limit } from "../constants.js";
import { Like } from "../models/like.models.js";

const getUserVideos = asyncHandler(async (req, res) => {
  let { page = 1 } = req.query;
  page = parseInt(page);
  if (isNaN(page) || page < 1) page = 1;
  let userId = req.params?.userId;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }
  const skip = (page - 1) * limit;
  try {
    let user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User with given id not found");
    }
    const videos = await Video.find({ owner: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "username avatar")
      .lean();

    const hasMore = videos.length === limit;
    res
      .status(200)
      .json(new ApiResponse(200, { videos, hasMore }, "Videos by the user"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

const getFeedVideos = asyncHandler(async (req, res) => {
  let { page = 1 } = req.query;
  page = parseInt(page);
  if (isNaN(page) || page < 1) page = 1;
  const skip = (page - 1) * limit;
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "username avatar")
      .lean();
    const hasMore = videos.length === limit;
    res
      .status(200)
      .json(new ApiResponse(200, { videos, hasMore }, "Videos for the feed"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "All fields are required");
  }
  let videoPath = req.files?.videoFile?.[0].path;
  let thumbnailPath = req.files?.thumbnail?.[0].path;
  if (!videoPath || !thumbnailPath) {
    throw new ApiError(400, "Both video and thumbnail are required");
  }
  let videoRes = await uploadOnCloudinary(videoPath);
  let thumbRes = await uploadOnCloudinary(thumbnailPath);
  if (!videoRes || !thumbRes)
    throw new ApiError(400, "Error uploading on cloudinary");
  if (!videoRes?.url || !thumbRes?.url) {
    throw new ApiError(400, "Upload failed");
  }
  try {
    let video = await Video.create({
      title: title,
      videoFile: videoRes.url,
      thumbnail: thumbRes.url,
      description: description,
      owner: req.user._id,
      thumbnailPublicId: thumbRes.public_id,
      videoPublicId: videoRes.public_id,
    });
    res.status(200).send(new ApiResponse(200, video, "Video created"));
  } catch (error) {
    if (videoRes) await deleteFromCloudinary(videoRes.public_id);
    if (thumbRes) await deleteFromCloudinary(thumbRes.public_id);
    throw new ApiError(500, "Error creating video");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");
  try {
    let video = await Video.findById(videoId).populate(
      "owner",
      "username avatar"
    );
    if (!video) throw new ApiError(404, "Video with given id not found");
    video.views += 1;
    await video.save();
    let hasLiked = await Like.findOne({
      video: videoId,
      likedBy: req.user._id,
    });
    if (!hasLiked) hasLiked = false;
    else hasLiked = true;
    let user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { watchHistory: video._id } },
      { new: true }
    );
    let likeCount = await Like.countDocuments({ video: videoId });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { video, likeCount, hasLiked },
          "Video with given id"
        )
      );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");
  let { title, description } = req.body;
  if (!title || !description)
    throw new ApiError(400, "All fields are required");

  try {
    let video = await Video.findOne({ _id: videoId, owner: req.user._id });
    if (!video) throw new ApiError(404, "Video not found");
    video.title = title;
    video.description = description;
    await video.save();
    res.status(200).json(new ApiResponse(200, video, "Video updated"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");
  try {
    let video = await Video.findOneAndDelete({
      _id: videoId,
      owner: req.user._id,
    });
    if (!video) throw new ApiError(404, "Video with given id not found");
    if (video.videoPublicId) await deleteFromCloudinary(video.videoPublicId);
    if (video.thumbnailPublicId)
      await deleteFromCloudinary(video.thumbnailPublicId);
    res.status(200).json(new ApiResponse(200, video, "Video Deleted"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error in deleting video");
  }
});

export {
  getUserVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  getFeedVideos,
};
