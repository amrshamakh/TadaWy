import { Printer } from "lucide-react";
import { assets } from "../../../assets/assets";
import { useTranslation } from "react-i18next";

export default function OfflineBookingReceiptModal({
  receiptRef,
  receiptData,
  isPrinting,
  onPrintReceipt,
  onDone,
  isInline = false,
}) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  
  if (!receiptData) return null;

  const {
    doctorName,
    patientName,
    patientEmail,
    specialty,
    phoneNumber,
    price,
    doctorLocation,
    doctorLocationDetails,
    receiptDate,
    date,
    paymentMethod
  } = receiptData;

  const getCityState = () => {
    if (!doctorLocation) return "City, Government, Country";
    const city = isAr ? doctorLocation.cityAr || doctorLocation.city : doctorLocation.city;
    const state = isAr ? doctorLocation.stateAr || doctorLocation.state : doctorLocation.state;
    return [city, state].filter(p => p && p.toLowerCase() !== 'unknown').join(', ') || "City, Government, Country";
  };

  const formattedDate = date ? new Date(date).toLocaleString(i18n.language) : "";
  const formattedReceiptDate = receiptDate ? new Date(receiptDate).toLocaleString(i18n.language) : "";

  const receiptNumber = `RX-${Date.now().toString().slice(-10)}`;

  const innerContent = (
    <div className="receipt-shell" ref={receiptRef}>
      <div className="receipt-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
        <div className="w-16 h-16 flex items-center justify-center shrink-0">
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
            <p className="receipt-value">{doctorName}</p>
            <p className="receipt-label">{t("booking.modals.receipt.doctorLocation")}</p>
            <p className="receipt-value">{getCityState()}</p>
          </div>
          <div>
            <p className="receipt-label">{t("booking.modals.receipt.specialization")}</p>
            <p className="receipt-value">{specialty}</p>
            <p className="receipt-label">{t("booking.modals.receipt.phone")}</p>
            <p className="receipt-value">{phoneNumber}</p>
          </div>
        </div>
        <p className="receipt-label">{t("booking.modals.receipt.locationDetails")}</p>
        <p className="receipt-value">{doctorLocationDetails || t("booking.modals.receipt.locationDetailsPlaceholder")}</p>
        <div className="receipt-divider" />
        <div className="receipt-section">
          <p className="receipt-label">{t("booking.modals.receipt.appointmentDate")}</p>
          <p className="receipt-value">{formattedDate}</p>
          <div className="receipt-row-grid" style={{ marginTop: '10px' }}>
            <div>
              <p className="receipt-label">{t("booking.modals.receipt.paymentMethod")}</p>
              <p className="receipt-value receipt-highlight" style={{ color: "#FACC15" }}>
                {t("booking.modals.receipt.payAtClinic")}
              </p>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <p className="receipt-label">{t("booking.modals.receipt.receiptDate")}</p>
            <p className="receipt-value">{formattedReceiptDate}</p>
          </div>
        </div>
      </div>

      <div className="receipt-footer" style={{ borderTop: "none", paddingTop: 2 }}>
        <p className="receipt-price" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: "1.15rem", fontWeight: 600 }}>{t("booking.modals.receipt.price")}</span>
          <strong style={{ fontWeight: 600 }}>{price} {t("booking.sidebar.currency")}</strong>
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
