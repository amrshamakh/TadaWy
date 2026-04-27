import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import infoIcon from "../../assets/info.svg";

function getAppointmentStatusOnDate(appointmentDates, year, monthIndex, day) {
  if (!appointmentDates?.length) return null;
  const match = appointmentDates.find(
    (d) => d.year === year && d.month === monthIndex && d.day === day,
  );
  return match?.status ?? null;
}

function getDaysForMonth(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const grid = [];
  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  return grid;
}

const DOT = {
  pending: "bg-[#EF4444]",
  cancelled: "bg-[#EF4444]",
  confirmed: "bg-[#94A3B8]",
};

export default function CalendarGrid({ selectedDate, onSelectDay, appointmentDates, currentDate, onMonthChange }) {
  const [showLegend, setShowLegend] = useState(false);
  const legendWrapRef = useRef(null);

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const { t, i18n } = useTranslation();
  const days = useMemo(() => getDaysForMonth(year, monthIndex), [year, monthIndex]);

  useEffect(() => {
    if (!showLegend) return;
    const t = setTimeout(() => setShowLegend(false), 5000);
    return () => clearTimeout(t);
  }, [showLegend]);

  useEffect(() => {
    if (!showLegend) return;
    const close = (e) => {
      if (legendWrapRef.current && !legendWrapRef.current.contains(e.target)) {
        setShowLegend(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showLegend]);

  const isDaySelected = (day) =>
    selectedDate &&
    selectedDate.year === year &&
    selectedDate.month === monthIndex &&
    selectedDate.day === day;

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, monthIndex - 1, 1));
    onSelectDay?.(null);
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(year, monthIndex + 1, 1));
    onSelectDay?.(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 relative" ref={legendWrapRef}>
          <h2 className="text-lg font-medium text-gray-800 dark:text-white m-0">
            {new Date(year, monthIndex).toLocaleDateString(i18n.language, {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            type="button"
            onClick={() => setShowLegend((p) => !p)}
            className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#334155]"
            aria-label="Calendar legend"
          >
            <img src={infoIcon} alt="" className="w-4 h-4 dark:invert-[.9] dark:sepia-[.9] dark:hue-rotate-[130deg] dark:saturate-[500%]" />
          </button>
          {showLegend && (
            <div
              className={`absolute top-0 z-30 bg-white dark:bg-[#1E293B] border-2 border-[#14B8A6] rounded-xl px-4 py-3 shadow-lg min-w-[200px] ${
                i18n.language === "ar" ? "right-[calc(100%+8px)]" : "left-[calc(100%+8px)]"
              }`}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <span className="inline-flex w-5 h-5 shrink-0 rounded-md border-2 border-[#14B8A6] bg-white dark:bg-[#0F172A]" />
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{t("calendar.legend.today")}</span>
              </div>
              <div className="flex items-center gap-3 mb-2.5">
                <span className="inline-flex w-5 h-5 shrink-0 rounded-md bg-[#14B8A6]" />
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{t("calendar.legend.pressedOn")}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="relative inline-flex w-5 h-5 shrink-0 rounded-md border-2 border-[#14B8A6] bg-white dark:bg-[#0F172A]">
                  <span className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{t("calendar.legend.appointment")}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-700 dark:text-white" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors"
          >
            <ChevronRight size={20} className="text-gray-700 dark:text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-x-1.5 mb-3">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(2023, 0, 1 + i);
          const dayName = date.toLocaleDateString(i18n.language, { weekday: "short" });
          return (
            <div key={i} className="text-center text-sm font-medium text-gray-500 dark:text-[#94A3B8]">
              {dayName}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="w-full aspect-square" />;
          }

          const today = new Date();
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === monthIndex &&
            today.getDate() === day;
          const isSelected = isDaySelected(day);
          const status = getAppointmentStatusOnDate(appointmentDates, year, monthIndex, day);
          const showDot = Boolean(status);

          let cellClass =
            "relative w-full aspect-square rounded-xl border-2 flex items-center justify-center cursor-pointer text-base font-medium transition-colors ";

          if (isSelected) {
            cellClass += "bg-[#E6FFFA] dark:bg-[#00BBA7]/20 border-[#00BBA7] text-gray-800 dark:text-white ";
          } else if (isToday) {
            cellClass += "bg-transparent border-[#00BBA7] text-gray-800 dark:text-white ";
          } else if (status === "pending") {
            cellClass += "bg-transparent border-transparent text-gray-800 dark:text-white ";
          } else if (status === "cancelled") {
            cellClass += "bg-transparent border-transparent text-gray-800 dark:text-white ";
          } else if (status === "confirmed") {
            cellClass += "bg-transparent border-transparent text-gray-800 dark:text-white ";
          } else {
            cellClass +=
              "bg-transparent border-transparent text-gray-700 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#334155] ";
          }

          const dotClass = status ? DOT[status] : DOT.pending;

          return (
            <div key={index} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onSelectDay({ year, month: monthIndex, day })}
                className={cellClass}
              >
                <span className="leading-none">{day}</span>
                {showDot && (
                  <span
                    aria-hidden
                    className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dotClass}`}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
