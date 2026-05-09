import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Landing/Footer";
import { assets } from "../assets/assets";
import { DoctorsProvider } from "../context/doctorContext"; // adjust path as needed
import { useTranslation } from "react-i18next";




const AdminLayout = () => {
  const location = useLocation();
  const havingFooter = location.pathname === "/admin";
  const isLandingPageUser = location.pathname === "/";

  return (
    <DoctorsProvider>
      <div className="flex flex-col min-h-screen pt-16">
        <Navbar />

        <div className="flex flex-1 overflow-hidden relative">

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