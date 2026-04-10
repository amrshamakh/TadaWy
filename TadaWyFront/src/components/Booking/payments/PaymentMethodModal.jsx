import offlineIcon from "../../../assets/accounting-bill-21.svg";
import onlineIcon from "../../../assets/Component.svg";

export default function PaymentMethodModal({ onSelectMethod }) {
  return (
    <div
      className="booking-modal payment-method-modal"
      role="dialog"
      aria-modal="true"
      style={{
        width: "min(78vw, 440px)",
        zIndex: 101,
        paddingTop: 18,
        paddingBottom: 16,
        paddingLeft: 22,
        paddingRight: 22,
      }}
    >
      <h3
        className="payment-modal-title"
        style={{ fontWeight: 600, fontSize: "1.45rem", marginBottom: 14 }}
      >
        Choose your payment method:
      </h3>
      <div className="payment-method-grid" style={{ gap: 12 }}>
        <button
          type="button"
          className="payment-method-option"
          onClick={() => onSelectMethod("offline")}
          style={{ padding: "16px 12px" }}
        >
          <span className="payment-method-icon payment-method-icon-offline">
            <img src={offlineIcon} alt="" style={{ width: 20, height: 20 }} />
          </span>
          <span className="payment-method-name" style={{ fontWeight: 500, fontSize: "1.35rem" }}>Pay Offline</span>
          <span className="payment-method-subtitle" style={{ fontWeight: 400, fontSize: "1.1rem", color: "#64748B" }}>Pay at the clinic</span>
        </button>

        <button
          type="button"
          className="payment-method-option"
          onClick={() => onSelectMethod("online")}
          style={{ padding: "16px 12px" }}
        >
          <span className="payment-method-icon payment-method-icon-online">
            <img src={onlineIcon} alt="" style={{ width: 20, height: 20 }} />
          </span>
          <span className="payment-method-name" style={{ fontWeight: 500, fontSize: "1.35rem" }}>Pay Online</span>
          <span className="payment-method-subtitle" style={{ fontWeight: 400, fontSize: "1.1rem", color: "#64748B" }}>Visa / Digital Wallet</span>
        </button>
      </div>
    </div>
  );
}
