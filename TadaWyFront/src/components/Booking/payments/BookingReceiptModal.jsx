import { Printer } from "lucide-react";
import { assets } from "../../../assets/assets";
import { useTranslation } from "react-i18next";

export default function BookingReceiptModal({ receiptRef, receiptNumber, patientName, patientEmail, doctor, appointmentDateValue, appointmentCost, isPrinting, onPrintReceipt, onDone, isOnline = false, isInline = false }) {
  const { t, i18n } = useTranslation();

  const label = "block text-[0.78rem] text-gray-400 dark:text-gray-500 mb-0.5";
  const value = "block text-[0.92rem] font-semibold text-gray-800 dark:text-gray-100 mb-1";
  const divider = "border-dashed border-gray-200 dark:border-slate-700 my-3";

  const innerContent = (
    <div id="receipt-content" className="rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.2)]" ref={receiptRef}>
      {/* Header */}
      <div className="bg-teal-400 dark:bg-teal-600 flex items-center justify-between px-4 py-3">
        <div className="w-16 h-16 flex items-center justify-center shrink-0">
          <img className="w-16 h-16 brightness-100 dark:brightness-110" src={assets.logo} alt="logo" />
        </div>
        <div className="text-center flex-1 text-white shrink-0">
          <h4 className="m-0 text-[1.55rem] font-bold">{t("booking.modals.receipt.title")}</h4>
          <p className="mt-0.5 text-[0.72rem] opacity-95">{t("booking.modals.receipt.receiptNo")} {receiptNumber}</p>
        </div>
        <div className="w-16 h-16 shrink-0" />
      </div>

      {/* Body */}
      <div className="px-4 py-3.5">
        <div className="mb-2.5">
          <span className={label}>{t("booking.modals.receipt.patientName")}</span>
          <span className={value}>{patientName}</span>
          <span className={label}>{t("booking.modals.receipt.patientEmail")}</span>
          <span className={value}>{patientEmail}</span>
        </div>
        <hr className={divider} />
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <span className={label}>{t("booking.modals.receipt.doctorName")}</span>
            <span className={value}>{doctor?.name || "John Doe"}</span>
            <span className={label}>{t("booking.modals.receipt.doctorLocation")}</span>
            <span className={value}>
              {doctor?.address
                ? [doctor.address.city, doctor.address.state].filter(p => p && p.toLowerCase() !== 'unknown').join(', ') || "City, Government, Country"
                : "City, Government, Country"}
            </span>
          </div>
          <div>
            <span className={label}>{t("booking.modals.receipt.specialization")}</span>
            <span className={value}>{doctor?.specialization || "Cardiology"}</span>
            <span className={label}>{t("booking.modals.receipt.phone")}</span>
            <span className={value}>{doctor?.phoneNumber || doctor?.phone || "+201111111111"}</span>
          </div>
        </div>
        <span className={label}>{t("booking.modals.receipt.locationDetails")}</span>
        <span className={value}>{doctor?.addressDescription || doctor?.location_description || t("booking.modals.receipt.locationDetailsPlaceholder")}</span>
        <hr className={divider} />
        <div>
          <span className={label}>{t("booking.modals.receipt.appointmentDate")}</span>
          <span className={value}>{appointmentDateValue}</span>
          <div className="grid grid-cols-2 gap-3 mt-2.5">
            <div>
              <span className={label}>{t("booking.modals.receipt.paymentMethod")}</span>
              <span className={`block text-[0.92rem] font-semibold mb-1 ${isOnline ? "text-teal-500 dark:text-teal-400" : "text-yellow-400 dark:text-yellow-500"}`}>
                {isOnline ? t("booking.modals.receipt.paidOnline") : t("booking.modals.receipt.payAtClinic")}
              </span>
            </div>
            {isOnline && (
              <div>
                <span className={label}>{t("booking.modals.receipt.paymentRef")}</span>
                <span className={value}>11111111111</span>
              </div>
            )}
          </div>
          <div className="mt-2.5">
            <span className={label}>{t("booking.modals.receipt.receiptDate")}</span>
            <span className={value}>
              {new Date().toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).replace(/,/g, "")} - {new Date().toLocaleTimeString(i18n.language === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
        <p className="flex items-center justify-end gap-2 text-sm mt-4 mb-2">
          <span className="text-[1.15rem] font-semibold text-gray-500 dark:text-gray-400">{t("booking.modals.receipt.price")}</span>
          <strong className="text-[1.75rem] text-gray-800 dark:text-gray-100 font-semibold">{appointmentCost} {t("booking.sidebar.currency")}</strong>
        </p>

        {/* Actions (Inside the card but ignored by printing) */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-700" data-html2canvas-ignore="true">
          <div className="flex gap-2.5 justify-end">
            <button type="button" onClick={onDone}
              className="h-10 px-8 rounded-lg border-none bg-teal-400 text-white text-[0.9rem] font-semibold flex items-center justify-center cursor-pointer hover:bg-teal-500 transition-colors">
              {t("booking.modals.receipt.doneBtn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isInline) return <div className="w-[450px] max-w-full">{innerContent}</div>;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "min(90vw, 450px)", zIndex: 101 }} role="dialog" aria-modal="true">
      {innerContent}
    </div>
  );
}
