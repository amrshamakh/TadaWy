import { useTranslation } from "react-i18next";

export default function AppointmentCard({ clinic, doctor, specialty, date, time, status }) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center justify-between gap-3 px-4 py-4 rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B]">
      
      {/* Left: Info */}
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-gray-800 dark:text-white m-0">{clinic}</p>
        <p className="text-sm text-gray-700 dark:text-[#94A3B8] m-0">{doctor}</p>
        {specialty && (
          <p className="text-sm text-gray-500 dark:text-[#94A3B8] mt-0.5 m-0">{specialty}</p>
        )}
      </div>

      {/* Status badge */}
      {status && (
        <div className="flex-shrink-0">
          <span
            className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap
              ${status === "upcoming"
                ? "bg-[#D1F5F1] border-[#D1F5F1] text-[#0F766E] dark:bg-[#1E4944] dark:border-[#1E4944] dark:text-[#5EEAD4]"
                : "bg-gray-100 border-gray-200 text-gray-500 dark:bg-[#334155] dark:border-[#334155] dark:text-[#94A3B8]"
              }`}
          >
            {t(`calendar.status.${status}`)}
          </span>
        </div>
      )}

      {/* Right */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-white m-0">{date}</p>
        <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5 m-0">{time}</p>
      </div>
    </div>
  );
}