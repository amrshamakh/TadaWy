// components/TimeSelect.jsx
import { useTranslation } from "react-i18next";

const TIMES = [
  "12:00 AM","01:00 AM","02:00 AM","03:00 AM","04:00 AM","05:00 AM",
  "06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM",
  "06:00 PM","07:00 PM","08:00 PM","09:00 PM","10:00 PM","11:00 PM",
];

export default function TimeSelect({ value, onChange }) {
  const { t } = useTranslation();
  const toLocalizedTimeLabel = (time) =>
    time.replace("AM", t("common.am")).replace("PM", t("common.pm"));

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-slate-200 bg-gray-50 dark:bg-[#0F172A] cursor-pointer outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-200 dark:focus:ring-teal-900/30 transition shadow-sm"
    >
      {TIMES.map((t) => (
        <option key={t} value={t}>{toLocalizedTimeLabel(t)}</option>
      ))}
    </select>
  );
}