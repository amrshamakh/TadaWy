import { Printer } from "lucide-react";
import { assets } from "../../../assets/assets";

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
  const innerContent = (
    <div className="receipt-shell" ref={receiptRef}>
        <div className="receipt-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <div className="w-16 h-16 flex items-center justify-center shrink-0">
            {/* The user only didn't want the white circle. Keep logo. */}
            <img className="w-16 h-16" src={assets.logo} alt="logo" />
          </div>
          <div className="receipt-header-content shrink-0" style={{ textAlign: "center", flex: 1 }}>
            <h4 className="receipt-title">PAYMENT RECEIPT</h4>
            <p className="receipt-number">Receipt No. {receiptNumber}</p>
          </div>
          <div className="w-16 h-16 shrink-0" />
        </div>

        <div className="receipt-body">
          <div className="receipt-section">
            <p className="receipt-label">Patient Name</p>
            <p className="receipt-value">{patientName}</p>
            <p className="receipt-label">Patient Email</p>
            <p className="receipt-value">{patientEmail}</p>
          </div>
          <div className="receipt-divider" />
          <div className="receipt-row-grid">
            <div>
              <p className="receipt-label">Doctor Name</p>
              <p className="receipt-value">{doctor?.doctor || "John Doe"}</p>
              <p className="receipt-label">Doctor Location</p>
              <p className="receipt-value">{doctor?.address || "City, Government, Country"}</p>
            </div>
            <div>
              <p className="receipt-label">Specialization</p>
              <p className="receipt-value">{doctor?.specialty || "Cardiology"}</p>
              <p className="receipt-label">Phone Number</p>
              <p className="receipt-value">{doctor?.phone || "+201111111111"}</p>
            </div>
          </div>
          <p className="receipt-label">Doctor Location Details</p>
          <p className="receipt-value">
            {doctor?.location_description ||
              "Located on the 5th floor of Medical Plaza building, with easy access from Main Street."}
          </p>
          <div className="receipt-divider" />
          <div className="receipt-section">
            <p className="receipt-label">Appointment Date</p>
            <p className="receipt-value">{appointmentDateValue}</p>
            <div className="receipt-row-grid" style={{ marginTop: '10px' }}>
              <div>
                <p className="receipt-label">Payment method</p>
                <p className="receipt-value receipt-highlight" style={{ color: isOnline ? "#00BBA7" : "#E3B341" }}>
                  {isOnline ? "Paid Online" : "Pay at the Clinic"}
                </p>
              </div>
              {isOnline && (
                <div>
                   <p className="receipt-label">Payment Reference</p>
                   <p className="receipt-value">11111111111</p>
                </div>
              )}
            </div>
            <div style={{ marginTop: '10px' }}>
              <p className="receipt-label">Receipt Date</p>
              <p className="receipt-value">
                {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).replace(/,/g, "")} - {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </div>

        <div className="receipt-footer" style={{ borderTop: "none", paddingTop: 2 }}>
          <p className="receipt-price" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: "1.15rem", fontWeight: 600 }}>Price</span>
            <strong style={{ fontWeight: 600 }}>{appointmentCost} L.E</strong>
          </p>
          <div className="receipt-actions">
            <button
              type="button"
              className="receipt-btn receipt-btn-print"
              onClick={onPrintReceipt}
              disabled={isPrinting}
            >
              <Printer size={16} />
              {isPrinting ? "Exporting..." : "Print Receipt"}
            </button>
            <button type="button" className="receipt-btn receipt-btn-done" onClick={onDone}>
              Done
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
