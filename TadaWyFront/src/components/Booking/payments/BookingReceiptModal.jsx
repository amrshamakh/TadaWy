import { Printer } from "lucide-react";
import { assets } from "../../../assets/assets";
import { useTranslation } from "react-i18next";

export default function BookingReceiptModal({
  receiptRef,
  receiptNumber,
  patientName,
  patientEmail,
  doctor,
  appointmentDateValue,
  appointmentCost,
  isPrinting,
  onPrintReceipt,
  onDone,
  isOnline = false,
  isInline = false,
}) {
  const { t, i18n } = useTranslation();
  const innerContent = (
    <div className="receipt-shell" ref={receiptRef}>
        <div className="receipt-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <div className="w-16 h-16 flex items-center justify-center shrink-0">
            {/* The user only didn't want the white circle. Keep logo. */}
            <img className="w-16 h-16" src={assets.logo} alt="logo" />
          </div>
          <div className="receipt-header-content shrink-0" style={{ textAlign: "center", flex: 1 }}>
            <h4 className="receipt-title">{t("booking.modals.receipt.title")}</h4>
            <p className="receipt-number">{t("booking.modals.receipt.receiptNo")} {receiptNumber}</p>
          </div>
          <div className="w-16 h-16 shrink-0" />
        </div>

        <div className="receipt-body">
          <div className="receipt-section">
            <p className="receipt-label">{t("booking.modals.receipt.patientName")}</p>
            <p className="receipt-value">{patientName}</p>
            <p className="receipt-label">{t("booking.modals.receipt.patientEmail")}</p>
            <p className="receipt-value">{patientEmail}</p>
          </div>
          <div className="receipt-divider" />
          <div className="receipt-row-grid">
            <div>
              <p className="receipt-label">{t("booking.modals.receipt.doctorName")}</p>
              <p className="receipt-value">{doctor?.id ? t(`discover.clinicsData.${doctor.id}.doctor`) : (doctor?.doctor || "John Doe")}</p>
              <p className="receipt-label">{t("booking.modals.receipt.doctorLocation")}</p>
              <p className="receipt-value">{doctor?.id ? t(`discover.clinicsData.${doctor.id}.address`) : (doctor?.address || "City, Government, Country")}</p>
            </div>
            <div>
              <p className="receipt-label">{t("booking.modals.receipt.specialization")}</p>
              <p className="receipt-value">{doctor?.id ? t(`discover.clinicsData.${doctor.id}.specialty`) : (doctor?.specialty || "Cardiology")}</p>
              <p className="receipt-label">{t("booking.modals.receipt.phone")}</p>
              <p className="receipt-value">{doctor?.phone || "+201111111111"}</p>
            </div>
          </div>
          <p className="receipt-label">{t("booking.modals.receipt.locationDetails")}</p>
          <p className="receipt-value">
            {doctor?.location_description ||
              "Located on the 5th floor of Medical Plaza building, with easy access from Main Street."}
          </p>
          <div className="receipt-divider" />
          <div className="receipt-section">
            <p className="receipt-label">{t("booking.modals.receipt.appointmentDate")}</p>
            <p className="receipt-value">{appointmentDateValue}</p>
            <div className="receipt-row-grid" style={{ marginTop: '10px' }}>
              <div>
                <p className="receipt-label">{t("booking.modals.receipt.paymentMethod")}</p>
                <p className="receipt-value receipt-highlight" style={{ color: isOnline ? "#00BBA7" : "#FACC15" }}>
                  {isOnline ? t("booking.modals.receipt.paidOnline") : t("booking.modals.receipt.payAtClinic")}
                </p>
              </div>
              {isOnline && (
                <div>
                   <p className="receipt-label">{t("booking.modals.receipt.paymentRef")}</p>
                   <p className="receipt-value">11111111111</p>
                </div>
              )}
            </div>
            <div style={{ marginTop: '10px' }}>
              <p className="receipt-label">{t("booking.modals.receipt.receiptDate")}</p>
              <p className="receipt-value">
                {new Date().toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).replace(/,/g, "")} - {new Date().toLocaleTimeString(i18n.language === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </div>

        <div className="receipt-footer" style={{ borderTop: "none", paddingTop: 2 }}>
          <p className="receipt-price" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: "1.15rem", fontWeight: 600 }}>{t("booking.modals.receipt.price")}</span>
            <strong style={{ fontWeight: 600 }}>{appointmentCost} {t("booking.sidebar.currency")}</strong>
          </p>
          <div className="receipt-actions">
            <button
              type="button"
              className="receipt-btn receipt-btn-print"
              onClick={onPrintReceipt}
              disabled={isPrinting}
            >
              <Printer size={16} />
              {isPrinting ? t("booking.modals.receipt.exporting") : t("booking.modals.receipt.printBtn")}
            </button>
            <button type="button" className="receipt-btn receipt-btn-done" onClick={onDone}>
              {t("booking.modals.receipt.doneBtn")}
            </button>
          </div>
        </div>
      </div>
  );

  if (isInline) {
    return <div className="w-[450px] max-w-full">{innerContent}</div>;
  }

  return (
    <div
      className="booking-modal receipt-modal"
      role="dialog"
      aria-modal="true"
      style={{ width: "min(90vw, 450px)", zIndex: 101 }}
    >
      {innerContent}
    </div>
  );
}
