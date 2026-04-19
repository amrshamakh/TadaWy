
import React from "react";
import { assets } from "../../assets/assets";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const Messages = ({ messages, isLoading, isLoadingHistory, messagesEndRef, onScrollTop, containerRef }) => {
  const { t, i18n } = useTranslation();
  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      onScroll={(e) => {
        if (e.target.scrollTop <= 5 && onScrollTop) {
          onScrollTop();
        }
      }}
    >
      <style>{`
        @keyframes scanLine {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes scanPulse {
          0% { opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { opacity: 0.1; }
        }
        .animate-scan-line {
          animation: scanLine 2.5s linear infinite;
        }
        .animate-scan-pulse {
          animation: scanPulse 2s ease-in-out infinite;
        }
      `}</style>
      {isLoadingHistory && (
        <div className="flex flex-col justify-center items-center gap-3 py-6">
          <div>
            <LoaderCircle className="animate-spin w-10 h-10 sm:w-12 sm:h-12 text-[#00BBA7]" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-normal">
              {i18n.language === "ar" ? "جاري تحميل السجل..." : "Loading history..."}
            </span>
          </div>
        </div>
      )}
      {messages.map((msg, index) =>
        msg.type === "divider" ? (
          <div key={msg.id} className="flex items-center gap-3 py-2">
            <span className="h-px bg-[#CBD5E1] flex-1" />
            <span className="text-sm font-semibold text-[#94A3B8]">
              {msg.date 
                ? new Date(msg.date).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : msg.text}
            </span>
            <span className="h-px bg-[#CBD5E1] flex-1" />
          </div>
        ) : (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} gap-3`}
          >
            {/* bot icon */}
            {msg.type === "bot" && (
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-3xl">
                <img src={assets.brainIcon} alt="Brain Icon" className="w-full" />
              </div>
            )}
            {/* message of user or bot */}
            <div
              className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-4 max-w-[75%] sm:max-w-[80%] ${
                msg.type === "user"
                  ? "rounded-tr-sm bg-white dark:bg-[#1E293B] text-black dark:text-white border border-gray-100 dark:border-[#334155]"
                  : "rounded-tl-sm bg-[#F3F4F6] dark:bg-[#0F172A] text-black dark:text-white"
              } font-inter font-normal text-base sm:text-lg leading-6 tracking-tight`}
            >
              {msg.image && (
                <div className="relative w-full mb-2">
                  <img
                    src={msg.image}
                    alt="Uploaded scan"
                    className="rounded-lg w-full max-h-[250px] sm:max-h-[350px] object-cover block"
                  />
                  {isLoading && msg.type === "user" && index === messages.length - 1 && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#00BBA7] shadow-[0_0_15px_3px_rgba(0,187,167,0.8)] animate-scan-line" />
                      <div className="absolute inset-0 bg-[#00BBA7]/10 animate-scan-pulse" />
                    </div>
                  )}
                </div>
              )}
              {msg.isWelcome && <p>{t("checksChat.welcome")}</p>}
              {msg.text && <p>{msg.text}</p>}
              {(msg.descriptionEn || msg.descriptionAr) && (
                <p>
                  {i18n.language === "ar"
                    ? `${t("checksChat.diagnosis")}: ${msg.descriptionAr || "جاري التحليل أو غير متوفر"}`
                    : `Diagnosis: ${msg.descriptionEn || "Analysis pending or unavailable"}`}
                </p>
              )}
            </div>
            {/* user icon */}
            {msg.type === "user" && (
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 mt-1 bg-[#E5E7EB]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#6B7280">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            )}
          </div>
        )
      )}

      {isLoading && (
        <div className="flex flex-col justify-center items-center gap-3 py-6">
          <div>
            <LoaderCircle className="animate-spin w-10 h-10 sm:w-12 sm:h-12 text-[#00BBA7]" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-normal">{t("checksChat.waitingForResults")}</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;

