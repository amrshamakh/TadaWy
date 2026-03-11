import { useState, useRef, useEffect } from "react";
import { X, Info, Upload, LoaderCircle } from "lucide-react";
import { assets } from "../../assets/assets";
import Header from "./Header";
import Messages from "./Messages";
import { predictAlzheimer } from "./api";

export default function MedicalChecksChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! I'm your TadaWy Medical Check. Upload medical scan images for brain (X-rays, MRI, CT scans, etc.) and I'll provide a detailed result.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
        const resultText = `Diagnosis: ${data.description}`;

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, type: "bot", text: resultText },
        ]);
        setShowUpload(true);
      } catch (err) {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "bot",
            text: "Sorry, I was unable to analyze the image. Please try again.",
          },
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
                  Upload medical scans for AI-assisted analysis. Not a
                  replacement for professional diagnosis.
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
                Upload Scan Image
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-linear-to-b from-[#00BBA7] to-[#1D857A] cursor-pointer"
        aria-label={isOpen ? "Close Medical Chat" : "Open Medical Chat"}
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
