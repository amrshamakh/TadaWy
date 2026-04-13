// components/DurationCard.jsx
import { useTranslation } from "react-i18next";

const DURATIONS = [15, 20, 30, 45, 60];

export default function DurationCard({ duration, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm p-5 flex-1 min-w-[260px]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-teal-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
        <span className="font-semibold text-gray-800 dark:text-slate-200 text-sm">{t("doctorDashboard.schedule.duration")}</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-slate-400 mb-4">{t("doctorDashboard.schedule.durationSubtitle")}</p>

      <div className="flex flex-wrap gap-2">
        {DURATIONS.map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 cursor-pointer
              ${duration === d
                ? "border-teal-400 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold"
                : "border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] text-gray-500 dark:text-slate-400 hover:border-teal-300 hover:text-teal-500 dark:hover:text-teal-400"
              }`}
          >
            {d} {t("doctorDashboard.schedule.minutes")}
          </button>
        ))}
      </div>
    </div>
  );
}