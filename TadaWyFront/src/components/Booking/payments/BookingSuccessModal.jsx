import { Check } from "lucide-react";
import successFireworks from "../../../assets/booking-success-fireworks.png";
import { useTranslation } from "react-i18next";

export default function BookingSuccessModal({ isInline = false }) {
  const { t } = useTranslation();

  const innerContent = (
    <div
      className="rounded-2xl overflow-hidden relative bg-white border border-gray-200 shadow-[0_20px_45px_rgba(15,23,42,0.18)]"
      style={{ minHeight: 240, width: isInline ? 420 : "auto", maxWidth: "100%" }}
    >
      <img
        src={successFireworks}
        alt=""
        className="w-full h-full object-cover absolute inset-0 dark:opacity-20 dark:invert"
        style={{ opacity: 0.38 }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center" style={{ minHeight: 240 }}>
        <span className="w-[66px] h-[66px] rounded-full bg-teal-400 text-white inline-flex items-center justify-center mb-3.5">
          <Check size={28} />
        </span>
        <h3 className="m-0 text-gray-800 text-[1.5rem] font-medium">{t("booking.modals.success.title")}</h3>
        <p className="mt-1.5 text-gray-500 text-[1.2rem] font-normal">{t("booking.modals.success.subTitle")}</p>
      </div>
    </div>
  );

  if (isInline) return innerContent;

  return (
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: "min(85vw, 420px)", zIndex: 101 }}
      role="dialog"
      aria-modal="true"
    >
      {innerContent}
    </div>
  );
}
