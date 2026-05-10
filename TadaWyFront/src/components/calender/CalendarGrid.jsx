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
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 relative" ref={legendWrapRef}>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white m-0">
            {new Date(year, monthIndex).toLocaleDateString(i18n.language, {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            type="button"
            onClick={() => setShowLegend((p) => !p)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#334155]"
            aria-label="Calendar legend"
          >
            <img src={infoIcon} alt="" className="w-4 h-4 dark:invert-[.9] dark:sepia-[.9] dark:hue-rotate-[130deg] dark:saturate-[500%]" />
          </button>
          {showLegend && (
            <div
              className={`absolute top-8 z-30 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl p-3 shadow-lg min-w-[200px] ${
                i18n.language === "ar" ? "right-0" : "left-0"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded border-2 border-[#00BBA7] bg-[#E6FFFA] dark:bg-[#00BBA7]/20" />
                  <span className="text-xs text-gray-700 dark:text-white">{t("calendar.legend.today")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded border-2 border-[#00BBA7] bg-[#00BBA7]" />
                  <span className="text-xs text-gray-700 dark:text-white">{t("calendar.legend.pressedOn")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-4 h-4 rounded border-2 border-transparent bg-transparent flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                  </div>
                  <span className="text-xs text-gray-700 dark:text-white">{t("calendar.legend.appointment")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#334155]"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-white" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#334155]"
          >
            <ChevronRight size={20} className="text-gray-600 dark:text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(2023, 0, 1 + i);
          const dayName = date.toLocaleDateString(i18n.language, { weekday: "short" });
          return (
            <div key={i} className="text-center text-xs font-medium text-gray-400 dark:text-[#94A3B8]">
              {dayName}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="w-full aspect-[1.2/1]" />;
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
            "relative w-full aspect-[1.2/1] rounded-xl border-2 flex items-center justify-center cursor-pointer text-base font-medium transition-colors ";

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
                    className={`absolute bottom-[3px] sm:bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dotClass}`}
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
