// components/WeeklySummary.jsx
import { useTranslation } from "react-i18next";

export default function WeeklySummary({ workingDays, totalAppts, duration, fee }) {
  const { t } = useTranslation();
  const stats = [
    { label: t("doctorDashboard.schedule.workingDays"), value: workingDays },
    { label: t("doctorDashboard.schedule.totalAppts"), value: totalAppts },
    { label: t("doctorDashboard.schedule.apptDuration"), value: `${duration} ${t("doctorDashboard.schedule.minutes")}` },
    { label: t("doctorDashboard.schedule.perAppt"), value: `${fee} ${t("doctorDashboard.schedule.le")}` },
  ];

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm p-6">
      <h2 className="font-bold text-gray-800 dark:text-slate-200 text-[15px] mb-4">{t("doctorDashboard.schedule.summary")}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-xl px-4 py-3"
          >
            <p className="text-2xl font-extrabold text-teal-500 dark:text-teal-400 leading-tight">{value}</p>
            <p className="text-xs text-gray-400 dark:text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}