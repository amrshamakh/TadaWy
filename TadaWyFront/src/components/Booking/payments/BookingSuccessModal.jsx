import { Check } from "lucide-react";
import successFireworks from "../../../assets/booking-success-fireworks.png";
import { useTranslation } from "react-i18next";

export default function BookingSuccessModal({ isInline = false }) {
  const { t } = useTranslation();
  const innerContent = (
      <div className="success-card" style={{ minHeight: 240, width: isInline ? '420px' : 'auto', maxWidth: '100%' }}>
        <img
          src={successFireworks}
          alt=""
          className="success-fireworks-bg dark:opacity-20 dark:invert"
          style={{ opacity: 0.38 }}
        />
        <div className="success-content" style={{ minHeight: 240 }}>
          <span className="success-check">
            <Check size={28} />
          </span>
          <h3 style={{ fontWeight: 500, fontSize: "1.5rem" }}>{t("booking.modals.success.title")}</h3>
          <p style={{ fontWeight: 400, fontSize: "1.2rem" }}>{t("booking.modals.success.subTitle")}</p>
        </div>
      </div>
  );

  if (isInline) {
    return innerContent;
  }

  return (
    <div
      className="booking-modal success-modal"
      role="dialog"
      aria-modal="true"
      style={{ width: "min(85vw, 420px)", zIndex: 101 }}
    >
      {innerContent}
    </div>
  );
}
