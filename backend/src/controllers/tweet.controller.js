import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PAGINATION_LIMIT as limit } from "../constants.js";
import { User } from "../models/user.models.js";

const createTweet = asyncHandler(async (req, res) => {
  let content = req.body?.content;
  if (!content) {
    throw new ApiError(400, "Content not provided");
  }
  let userID = req.user._id;
  if (!userID) {
    throw new ApiError(400, "User id not provided");
  }
  try {
    let tweet = await Tweet.create({
      content: content,
      owner: userID,
    });
    if (!tweet) {
      throw new ApiError(500, "tweet cant be created");
    }
    res
      .status(201)
      .json(new ApiResponse(201, tweet, "Tweet created successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
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
  try {
    let user = await User.findById(userID);
    if (!user) {
      throw new ApiError(404, "User with given id not found");
    }
    let tweets = await Tweet.aggregate([
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
          foreignField: "tweet",
          as: "tweetLikes",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "tweetOwner",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$tweetLikes" },
          owner: { $first: "$tweetOwner" },
          hasLiked: {
            $in: [
              new mongoose.Types.ObjectId(req.user._id),
              "$tweetLikes.likedBy",
            ],
          },
        },
      },
      { $unset: "owner.password" },
      {
        $project: {
          tweetLikes: 0,
          tweetOwner: 0,
        },
      },
    ]);
    const hasMore = tweets.length === limit;
    res
      .status(200)
      .json(
        new ApiResponse(200, { tweets, hasMore }, "All the tweets by the user")
      );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

const getFeedTweets = asyncHandler(async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  let skip = (page - 1) * limit;
  let tweets = await Tweet.aggregate([
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
        foreignField: "tweet",
        as: "tweetLikes",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "tweetOwner",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$tweetLikes" },
        owner: { $first: "$tweetOwner" },
        hasLiked: {
          $in: [
            new mongoose.Types.ObjectId(req.user._id),
            "$tweetLikes.likedBy",
          ],
        },
      },
    },
    { $unset: "owner.password" },
    {
      $project: {
        tweetLikes: 0,
        tweetOwner: 0,
      },
    },
  ]);
  const hasMore = tweets.length === limit;
  res
    .status(200)
    .json(new ApiResponse(200, { tweets, hasMore }, "All the tweets"));
});

const updateTweet = asyncHandler(async (req, res) => {
  let tweetId = req.params?.tweetId;
  if (!tweetId) {
    throw new ApiError(400, "Tweet id not provided");
  }
  let userID = req.user._id;
  if (!userID) {
    throw new ApiError(400, "User id not provided");
  }
  let content = req.body.content;
  if (!content) {
    throw new ApiError(400, "Content not provided");
  }
  try {
    let updatedTweet = await Tweet.findOneAndUpdate(
      { _id: tweetId, owner: userID },
      { content: content },
      { new: true }
    );
    if (!updatedTweet) {
      throw new ApiError(404, "Tweet not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  let tweetId = req.params?.tweetId;
  if (!tweetId) {
    throw new ApiError(400, "Tweet id not provided");
  }
  let userID = req.user._id;
  if (!userID) {
    throw new ApiError(400, "User id not provided");
  }
  try {
    let deletedTweet = await Tweet.findOneAndDelete({
      _id: tweetId,
      owner: userID,
    });
    if (!deletedTweet) {
      throw new ApiError(404, "Tweet not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet, getFeedTweets };
