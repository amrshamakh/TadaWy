import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";
import { useForgotPassword } from "../hooks/useForgotPassword";
import LoadingSpinner from "../components/LoadingSpinner";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { email, setEmail, loading, handleSubmit } = useForgotPassword();

  return (
    <div className="min-h-screen bg-linear-to-b from-1% from-white via-teal-200 to-white to-95% dark:from-[#0b2a3a] dark:via-[#0f5a57] dark:to-[#0b2a3a] dark:to-99% flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200 dark:border-[#334155]">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img className="w-16 h-16" src={assets.logo} alt="logo" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          {t("forgotPassword.title")}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          {t("forgotPassword.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("forgotPassword.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("forgotPassword.emailPlaceholder")}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex justify-center items-center gap-2"
          >
            {loading ? t("forgotPassword.sending") : t("forgotPassword.sendButton")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
