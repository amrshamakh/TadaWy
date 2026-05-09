import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import infoIcon from "@/assets/Info.svg";
import html2canvas from "html2canvas";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import PaymentMethodModal from "./payments/PaymentMethodModal";
import BookingReceiptModal from "./payments/BookingReceiptModal";
import BookingSuccessModal from "./payments/BookingSuccessModal";
import { toReadableDateTime } from "./utils/bookingDate";
import { bookOfflineAppointment, bookOnlineAppointment } from "../../modules/patient/api/appointmentApi";
import AuthRequiredModal from "../AuthRequiredModal";
import "./Booking.css";

export default function BookingSidebar({ doctor, onBookingSuccess }) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isAr = i18n.language === "ar";

  const availability = useMemo(() => {
    return doctor?.availableDaysSlots || [];
  }, [doctor]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const visibleDaysCount = 5;
  const [selectedTime, setSelectedTime] = useState(null);

  // Ensure selection resets when doctor changes
  useEffect(() => {
    setSelectedDayIndex(0);
    setStartIndex(0);
    setSelectedTime(null);
  }, [availability]);

  const selectedDateStr = useMemo(() => {
    if (!availability[selectedDayIndex]) return null;
    const date = new Date(availability[selectedDayIndex].date);
    return `${date.getDate()} ${date.toLocaleDateString(isAr ? "ar-EG" : "en-US", { month: "short" })}`;
  }, [availability, selectedDayIndex, isAr]);

  const [activeModal, setActiveModal] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const receiptRef = useRef(null);
  const sidebarRef = useRef(null);
  const wrapperRef = useRef(null);

  const appointmentCost = doctor?.price || 150;

  const TIME_OPTIONS = useMemo(() => {
    if (!availability[selectedDayIndex]) return [];
    return availability[selectedDayIndex].slots.map(slot => {
      const start = new Date(slot.startTime);
      return start.toLocaleTimeString(isAr ? "ar-EG" : "en-US", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    });
  }, [availability, selectedDayIndex, isAr]);

  // handlePrev: Move focus back. Slide carousel back only if focus goes out of view.
  const handlePrev = () => {
    if (selectedDayIndex > 0) {
      const prevIndex = selectedDayIndex - 1;
      setSelectedDayIndex(prevIndex);
      setSelectedTime(null);
      if (prevIndex < startIndex) {
        setStartIndex(prevIndex);
      }
    }
  };

  // handleNext: Move focus forward. Slide carousel forward if focus goes out of view.
  const handleNext = () => {
    const nextIndex = selectedDayIndex + 1;
    if (nextIndex < availability.length) {
      setSelectedDayIndex(nextIndex);
      setSelectedTime(null);
      if (nextIndex >= startIndex + visibleDaysCount) {
        setStartIndex(nextIndex - visibleDaysCount + 1);
      }
    }
  };

  const handleBook = () => {
    if (!doctor || !selectedDateStr || !selectedTime) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
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
    () => toReadableDateTime(selectedDateStr, selectedTime, i18n.language),
    [selectedDateStr, selectedTime, i18n.language]
  );

  const receiptNumber = useMemo(
    () => `RX-${Date.now().toString().slice(-10)}`,
    []
  );

  const handlePaymentSelection = async (method) => {
    setActiveModal(null);

    let isoDate = new Date().toISOString();
    if (availability[selectedDayIndex]) {
      const selectedSlot = availability[selectedDayIndex].slots.find(slot => {
        const start = new Date(slot.startTime);
        const formattedStart = start.toLocaleTimeString(isAr ? "ar-EG" : "en-US", {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        return formattedStart === selectedTime;
      });
      if (selectedSlot) isoDate = selectedSlot.startTime;
    }

    const payload = {
      doctorId: doctor.id,
      date: isoDate,
      amount: appointmentCost,
    };

    if (method === "offline") {
      try {
        await bookOfflineAppointment(payload);
        setActiveModal("success");
        if (onBookingSuccess) onBookingSuccess();
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Failed to book");
      }
      return;
    }

    if (method === "online") {
      try {
        const response = await bookOnlineAppointment(payload);
        const url = response?.url || (typeof response === 'string' && response.startsWith('http') ? response : null);
        if (url) {
          toast.info("Redirecting...");
          setTimeout(() => { window.location.href = url; }, 500);
        }
      } catch (error) {
        toast.error("Failed to initiate payment");
      }
      return;
    }
  };

  const handlePrintReceipt = async () => {
    if (!receiptRef.current || isPrinting) return;
    setIsPrinting(true);
    try {
      const canvas = await html2canvas(receiptRef.current, { backgroundColor: "#ffffff", scale: 2 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `receipt-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPrinting(false);
    }
  };

  useEffect(() => {
    if (activeModal === "success") {
      const timer = setTimeout(() => setActiveModal("receipt"), 1200);
      return () => clearTimeout(timer);
    }
  }, [activeModal]);

  // Sidebar positioning logic (Fixed on scroll)
  useEffect(() => {
    const updatePosition = () => {
      if (!wrapperRef.current || !sidebarRef.current) return;
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const sidebar = sidebarRef.current;

      if (wrapperRect.top <= 96) {
        sidebar.style.position = 'fixed';
        sidebar.style.top = '96px';
        sidebar.style.width = `${wrapperRect.width}px`;
        sidebar.style.left = `${wrapperRect.left}px`;
        sidebar.style.right = 'auto';
      } else {
        sidebar.style.position = 'static';
        sidebar.style.top = 'auto';
        sidebar.style.width = '100%';
        sidebar.style.left = 'auto';
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    const resizeObserver = new ResizeObserver(updatePosition);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    updatePosition();

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="booking-sidebar-wrapper">
      <aside ref={sidebarRef} className="booking-card booking-sidebar">
        <div className="booking-sidebar-header-bar">
          <Calendar size={20} className="booking-sidebar-header-icon" />
          <h3 className="booking-sidebar-header-title">{t("booking.sidebar.title")}</h3>
        </div>

        <div className="booking-sidebar-content flex-1 overflow-y-auto">
          {availability.length === 0 ? (
            <div className="py-8 text-center bg-gray-50 dark:bg-slate-800/50 rounded-xl mt-4">
              <p className="text-sm text-gray-500">{t("booking.sidebar.notAvailable")}</p>
            </div>
          ) : (
            <>
              <div className="booking-sidebar-section">
                <p className="booking-sidebar-label flex items-center gap-1.5">
                  {t("booking.sidebar.selectDay")}
                  <img src={infoIcon} alt="" className="w-3.5 h-3.5 dark:invert" />
                </p>
                <div className="booking-date-carousel" style={{ direction: "ltr" }}>
                  <button type="button" className="booking-carousel-nav" onClick={handlePrev} disabled={selectedDayIndex === 0}>
                    <ArrowLeft size={20} />
                  </button>

                  <div className="booking-date-grid">
                    {availability.slice(startIndex, startIndex + visibleDaysCount).map((item, localIndex) => {
                      const index = startIndex + localIndex;
                      const date = new Date(item.date);
                      const dayName = date.toLocaleDateString(isAr ? "ar-EG" : "en-US", { weekday: 'short' });
                      const datePill = `${date.getDate()} ${date.toLocaleDateString(isAr ? "ar-EG" : "en-US", { month: "short" })}`;

                      return (
                        <button
                          key={`${item.date}-${index}`}
                          type="button"
                          className={`booking-date-pill ${selectedDayIndex === index ? "booking-date-pill-selected" : ""}`}
                          onClick={() => { setSelectedDayIndex(index); setSelectedTime(null); }}
                        >
                          <span className="booking-date-pill-day">{dayName}</span>
                          <span className="booking-date-pill-date">{datePill}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button type="button" className="booking-carousel-nav" onClick={handleNext} disabled={selectedDayIndex + 1 >= availability.length && startIndex + visibleDaysCount >= availability.length}>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>

              <div className="booking-sidebar-section mt-4">
                <p className="booking-sidebar-label">{t("booking.sidebar.availableTime")}</p>
                <div className="booking-time-grid">
                  {TIME_OPTIONS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`booking-time-pill ${selectedTime === time ? "booking-time-pill-selected" : ""}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="booking-sidebar-footer border-t dark:border-slate-800">
          <div className="booking-price">
            <span className="booking-price-label">{t("booking.sidebar.cost")}</span>
            <span className="booking-price-box">
              <span className="booking-price-value">{appointmentCost}</span>
              <span className="booking-price-currency"> {t("booking.sidebar.currency")}</span>
            </span>
          </div>
          <button
            type="button"
            className="booking-submit-btn mt-4"
            onClick={() => {
              if (!user) {
                navigate("/login", { state: { from: location.pathname } });
                return;
              }
              handleBook();
            }}
            disabled={!user ? false : isDisabled}
          >
            <Calendar size={18} className="mr-2" />
            {user ? t("booking.sidebar.bookBtn") : t("booking.sidebar.loginToBook", "Login To Book Appointment")}
          </button>
        </div>

        {activeModal && <div className="fixed inset-0 z-[98] bg-black/20 backdrop-blur-sm" />}

        {showAuthModal && <AuthRequiredModal onLogin={() => navigate("/login", { state: { from: location.pathname } })} onCancel={() => setShowAuthModal(false)} />}
        {activeModal === "payment" && <PaymentMethodModal onSelectMethod={handlePaymentSelection} />}
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
            onDone={() => setActiveModal(null)}
          />
        )}
        {activeModal === "success" && <BookingSuccessModal />}
      </aside>
    </div>
  );
}
