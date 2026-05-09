import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Calender from "./pages/Calender";
import LandingPage from "./pages/LandingPage";
import Layout from "../Layout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Signout from "./pages/Login";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OnlinePayment from "./components/Booking/payments/OnlinePayment";
import DoctorApplication from "./pages/DoctorApplication";
import DiscoverPage from "./pages/DiscoverPage";
import ApplicationPending from "./pages/ApplicationPending";
import Booking from "./pages/Booking";
import AdminLayout from "./admin/AdminLayout";
import AdminDoctors from "./admin/AdminDoctors";
import AdminSettings from "./admin/AdminSettings";
import DoctorLayout from "./components/doctor/DoctorLayout";
import DoctorProfile from "./components/doctor/DoctorProfile";
import DoctorAppointments from "./components/doctor/appointments/DoctorAppointments";
import DoctorSchedule from "./components/doctor/schedule/DoctorSchedule";

import DoctorPayout from "./components/doctor/payout/DoctorPayout";

import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Messages from "./components/Messages/Messages";

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || 'en';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);

  return (
    <div>
      <Routes>
        <Route path="/doctorApplication" element={<DoctorApplication />} />
        <Route path="/application-pending" element={<ApplicationPending />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/online-payment" element={<OnlinePayment />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="calendar" element={<ProtectedRoute renderBlockedContent><Calender /></ProtectedRoute>} />
          <Route path="booking/:id?" element={<Booking />} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDoctors />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        {/* Doctor routes */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<DoctorSchedule />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="payout" element={<DoctorPayout />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        rtl={i18n.language === 'ar'} 
        theme="colored"
      />
      <style>
        {`
          [dir="rtl"] .Toastify__toast-body {
            flex-direction: row-reverse !important;
          }
          [dir="rtl"] .Toastify__toast-icon {
            margin-left: 12px;
            margin-right: 0;
          }
        `}
      </style>
    </div>
  );
};

export default App;
