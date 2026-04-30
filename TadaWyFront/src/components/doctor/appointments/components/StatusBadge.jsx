import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const STATUS_CONFIG = {
  confirmed: {
    badge: "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  cancelled: {
    badge: "bg-red-50 text-red-500 border border-red-200 dark:bg-red-950/20 dark:text-red-500 dark:border-red-900",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  upcoming: {
    badge: "bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-500 dark:border-yellow-900",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  missed: {
    badge: "bg-red-50 text-red-500 border border-red-200 dark:bg-red-950/20 dark:text-red-500 dark:border-red-900",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  
  // Map numeric status from API to string status
  const statusMap = {
    0: "upcoming",
    1: "confirmed",
    2: "cancelled",
    3: "missed",
  };
  
  const statusKey = typeof status === "number" ? statusMap[status] : status;
  const { badge, icon } = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.upcoming;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge}`}>
      {icon}
      {t(`doctorDashboard.appointments.stats.${statusKey || 'upcoming'}`)}
    </span>
  );
}