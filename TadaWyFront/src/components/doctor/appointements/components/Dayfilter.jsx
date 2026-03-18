import { Calendar, ChevronRight } from "lucide-react";
import { days } from "../data/appointmentsData";

export default function DayFilter({ activeDay, onDayChange }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 mb-3 flex items-center gap-2 flex-wrap">
      <Calendar className="w-4 h-4 text-teal-500" />
      <span className="text-sm font-medium text-gray-500">Filter By Day:</span>
      <ChevronRight className="w-3.5 h-3.5 text-gray-400 mr-1" />

      <button
        onClick={() => onDayChange("All Days")}
        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
          activeDay === "All Days"
            ? "bg-teal-500 text-white"
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        All Days
      </button>

      {days.map((d) => (
        <button
          key={d.label}
          onClick={() => onDayChange(d.label)}
          className={`flex flex-col items-center px-4 py-1 rounded-lg text-xs font-medium transition-colors ${
            activeDay === d.label
              ? "bg-teal-500 text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <span>{d.label}</span>
          <span>{d.date}</span>
        </button>
      ))}
    </div>
  );
}