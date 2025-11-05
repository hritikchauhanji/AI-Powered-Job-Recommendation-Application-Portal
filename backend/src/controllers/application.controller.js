import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Apply for job
const applyForJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check if already applied
  const existingApplication = await Application.findOne({
    userId: req.user._id,
    jobId,
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this job");
  }

  const application = await Application.create({
    userId: req.user._id,
    jobId,
    coverLetter,
  });

  // Increment applications count
  await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

  const populatedApplication = await Application.findById(
    application._id
  ).populate("jobId userId", "title name email");

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedApplication,
        "Application submitted successfully"
      )
    );
});

// Get user's applications
const getCandidateApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const filter = { userId: req.user._id };

  if (status) {
    filter.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const applications = await Application.find(filter)
    .populate("jobId", "title companyName location salary jobType")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ appliedOn: -1 });

  const totalApplications = await Application.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        applications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalApplications,
          totalPages: Math.ceil(totalApplications / parseInt(limit)),
        },
      },
      "Applications retrieved successfully"
    )
  );
});

// Get applications for a job (Recruiter)
const getJobApplications = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check authorization
  if (
    job.recruiterId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to view these applications");
  }

  const filter = { jobId };

  if (status) {
    filter.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const applications = await Application.find(filter)
    .populate("userId", "name email skills resume")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ appliedOn: -1 });

  const totalApplications = await Application.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        applications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalApplications,
          totalPages: Math.ceil(totalApplications / parseInt(limit)),
        },
      },
      "Job applications retrieved successfully"
    )
  );
});

// Update application status
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const application = await Application.findById(applicationId).populate(
    "jobId"
  );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Check authorization
  if (
    application.jobId.recruiterId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to update this application");
  }

  application.status = status;
  application.reviewedOn = new Date();
  await application.save();

  const updatedApplication = await Application.findById(applicationId).populate(
    "jobId userId"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedApplication,
        "Application status updated successfully"
      )
    );
});

export {
  applyForJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
};
