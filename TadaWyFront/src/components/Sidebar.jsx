import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import AuthRequiredModal from "./AuthRequiredModal";

const Item = ({ to, icon, label, end, currentPath, onClick }) => {
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
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#334155]"
        }`
      }
    >
      <img src={icon} alt={label} className="w-5 h-5 shrink-0" />
      <span>{label}</span>
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

      <div
        className={`
          bg-white dark:bg-[#0F172A] 
            
        ${i18n.language === "ar"
            ? "border-l border-[#E2E8F0] dark:border-[#1E293B]"
            : "border-r border-[#E2E8F0] dark:border-[#1E293B]"
          }
          
          transition-all duration-300 ease-in-out
          overflow-y-auto overflow-x-hidden
          fixed top-16 bottom-0 left-0 z-30
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          lg:static lg:translate-x-0
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
