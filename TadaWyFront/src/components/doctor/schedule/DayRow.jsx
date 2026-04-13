// components/DayRow.jsx
import Toggle from "./Toggle";
import TimeSelect from "./TimeSelect";

export default function DayRow({ name, dayData, onToggle, onUpdateSlot, onAddSlot, onRemoveSlot }) {
  const { enabled, slots } = dayData;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-50 dark:border-[#334155]/30 last:border-b-0">
      {/* Toggle + Label */}
      <div className="flex items-center gap-3 w-28 flex-shrink-0 pt-1">
        <Toggle enabled={enabled} onChange={onToggle} />
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 leading-tight">{name}</p>
          {enabled && (
            <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-tight">
              {slots.length} slot{slots.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Slots or Day Off */}
      <div className="flex-1">
        {!enabled ? (
          <p className="text-gray-300 dark:text-slate-600 text-sm italic pt-1">Day Off</p>
        ) : (
          <div className="flex flex-col gap-2">
            {slots.map((slot, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-wrap">
                <TimeSelect value={slot.from} onChange={(v) => onUpdateSlot(idx, "from", v)} />
                <span className="text-gray-300 dark:text-slate-600 text-sm select-none">—</span>
                <TimeSelect value={slot.to} onChange={(v) => onUpdateSlot(idx, "to", v)} />
                {idx > 0 && (
                  <button
                    onClick={() => onRemoveSlot(idx)}
                    className="w-6 h-6 flex items-center justify-center rounded-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition text-lg leading-none"
                    title="Remove slot"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={onAddSlot}
              className="text-teal-500 hover:text-teal-700 text-xs font-semibold text-left mt-1 transition w-fit"
            >
              + Add time slot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}