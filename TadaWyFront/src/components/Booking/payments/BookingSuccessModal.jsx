import { Check } from "lucide-react";
import successFireworks from "../../../assets/booking-success-fireworks.png";

export default function BookingSuccessModal() {
  return (
    <div
      className="booking-modal success-modal"
      role="dialog"
      aria-modal="true"
      style={{ width: "min(74vw, 360px)", zIndex: 101 }}
    >
      <div className="success-card" style={{ minHeight: 240 }}>
        <img
          src={successFireworks}
          alt=""
          className="success-fireworks-bg"
          style={{ opacity: 0.38 }}
        />
        <div className="success-content" style={{ minHeight: 240 }}>
          <span className="success-check">
            <Check size={28} />
          </span>
          <h3 style={{ fontWeight: 500 }}>Booked Successfully</h3>
          <p>Thank you for Booking with Us</p>
        </div>
      </div>
    </div>
  );
}
