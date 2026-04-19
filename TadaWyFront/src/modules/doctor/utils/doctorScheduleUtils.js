/** UI day key (WeeklyAvailability order) -> .NET DayOfWeek (Sunday = 0) */
export const DAY_KEY_TO_NET = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

export const NET_TO_DAY_KEY = Object.fromEntries(
  Object.entries(DAY_KEY_TO_NET).map(([k, v]) => [v, k]),
);

const UI_DAY_KEYS = ["fri", "sat", "sun", "mon", "tue", "wed", "thu"];

export function emptyWeeklySchedule() {
  return Object.fromEntries(
    UI_DAY_KEYS.map((k) => [k, { enabled: false, slots: [] }]),
  );
}

/** Parse "09:00 AM" / "12:00 PM" -> "HH:mm:ss" */
export function meridiemToTimeSpanString(str) {
  if (!str || typeof str !== "string") return "00:00:00";
  const m = str.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return "00:00:00";
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && hour < 12) hour += 12;
  if (ap === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
}

/** "09:00:00" or TimeSpan JSON -> "09:00 AM" style used by TimeSelect */
export function timeSpanStringToMeridiem(span) {
  if (span == null) return "09:00 AM";
  const s = typeof span === "string" ? span : String(span);
  const parts = s.split(":");
  const h = parseInt(parts[0] || "0", 10);
  const min = parseInt(parts[1] || "0", 10);
  const period = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, "0")}:${String(min).padStart(2, "0")} ${period}`;
}

export function scheduleStateToApiPayload(schedule, duration, fee) {
  const weeklyAvailability = UI_DAY_KEYS.map((key) => {
    const day = schedule[key];
    const dayOfWeek = DAY_KEY_TO_NET[key];
    if (!day?.enabled) {
      return { dayOfWeek, isWorkingDay: false, timeSlots: [] };
    }
    const timeSlots = (day.slots || []).map((slot) => ({
      startTime: meridiemToTimeSpanString(slot.from),
      endTime: meridiemToTimeSpanString(slot.to),
    }));
    return { dayOfWeek, isWorkingDay: true, timeSlots };
  });

  return {
    appointmentDurationMinutes: duration,
    appointmentPrice: fee,
    weeklyAvailability,
  };
}

export function apiScheduleToState(dto) {
  const base = emptyWeeklySchedule();
  const list = dto?.weeklyAvailability || dto?.WeeklyAvailability;
  if (!Array.isArray(list)) return base;

  for (const row of list) {
    const dow = row.dayOfWeek ?? row.DayOfWeek;
    const key = NET_TO_DAY_KEY[dow];
    if (!key) continue;
    const isWorking = row.isWorkingDay ?? row.IsWorkingDay;
    const slotsRaw = row.timeSlots || row.TimeSlots || [];
    base[key] = {
      enabled: !!isWorking,
      slots: slotsRaw.map((ts) => ({
        from: timeSpanStringToMeridiem(ts.startTime ?? ts.StartTime),
        to: timeSpanStringToMeridiem(ts.endTime ?? ts.EndTime),
      })),
    };
    if (base[key].enabled && base[key].slots.length === 0) {
      base[key].slots = [{ from: "09:00 AM", to: "01:00 PM" }];
    }
  }
  return base;
}
