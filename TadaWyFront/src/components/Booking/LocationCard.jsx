import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LocationCard({ doctor }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  if (!doctor) return null;

  const mainAddress = doctor.address
    ? [doctor.address.city, doctor.address.state].filter(p => p && p !== "UnKnown").join(", ")
    : [doctor.city, doctor.state].filter(Boolean).join(", ");

  const street = doctor.address?.street && doctor.address.street !== "UnKnown" ? doctor.address.street : "";

  const details = isAr
    ? (doctor.addressDescriptionAr || doctor.addressDescription || doctor.location_description)
    : (doctor.addressDescriptionEn || doctor.addressDescription || doctor.location_description);

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex flex-col gap-4">
      <p className="text-gray-400 dark:text-gray-500 text-[0.65rem] font-semibold uppercase tracking-wide m-0">
        {t("booking.locationCard.title")}
      </p>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 flex items-center justify-center flex-shrink-0 mt-0.5">
          <MapPin size={16} className="text-teal-500 dark:text-teal-400" />
        </div>
        <div>
          <p className="text-gray-800 dark:text-white text-sm font-bold m-0 mb-0.5">{mainAddress || "—"}</p>
          {street && <p className="text-gray-400 dark:text-gray-500 text-xs m-0">{street}</p>}
        </div>
      </div>

      {details && (
        <div className="flex items-start gap-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2.5 border border-gray-100 dark:border-slate-600">
          <span className="text-teal-400 text-base leading-none mt-0.5">⊙</span>
          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed m-0">{details}</p>
        </div>
      )}
    </section>
  );
}
