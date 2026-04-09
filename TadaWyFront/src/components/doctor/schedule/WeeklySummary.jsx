// components/WeeklySummary.jsx
export default function WeeklySummary({ workingDays, totalAppts, duration, fee }) {
  const stats = [
    { label: "Working days",     value: workingDays },
    { label: "Total appts/week", value: totalAppts },
    { label: "Appt duration",    value: `${duration} min` },
    { label: "Per appointment",  value: `${fee} L.E` },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-gray-800 text-[15px] mb-4">Weekly Summary</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3"
          >
            <p className="text-2xl font-extrabold text-teal-500 leading-tight">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}