import mongoose, { isValidObjectId } from "mongoose";
import { Image } from "../models/image.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PAGINATION_LIMIT as limit } from "../constants.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";

const createImage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { description } = req.body;
  const imagePath = req.file?.path;
  if (!userId || !description || !imagePath)
    throw new ApiError(400, "All fields are required");
  try {
    console.log(imagePath);
    let image = await uploadOnCloudinary(imagePath);
    if (!image) {
      throw new ApiError(500, "Error uploading on cloudinary");
    }
    let imagePost = await Image.create({
      description: description,
      owner: userId,
      imageFile: image.url,
      imagePublicId: image.public_id,
    });
    if (!imagePost) {
      throw new ApiError(500, "Error creating image post");
    }
    res.status(200).json(new ApiResponse(200, imagePost, "Post created"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Something went wrong ${error}`);
  }
});

const getUserImage = asyncHandler(async (req, res) => {
  let userID = req.params?.userId;
  if (!userID) {
    throw new ApiError(400, "User id not provided");
  }
  if (!isValidObjectId(userID)) {
    throw new ApiError(400, "Invalid user id");
  }
  let page = parseInt(req.query.page) || 1;
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  let skip = (page - 1) * limit;
  let images;
  try {
    let user = await User.findById(userID);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    images = await Image.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userID),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "image",
          as: "imageLikes",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "imageOwner",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$imageLikes" },
          owner: { $first: "$imageOwner" },
          hasLiked: {
            $in: [
              new mongoose.Types.ObjectId(req.user._id),
              "$imageLikes.likedBy",
            ],
          },
        },
      },
      { $unset: "owner.password" },
      {
        $project: {
          imageLikes: 0,
          imageOwner: 0,
        },
      },
    ]);

    let hasMore = images.length === limit;
    res
      .status(200)
      .json(new ApiResponse(200, { images, hasMore }, "User images posts"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

const getFeedImages = asyncHandler(async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  let skip = (page - 1) * limit;
  try {
    let images = await Image.aggregate([
      {
        $match: {},
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "image",
          as: "imageLikes",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "imageOwner",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$imageLikes" },
          owner: { $first: "$imageOwner" },
          hasLiked: {
            $in: [
              new mongoose.Types.ObjectId(req.user._id),
              "$imageLikes.likedBy",
            ],
          },
        },
      },
      { $unset: "owner.password" },
      {
        $project: {
          imageLikes: 0,
          imageOwner: 0,
        },
      },
    ]);
    let hasMore = images.length === limit;
    res
      .status(200)
      .json(new ApiResponse(200, { images, hasMore }, "User images posts"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

const updateImage = asyncHandler(async (req, res) => {
  let imageId = req.params?.imageId;
  if (!imageId) {
    throw new ApiError(400, "Image id not provided");
  }
  let userID = req.user._id;
  if (!userID) {
    throw new ApiError(400, "User id not provided");
  }
  let description = req.body.description;
  if (!description) {
    throw new ApiError(400, "description not provided");
  }
  try {
    let updatedImage = await Image.findOneAndUpdate(
      { _id: imageId, owner: userID },
      { description },
      { new: true }
    );
    if (!updatedImage) {
      throw new ApiError(404, "Image not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, updatedImage, "Image updated successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

const deleteImage = asyncHandler(async (req, res) => {
  let imageId = req.params?.imageId;
  if (!imageId) {
    throw new ApiError(400, "Image id not provided");
  }
  if (!isValidObjectId(imageId)) {
    throw new ApiError(400, "Invalid image id");
  }
  let userID = req.user._id;
  if (!userID) {
    throw new ApiError(400, "User id not provided");
  }
  try {
    let deletedImage = await Image.findOneAndDelete({
      _id: imageId,
      owner: userID,
    });
    if (!deletedImage) {
      throw new ApiError(404, "Image not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, deletedImage, "Image deleted successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

export { createImage, getUserImage, getFeedImages, updateImage, deleteImage };
