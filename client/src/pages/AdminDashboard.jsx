import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchDashboardOverview,
  fetchAllUsers,
  fetchPendingJobs,
  approveJob,
  rejectJob,
  deleteUser,
} from "../store/slices/adminSlice";
import {
  Users,
  Briefcase,
  FileCheck,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";
import { useState } from "react";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { overview, users, pendingJobs, loading, error } = useAppSelector(
    (state) => state.admin
  );
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchDashboardOverview());
    dispatch(fetchAllUsers({ page: 1, limit: 10 }));
    dispatch(fetchPendingJobs({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleApproveJob = (jobId) => {
    if (window.confirm("Are you sure you want to approve this job?")) {
      dispatch(approveJob(jobId));
    }
  };

  const handleRejectJob = (jobId) => {
    if (window.confirm("Are you sure you want to reject this job?")) {
      dispatch(rejectJob(jobId));
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-max">
        {error && <ErrorAlert message={error} />}

        <h1 className="text-4xl font-bold text-gray-900 mb-12">
          Admin Dashboard
        </h1>

        {/* Overview Stats */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="card bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {overview.users.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {overview.users.candidates} candidates
                  </p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </div>

            <div className="card bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {overview.jobs.active}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {overview.jobs.pending} pending
                  </p>
                </div>
                <Briefcase className="h-12 w-12 text-green-200" />
              </div>
            </div>

            <div className="card bg-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Applications</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {overview.applications.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {overview.applications.pending} pending
                  </p>
                </div>
                <FileCheck className="h-12 w-12 text-purple-200" />
              </div>
            </div>

            <div className="card bg-orange-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Shortlisted</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {overview.applications.shortlisted}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {overview.applications.rejected} rejected
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-orange-200" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("pending-jobs")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "pending-jobs"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending Jobs ({pendingJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "users"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Users ({users.length})
          </button>
        </div>

        {/* Pending Jobs Tab */}
        {activeTab === "pending-jobs" && (
          <div className="space-y-4">
            {pendingJobs.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600">No pending jobs to approve</p>
              </div>
            ) : (
              pendingJobs.map((job) => (
                <div key={job._id} className="card">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{job.companyName}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {job.description.substring(0, 100)}...
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveJob(job._id)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-medium transition"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectJob(job._id)}
                        className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
