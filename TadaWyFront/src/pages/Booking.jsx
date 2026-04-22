import { useLocation, Navigate } from "react-router-dom";
import DoctorCard from "../components/Booking/DoctorCard";
import LocationCard from "../components/Booking/LocationCard";
import ReviewsSection from "../components/Booking/ReviewsSection";
import BookingSidebar from "../components/Booking/BookingSidebar";
import "../components/Booking/Booking.css";

export default function Booking() {
  const location = useLocation();
  const doctor = location.state?.doctor || null;

  if (!doctor) {
    // If no doctor data was passed, redirect to discover page
    return <Navigate to="/discover" replace />;
  }

  return (
    <div className="booking-page-wrapper">
      <div className="booking-page">
        <div className="booking-layout">
          <div className="booking-main-column">
            <DoctorCard doctor={doctor} />
            <LocationCard doctor={doctor} />
            <ReviewsSection doctor={doctor} />
          </div>

          <div className="booking-sidebar-wrapper">
            <BookingSidebar doctor={doctor} />
          </div>
        </div>
      </div>
    </div>
  );
}

