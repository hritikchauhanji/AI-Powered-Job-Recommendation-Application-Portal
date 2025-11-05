import { Router } from "express";
import {
  getDashboardOverview,
  getAllUsers,
  deleteUser,
  changeUserRole,
  approveJob,
  rejectJob,
  getPendingJobs,
} from "../controllers/admin.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";

const router = Router();

// Admin-only routes
router.get(
  "/overview",
  verifyJWT,
  verifyPermission(["admin"]),
  getDashboardOverview
);
router.get("/users", verifyJWT, verifyPermission(["admin"]), getAllUsers);
router.delete(
  "/users/:userId",
  verifyJWT,
  verifyPermission(["admin"]),
  deleteUser
);
router.put(
  "/users/:userId/role",
  verifyJWT,
  verifyPermission(["admin"]),
  changeUserRole
);
router.get(
  "/pending-jobs",
  verifyJWT,
  verifyPermission(["admin"]),
  getPendingJobs
);
router.put(
  "/jobs/:jobId/approve",
  verifyJWT,
  verifyPermission(["admin"]),
  approveJob
);
router.put(
  "/jobs/:jobId/reject",
  verifyJWT,
  verifyPermission(["admin"]),
  rejectJob
);

export default router;
