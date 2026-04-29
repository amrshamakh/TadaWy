import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

const ChatSidebar = ({ chats, activeChatId, onSelectChat }) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat => {
    const specialty = t(chat.specialtyKey);
    return chat.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           specialty.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Helper to translate mock times
  const translateTime = (timeStr) => {
    if (timeStr === 'Yesterday') return t('messages.yesterday', 'Yesterday');
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      return timeStr.replace('AM', t('common.am', 'AM')).replace('PM', t('common.pm', 'PM'));
    }
    // For days and dates, ideally we use Date objects and intl formatters,
    // but for mock strings we return them as is, or we could add more mapping.
    if (i18n.language === 'ar') {
       if (timeStr === 'Mon') return 'الاثنين';
       if (timeStr === 'Wednesday') return 'الأربعاء';
       if (timeStr === 'Oct 12') return '12 أكتوبر';
    }
    return timeStr;
  };

  return (
    <div className={`w-full md:w-80 lg:w-96 flex flex-col h-full bg-white dark:bg-[#0F172A] border-r dark:border-[#1E293B] border-gray-100`}>
      {/* Header */}
      <div className="p-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('messages.title', 'Messages')}
        </h2>
        
        <div className="relative">
          <div className={`absolute inset-y-0 ${i18n.language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className={`block w-full rounded-lg border-0 py-2.5 ${i18n.language === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'} text-gray-900 bg-gray-50 dark:bg-[#1E293B] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6 transition-all`}
            placeholder={t('messages.searchDoctors', 'Search for doctors...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-start flex items-start p-4 hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors relative
              ${activeChatId === chat.id ? 'bg-white dark:bg-[#1E293B] shadow-[0_4px_12px_rgba(0,0,0,0.05)] z-10' : ''}
            `}
          >
            {/* Active Indicator Line */}
            {activeChatId === chat.id && (
              <div className={`absolute top-0 bottom-0 w-1.5 bg-teal-500 ${i18n.language === 'ar' ? 'right-0 rounded-l-md' : 'left-0 rounded-r-md'}`}></div>
            )}
            
            <div className={`relative ${i18n.language === 'ar' ? 'ml-4' : 'mr-4'} shrink-0`}>
              {chat.isDefaultAvatar ? (
                 <div className="w-12 h-12 rounded-full border-2 border-teal-500 overflow-hidden flex items-end justify-center bg-teal-50 dark:bg-teal-900/20">
                   <img src={chat.avatar} alt={chat.doctorName} className="w-10 h-10 mt-2" style={{ filter: 'invert(52%) sepia(87%) saturate(2469%) hue-rotate(139deg) brightness(97%) contrast(85%)' }} />
                 </div>
              ) : (
                <img 
                  src={chat.avatar} 
                  alt={chat.doctorName} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              
              {/* Online status indicator if needed */}
              {chat.id === 1 && (
                <div className={`absolute bottom-0 ${i18n.language === 'ar' ? 'left-0' : 'right-0'} w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0F172A] rounded-full`}></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {chat.doctorName}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                  {translateTime(chat.time)}
                </span>
              </div>
              <p className="text-xs text-teal-600 dark:text-teal-400 mb-1">
                {t(chat.specialtyKey)}
              </p>
              <div className="flex justify-between items-center">
                <p className={`text-sm truncate pr-2 ${chat.unread > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-bold shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
