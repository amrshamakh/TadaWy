import { useState } from "react";
import { Clock, ChevronDown, ClipboardList } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function AppointmentCard({ apt }) {
 const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Left: name + id */}
        <div className="flex items-center gap-3">
          <ClipboardList className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{apt.name}</p>
            <p className="text-xs text-gray-400">{apt.id}</p>
          </div>
        </div>

        {/* Right: time + status + chevron */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Clock className="w-4 h-4 text-teal-500" />
            {apt.time} · {apt.duration}
          </div>
          <StatusBadge status={apt.status} />
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && apt.phone && (
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex gap-16 mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Phone Number:</p>
              <p className="text-sm text-gray-700 font-medium">{apt.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Payment:</p>
              <p className="text-sm text-teal-500 font-medium">{apt.payment}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg transition-colors">
              View Profile
            </button>
            <button className="px-5 py-2 border border-red-300 text-red-400 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}