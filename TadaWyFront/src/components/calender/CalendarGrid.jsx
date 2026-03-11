import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

export default function CalendarGrid({
  selectedDate,
  onSelectDay,
  appointmentDates,
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 1, 1));
  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const { t, i18n } = useTranslation();
  const days = useMemo(
    () => getDaysForMonth(year, monthIndex),
    [year, monthIndex],
  );

  const isDaySelected = (day) =>
    selectedDate &&
    selectedDate.year === year &&
    selectedDate.month === monthIndex &&
    selectedDate.day === day;

  const handlePrevMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    onSelectDay?.(null);
  };

  const handleNextMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    onSelectDay?.(null);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white m-0">
          {new Date(year, monthIndex).toLocaleDateString(i18n.language, {
            month: "long",
            year: "numeric",
          })}
        </h2>
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

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-x-1.5 mb-3">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(2026, 1, i + 1);
          const dayName = date.toLocaleDateString(i18n.language, {
            weekday: "short",
          });

          return (
            <div
              key={i}
              className="text-center text-sm font-medium text-gray-500 dark:text-[#94A3B8]"
            >
              {dayName}
            </div>
          );
        })}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="w-full aspect-square" />;
          }

          const isSelected = isDaySelected(day);
          const status = getAppointmentStatusOnDate(
            appointmentDates,
            year,
            monthIndex,
            day,
          );
          const hasDot = Boolean(status);

          let cellClass =
            "relative w-full aspect-square rounded-xl border-2 flex items-center justify-center cursor-pointer text-base font-medium transition-colors ";

          if (isSelected) {
            if (status === "upcoming") {
              cellClass +=
                "bg-[#D1F5F1] dark:bg-[#1E4944] border-[#00BBA7] dark:border-[#00BBA7] text-gray-800 dark:text-white";
            } else if (status === "completed") {
              cellClass +=
                "bg-[#D1F5F1] dark:bg-[#1E4944] border-gray-400 dark:border-[#475569] text-gray-800 dark:text-white";
            } else {
              cellClass +=
                "bg-[#D1F5F1] dark:bg-[#1E4944] border-[#D1F5F1] dark:border-[#1E4944] text-gray-800 dark:text-white";
            }
          } else {
            cellClass +=
              "bg-transparent border-transparent text-gray-700 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#334155] hover:border-gray-200 dark:hover:border-[#334155]";
          }

          return (
            <div key={index} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onSelectDay({ year, month: monthIndex, day })}
                className={cellClass}
              >
                <span className="leading-none">{day}</span>
                {hasDot && (
                  <span
                    aria-hidden
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1ECAB8]"
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
