import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { userRegisterValidator } from "../validators/auth.validator.js";
import { validate } from "../validators/validate.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// register router
router.post(
  "/",
  upload.single("profileImage"),
  userRegisterValidator(),
  validate,
  registerUser
);

// login router
router.post("/login", loginUser);

export default router;
