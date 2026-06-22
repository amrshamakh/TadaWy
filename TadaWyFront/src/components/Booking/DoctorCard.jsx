import UserIcon from "../../assets/User.svg";
import { useTranslation } from "react-i18next";
import { Star, Phone, Clock, MapPin } from "lucide-react";

export default function DoctorCard({ doctor }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  if (!doctor) return null;

  const name = isAr
    ? (doctor.nameAr || doctor.doctorNameAr || doctor.doctorName || doctor.name)
    : (doctor.nameEn || doctor.doctorNameEn || doctor.doctorName || doctor.name);

  const specialty = isAr
    ? (doctor.specializationAr || doctor.specialtyAr || doctor.specialization || doctor.specialty)
    : (doctor.specializationEn || doctor.specialtyEn || doctor.specialization || doctor.specialty);

  const about = isAr
    ? (doctor.aboutAr || doctor.bioAr || doctor.bio || doctor.about)
    : (doctor.aboutEn || doctor.bioEn || doctor.bio || doctor.about);

  const addressDesc = isAr
    ? (doctor.addressDescriptionAr || doctor.addressDescription || doctor.location_description)
    : (doctor.addressDescriptionEn || doctor.addressDescription || doctor.location_description);

  const location = (doctor.address
    ? [doctor.address.city, doctor.address.state].filter(p => p && p !== "UnKnown").join(", ")
    : [doctor.city, doctor.state].filter(Boolean).join(", ")) + (addressDesc ? ` - ${addressDesc}` : "");

  const rating = (doctor.rating ?? doctor.rate ?? 0).toFixed(1);
  const reviewsCount = doctor.reviewsCount ?? (Array.isArray(doctor.reviews) ? doctor.reviews.length : 0);
  const experience = doctor.yearsOfExperience;
  const phone = doctor.phoneNumber || doctor.phone;

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Top: avatar + name + rating */}
      <div className="flex items-center gap-5 px-6 pt-6 pb-5">
        <div className="w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-teal-400 flex-shrink-0 bg-gray-100 dark:bg-slate-700">
          <img
            src={doctor.imageUrl || UserIcon}
            alt={name || t("booking.doctorCard.doctor")}
            className={`w-full h-full ${doctor.imageUrl ? "object-cover object-top" : "object-contain p-1"}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-gray-900 dark:text-white text-2xl font-extrabold leading-tight mb-2">{name}</h2>
          <span className="inline-block bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-bold px-4 py-1 rounded-full border border-teal-200 dark:border-teal-700">
            {specialty}
          </span>
        </div>
        {/* Rating */}
        <div className="flex-shrink-0 text-right">
          <div className="flex items-center gap-1 justify-end mb-1" aria-hidden="true">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={16} className={i <= Math.round(Number(rating)) ? "fill-teal-400 text-teal-400" : "fill-gray-200 dark:fill-slate-600 text-gray-200 dark:text-slate-600"} />
            ))}
          </div>
          <p 
            className="text-gray-600 dark:text-gray-400 text-sm font-bold"
            aria-label={`${rating} out of 5 stars from ${reviewsCount} reviews`}
          >
            {rating}/5 · {reviewsCount} {t("common.reviews")}
          </p>
        </div>
      </div>

      {/* 3-column info row - Replaced flex-wrap with CSS Grid for clean responsiveness */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t border-b border-gray-100 dark:border-slate-700 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-700 rtl:divide-x-reverse">
        <div className="md:col-span-1 px-6 py-5">
          <div className="flex items-center gap-2 text-teal-500 dark:text-teal-400 text-[0.85rem] font-bold uppercase tracking-widest mb-2">
            <Phone size={14} aria-hidden="true" />
            <span>{t("booking.doctorCard.phone")}</span>
          </div>
          <p className="text-gray-900 dark:text-white text-base font-extrabold m-0">{phone || t("booking.doctorCard.notAvailable")}</p>
        </div>
        <div className="md:col-span-1 px-6 py-5">
          <div className="flex items-center gap-2 text-teal-500 dark:text-teal-400 text-[0.85rem] font-bold uppercase tracking-widest mb-2">
            <Clock size={14} aria-hidden="true" />
            <span>{t("booking.doctorCard.experience")}</span>
          </div>
          <p className="text-gray-900 dark:text-white text-base font-extrabold m-0">
            {experience !== undefined
              ? t("doctorDashboard.profile.experienceSubtitle", { count: experience })
              : t("booking.doctorCard.notAvailable")}
          </p>
        </div>
        <div className="md:col-span-2 px-6 py-5">
          <div className="flex items-center gap-2 text-teal-500 dark:text-teal-400 text-[0.85rem] font-bold uppercase tracking-widest mb-2">
            <MapPin size={14} aria-hidden="true" />
            <span>{t("booking.locationCard.title")}</span>
          </div>
          <p className="text-gray-900 dark:text-white text-base font-extrabold m-0 break-words whitespace-normal leading-snug">
            {location || "—"}
          </p>
        </div>
      </div>

      {/* About */}
      <div className="px-6 py-6">
        <p className="text-gray-400 dark:text-slate-400 text-[0.85rem] font-bold uppercase tracking-widest mb-3">
          {t("booking.doctorCard.about")}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-[1.05rem] font-medium leading-relaxed m-0">
          {about || t("booking.doctorCard.aboutPlaceholder")}
        </p>
      </div>
    </section>
  );
}
