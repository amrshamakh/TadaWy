import { useState } from "react";
import StatsRow from "./components/StatsRow";
import DayFilter from "./components/Dayfilter";
import PaymentFilter from "./components/PaymentFilter";
import DateGroup from "./components/DateGroup";
import {
  appointments,
  DATE_LABELS,
  DAY_TO_DATE,
} from "./data/appointmentsData";

export default function DoctorAppointements() {
  const [activeDay, setActiveDay] = useState("All Days");
  const [activePayment, setActivePayment] = useState("All Payments");

  const filtered = appointments.filter((apt) => {
    const dayMatch =
      activeDay === "All Days" || apt.date === DAY_TO_DATE[activeDay];

    const paymentMatch =
      activePayment === "All Payments" || apt.payment === activePayment;

    return dayMatch && paymentMatch;
  });

  const grouped = filtered.reduce((acc, apt) => {
    const key = DATE_LABELS[apt.date] ?? apt.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(apt);
    return acc;
  }, {});

  return (
    <div className="min-h-screen  p-6">
      <StatsRow />
      <DayFilter activeDay={activeDay} onDayChange={setActiveDay} />
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
