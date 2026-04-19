import { useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DoctorCard from "../components/Booking/DoctorCard";
import LocationCard from "../components/Booking/LocationCard";
import ReviewsSection from "../components/Booking/ReviewsSection";
import BookingSidebar from "../components/Booking/BookingSidebar";
import "../components/Booking/Booking.css";
import { getPublicDoctorById } from "../modules/doctor/api/discoverDoctorsApi";

function mergeDoctorForBooking(passed, detail) {
  if (!passed) return null;
  if (!detail) return passed;
  const addrObj = detail.address ?? detail.Address ?? {};
  const city = addrObj.city ?? addrObj.City ?? "";
  const street = addrObj.street ?? addrObj.Street ?? "";
  const addr = [city, street].filter(Boolean).join(", ") || passed.address;
  const reviews = detail.reviews ?? detail.Reviews ?? [];
  return {
    ...passed,
    doctor: detail.name ?? detail.Name ?? passed.doctor,
    specialty: detail.specialization ?? detail.Specialization ?? passed.specialty,
    rating: detail.rating ?? detail.Rating ?? passed.rating,
    phone: detail.phoneNumber ?? detail.PhoneNumber ?? passed.phone,
    address: addr,
    price: detail.price ?? detail.Price ?? passed.price,
    yearsExperience:
      detail.yearsOfExperience ?? detail.YearsOfExperience ?? passed.yearsExperience,
    reviewsCount:
      detail.reviewsCount ?? detail.ReviewsCount ?? passed.reviewsCount,
    location_description:
      detail.addressDescription ??
      detail.AddressDescription ??
      passed.location_description,
    apiReviews: reviews,
  };
}

export default function Booking() {
  const location = useLocation();
  const passed = location.state?.doctor || null;
  const [doctor, setDoctor] = useState(passed);
  const doctorId = passed?.id;

  useEffect(() => {
    if (!doctorId) return;
    let cancelled = false;
    (async () => {
      try {
        const detail = await getPublicDoctorById(doctorId);
        if (!cancelled) setDoctor(mergeDoctorForBooking(passed, detail));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doctorId, passed]);

  if (!passed) {
    return <Navigate to="/discover" replace />;
  }

  return (
    <div className="booking-page-wrapper">
      <div className="booking-page">
        <div className="booking-layout">
          <div className="booking-main-column">
            <DoctorCard doctor={doctor || passed} />
            <LocationCard doctor={doctor || passed} />
            <ReviewsSection doctor={doctor || passed} />
          </div>

          <BookingSidebar doctor={doctor || passed} />
        </div>
      </div>
    </div>
  );
}
