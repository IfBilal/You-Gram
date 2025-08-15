import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PAGINATION_LIMIT as limit } from "../constants.js";
import { Like } from "../models/like.models.js";
import { Tweet } from "../models/tweet.models.js";
import { Image } from "../models/image.models.js";
import { Video } from "../models/video.models.js";

const getPostComments = asyncHandler(async (req, res) => {
  const { postId, postType } = req.params;
  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post id");
  }
  let page = parseInt(req.query.page) || 1;
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  if (postType != "tweet" && postType != "image" && postType != "video")
    throw new ApiError(400, "Invalid Post Type");
  let skip = (page - 1) * limit;

  let model;
  switch (postType) {
    case "tweet":
      model = Tweet;
      break;
    case "image":
      model = Image;
      break;
    case "video":
      model = Video;
      break;
  }

  const postExists = await model.findById(postId);
  if (!postExists) {
    throw new ApiError(404, `${postType} not found`);
  }

  try {
    let comments = await Comment.aggregate([
      {
        $match: {
          [postType]: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "comment",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "commentOwner",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          ownerUsername: { $first: "$commentOwner.username" },
          ownerAvatar: { $first: "$commentOwner.avatar" },
          hasLiked: {
            $anyElementTrue: {
              $map: {
                input: "$likes",
                as: "like",
                in: {
                  $eq: [
                    "$$like.likedBy",
                    new mongoose.Types.ObjectId(req.user._id),
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          likes: 0,
          commentOwner: 0,
          __v: 0,
        },
      },
    ]);
    const hasMore = comments.length === limit;
    res
      .status(200)
      .json(
        new ApiResponse(200, { comments, hasMore }, "Comments for the post")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

const addComment = asyncHandler(async (req, res) => {
  const { postId, postType } = req.params;
  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post id");
  }
  if (postType != "tweet" && postType != "image" && postType != "video")
    throw new ApiError(400, "Invalid Post Type");
  const content = req.body.content?.trim();
  if (!content) {
    throw new ApiError(400, "No content provided");
  }
  let model;
  switch (postType) {
    case "tweet":
      model = Tweet;
      break;
    case "image":
      model = Image;
      break;
    case "video":
      model = Video;
      break;
  }

  const postExists = await model.findById(postId);
  if (!postExists) {
    throw new ApiError(404, `${postType} not found`);
  }
  try {
    let comment = await Comment.create({
      content,
      owner: req.user._id,
      [postType]: postId,
    });
    comment = await comment.populate("owner", "username avatar");
    res.status(201).json(new ApiResponse(201, comment, "Comment created"));
  } catch (error) {
    throw new ApiError(500, "Error creating comment");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }
  try {
    let deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      owner: req.user._id,
    });
    if (!deletedComment) throw new ApiError(404, "Comment not found");
    await Like.deleteMany({ comment: commentId });
    res
      .status(200)
      .json(new ApiResponse(200, deletedComment, "Comment deleted"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong while deleting comment");
  }
});

export { getPostComments, addComment, deleteComment };
