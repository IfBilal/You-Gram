import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
let app = express();


// 🔍 DETAILED REQUEST LOGGING - Add this at the very top
app.use((req, res, next) => {
  console.log('\\n🔥 NEW REQUEST 🔥');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Origin:', req.headers.origin || 'No origin');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  if (req.method === 'OPTIONS') {
    console.log('🎯 THIS IS A PREFLIGHT REQUEST');
  }
  
  next();
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://you-gram.vercel.app",
];

// CORS with detailed logging
app.use(cors({
  origin: (origin, callback) => {
    console.log('🔍 CORS Check - Origin:', origin);
    console.log('🔍 Allowed Origins:', allowedOrigins);
    
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed');
      callback(null, true);
    } else {
      console.log('❌ Origin NOT allowed');
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// Log after CORS
app.use((req, res, next) => {
  console.log('✅ Request passed CORS middleware');
  next();
});

// Your existing middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Add a test route
app.get('/api/v1/test-cors', (req, res) => {
  console.log('🎉 Test CORS endpoint hit!');
  res.json({ 
    message: 'CORS is working!', 
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

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
