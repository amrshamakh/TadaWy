import { useParams, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getDoctorById } from "../modules/patient/api/doctorDiscoveryApi";
import DoctorCard from "../components/Booking/DoctorCard";
import LocationCard from "../components/Booking/LocationCard";
import ReviewsSection from "../components/Booking/ReviewsSection";
import BookingSidebar from "../components/Booking/BookingSidebar";
import "../components/Booking/Booking.css";

export default function Booking() {
  const { id } = useParams();
  const location = useLocation();
  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loading, setLoading] = useState(!doctor || !!id);
  const [error, setError] = useState(null);

  const fetchDoctor = useCallback(async (isInitial = false) => {
    if (!id) return;
    
    if (isInitial) setLoading(true);
    try {
      const data = await getDoctorById(id);
      setDoctor(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch doctor details:", err);
      if (isInitial) setError("Failed to load doctor information.");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDoctor(true);
  }, [fetchDoctor]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !doctor) {
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

          <BookingSidebar doctor={doctor} onBookingSuccess={() => fetchDoctor(false)} />
        </div>
      </div>
    </div>
  );
}

