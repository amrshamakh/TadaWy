import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { cancelAppointment, getAppointmentReceipt } from "../../modules/patient/api/patientAppointmentsApi";
import ReceiptModal from "./ReceiptModal";

export default function AppointmentCard({ id, clinic, doctor, specialty, date, time, rawDate, status, paid, onCancel }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [isFetchingReceipt, setIsFetchingReceipt] = useState(false);

  const isPending = status === "pending";
  const isCancelled = status === "cancelled";
  const isConfirmed = status === "confirmed";
  
  const isPastAppointment = rawDate && new Date(rawDate) < new Date();

  const statusLabel = isPending ? t("calendar.status.pending") : isCancelled ? t("calendar.status.cancelled") : t("calendar.status.confirmed");
  const statusPillClass = isPending
    ? "text-[#00BBA7] border-[#00BBA7] bg-transparent"
    : isCancelled
      ? "text-[#DC2626] border-[#DC2626] bg-transparent"
      : "text-[#64748B] border-[#64748B] bg-transparent";

  const executeCancel = async () => {
    try {
      setIsCanceling(true);
      await cancelAppointment(id);
      toast.success("Appointment canceled successfully");
      onCancel?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel appointment.");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleCancel = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="m-0 text-sm font-medium text-gray-800 dark:text-gray-200">
            Are you sure you want to cancel this appointment?
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={closeToast}
              className="px-3 py-1.5 text-xs font-medium rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              No, keep it
            </button>
            <button
              onClick={() => {
                closeToast();
                executeCancel();
              }}
              className="px-3 py-1.5 text-xs font-medium rounded bg-[#EF4444] text-white hover:bg-red-700 transition-colors"
            >
              Yes, cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center"
      }
    );
  };

  const handleDetails = async () => {
    try {
      setIsFetchingReceipt(true);
      const data = await getAppointmentReceipt(id);
      setReceipt(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch receipt details.");
    } finally {
      setIsFetchingReceipt(false);
    }
  };

  return (
    <>
      <div className="w-full rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B]">
        <div className="w-full flex items-center justify-between gap-3 px-4 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-gray-800 dark:text-white m-0">{clinic}</p>
            <p className="text-sm text-gray-700 dark:text-[#94A3B8] m-0">{doctor}</p>
            {specialty && (
              <p className="text-sm text-gray-500 dark:text-[#94A3B8] mt-0.5 m-0">{specialty}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold border rounded-full px-2.5 py-1 ${statusPillClass}`}
            >
              {statusLabel}
            </span>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white m-0">{date}</p>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5 m-0">{time}</p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200/80 dark:hover:bg-[#334155] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BBA7]"
              aria-expanded={expanded}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-gray-200 dark:border-[#334155] px-4 py-3 flex justify-end gap-2 bg-gray-50 dark:bg-[#1E293B] rounded-b-xl">
            {isPending && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCanceling || isPastAppointment}
                title={isPastAppointment ? "Appointment date has passed" : ""}
                className="px-4 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-[#EF4444] hover:bg-red-50 active:bg-red-100 dark:bg-[#0F172A] dark:border-[#334155] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCanceling ? "Canceling..." : t("doctorDashboard.appointments.cancel")}
              </button>
            )}
            <button
              type="button"
              onClick={handleDetails}
              disabled={isFetchingReceipt}
              className="px-4 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-[#00BBA7] hover:bg-teal-50 active:bg-teal-100 dark:bg-[#0F172A] dark:border-[#334155] disabled:opacity-50 transition-colors"
            >
              {isFetchingReceipt ? "Loading..." : t("doctorDashboard.appointments.details")}
            </button>
            {isConfirmed && (
              <button
                type="button"
                className="px-4 py-1.5 text-sm rounded-full bg-[#00BBA7] text-white hover:bg-[#009e8f] active:bg-[#008f82] transition-colors"
              >
                {t("doctorDashboard.profile.reviews")}
              </button>
            )}
          </div>
        )}
      </div>

      {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
    </>
  );
}
