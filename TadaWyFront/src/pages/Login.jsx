import { useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { loginPatient } from "../modules/patient/api/loginPatientAPi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Login data:", formData);
      const res = await loginPatient(formData);
      if (res && res.token) {
        await login(res.token, res.refreshToken);
        navigate("/discover");
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
via-teal-200
to-white to-95% dark:from-[#0b2a3a] 
dark:via-[#0f5a57] 
dark:to-[#0b2a3a] dark:to-99% flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200 dark:border-[#334155]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img className="w-16 h-16" src={assets.logo} alt="logo" />
          </div>
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
            <a
              href="#"
              className="text-sm text-teal-500 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
            >
              {t('auth.login.forgotPassword', 'Forgot password?')}
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? "Loading..." : t('auth.login.signIn', 'Sign In')}
          </button>
        </form>

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