import { Router } from "express";
import { getJobRecommendations } from "../controllers/recommendation.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/",
  verifyJWT,
  verifyPermission(["condidate"]),
  getJobRecommendations
);

export default router;
