import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import StatsRow from "./components/StatsRow";
import DayFilter from "./components/Dayfilter";
import PaymentFilter from "./components/PaymentFilter";
import DateGroup from "./components/DateGroup";
import { DAY_TO_DATE } from "./data/appointmentsData";
import { 
  getDoctorAppointments, 
  confirmAppointment, 
  cancelAppointment 
} from "@/modules/doctor/api/appointmentsDoctorApi";

export default function DoctorAppointments() {
  const { i18n } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("all");
  const [pickedDate, setPickedDate] = useState(null);
  const [activePayment, setActivePayment] = useState("all");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDoctorAppointments();
      setAppointments(response.appointments || []);
      
      // Map API counts to stats row format
      setStats([
        { label: "all", value: response.totalAppointments || 0, color: "text-gray-800" },
        { label: "confirmed", value: response.confirmedCount || 0, color: "text-teal-500" },
        { label: "pending", value: response.pendingCount || 0, color: "text-orange-400" },
        { label: "cancelled", value: response.cancelledCount || 0, color: "text-red-400" },
      ]);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleConfirm = async (id) => {
    try {
      await confirmAppointment(id);
      await fetchAppointments();
    } catch (error) {
      console.error("Failed to confirm appointment:", error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      await fetchAppointments();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  const filtered = appointments.filter((apt) => {
    const aptDateOnly = apt.appointmentDate.split("T")[0];
    const dateByDay = activeDay === "all" ? null : DAY_TO_DATE[activeDay];
    const dayMatch = pickedDate ? aptDateOnly === pickedDate : (activeDay === "all" || aptDateOnly === dateByDay);

    const paymentMatch =
      activePayment === "all" || 
      (activePayment === "online" && apt.paymentMethod === 1) ||
      (activePayment === "clinic" && apt.paymentMethod === 0);

    return dayMatch && paymentMatch;
  });

  const grouped = filtered.reduce((acc, apt) => {
    const fallbackDate = new Date(apt.appointmentDate).toLocaleDateString(
      i18n.language === "ar" ? "ar-EG" : "en-US",
      { weekday: "long", month: "long", day: "numeric", year: "numeric" }
    );
    const key = fallbackDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(apt);
    return acc;
  }, {});

  if (loading && appointments.length === 0) {
    return <div className="p-6 text-center">{i18n.language === "ar" ? "جاري التحميل..." : "Loading..."}</div>;
  }

  return (
    <div className="min-h-screen  p-6">
      <StatsRow stats={stats} />
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

      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([date, apts]) => (
          <DateGroup 
            key={date} 
            dateLabel={date} 
            apts={apts} 
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">
          {i18n.language === "ar" ? "لا توجد مواعيد متاحة" : "No appointments available"}
        </div>
      )}
    </div>
  );
}
