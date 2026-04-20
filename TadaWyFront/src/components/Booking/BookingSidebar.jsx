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
import { createOfflineAppointment } from "../../modules/patient/api/appointmentApi";
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
  const [selectedDateStr, setSelectedDateStr] = useState(
    `${baseDate.getDate()} ${baseDate.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", { month: "short" })}`
  );
  const [selectedTime, setSelectedTime] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const receiptRef = useRef(null);

  const appointmentCost = doctor?.price || 150;

  const currentDays = useMemo(() => getVisibleDays(baseDate, dateOffset, i18n.language), [baseDate, dateOffset, i18n.language]);

  const availableDatesMap = useMemo(() => {
    const map = new Map();
    const arr = doctor?.availableSlots || [];
    arr.forEach(item => {
      if (!item.date) return;
      const d = new Date(item.date);
      const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      map.set(dateKey, item.slots || []);
    });
    return map;
  }, [doctor]);

  const currentSelectedDayObj = currentDays.find(d => d.date === selectedDateStr);
  const selectedDateKey = currentSelectedDayObj 
    ? `${currentSelectedDayObj.fullDate.getFullYear()}-${currentSelectedDayObj.fullDate.getMonth()}-${currentSelectedDayObj.fullDate.getDate()}`
    : "";

  const currentAvailableSlotsObj = availableDatesMap.get(selectedDateKey) || [];

  const dynamicTimeOptions = useMemo(() => {
    return currentAvailableSlotsObj.map(s => {
       const start = new Date(s.startTime);
       let h = start.getHours();
       let m = start.getMinutes();
       const ampm = h >= 12 ? t("common.pm") : t("common.am");
       h = h % 12;
       if (h === 0) h = 12;
       const minStr = m < 10 ? `0${m}` : m;
       return `${h}:${minStr} ${ampm}`;
    });
  }, [currentAvailableSlotsObj, t]);

  const isApi = doctor?.source === "api" || (doctor?.id && doctor?.availableSlots);
  const TIME_OPTIONS = isApi ? dynamicTimeOptions : useMemo(() => getTimeOptions(t), [t]);

  useEffect(() => {
    if (TIME_OPTIONS.length > 0 && !TIME_OPTIONS.includes(selectedTime)) {
      setSelectedTime(TIME_OPTIONS[0]);
    } else if (TIME_OPTIONS.length === 0) {
      setSelectedTime(null);
    }
  }, [TIME_OPTIONS, selectedTime]);

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
    () => toReadableDateTime(selectedDateStr, selectedTime, i18n.language),
    [selectedDateStr, selectedTime, i18n.language]
  );

  const receiptNumber = useMemo(
    () => `RX-${Date.now().toString().slice(-10)}`,
    []
  );

  const handlePaymentSelection = async (method) => {
    try {
      const dayObj = currentDays.find((d) => d.date === selectedDateStr);
      let isoDate = null;
      if (dayObj && selectedTime) {
        const fullDate = new Date(dayObj.fullDate);
        const timeMatch = selectedTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|ص|م)$/i);
        if (timeMatch) {
          let h = parseInt(timeMatch[1], 10);
          const m = parseInt(timeMatch[2], 10);
          const isPm = timeMatch[3].toUpperCase() === "PM" || timeMatch[3] === "م";
          if (isPm && h < 12) h += 12;
          if (!isPm && h === 12) h = 0;
          
          const year = fullDate.getFullYear();
          const pMonth = String(fullDate.getMonth() + 1).padStart(2, '0');
          const pDay = String(fullDate.getDate()).padStart(2, '0');
          const pHour = String(h).padStart(2, '0');
          const pMin = String(m).padStart(2, '0');
          isoDate = `${year}-${pMonth}-${pDay}T${pHour}:${pMin}:00`;
        }
      }

      if (method === "offline") {
        if (isoDate) {
          await createOfflineAppointment({
            DoctorId: doctor.id || doctor.Id,
            PatientId: user?.id || user?.Id || 0,
            Date: isoDate,
            Amount: appointmentCost,
          });
        }
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
            isoDate, 
            patientId: user?.id || user?.Id || 0
          },
        });
        return;
      }
      setActiveModal(null);
    } catch (e) {
      const errMsg = e?.response?.data?.message || e?.response?.data || e?.message || "An error occurred while booking. Please try again.";
      alert(t("common.error", errMsg));
      setActiveModal(null);
    }
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

  return (
    <aside className="booking-card booking-sidebar">
      <div className="booking-sidebar-header-bar">
        <Calendar size={20} className="booking-sidebar-header-icon" />
        <h3 className="booking-sidebar-header-title">{t("booking.sidebar.title")}</h3>
      </div>

      <div className="booking-sidebar-content">
        <div className="booking-sidebar-section">
          <div className="booking-sidebar-label flex items-center justify-between">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              {t("booking.sidebar.selectDay")}
              <div className="relative group cursor-pointer inline-flex">
                <img src={infoIcon} alt="info" className="w-4 h-4 shrink-0 dark:invert dark:opacity-90" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[220px] bg-gray-800 text-white text-xs rounded-md py-1.5 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-10 shadow-lg font-medium text-center">
                  {t("booking.sidebar.availabilityInfo", "Only days with available slots can be selected.")}
                  <div className="absolute border-4 border-transparent border-t-gray-800 top-full left-1/2 -translate-x-1/2"></div>
                </div>
              </div>
            </div>
            {isApi && TIME_OPTIONS.length === 0 && (
              <span className="text-[11px] font-medium text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded ml-2 whitespace-nowrap overflow-hidden text-ellipsis min-w-0 max-w-[120px]">
                {t("booking.sidebar.noSlots", "No available slots")}
              </span>
            )}
          </div>
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
          <p className="booking-sidebar-label">{t("booking.sidebar.availableTime")}</p>
          <div className="booking-time-grid">
            {TIME_OPTIONS.length > 0 ? (
              TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`booking-time-pill ${selectedTime === time ? "booking-time-pill-selected" : ""
                    }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))
            ) : (
              <div className="col-span-full py-4 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 text-sm">
                {t("booking.sidebar.noTimesAvailable", "There are no empty times available for this specific day.")}
              </div>
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

