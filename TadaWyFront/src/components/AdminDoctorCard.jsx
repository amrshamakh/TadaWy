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
      className="group bg-white dark:bg-[#1E293B] flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-[#334155] p-6 cursor-pointer hover:shadow-xl hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-300 h-full"
      onClick={() => onClick(doctor)}
    >
      <div>
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <User size={26} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 dark:text-white text-lg truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {localize(doctor, "name")}
              </h3>
              <div className={`mt-1.5 flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold w-fit ${statusStyles[doctor.status]}`}>
                <span className={`w-2 h-2 rounded-full ${statusColors[doctor.status]}`} />
                {t(`admin.doctorCard.status.${doctor.status}`)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-2">
          <div className="flex items-center gap-3 text-base text-gray-600 dark:text-gray-400">
            <Hash size={18} className="text-teal-500 shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">{t("admin.doctorCard.id")}:</span>
            <span className="font-mono text-xs opacity-80 truncate">{doctor.id}</span>
          </div>
          <div className="flex items-center gap-3 text-base text-gray-600 dark:text-gray-400">
            <Calendar size={18} className="text-teal-500 shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">{t("admin.doctorCard.createdAt")}:</span>
            <span className="text-sm">{doctor.createdAt}</span>
          </div>
          <div className="flex items-center gap-3 text-base text-gray-600 dark:text-gray-400">
            <Briefcase size={18} className="text-teal-500 shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">{t("admin.doctorCard.specialization")}:</span>
            <span className="truncate text-sm">{localize(doctor, "specialization") || "—"}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#334155] flex justify-end">
        <button
          className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-sm hover:gap-2 transition-all"
          onClick={(e) => { e.stopPropagation(); onClick(doctor); }}
        >
          {t("admin.doctorCard.details")}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}