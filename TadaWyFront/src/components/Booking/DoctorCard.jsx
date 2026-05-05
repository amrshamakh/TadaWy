import UserIcon from "../../assets/User.svg";
import "./Booking.css";
import { useTranslation } from "react-i18next";

export default function DoctorCard({ doctor }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  if (!doctor) return null;

  return (
    <section className="booking-card booking-doctor-card">
      <div className="booking-doctor-header">
        <div className="booking-doctor-avatar">
          <img
            src={doctor.imageUrl || UserIcon}
            alt="Doctor"
            className={`booking-doctor-avatar-img ${!doctor.imageUrl ? "placeholder-user-svg" : ""}`}
          />
        </div>
        <div className="booking-doctor-main">
          <h2 className="booking-doctor-name">
            {isAr 
              ? (doctor.nameAr || doctor.name || doctor.doctorNameAr || doctor.doctorName || doctor.doctor)
              : (doctor.nameEn || doctor.name || doctor.doctorNameEn || doctor.doctorName || doctor.doctor)
            }
          </h2>

          <div className="booking-doctor-tags">
            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">{t("booking.doctorCard.specialization")}:</span>
              <span className="booking-doctor-tag-value">
                {isAr
                  ? (doctor.specializationAr || doctor.specialtyAr || doctor.specialization || doctor.specialty)
                  : (doctor.specializationEn || doctor.specialtyEn || doctor.specialization || doctor.specialty)
                }
              </span>
            </div>

            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">{t("booking.doctorCard.experience")}:</span>
              <span className="booking-doctor-tag-value">
                {doctor.yearsOfExperience !== undefined 
                  ? t("doctorDashboard.profile.experienceSubtitle", { count: doctor.yearsOfExperience })
                  : t("doctorDashboard.profile.experienceSubtitle", { count: 4 })}
              </span>
            </div>

            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">{t("booking.doctorCard.phone")}:</span>
              <span className="booking-doctor-tag-value">{doctor.phoneNumber || doctor.phone || t("booking.doctorCard.notAvailable")}</span>
            </div>

            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">{t("booking.doctorCard.rating")}</span>
              <span className="booking-doctor-tag-value">
                {(doctor.rating ?? doctor.rate ?? 0).toFixed(1)}/5
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-doctor-about">
        <h3 className="booking-section-title">{t("booking.doctorCard.about")}</h3>
        <p className="booking-about-desc">
          {isAr
            ? (doctor.aboutAr || doctor.bioAr || doctor.bio || doctor.about || t("booking.doctorCard.aboutPlaceholder"))
            : (doctor.aboutEn || doctor.bioEn || doctor.bio || doctor.about || t("booking.doctorCard.aboutPlaceholder"))
          }
        </p>
      </div>
    </section>
  );
}
