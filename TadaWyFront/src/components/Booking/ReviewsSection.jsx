import { Star } from "lucide-react";
import "./Booking.css";
import { useTranslation } from "react-i18next";

export default function ReviewsSection({ doctor }) {
  const { t } = useTranslation();
  if (!doctor) return null;

  const reviews = [
    {
      id: 1,
      author: "John Smith",
      date: "February 15, 2020",
      rating: 4.5,
      text: "Excellent care and very professional staff. Dr. Johnson took the time to explain everything clearly.",
    },
    {
      id: 2,
      author: "Mary Davis",
      date: "February 10, 2026",
      rating: 4,
      text: "The best cardiologist I've ever visited. Highly recommend!",
    },
    {
      id: 3,
      author: "Robert Brown",
      date: "February 10, 2026",
      rating: 3.5,
      text: "Very thorough examination. Wait time was a bit long but worth it.",
    },
  ];

  return (
    <section className="booking-card booking-reviews-card">
      <div className="booking-reviews-header">
        <h3 className="booking-section-title">{t("booking.reviewsSection.title")}</h3>
        <span className="booking-reviews-count">{245} {t("common.reviews")}</span>
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

