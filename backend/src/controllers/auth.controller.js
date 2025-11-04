import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  USER_COOKIE_EXPIRY,
  USER_TEMPORARY_TOKEN_EXPIRY,
} from "../constants.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import crypto from "crypto";
import { sendEmail } from "../utils/emails/sendEmail.js";
import {
  forgotPasswordEmailTemplate,
  forgotPasswordPlainTextTemplate,
} from "../utils/emails/forgotPasswordTemplate.js";

// register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  if ([name, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  let profileImageUrl = "";
  let profileImagePublicId = "";
  const profileImageLocalPath = req.file?.path;

  if (profileImageLocalPath) {
    const uploadedImage = await uploadOnCloudinary(profileImageLocalPath);
    if (!uploadedImage.url) {
      throw new ApiError(400, "Error when profile image upload on cloudinary!");
    } else {
      profileImageUrl = uploadedImage.url;
      profileImagePublicId = uploadedImage.public_id;
    }
  }

  const user = await User.create({
    name: name.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    profileImage: {
      public_id: profileImagePublicId,
      url: profileImageUrl,
    },
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

export { registerUser };
