import { FileText, X } from "lucide-react";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";
import { useLocalizedField } from "../hooks/useLocalizedField";
import { useEffect, useState } from "react";
import { useDoctors } from "../context/doctorContext";

const statusStyles = {
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
  Pending: "bg-yellow-100 text-yellow-700",
  Banned: "bg-gray-200 text-gray-600",
};

export default function DoctorModal({ doctor: summaryDoctor, onClose, onApprove, onReject, onBan, onUnban }) {
  const { t } = useTranslation();
  const localize = useLocalizedField();
  const { getDoctorDetails } = useDoctors();
  const [doctor, setDoctor] = useState(summaryDoctor);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (summaryDoctor?.id) {
      setDoctor(summaryDoctor); // Show summary first
      const fetchDetails = async () => {
        setLoading(true);
        const detailedData = await getDoctorDetails(summaryDoctor.id);
        if (detailedData) setDoctor(detailedData);
        setLoading(false);
      };
      fetchDetails();
    }
  }, [summaryDoctor?.id]);

  if (!summaryDoctor) return null;

  const isApproved = doctor?.status === "Approved";
  const isRejected = doctor?.status === "Rejected";
  const isPending = doctor?.status === "Pending";
  const isBanned = doctor?.status === "Banned";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src={assets.logo} alt="TadaWy Logo" className="w-full h-full" />
            </div>
            <span className="font-semibold text-xl text-gray-800 dark:text-white">TadaWy</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[doctor?.status || summaryDoctor.status]}`}>
              {t(`admin.doctorModal.status.${doctor?.status || summaryDoctor.status}`)}
            </span>
            <button onClick={onClose} className="transition-colors">
              <X size={20} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-5">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.doctorName")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {doctor?.name || summaryDoctor.name}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.clinicLocation")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {doctor?.clinicLocation || "—"}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.doctorId")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {doctor?.id || summaryDoctor.id}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.clinicDetails") || "Clinic Details"}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {doctor?.clinicDetails || "—"}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.phoneNumber")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {doctor?.phone || "—"}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.cvUploaded")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 flex items-center justify-between">
              {doctor?.cvUrl ? (
                <a 
                  href={doctor.cvUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dark:text-gray-300 truncate mr-2 hover:underline hover:text-teal-500 transition-all cursor-pointer"
                  title={doctor?.cv}
                >
                  {doctor?.cv || "—"}
                </a>
              ) : (
                <span className="dark:text-gray-300 truncate mr-2" title={doctor?.cv}>
                  {doctor?.cv || "—"}
                </span>
              )}
              <FileText size={16} className="text-gray-400 dark:text-gray-300" />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.emailAddress")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {doctor?.email || "—"}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              {t("admin.doctorModal.specialization")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {localize(doctor || summaryDoctor, "specialization") || "—"}
            </div>
          </div>

          {((isRejected && doctor?.rejectionReason) || (isBanned && doctor?.bannedReason)) && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                {isRejected ? "Rejection Reason" : "Banned Reason"}
              </label>
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg px-3 py-2 text-sm text-red-700 dark:text-red-300">
                {isRejected ? doctor.rejectionReason : doctor.bannedReason}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 pb-6 flex justify-end gap-3">
          {isBanned && (
            <button onClick={() => { onUnban(doctor); onClose(); }} className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
              {t("admin.doctorModal.actions.unban")}
            </button>
          )}
          {isApproved && (
            <>
              <button onClick={() => { onBan(doctor); onClose(); }} className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.ban")}
              </button>
              <button onClick={() => { onReject(doctor); onClose(); }} className="border border-red-400 text-red-500 hover:bg-red-50 text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.reject")}
              </button>
            </>
          )}
          {isRejected && (
            <>
              <button onClick={() => { onBan(doctor); onClose(); }} className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.ban")}
              </button>
              <button onClick={() => { onApprove(doctor); onClose(); }} className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.approve")}
              </button>
            </>
          )}
          {isPending && (
            <>
              <button onClick={() => { onBan(doctor); onClose(); }} className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.ban")}
              </button>
              <button onClick={() => { onReject(doctor); onClose(); }} className="border border-red-400 text-red-500 hover:bg-red-50 text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.reject")}
              </button>
              <button onClick={() => { onApprove(doctor); onClose(); }} className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                {t("admin.doctorModal.actions.approve")}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
