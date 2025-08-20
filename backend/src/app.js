import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
let app = express();
const allowedOrigins = ["http://localhost:5173", "https://you-gram.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//common middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import healthCheckRouter from "./routes/healthcheck.router.js";
import userRouter from "./routes/user.router.js";
import tweetRouter from "./routes/tweet.router.js";
import subscriptionRouter from "./routes/subscription.router.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import videoRouter from "./routes/video.router.js";
import imageRouter from "./routes/image.router.js";
import commentRouter from "./routes/comment.router.js";
import likeRouter from "./routes/like.router.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);

app.use(errorHandler);
export { app };
