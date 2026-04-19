import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import StatsRow from "./components/StatsRow";
import DayFilter from "./components/Dayfilter";
import PaymentFilter from "./components/PaymentFilter";
import DateGroup from "./components/DateGroup";
import { getDoctorAppointments } from "../../../modules/doctor/api/doctorAppointmentsApi";

export const generateDateLabels = (start, days) => {
  const result = {};

  const startDate = new Date(start);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const key = `${yyyy}-${mm}-${dd}`;

    const label = date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    result[label.toLowerCase()] = key;
  }

  return result;
};

// Generates next 7 days for the filter 
export const DAY_TO_DATE = generateDateLabels(new Date().toISOString(), 7);


export default function DoctorAppointments() {
  const { t, i18n } = useTranslation();
  const [activeDay, setActiveDay] = useState("all");
  const [pickedDate, setPickedDate] = useState(null);
  const [activePayment, setActivePayment] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getDoctorAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filtered = appointments.filter((apt) => {
    const aptDate = apt.date || apt.Date;
    const aptPayment = apt.payment || apt.Payment;

    const dateByDay = activeDay === "all" ? null : DAY_TO_DATE[activeDay];
    const dayMatch = pickedDate ? aptDate === pickedDate : (activeDay === "all" || aptDate === dateByDay);

    const paymentMatch =
      activePayment === "all" || aptPayment?.toLowerCase() === activePayment;

    return dayMatch && paymentMatch;
  });

  const grouped = filtered.reduce((acc, apt) => {
    const aptDate = apt.date || apt.Date;
    const fallbackDate = new Date(aptDate).toLocaleDateString(
      i18n.language === "ar" ? "ar-EG" : "en-US",
      { weekday: "long", month: "long", day: "numeric", year: "numeric" }
    );
    const key = fallbackDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(apt);
    return acc;
  }, {});

  if (loading) {
     return <div className="p-6">{t("common.loading", "Loading...")}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <StatsRow appointments={appointments} />
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
        customDayToDate={DAY_TO_DATE}
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
