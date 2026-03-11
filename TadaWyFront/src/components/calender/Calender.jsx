import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import CalendarGrid from "./CalendarGrid";
import AppointmentCard from "./AppointmentCard";
import { useTranslation } from "react-i18next";
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const SAMPLE_APPOINTMENTS = [
  {
    clinicKey: "1",
    year: 2026,
    month: 1,
    day: 5,
    hour: 10,
    minute: 0,
    status: "upcoming",
  },
  {
    clinicKey: "3",
    year: 2026,
    month: 1,
    day: 12,
    hour: 14,
    minute: 0,
    status: "completed",
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

  return new Date(
    selectedDate.year,
    selectedDate.month,
    selectedDate.day
  ).toLocaleDateString(language, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Calender() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { t, i18n } = useTranslation();
const localizedAppointments = useMemo(() => {
  return SAMPLE_APPOINTMENTS.map((apt) => {
    const clinic = t(`discover.clinicsData.${apt.clinicKey}.name`);
    const doctor = t(`discover.clinicsData.${apt.clinicKey}.doctor`);
    const specialty = t(`discover.clinicsData.${apt.clinicKey}.specialty`);

    const dateObj = new Date(
      apt.year,
      apt.month,
      apt.day,
      apt.hour,
      apt.minute
    );

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
  return (
    <div className="relative bg-white dark:bg-[#0F172A]  flex flex-col flex-1 p-6 w-full box-border overflow-x-hidden">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-1">
        {t("calendar.title")}
      </h1>
      <p className="text-sm text-gray-500 dark:text-[#94A3B8] mb-6">
        {t("calendar.subtitle")}
      </p>

      {/* Top row: calendar + date detail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-4 items-stretch">
        {/* Main calendar frame */}
        <div className="w-full rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 flex flex-col gap-6 overflow-hidden">
          <CalendarGrid
            selectedDate={selectedDate}
            onSelectDay={setSelectedDate}
            appointmentDates={appointmentDates}
          />
        </div>

        {/* Select date card */}
        <div className="w-full rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 flex flex-col justify-start  shadow-sm">
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-0">
            {selectedDate ? formatSelectedDate(selectedDate, i18n.language) : t("calendar.selectDate")}
          </p>

          {selectedDate === null ? (
            <div className="flex-1 flex flex-col items-center justify-start gap-4 pt-16">
              <CalendarIcon
                size={48}
                strokeWidth={1.5}
                className="text-gray-300 dark:text-[#334155]"
              />
              <p className="text-sm text-gray-500 dark:text-[#94A3B8] text-center">
                {t("calendar.selectDateHint")}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col pt-3 gap-4">
              {appointmentsForSelectedDay.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-[#94A3B8]">
                  {t("calendar.noAppointments")}
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {appointmentsForSelectedDay.map((apt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A]"
                    >
                      <p className="text-base font-semibold text-gray-800 dark:text-white m-0">
                        {apt.clinic}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-[#94A3B8] mt-0.5 m-0">
                        {apt.specialty}
                      </p>
                      <div className="mt-2 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <User
                            size={14}
                            className="text-gray-400 dark:text-[#94A3B8]"
                          />
                          <span className="text-sm text-gray-500 dark:text-[#94A3B8]">
                            {apt.doctor}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock
                            size={14}
                            className="text-gray-400 dark:text-[#94A3B8]"
                          />
                          <span className="text-sm text-gray-500 dark:text-[#94A3B8]">
                            {apt.time}
                          </span>
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

      {/* All Appointments section */}
      <div className="relative w-full">
        <div className="w-full rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 flex flex-col gap-3">
          {/* Section header */}
          <div className="flex items-center justify-between gap-3 pr-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white m-0">
              {t("calendar.allAppointments")}
            </h2>
            <div className="inline-flex items-center rounded-full overflow-hidden border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A]">
              <button
                type="button"
                className="px-3.5 py-2 text-xs font-medium text-gray-500 dark:text-[#94A3B8] bg-gray-100 dark:bg-[#334155] border-none cursor-default leading-none"
              >
                {t("calendar.status.completed")}
              </button>
              <button
                type="button"
                className="px-3.5 py-2 text-xs font-medium text-[#0F766E] dark:text-[#5EEAD4] bg-[#D1F5F1] dark:bg-[#1E4944] border-none cursor-default leading-none"
              >
               {t("calendar.status.upcoming")}
              </button>
            </div>
          </div>

          {/* Appointment rows */}
          <div className="flex flex-col gap-3">
            {localizedAppointments.map((apt, i) => (
              <AppointmentCard
                key={i}
                clinic={apt.clinic}
                doctor={apt.doctor}
                specialty={apt.specialty}
                date={apt.date}
                time={apt.time}
                status={apt.status}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
