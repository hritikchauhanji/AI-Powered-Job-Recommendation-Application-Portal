import { Job } from "../models/job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get all jobs with filters
const getAllJobs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    location,
    jobType,
    skills,
    search,
    status = "pending",
  } = req.query;

  const filter = { status };

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    filter.jobType = jobType;
  }

  if (skills) {
    const skillsArray = skills.split(",").map((s) => s.trim());
    filter.skillsRequired = { $in: skillsArray };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const jobs = await Job.find(filter)
    .populate("recruiterId", "name email companyName")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ postedOn: -1 });

  const totalJobs = await Job.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalJobs,
          totalPages: Math.ceil(totalJobs / parseInt(limit)),
        },
      },
      "Jobs retrieved successfully"
    )
  );
});

// Get single job
const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId).populate(
    "recruiterId",
    "name email companyName"
  );

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job retrieved successfully"));
});

// Create job (Recruiter only)
const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    skillsRequired,
    location,
    salary,
    jobType,
    experienceRequired,
    companyName,
  } = req.body;

  if (!title || !description || !location) {
    throw new ApiError(400, "Title, description, and location are required");
  }

  const job = await Job.create({
    title,
    description,
    skillsRequired: skillsRequired || [],
    location,
    salary: salary || { min: 0, max: 0 },
    jobType,
    experienceRequired,
    companyName,
    recruiterId: req.user._id,
  });

  const createdJob = await Job.findById(job._id).populate(
    "recruiterId",
    "name email companyName"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdJob, "Job created successfully"));
});

// Update job
const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check authorization
  if (
    job.recruiterId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to update this job");
  }

  const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
    new: true,
    runValidators: true,
  }).populate("recruiterId", "name email companyName");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});

// Delete job
const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check authorization
  if (
    job.recruiterId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this job");
  }

  await Job.findByIdAndDelete(jobId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Job deleted successfully"));
});

// Get recruiter's jobs
const getRecruiterJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const filter = { recruiterId: req.user._id };

  if (status) {
    filter.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const jobs = await Job.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ postedOn: -1 });

  const totalJobs = await Job.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalJobs,
          totalPages: Math.ceil(totalJobs / parseInt(limit)),
        },
      },
      "Recruiter jobs retrieved successfully"
    )
  );
});

export {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
};
