import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

function getDaysGrid(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const grid = [];
  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  return grid;
}

export default function DayFilter({ activeDay, onDayChange, onDatePick, selectedDateKey }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stripStartDate, setStripStartDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });
  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const daysGrid = useMemo(() => getDaysGrid(year, monthIndex), [year, monthIndex]);
  const stripDays = useMemo(() => {
    const list = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(stripStartDate);
      d.setDate(stripStartDate.getDate() + i);
      list.push({
        label: d.toLocaleDateString(locale, { weekday: "short" }),
        date: d.toLocaleDateString(locale, { day: "numeric" }),
        value: d.toISOString().split("T")[0],
        dayKey: d.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase(),
      });
    }
    return list;
  }, [locale, stripStartDate]);

  const pickDate = (day) => {
    const dateObj = new Date(year, monthIndex, day);
    const dateKey = dateObj.toISOString().split("T")[0];
    onDatePick(dateKey);
    setShowCalendar(false);
  };

  return (
    <div className="relative bg-white dark:bg-[#1E293B] rounded-xl border border-gray-100 dark:border-[#334155] shadow-sm px-5 py-3 mb-3 flex items-center gap-2 flex-wrap">
      <Calendar className="w-4 h-4 text-[#00BBA7]" />
      <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{t("doctorDashboard.appointments.filterByDay")}</span>

      <button
        onClick={() => {
          onDayChange("all");
          onDatePick(null);
        }}
        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
          activeDay === "all" && !selectedDateKey
            ? "bg-teal-500 text-white"
            : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
        }`}
      >
        {t("doctorDashboard.appointments.allDays")}
      </button>

      <button
        type="button"
        onClick={() => {
          const d = new Date(stripStartDate);
          d.setDate(stripStartDate.getDate() - 1);
          setStripStartDate(d);
        }}
        className="w-7 h-7 rounded-md text-gray-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-slate-800 dark:text-slate-500 transition-colors cursor-pointer flex items-center justify-center"
      >
        <ChevronLeft size={16} />
      </button>

      {stripDays.map((d) => (
        <button
          key={d.value}
          onClick={() => {
            onDayChange(d.dayKey);
            onDatePick(d.value);
          }}
          className={`flex flex-col items-center justify-center min-w-[4.75rem] px-5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
            selectedDateKey === d.value
              ? "bg-teal-500 text-white"
              : "text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-[#334155] hover:bg-gray-200/80 dark:hover:bg-slate-800"
          }`}
        >
          <span className={selectedDateKey === d.value ? "font-semibold" : "font-semibold text-gray-700 dark:text-slate-200"}>{d.label}</span>
          <span className={selectedDateKey === d.value ? "font-normal opacity-90" : "font-normal text-gray-500 dark:text-slate-400"}>{d.date}</span>
        </button>
      ))}

      <button
        type="button"
        onClick={() => {
          const d = new Date(stripStartDate);
          d.setDate(stripStartDate.getDate() + 1);
          setStripStartDate(d);
        }}
        className="w-7 h-7 rounded-md text-gray-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-slate-800 dark:text-slate-500 transition-colors cursor-pointer flex items-center justify-center"
      >
        <ChevronRight size={16} />
      </button>

      <button
        type="button"
        onClick={() => setShowCalendar((prev) => !prev)}
        className="ml-auto text-[#00BBA7] flex items-center justify-center cursor-pointer hover:bg-teal-50 dark:hover:bg-slate-800 p-1 rounded-md transition-colors"
      >
        <Calendar className="w-5 h-5" />
      </button>

      {showCalendar && (
        <div className={`absolute top-14 z-20 w-80 bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-[#334155] shadow-lg p-4 ${i18n.language === "ar" ? "left-4" : "right-4"}`}>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-white cursor-pointer transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <select
                value={monthIndex}
                onChange={(e) => setCurrentDate(new Date(year, Number(e.target.value), 1))}
                className="text-sm border border-gray-200 dark:border-[#334155] dark:bg-[#0B1220] dark:text-white rounded-lg px-2 py-1 outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }).map((_, idx) => (
                  <option key={idx} value={idx} className="dark:bg-[#0B1220]">
                    {new Date(2026, idx, 1).toLocaleDateString(locale, { month: "short" })}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setCurrentDate(new Date(Number(e.target.value), monthIndex, 1))}
                className="text-sm border border-gray-200 dark:border-[#334155] dark:bg-[#0B1220] dark:text-white rounded-lg px-2 py-1 outline-none cursor-pointer"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y} className="dark:bg-[#0B1220]">
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-white cursor-pointer transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-gray-400 dark:text-slate-500 mb-2">
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const dayName = new Date(2026, 0, 4 + dayIndex).toLocaleDateString(locale, {
                weekday: "short",
              });
              return <span key={dayIndex}>{dayName}</span>;
            })}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {daysGrid.map((day, idx) => {
              const today = new Date();
              const isToday =
                day &&
                today.getFullYear() === year &&
                today.getMonth() === monthIndex &&
                today.getDate() === day;
              const selected =
                day &&
                selectedDateKey &&
                selectedDateKey === new Date(year, monthIndex, day).toISOString().split("T")[0];
              return day ? (
                <button
                  key={`${day}-${idx}`}
                  type="button"
                  onClick={() => pickDate(day)}
                  className={`h-9 rounded-lg text-sm cursor-pointer transition-all ${
                    selected
                      ? "bg-[#00BBA7] text-white"
                      : isToday
                        ? "bg-[#D1F5F1] text-[#0F766E] dark:bg-teal-900/30 dark:text-teal-400"
                        : "text-gray-700 dark:text-slate-200 hover:bg-[#D1F5F1] dark:hover:bg-slate-800 hover:text-[#0F766E] dark:hover:text-teal-400"
                  }`}
                >
                  {day}
                </button>
              ) : (
                <span key={`empty-${idx}`} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}