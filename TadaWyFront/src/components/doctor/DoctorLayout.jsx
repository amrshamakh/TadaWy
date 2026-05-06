import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { assets } from "../../assets/assets";

import { CreditCard } from "lucide-react";

const DoctorLayout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isMessagesPage = location.pathname === '/doctor/messages';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [doctorHeader, setDoctorHeader] = useState(() => {
    try {
      const raw = localStorage.getItem("doctorProfile");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  const doctorMenu = useMemo(
    () => [
      { to: "appointments", icon: assets.homeIcon, label: t("doctorDashboard.appointments.title"), end: false },
      { to: "", icon: assets.calenderIcon, label: t("doctorDashboard.schedule.title"), end: true },
      { to: "messages", icon: assets.messagesIcon, label: t("nav.messages", "Messages"), end: false },
      { to: "payout", icon: CreditCard, label: t("doctorDashboard.payout.sidebarLabel", "Visa & Payout"), end: false },
      { to: "profile", icon: assets.profileIcon, label: t("doctorDashboard.profile.title"), end: false },
      { to: "settings", icon: assets.settingIcon, label: t("nav.settings"), end: false },
    ],
    [t]
  );

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const refresh = () => {
      try {
        const raw = localStorage.getItem("doctorProfile");
        setDoctorHeader(raw ? JSON.parse(raw) : null);
      } catch {
        setDoctorHeader(null);
      }
    };

    window.addEventListener("doctorProfileUpdated", refresh);
    return () => window.removeEventListener("doctorProfileUpdated", refresh);
  }, []);

  const doctorDisplayName = doctorHeader?.displayName || `${i18n.language === "ar" ? "د." : "Dr."} Ahmed Khaled`;
  const doctorEmail = doctorHeader?.email || "ahmedkhaled@gmail.com";

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Navbar
        onToggleSidebar={handleToggleSidebar}
        userDisplayName={doctorDisplayName}
        userEmail={doctorEmail}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          menuItems={doctorMenu}
        />

        <div
          className={`
            flex-1 overflow-hidden transition-all duration-300
            dark:bg-[#0F172A]
            ${isMessagesPage ? '' : 'p-4 sm:p-6 overflow-y-auto'}
            flex flex-col
          `}
        >
          <div className={`w-full flex flex-col flex-1 ${isMessagesPage ? 'h-full overflow-hidden' : ''}`}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;