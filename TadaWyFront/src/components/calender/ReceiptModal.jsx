import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export default function ReceiptModal({ receipt, onClose }) {
  const { t, i18n } = useTranslation();

  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#334155]">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white m-0">
            {t("calendar.receipt.title") || "Receipt Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#334155]"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-[#94A3B8]">Doctor:</span>
              <span className="font-medium text-gray-800 dark:text-white">{receipt.doctorName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-[#94A3B8]">Specialty:</span>
              <span className="font-medium text-gray-800 dark:text-white">{receipt.specialty}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-[#94A3B8]">Patient:</span>
              <span className="font-medium text-gray-800 dark:text-white">{receipt.patientName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-[#94A3B8]">Date:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {new Date(receipt.date).toLocaleString(i18n.language)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-[#94A3B8]">Payment Method:</span>
              <span className="font-medium text-gray-800 dark:text-white">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-[#94A3B8]">Price:</span>
              <span className="font-medium text-gray-800 dark:text-white">{receipt.price} EGP</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-[#334155] flex flex-col gap-2 text-sm">
            <p className="text-gray-500 dark:text-[#94A3B8] m-0 mb-1">Location details:</p>
            <p className="font-medium text-gray-800 dark:text-white m-0">{receipt.doctorLocation?.state}</p>
            <p className="text-gray-600 dark:text-gray-400 m-0">{receipt.doctorLocationDetails}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
