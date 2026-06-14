import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineLanguage } from "react-icons/md";
import { FiUser, FiMenu, FiSun, FiMoon } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/themeContext";
import { getSettings, updateSettings } from "../services/settingService";
import { TokenService } from "../services/tokenService";

import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar({ onToggleSidebar, userDisplayName, userEmail }) {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const isDoctor = location.pathname.startsWith("/doctor");

  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const isLoggedIn = !!user;
  const userRole = user?.role?.toLowerCase();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goTo = (path) => {
    setOpen(false);
    setNotifOpen(false);
    navigate(path);
  };
  const isRtl = i18n.language === "ar";
  const localizedFirstName = isRtl ? (user?.firstNameAr || user?.firstName) : (user?.firstNameEn || user?.firstName);
  const localizedLastName = isRtl ? (user?.lastNameAr || user?.lastName) : (user?.lastNameEn || user?.lastName);
  const displayName = user 
    ? `${localizedFirstName || ""} ${localizedLastName || ""}`.trim() 
    : (userDisplayName || "");
  const displayEmail = user ? user.email : (userEmail || "");
  const profilePath = isDoctor ? "/doctor/profile" : "/profile";
  const roleHomePath = userRole === "admin" ? "/admin" : userRole === "doctor" ? "/doctor" : userRole === "patient" ? "/discover" : "/";

  const handleThemeToggle = async () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    toggleDarkMode();

    const hasToken = TokenService.hasToken() || localStorage.getItem("userToken");
    if (hasToken && userRole !== "admin") {
      try {
        const currentSettings = await getSettings();
        await updateSettings({
          ...currentSettings,
          theme: nextTheme
        });
      } catch (error) {
        console.error("Failed to update theme setting", error);
      }
    } else if (userRole === "admin") {
      localStorage.setItem("adminTheme", nextTheme);
    } else {
      localStorage.setItem("guestTheme", nextTheme);
    }
  };

  const toggleLanguage = async () => {
    const nextLang = i18n.language === "ar" ? "en" : "ar";
    
    // Update UI immediately
    i18n.changeLanguage(nextLang);
    
    if (nextLang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }

    const hasToken = TokenService.hasToken() || localStorage.getItem("userToken");
    if (hasToken && userRole !== "admin") {
      try {
        const currentSettings = await getSettings();
        await updateSettings({
          ...currentSettings,
          language: nextLang
        });
      } catch (error) {
        console.error("Failed to update language setting", error);
      }
    } else if (userRole === "admin") {
      localStorage.setItem("adminLanguage", nextLang);
    } else {
      localStorage.setItem("guestLanguage", nextLang);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Left section with menu toggle and logo */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            {onToggleSidebar && isLoggedIn && (
              <button
                onClick={onToggleSidebar}
                className="flex p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <FiMenu size={24} />
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => goTo(roleHomePath)}>
              <img src={assets.logo} alt="logo" className="w-11 h-11" />
              <span className="text-xl font-semibold dark:text-white">TadaWy</span>
            </div>
          </div>

          {/* Right section - Conditional rendering based on auth status */}
          {isLoggedIn && !isAdmin ? (
            <div className="flex items-center gap-4">
              {/* Notification */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="hidden md:flex p-2 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg relative cursor-pointer"
                >
                  <IoMdNotificationsOutline size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#0F172A]">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
                title={i18n.language === "ar" ? "Switch to English" : "تغيير للغة العربية"}
              >
                <MdOutlineLanguage size={20} className="text-teal-500" />
                <span className="text-xs font-bold uppercase">{i18n.language === "ar" ? "EN" : "AR"}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <FiSun size={20} className="text-yellow-400" /> : <FiMoon size={20} className="text-slate-700" />}
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
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-12 w-64 bg-white dark:bg-[#1e293b] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50`}>
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium dark:text-white">{displayName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{displayEmail}</p>
                    </div>
                    <button
                      onClick={() => goTo(profilePath)}
                      className="flex gap-3 items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#334155] dark:text-white"
                    >
                      <FiUser size={16} />
                      {t("nav.profile")}
                    </button>
                    {userRole === "doctor" && (
                      <button
                        onClick={() => goTo("/doctor")}
                        className="flex gap-3 items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#334155] dark:text-white text-teal-600 dark:text-teal-400 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {t("nav.doctorDashboard")}
                      </button>
                    )}
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
                      onClick={async () => {
                        await logout();
                        goTo("/");
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
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
                title={i18n.language === "ar" ? "Switch to English" : "تغيير للغة العربية"}
              >
                <MdOutlineLanguage size={20} className="text-teal-500" />
                <span className="text-xs font-bold uppercase">{i18n.language === "ar" ? "EN" : "AR"}</span>
              </button>

              {/* Theme Toggle for Guests */}
              <button
                onClick={handleThemeToggle}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <FiSun size={20} className="text-yellow-400" /> : <FiMoon size={20} className="text-slate-700" />}
              </button>
              <button
                onClick={() => goTo("/login")}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                {t("auth.login.signIn")}
              </button>
              <button
                onClick={() => goTo("/signup")}
                className="px-6 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
              >
                {t("auth.signup.signUp")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
                title={i18n.language === "ar" ? "Switch to English" : "تغيير للغة العربية"}
              >
                <MdOutlineLanguage size={20} className="text-teal-500" />
                <span className="text-xs font-bold uppercase">{i18n.language === "ar" ? "EN" : "AR"}</span>
              </button>

              {/* Theme Toggle for Admin */}
              <button
                onClick={handleThemeToggle}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <FiSun size={20} className="text-yellow-400" /> : <FiMoon size={20} className="text-slate-700" />}
              </button>

              {/* Admin Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-black dark:text-white">
                    <FiUser size={20} />
                  </div>
                  <span className="text-sm font-medium dark:text-white">{displayEmail || "Admin"}</span>
                </button>

                {open && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-12 w-64 bg-white dark:bg-[#1e293b] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50`}>
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium dark:text-white">Admin</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{displayEmail}</p>
                    </div>

                     {/* Sign Out */}
                    <button
                      onClick={async () => {
                        await logout();
                        goTo("/");
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
          ))}
        </div>
      </div>
    </nav>
  );
}