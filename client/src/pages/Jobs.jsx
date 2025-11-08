import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, DollarSign, Briefcase, Filter, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchJobs } from "../store/slices/jobsSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";

export default function Jobs() {
  const dispatch = useAppDispatch();
  const { jobs, pagination, loading, error } = useAppSelector(
    (state) => state.jobs
  );

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchJobs({
        page,
        limit: 10,
        ...filters,
      })
    );
  }, [filters, page, dispatch]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ search: "", location: "", jobType: "" });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-max">
        <h1 className="text-4xl font-bold mb-2">Explore Opportunities</h1>
        <p className="text-gray-600 mb-12">
          Showing page <span className="font-medium">{pagination.page}</span> of{" "}
          <span className="font-medium">{pagination.totalPages}</span> —{" "}
          <span className="font-medium">{pagination.totalJobs}</span> jobs
          available
        </p>

        {error && <ErrorAlert message={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block card sticky top-20`}
            >
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X size={20} />
                </button>
              </div>
              <h2 className="font-bold text-lg mb-4 hidden lg:block">
                Filters
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Job title..."
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="input-field pl-10 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Bangalore"
                    value={filters.location}
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) =>
                      handleFilterChange("jobType", e.target.value)
                    }
                    className="input-field text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="btn-secondary w-full text-sm"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden btn-outline w-full mb-8 flex items-center justify-center gap-2"
            >
              <Filter size={20} />
              Show Filters
            </button>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner />
            ) : jobs.length === 0 ? (
              <div className="card text-center py-16">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No jobs found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <Link
                    key={job._id}
                    to={`/jobs/${job._id}`}
                    className="card-hover block transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 hover:text-primary-600">
                            {job.title}
                          </h3>
                          {job.companyName && (
                            <span className="ml-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                              {job.companyName}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin size={16} className="text-primary-600" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign
                              size={16}
                              className="text-primary-600"
                            />
                            ₹{job.salary?.min?.toLocaleString() ?? 0} - ₹
                            {job.salary?.max?.toLocaleString() ?? 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase size={16} className="text-primary-600" />
                            {job.jobType}
                          </div>
                          {job.experienceRequired > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-primary-600 font-bold">
                                EXP
                              </span>
                              {job.experienceRequired}+ yrs
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(job.skillsRequired ?? [])
                            .slice(0, 4)
                            .map((skill) => (
                              <span
                                key={skill}
                                className="badge-primary text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          {job.skillsRequired &&
                            job.skillsRequired.length > 4 && (
                              <span className="text-xs px-2 py-1 text-gray-600 bg-gray-100 rounded-full">
                                +{job.skillsRequired.length - 4} more
                              </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end min-w-[120px]">
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-medium mb-2 ${
                            job.status === "active"
                              ? "bg-green-100 text-green-700"
                              : job.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {job.status}
                        </span>
                        <span className="px-3 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                          {job.applicationsCount ?? 0} Applicants
                        </span>
                        <span className="text-xs text-gray-400 mt-4">
                          Posted {new Date(job.postedOn).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {/* Pagination controls */}
                {pagination.totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4 mt-10">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                      >
                        Previous
                      </button>
                      <span className="text-gray-700 text-base font-semibold">
                        Page{" "}
                        <span className="font-bold text-lg text-primary-600">
                          {pagination.page}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-lg">
                          {pagination.totalPages}
                        </span>
                      </span>
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(p + 1, pagination.totalPages))
                        }
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                      >
                        Next
                      </button>
                    </div>

                    {/* Page number buttons */}
                    <div className="flex gap-1">
                      {Array.from({ length: pagination.totalPages }).map(
                        (_, idx) => {
                          const pageNum = idx + 1;
                          // Show first page, last page, current page, and pages around current
                          const shouldShow =
                            pageNum === 1 ||
                            pageNum === pagination.totalPages ||
                            Math.abs(pageNum - pagination.page) <= 1;

                          if (!shouldShow) {
                            // Show ellipsis
                            if (pageNum === 2 && pagination.page > 3) {
                              return (
                                <span
                                  key={pageNum}
                                  className="px-2 py-1 text-gray-400"
                                >
                                  ...
                                </span>
                              );
                            }
                            if (
                              pageNum === pagination.totalPages - 1 &&
                              pagination.page < pagination.totalPages - 2
                            ) {
                              return (
                                <span
                                  key={pageNum}
                                  className="px-2 py-1 text-gray-400"
                                >
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
