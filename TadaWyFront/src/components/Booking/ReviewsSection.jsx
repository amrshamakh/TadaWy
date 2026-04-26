import { Star } from "lucide-react";
import "./Booking.css";
import { useTranslation } from "react-i18next";

export default function ReviewsSection({ doctor }) {
  const { t } = useTranslation();
  if (!doctor) return null;

  const reviews = Array.isArray(doctor.reviews) ? doctor.reviews : [];
  const reviewsCount = doctor.reviewsCount ?? reviews.length;

  return (
    <section className="booking-card booking-reviews-card">
      <div className="booking-reviews-header">
        <h3 className="booking-section-title">{t("booking.reviewsSection.title")}</h3>
        <span className="booking-reviews-count">{reviewsCount} {t("common.reviews")}</span>
      </div>

      <div className="booking-reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={review.id || idx} className="booking-review-item">
              <div className="booking-review-item-header">
                <div>
                  <p className="booking-review-author">{review.author || review.userName || "User"}</p>
                  <p className="booking-review-date">
                    {review.date ? new Date(review.date).toLocaleDateString() : ""}
                  </p>
                </div>
                <div className="booking-review-badge">
                  <Star size={14} fill="#FACC15" color="#FACC15" />
                  <span>{review.rating || review.rate}</span>
                </div>
              </div>
              <p className="booking-review-text">{review.text || review.comment}</p>
            </div>
          ))
        ) : (
          <div className="booking-no-reviews">
            <p className="text-gray-500 py-4 text-center">{t("booking.reviewsSection.noReviews")}</p>
          </div>
        )}
      </div>
    </section>
  );
}

