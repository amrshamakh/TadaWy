import { MapPin } from "lucide-react";
import "./Booking.css";
import { useTranslation } from "react-i18next";

export default function LocationCard({ doctor }) {
  const { t } = useTranslation();
  if (!doctor) return null;

  return (
    <section className="booking-card booking-location-card">
      <h3 className="booking-section-title">{t("booking.locationCard.title")}</h3>
      <div className="booking-location-header">
        <MapPin size={20} className="booking-location-icon" />
        <p className="booking-location-address-main">
          {doctor.address 
            ? `${doctor.address.street !== "UnKnown" ? doctor.address.street + ", " : ""}${doctor.address.city !== "UnKnown" ? doctor.address.city + ", " : ""}${doctor.address.state}`
            : (doctor.id ? t(`discover.clinicsData.${doctor.id}.address`) : doctor.address || "123 Medical Plaza, DownTown")}
        </p>
      </div>
      <p className="booking-location-desc">
        {doctor.addressDescription || doctor.location_description || t("booking.locationCard.locationDetailsPlaceholder")}
      </p>
    </section>
  );
}
