import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Paperclip, Send, FileText } from 'lucide-react';
import { assets } from '../../assets/assets';

const ChatArea = ({ activeChat, messages, onSendMessage }) => {
  const { t, i18n } = useTranslation();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onSendMessage('', { url, name: file.name, type: file.type });
    }
  };

  if (!activeChat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-white dark:bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] dark:opacity-[0.05] pointer-events-none">
          <img src={assets.logo} alt="TadaWy Logo" className="w-2/3 max-w-md grayscale" />
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = msg.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  const translateDate = (dateStr) => {
    if (i18n.language === 'en') return dateStr;
    // Basic formatting for Arabic if it's "October 25, 2023"
    const map = {
      'January': 'يناير', 'February': 'فبراير', 'March': 'مارس', 'April': 'أبريل',
      'May': 'مايو', 'June': 'يونيو', 'July': 'يوليو', 'August': 'أغسطس',
      'September': 'سبتمبر', 'October': 'أكتوبر', 'November': 'نوفمبر', 'December': 'ديسمبر'
    };
    let translated = dateStr;
    Object.keys(map).forEach(en => {
      if (translated.includes(en)) {
        translated = translated.replace(en, map[en]);
      }
    });
    return translated;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-[#0B1120]">
      {/* Chat Header */}
      <div className="flex items-center px-6 py-4 bg-white dark:bg-[#0F172A] border-b border-gray-100 dark:border-[#1E293B] shadow-sm z-10">
        <div className="mx-4 shrink-0">
          {activeChat.isDefaultAvatar ? (
             <div className="w-12 h-12 rounded-full border-2 border-teal-500 overflow-hidden flex items-end justify-center bg-teal-50 dark:bg-teal-900/20">
               <img src={activeChat.avatar} alt={activeChat.doctorName} className="w-10 h-10 mt-2" style={{ filter: 'invert(52%) sepia(87%) saturate(2469%) hue-rotate(139deg) brightness(97%) contrast(85%)' }} />
             </div>
          ) : (
            <img 
              src={activeChat.avatar} 
              alt={activeChat.doctorName} 
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {activeChat.doctorName}
          </h2>
          <p className="text-sm font-medium text-teal-500 uppercase tracking-wide">
            {t(activeChat.specialtyKey)}
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-[#1E293B]">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="space-y-6">
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1 bg-gray-200/50 dark:bg-[#1E293B] text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-full">
                {translateDate(date)}
              </span>
            </div>

            {groupedMessages[date].map((msg) => {
              const isMe = msg.isSentByMe;
              return (
                <div key={msg.id} className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%]`}>
                    {!isMe && (
                       activeChat.isDefaultAvatar ? (
                         <div className="w-8 h-8 shrink-0 rounded-full border border-teal-500 overflow-hidden flex items-end justify-center bg-teal-50 dark:bg-teal-900/20 mb-1">
                           <img src={activeChat.avatar} className="w-6 h-6 mt-1" style={{ filter: 'invert(52%) sepia(87%) saturate(2469%) hue-rotate(139deg) brightness(97%) contrast(85%)' }} alt="" />
                         </div>
                       ) : (
                         <img 
                           src={activeChat.avatar} 
                           alt={activeChat.doctorName} 
                           className="w-8 h-8 rounded-full object-cover shrink-0 mb-1"
                         />
                       )
                    )}
                    
                    <div className="flex flex-col">
                      <div 
                        className={`
                          rounded-2xl shadow-sm text-sm overflow-hidden
                          ${isMe 
                            ? `bg-teal-500 text-white ${i18n.language === 'ar' ? 'rounded-tl-none' : 'rounded-tr-none'}` 
                            : `bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 ${i18n.language === 'ar' ? 'rounded-tr-none' : 'rounded-tl-none'}`
                          }
                          ${msg.text ? 'px-5 py-3' : 'p-2'}
                        `}
                      >
                        {msg.attachment && msg.attachment.type && msg.attachment.type.startsWith('image/') ? (
                          <img src={msg.attachment.url} alt="Attachment" className={`max-w-full md:max-w-[250px] rounded-lg ${msg.text ? 'mb-2 border border-black/10' : ''}`} />
                        ) : msg.attachment ? (
                          <div className={`flex items-center gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg ${msg.text ? 'mb-2' : ''}`}>
                            <div className={`p-2 rounded-full ${isMe ? 'bg-white/20 text-white' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'}`}>
                              <FileText className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium truncate max-w-[150px]">{msg.attachment.name}</span>
                          </div>
                        ) : null}
                        {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                      </div>

                      {/* Time and Status */}
                      <div className={`flex items-center mt-1 text-[11px] text-gray-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {isMe && msg.status === 'seen' && (
                          <span className={`text-teal-500 ${i18n.language === 'ar' ? 'ml-1' : 'mr-1'}`}>
                            {t('messages.seen', 'Seen')} .
                          </span>
                        )}
                        {isMe && msg.status === 'sent' && (
                          <span className={`text-gray-400 ${i18n.language === 'ar' ? 'ml-1' : 'mr-1'}`}>
                            {t('messages.unseen', 'unSeen')} .
                          </span>
                        )}
                        <span>{msg.time.replace('AM', t('common.am', 'AM')).replace('PM', t('common.pm', 'PM'))}</span>
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
      <div className="p-4 bg-white dark:bg-[#0F172A] border-t border-gray-100 dark:border-[#1E293B]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-gray-50 dark:bg-[#1E293B] rounded-full border border-gray-200 dark:border-gray-700 px-2 py-1">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,.pdf,.doc,.docx"
              />
              <button 
                type="button" 
                onClick={handleAttachmentClick}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('messages.typeMessage', 'Type your message here...')}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 py-2 text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>

            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-teal-500 hover:bg-teal-600 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
            >
              <Send className={`w-5 h-5 ${i18n.language === 'ar' ? 'scale-x-[-1]' : ''} ${i18n.language === 'ar' ? '-mr-0.5' : 'ml-0.5'}`} />
            </button>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {t('messages.endToEnd', 'END-TO-END ENCRYPTED MEDICAL COMMUNICATION')}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
