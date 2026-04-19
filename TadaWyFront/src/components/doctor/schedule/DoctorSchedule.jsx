import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import DurationCard from "./DurationCard";
import FeeCard from "./FeeCard";
import WeeklyAvailability from "./Weeklyavailability";
import WeeklySummary from "./WeeklySummary";
import {
  scheduleStateToApiPayload,
  apiScheduleToState,
} from "../../../modules/doctor/utils/doctorScheduleUtils";
import {
  getDoctorSchedule,
  updateDoctorSchedule,
  getDoctorScheduleSummary,
} from "../../../modules/doctor/api/scheduleDoctorApi";

const DEFAULT_SCHEDULE = {
  fri: { enabled: true, slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
  sat: { enabled: false, slots: [] },
  sun: {
    enabled: true,
    slots: [
      { from: "09:00 AM", to: "01:00 PM" },
      { from: "08:00 PM", to: "12:00 AM" },
    ],
  },
  mon: { enabled: true, slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
  tue: { enabled: false, slots: [] },
  wed: { enabled: true, slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
  thu: { enabled: true, slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
};

export default function DoctorSchedule() {
  const { t } = useTranslation();
  const [duration, setDuration] = useState(20);
  const [fee, setFee] = useState(150);
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const dto = await getDoctorSchedule();
      const d = dto?.appointmentDurationMinutes ?? dto?.AppointmentDurationMinutes;
      const p = dto?.appointmentPrice ?? dto?.AppointmentPrice;
      if (d != null) setDuration(d);
      if (p != null) setFee(Number(p));
      const mapped = apiScheduleToState(dto);
      const hasAny = Object.values(mapped).some((x) => x.enabled);
      setSchedule(hasAny ? mapped : DEFAULT_SCHEDULE);
      try {
        const s = await getDoctorScheduleSummary();
        setSummary(s);
      } catch {
        setSummary(null);
      }
    } catch (e) {
      console.error(e);
      setSchedule(DEFAULT_SCHEDULE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleDay = (key, val) =>
    setSchedule((s) => ({
      ...s,
      [key]: {
        ...s[key],
        enabled: val,
        slots:
          val && s[key].slots.length === 0
            ? [{ from: "09:00 AM", to: "01:00 PM" }]
            : s[key].slots,
      },
    }));

  const updateSlot = (key, idx, field, val) =>
    setSchedule((s) => ({
      ...s,
      [key]: {
        ...s[key],
        slots: s[key].slots.map((slot, i) =>
          i === idx ? { ...slot, [field]: val } : slot,
        ),
      },
    }));

  const addSlot = (key) =>
    setSchedule((s) => ({
      ...s,
      [key]: {
        ...s[key],
        slots: [...s[key].slots, { from: "09:00 AM", to: "05:00 PM" }],
      },
    }));

  const removeSlot = (key, idx) =>
    setSchedule((s) => ({
      ...s,
      [key]: { ...s[key], slots: s[key].slots.filter((_, i) => i !== idx) },
    }));

  const workingDays =
    summary?.workingDaysCount ??
    summary?.WorkingDaysCount ??
    Object.values(schedule).filter((d) => d.enabled).length;
  const slotCount = Object.values(schedule).reduce(
    (acc, d) => acc + (d.enabled ? d.slots.length : 0),
    0,
  );
  const computedWeeklyAppts =
    slotCount * Math.max(1, Math.floor(240 / (duration || 20)));
  const totalAppts =
    summary?.totalAppointmentsPerWeek ??
    summary?.TotalAppointmentsPerWeek ??
    computedWeeklyAppts;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = scheduleStateToApiPayload(schedule, duration, fee);
      await updateDoctorSchedule(payload);
      await load();
      alert(t("doctorDashboard.schedule.saveSuccess", "Schedule saved"));
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Save failed";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-7 font-sans text-gray-500 dark:text-slate-400">
        {t("common.loading", "Loading…")}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-7 font-sans">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("doctorDashboard.schedule.title")}
          </h1>
          <p className="text-sm text-gray-400 dark:text-slate-400 mt-0.5">
            {t("doctorDashboard.schedule.availability")}
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-teal-600 disabled:opacity-60"
        >
          {saving
            ? t("common.saving", "Saving…")
            : t("doctorDashboard.schedule.save", "Save schedule")}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-5">
        <DurationCard duration={duration} onChange={setDuration} />
        <FeeCard fee={fee} onChange={setFee} />
      </div>

      <div className="mb-5">
        <WeeklyAvailability
          schedule={schedule}
          onToggle={toggleDay}
          onUpdateSlot={updateSlot}
          onAddSlot={addSlot}
          onRemoveSlot={removeSlot}
        />
      </div>

      <WeeklySummary
        workingDays={workingDays}
        totalAppts={totalAppts}
        duration={duration}
        fee={fee}
      />
    </div>
  );
}
