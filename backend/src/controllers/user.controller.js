import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken -forgotPasswordToken -forgotPasswordExpiry"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile retrieved successfully"));
});

// Update candidate profile
const updateCandidateProfile = asyncHandler(async (req, res) => {
  const { name, email, skills, experience, location, education } = req.body;

  const updateData = {};
  if (skills) updateData.skills = Array.isArray(skills) ? skills : [skills];
  if (experience) updateData.experience = experience;
  if (location) updateData.location = location;
  if (education) updateData.education = education;
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(400, "User not updated");
  }

  const updatedUser = await User.findById(req.user._id).select(
    "-password -refreshToken -forgotPasswordToken -forgotPasswordExpiry"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser,
        "Candidate profile updated successfully"
      )
    );
});

// Upload resume
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const user = await User.findById(req.user._id);

  // Delete old resume if exists
  if (user.resume?.public_id) {
    await deleteFromCloudinary(user.resume.public_id);
  }

  // Upload new resume
  const uploadedResume = await uploadOnCloudinary(req.file.path);

  if (!uploadedResume?.url) {
    throw new ApiError(400, "Error uploading resume to Cloudinary");
  }

  user.resume = {
    public_id: uploadedResume.public_id,
    url: uploadedResume.url,
  };

  const userWithResumefile = await user.save({ validateBeforeSave: false });

  if (!userWithResumefile) {
    throw new ApiError(400, "Resume not uploaded");
  }

  const updatedUser = await User.findById(req.user._id).select(
    "-password -refreshToken -forgotPasswordToken -forgotPasswordExpiry"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Resume uploaded successfully"));
});

// Update profile image
const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Profile image is required");
  }

  const user = await User.findById(req.user._id);

  // Delete old image if exists
  if (user.profileImage?.public_id) {
    await deleteFromCloudinary(user.profileImage.public_id);
  }

  // Upload new image
  const uploadedImage = await uploadOnCloudinary(req.file.path);

  if (!uploadedImage?.url) {
    throw new ApiError(400, "Error uploading image to Cloudinary");
  }

  user.profileImage = {
    public_id: uploadedImage.public_id,
    url: uploadedImage.url,
  };

  const userWithProfileImage = await user.save({ validateBeforeSave: false });

  if (!userWithProfileImage) {
    throw new ApiError(400, "ProfilImage not uploaded");
  }

  const updatedUser = await User.findById(req.user._id).select(
    "-password -refreshToken -forgotPasswordToken -forgotPasswordExpiry"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Profile image updated successfully")
    );
});

// Change password (when already logged in)
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new password are required");
  }

  const user = await User.findById(req.user._id).select("+password");

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Old password is incorrect");
  }

  user.password = newPassword;
  const userWithNewPassword = await user.save({ validateBeforeSave: false });

  if (!userWithNewPassword) {
    throw new ApiError(401, "New Password is not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export {
  getUserProfile,
  updateCandidateProfile,
  uploadResume,
  updateProfileImage,
  changePassword,
};
