import axios from "axios";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000/api";

class RecommendationService {
  async trainModel(jobs) {
    try {
      const response = await axios.post(`${ML_API_URL}/train`, {
        jobs: jobs.map((job) => ({
          _id: job._id,
          title: job.title,
          description: job.description,
          skillsRequired: job.skillsRequired,
          location: job.location,
          companyName: job.companyName,
        })),
      });
      return response.data;
    } catch (error) {
      console.error("Model training error:", error.message);
      throw error;
    }
  }

  async getRecommendations(candidateProfile, topN = 5) {
    try {
      const response = await axios.post(
        `${ML_API_URL}/recommend`,
        {
          skills: candidateProfile.skills,
          experience: candidateProfile.experience,
          location: candidateProfile.location,
        },
        {
          params: { top_n: topN },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Recommendation error:", error.message);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${ML_API_URL}/health`);
      return response.data;
    } catch (error) {
      console.error("Health check error:", error.message);
      return { status: "unhealthy" };
    }
  }
}

export default new RecommendationService();
