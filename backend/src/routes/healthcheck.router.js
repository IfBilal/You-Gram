import { healthcheck } from "../controllers/healthcheck.controller.js";
import { Router } from "express";
let router = Router();

router.route("/").get(healthcheck);
export default router;