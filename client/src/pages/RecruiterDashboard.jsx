import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchRecruiterJobs } from "../store/slices/jobsSlice";
import { Briefcase, Plus, Eye } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";

export default function RecruiterDashboard() {
  const dispatch = useAppDispatch();
  const { recruiterJobs, loading, error } = useAppSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    dispatch(fetchRecruiterJobs({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Calculate stats from recruiterJobs
  const stats = {
    totalJobs: recruiterJobs.length,
    activeJobs: recruiterJobs.filter((j) => j.status === "active").length,
    totalApplications: recruiterJobs.reduce(
      (sum, j) => sum + (j.applicationsCount || 0),
      0
    ),
  };

  if (loading)
    return <LoadingSpinner message="Loading recruiter dashboard..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-max">
        {error && <ErrorAlert message={error} />}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Recruiter Dashboard
          </h1>
          <Link
            to="/recruiter/post-job"
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card bg-blue-50">
            <p className="text-gray-600 text-sm">Total Jobs</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.totalJobs}
            </p>
          </div>
          <div className="card bg-green-50">
            <p className="text-gray-600 text-sm">Active Jobs</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.activeJobs}
            </p>
          </div>
          <div className="card bg-purple-50">
            <p className="text-gray-600 text-sm">Total Applications</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.totalApplications}
            </p>
          </div>
        </div>

        {/* Jobs List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Job Listings
          </h2>

          {recruiterJobs.length === 0 ? (
            <div className="card text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No jobs posted yet</p>
              <Link
                to="/recruiter/post-job"
                className="btn-primary inline-block"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recruiterJobs.map((job) => (
                <div key={job._id} className="card-hover">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {job.description.substring(0, 100)}...
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                        <span>📍 {job.location}</span>
                        <span>💼 {job.jobType}</span>
                        <span>
                          📝 {job.applicationsCount || 0} applications
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === "active"
                            ? "bg-green-100 text-green-700"
                            : job.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {job.status}
                      </span>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="flex items-center gap-1 px-3 py-1 text-primary-600 hover:bg-primary-50 rounded transition"
                      >
                        <Eye size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
