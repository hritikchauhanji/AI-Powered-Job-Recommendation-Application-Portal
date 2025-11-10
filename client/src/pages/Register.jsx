import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { register, login } from "../store/slices/authSlice";
import { User, Mail, Lock, Upload } from "lucide-react";
import ErrorAlert from "../components/common/ErrorAlert";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "condidate",
    profileImage: null,
  });
  const [showError, setShowError] = useState(true);
  const [previewImage, setPreviewImage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Please accept terms and conditions");
      return;
    }

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("username", formData.username);
    fd.append("email", formData.email);
    fd.append("password", formData.password);
    fd.append("role", formData.role);
    if (formData.profileImage) fd.append("profileImage", formData.profileImage);

    const result = await dispatch(register(fd));
    if (register.fulfilled.match(result)) {
      await dispatch(
        login({ identifier: formData.email, password: formData.password })
      );
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Join Now</h1>
        <p className="text-center text-gray-600 mb-8">Create your account</p>

        {error && showError && (
          <ErrorAlert message={error} onClose={() => setShowError(false)} />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-primary-200"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <label className="cursor-pointer flex-1">
                <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                  <Upload className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="text-sm text-primary-600 font-medium">
                    Upload
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                name="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Min 8 chars, uppercase, lowercase, number, special char
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Account Type
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="condidate">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 mt-1"
              required
            />
            <span className="text-sm text-gray-600">
              I agree to Terms of Service and Privacy Policy
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="btn-primary w-full mt-6"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
