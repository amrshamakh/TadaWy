import { useState } from "react";
import { Clock, ChevronDown, ClipboardList } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useTranslation } from "react-i18next";

export default function AppointmentCard({ apt }) {
 const [expanded, setExpanded] = useState(false);
 const { t, i18n } = useTranslation();
 const paymentLabelMap = {
   online: t("doctorDashboard.appointments.paidOnline"),
   clinic: t("doctorDashboard.appointments.payAtClinic"),
 };
 const aptDuration = apt.duration || apt.Duration || "0min";
 const durationLabel = aptDuration.replace("min", t("doctorDashboard.schedule.minutes"));
 const aptTime = apt.time || apt.Time || "";
 const localizedTime = aptTime
   .replace("AM", t("common.am"))
   .replace("PM", t("common.pm"))
   .replace(/\s+/g, " ")
   .trim();
 const scheduleText = i18n.language === "ar"
   ? `${localizedTime} و ${durationLabel}`
   : `${localizedTime} · ${durationLabel}`;

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
            <p className="font-semibold text-gray-800 dark:text-slate-200 text-sm">{apt.name || apt.Name}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">{apt.id || apt.Id}</p>
          </div>
        </div>

        {/* Right: time + status + chevron */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 text-xs">
            <Clock className="w-4 h-4 text-teal-500" />
            {scheduleText}
          </div>
          <StatusBadge status={apt.status || apt.Status} />
          <ChevronDown
            className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (apt.phone || apt.Phone) && (
        <div className="border-t border-gray-100 dark:border-[#334155] px-5 py-4">
          <div className="flex gap-16 mb-4">
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">{t("doctorDashboard.appointments.phone")}</p>
              <p className="text-sm text-gray-700 dark:text-slate-300 font-medium">{apt.phone || apt.Phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">{t("doctorDashboard.appointments.payment")}</p>
              <p className="text-sm text-teal-500 font-medium">{paymentLabelMap[(apt.payment || apt.Payment)?.toLowerCase()] ?? (apt.payment || apt.Payment)}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-5 py-2 bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer">
              {t("doctorDashboard.appointments.viewProfile")}
            </button>
            <button className="px-5 py-2 border border-red-300 dark:border-red-900/50 text-red-400 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-semibold rounded-lg transition-colors cursor-pointer">
              {t("doctorDashboard.appointments.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}