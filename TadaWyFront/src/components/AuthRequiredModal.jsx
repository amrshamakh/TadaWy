import { useTranslation } from "react-i18next";

export default function AuthRequiredModal({ onLogin, onCancel }) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] p-6 shadow-2xl">
        <p className="text-base font-semibold text-gray-900 dark:text-white mb-5">
          {t("authRequired.message", "Please login first")}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#475569] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-colors"
          >
            {t("authRequired.cancel", "Cancel")}
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-colors"
          >
            {t("authRequired.login", "Login")}
          </button>
        </div>
      </div>
    </div>
  );
}
