import { stats } from "../data/appointmentsData";

export default function StatsRow() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4"
        >
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}