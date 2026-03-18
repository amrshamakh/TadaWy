import { CreditCard, ChevronRight } from "lucide-react";
import { paymentOptions } from "../data/appointmentsData";

export default function PaymentFilter({ activePayment, onPaymentChange }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 mb-6 flex items-center gap-3 flex-wrap">
      <CreditCard className="w-4 h-4 text-teal-500" />
      <span className="text-sm font-medium text-gray-500">Payment status:</span>
      <ChevronRight className="w-3.5 h-3.5 text-gray-400 mr-1" />

      {paymentOptions.map((p) => (
        <button
          key={p}
          onClick={() => onPaymentChange(p)}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
            activePayment === p
              ? "bg-teal-500 text-white"
              : "border border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {p === "Paid Online" && <CreditCard className="w-3.5 h-3.5" />}
          {p}
        </button>
      ))}
    </div>
  );
}