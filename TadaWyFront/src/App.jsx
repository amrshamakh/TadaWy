import { Route, Routes } from "react-router-dom";
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
import MedicalChecksChat from "./components/checksChat/checksChat";
import DoctorLayout from "./components/doctor/DoctorLayout";
import DoctorProfile from "./components/doctor/DoctorProfile";
import DoctorAppointments from "./components/doctor/appointements/DoctorAppointements";
import DoctorSchedule from "./components/doctor/schedule/DoctorSchedule";

const App = () => {
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
          <Route path="settings" element={<Settings />} />
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
