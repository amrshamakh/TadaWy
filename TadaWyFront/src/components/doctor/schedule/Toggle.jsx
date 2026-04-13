// components/Toggle.jsx
export default function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-[22px] rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-300 dark:focus:ring-teal-900/40
        ${enabled ? "bg-teal-400 dark:bg-teal-500" : "bg-gray-200 dark:bg-slate-700"}`}
      aria-checked={enabled}
      role="switch"
    >
      <span
        className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all duration-200
          ${enabled ? "left-[21px]" : "left-[3px]"}`}
      />
    </button>
  );
}