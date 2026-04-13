import { useState } from "react";
import { useTranslation } from "react-i18next";
import StatsRow from "./components/StatsRow";
import DayFilter from "./components/Dayfilter";
import PaymentFilter from "./components/PaymentFilter";
import DateGroup from "./components/DateGroup";
import {
  appointments,
  DAY_TO_DATE,
} from "./data/appointmentsData";

export default function DoctorAppointments() {
  const { i18n } = useTranslation();
  const [activeDay, setActiveDay] = useState("all");
  const [pickedDate, setPickedDate] = useState(null);
  const [activePayment, setActivePayment] = useState("all");

  const filtered = appointments.filter((apt) => {
    const dateByDay = activeDay === "all" ? null : DAY_TO_DATE[activeDay];
    const dayMatch = pickedDate ? apt.date === pickedDate : (activeDay === "all" || apt.date === dateByDay);

    const paymentMatch =
      activePayment === "all" || apt.payment === activePayment;

    return dayMatch && paymentMatch;
  });

  const grouped = filtered.reduce((acc, apt) => {
    const fallbackDate = new Date(apt.date).toLocaleDateString(
      i18n.language === "ar" ? "ar-EG" : "en-US",
      { weekday: "long", month: "long", day: "numeric", year: "numeric" }
    );
    const key = fallbackDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(apt);
    return acc;
  }, {});

  return (
    <div className="min-h-screen  p-6">
      <StatsRow />
      <DayFilter
        activeDay={activeDay}
        selectedDateKey={pickedDate}
        onDayChange={(day) => {
          setActiveDay(day);
          setPickedDate(day === "all" ? null : DAY_TO_DATE[day] || null);
        }}
        onDatePick={(dateStr) => {
          setPickedDate(dateStr);
          if (dateStr) setActiveDay("all");
        }}
      />
      <PaymentFilter
        activePayment={activePayment}
        onPaymentChange={setActivePayment}
      />

      {Object.entries(grouped).map(([date, apts]) => (
        <DateGroup key={date} dateLabel={date} apts={apts} />
      ))}
    </div>
  );
}
