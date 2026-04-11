import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiUser, FiMenu } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onToggleSidebar }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");

  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };
  const displayName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "User";
  const displayEmail = user ? user.email : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Left section with menu toggle and logo */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="flex p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <FiMenu size={24} />
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => goTo("/")}>
              <img src={assets.logo} alt="logo" className="w-8 h-8" />
              <span className="text-xl font-semibold dark:text-white">TadaWY</span>
            </div>
          </div>

          {/* Right section - Conditional rendering based on auth status */}
          {isLoggedIn && !isAdmin ? (
            <div className="flex items-center gap-4">
              {/* Notification */}
              <button className="hidden md:flex p-2 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg relative">
                <IoMdNotificationsOutline size={24} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>



              {/* Profile */}
              <div className="hidden md:flex relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg"
                >
                  <div className="w-8 h-8  rounded-full flex items-center justify-center text-black dark:text-white">
                    <FiUser size={20} />
                  </div>
                  <span className="text-sm font-medium dark:text-white">{displayName}</span>

                </button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 top-12 w-64 bg-white dark:bg-[#1e293b] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium dark:text-white">{displayName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{displayEmail}</p>
                    </div>
                    <button
                      onClick={() => goTo("/profile")}
                      className="flex gap-3 items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#334155] dark:text-white"
                    >
                      <FiUser size={16} />
                      {t("nav.profile")}
                    </button>
                    <button
                      onClick={() => goTo("/settings")}
                      className="flex gap-3 items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#334155] dark:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t("nav.settings")}
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        goTo("/login");
                      }}
                      className="flex gap-3 items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t("nav.signOut")}
                    </button>
                  </div>
                )}
              </div>


            </div>
          ) : (!isAdmin && !isLoggedIn ? (
            // Not logged in - Show Sign In and Sign Up buttons
            <div className="flex items-center gap-3">
              <button
                onClick={() => goTo("/login")}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => goTo("/signup")}
                className="px-6 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>
          ) : (<span className="text-lg font-medium dark:text-white">ADMIN</span>))}
        </div>
      </div>
    </nav>
  );
}