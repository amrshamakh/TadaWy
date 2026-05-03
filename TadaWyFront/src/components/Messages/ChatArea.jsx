import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Paperclip, MoreVertical, Phone, Video, FileText, Check, CheckCheck, Loader2, X } from 'lucide-react';
import { assets } from '../../assets/assets';

const ChatArea = ({ activeChat, messages, onSendMessage, currentUserId, loadingMessages, sending }) => {
  const { t, i18n } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if ((inputText.trim() || selectedFile) && !sending) {
      onSendMessage(inputText, selectedFile);
      setInputText('');
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  // Group messages by date
  const groupMessages = () => {
    const groups = {};
    messages.forEach(msg => {
      const dateStr = new Date(msg.createdAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessages();

  const isImage = (url) => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0];
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(cleanUrl);
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return '';
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.split('?')[0];
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0F172A] p-8 text-center">
        <div className="w-24 h-24 bg-teal-50 dark:bg-teal-900/20 rounded-full flex items-center justify-center mb-6">
          <img src={assets.messagesIcon} className="w-12 h-12 opacity-50" style={{ filter: 'invert(52%) sepia(87%) saturate(2469%) hue-rotate(139deg) brightness(97%) contrast(85%)' }} alt="" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('messages.title', 'Messages')}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          {t('messages.selectChat', 'Select a chat to start messaging')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0F172A]">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b dark:border-[#1E293B] border-gray-100 flex items-center justify-between bg-white dark:bg-[#0F172A] z-10">
        <div className="flex items-center">
          <div className={`relative ${i18n.language === 'ar' ? 'ml-4' : 'mr-4'}`}>
             {!activeChat.imageUrl ? (
                 <div className="w-10 h-10 rounded-full border-2 border-teal-500 overflow-hidden flex items-end justify-center bg-teal-50 dark:bg-teal-900/20">
                   <img src={assets.profileIcon} alt={activeChat.fullName} className="w-8 h-8 mt-2" style={{ filter: 'invert(52%) sepia(87%) saturate(2469%) hue-rotate(139deg) brightness(97%) contrast(85%)' }} />
                 </div>
              ) : (
                <img 
                  src={activeChat.imageUrl} 
                  alt={activeChat.fullName} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            <div className={`absolute bottom-0 ${i18n.language === 'ar' ? 'left-0' : 'right-0'} w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#0F172A] rounded-full`}></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
              {activeChat.fullName}
            </h3>
            <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              {activeChat.specializationName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 dark:bg-transparent">
        {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
        ) : Object.entries(groupedMessages).map(([date, group]) => (
          <div key={date} className="space-y-6">
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-white dark:bg-[#1E293B] text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-gray-100 dark:border-[#1E293B] shadow-sm">
                {date}
              </span>
            </div>
            
            {group.map((msg) => {
              const isSentByMe = msg.senderUserId === currentUserId;
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`max-w-[75%] md:max-w-[65%] ${isSentByMe ? 'order-1' : 'order-2'}`}>
                    <div className={`
                      relative p-3 rounded-2xl shadow-sm text-sm
                      ${isSentByMe 
                        ? 'bg-teal-500 text-white rounded-br-none' 
                        : 'bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-[#1E293B]'
                      }
                    `}>
                      {msg.imageUrl && (
                        <div className="mb-2 overflow-hidden rounded-lg">
                          {isImage(msg.imageUrl) ? (
                            <img 
                              src={msg.imageUrl} 
                              alt="attachment" 
                              className="w-full max-h-60 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                              onClick={() => window.open(msg.imageUrl, '_blank')}
                            />
                          ) : (
                            <a 
                              href={msg.imageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                isSentByMe 
                                  ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                                  : 'bg-gray-50 dark:bg-[#0F172A] border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${isSentByMe ? 'bg-white/20' : 'bg-teal-50 dark:bg-teal-900/20'}`}>
                                <FileText className={isSentByMe ? 'text-white' : 'text-teal-600 dark:text-teal-400'} size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium truncate ${isSentByMe ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                  {getFileNameFromUrl(msg.imageUrl)}
                                </p>
                                <p className={`text-[10px] ${isSentByMe ? 'text-teal-50' : 'text-gray-500'}`}>
                                  PDF / Document
                                </p>
                              </div>
                            </a>
                          )}
                        </div>
                      )}
                      
                      <p className="leading-relaxed break-words whitespace-pre-wrap">{msg.content}</p>
                      
                      <div className={`flex items-center justify-end gap-1 mt-1 ${isSentByMe ? 'text-teal-50' : 'text-gray-400 dark:text-gray-500'}`}>
                        <span className="text-[10px]">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isSentByMe && (
                          <div className="shrink-0 mt-[1px]">
                            {msg.isSeen ? (
                              <CheckCheck size={14} className="text-blue-300" strokeWidth={2.5} />
                            ) : msg.isDelivered ? (
                              <CheckCheck size={14} className="text-teal-100" />
                            ) : (
                              <Check size={14} className="text-teal-100" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#0F172A] border-t dark:border-[#1E293B] border-gray-100">
        {selectedFile && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-[#1E293B] rounded-lg flex items-center justify-between border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-md">
                <Paperclip size={16} className="text-teal-600 dark:text-teal-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                    {selectedFile.name}
                </p>
                <p className="text-[10px] text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button 
                onClick={removeFile}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
                <X size={14} className="text-gray-500" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <Paperclip size={22} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
          
          <div className="flex-1 relative">
            <textarea
              rows="1"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t('messages.typeMessage', 'Type your message here...')}
              className="block w-full rounded-2xl border-0 py-3 px-4 bg-gray-50 dark:bg-[#1E293B] text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm transition-all resize-none max-h-32"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={(!inputText.trim() && !selectedFile) || sending}
            className={`p-3 rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all disabled:opacity-50 disabled:hover:bg-teal-500`}
          >
            {sending ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} className={i18n.language === 'ar' ? 'rotate-180' : ''} />}
          </button>
        </div>
        
        <div className="mt-2 flex justify-center">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-[1px] bg-gray-200 dark:bg-gray-800"></span>
            {t('messages.endToEnd', 'END-TO-END ENCRYPTED MEDICAL COMMUNICATION')}
            <span className="w-4 h-[1px] bg-gray-200 dark:bg-gray-800"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
