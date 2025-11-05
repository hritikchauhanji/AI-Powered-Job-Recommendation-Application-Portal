import { Router } from "express";
import {
  forgotPasswordRequest,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetForgottenPassword,
} from "../controllers/auth.controller.js";
import {
  userForgotPasswordValidator,
  userRegisterValidator,
  userResetForgottenPasswordValidator,
} from "../validators/auth.validator.js";
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

// forgot password
router.post(
  "/forgot-password",
  userForgotPasswordValidator(),
  validate,
  forgotPasswordRequest
);

// reset password
router
  .route("/reset-password")
  .post(
    userResetForgottenPasswordValidator(),
    validate,
    resetForgottenPassword
  );

export default router;
