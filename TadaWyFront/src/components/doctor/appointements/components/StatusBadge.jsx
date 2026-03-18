import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  Confirmed: {
    badge: "bg-teal-50 text-teal-600 border border-teal-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
  },
  Cancelled: {
    badge: "bg-red-50 text-red-400 border border-red-200",
    icon: <XCircle className="w-3.5 h-3.5 mr-1" />,
  },
  Pending: {
    badge: "bg-orange-50 text-orange-400 border border-orange-200",
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