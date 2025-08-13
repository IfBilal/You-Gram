import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

let healthcheck = asyncHandler((req, res) => {
  res.status(200).send(new ApiResponse(200, "OK", "Health check successful"));
});
export {healthcheck}