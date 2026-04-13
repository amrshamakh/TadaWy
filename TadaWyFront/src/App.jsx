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
import OnlinePayment from "./components/Booking/payments/OnlinePayment";
import DoctorApplication from "./pages/DoctorApplication";
import DiscoverPage from "./pages/DiscoverPage";
import Booking from "./pages/Booking";
import AdminLayout from "./admin/AdminLayout";
import AdminDoctors from "./admin/AdminDoctors";
import BannedDoctors from "./admin/BannedDoctors";
import MedicalChecksChat from "./components/checksChat/checksChat";
import DoctorLayout from "./components/doctor/DoctorLayout";
import DoctorProfile from "./components/doctor/DoctorProfile";
import DoctorAppointments from "./components/doctor/appointments/DoctorAppointments";
import DoctorSchedule from "./components/doctor/schedule/DoctorSchedule";

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || 'en';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);

  return (
    <div className="max-h-[70vh]">
      <Routes>
        <Route path="/doctorApplication" element={<DoctorApplication />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/online-payment" element={<OnlinePayment />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="discover" element={<DiscoverPage />} />

          <Route path="calendar" element={<Calender />} />
          <Route path="booking" element={<Booking />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDoctors />} />

          {/* <Route path="doctors" element={<AdminDoctors />} /> */}
          {/* Add more admin pages here: */}
          <Route path="settings" element={<Settings />} />
          <Route path="banned" element={<BannedDoctors />} />
        </Route>
        {/* Doctor routes */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<DoctorProfile />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="schedule" element={<DoctorSchedule />} />
        </Route>
      </Routes>
      <MedicalChecksChat />
    </div>
  );
};

export default App;
