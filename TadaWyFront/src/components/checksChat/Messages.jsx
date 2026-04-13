
import React from "react";
import { assets } from "../../assets/assets";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const Messages = ({ messages, isLoading, messagesEndRef }) => {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-50 max-h-80">
      {messages.map((msg) => (
        msg.type === "divider" ? (
          <div key={msg.id} className="flex items-center gap-2 py-1">
            <span className="h-px bg-[#CBD5E1] flex-1" />
            <span className="text-xs font-semibold text-[#94A3B8]">{msg.text}</span>
            <span className="h-px bg-[#CBD5E1] flex-1" />
          </div>
        ) : (
        <div
          key={msg.id}
          className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} gap-2`}
        >
          {/* bot icon */}
          {msg.type === "bot" && (
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0  mt-1 shadow-3xl">
              <img src={assets.brainIcon} alt="Brain Icon" className="w-full" />
            </div>
          )}
          {/* message of user or bot */}
          <div
            className={`rounded-2xl px-3 py-2 max-w-56 ${
              msg.type === "user"
                ? "rounded-tr-sm bg-white dark:bg-[#1E293B] text-white"
                : "rounded-tl-sm bg-[#F3F4F6]   dark:bg-[#0F172A] text- dark:text-white"
            } font-inter font-normal text-sm  leading-5 tracking-tight`}
          >
            {msg.image && (
              <img
                src={msg.image}
                alt="Uploaded scan"
                className="rounded-lg w-full mb-1 max-h-35 object-cover"
              />
            )}
            {msg.text && <p>{msg.text}</p>}
          </div>
          {/* user icon */}
          {msg.type === "user" && (
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 bg-[#E5E7EB]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B7280">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          )}
        </div>
        )
      ))}

      {isLoading && (
        <div className="flex flex-col justify-center items-center gap-2">
          <div>
             <LoaderCircle className="animate-spin w-7 h-7 text-[#00BBA7] " />
          </div>
           <div>
             <span className="text-lg font-normal">{t("checksChat.waitingForResults")}</span>
           </div>
         
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;

