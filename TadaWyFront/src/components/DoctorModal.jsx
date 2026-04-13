import { FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";
import { useLocalizedField } from "../hooks/useLocalizedField";

const statusStyles = {
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
  Pending: "bg-yellow-100 text-yellow-700",
  Banned: "bg-gray-200 text-gray-600",
};

export default function DoctorModal({ doctor, onClose, onApprove, onReject, onBan, onUnban, onActionSuccess }) {
  const { t } = useTranslation();
  const localize = useLocalizedField();
  const [actionType, setActionType] = useState(null);
  const [actionReason, setActionReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  useEffect(() => {
    setActionType(null);
    setActionReason("");
    setReasonError("");
  }, [doctor?.id]);

  if (!doctor) return null;

  const isApproved = doctor.status === "Approved";
  const isRejected = doctor.status === "Rejected";
  const isPending = doctor.status === "Pending";
  const isBanned = doctor.status === "Banned";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src={assets.logo} alt="TadaWy Logo" className="w-full h-full" />
            </div>
            <span className="font-semibold text-xl text-gray-800 dark:text-white">TadaWy</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[doctor.status]}`}>
              {t(`admin.doctorModal.status.${doctor.status}`)}
            </span>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-[#1E293B] rounded-full transition-colors">
              <X size={18} className="text-gray-500 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.doctorName")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {localize(doctor, "name")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.clinicLocation")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
             {localize(doctor,"clinicLocation")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.doctorId")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {doctor.id}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.clinicDetails")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
               {localize(doctor,"clinicDetails")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.phoneNumber")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {doctor.phone}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.cvUploaded")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 flex items-center justify-between">
              <span className="dark:text-gray-300">{doctor.cv}</span>
              <FileText size={16} className="text-gray-400 dark:text-gray-300" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.emailAddress")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {doctor.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.specialization")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {localize(doctor, "specialization") || "—"}
            </div>
          </div>
          {isBanned && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                {t("admin.doctorModal.banReason")}
              </label>
              <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 min-h-10">
                {doctor.banReason || t("admin.doctorModal.noBanReason")}
              </div>
            </div>
          )}
          {isRejected && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                {t("admin.doctorModal.rejectReason")}
              </label>
              <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 min-h-10">
                {doctor.rejectReason || t("admin.doctorModal.noRejectReason")}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 pb-6 flex justify-end gap-3 flex-wrap">
          {isBanned && (
            <button onClick={() => { onUnban(doctor); onClose(); }} className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
              {t("admin.doctorModal.actions.unban")}
            </button>
          )}
          {isApproved && (
            <>
              <button onClick={() => { setActionType("ban"); }} className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.ban")}
              </button>
              <button onClick={() => { setActionType("reject"); }} className="border border-red-400 text-red-500 hover:bg-red-50 text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.reject")}
              </button>
            </>
          )}
          {isRejected && (
            <>
              <button onClick={() => { setActionType("ban"); }} className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.ban")}
              </button>
              <button onClick={() => { onApprove(doctor); onClose(); }} className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.approve")}
              </button>
            </>
          )}
          {isPending && (
            <>
              <button onClick={() => { setActionType("ban"); }} className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.ban")}
              </button>
              <button onClick={() => { setActionType("reject"); }} className="border border-red-400 text-red-500 hover:bg-red-50 text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.reject")}
              </button>
              <button onClick={() => { onApprove(doctor); onClose(); }} className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.approve")}
              </button>
            </>
          )}
        </div>
        {actionType && (
          <div className="px-6 pb-6">
            <div className="rounded-xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#111827] p-4 space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {actionType === "ban"
                  ? t("admin.doctorModal.banReasonPrompt")
                  : t("admin.doctorModal.rejectReasonPrompt")}
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => {
                  setActionReason(e.target.value);
                  if (e.target.value.trim()) setReasonError("");
                }}
                placeholder={
                  actionType === "ban"
                    ? t("admin.doctorModal.banReasonPlaceholder")
                    : t("admin.doctorModal.rejectReasonPlaceholder")
                }
                className="w-full min-h-24 rounded-lg border border-gray-300 dark:border-[#475569] bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 p-3 text-sm outline-none focus:ring-2 focus:ring-teal-500"
              />
              {reasonError && (
                <p className="text-xs text-red-500">{reasonError}</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActionType(null);
                    setActionReason("");
                    setReasonError("");
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#475569] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] text-sm"
                >
                  {t("admin.doctorModal.actions.cancel")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const reason = actionReason.trim();
                    if (!reason) {
                      setReasonError(t("admin.doctorModal.reasonRequired"));
                      return;
                    }
                    if (actionType === "ban") {
                      onBan(doctor, reason);
                    } else {
                      onReject(doctor, reason);
                    }
                    setActionType(null);
                    setActionReason("");
                    setReasonError("");
                    onClose();
                    if (onActionSuccess) {
                      const message =
                        actionType === "ban"
                          ? t("admin.doctorContext.banAlert", { name: localize(doctor, "name") })
                          : t("admin.doctorContext.rejectAlert", { name: localize(doctor, "name") });
                      onActionSuccess(message);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
                >
                  {actionType === "ban"
                    ? t("admin.doctorModal.actions.confirmBan")
                    : t("admin.doctorModal.actions.confirmReject")}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}