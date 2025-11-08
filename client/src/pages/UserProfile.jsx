import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { User, Mail, Briefcase, MapPin, BookOpen, Upload } from "lucide-react";
import apiClient from "../api/axios";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";

export default function UserProfile() {
  const { user } = useAppSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    skills: user?.skills?.join(", ") || "",
    experience: user?.experience || 0,
    location: user?.location || "",
    education: user?.education || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const updateData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        experience: parseInt(formData.experience),
      };

      await apiClient.put("/users/profile", updateData);
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setError("Please select a resume file");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("resume", resumeFile);

      await apiClient.post("/users/resume", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setResumeFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-max max-w-2xl">
        {error && <ErrorAlert message={error} onClose={() => setError("")} />}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium">
            ✓ Updated successfully!
          </div>
        )}

        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 pb-6 border-b">
            <div>
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-primary-200"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-600" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600 text-sm mt-1">@{user?.username}</p>
              <div className="mt-4 inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {user?.role === "condidate" ? "Job Seeker" : user?.role}
              </div>
            </div>

            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-primary">
                Edit Profile
              </button>
            )}
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Mail className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>

              {user?.location && (
                <div className="flex items-center gap-3 pb-4 border-b">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{user.location}</p>
                  </div>
                </div>
              )}

              {user?.experience !== undefined && (
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Briefcase className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium text-gray-900">
                      {user.experience}+ years
                    </p>
                  </div>
                </div>
              )}

              {user?.skills && user.skills.length > 0 && (
                <div className="flex items-start gap-3 pt-4">
                  <BookOpen className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <span key={skill} className="badge-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Resume Upload */}
        {user?.role === "condidate" && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Upload Resume
            </h2>
            <form onSubmit={handleResumeUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Resume (PDF only)
                </label>
                <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center hover:border-primary-500 hover:bg-primary-50 transition">
                  <Upload className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                  <label className="cursor-pointer">
                    <span className="text-primary-600 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                  {resumeFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {resumeFile.name}
                    </p>
                  )}
                </div>
              </div>

              {user?.resume?.url && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Current resume:{" "}
                    <a
                      href={user.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      View
                    </a>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !resumeFile}
                className="btn-primary w-full"
              >
                {loading ? "Uploading..." : "Upload Resume"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
