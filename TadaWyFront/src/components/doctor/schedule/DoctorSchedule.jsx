import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DurationCard from "./DurationCard"; 
import FeeCard from "./FeeCard";
import WeeklyAvailability from "./Weeklyavailability";
import WeeklySummary     from "./WeeklySummary";
import { getDoctorSchedule, updateDoctorSchedule } from "@/modules/doctor/api/scheduleDoctorApi";

const INITIAL_SCHEDULE = {
  fri: { enabled: true,  slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
  sat: { enabled: false, slots: [] },
  sun: { enabled: true,  slots: [{ from: "09:00 AM", to: "01:00 PM" }, { from: "08:00 PM", to: "12:00 AM" }] },
  mon: { enabled: true,  slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
  tue: { enabled: false, slots: [] },
  wed: { enabled: true,  slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
  thu: { enabled: true,  slots: [{ from: "09:00 AM", to: "01:00 PM" }] },
};

/* ── Helpers ── */
const DAY_MAPPING_TO_BACKEND = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const DAY_MAPPING_TO_FRONTEND = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };

const parseTimeSpanToAMPM = (timeSpan) => { 
  if (!timeSpan) return "09:00 AM";
  let [hours, minutes] = timeSpan.split(":");
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; 
  const strHour = h < 10 ? '0' + h : h.toString();
  return `${strHour}:${minutes} ${ampm}`;
};

const parseAMPMToTimeSpan = (timeStr) => { 
  if (!timeStr) return "09:00:00";
  // Handle case where sometimes space might be missing or different
  const timeStrClean = timeStr.trim().toUpperCase();
  const ampmMatch = timeStrClean.match(/(AM|PM)/);
  const modifier = ampmMatch ? ampmMatch[0] : 'AM';
  const timePart = timeStrClean.replace(/(AM|PM)/, '').trim();
  
  let [hours, minutes] = timePart.split(':');
  if (!minutes) minutes = "00";
  
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  let h = hours.toString().padStart(2, '0');
  let m = minutes.toString().padStart(2, '0');
  return `${h}:${m}:00`;
};

export default function DoctorSchedule() {
  const { t } = useTranslation();
  const [duration, setDuration] = useState(20);
  const [fee,      setFee]      = useState(150);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  
  const isFirstLoad = useRef(true);
  const saveTimeoutRef = useRef(null);

  // 1. Fetch Schedule on Mount
  useEffect(() => {
    getDoctorSchedule()
      .then((data) => {
        if (data) {
          setDuration(data.appointmentDurationMinutes || 20);
          setFee(data.appointmentPrice || 150);
          if (data.weeklyAvailability && data.weeklyAvailability.length > 0) {
            const newSchedule = {
              fri: { enabled: false, slots: [] },
              sat: { enabled: false, slots: [] },
              sun: { enabled: false, slots: [] },
              mon: { enabled: false, slots: [] },
              tue: { enabled: false, slots: [] },
              wed: { enabled: false, slots: [] },
              thu: { enabled: false, slots: [] },
            };
            data.weeklyAvailability.forEach((wa) => {
              const dayKey = DAY_MAPPING_TO_FRONTEND[wa.dayOfWeek];
              if (dayKey) {
                newSchedule[dayKey] = {
                  enabled: wa.isWorkingDay,
                  slots: wa.timeSlots.map(ts => ({
                    from: parseTimeSpanToAMPM(ts.startTime),
                    to: parseTimeSpanToAMPM(ts.endTime)
                  }))
                };
              }
            });
            setSchedule(newSchedule);
          }
        }
      })
      .catch((err) => console.error("Error loading schedule:", err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Validation
  const scheduleErrors = useMemo(() => {
    const errs = {};
    Object.keys(schedule).forEach(dayKey => {
      const day = schedule[dayKey];
      errs[dayKey] = [];
      if (day.enabled) {
        day.slots.forEach((slot, idx) => {
          let err = null;
          if (slot.from === slot.to) {
            err = t("doctorDashboard.schedule.identicalError", "Time start and end is identical");
          } else {
            const getSpan = (s) => {
              const fromTimeSpan = parseAMPMToTimeSpan(s.from);
              const toTimeSpan = parseAMPMToTimeSpan(s.to);
              const [fH, fM] = fromTimeSpan.split(':').map(Number);
              const [tH, tM] = toTimeSpan.split(':').map(Number);
              const fMins = (fH * 60) + fM;
              let tMins = (tH * 60) + tM;
              if (tMins <= fMins && tMins === 0) tMins += 1440;
              else if (tMins < fMins) tMins += 1440;
              return [fMins, tMins];
            };
            const [aStart, aEnd] = getSpan(slot);
            for (let j = 0; j < day.slots.length; j++) {
              if (j === idx) continue;
              const [bStart, bEnd] = getSpan(day.slots[j]);
              if (Math.max(aStart, bStart) < Math.min(aEnd, bEnd)) {
                err = t("doctorDashboard.schedule.overlapError", "Time is duplicated");
                break;
              }
            }
          }
          errs[dayKey][idx] = err;
        });
      }
    });
    return errs;
  }, [schedule, t]);

  const hasAnyErrors = useMemo(() => {
    return Object.values(scheduleErrors).some(dayErrs => dayErrs.some(err => err !== null));
  }, [scheduleErrors]);

  // 2. Auto-save on Changes
  useEffect(() => {
    if (loading) return; // Don't save while initially loading data
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return; // Skip the first render after data load
    }

    if (hasAnyErrors) {
      if (!error) setError(t("doctorDashboard.schedule.validationError", "Please fix time slots errors before saving."));
      return;
    } else {
      setError("");
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const weeklyAvailability = Object.entries(schedule).map(([key, val]) => ({
          dayOfWeek: DAY_MAPPING_TO_BACKEND[key],
          isWorkingDay: val.enabled,
          timeSlots: val.slots.map(slot => ({
            startTime: parseAMPMToTimeSpan(slot.from),
            endTime: parseAMPMToTimeSpan(slot.to)
          }))
        }));

        const payload = {
          appointmentDurationMinutes: duration,
          appointmentPrice: fee,
          weeklyAvailability: weeklyAvailability
        };
        
        await updateDoctorSchedule(payload);
      } catch (err) {
        console.error("Save error:", err);
      } finally {
        setIsSaving(false);
      }
    }, 1500);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [duration, fee, schedule, loading, hasAnyErrors]);

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

  const updateSlot = (key, idx, field, val) => {
    setSchedule((s) => {
      const updatedSlots = s[key].slots.map((slot, i) => (i === idx ? { ...slot, [field]: val } : slot));
      return {
        ...s,
        [key]: {
          ...s[key],
          slots: updatedSlots,
        },
      };
    });
  };

  const addSlot = (key) => {
    setSchedule((s) => {
      const newSlot = { from: "09:00 AM", to: "05:00 PM" };
      const updatedSlots = [...s[key].slots, newSlot];
      return {
        ...s,
        [key]: { ...s[key], slots: updatedSlots },
      };
    });
  };

  const removeSlot = (key, idx) => {
    setSchedule((s) => ({
      ...s,
      [key]: { ...s[key], slots: s[key].slots.filter((_, i) => i !== idx) },
    }));
  };

  /* ── summary calculations ── */
  const calculateMinutesDifference = (fromStr, toStr) => {
    if (!fromStr || !toStr) return 0;
    
    const fromTimeSpan = parseAMPMToTimeSpan(fromStr);
    const toTimeSpan = parseAMPMToTimeSpan(toStr);
    
    const [fH, fM] = fromTimeSpan.split(':').map(Number);
    const [tH, tM] = toTimeSpan.split(':').map(Number);
    
    let fMins = (fH * 60) + fM;
    let tMins = (tH * 60) + tM;

    // Handle crossing midnight (e.g., 08:00 PM to 12:00 AM)
    if (tMins <= fMins && tMins === 0) { 
      tMins += 1440; // 12:00 AM next day
    } else if (tMins < fMins) {
      tMins += 1440; 
    }
    
    return tMins - fMins;
  };

  const workingDays  = Object.values(schedule).filter((d) => d.enabled).length;
  
  const totalAppts = Object.values(schedule).reduce((acc, day) => {
    if (!day.enabled) return acc;
    const dayAppointments = day.slots.reduce((slotAcc, slot) => {
      const diffMins = calculateMinutesDifference(slot.from, slot.to);
      const possibleApptsInSlot = Math.floor(diffMins / (duration || 20));
      return slotAcc + (possibleApptsInSlot > 0 ? possibleApptsInSlot : 0);
    }, 0);
    return acc + dayAppointments;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen p-7 font-sans flex justify-center items-center">
        <p className="text-gray-500">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-7 font-sans relative">
      {/* Save Indicator */}
      {isSaving && (
        <div className="absolute top-4 right-7 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 opacity-75">
          <span className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
          <span>Saving...</span>
        </div>
      )}

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t("doctorDashboard.schedule.title")}</h1>
        <p className="text-sm text-gray-400 dark:text-slate-400 mt-0.5">
          {t("doctorDashboard.schedule.availability")}
        </p>
      </div>

      {/* Top row: Duration + Fee */}
      <div className="flex flex-wrap gap-4 mb-5">
        <DurationCard duration={duration} onChange={setDuration} />
        <FeeCard      fee={fee}           onChange={setFee} />
      </div>

      {/* Weekly availability */}
      <div className="mb-5">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md border border-red-200">
            {error}
          </div>
        )}
        <WeeklyAvailability
          schedule={schedule}
          scheduleErrors={scheduleErrors}
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