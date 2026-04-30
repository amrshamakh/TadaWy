import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";
import { useResetPassword } from "../hooks/useResetPassword";


const ResetPassword = () => {
  const { t } = useTranslation();
  const { formData, formErrors, loading, handleChange, handleSubmit } = useResetPassword();

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
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("resetPassword.newPassword")}
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              placeholder="(A-Z) (a-z) (0-9) min 8 chars + symbol (@#$!…)"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
              disabled={loading}
            />

            {formErrors.newPassword && (
              <p className="mt-1 text-xs text-red-500">{formErrors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("resetPassword.confirmPassword")}
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Re-enter your new password"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
              disabled={loading}
            />
            {formErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? "Resetting…" : t("resetPassword.confirm")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;