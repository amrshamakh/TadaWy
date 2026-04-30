import { X, AlertCircle, Activity } from "lucide-react";
import { assets } from "@/assets/assets";
import { useTranslation } from "react-i18next";

export default function PatientViewProfile({ appointment, onClose }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  if (!appointment) return null;

  // Mock data as requested to see the look and feel
  const mockAllergies = ["Penicillin", "Peanuts", "Dust"];
  const mockChronicDiseases = ["Hypertension", "Diabetes Type 2"];

  const patientData = {
    fullName: appointment.patientName || "John Doe",
    email: appointment.patientEmail || "patient@example.com",
    phone: appointment.patientPhone || "01128067848",
    gender: appointment.gender || (isAr ? "ذكر" : "Male"),
    age: appointment.age || 28,
    bloodType: appointment.bloodType || "O+",
    allergies: appointment.allergies?.length > 0 ? appointment.allergies : mockAllergies,
    chronicDiseases: appointment.chronicDiseases?.length > 0 ? appointment.chronicDiseases : mockChronicDiseases,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src={assets.logo} alt="TadaWy Logo" className="w-full h-full" />
            </div>
            <span className="font-semibold text-xl text-gray-800 dark:text-white">TadaWy</span>
          </div>
          <button onClick={onClose} className="transition-colors">
            <X size={20} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-300" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-5">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t("profile.personalInfo.fullName", "Full Name")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
              {patientData.fullName}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t("profile.personalInfo.age", "Age")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
              {patientData.age} {t("common.years", "Years")}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t("profile.personalInfo.phoneNumber", "Phone Number")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
              {patientData.phone}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t("profile.personalInfo.gender", "Gender")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
              {patientData.gender}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t("profile.personalInfo.email", "Email Address")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-semibold truncate" title={patientData.email}>
              {patientData.email}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t("profile.medicalInfo.bloodType", "Blood Type")}
            </label>
            <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
              {patientData.bloodType}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t("profile.medicalInfo.allergies", "Allergies")}
            </label>
            <div className="flex flex-wrap gap-2">
              {patientData.allergies.length > 0 ? (
                patientData.allergies.map((allergy, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-xs font-semibold">
                    <AlertCircle size={14} />
                    {allergy}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-xs">{t("common.none", "None")}</span>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t("profile.medicalInfo.chronicDiseases", "Chronic Diseases")}
            </label>
            <div className="flex flex-wrap gap-2">
              {patientData.chronicDiseases.length > 0 ? (
                patientData.chronicDiseases.map((disease, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30 text-xs font-semibold">
                    <Activity size={14} />
                    {disease}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-xs">{t("common.none", "None")}</span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
