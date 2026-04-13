
import { useState } from "react";
import DurationCard from "./DurationCard"; 
import FeeCard from "./FeeCard";
import WeeklyAvailability from "./Weeklyavailability";
import WeeklySummary     from "./WeeklySummary";

const INITIAL_SCHEDULE = {
  fri: { enabled: true,  slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
  sat: { enabled: false, slots: [] },
  sun: { enabled: true,  slots: [{ from: "09:00 AM", to: "01:00 PM" }, { from: "08:00 PM", to: "12:00 AM" }] },
  mon: { enabled: true,  slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
  tue: { enabled: false, slots: [] },
  wed: { enabled: true,  slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
  thu: { enabled: true,  slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
};

export default function DoctorSchedule() {
  const [duration, setDuration] = useState(20);
  const [fee,      setFee]      = useState(150);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);

  /* ── schedule helpers ── */
  const toggleDay = (key, val) =>
    setSchedule((s) => ({
      ...s,
      [key]: {
        ...s[key],
        enabled: val,
        slots: val && s[key].slots.length === 0 ? [{ from: "09:00 AM", to: "01:00 PM" }] : s[key].slots,
      },
    }));

  const updateSlot = (key, idx, field, val) =>
    setSchedule((s) => ({
      ...s,
      [key]: {
        ...s[key],
        slots: s[key].slots.map((slot, i) => (i === idx ? { ...slot, [field]: val } : slot)),
      },
    }));

  const addSlot = (key) =>
    setSchedule((s) => ({
      ...s,
      [key]: { ...s[key], slots: [...s[key].slots, { from: "09:00 AM", to: "05:00 PM" }] },
    }));

  const removeSlot = (key, idx) =>
    setSchedule((s) => ({
      ...s,
      [key]: { ...s[key], slots: s[key].slots.filter((_, i) => i !== idx) },
    }));

  /* ── summary calculations ── */
  const workingDays  = Object.values(schedule).filter((d) => d.enabled).length;
  const totalSlots   = Object.values(schedule).reduce((acc, d) => acc + (d.enabled ? d.slots.length : 0), 0);
  const totalAppts   = totalSlots * Math.floor(240 / duration);

  return (
    <div className="min-h-screen p-7 font-sans">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">My schedule</h1>
        <p className="text-sm text-gray-400 dark:text-slate-400 mt-0.5">
          Set your available hours so patients can book appointments
        </p>
      </div>

      {/* Top row: Duration + Fee */}
      <div className="flex flex-wrap gap-4 mb-5">
        <DurationCard duration={duration} onChange={setDuration} />
        <FeeCard      fee={fee}           onChange={setFee} />
      </div>

      {/* Weekly availability */}
      <div className="mb-5">
        <WeeklyAvailability
          schedule={schedule}
          onToggle={toggleDay}
          onUpdateSlot={updateSlot}
          onAddSlot={addSlot}
          onRemoveSlot={removeSlot}
        />
      </div>

      {/* Weekly summary */}
      <WeeklySummary
        workingDays={workingDays}
        totalAppts={totalAppts}
        duration={duration}
        fee={fee}
      />
    </div>
  );
}