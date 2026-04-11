import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import infoIcon from "../../assets/info.svg";
import html2canvas from "html2canvas";
import { useAuth } from "../../context/AuthContext";
import PaymentMethodModal from "./payments/PaymentMethodModal";
import BookingReceiptModal from "./payments/BookingReceiptModal";
import BookingSuccessModal from "./payments/BookingSuccessModal";
import { getVisibleDays, toReadableDateTime } from "./utils/bookingDate";
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
  const { user } = useAuth();
  const baseDate = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }, []);
  const [dateOffset, setDateOffset] = useState(0);
  const [selectedDateStr, setSelectedDateStr] = useState(
    `${baseDate.getDate()} ${baseDate.toLocaleDateString("en-US", { month: "short" })}`
  );
  const [selectedTime, setSelectedTime] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const receiptRef = useRef(null);

  const appointmentCost = doctor?.price || 150;

  const currentDays = useMemo(() => getVisibleDays(baseDate, dateOffset), [baseDate, dateOffset]);

  const handlePrev = () => setDateOffset(prev => prev - 1);
  const handleNext = () => setDateOffset(prev => prev + 1);

  const handleBook = () => {
    if (!doctor || !selectedDateStr || !selectedTime) return;
    setActiveModal("payment");
  };

  const isDisabled = !selectedDateStr || !selectedTime;

  const patientName = useMemo(() => {
    if (!user) return "John Doe";
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return fullName || user.name || "John Doe";
  }, [user]);

  const patientEmail = user?.email || "JohnDoe@gmail.com";

  const appointmentDateValue = useMemo(
    () => toReadableDateTime(selectedDateStr, selectedTime),
    [selectedDateStr, selectedTime]
  );

  const receiptNumber = useMemo(
    () => `RX-${Date.now().toString().slice(-10)}`,
    []
  );

  const handlePaymentSelection = (method) => {
    if (method === "offline") {
      setActiveModal("receipt");
      return;
    }
    setActiveModal(null);
  };

  const handlePrintReceipt = async () => {
    if (!receiptRef.current || isPrinting) return;
    setIsPrinting(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `receipt-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to export receipt image", error);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleReceiptDone = () => setActiveModal("success");

  useEffect(() => {
    if (activeModal !== "success") return;
    const timer = setTimeout(() => setActiveModal(null), 1200);
    return () => clearTimeout(timer);
  }, [activeModal]);

  return (
    <aside className="booking-card booking-sidebar">
      <div className="booking-sidebar-header-bar">
        <Calendar size={20} className="booking-sidebar-header-icon" />
        <h3 className="booking-sidebar-header-title">Book your appointment</h3>
      </div>

      <div className="booking-sidebar-content">
        <div className="booking-sidebar-section">
          <p className="booking-sidebar-label flex items-center gap-1.5">
            Select Day/Date:
            <img src={infoIcon} alt="" className="w-3.5 h-3.5 shrink-0" />
          </p>
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
              <span className="booking-price-value">{appointmentCost}</span>
              <span className="booking-price-currency"> L.E</span>
            </span>
          </div>
          <div className="booking-submit-wrapper">
            <button
              type="button"
              className="booking-submit-btn"
              onClick={handleBook}
              disabled={isDisabled}
            >
              <Calendar size={18} className="booking-submit-icon" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {activeModal && (
        <div
          className="fixed inset-0 z-[98]"
          style={{ backgroundColor: "rgba(255,255,255,0.78)" }}
        />
      )}

      {activeModal === "payment" && (
        <PaymentMethodModal onSelectMethod={handlePaymentSelection} />
      )}

      {activeModal === "receipt" && (
        <BookingReceiptModal
          receiptRef={receiptRef}
          receiptNumber={receiptNumber}
          patientName={patientName}
          patientEmail={patientEmail}
          doctor={doctor}
          appointmentDateValue={appointmentDateValue}
          appointmentCost={appointmentCost}
          isPrinting={isPrinting}
          onPrintReceipt={handlePrintReceipt}
          onDone={handleReceiptDone}
        />
      )}

      {activeModal === "success" && <BookingSuccessModal />}
    </aside>
  );
}

