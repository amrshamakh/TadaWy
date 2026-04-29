import { useState } from "react";
import { Clock, ChevronDown, ClipboardList } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useTranslation } from "react-i18next";

export default function AppointmentCard({ apt, onConfirm, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const paymentLabelMap = {
    1: t("doctorDashboard.appointments.paidOnline"),
    0: t("doctorDashboard.appointments.payAtClinic"),
  };

  // Extract time and format duration from API data
  const dateObj = new Date(apt.appointmentDate);
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  const durationLabel = `${apt.durationMinutes} ${t("doctorDashboard.schedule.minutes")}`;
  const localizedTime = timeStr
    .replace("AM", t("common.am"))
    .replace("PM", t("common.pm"))
    .replace(/\s+/g, " ")
    .trim();
    
  const scheduleText = i18n.language === "ar"
    ? `${localizedTime} و ${durationLabel}`
    : `${localizedTime} · ${durationLabel}`;

  const handleAction = async (actionFn) => {
    setLoading(true);
    try {
      await actionFn(apt.id);
    } finally {
      setLoading(false);
    }
  };

  const isPast = new Date(apt.appointmentDate) < new Date();

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-100 dark:border-[#334155] shadow-sm overflow-hidden">
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Left: name + id */}
        <div className="flex items-center gap-3">
          <ClipboardList className="w-5 h-5 text-gray-400 dark:text-slate-500" />
          <div>
            <p className="font-semibold text-gray-800 dark:text-slate-200 text-sm">{apt.patientName}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">#{apt.id}</p>
          </div>
        </div>

        {/* Right: time + status + chevron */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 text-xs">
            <Clock className="w-4 h-4 text-teal-500" />
            {scheduleText}
          </div>
          <StatusBadge status={apt.status} />
          <ChevronDown
            className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-[#334155] px-5 py-4">
          <div className="flex gap-16 mb-4">
            {apt.patientPhone && (
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">{t("doctorDashboard.appointments.phone")}</p>
                <p className="text-sm text-gray-700 dark:text-slate-300 font-medium">{apt.patientPhone}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">{t("doctorDashboard.appointments.payment")}</p>
              <p className="text-sm text-teal-500 font-medium">{paymentLabelMap[apt.paymentMethod] ?? apt.paymentMethod}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-5 py-2 bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer">
              {t("doctorDashboard.appointments.viewProfile")}
            </button>
            
            {/* Confirm button - only if Pending (0) */}
            {apt.status === 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleAction(onConfirm); }}
                disabled={loading}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "..." : t("doctorDashboard.appointments.confirm")}
              </button>
            )}
            
            {/* Cancel button - only if Pending (0) or Confirmed (1) */}
            {(apt.status === 0 || apt.status === 1) && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleAction(onCancel); }}
                disabled={loading || isPast}
                title={isPast ? t("doctorDashboard.appointments.timePassed") : ""}
                className={`px-5 py-2 border border-red-300 dark:border-red-900/50 text-red-400 dark:text-red-500 text-sm font-semibold rounded-lg transition-colors 
                  ${isPast 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  } disabled:opacity-50`}
              >
                {loading ? "..." : t("doctorDashboard.appointments.cancel")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}