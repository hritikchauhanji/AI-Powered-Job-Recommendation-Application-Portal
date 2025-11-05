import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get dashboard overview
const getDashboardOverview = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalCandidates = await User.countDocuments({ role: "condidate" });
  const totalRecruiters = await User.countDocuments({ role: "recruiter" });
  const totalJobs = await Job.countDocuments();
  const activeJobs = await Job.countDocuments({ status: "active" });
  const totalApplications = await Application.countDocuments();
  const pendingApplications = await Application.countDocuments({
    status: "pending",
  });

  const overview = {
    users: {
      total: totalUsers,
      candidates: totalCandidates,
      recruiters: totalRecruiters,
    },
    jobs: {
      total: totalJobs,
      active: activeJobs,
      pending: await Job.countDocuments({ status: "pending" }),
    },
    applications: {
      total: totalApplications,
      pending: pendingApplications,
      shortlisted: await Application.countDocuments({ status: "shortlisted" }),
      rejected: await Application.countDocuments({ status: "rejected" }),
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, overview, "Dashboard overview retrieved"));
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role } = req.query;

  const filter = {};
  if (role) filter.role = role;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find(filter)
    .select("-password -refreshToken")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalUsers,
          pages: Math.ceil(totalUsers / parseInt(limit)),
        },
      },
      "Users retrieved successfully"
    )
  );
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

// Change user role
const changeUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const validRoles = ["condidate", "recruiter", "admin"];
  if (!validRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role changed successfully"));
});

// Approve job listing
const approveJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findByIdAndUpdate(
    jobId,
    { status: "active" },
    { new: true }
  ).populate("recruiterId", "name email");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job approved successfully"));
});

// Reject job listing
const rejectJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findByIdAndUpdate(
    jobId,
    { status: "closed" },
    { new: true }
  ).populate("recruiterId", "name email");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job rejected successfully"));
});

// Get pending jobs
const getPendingJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const jobs = await Job.find({ status: "pending" })
    .populate("recruiterId", "name email companyName")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ postedOn: -1 });

  const totalJobs = await Job.countDocuments({ status: "pending" });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalJobs,
          pages: Math.ceil(totalJobs / parseInt(limit)),
        },
      },
      "Pending jobs retrieved successfully"
    )
  );
});

export {
  getDashboardOverview,
  getAllUsers,
  deleteUser,
  changeUserRole,
  approveJob,
  rejectJob,
  getPendingJobs,
};
