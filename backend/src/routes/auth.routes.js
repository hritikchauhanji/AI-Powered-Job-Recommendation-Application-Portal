import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller.js";
import { userRegisterValidator } from "../validators/auth.validator.js";
import { validate } from "../validators/validate.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// register
router.post(
  "/",
  upload.single("profileImage"),
  userRegisterValidator(),
  validate,
  registerUser
);

// login
router.post("/login", loginUser);

// logout
router.post("/logout", verifyJWT, logoutUser);

// refresh token
router.post("/refresh-token", refreshAccessToken);

export default router;
