import { useMemo, useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import CalendarGrid from "./CalendarGrid";
import AppointmentCard from "./AppointmentCard";
import { useTranslation } from "react-i18next";
import infoIcon from "../../assets/info.svg";
import {
  getAppointmentsByStatus,
  getAppointmentsByDate,
  getCalendarAppointments,
} from "../../modules/patient/api/patientAppointmentsApi";

const STATUS_TO_API = {
  pending: 0,
  confirmed: 1,
  cancelled: 2,
};

function formatSelectedDate(selectedDate, language) {
  if (!selectedDate) return "";
  return new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString(
    language,
    { month: "short", day: "numeric", year: "numeric" },
  );
}

export default function Calender() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  });
  const [activeStatus, setActiveStatus] = useState("pending");
  const [showPaymentLegend, setShowPaymentLegend] = useState(false);
  const paymentLegendRef = useRef(null);
  const { t, i18n } = useTranslation();

  const [appointmentDates, setAppointmentDates] = useState([]);
  const [appointmentsForSelectedDay, setAppointmentsForSelectedDay] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);

  // Fetch calendar dots when month/year changes
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const data = await getCalendarAppointments(month, year);
        // data: [{ date: "2026-04-25T00:00:00", hasAppointments: true }, ...]
        if (Array.isArray(data)) {
          const dates = data
            .filter((d) => d.hasAppointments)
            .map((d) => {
              const dt = new Date(d.date);
              return {
                year: dt.getFullYear(),
                month: dt.getMonth(),
                day: dt.getDate(),
                status: "pending", // Generic dot
              };
            });
          setAppointmentDates(dates);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCalendar();
  }, [currentDate]);

  // Fetch specific day appointments when selectedDate changes
  useEffect(() => {
    const fetchDay = async () => {
      if (!selectedDate) {
        setAppointmentsForSelectedDay([]);
        return;
      }
      try {
        const pad = (n) => n.toString().padStart(2, "0");
        const dateStr = `${selectedDate.year}-${pad(selectedDate.month + 1)}-${pad(selectedDate.day)}T00:00:00`;
        const data = await getAppointmentsByDate(dateStr);
        setAppointmentsForSelectedDay(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setAppointmentsForSelectedDay([]);
      }
    };
    fetchDay();
  }, [selectedDate]);

  // Fetch all appointments by status when status changes
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAppointmentsByStatus(STATUS_TO_API[activeStatus]);
        setAllAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setAllAppointments([]);
      }
    };
    fetchAll();
  }, [activeStatus]);

  useEffect(() => {
    if (!showPaymentLegend) return;
    const timer = setTimeout(() => setShowPaymentLegend(false), 5000);
    return () => clearTimeout(timer);
  }, [showPaymentLegend]);

  useEffect(() => {
    if (!showPaymentLegend) return;
    const close = (e) => {
      if (paymentLegendRef.current && !paymentLegendRef.current.contains(e.target)) {
        setShowPaymentLegend(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showPaymentLegend]);

  // Filter "all appointments" for the current viewing month/year locally
  const filteredAppointments = useMemo(() => {
    const list = allAppointments
      .filter((apt) => {
        if (!apt.date) return false;
        const d = new Date(apt.date);
        return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
      })
      .map((apt) => {
        const d = new Date(apt.date);
        return {
          id: apt.id,
          clinic: apt.specialty || "Clinic",
          doctor: apt.doctorName,
          specialty: apt.specialty,
          date: d.toLocaleDateString(i18n.language, { month: "short", day: "numeric", year: "numeric" }),
          time: d.toLocaleTimeString(i18n.language, { hour: "numeric", minute: "2-digit" }),
          rawDate: apt.date,
          status: activeStatus,
          paid: apt.isPaid === 1,
        };
      });
      
    return list.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
  }, [allAppointments, currentDate, activeStatus, i18n.language]);

  const localizedDayAppointments = useMemo(() => {
    const list = appointmentsForSelectedDay.map((apt) => {
      const d = new Date(apt.date);
      // Map API fields to what UI expects
      return {
        id: apt.id,
        clinic: apt.specialty || "Clinic",
        doctor: apt.doctorName,
        specialty: apt.specialty,
        date: d.toLocaleDateString(i18n.language, { month: "short", day: "numeric", year: "numeric" }),
        time: d.toLocaleTimeString(i18n.language, { hour: "numeric", minute: "2-digit" }),
        rawDate: apt.date,
        paid: apt.isPaid === 1,
      };
    });
    
    return list.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
  }, [appointmentsForSelectedDay, i18n.language]);

  const statusTabs = [
    { key: "confirmed", label: t("calendar.status.confirmed") },
    { key: "cancelled", label: t("calendar.status.cancelled") },
    { key: "pending", label: t("calendar.status.pending") },
  ];

  const getStatusTabClass = (statusKey) => {
    const base =
      "px-6 py-2 text-sm font-medium border-r border-gray-200 dark:border-[#334155] last:border-r-0 transition-colors";
    if (activeStatus !== statusKey) {
      if (statusKey === "cancelled") return `${base} text-red-600 dark:text-red-400 bg-white dark:bg-[#0F172A]`;
      if (statusKey === "pending") return `${base} text-[#00AFA0] dark:text-[#5EEAD4] bg-white dark:bg-[#0F172A]`;
      return `${base} text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#0F172A]`;
    }
    if (statusKey === "confirmed") return `${base} text-white bg-[#64748B] dark:bg-[#475569]`;
    if (statusKey === "cancelled") return `${base} text-white bg-[#FF001A]`;
    return `${base} text-white bg-[#00BBA7]`;
  };

  return (
    <div className="relative bg-white dark:bg-[#0F172A] flex flex-col flex-1 p-6 w-full box-border overflow-x-hidden">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-1">
        {t("calendar.title")}
      </h1>
      <p className="text-sm text-gray-500 dark:text-[#94A3B8] mb-6 m-0">
        {t("calendar.subtitle")}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-4 items-stretch">
        <div className="w-full rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 flex flex-col gap-6 overflow-hidden">
          <CalendarGrid
            currentDate={currentDate}
            onMonthChange={setCurrentDate}
            selectedDate={selectedDate}
            onSelectDay={setSelectedDate}
            appointmentDates={appointmentDates}
          />
        </div>

        <div className="w-full rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 flex flex-col justify-start shadow-sm">
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-0">
            {selectedDate ? formatSelectedDate(selectedDate, i18n.language) : t("calendar.selectDate")}
          </p>

          {selectedDate === null ? (
            <div className="flex-1 flex flex-col items-center justify-start gap-4 pt-16">
              <CalendarIcon size={48} strokeWidth={1.5} className="text-gray-300 dark:text-[#334155]" />
              <p className="text-sm text-gray-500 dark:text-[#94A3B8] text-center">
                {t("calendar.selectDateHint")}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col pt-3 gap-4">
              {localizedDayAppointments.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-[#94A3B8]">{t("calendar.noAppointments")}</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {localizedDayAppointments.map((apt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A]"
                    >
                      <p className="text-base font-semibold text-gray-800 dark:text-white m-0">{apt.clinic}</p>
                      <p className="text-sm text-gray-500 dark:text-[#94A3B8] mt-0.5 m-0">{apt.specialty}</p>
                      <div className="mt-2 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-gray-400 dark:text-[#94A3B8]" />
                          <span className="text-sm text-gray-500 dark:text-[#94A3B8]">{apt.doctor}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-gray-400 dark:text-[#94A3B8]" />
                          <span className="text-sm text-gray-500 dark:text-[#94A3B8]">{apt.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full">
        <div className="w-full rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 pr-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white m-0">
              {t("calendar.allAppointments")}
            </h2>
            <div className="relative flex items-center gap-2" ref={paymentLegendRef}>
              <div className="inline-flex items-center rounded-full overflow-hidden border border-[#CBD5E1] dark:border-[#334155]">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveStatus(tab.key)}
                    className={getStatusTabClass(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentLegend((p) => !p)}
                className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#334155]"
                aria-label="Payment legend"
              >
                <img src={infoIcon} alt="" className="w-5 h-5 dark:invert-[.9] dark:sepia-[.9] dark:hue-rotate-[130deg] dark:saturate-[500%]" />
              </button>
              {showPaymentLegend && (
                <div 
                  className={`absolute top-10 z-20 min-w-[140px] border-2 border-[#A7F3D0] bg-white dark:bg-[#1E293B] rounded-xl px-4 py-3 shadow-lg ${
                    i18n.language === "ar" ? "left-0" : "right-0"
                  }`}
                >
                  <p className="m-0 text-[#00BBA7] font-semibold text-sm">✓ {t("calendar.legend.paid")}</p>
                  <p className="m-0 text-[#EF4444] font-semibold text-sm mt-1">✕ {t("calendar.legend.notPaid")}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredAppointments.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-[#94A3B8] text-center py-4">
                {t("calendar.noCurrentAppointments") || "No current appointments"}
              </p>
            ) : (
              filteredAppointments.map((apt, i) => (
                <AppointmentCard
                  key={`${apt.id}-${i}`}
                  id={apt.id}
                  clinic={apt.clinic}
                  doctor={apt.doctor}
                  specialty={apt.specialty}
                  date={apt.date}
                  time={apt.time}
                  rawDate={apt.rawDate}
                  status={apt.status}
                  paid={apt.paid}
                  onCancel={() => {
                    setAppointmentsForSelectedDay((prev) => prev.filter((p) => p.id !== apt.id));
                    setAllAppointments((prev) => prev.filter((p) => p.id !== apt.id));
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
