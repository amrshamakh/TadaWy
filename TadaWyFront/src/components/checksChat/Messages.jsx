
import React from "react";
import { assets } from "../../assets/assets";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const Messages = ({ messages, isLoading, isLoadingHistory, messagesEndRef, onScrollTop }) => {
  const { t } = useTranslation();
  return (
    <div 
      className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      onScroll={(e) => {
        if (e.target.scrollTop === 0 && onScrollTop) {
          onScrollTop();
        }
      }}
    >
      {isLoadingHistory && (
        <div className="flex justify-center py-2">
          <LoaderCircle className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-[#00BBA7]" />
        </div>
      )}
      {messages.map((msg) =>
        msg.type === "divider" ? (
          <div key={msg.id} className="flex items-center gap-3 py-2">
            <span className="h-px bg-[#CBD5E1] flex-1" />
            <span className="text-sm font-semibold text-[#94A3B8]">{msg.text}</span>
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
                <img
                  src={msg.image}
                  alt="Uploaded scan"
                  className="rounded-lg w-full mb-2 max-h-[250px] sm:max-h-[350px] object-cover"
                />
              )}
              {msg.text && <p>{msg.text}</p>}
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

