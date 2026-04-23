import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import infoIcon from "../../assets/info.svg";
import html2canvas from "html2canvas";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import PaymentMethodModal from "./payments/PaymentMethodModal";
import BookingReceiptModal from "./payments/BookingReceiptModal";
import BookingSuccessModal from "./payments/BookingSuccessModal";
import { getVisibleDays, toReadableDateTime } from "./utils/bookingDate";
import AuthRequiredModal from "../AuthRequiredModal";
import "./Booking.css";

const getTimeOptions = (t) => [
  `10:00 ${t("common.am")}`,
  `11:00 ${t("common.am")}`,
  `12:00 ${t("common.pm")}`,
  `1:00 ${t("common.pm")}`,
  `2:00 ${t("common.pm")}`,
  `3:00 ${t("common.pm")}`,
];

// Note: If you want to translate the times themselves (e.g. 10 صباحاً), 
// you can use t() logic here. For now keeping numbers but labels could be translated.

export default function BookingSidebar({ doctor }) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const baseDate = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }, []);
  const [dateOffset, setDateOffset] = useState(0);
  
  const availability = useMemo(() => {
    if (!doctor?.availableDaysSlots) return [];
    return doctor.availableDaysSlots;
  }, [doctor]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const selectedDateStr = useMemo(() => {
    if (!availability[selectedDayIndex]) return null;
    const date = new Date(availability[selectedDayIndex].date);
    return `${date.getDate()} ${date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", { month: "short" })}`;
  }, [availability, selectedDayIndex, i18n.language]);

  const [activeModal, setActiveModal] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const receiptRef = useRef(null);
  const sidebarRef = useRef(null);
  const wrapperRef = useRef(null);

  const appointmentCost = doctor?.price || 150;

  const currentDays = useMemo(() => getVisibleDays(baseDate, dateOffset, i18n.language), [baseDate, dateOffset, i18n.language]);

  const TIME_OPTIONS = useMemo(() => {
    if (!availability[selectedDayIndex]) return [];
    return availability[selectedDayIndex].slots.map(slot => {
      const start = new Date(slot.startTime);
      return start.toLocaleTimeString(i18n.language === "ar" ? "ar-EG" : "en-US", { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    });
  }, [availability, selectedDayIndex, i18n.language]);

  const handlePrev = () => {
    if (selectedDayIndex > 0) setSelectedDayIndex(prev => prev - 1);
  };
  const handleNext = () => {
    if (selectedDayIndex < availability.length - 1) setSelectedDayIndex(prev => prev + 1);
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

  const handlePaymentSelection = (method) => {
    if (method === "offline") {
      setActiveModal("success");
      return;
    }
    if (method === "online") {
      navigate("/online-payment", {
        state: {
          doctor,
          patientName,
          patientEmail,
          appointmentDateValue,
          appointmentCost,
        },
      });
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

  const handleReceiptDone = () => setActiveModal(null);

  useEffect(() => {
    if (activeModal !== "success") return;
    const timer = setTimeout(() => setActiveModal("receipt"), 1200);
    return () => clearTimeout(timer);
  }, [activeModal]);

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
        sidebar.style.right = 'auto'; // ensure RTL doesn't break
      } else {
        sidebar.style.position = 'static';
        sidebar.style.top = 'auto';
        sidebar.style.width = '100%';
        sidebar.style.left = 'auto';
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    
    // Setup ResizeObserver to react when Layout Sidebar toggles
    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });
    
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }
    
    updatePosition(); // Initial position setup

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

      <div className="booking-sidebar-content">
        <div className="booking-sidebar-section">
          <p className="booking-sidebar-label flex items-center gap-1.5">
            {t("booking.sidebar.selectDay")}
            <img src={infoIcon} alt="" className="w-3.5 h-3.5 shrink-0 dark:invert dark:opacity-90" />
          </p>
          <div className="booking-date-carousel">
            <button type="button" className="booking-carousel-nav" onClick={handlePrev} aria-label="Previous options">
              <ArrowLeft size={20} />
            </button>

            <div className="booking-date-grid">
              {availability.map((item, index) => {
                const date = new Date(item.date);
                const dayName = date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", { weekday: 'short' });
                const datePill = `${date.getDate()} ${date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", { month: "short" })}`;
                
                return (
                  <button
                    key={item.date}
                    type="button"
                    className={`booking-date-pill ${selectedDayIndex === index ? "booking-date-pill-selected" : ""}`}
                    onClick={() => {
                      setSelectedDayIndex(index);
                      setSelectedTime(null);
                    }}
                  >
                    <span className="booking-date-pill-day">{dayName}</span>
                    <span className="booking-date-pill-date">{datePill}</span>
                  </button>
                );
              })}
            </div>

            <button type="button" className="booking-carousel-nav" onClick={handleNext} disabled={selectedDayIndex >= availability.length - 1} aria-label="Next options">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="booking-sidebar-section">
          <p className="booking-sidebar-label">{t("booking.sidebar.availableTime")}</p>
          <div className="booking-time-grid">
            {TIME_OPTIONS.length > 0 ? (
              TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`booking-time-pill ${selectedTime === time ? "booking-time-pill-selected" : ""}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))
            ) : (
              <p className="text-gray-400 text-sm py-2">{t("booking.sidebar.noTimes") || "No times available"}</p>
            )}
          </div>
        </div>

        <div className="booking-sidebar-footer">
          <div className="booking-price">
            <span className="booking-price-label">{t("booking.sidebar.cost")}</span>
            <span className="booking-price-box">
              <span className="booking-price-value">{appointmentCost}</span>
              <span className="booking-price-currency"> {t("booking.sidebar.currency")}</span>
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
              {t("booking.sidebar.bookBtn")}
            </button>
          </div>
        </div>
      </div>

      {activeModal && (
        <div
          className="fixed inset-0 z-[98] bg-white/78 dark:bg-[#0f172a]/80 backdrop-blur-[5px]"
        />
      )}

      {showAuthModal && (
        <AuthRequiredModal
          onLogin={() => {
            setShowAuthModal(false);
            navigate("/login");
          }}
          onCancel={() => setShowAuthModal(false)}
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
    </div>
  );
}

