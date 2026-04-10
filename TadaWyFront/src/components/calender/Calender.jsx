import { useMemo, useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import CalendarGrid from "./CalendarGrid";
import AppointmentCard from "./AppointmentCard";
import { useTranslation } from "react-i18next";
import infoIcon from "../../assets/info.svg";

/** April 2026 sample data (month index 3). */
const SAMPLE_APPOINTMENTS = [
  {
    clinicKey: "3",
    year: 2026,
    month: 3,
    day: 12,
    hour: 14,
    minute: 0,
    status: "upcoming",
    paid: true,
  },
  {
    clinicKey: "1",
    year: 2026,
    month: 3,
    day: 21,
    hour: 10,
    minute: 0,
    status: "upcoming",
    paid: false,
  },
  {
    clinicKey: "2",
    year: 2026,
    month: 3,
    day: 7,
    hour: 11,
    minute: 30,
    status: "missed",
    paid: false,
  },
  {
    clinicKey: "3",
    year: 2026,
    month: 3,
    day: 2,
    hour: 9,
    minute: 0,
    status: "completed",
    paid: false,
  },
];

function getAppointmentsForDate(appointments, selectedDate) {
  if (!selectedDate) return [];
  return appointments.filter(
    (apt) =>
      apt.year === selectedDate.year &&
      apt.month === selectedDate.month &&
      apt.day === selectedDate.day,
  );
}

function formatSelectedDate(selectedDate, language) {
  if (!selectedDate) return "";
  return new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString(
    language,
    { month: "short", day: "numeric", year: "numeric" },
  );
}

export default function Calender() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeStatus, setActiveStatus] = useState("upcoming");
  const [showPaymentLegend, setShowPaymentLegend] = useState(false);
  const paymentLegendRef = useRef(null);
  const { t, i18n } = useTranslation();

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

  const localizedAppointments = useMemo(() => {
    return SAMPLE_APPOINTMENTS.map((apt) => {
      const clinic = t(`discover.clinicsData.${apt.clinicKey}.name`);
      const doctor = t(`discover.clinicsData.${apt.clinicKey}.doctor`);
      const specialty = t(`discover.clinicsData.${apt.clinicKey}.specialty`);
      const dateObj = new Date(apt.year, apt.month, apt.day, apt.hour, apt.minute);
      return {
        ...apt,
        clinic,
        doctor,
        specialty,
        date: dateObj.toLocaleDateString(i18n.language, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: dateObj.toLocaleTimeString(i18n.language, {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
    });
  }, [i18n.language, t]);

  const appointmentsForSelectedDay = useMemo(
    () => getAppointmentsForDate(localizedAppointments, selectedDate),
    [selectedDate, localizedAppointments],
  );

  const appointmentDates = useMemo(
    () =>
      localizedAppointments.map(({ year, month, day, status }) => ({
        year,
        month,
        day,
        status,
      })),
    [localizedAppointments],
  );

  const filteredAppointments = useMemo(
    () => localizedAppointments.filter((apt) => apt.status === activeStatus),
    [localizedAppointments, activeStatus],
  );

  const statusTabs = [
    { key: "completed", label: "Completed" },
    { key: "missed", label: "Missed" },
    { key: "upcoming", label: "Upcoming" },
  ];

  const getStatusTabClass = (statusKey) => {
    const base =
      "px-6 py-2 text-sm font-medium border-r border-gray-200 dark:border-[#334155] last:border-r-0 transition-colors";
    if (activeStatus !== statusKey) {
      if (statusKey === "missed") return `${base} text-red-600 dark:text-red-400 bg-white dark:bg-[#0F172A]`;
      if (statusKey === "upcoming") return `${base} text-[#00AFA0] dark:text-[#5EEAD4] bg-white dark:bg-[#0F172A]`;
      return `${base} text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#0F172A]`;
    }
    if (statusKey === "completed") return `${base} text-white bg-[#64748B] dark:bg-[#475569]`;
    if (statusKey === "missed") return `${base} text-white bg-[#FF001A]`;
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
              {appointmentsForSelectedDay.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-[#94A3B8]">{t("calendar.noAppointments")}</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {appointmentsForSelectedDay.map((apt, i) => (
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
                <img src={infoIcon} alt="" className="w-5 h-5" />
              </button>
              {showPaymentLegend && (
                <div className="absolute right-0 top-10 z-20 min-w-[140px] border-2 border-[#A7F3D0] bg-white dark:bg-[#1E293B] rounded-xl px-4 py-3 shadow-lg">
                  <p className="m-0 text-[#00BBA7] font-semibold text-sm">✓ Paid</p>
                  <p className="m-0 text-[#EF4444] font-semibold text-sm mt-1">✕ Not paid</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredAppointments.map((apt, i) => (
              <AppointmentCard
                key={`${apt.year}-${apt.month}-${apt.day}-${i}`}
                clinic={apt.clinic}
                doctor={apt.doctor}
                specialty={apt.specialty}
                date={apt.date}
                time={apt.time}
                status={apt.status}
                paid={apt.paid}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
