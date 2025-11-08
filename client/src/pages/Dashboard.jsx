import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchRecommendations } from "../store/slices/recommendationsSlice";
import { fetchMyApplications } from "../store/slices/applicationsSlice";
import { Sparkles, Briefcase } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    recommendations,
    count,
    loading: recLoading,
    error: recError,
  } = useAppSelector((state) => state.recommendations);
  const {
    myApplications,
    loading: appLoading,
    error: appError,
  } = useAppSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchRecommendations(5)); // Fetch top 5 recommendations
    dispatch(fetchMyApplications({ page: 1, limit: 10 })); // Fetch applications
  }, [dispatch]);

  const loading = recLoading || appLoading;
  const error = recError || appError;

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-max">
        {error && <ErrorAlert message={error} />}

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here are your AI-powered job recommendations
          </p>
        </div>

        {/* Recommendations Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Recommended for You
            </h2>
          </div>

          {recommendations.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">
                No recommendations yet. Complete your profile to get started!
              </p>
              <Link to="/profile" className="btn-primary inline-block">
                Update Profile
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Link
                  key={rec.jobId}
                  to={`/jobs/${rec.jobId}`}
                  className="card-hover"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {rec.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{rec.companyName}</p>
                  <p className="text-sm text-gray-500 mb-4">{rec.location}</p>

                  <div className="flex gap-6 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Match Score</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {(rec.similarity_score * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Skills Match</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {rec.skills_match.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <button className="btn-primary w-full mt-4">View Job</button>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Applications Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            My Applications
          </h2>

          {myApplications.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">
                You haven't applied to any jobs yet.
              </p>
              <Link to="/jobs" className="btn-primary inline-block">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map((app) => (
                <div key={app._id} className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {typeof app.jobId === "string"
                          ? "Job"
                          : app.jobId?.title || "Unknown Job"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Applied on{" "}
                        {new Date(app.appliedOn).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4 ${
                        app.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : app.status === "shortlisted"
                          ? "bg-blue-100 text-blue-800"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
