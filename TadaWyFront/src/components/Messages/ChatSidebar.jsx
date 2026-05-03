import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { assets } from '../../assets/assets';

// Helper to format ISO date string to relative time
const formatRelativeTime = (isoString, lang) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return lang === 'ar' ? 'الآن' : 'now';
  if (diffMins < 60) return lang === 'ar' ? `${diffMins} د` : `${diffMins}m`;
  if (diffHours < 24) {
    return date.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return lang === 'ar' ? 'أمس' : 'Yesterday';
  if (diffDays < 7) {
    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' });
  }
  return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' });
};

const ChatSidebar = ({ chats, activeChatId, onSelectChat, loading }) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const lang = i18n.language;

  const filteredChats = chats.filter(chat => {
    const name = (chat.fullName || '').toLowerCase();
    const spec = (chat.specializationName || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || spec.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={`w-full md:w-80 lg:w-96 flex flex-col h-full bg-white dark:bg-[#0F172A] border-r dark:border-[#1E293B] border-gray-100`}>
      {/* Header */}
      <div className="p-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('messages.title', 'Messages')}
        </h2>
        
        <div className="relative">
          <div className={`absolute inset-y-0 ${lang === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className={`block w-full rounded-lg border-0 py-2.5 ${lang === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'} text-gray-900 bg-gray-50 dark:bg-[#1E293B] dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6 transition-all`}
            placeholder={t('messages.searchDoctors', 'Search for doctors...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
            <div className="flex flex-col gap-2 p-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        ) : filteredChats.map((chat) => (
          <button
            key={chat.userId}
            onClick={() => onSelectChat(chat.userId)}
            className={`w-full text-start flex items-start p-4 hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors relative
              ${activeChatId === chat.userId ? 'bg-white dark:bg-[#1E293B] shadow-[0_4px_12px_rgba(0,0,0,0.05)] z-10' : ''}
            `}
          >
            {/* Active Indicator Line */}
            {activeChatId === chat.userId && (
              <div className={`absolute top-0 bottom-0 w-1.5 bg-teal-500 ${lang === 'ar' ? 'right-0 rounded-l-md' : 'left-0 rounded-r-md'}`}></div>
            )}
            
            <div className={`relative ${lang === 'ar' ? 'ml-4' : 'mr-4'} shrink-0`}>
              {!chat.imageUrl ? (
                 <div className="w-12 h-12 rounded-full border-2 border-teal-500 overflow-hidden flex items-end justify-center bg-teal-50 dark:bg-teal-900/20">
                   <img src={assets.profileIcon} alt={chat.fullName} className="w-10 h-10 mt-2" style={{ filter: 'invert(52%) sepia(87%) saturate(2469%) hue-rotate(139deg) brightness(97%) contrast(85%)' }} />
                 </div>
              ) : (
                <img 
                  src={chat.imageUrl} 
                  alt={chat.fullName} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {chat.fullName}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                  {formatRelativeTime(chat.lastMessageDate, lang)}
                </span>
              </div>
              <p className="text-xs text-teal-600 dark:text-teal-400 mb-1">
                {chat.specializationName}
              </p>
              <div className="flex justify-between items-center">
                <p className={`text-sm truncate pr-2 ${(chat.unreadCount || 0) > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {chat.lastMessage}
                </p>
                {(chat.unreadCount || 0) > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-bold shrink-0">
                    {chat.unreadCount}
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
