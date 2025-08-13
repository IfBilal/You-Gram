import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : process.env.NODE_ENV === "test"
      ? ".env.test"
      : ".env.development";
      
dotenv.config();
dotenv.config({ path: envFile });

let port = process.env.PORT || 8001;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error");
  });
