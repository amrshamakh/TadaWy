import UserIcon from "../../assets/User.svg";
import "./Booking.css";
import { useTranslation } from "react-i18next";

export default function DoctorCard({ doctor }) {
  const { t } = useTranslation();
  if (!doctor) return null;

  return (
    <section className="booking-card booking-doctor-card">
      <div className="booking-doctor-header">
        <div className="booking-doctor-avatar">
          <img
            src={UserIcon}
            alt="Doctor"
            className="booking-doctor-avatar-img placeholder-user-svg"
          />
        </div>
        <div className="booking-doctor-main">
          <h2 className="booking-doctor-name">
            {doctor.source === "api"
              ? doctor.doctor
              : doctor.id
                ? t(`discover.clinicsData.${doctor.id}.doctor`)
                : doctor.doctor}
          </h2>

          <div className="booking-doctor-tags">
            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">{t("booking.doctorCard.specialization")}:</span>
              <span className="booking-doctor-tag-value">
                {doctor.source === "api"
                  ? doctor.specialty
                  : doctor.id
                    ? t(`discover.clinicsData.${doctor.id}.specialty`)
                    : doctor.specialty}
              </span>
            </div>

            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">{t("booking.doctorCard.experience")}:</span>
              <span className="booking-doctor-tag-value">
                {t("doctorDashboard.profile.experienceSubtitle", {
                  count: doctor.yearsExperience ?? 0,
                })}
              </span>
            </div>

            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">{t("booking.doctorCard.phone")}:</span>
              <span className="booking-doctor-tag-value">{doctor.phone || t("booking.doctorCard.notAvailable")}</span>
            </div>

            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">{t("booking.doctorCard.rating")}</span>
              <span className="booking-doctor-tag-value">
                {doctor.rating?.toFixed ? doctor.rating.toFixed(1) : doctor.rating}/5
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-doctor-about">
        <h3 className="booking-section-title">{t("booking.doctorCard.about")}</h3>
        <p className="booking-about-desc">
          {doctor.about || t("booking.doctorCard.aboutPlaceholder")}
        </p>
      </div>
    </section>
  );
}

