import { useState, useRef, useEffect } from "react";
import { X, Info, Upload, LoaderCircle } from "lucide-react";
import { assets } from "../../assets/assets";
import Header from "./Header";
import Messages from "./Messages";
import { predictAlzheimer } from "./api";
import { useTranslation } from "react-i18next";

export default function MedicalChecksChat() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: t("checksChat.welcome"),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const buildSessionDivider = () => {
    const now = new Date();
    return {
      id: Date.now() + 2,
      type: "divider",
      text: now.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  };

  const translateToArabic = async (text) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`
      );
      const data = await response.json();
      return data?.responseData?.translatedText || text;
    } catch {
      return text;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Data = ev.target.result.split(",")[1];
      const imageUrl = ev.target.result;

      setShowUpload(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: "user", image: imageUrl },
      ]);
      setIsLoading(true);

      try {
        const data = await predictAlzheimer(file);
        console.log("API Response:", data);
        const localizedDescription =
          i18n.language === "ar"
            ? await translateToArabic(data.description)
            : data.description;
        const resultText =
          i18n.language === "ar"
            ? `${t("checksChat.diagnosis")}: ${localizedDescription}`
            : `Diagnosis: ${localizedDescription}`;

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, type: "bot", text: resultText },
          buildSessionDivider(),
        ]);
        setShowUpload(true);
      } catch (err) {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "bot",
            text: t("checksChat.analyzeError"),
          },
          buildSessionDivider(),
        ]);
        setShowUpload(true);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="fixed bottom-20 right-6 flex flex-col items-end z-50">
      {/* Chat Popup */}
      {isOpen && (
        <div className="mb-4 w-80 rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-[#1E293B] dark:border-[#334155] max-h-130">
          {/* Header */}
          <Header setIsOpen={setIsOpen} />

          {/* Messages */}
          <Messages
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
          {/* Footer */}
          {showUpload && (
            <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-[#334155]">
              <div className="flex items-start gap-1.5 mb-3 text-[#64748B] dark:text-[#94A3B8] ">
                <Info className="text-xl  -mt-0.75" />
                <span className="font-normal text-[12px] leading-4">
                  {t("checksChat.uploadHint")}
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className=" bg-[#00BBA7] text-white  text-sm w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              >
                <Upload className="text-xs w-4 h-4" />
                {t("checksChat.uploadButton")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-linear-to-b from-[#00BBA7] to-[#1D857A] cursor-pointer"
        aria-label={isOpen ? t("checksChat.closeAria") : t("checksChat.openAria")}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <img src={assets.brainIcon} className="" alt="Brain Icon" />
        )}
      </button>
    </div>
  );
}
