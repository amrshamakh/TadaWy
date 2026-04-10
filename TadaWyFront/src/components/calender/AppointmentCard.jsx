import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AppointmentCard({ clinic, doctor, specialty, date, time, status, paid }) {
  const [expanded, setExpanded] = useState(false);
  const isUpcoming = status === "upcoming";
  const isMissed = status === "missed";
  const isCompleted = status === "completed";

  const statusLabel = isUpcoming ? "Upcoming" : isMissed ? "Missed" : "Completed";
  const statusPillClass = isUpcoming
    ? "text-[#00BBA7] border-[#00BBA7] bg-transparent"
    : isMissed
      ? "text-[#DC2626] border-[#DC2626] bg-transparent"
      : "text-[#64748B] border-[#64748B] bg-transparent";

  return (
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
            {isUpcoming && (
              <span className={paid ? "text-[#00BBA7]" : "text-[#EF4444]"}>{paid ? "✓" : "✕"}</span>
            )}
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
          <button
            type="button"
            className="px-4 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-[#EF4444] hover:bg-red-50 active:bg-red-100 dark:bg-[#0F172A] dark:border-[#334155] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-[#00BBA7] hover:bg-teal-50 active:bg-teal-100 dark:bg-[#0F172A] dark:border-[#334155] transition-colors"
          >
            Details
          </button>
          {isCompleted && (
            <button
              type="button"
              className="px-4 py-1.5 text-sm rounded-full bg-[#00BBA7] text-white hover:bg-[#009e8f] active:bg-[#008f82] transition-colors"
            >
              Review
            </button>
          )}
        </div>
      )}
    </div>
  );
}
