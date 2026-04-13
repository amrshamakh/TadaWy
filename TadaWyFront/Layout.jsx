import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./src/components/Navbar";
import Sidebar from "./src/components/Sidebar";
import { assets } from "./src/assets/assets";
import { useTranslation } from "react-i18next";

const Layout = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const userMenu = [
    { to: "/discover", icon: assets.homeIcon, label: t("nav.home"), end: true },
    { to: "/calendar", icon: assets.calenderIcon, label: t("nav.calendar"), end: false },
    { to: "/profile", icon: assets.profileIcon, label: t("nav.profile"), end: false },
    { to: "/settings", icon: assets.settingIcon, label: t("nav.settings"), end: false },
  ];

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Navbar onToggleSidebar={handleToggleSidebar} />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          menuItems={userMenu}
        />

        <div
          className={`
    flex-1 overflow-y-auto transition-all duration-300
    dark:bg-[#0F172A]
    ${isLandingPage ? "" : "p-6"} min-h-full
    flex justify-center
  `}
        >
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Layout;
