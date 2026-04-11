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
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img className="w-16 h-16" src={assets.logo} alt="logo" />
          </div>
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
            <p className="receipt-label">Receipt Date</p>
            <p className="receipt-value">
              {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).replace(/,/g, "")} - {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
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
    </div>
  );
}
