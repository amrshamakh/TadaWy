import { useState, useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, MessageSquareOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ReviewsSection({ doctor }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || document.documentElement.dir === "rtl";
  const scrollRef = useRef(null);
  const ticking = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  if (!doctor) return null;

  const reviews = Array.isArray(doctor.reviews) ? doctor.reviews : [];
  const reviewsCount = doctor.reviewsCount ?? reviews.length;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const absScrollLeft = Math.abs(scrollLeft);

      if (isRtl) {
        setCanScrollLeft(absScrollLeft < scrollWidth - clientWidth - 5);
        setCanScrollRight(absScrollLeft > 5);
      } else {
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      }
    }
  };

  const handleScroll = () => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        checkScroll();
        ticking.current = false;
      });
      ticking.current = true;
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [reviews, isRtl]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 dark:text-gray-500 text-[0.85rem] font-bold uppercase tracking-widest m-0">
          {t("booking.reviewsSection.title")} ({reviewsCount})
        </p>
        {reviews.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 border border-gray-200 dark:border-slate-600 flex items-center justify-center disabled:opacity-20 transition-all shadow-sm active:scale-90"
              aria-label={t("booking.reviewsSection.scrollLeft") || "Scroll left"}
            >
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 border border-gray-200 dark:border-slate-600 flex items-center justify-center disabled:opacity-20 transition-all shadow-sm active:scale-90"
              aria-label={t("booking.reviewsSection.scrollRight") || "Scroll right"}
            >
              <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Container */}
      {reviews.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 gap-4 text-center">
          <MessageSquareOff size={44} className="text-gray-300 dark:text-slate-600" />
          <p className="text-gray-500 dark:text-gray-400 text-base font-medium m-0">
            {t("booking.reviewsSection.noReviews")}
          </p>
        </div>
      ) : (
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto reviews-scrollbar snap-x snap-mandatory pb-3 scroll-smooth"
        >
          {reviews.map((review, idx) => (
            <div 
              key={review.id || idx} 
              className="min-w-[100%] sm:min-w-[450px] snap-center flex-shrink-0"
            >
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-600 h-full flex flex-col justify-center transition-all hover:border-teal-200 dark:hover:border-teal-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-900 dark:text-white text-lg font-black m-0">
                      {review.patientName || review.author || review.userName || "User"}
                    </p>
                    {review.date && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 m-0">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div 
                    className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-3 py-1.5 rounded-full text-sm font-black border border-teal-100 dark:border-teal-800 shadow-sm"
                    aria-label={t("booking.reviewsSection.ratingAria", { rating: review.rating || review.rate }) || `Rating: ${review.rating || review.rate} stars`}
                  >
                    <Star size={14} fill="currentColor" aria-hidden="true" />
                    <span>{review.rating || review.rate}</span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-[1.1rem] font-medium leading-relaxed m-0 italic line-clamp-4">
                  "{review.text || review.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
