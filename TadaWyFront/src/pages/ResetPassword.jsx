import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const nextErrors = { newPassword: "", confirmPassword: "" };

    if (formData.newPassword.length < 6) {
      nextErrors.newPassword = t("resetPassword.errors.weakPassword");
      hasError = true;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword = t("resetPassword.errors.passwordMismatch");
      hasError = true;
    }

    setFormErrors(nextErrors);
    if (hasError) {
      return;
    }

    setToastMessage(t("resetPassword.success"));
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-1% from-white via-teal-200 to-white to-95% dark:from-[#0b2a3a] dark:via-[#0f5a57] dark:to-[#0b2a3a] dark:to-99% flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200 dark:border-[#334155]">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img className="w-16 h-16" src={assets.logo} alt="logo" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          {t("resetPassword.title")}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          {t("resetPassword.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("resetPassword.email")}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={t("resetPassword.emailPlaceholder")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("resetPassword.newPassword")}
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              placeholder={t("resetPassword.newPasswordPlaceholder")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            />
            {formErrors.newPassword && (
              <p className="mt-1 text-xs text-red-500">{formErrors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("resetPassword.confirmPassword")}
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder={t("resetPassword.confirmPasswordPlaceholder")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            />
            {formErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>
            )}

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t("resetPassword.passwordHint")}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            {t("resetPassword.confirm")}
          </button>
        </form>
      </div>

      {toastMessage && (
        <div className="fixed top-4 right-4 z-[70] rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2 text-sm shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ResetPassword;