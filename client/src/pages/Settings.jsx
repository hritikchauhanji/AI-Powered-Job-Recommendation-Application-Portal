import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  changePassword,
  clearError,
  clearPasswordChangeSuccess,
} from "../store/slices/userSlice";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import ErrorAlert from "../components/common/ErrorAlert";

export default function Settings() {
  const dispatch = useAppDispatch();
  const { loading, error, passwordChangeSuccess } = useAppSelector(
    (state) => state.user
  );
  const { user } = useAppSelector((state) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      dispatch(clearPasswordChangeSuccess());
      return alert("New passwords do not match");
    }

    if (newPassword.length < 8) {
      return alert("Password must be at least 8 characters");
    }

    const result = await dispatch(changePassword({ oldPassword, newPassword }));

    if (changePassword.fulfilled.match(result)) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        dispatch(clearPasswordChangeSuccess());
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-max max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Settings</h1>

        {error && (
          <ErrorAlert message={error} onClose={() => dispatch(clearError())} />
        )}

        {passwordChangeSuccess && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">
                Password changed successfully!
              </p>
              <p className="text-green-700 text-sm mt-1">
                Your password has been updated.
              </p>
            </div>
          </div>
        )}

        {/* Change Password Section */}
        <div className="card">
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary-600" />
              Change Password
            </h2>
            <p className="text-gray-600 mt-1">
              Update your password to keep your account secure
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Password requirements:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
                  <li>✓ At least 8 characters</li>
                  <li>✓ Mix of uppercase and lowercase letters</li>
                  <li>✓ At least one number</li>
                  <li>✓ At least one special character (@, #, $, etc.)</li>
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading || !oldPassword || !newPassword || !confirmPassword
              }
              className="btn-primary w-full"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Account Info Section */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Account Information
          </h2>

          <div className="space-y-4">
            <div className="pb-4 border-b">
              <p className="text-sm text-gray-600">Email Address</p>
              <p className="font-medium text-gray-900 mt-1">{user?.email}</p>
            </div>

            <div className="pb-4 border-b">
              <p className="text-sm text-gray-600">Account Type</p>
              <p className="font-medium text-gray-900 mt-1 capitalize">
                {user?.role === "condidate" ? "Job Seeker" : user?.role}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium text-gray-900 mt-1">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Security Tips Section */}
        <div className="card mt-8 bg-yellow-50 border-2 border-yellow-200">
          <h2 className="text-lg font-bold text-yellow-900 mb-4">
            🔒 Security Tips
          </h2>
          <ul className="space-y-3 text-sm text-yellow-800">
            <li>• Use a strong password with a mix of characters</li>
            <li>• Never share your password with anyone</li>
            <li>• Change your password regularly (at least every 3 months)</li>
            <li>
              • If you suspect unauthorized access, change your password
              immediately
            </li>
            <li>• Log out from all devices if your password is compromised</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
