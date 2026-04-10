export function toReadableDateTime(dateLabel, timeLabel) {
  const parts = dateLabel.split(" ");
  const dayNum = Number(parts[0]);
  const monthShort = parts[1];
  if (!dayNum || !monthShort || !timeLabel) return "";

  const now = new Date();
  const parsedDate = new Date(`${monthShort} ${dayNum}, ${now.getFullYear()} ${timeLabel}`);
  if (Number.isNaN(parsedDate.getTime())) return `${dateLabel} - ${timeLabel}`;

  return parsedDate.toLocaleString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getVisibleDays(startDate, dateOffset, count = 5) {
  const daysArr = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + dateOffset + i);
    daysArr.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: `${d.getDate()} ${d.toLocaleDateString("en-US", { month: "short" })}`,
    });
  }
  return daysArr;
}
