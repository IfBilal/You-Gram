import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }
  const subscriberId = req.user._id;
  if (subscriberId.toString() === channelId.toString()) {
    throw new ApiError(400, "Can't subscribe to your own channel");
  }
  const channelExists = await User.findById(channelId);
  if (!channelExists) {
    throw new ApiError(404, "Channel not found");
  }
  try {
    let subscriptionExist = await Subscription.findOne({
      subscriber: subscriberId,
      channel: channelId,
    });
    if (!subscriptionExist) {
      let response = await Subscription.create({
        subscriber: subscriberId,
        channel: channelId,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, response, "Channel subscribed"));
    }
    let unsubscribed = await Subscription.findByIdAndDelete(
      subscriptionExist._id
    );
    return res
      .status(200)
      .json(new ApiResponse(200, unsubscribed, "Channel unsubscribed"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong");
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }
  const channelExists = await User.findById(channelId);
  if (!channelExists) {
    throw new ApiError(404, "Channel not found");
  }
  try {
    let subscriptions = await Subscription.find({ channel: channelId })
      .populate("subscriber", "username email avatar")
      .lean();
    let subscribers = subscriptions.map((sub) => sub.subscriber);
    res.status(200).json(new ApiResponse(200, subscribers, "Subscriber list"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber id");
  }
  const subscriberExists = await User.findById(subscriberId);
  if (!subscriberExists) {
    throw new ApiError(404, "Subscriber not found");
  }
  try {
    let channels = await Subscription.find({ subscriber: subscriberId })
      .populate("channel", "username email avatar")
      .lean();
    let channelList = channels.map((ch) => ch.channel);
    res.status(200).json(new ApiResponse(200, channelList, "Channel list"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
