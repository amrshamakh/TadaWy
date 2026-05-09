import offlineIcon from "../../../assets/accounting-bill-21.svg";
import onlineIcon from "../../../assets/Component.svg";
import { useTranslation } from "react-i18next";

export default function PaymentMethodModal({ onSelectMethod }) {
  const { t } = useTranslation();
  return (
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-[0_24px_60px_rgba(15,23,42,0.18)] p-7"
      style={{ width: "min(78vw, 440px)", zIndex: 101 }}
      role="dialog"
      aria-modal="true"
    >
      <h3 className="text-[1.45rem] font-semibold text-gray-800 dark:text-white mb-4">
        {t("booking.modals.payment.title")}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onSelectMethod("offline")}
          className="border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-teal-400 hover:-translate-y-0.5 transition-all">
          <span className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 inline-flex items-center justify-center">
            <img src={offlineIcon} alt="" className="w-5 h-5" />
          </span>
          <span className="text-base font-semibold text-gray-800 dark:text-white">{t("booking.modals.payment.offline")}</span>
          <span className="text-sm text-gray-400 font-normal text-center">{t("booking.modals.payment.offlineSub")}</span>
        </button>
        <button type="button" onClick={() => onSelectMethod("online")}
          className="border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-teal-400 hover:-translate-y-0.5 transition-all">
          <span className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 inline-flex items-center justify-center">
            <img src={onlineIcon} alt="" className="w-5 h-5" />
          </span>
          <span className="text-base font-semibold text-gray-800 dark:text-white">{t("booking.modals.payment.online")}</span>
          <span className="text-sm text-gray-400 font-normal text-center">{t("booking.modals.payment.onlineSub")}</span>
        </button>
      </div>
    </div>
  );
}
