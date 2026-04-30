import { useTranslation } from "react-i18next";

export default function StatsRow({ stats = [] }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-5">
      {stats.filter(s => s && s.label).map((s) => (
        <div
          key={s.label}
          className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-100 dark:border-[#334155] shadow-sm px-5 py-4"
        >
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.value}</p>
          <p className={`text-sm font-semibold mt-0.5 ${
            s.label === "confirmed" ? "text-emerald-500" :
            s.label === "upcoming" ? "text-yellow-500" :
            (s.label === "cancelled" || s.label === "missed") ? "text-red-500" :
            "text-gray-500 dark:text-slate-400"
          }`}>
            {t(`doctorDashboard.appointments.stats.${s.label || 'all'}`)}
          </p>
        </div>
      ))}
    </div>
  );
}