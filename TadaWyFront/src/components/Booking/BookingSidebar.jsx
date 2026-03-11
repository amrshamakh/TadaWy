import { useState } from "react";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import "./Booking.css";

const TIME_OPTIONS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
];

export default function BookingSidebar({ doctor }) {
  const [dateOffset, setDateOffset] = useState(0);
  const [selectedDateStr, setSelectedDateStr] = useState("1 Mar");
  const [selectedTime, setSelectedTime] = useState(null);

  const getDays = () => {
    const baseDate = new Date(2026, 1, 28);
    const daysArr = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + dateOffset + i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dateNum = d.getDate();
      const monthName = d.toLocaleDateString("en-US", { month: "short" });
      daysArr.push({
        day: dayName,
        date: `${dateNum} ${monthName}`,
      });
    }
    return daysArr;
  };

  const currentDays = getDays();

  const handlePrev = () => setDateOffset(prev => prev - 1);
  const handleNext = () => setDateOffset(prev => prev + 1);

  const handleBook = () => {
    if (!doctor || !selectedDateStr || !selectedTime) return;
    console.log(
      `Booking appointment with ${doctor.doctor} on ${selectedDateStr} at ${selectedTime}`
    );
  };

  const isDisabled = !selectedDateStr || !selectedTime;

  return (
    <aside className="booking-card booking-sidebar">
      <div className="booking-sidebar-header-bar">
        <Calendar size={20} className="booking-sidebar-header-icon" />
        <h3 className="booking-sidebar-header-title">Book your appointment</h3>
      </div>

      <div className="booking-sidebar-content">
        <div className="booking-sidebar-section">
          <p className="booking-sidebar-label">Select Day/Date:</p>
          <div className="booking-date-carousel">
            <button type="button" className="booking-carousel-nav" onClick={handlePrev} aria-label="Previous options">
              <ArrowLeft size={20} />
            </button>

            <div className="booking-date-grid">
              {currentDays.map((item) => (
                <button
                  key={item.date}
                  type="button"
                  className={`booking-date-pill ${selectedDateStr === item.date ? "booking-date-pill-selected" : ""
                    }`}
                  onClick={() => setSelectedDateStr(item.date)}
                >
                  <span className="booking-date-pill-day">{item.day}</span>
                  <span className="booking-date-pill-date">{item.date}</span>
                </button>
              ))}
            </div>

            <button type="button" className="booking-carousel-nav" onClick={handleNext} aria-label="Next options">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="booking-sidebar-section">
          <p className="booking-sidebar-label">Available Times:</p>
          <div className="booking-time-grid">
            {TIME_OPTIONS.map((time) => (
              <button
                key={time}
                type="button"
                className={`booking-time-pill ${selectedTime === time ? "booking-time-pill-selected" : ""
                  }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="booking-sidebar-footer">
          <div className="booking-price">
            <span className="booking-price-label">Appointment Cost:</span>
            <span className="booking-price-box">
              <span className="booking-price-value">150</span>
              <span className="booking-price-currency"> L.E</span>
            </span>
          </div>
          <div className="booking-submit-wrapper">
            <button
              type="button"
              className="booking-submit-btn"
              onClick={handleBook}
            >
              <Calendar size={18} className="booking-submit-icon" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

