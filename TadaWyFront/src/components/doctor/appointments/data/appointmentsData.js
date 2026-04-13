export const appointments = [
  { id: "Apt-001", name: "John Mitchhell", date: "2026-03-04", time: "09:00 AM", duration: "30 min", status: "confirmed", payment: "online", phone: null },
  { id: "Apt-002", name: "John Mitchhell", date: "2026-03-04", time: "09:30 AM", duration: "30 min", status: "cancelled", payment: "online", phone: null },
  { id: "Apt-003", name: "John Mitchhell", date: "2026-03-04", time: "10:00 AM", duration: "30 min", status: "confirmed", payment: "online", phone: null },
  { id: "Apt-004", name: "John Mitchhell", date: "2026-03-05", time: "09:00 AM", duration: "30 min", status: "pending", payment: "clinic", phone: "+20 1187428342" },
  { id: "Apt-005", name: "John Mitchhell", date: "2026-03-05", time: "09:30 AM", duration: "30 min", status: "confirmed", payment: "online", phone: null },
];

export const days = [
  { label: "Sat", date: "1" },
  { label: "Sun", date: "2" },
  { label: "Mon", date: "2" },
  { label: "Tue", date: "2" },
  { label: "Wed", date: "2" },
  { label: "Thu", date: "-" },
];

export const paymentOptions = ["all", "online", "clinic"];

export const stats = [
  { label: "all", value: 9, color: "text-gray-800" },
  { label: "confirmed", value: 5, color: "text-teal-500" },
  { label: "pending", value: 2, color: "text-orange-400" },
  { label: "cancelled", value: 2, color: "text-red-400" },
];

export const generateDateLabels = (start, days) => {
  const result = {};

  const startDate = new Date(start);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const key = date.toISOString().split("T")[0];

    const label = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    result[key] = label;
  }

  return result;
};

export const DATE_LABELS = generateDateLabels("2026-03-15", 7);


export const DAY_TO_DATE = {
  sat: "2026-03-01",
  sun: "2026-03-02",
  mon: "2026-03-03",
  tue: "2026-03-04",
  wed: "2026-03-05",
  thu: "2026-03-06",
};