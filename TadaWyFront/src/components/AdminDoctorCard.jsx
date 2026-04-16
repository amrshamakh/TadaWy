import { useTranslation } from "react-i18next";
import { useLocalizedField } from "../hooks/useLocalizedField";
import { User, Calendar, Briefcase, Hash, ChevronRight } from "lucide-react";

export default function DoctorCard({ doctor, onClick }) {
  const { t } = useTranslation();
  const localize = useLocalizedField();

  const statusStyles = {
    Approved: "bg-green-100/80 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    Rejected: "bg-red-100/80 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    Pending: "bg-yellow-100/80 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",
    Banned: "bg-gray-100/80 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  };

  const statusColors = {
    Approved: "bg-green-500",
    Rejected: "bg-red-500",
    Pending: "bg-yellow-500",
    Banned: "bg-gray-500",
  };

  return (
    <div
      className="group bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-[#334155] p-4 cursor-pointer hover:shadow-xl hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-300"
      onClick={() => onClick(doctor)}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 dark:text-white text-base truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {localize(doctor, "name")}
              </h3>
              <div className={`mt-0.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold w-fit ${statusStyles[doctor.status]}`}>
                 <span className={`w-1 h-1 rounded-full ${statusColors[doctor.status]}`} />
                {t(`admin.doctorCard.status.${doctor.status}`)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Hash size={13} className="text-teal-500 shrink-0" />
            <span className="font-medium text-xs whitespace-nowrap">{t("admin.doctorCard.id")}:</span>
            <span className="font-mono text-[10px] opacity-80 truncate">{doctor.id}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={13} className="text-teal-500 shrink-0" />
            <span className="font-medium text-xs whitespace-nowrap">{t("admin.doctorCard.createdAt")}:</span>
            <span className="text-xs">{doctor.createdAt}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Briefcase size={13} className="text-teal-500 shrink-0" />
            <span className="font-medium text-xs whitespace-nowrap">{t("admin.doctorCard.specialization")}:</span>
            <span className="truncate text-xs">{localize(doctor, "specialization") || "—"}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-[#334155] flex justify-end">
        <button
          className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold text-xs hover:gap-1.5 transition-all"
          onClick={(e) => { e.stopPropagation(); onClick(doctor); }}
        >
          {t("admin.doctorCard.details")}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}