import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchJobById,
  clearCurrentJob,
  updateJob,
} from "../store/slices/jobsSlice";
import { applyForJob } from "../store/slices/applicationsSlice";
import { MapPin, DollarSign, Briefcase, Building2, Edit } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const {
    currentJob: job,
    loading,
    error,
  } = useAppSelector((state) => state.jobs);

  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyError, setApplyError] = useState("");

  // Edit job state
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    location: "",
    jobType: "",
    experienceRequired: "",
    salary: { min: "", max: "" },
    companyName: "",
  });

  useEffect(() => {
    dispatch(fetchJobById(id));

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [id, dispatch]);

  // Populate edit form when job is loaded
  useEffect(() => {
    if (job) {
      setEditFormData({
        title: job.title || "",
        description: job.description || "",
        skillsRequired: (job.skillsRequired || []).join(", "),
        location: job.location || "",
        jobType: job.jobType || "",
        experienceRequired: job.experienceRequired || "",
        salary: { min: job.salary?.min || "", max: job.salary?.max || "" },
        companyName: job.companyName || "",
      });
    }
  }, [job]);

  // Check if current user is the recruiter who posted this job
  const isJobOwner = user && job && job.recruiterId?._id === user._id;
  const isRecruiter = user?.role === "recruiter";
  const isCandidate = user?.role === "condidate";

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setApplying(true);
      setApplyError("");

      const result = await dispatch(applyForJob({ jobId: id, coverLetter }));

      if (applyForJob.fulfilled.match(result)) {
        setApplySuccess(true);
        setShowApplyModal(false);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setApplyError(result.payload || "Failed to apply");
      }
    } catch (err) {
      setApplyError("Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("salary")) {
      const type = name.split(".")[1];
      setEditFormData({
        ...editFormData,
        salary: { ...editFormData.salary, [type]: value },
      });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();

    const updatedJobData = {
      ...editFormData,
      skillsRequired: editFormData.skillsRequired
        .split(",")
        .map((s) => s.trim()),
      experienceRequired: parseInt(editFormData.experienceRequired),
      salary: {
        min: parseInt(editFormData.salary.min),
        max: parseInt(editFormData.salary.max),
      },
    };

    const result = await dispatch(
      updateJob({ jobId: id, jobData: updatedJobData })
    );

    if (updateJob.fulfilled.match(result)) {
      setIsEditing(false);
      dispatch(fetchJobById(id)); // Refresh job details
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!job)
    return <div className="text-center py-12 text-gray-600">Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-max max-w-4xl">
        {error && <ErrorAlert message={error} />}
        {applySuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium">
            ✓ Applied successfully! Redirecting to dashboard...
          </div>
        )}

        <div className="card mb-8">
          {!isEditing ? (
            <>
              {/* View Mode */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-600">{job.companyName}</p>
                </div>

                {/* Show Edit button for job owner, Apply button for candidates */}
                {isJobOwner ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary w-full sm:w-auto flex items-center gap-2 justify-center"
                  >
                    <Edit size={18} />
                    Edit Job
                  </button>
                ) : isCandidate ? (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="btn-primary w-full sm:w-auto"
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? "Apply Now" : "Login to Apply"}
                  </button>
                ) : null}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 pb-8 border-b">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-primary-600" />
                    <p className="font-semibold">{job.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Salary</p>
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-primary-600" />
                    <p className="font-semibold">
                      ₹{job.salary?.min?.toLocaleString() ?? 0} - ₹
                      {job.salary?.max?.toLocaleString() ?? 0}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Type</p>
                  <p className="font-semibold">{job.jobType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Experience</p>
                  <p className="font-semibold">
                    {job.experienceRequired}+ years
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About the Role
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(job.skillsRequired || []).map((skill) => (
                    <span key={skill} className="badge-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 size={24} className="text-primary-600" />
                  About the Company
                </h2>
                <p className="text-gray-700 mb-2">
                  <strong>Name:</strong> {job.recruiterId?.companyName || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {job.recruiterId?.email || "N/A"}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Edit Job
              </h2>

              <form onSubmit={handleUpdateJob} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows="6"
                    className="textarea-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Type
                    </label>
                    <select
                      name="jobType"
                      value={editFormData.jobType}
                      onChange={handleEditChange}
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
                    Skills Required (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skillsRequired"
                    value={editFormData.skillsRequired}
                    onChange={handleEditChange}
                    className="input-field"
                    placeholder="React, JavaScript, Node.js"
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
                      value={editFormData.salary.min}
                      onChange={handleEditChange}
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
                      value={editFormData.salary.max}
                      onChange={handleEditChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experienceRequired"
                      value={editFormData.experienceRequired}
                      onChange={handleEditChange}
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
                    value={editFormData.companyName}
                    onChange={handleEditChange}
                    className="input-field"
                  />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex-1">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Apply Modal (only for candidates) */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Apply for this Job</h2>

              {applyError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                  {applyError}
                </div>
              )}

              <textarea
                placeholder="Write your cover letter..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows="6"
                className="textarea-field mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleApply}
                  disabled={applying || !coverLetter.trim()}
                  className="btn-primary flex-1"
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
                <button
                  onClick={() => {
                    setShowApplyModal(false);
                    setApplyError("");
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
