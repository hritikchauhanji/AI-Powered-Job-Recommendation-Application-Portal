import { Router } from "express";
import {
  applyForJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";

const router = Router();

// Candidate routes
router.post("/apply", verifyJWT, verifyPermission(["condidate"]), applyForJob);
router.get(
  "/my-applications",
  verifyJWT,
  verifyPermission(["condidate"]),
  getCandidateApplications
);

// Recruiter routes
router.get(
  "/job/:jobId",
  verifyJWT,
  verifyPermission(["recruiter", "admin"]),
  getJobApplications
);
router.put(
  "/:applicationId/status",
  verifyJWT,
  verifyPermission(["recruiter", "admin"]),
  updateApplicationStatus
);

export default router;
