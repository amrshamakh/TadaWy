// components/FeeCard.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FeeCard({ fee, onChange }) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(fee);

  const handleSave = () => {
    onChange(Number(temp));
    setEditing(false);
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm p-5 flex-1 min-w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-teal-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </span>
        <span className="font-semibold text-gray-800 dark:text-slate-200 text-sm">{t("doctorDashboard.schedule.fee")}</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-slate-400 mb-4">{t("doctorDashboard.schedule.feeSubtitle")}</p>

      <div className="flex items-center gap-3">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={temp}
              autoFocus
              onChange={(e) => setTemp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="w-24 border-2 border-teal-400 dark:border-teal-500 rounded-lg px-3 py-1.5 text-lg font-bold text-teal-600 dark:text-teal-400 dark:bg-[#0F172A] outline-none"
            />
            <span className="text-sm font-semibold text-gray-400 dark:text-slate-500">{t("doctorDashboard.schedule.le")}</span>
            <button
              onClick={handleSave}
              className="text-xs font-semibold text-white bg-teal-500 dark:bg-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-600 dark:hover:bg-teal-500 transition cursor-pointer"
            >
              {t("doctorDashboard.profile.save")}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 rounded-xl px-4 py-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0bbfb0" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span className="text-xl font-extrabold text-teal-500 dark:text-teal-400">{fee} {t("doctorDashboard.schedule.le")}</span>
            </div>
            <button
              onClick={() => { setTemp(fee); setEditing(true); }}
              className="text-sm font-semibold text-teal-500 hover:text-teal-700 transition cursor-pointer"
            >
              {t("doctorDashboard.profile.edit")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}