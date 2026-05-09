import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Calendar, ArrowLeft, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import infoIcon from "@/assets/Info.svg";
import html2canvas from "html2canvas";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import PaymentMethodModal from "./payments/PaymentMethodModal";
import OfflineBookingReceiptModal from "./payments/OfflineBookingReceiptModal";
import BookingSuccessModal from "./payments/BookingSuccessModal";
import { toReadableDateTime } from "./utils/bookingDate";
import { bookOfflineAppointment, bookOnlineAppointment } from "../../modules/patient/api/appointmentApi";
import AuthRequiredModal from "../AuthRequiredModal";

export default function BookingSidebar({ doctor, onBookingSuccess }) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: urlDoctorId } = useParams();
  const isAr = i18n.language === "ar";

  const availability = useMemo(() => doctor?.availableDaysSlots || [], [doctor]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const visibleDaysCount = 5;
  const [selectedTime, setSelectedTime] = useState(null);

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
  const [receiptData, setReceiptData] = useState(null);
  const receiptRef = useRef(null);

  const appointmentCost = doctor?.price || 150;

  const TIME_OPTIONS = useMemo(() => {
    if (!availability[selectedDayIndex]) return [];
    return availability[selectedDayIndex].slots.map(slot => {
      const start = new Date(slot.startTime);
      return start.toLocaleTimeString(isAr ? "ar-EG" : "en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
    });
  }, [availability, selectedDayIndex, isAr]);

  const handlePrev = () => {
    if (selectedDayIndex > 0) {
      const prev = selectedDayIndex - 1;
      setSelectedDayIndex(prev);
      setSelectedTime(null);
      if (prev < startIndex) setStartIndex(prev);
    }
  };

  const handleNext = () => {
    const next = selectedDayIndex + 1;
    if (next < availability.length) {
      setSelectedDayIndex(next);
      setSelectedTime(null);
      if (next >= startIndex + visibleDaysCount) setStartIndex(next - visibleDaysCount + 1);
    }
  };

  const isDisabled = !selectedDateStr || !selectedTime;

  const handlePaymentSelection = async (method) => {
    setActiveModal(null);
    let isoDate = new Date().toISOString();
    if (availability[selectedDayIndex]) {
      const selectedSlot = availability[selectedDayIndex].slots.find(slot => {
        const start = new Date(slot.startTime);
        return start.toLocaleTimeString(isAr ? "ar-EG" : "en-US", { hour: '2-digit', minute: '2-digit', hour12: true }) === selectedTime;
      });
      if (selectedSlot) isoDate = selectedSlot.startTime;
    }

    const payload = {
      doctorId: doctor?.id || parseInt(urlDoctorId, 10),
      date: isoDate,
      amount: appointmentCost,
    };

    if (method === "offline") {
      try {
        const response = await bookOfflineAppointment(payload);
        setReceiptData(response);
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
          toast.info("Opening payment page...");
          setTimeout(() => { window.open(url, "_blank"); }, 500);
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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-teal-500 to-teal-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Calendar size={20} className="text-white" />
          </div>
          <h3 className="text-white font-extrabold text-lg m-0">{t("booking.sidebar.title")}</h3>
        </div>
        {selectedDateStr && selectedTime && (
          <div className="flex items-center gap-2 bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full backdrop-blur-sm">
            <CheckCircle2 size={14} />
            <span>{selectedDateStr} · {selectedTime}</span>
          </div>
        )}
      </div>

      {availability.length === 0 ? (
        <div className="py-12 text-center">
          <Clock size={32} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-gray-400 dark:text-gray-500">{t("booking.sidebar.notAvailable")}</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-[320px] flex-shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-widest m-0">
                  {t("booking.sidebar.selectDay")}
                </p>
                <img src={infoIcon} alt="" className="w-4 h-4 dark:invert opacity-60" />
              </div>

              <div className="flex items-center gap-2" style={{ direction: "ltr" }}>
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={selectedDayIndex === 0}
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-600 text-gray-400 dark:text-gray-500 hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all disabled:opacity-25 disabled:cursor-not-allowed bg-white dark:bg-slate-700"
                >
                  <ArrowLeft size={17} />
                </button>

                <div className="flex gap-2 flex-1 overflow-hidden">
                  {availability.slice(startIndex, startIndex + visibleDaysCount).map((item, localIndex) => {
                    const index = startIndex + localIndex;
                    const date = new Date(item.date);
                    const dayName = date.toLocaleDateString(isAr ? "ar-EG" : "en-US", { weekday: 'short' }).toUpperCase();
                    const dayNum = date.getDate();
                    const month = date.toLocaleDateString(isAr ? "ar-EG" : "en-US", { month: "short" }).toUpperCase();
                    const isSelected = selectedDayIndex === index;
                    return (
                      <button
                        key={`${item.date}-${index}`}
                        type="button"
                        onClick={() => { setSelectedDayIndex(index); setSelectedTime(null); }}
                        className={`flex-1 min-w-0 py-4 rounded-2xl flex flex-col items-center gap-1 cursor-pointer transition-all
                          ${isSelected
                            ? "bg-teal-500 text-white shadow-[0_6px_16px_rgba(20,184,166,0.4)] border-2 border-teal-400"
                            : "border-2 border-gray-100 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-slate-600"
                          }`}
                      >
                        <span className={`text-[0.75rem] font-bold tracking-wider ${isSelected ? "text-teal-100" : "text-gray-400 dark:text-gray-500"}`}>{dayName}</span>
                        <span className={`text-2xl font-black leading-none ${isSelected ? "text-white" : "text-gray-800 dark:text-white"}`}>{dayNum}</span>
                        <span className={`text-[0.75rem] font-bold ${isSelected ? "text-teal-100" : "text-gray-400 dark:text-gray-500"}`}>{month}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={selectedDayIndex + 1 >= availability.length && startIndex + visibleDaysCount >= availability.length}
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-600 text-gray-400 dark:text-gray-500 hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all disabled:opacity-25 disabled:cursor-not-allowed bg-white dark:bg-slate-700"
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <div className="hidden lg:block w-px bg-gray-100 dark:bg-slate-700 self-stretch" />

            <div className="flex-1">
              <p className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-widest mb-4 m-0">
                {t("booking.sidebar.availableTime")}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-2">
                {TIME_OPTIONS.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl text-sm font-bold cursor-pointer transition-all text-center border relative overflow-hidden
                        ${isSelected
                          ? "bg-teal-500 text-white border-teal-500 shadow-[0_4px_12px_rgba(20,184,166,0.3)]"
                          : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-slate-600"
                        }`}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" />
                      )}
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-gray-400 dark:text-gray-500 text-sm font-bold mb-1">{t("booking.sidebar.cost")}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">{appointmentCost}</span>
                  <span className="text-base font-extrabold text-teal-500">{t("booking.sidebar.currency")}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!user) { navigate("/login", { state: { from: location.pathname } }); return; }
                if (!selectedDateStr || !selectedTime) return;
                setActiveModal("payment");
              }}
              disabled={user ? isDisabled : false}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base transition-all
                ${user && isDisabled
                  ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600 active:scale-95 text-white shadow-[0_4px_16px_rgba(20,184,166,0.35)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.45)]"
                }`}
            >
              <Calendar size={16} />
              {user ? t("booking.sidebar.bookBtn") : t("booking.sidebar.loginToBook", "Login to Book")}
            </button>
          </div>
        </div>
      )}

      {activeModal && <div className="fixed inset-0 z-[98] bg-black/25 backdrop-blur-sm" />}
      {showAuthModal && <AuthRequiredModal onLogin={() => navigate("/login", { state: { from: location.pathname } })} onCancel={() => setShowAuthModal(false)} />}
      {activeModal === "payment" && <PaymentMethodModal onSelectMethod={handlePaymentSelection} />}
      {activeModal === "receipt" && (
        <OfflineBookingReceiptModal
          receiptRef={receiptRef}
          receiptData={receiptData}
          isPrinting={isPrinting}
          onPrintReceipt={handlePrintReceipt}
          onDone={() => { setActiveModal(null); setReceiptData(null); }}
        />
      )}
      {activeModal === "success" && <BookingSuccessModal />}
    </div>
  );
}
