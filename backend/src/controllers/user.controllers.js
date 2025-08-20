import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import fs from "fs/promises";

let registerUser = asyncHandler(async (req, res) => {
  let { username, email, fullname, password } = req.body;

  if (
    username?.trim() === "" ||
    email?.trim() === "" ||
    fullname?.trim() === "" ||
    password?.trim() === ""
  ) {
    throw new ApiError(400, "All fields are required");
  }
  let existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  let avatar, coverImage;
  try {
    let avatarPath = req.files?.avatar?.[0].path;
    let coverImagePath = req.files?.coverImage?.[0].path;
    avatar = await uploadOnCloudinary(avatarPath);
    coverImage = await uploadOnCloudinary(coverImagePath);
  } catch (err) {
    console.log("Issue uploading on cloudinary");
  }
  if (!avatar || !coverImage) {
    throw new ApiError(500, "Image upload failed");
  }
  let user;
  try {
    user = await User.create({
      username,
      email,
      fullname,
      password,
      avatar: avatar.url,
      coverImage: coverImage.url,
      avatarPublicId: avatar.public_id,
      coverImagePublicId: coverImage.public_id,
    });
  } catch (err) {
    console.log(err);
    
    if (avatar) await deleteFromCloudinary(avatar.public_id);
    if (coverImage) await deleteFromCloudinary(coverImage.public_id);
    throw new ApiError(500, "User creation failed");
  }
  res.status(200).send(new ApiResponse(200, user, "User registered"));
});

let logoutUser = asyncHandler(async (req, res) => {
  let user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );
  let options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "", "Logout successful"));
});

let loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  let { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  let user;
  try {
    user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let passwordCorrect = await user.isPasswordCorrect(password);

    if (!passwordCorrect) {
      throw new ApiError(400, "Wrong password");
    }

    let { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    let options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    console.log("Access and refresh token generated");

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "User Loggedin Successfully"
        )
      );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Something went wrong", error);
  }
});

let generateAccessAndRefreshToken = async function (userId) {
  let user = await User.findById(userId);

  try {
    let accessToken = await user.generateAccessToken();
    let refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

let refreshAccessToken = async (req, res) => {
  let refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(498, "Refresh token not provided");
  }

  try {
    let decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    let user = await User.findById(decoded?.id);

    if (!user) {
      throw new ApiError(498, "Invalid refresh token");
    }

    if (refreshToken !== user?.refreshToken) {
      throw new ApiError(498, "Wrong refresh token");
    }

    let { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

      let options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      };

    req.user = user;
    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options);
    console.log("Access and Refresh tokens refreshed");
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, "error refreshing access token");
  }
};

let changePassword = asyncHandler(async (req, res) => {
  try {
    let { currentPassword, newPassword } = req.body;
    let user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    let response = await user.isPasswordCorrect(currentPassword);
    if (!response) {
      throw new ApiError(410, "Wrong current password");
    }
    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json(new ApiResponse(200, user, "Password changed successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error?.message || "Something went wrong");
  }
});

let getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user details"));
});

let updateAccountDetails = asyncHandler(async (req, res) => {
  try {
    let { fullname, username, email } = req.body;
    if (!fullname || !username || !email) {
      throw new ApiError(400, "All fields are required");
    }
    const existingUser = await User.findOne({
      $and: [
        {
          $or: [{ username }, { email }],
        },
        { _id: { $ne: req.user._id } },
      ],
    });

    if (existingUser) {
      throw new ApiError(
        410,
        "Another user with same username or email already exists"
      );
    }
    let user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          username,
          email,
          fullname,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json(new ApiResponse(200, user, "Account data updated successfuly"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error?.message || "Something went wrong");
  }
});

let updateAvatar = asyncHandler(async (req, res) => {
  try {
    let avatarPath = req.file?.path;
    if (!avatarPath) {
      throw new ApiError(400, "Path not given");
    }
    let response = await uploadOnCloudinary(avatarPath);
    if (!response.url) {
      throw new ApiError(500, "Error uploading on cloudinary");
    }
    const existingUser = await User.findById(req.user._id);
    if (existingUser?.avatarPublicId) {
      await deleteFromCloudinary(existingUser.avatarPublicId);
    }
    let user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { avatar: response.url, avatarPublicId: response.public_id },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, user.avatar, "Avatar updated"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong");
  }
});

let updateCoverImage = asyncHandler(async (req, res) => {
  try {
    let coverImagePath = req.file?.path;
    if (!coverImagePath) {
      throw new ApiError(400, "Path not given");
    }
    let response = await uploadOnCloudinary(coverImagePath);
    if (!response.url) {
      throw new ApiError(500, "Error uploading on cloudinary");
    }
    const existingUser = await User.findById(req.user._id);
    if (existingUser?.coverImagePublicId) {
      await deleteFromCloudinary(existingUser.coverImagePublicId);
    }
    let user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          coverImage: response.url,
          coverImagePublicId: response.public_id,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, user.coverImage, "Cover image updated"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong");
  }
});

let getUserChannelProfile = asyncHandler(async (req, res) => {
  const username = req.params.username;
  if (!username) throw new ApiError(400, "Username not provided");

  const userId = new mongoose.Types.ObjectId(req.user._id);

  const channel = await User.aggregate([
    { $match: { username: username } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: { $size: "$subscribers" },
        subscribedToCount: { $size: "$subscribedTo" },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        subscriberCount: 1,
        subscribedToCount: 1,
        isSubscribed: {
          $cond: {
            if: {
              $eq: ["$_id", userId],
            },
            then: null,
            else: {
              $in: [userId, "$subscribers.subscriber"],
            },
          },
        },
      },
    },
  ]);

  if (!channel.length) throw new ApiError(404, "Channel not found");

  res
    .status(200)
    .json(new ApiResponse(200, channel[0], "Profile fetched successfully"));
});

let getWatchHistory = asyncHandler(async (req, res) => {
  const username = req.params.username;
  if (!username) throw new ApiError(400, "Username not provided");

  const user = await User.aggregate([
    { $match: { username: username } },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
          {
            $project: {
              title: 1,
              thumbnail: 1,
              owner: {
                fullname: "$owner.fullname",
                username: "$owner.username",
                avatar: "$owner.avatar",
              },
            },
          },
        ],
      },
    },
  ]);

  if (!user.length) throw new ApiError(404, "User not found");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  generateAccessAndRefreshToken,
};
