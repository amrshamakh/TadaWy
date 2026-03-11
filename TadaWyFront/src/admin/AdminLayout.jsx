import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Landing/Footer";
import { assets } from "../assets/assets";
import { DoctorsProvider } from "../context/doctorContext"; // adjust path as needed
import { useTranslation } from "react-i18next";




const AdminLayout = () => {
  const { t } = useTranslation();
  const adminMenu = [
  { to: "", icon: assets.homeIcon, label: t("admin.adminLayout.doctors"), end: true },
  { to: "settings", icon: assets.settingIcon,label: t("admin.adminLayout.settings"), end: false },
  { to: "banned", icon: assets.settingIcon, label: t("admin.adminLayout.bannedDoctors"), end: false },
];
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const havingFooter = location.pathname === "/admin"|| location.pathname === "/admin/banned";
  const isLandingPageUser = location.pathname === "/";

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <DoctorsProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar onToggleSidebar={handleToggleSidebar} />

        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            menuItems={adminMenu}
          />

          <div
            className={`
              flex-1 overflow-y-auto transition-all duration-300
              dark:bg-[#0F172A]
              ${isLandingPageUser ? "" : "p-6"}
              flex flex-col 
            `}
          >
            <div className="w-full flex flex-col flex-1">
              <Outlet />
              
            </div>
          </div>
        </div>

        {havingFooter && <Footer />}
      </div>
    </DoctorsProvider>
  );
};

export default AdminLayout;