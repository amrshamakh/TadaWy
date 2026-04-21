import { useState, useRef, useEffect } from "react";
import { X, Info, Upload, LoaderCircle } from "lucide-react";
import { assets } from "../../assets/assets";
import Header from "./Header";
import Messages from "./Messages";
import { predictAlzheimer, getAlzheimerHistory } from "./api";
import { useTranslation } from "react-i18next";

export default function MedicalChecksChat() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [cursorDate, setCursorDate] = useState(null);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const containerRef = useRef(null);

  const buildSessionDivider = (dateParam, uniqueId) => {
    const d = dateParam ? new Date(dateParam) : new Date();
    return {
      id: uniqueId ? uniqueId + "_div" : d.getTime() + "_div_" + Math.random(),
      type: "divider",
      date: d.toISOString(),
    };
  };

  const loadHistory = async (currentCursor) => {
    try {
      setIsLoadingHistory(true);
      const prevScrollHeight = containerRef.current?.scrollHeight;
      const data = await getAlzheimerHistory(currentCursor, 10);
      const newMessages = [];

      const sortedItems = [...data.items].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      sortedItems.forEach((item) => {
        newMessages.push({
          id: item.createdAt + "_img",
          type: "user",
          image: item.imageUrl,
        });

        const enDesc = item.descriptionEn;
        const arDesc = item.descriptionAr;

        newMessages.push({
          id: item.createdAt + "_bot",
          type: "bot",
          descriptionEn: enDesc,
          descriptionAr: arDesc,
        });

        newMessages.push(buildSessionDivider(item.createdAt, item.createdAt));
      });

      if (!currentCursor) {
        newMessages.push({
          id: "welcome_message",
          type: "bot",
          isWelcome: true, // Used to translate dynamically
        });
      }

      setMessages((prev) => {
        // Find if we already added these (prevent duplicates on strict mode)
        const existingIds = new Set(prev.map(m => m.id));
        const filteredNew = newMessages.filter(m => !existingIds.has(m.id));
        return [...filteredNew, ...prev];
      });
      setHasMoreHistory(data.hasMore);

      if (data.items && data.items.length > 0) {
        setCursorDate(data.items[0].createdAt);
      }

      // Restore scroll position after prepending items
      setTimeout(() => {
        if (!currentCursor) {
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        } else if (containerRef.current && prevScrollHeight) {
          const newScrollHeight = containerRef.current.scrollHeight;
          const diff = newScrollHeight - prevScrollHeight;
          if (diff > 0) {
            containerRef.current.scrollTop += diff;
          }
        }
      }, 50);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadHistory(null);
    }
  }, [isOpen]);

  const handleScrollTop = () => {
    if (hasMoreHistory && !isLoadingHistory && cursorDate) {
      loadHistory(cursorDate);
    }
  };

  // Auto-scroll down when chat opens initially or un-hides
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "auto" }), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Scroll smoothly when user adds new scans or loading finishes
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);


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
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, type: "bot", descriptionEn: data.descriptionEn, descriptionAr: data.descriptionAr },
          buildSessionDivider(),
        ]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
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
        <div className="mb-4 w-[340px] sm:w-[400px] md:w-[450px] lg:w-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-[#1E293B] dark:border-[#334155] h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] max-h-[800px]">
          {/* Header */}
          <Header setIsOpen={setIsOpen} />

          {/* Messages */}
          <Messages
            messages={messages}
            isLoading={isLoading}
            isLoadingHistory={isLoadingHistory}
            messagesEndRef={messagesEndRef}
            onScrollTop={handleScrollTop}
            containerRef={containerRef}
          />
          {/* Footer */}
          {showUpload && (
            <div className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4 border-t border-gray-100 dark:border-[#334155]">
              <div className="flex items-start gap-2 mb-4 text-[#64748B] dark:text-[#94A3B8]">
                <Info className="text-xl -mt-0.5 sm:mt-0 sm:text-2xl" />
                <span className="font-normal text-sm sm:text-base leading-5">
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
                className="bg-[#00BBA7] text-white text-base sm:text-lg w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              >
                <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                {t("checksChat.uploadButton")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-linear-to-b from-[#00BBA7] to-[#1D857A] cursor-pointer"
        aria-label={isOpen ? t("checksChat.closeAria") : t("checksChat.openAria")}
      >
        {isOpen ? (
          <X className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        ) : (
          <img src={assets.brainIcon} className="w-10 h-10 sm:w-12 sm:h-12" alt="Brain Icon" />
        )}
      </button>
    </div>
  );
}
