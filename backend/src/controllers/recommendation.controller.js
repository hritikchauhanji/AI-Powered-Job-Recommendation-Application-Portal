import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import recommendationService from "../services/recommendationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getJobRecommendations = asyncHandler(async (req, res) => {
  const { topN = 5 } = req.query;

  try {
    console.log("[Recommendation] Starting recommendation flow...");

    // Get candidate profile
    const candidate = await User.findById(req.user._id);

    if (!candidate) {
      throw new ApiError(404, "User not found");
    }

    if (!candidate.skills || candidate.skills.length === 0) {
      throw new ApiError(
        400,
        "Please complete your profile with at least one skill"
      );
    }

    console.log("[Recommendation] Candidate found:", candidate.name);
    console.log("[Recommendation] Candidate skills:", candidate.skills);

    // Check ML API health
    const healthStatus = await recommendationService.healthCheck();
    console.log("[Recommendation] ML API health:", healthStatus);

    if (healthStatus.status !== "healthy") {
      throw new ApiError(503, "AI recommendation service is unavailable");
    }

    // Get active jobs
    const jobs = await Job.find({ status: "active" }).lean();

    console.log(`[Recommendation] Found ${jobs.length} active jobs`);

    if (jobs.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { recommendations: [], count: 0 },
            "No jobs available"
          )
        );
    }

    // Train model with proper data
    const jobsForTraining = jobs.map((job) => ({
      _id: job._id.toString(), // Convert to string
      title: job.title || "",
      description: job.description || "",
      skillsRequired: Array.isArray(job.skillsRequired)
        ? job.skillsRequired
        : [],
      location: job.location || "Remote",
      companyName: job.companyName || "Unknown",
      jobType: job.jobType || "Full-time",
    }));

    console.log("[Recommendation] Training model...");
    await recommendationService.trainModel(jobsForTraining);

    // Get recommendations from ML API
    console.log("[Recommendation] Getting recommendations...");
    const mlResponse = await recommendationService.getRecommendations(
      {
        skills: candidate.skills,
        experience: candidate.experience || 0,
        location: candidate.location || "Remote",
      },
      parseInt(topN)
    );

    console.log(
      `[Recommendation] ML API returned ${mlResponse.recommendations.length} recommendations`
    );
    console.log(
      "[Recommendation] Recommendation IDs:",
      mlResponse.recommendations.map((r) => r.jobId)
    );

    // Extract job IDs from recommendations
    // Filter out invalid IDs (like "job_19") and keep only valid MongoDB ObjectIds
    const validRecommendations = mlResponse.recommendations.filter((rec) => {
      // Check if jobId is a valid MongoDB ObjectId (24 hex characters)
      const isValidObjectId = /^[0-9a-f]{24}$/i.test(rec.jobId);
      if (!isValidObjectId) {
        console.log(`[Recommendation] Skipping invalid job ID: ${rec.jobId}`);
      }
      return isValidObjectId;
    });

    console.log(
      `[Recommendation] ${validRecommendations.length} valid recommendations after filtering`
    );

    if (validRecommendations.length === 0) {
      console.log(
        "[Recommendation] No valid job IDs found, returning recommendations as-is"
      );
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            recommendations: mlResponse.recommendations,
            count: mlResponse.recommendations.length,
          },
          "Job recommendations retrieved successfully"
        )
      );
    }

    // Get full job details from MongoDB
    const recommendedJobIds = validRecommendations.map((r) => r.jobId);
    console.log(
      "[Recommendation] Fetching job details for IDs:",
      recommendedJobIds
    );

    const jobDetails = await Job.find({
      _id: { $in: recommendedJobIds },
    }).populate("recruiterId", "name email companyName");

    console.log(
      `[Recommendation] Found ${jobDetails.length} job details from MongoDB`
    );

    // Enrich recommendations with full job details
    const enrichedRecommendations = validRecommendations.map((rec) => {
      const jobDetail = jobDetails.find((j) => j._id.toString() === rec.jobId);

      return {
        ...rec,
        jobDetails: jobDetail ? jobDetail.toObject() : null,
      };
    });

    console.log("[Recommendation] Returning enriched recommendations");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          recommendations: enrichedRecommendations,
          count: enrichedRecommendations.length,
        },
        "Job recommendations retrieved successfully"
      )
    );
  } catch (error) {
    console.error("[Recommendation] Error:", error.message);
    console.error("[Recommendation] Stack:", error.stack);
    throw error;
  }
});

export { getJobRecommendations };
