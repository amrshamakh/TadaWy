import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { submitReview } from "../../modules/patient/api/patientAppointmentsApi";

export default function ReviewModal({ doctorId, onClose }) {
  const { t, i18n } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.warning(t("calendar.review.selectRating"));
      return;
    }
    try {
      setIsSubmitting(true);
      await submitReview({
        doctorId,
        rating,
        comment,
      });
      toast.success(t("calendar.review.success"));
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(t("calendar.review.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRTL = i18n.language === "ar";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
      `}</style>
      <div 
        className="w-full max-w-[480px] bg-white dark:bg-[#1E293B] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="p-8">
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-[#334155] mb-4 transition-colors"
          >
            <ArrowLeft className={`w-6 h-6 ${isRTL ? "rotate-180" : ""}`} />
          </button>

          <h2 className="text-[28px] font-semibold text-[#1E293B] dark:text-white mb-8">
            {t("calendar.review.title")}
          </h2>

          <div className="flex justify-center gap-3 mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-all hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= rating
                      ? "fill-[#FFD700] text-[#FFD700]"
                      : "text-[#FFD700] fill-transparent"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          <div className="mb-10">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("calendar.review.placeholder")}
              className="w-full h-36 p-5 rounded-[24px] bg-[#F8FAFC] dark:bg-[#0F172A] border border-gray-100 dark:border-[#334155] text-gray-900 dark:text-white placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#00BBA7] resize-none text-lg transition-all"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-full border border-gray-200 dark:border-[#334155] text-gray-500 dark:text-gray-400 font-semibold text-lg hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors"
            >
              {t("calendar.review.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-4 px-6 rounded-full bg-[#00BBA7] text-white font-semibold text-lg hover:bg-[#009e8f] active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-[#00BBA7]/20"
            >
              {isSubmitting ? "..." : t("calendar.review.done")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
