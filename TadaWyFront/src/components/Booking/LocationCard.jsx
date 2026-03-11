import { MapPin } from "lucide-react";
import "./Booking.css";

export default function LocationCard({ doctor }) {
  if (!doctor) return null;

  return (
    <section className="booking-card booking-location-card">
      <h3 className="booking-section-title">Location</h3>
      <div className="booking-location-header">
        <MapPin size={20} className="booking-location-icon" />
        <p className="booking-location-address-main">{doctor.address || "123 Medical Plaza, DownTown"}</p>
      </div>
      <p className="booking-location-desc">
        {doctor.location_description || "Located on the 5th floor of Medical Plaza building, with easy access from Main Street. Parking available in the building garage."}
      </p>
    </section>
  );
}
