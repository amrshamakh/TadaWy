import UserIcon from "../../assets/User.svg";
import "./Booking.css";

export default function DoctorCard({ doctor }) {
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
          <h2 className="booking-doctor-name">{doctor.doctor}</h2>

          <div className="booking-doctor-tags">
            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">Specialization:</span>
              <span className="booking-doctor-tag-value">{doctor.specialty}</span>
            </div>

            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">Years of experience:</span>
              <span className="booking-doctor-tag-value">
                {doctor.experience || "4 Years"}
              </span>
            </div>

            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">Phone Number:</span>
              <span className="booking-doctor-tag-value">{doctor.phone || "Not available"}</span>
            </div>

            <div className="booking-doctor-tag">
              <span className="booking-doctor-tag-label">Rating Overall</span>
              <span className="booking-doctor-tag-value">
                {doctor.rating?.toFixed ? doctor.rating.toFixed(1) : doctor.rating}/5
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-doctor-about">
        <h3 className="booking-section-title">About</h3>
        <p className="booking-about-desc">
          {doctor.about || "Located on the 5th floor of Medical Plaza building, with easy access from Main Street. Parking available in the building garage."}
        </p>
      </div>
    </section>
  );
}

