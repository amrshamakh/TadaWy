import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

// Pagination Component
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
const isRTL = i18n.dir() === "rtl";

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = Math.max(4, totalPages);

    for (let i = 1; i <= maxVisible; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center py-5 gap-2 mt-8">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span className="hidden sm:inline"> {t("discover.clinicsData.Pagination.previous")}</span>
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => {
          const isDisabled = page > totalPages;
          const isActive = currentPage === page;

          return (
            <button
              key={page}
              disabled={isDisabled}
              onClick={() => !isDisabled && onPageChange(page)}
              className={`min-w-[40px] h-10 px-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-teal-500 text-white border border-teal-500"
                  : isDisabled
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-teal-500"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
          currentPage >= totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <span className="hidden sm:inline"> {t("discover.clinicsData.Pagination.next")}</span>
        {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
};
