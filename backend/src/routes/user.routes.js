import { Router } from "express";
import {
  changePassword,
  getUserProfile,
  updateCandidateProfile,
  updateProfileImage,
  uploadResume,
} from "../controllers/user.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";
import { upload, uploadResumeFile } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/profile", verifyJWT, getUserProfile);
router.put(
  "/profile",
  verifyJWT,
  verifyPermission(["condidate"]),
  updateCandidateProfile
);
router.post(
  "/resume",
  verifyJWT,
  verifyPermission(["condidate"]),
  uploadResumeFile.single("resume"),
  uploadResume
);
router.post(
  "/profile-image",
  verifyJWT,
  upload.single("profileImage"),
  updateProfileImage
);
router.post("/change-password", verifyJWT, changePassword);

export default router;
