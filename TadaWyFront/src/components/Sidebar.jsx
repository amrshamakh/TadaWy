import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import AuthRequiredModal from "./AuthRequiredModal";

const Item = ({ to, icon: Icon, label, end, currentPath, onClick }) => {
  // If this item is 'Home' (/discover) and we are on '/booking', keep it active
  const isBookingAndHome = to === "/discover" && currentPath?.startsWith("/booking");

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        ${isActive || isBookingAndHome
          ? "bg-teal-500 text-white"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (typeof Icon === 'string' ? (
            <img src={Icon} alt={label} className="w-5 h-5 shrink-0" />
          ) : (
            <Icon 
              className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#64748B] dark:text-slate-400'}`} 
              strokeWidth={1.66667}
            />
          ))}
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default function Sidebar({ isOpen, onClose, menuItems }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const guestBlockedPaths = new Set(["/profile", "/settings"]);
  const handleBlockedClick = (event, to) => {
    if (user || !guestBlockedPaths.has(to)) return;
    event.preventDefault();
    setShowAuthModal(true);
  };

  return (
    <>
      {showAuthModal && (
        <AuthRequiredModal
          onLogin={() => {
            setShowAuthModal(false);
            navigate("/login");
          }}
          onCancel={() => setShowAuthModal(false)}
        />
      )}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* Spacer for desktop to keep layout from shifting since the sidebar will be fixed */}
      <div className={`hidden lg:block transition-all duration-300 ease-in-out shrink-0 ${isOpen ? "w-64" : "w-0"}`} />

      <div
        className={`
          bg-white dark:bg-[#0F172A] 
            
        ${i18n.language === "ar"
            ? "border-l border-[#E2E8F0] dark:border-[#1E293B]"
            : "border-r border-[#E2E8F0] dark:border-[#1E293B]"
          }
          
          transition-all duration-300 ease-in-out
          overflow-y-auto overflow-x-hidden
          fixed top-16 bottom-0 z-30
          ${i18n.language === "ar" ? "right-0" : "left-0"}
          ${isOpen ? "translate-x-0 w-64" : (i18n.language === "ar" ? "translate-x-full w-64" : "-translate-x-full w-64")}
          lg:translate-x-0
          ${isOpen ? "lg:w-64" : "lg:w-0"}
        `}
      >
        <div className="w-64 p-4 space-y-2">
          {menuItems.map((item) => (
            <Item
              key={item.to}
              to={item.to}
              end={item.end}
              icon={item.icon}
              label={item.label}
              currentPath={window.location.pathname}
              onClick={(event) => handleBlockedClick(event, item.to)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
