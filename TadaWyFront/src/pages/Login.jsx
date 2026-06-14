import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { loginPatient } from "../modules/patient/api/loginPatientAPi";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";
import LoadingSpinner from "../components/LoadingSpinner";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoogleLogin = () => {
    // Redirect to backend endpoint for Google Login
    window.location.href = `https://localhost:7262/api/Auth/google-login`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginPatient(formData);
      if (res && res.token) {
        await login(res.token);
        const userRole = Array.isArray(res.role) ? res.role[0] : res.role;
        const normalizedRole = String(userRole || "").toLowerCase();
        if (from) {
          navigate(from, { replace: true });
        } else {
          if (normalizedRole === "doctor") navigate("/doctor/appointments");
          else if (normalizedRole === "admin") navigate("/admin");
          else navigate("/discover");
        }
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-1% from-white 
via-teal-100
to-white to-95% dark:from-[#020617] 
dark:via-[#0f766e] 
dark:to-[#020617] dark:to-99% flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200 dark:border-[#334155]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img className="w-16 h-16" src={assets.logo} alt="logo" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          {t('auth.login.title', 'Welcome back')}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          {t('auth.login.subtitle', 'Sign in to your TadaWy account')}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.personalInfo.email', 'Email')}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('auth.login.password', 'Password')}
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={t('auth.login.passwordPlaceholder', 'Enter your password')}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-teal-500 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
            >
              {t('auth.login.forgotPassword', 'Forgot password?')}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner small size="h-4 w-4" color="border-white" />
                <span>{t('auth.login.loading', 'Loading...')}</span>
              </>
            ) : t('auth.login.signIn', 'Sign In')}
          </button>
        </form>

        {/* Google Login Component */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="relative w-full flex items-center justify-center">
            <div className="border-t border-gray-200 dark:border-[#475569] w-full"></div>
            <span className="bg-white dark:bg-[#1E293B] px-3 text-sm text-gray-500 absolute uppercase font-bold tracking-widest">
              {t('auth.login.or', 'or')}
            </span>
          </div>
          <div className="w-full flex justify-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] hover:bg-gray-50 dark:hover:bg-[#3d4b5f] text-gray-700 dark:text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {t('auth.login.googleSignIn', 'Sign in with Google')}
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          {t('auth.login.noAccount', "Don't have an account?")}{" "}
          <Link
            to={'/signup'}
            className="text-teal-500 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-semibold"
          >
            {t('auth.login.signUpPatient', 'Sign up as a patient')}
          </Link>
          <span className="mx-1">{t('auth.login.or', 'or')}</span>
          <Link
            to={'/doctorApplication'}
            className="text-teal-500 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold text-sm"
          >
            {t('auth.login.signUpDoctor', 'doctor')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;