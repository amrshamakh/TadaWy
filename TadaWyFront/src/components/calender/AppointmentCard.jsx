import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { cancelAppointment, getAppointmentReceipt } from "../../modules/patient/api/patientAppointmentsApi";
import BookingReceiptModal from "../Booking/payments/BookingReceiptModal";
import ReviewModal from "./ReviewModal";
import html2canvas from "html2canvas";
import { useRef } from "react";

export default function AppointmentCard({ id, clinic, doctor, specialty, date, time, rawDate, status, paid, doctorId, onCancel }) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [isFetchingReceipt, setIsFetchingReceipt] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const receiptRef = useRef(null);

  const isPending = status === "pending";
  const isCancelled = status === "cancelled";
  const isConfirmed = status === "completed";
  const isMissed = status === "missed";

  const isPastAppointment = rawDate && new Date(rawDate) < new Date();

  const statusLabel = isPending
    ? t("calendar.status.pending")
    : isCancelled
      ? t("calendar.status.cancelled")
      : isMissed
        ? t("calendar.status.missed")
        : t("calendar.status.confirmed");

  const statusPillClass = isPending
    ? "text-yellow-600 border-yellow-600 bg-transparent"
    : isCancelled || isMissed
      ? "text-red-600 border-red-600 bg-transparent"
      : isConfirmed
        ? "text-emerald-600 border-emerald-600 bg-transparent"
        : "text-[#64748B] border-[#64748B] bg-transparent";

  const executeCancel = async () => {
    try {
      setIsCanceling(true);
      await cancelAppointment(id);
      toast.success(t("calendar.cancelSuccess"));
      onCancel?.();
    } catch (err) {
      console.error(err);
      toast.error(t("calendar.cancelError"));
    } finally {
      setIsCanceling(false);
    }
  };

  const handleCancel = () => {
    toast(
      ({ closeToast }) => (
        <div className={`flex flex-col gap-3 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
          <p className="m-0 text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
            {t("calendar.cancelConfirm")}
          </p>
          <div className="flex justify-end gap-2.5 mt-2">
            <button
              onClick={closeToast}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition-all border border-gray-200 dark:border-white/10 shadow-sm"
            >
              {t("calendar.keepAppointment")}
            </button>
            <button
              onClick={() => {
                closeToast();
                executeCancel();
              }}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all shadow-md shadow-red-500/20"
            >
              {t("calendar.cancelAppointment")}
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center"
      }
    );
  };

  const handleDetails = async () => {
    try {
      setIsFetchingReceipt(true);
      const data = await getAppointmentReceipt(id);
      setReceipt(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch receipt details.");
    } finally {
      setIsFetchingReceipt(false);
    }
  };

  const handlePrintReceipt = async () => {
    if (!receiptRef.current || isPrinting) return;
    try {
      setIsPrinting(true);
      // Wait for any animations to finish
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const element = receiptRef.current;
      
      // Capture with specific options to handle fixed positioning and transformations
      const canvas = await html2canvas(element, {
        scale: 3, // High quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: -window.scrollY, // Adjust for page scroll
        onclone: (clonedDoc) => {
          // You can perform any cleanup on the cloned document if needed
          const clonedElement = clonedDoc.querySelector('[ref="receiptRef"]') || clonedDoc.body.querySelector('.rounded-2xl.border.border-gray-200');
          if (clonedElement) {
             clonedElement.style.transform = 'none';
             clonedElement.style.position = 'relative';
             clonedElement.style.top = '0';
             clonedElement.style.left = '0';
          }
        }
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `TadaWy-Receipt-${id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Critical error during receipt export:", error);
      toast.error(t("calendar.printError") || "Failed to print receipt");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <>
      <div className="w-full rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B]">
        <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-3 py-3">
          <div className="min-w-0 flex-1 basis-full sm:basis-auto">
            <p className="text-sm font-semibold text-gray-800 dark:text-white m-0 truncate">{clinic}</p>
            <p className="text-xs text-gray-700 dark:text-[#94A3B8] m-0 truncate">{doctor}</p>
            {specialty && specialty !== clinic && (
              <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] mt-0.5 m-0 truncate">{specialty}</p>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 flex-1 sm:flex-none w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 border-gray-100 dark:border-[#334155]/30 pt-2 sm:pt-0">
            <span
              className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold border rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 ${statusPillClass}`}
            >
              {statusLabel}
            </span>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] sm:text-xs font-semibold text-gray-800 dark:text-white m-0">{date}</p>
              <p className="text-[9px] sm:text-[11px] text-gray-500 dark:text-[#94A3B8] mt-0.5 m-0">{time}</p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200/80 dark:hover:bg-[#334155] focus:outline-none"
              aria-expanded={expanded}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-gray-200 dark:border-[#334155] px-4 py-3 flex justify-end gap-2 bg-gray-50 dark:bg-[#1E293B] rounded-b-xl">
            {isPending && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCanceling || isPastAppointment}
                title={isPastAppointment ? "Appointment date has passed" : ""}
                className="px-4 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-[#EF4444] hover:bg-red-50 active:bg-red-100 dark:bg-[#0F172A] dark:border-[#334155] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCanceling ? "Canceling..." : t("doctorDashboard.appointments.cancel")}
              </button>
            )}
            <button
              type="button"
              onClick={handleDetails}
              disabled={isFetchingReceipt}
              className="px-4 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-[#00BBA7] hover:bg-teal-50 active:bg-teal-100 dark:bg-[#0F172A] dark:border-[#334155] disabled:opacity-50 transition-colors"
            >
              {isFetchingReceipt ? "Loading..." : t("doctorDashboard.appointments.details")}
            </button>
            {isConfirmed && (
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-1.5 text-sm rounded-full bg-[#00BBA7] text-white hover:bg-[#009e8f] active:bg-[#008f82] transition-colors"
              >
                {t("doctorDashboard.profile.reviews")}
              </button>
            )}
          </div>
        )}
      </div>

      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <BookingReceiptModal
            receiptRef={receiptRef}
            receiptNumber={`RX-${id}`}
            patientName={receipt.patientName || receipt.PatientName}
            patientEmail={receipt.patientEmail || receipt.PatientEmail}
            doctor={{
              name: receipt.doctorName || receipt.DoctorName,
              specialization: receipt.specialty || receipt.Specialty,
              address: receipt.doctorLocation || receipt.DoctorLocation,
              phoneNumber: receipt.phoneNumber || receipt.PhoneNumber,
              addressDescription: receipt.doctorLocationDetails || receipt.DoctorLocationDetails
            }}
            appointmentDateValue={new Date(receipt.date || receipt.Date).toLocaleString(i18n.language)}
            appointmentCost={receipt.price || receipt.Price}
            isPrinting={isPrinting}
            onPrintReceipt={handlePrintReceipt}
            onDone={() => setReceipt(null)}
            isOnline={(receipt.paymentMethod || receipt.PaymentMethod)?.toLowerCase() === "online"}
          />
        </div>
      )}
      {showReviewModal && <ReviewModal doctorId={doctorId} onClose={() => setShowReviewModal(false)} />}
    </>
  );
}
