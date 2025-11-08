import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  forgotPasswordRequest,
  clearForgotPasswordSuccess,
} from "../store/slices/authSlice";
import { Mail } from "lucide-react";
import ErrorAlert from "../components/common/ErrorAlert";

export default function ForgotPassword() {
  const dispatch = useAppDispatch();
  const { loading, error, forgotPasswordSuccess } = useAppSelector(
    (state) => state.auth
  );
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(forgotPasswordRequest(email));
  };

  if (forgotPasswordSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
        <div className="card w-full max-w-md text-center">
          <div className="mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h1>
          <p className="text-gray-600 mb-6">
            We've sent a password reset code to <strong>{email}</strong>
          </p>
          <Link to="/reset-password" className="btn-primary inline-block mb-4">
            Enter Reset Code
          </Link>
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          Forgot Password?
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your email and we'll send you a reset code
        </p>

        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-primary-600 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
