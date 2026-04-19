import { useTranslation } from "react-i18next";

export default function StatsRow({ appointments = [] }) {
  const { t } = useTranslation();

  const allCount = appointments.length;
  const confirmedCount = appointments.filter((a) => (a.status || a.Status)?.toLowerCase() === "confirmed").length;
  const pendingCount = appointments.filter((a) => (a.status || a.Status)?.toLowerCase() === "pending").length;
  const cancelledCount = appointments.filter((a) => (a.status || a.Status)?.toLowerCase() === "cancelled").length;

  const stats = [
    { label: "all", value: allCount, color: "text-gray-800 dark:text-gray-200" },
    { label: "confirmed", value: confirmedCount, color: "text-teal-500" },
    { label: "pending", value: pendingCount, color: "text-orange-400" },
    { label: "cancelled", value: cancelledCount, color: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-100 dark:border-[#334155] shadow-sm px-5 py-4"
        >
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            {t(`doctorDashboard.appointments.stats.${s.label}`)}
          </p>
        </div>
      ))}
    </div>
  );
}