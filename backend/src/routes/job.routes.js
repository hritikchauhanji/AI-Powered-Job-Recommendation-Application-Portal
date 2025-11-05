import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
} from "../controllers/job.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";
import { createJobValidator } from "../validators/job.validator.js";
import { validate } from "../validators/validate.js";

const router = Router();

// Public routes
router.get("/", getAllJobs);
router.get("/:jobId", getJobById);

// Protected routes (Recruiter)
router.post(
  "/",
  verifyJWT,
  verifyPermission(["recruiter"]),
  createJobValidator(),
  validate,
  createJob
);
router.put(
  "/:jobId",
  verifyJWT,
  verifyPermission(["recruiter", "admin"]),
  updateJob
);
router.delete(
  "/:jobId",
  verifyJWT,
  verifyPermission(["recruiter", "admin"]),
  deleteJob
);
router.get(
  "/recruiter/my-jobs",
  verifyJWT,
  verifyPermission(["recruiter"]),
  getRecruiterJobs
);

export default router;
