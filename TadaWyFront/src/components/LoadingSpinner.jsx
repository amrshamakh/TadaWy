import React from 'react';

/**
 * A standard loading spinner component for the application.
 * 
 * @param {boolean} fullPage - If true, the spinner will cover the entire viewport with a backdrop.
 * @param {string} size - Tailwind CSS size classes (e.g., "h-12 w-12").
 * @param {string} className - Additional CSS classes for the container.
 * @param {string} color - Tailwind CSS border color class (default: "border-teal-500").
 */
const LoadingSpinner = ({ 
  fullPage = false, 
  size = "h-12 w-12", 
  className = "", 
  color = "border-teal-500",
  small = false
}) => {
  const spinner = (
    <div 
      className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}
      aria-label="loading"
    ></div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {spinner}
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (small) {
    return (
      <div className={`inline-block ${className}`}>
        <div className={`animate-spin rounded-full ${size} border-2 border-t-transparent ${color}`}></div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center py-10 w-full ${className}`}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
