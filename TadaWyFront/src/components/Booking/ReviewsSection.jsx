import { Star } from "lucide-react";
import "./Booking.css";
import { useTranslation } from "react-i18next";

export default function ReviewsSection({ doctor }) {
  const { t } = useTranslation();
  if (!doctor) return null;

  const apiList = doctor.apiReviews;
  const reviewsFromApi =
    Array.isArray(apiList) && apiList.length > 0
      ? apiList.map((r, idx) => ({
          id: `api-${idx}`,
          author: t("doctorDashboard.profile.anonymousPatient", "Patient"),
          date: "",
          text: r.comment ?? r.Comment ?? "",
          rating: Number(r.rating ?? r.Rating ?? 0),
        }))
      : null;

  const localizedReviews = t("booking.reviewsSection.reviews", { returnObjects: true });
  const defaultRatings = [4.5, 4, 3.5];
  const reviewsFallback = Array.isArray(localizedReviews)
    ? localizedReviews.map((review, idx) => ({
        id: idx + 1,
        rating: defaultRatings[idx] ?? 4,
        ...review,
      }))
    : [];

  const reviews = reviewsFromApi ?? reviewsFallback;
  const reviewCount =
    (Array.isArray(apiList) && apiList.length) ||
    (doctor.reviewsCount ?? 0) ||
    reviews.length;

  return (
    <section className="booking-card booking-reviews-card">
      <div className="booking-reviews-header">
        <h3 className="booking-section-title">{t("booking.reviewsSection.title")}</h3>
        <span className="booking-reviews-count">
          {reviewCount} {t("common.reviews")}
        </span>
      </div>

      <div className="booking-reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="booking-review-item">
            <div className="booking-review-item-header">
              <div>
                <p className="booking-review-author">{review.author}</p>
                <p className="booking-review-date">{review.date}</p>
              </div>
              <div className="booking-review-badge">
                <Star size={14} fill="#FACC15" color="#FACC15" />
                <span>{review.rating}</span>
              </div>
            </div>
            <p className="booking-review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

