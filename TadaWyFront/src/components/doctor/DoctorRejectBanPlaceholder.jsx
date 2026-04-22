import { useTranslation } from "react-i18next";

export default function DoctorRejectBanPlaceholder() {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Reject & Ban
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        {t("common.comingSoon", "This page is coming soon.")}
      </p>
    </div>
  );
}
