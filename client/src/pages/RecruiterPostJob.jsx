import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ArrowRight } from "lucide-react";
import apiClient from "../api/axios";
import ErrorAlert from "../components/common/ErrorAlert";

export default function RecruiterPostJob() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    location: "",
    jobType: "Full-time",
    experienceRequired: "",
    salary: { min: "", max: "" },
    companyName: user?.companyName || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("salary")) {
      const type = name.split(".")[1];
      setFormData({
        ...formData,
        salary: { ...formData.salary, [type]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const jobData = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(",").map((s) => s.trim()),
        experienceRequired: parseInt(formData.experienceRequired),
        salary: {
          min: parseInt(formData.salary.min),
          max: parseInt(formData.salary.max),
        },
      };

      await apiClient.post("/jobs", jobData);
      setSuccess(true);
      setTimeout(() => navigate("/recruiter/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-max max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Post a New Job
        </h1>

        {error && <ErrorAlert message={error} onClose={() => setError("")} />}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium">
            ✓ Job posted successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Senior React Developer"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Job description, responsibilities, requirements..."
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="textarea-field"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Bangalore, India"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills Required (comma-separated) *
            </label>
            <input
              type="text"
              name="skillsRequired"
              placeholder="e.g., React, JavaScript, Node.js, MongoDB"
              value={formData.skillsRequired}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Salary
              </label>
              <input
                type="number"
                name="salary.min"
                placeholder="Min salary"
                value={formData.salary.min}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Salary
              </label>
              <input
                type="number"
                name="salary.max"
                placeholder="Max salary"
                value={formData.salary.max}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience Required (years)
              </label>
              <input
                type="number"
                name="experienceRequired"
                placeholder="Years"
                value={formData.experienceRequired}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              placeholder="Your company name"
              value={formData.companyName}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className=" btn-primary flex items-center justify-center">
            <button type="submit" disabled={loading} className="">
              {loading ? "Posting Job..." : "Post Job"}
            </button>
            <ArrowRight size={18} />
          </div>
        </form>
      </div>
    </div>
  );
}
