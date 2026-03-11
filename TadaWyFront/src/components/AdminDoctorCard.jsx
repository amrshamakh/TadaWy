import { useTranslation } from "react-i18next";
import { useLocalizedField } from "../hooks/useLocalizedField";
export default function DoctorCard({ doctor, onClick }) {
   const { t } = useTranslation();
    const localize = useLocalizedField();
  const statusStyles = {
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-600",
    Pending: "bg-yellow-100 text-yellow-700",
    Banned: "bg-gray-200 text-gray-600",
  };

  return (
    <div
      className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-[#334155]  p-5 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(doctor)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-white text-base">{localize(doctor, "name")}</h3>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[doctor.status]}`}>
          {t(`admin.doctorCard.status.${doctor.status}`)}
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-[#94A3B8]"> {t("admin.doctorCard.id")}: {doctor.id}</p>
      <p className="text-sm text-gray-500 dark:text-[#94A3B8]">{t("admin.doctorCard.createdAt")}: {doctor.createdAt}</p>
      <p className="text-sm text-gray-500 dark:text-[#94A3B8]">{t("admin.doctorCard.specialization")}: {localize(doctor,"specialization") || "—"}</p>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
          onClick={(e) => { e.stopPropagation(); onClick(doctor); }}
        >
         {t("admin.doctorCard.details")}
        </button>
      </div>
    </div>
  );
}