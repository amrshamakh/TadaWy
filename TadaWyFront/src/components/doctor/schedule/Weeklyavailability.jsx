// components/WeeklyAvailability.jsx
import DayRow from "./DayRow";
import { useTranslation } from "react-i18next";

const DAYS = [
  { key: "fri" },
  { key: "sat" },
  { key: "sun" },
  { key: "mon" },
  { key: "tue" },
  { key: "wed" },
  { key: "thu" },
];

export default function WeeklyAvailability({ schedule, onToggle, onUpdateSlot, onAddSlot, onRemoveSlot }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-teal-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        <h2 className="font-bold text-gray-800 dark:text-slate-200 text-[15px]">{t("doctorDashboard.schedule.availability")}</h2>
      </div>

      <div>
        {DAYS.map(({ key }) => (
          <DayRow
            key={key}
            name={t(`doctorDashboard.schedule.days.${key}`)}
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