import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { Sparkles, Briefcase, TrendingUp } from "lucide-react";

export default function Home() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-32">
        <div className="container-max text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect Job with AI
          </h1>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Discover job opportunities tailored to your skills and experience
            with our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    user?.role === "recruiter"
                      ? "/recruiter/dashboard"
                      : "/dashboard"
                  }
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/jobs"
                  className="btn-outline border-white text-white hover:bg-white/10"
                >
                  Browse Jobs
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="btn-outline border-white text-white hover:bg-white/10"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold">50K+</div>
              <p className="text-primary-200 text-sm mt-2">Job Listings</p>
            </div>
            <div>
              <div className="text-4xl font-bold">100K+</div>
              <p className="text-primary-200 text-sm mt-2">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold">95%</div>
              <p className="text-primary-200 text-sm mt-2">Match Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-max">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose JobPortal AI?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-hover text-center">
              <Sparkles className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">AI-Powered Matching</h3>
              <p className="text-gray-600">
                Advanced algorithm matches your skills with perfect
                opportunities
              </p>
            </div>

            <div className="card-hover text-center">
              <Briefcase className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Curated Opportunities</h3>
              <p className="text-gray-600">
                Access thousands of vetted job listings from top companies
              </p>
            </div>

            <div className="card-hover text-center">
              <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Track Progress</h3>
              <p className="text-gray-600">
                Monitor applications and get real-time status updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Join thousands of professionals finding their dream jobs
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-block"
            >
              Start Your Journey
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
