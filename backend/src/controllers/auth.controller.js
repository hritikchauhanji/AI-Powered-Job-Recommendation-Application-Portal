import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { USER_COOKIE_EXPIRY } from "../constants.js";

// generate user accessToken and refreshToken
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

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
    "-password -refreshToken -resume"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or username

  if (!identifier) {
    throw new ApiError(400, "Email or Username is required");
  }

  // Check if identifier is email or username
  const isEmail = identifier.includes("@");

  const user = await User.findOne(
    isEmail ? { email: identifier } : { username: identifier.toLowerCase() }
  );

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: USER_COOKIE_EXPIRY,
  };

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -resume"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in successfully"
      )
    );
});

export { registerUser, loginUser };
