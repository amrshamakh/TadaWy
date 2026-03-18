// components/WeeklyAvailability.jsx
import DayRow from "./DayRow";

const DAYS = [
  { name: "Friday",    key: "fri" },
  { name: "Saturday",  key: "sat" },
  { name: "Sunday",    key: "sun" },
  { name: "Monday",    key: "mon" },
  { name: "Tuesday",   key: "tue" },
  { name: "Wednesday", key: "wed" },
  { name: "Thursday",  key: "thu" },
];

export default function WeeklyAvailability({ schedule, onToggle, onUpdateSlot, onAddSlot, onRemoveSlot }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-teal-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        <h2 className="font-bold text-gray-800 text-[15px]">Weekly Availability</h2>
      </div>

      <div>
        {DAYS.map(({ name, key }) => (
          <DayRow
            key={key}
            name={name}
            dayData={schedule[key]}
            onToggle={(val) => onToggle(key, val)}
            onUpdateSlot={(idx, field, val) => onUpdateSlot(key, idx, field, val)}
            onAddSlot={() => onAddSlot(key)}
            onRemoveSlot={(idx) => onRemoveSlot(key, idx)}
          />
        ))}
      </div>
    </div>
  );
}