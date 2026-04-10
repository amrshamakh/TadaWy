import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { assets } from "../../assets/assets";

const DoctorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
      { to: "", icon: assets.profileIcon, label: "Profile", end: true },
      { to: "appointments", icon: assets.homeIcon, label: "Appointments", end: false },
      { to: "schedule", icon: assets.calenderIcon, label: "My Schedule", end: false },
    ],
    []
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

  const doctorDisplayName = doctorHeader?.displayName || "Dr. Ahmed Khaled";
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
          className="
            flex-1 overflow-y-auto transition-all duration-300
            dark:bg-[#0F172A]
            p-4 sm:p-6
            flex flex-col
          "
        >
          <div className="w-full flex flex-col flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;