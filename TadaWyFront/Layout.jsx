import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Navbar from "./src/components/Navbar";
import Sidebar from "./src/components/Sidebar";
import { assets } from "./src/assets/assets";
import { useTranslation } from "react-i18next";
import { useAuth } from "./src/context/AuthContext";
import MedicalChecksChat from "./src/components/checksChat/checksChat";

const Layout = () => {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const userRole = role?.toLowerCase();

  // Redirect doctors and admins away from patient routes
  if (user && userRole === "doctor") {
    return <Navigate to="/doctor/appointments" replace />;
  }
  if (user && userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }
  const isLandingPage = location.pathname === "/";
  const isDiscoverPage = location.pathname === "/discover";
  const isMessagesPage = location.pathname === "/messages";
  const isBookingPage = location.pathname.startsWith("/booking");
  const noPadding = isLandingPage || isDiscoverPage || isMessagesPage || isBookingPage;
  const userMenu = [
    { to: "/discover", icon: assets.homeIcon, label: t("nav.home"), end: true },
    { to: "/calendar", icon: assets.calenderIcon, label: t("nav.calendar"), end: false },
    { to: "/profile", icon: assets.profileIcon, label: t("nav.profile"), end: false },
    { to: "/messages", icon: assets.messagesIcon, label: t("nav.messages"), end: false },
    { to: "/settings", icon: assets.settingIcon, label: t("nav.settings"), end: false },
  ];

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Navbar onToggleSidebar={handleToggleSidebar} />

      <div className="flex flex-1 overflow-hidden relative">
        {user && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            menuItems={userMenu}
          />
        )}

        <div
          className={`
    flex-1 overflow-y-auto transition-all duration-300
    dark:bg-[#0F172A]
    ${noPadding ? "" : "p-6"} min-h-full
    flex justify-center
  `}
        >
          <div className={`w-full ${noPadding ? "" : "max-w-7xl"}`}>
            <Outlet context={{ isSidebarOpen }} />
          </div>
        </div>
      </div>
      <MedicalChecksChat />
    </div>
  );
};
export default Layout;
