import { Calendar } from "lucide-react";
import AppointmentCard from "./AppointmentCard";
import { useTranslation } from "react-i18next";

export default function DateGroup({ dateLabel, apts }) {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      {/* Group Header */}
      <div className="flex items-center gap-3 mb-3">
        <Calendar className="w-4 h-4 text-teal-500 shrink-0" />
        <span className="text-sm font-semibold text-gray-700">{dateLabel}</span>
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">{apts.length} {t("doctorDashboard.appointments.totalAppts")}</span>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {apts.map((apt) => (
          <AppointmentCard key={apt.id} apt={apt} />
        ))}
      </div>
    </div>
  );
}