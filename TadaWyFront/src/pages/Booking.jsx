import { useParams, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getDoctorById } from "../modules/patient/api/doctorDiscoveryApi";
import DoctorCard from "../components/Booking/DoctorCard";
import ReviewsSection from "../components/Booking/ReviewsSection";
import BookingSidebar from "../components/Booking/BookingSidebar";

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

  useEffect(() => { fetchDoctor(true); }, [fetchDoctor]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (error || !doctor) return <Navigate to="/discover" replace />;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-12 mt-3 flex flex-col gap-3">
        <DoctorCard doctor={doctor} />
        <ReviewsSection doctor={doctor} />
        <BookingSidebar doctor={doctor} onBookingSuccess={() => fetchDoctor(false)} />
      </div>
    </div>
  );
}
