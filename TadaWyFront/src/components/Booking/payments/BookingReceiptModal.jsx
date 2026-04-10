import { Printer } from "lucide-react";
import receiptLogo from "../../../assets/TadaWy Logo.svg";

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
}) {
  return (
    <div
      className="booking-modal receipt-modal"
      role="dialog"
      aria-modal="true"
      style={{ width: "min(90vw, 450px)", zIndex: 101 }}
    >
      <div className="receipt-shell" ref={receiptRef}>
        <div className="receipt-header" style={{ justifyContent: "center", gap: 12 }}>
          <img src={receiptLogo} alt="TadaWy" className="receipt-logo" style={{ width: 42, height: 42 }} />
          <div className="receipt-header-content" style={{ textAlign: "center" }}>
            <h4 className="receipt-title">PAYMENT RECEIPT</h4>
            <p className="receipt-number">Receipt No. {receiptNumber}</p>
          </div>
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
            <p className="receipt-label">Payment method</p>
            <p className="receipt-value receipt-highlight" style={{ color: "#E3B341" }}>
              Pay at the Clinic
            </p>
          </div>
        </div>

        <div className="receipt-footer" style={{ borderTop: "none", paddingTop: 2 }}>
          <p className="receipt-price" style={{ marginBottom: 8 }}>
            <span>Price</span>
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
    </div>
  );
}
