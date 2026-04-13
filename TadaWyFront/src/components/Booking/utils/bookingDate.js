export function toReadableDateTime(dateLabel, timeLabel, lang = "en-US") {
  // If dateLabel is "13 Apr", try to parse it. 
  // Note: Parsing localized dates is tricky. Best to store raw dates if possible, 
  // but let's fix the immediate output for now.
  const now = new Date();
  const year = now.getFullYear();
  
  // Basic attempt to format for output based on lang
  const l = lang === "ar" ? "ar-EG" : "en-US";
  
  // We can't easily parse a translated string back into a Date without a lot of logic.
  // Instead, let's just return a formatted string.
  return `${dateLabel} - ${timeLabel}`;
}

export function getVisibleDays(startDate, dateOffset, lang = "en-US", count = 5) {
  const daysArr = [];
  const l = lang === "ar" ? "ar-EG" : "en-US";
  for (let i = 0; i < count; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + dateOffset + i);
    daysArr.push({
      day: d.toLocaleDateString(l, { weekday: "short" }),
      date: `${d.getDate()} ${d.toLocaleDateString(l, { month: "short" })}`,
    });
  }
  return daysArr;
}
