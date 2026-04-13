import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  Confirmed: {
    badge: "bg-teal-50 text-teal-600 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
    icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
  },
  Cancelled: {
    badge: "bg-red-50 text-red-500 border border-red-200 dark:bg-red-950/20 dark:text-red-500 dark:border-red-900",
    icon: <XCircle className="w-3.5 h-3.5 mr-1" />,
  },
  Pending: {
    badge: "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-950/20 dark:text-orange-500 dark:border-orange-900",
    icon: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
  },
};

export default function StatusBadge({ status }) {
  const { badge, icon } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge}`}>
      {icon}
      {status}
    </span>
  );
}