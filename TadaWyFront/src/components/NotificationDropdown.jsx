import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle2, Bell, XCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationItem = ({ id, type, title, message, createdAt, isRead, appointmentId, onRead }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const icons = {
    1: { // AppointmentBooked
      icon: <CheckCircle2 size={20} />,
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
    },
    2: { // AppointmentReminder
      icon: <Calendar size={20} />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    3: { // AppointmentCancelled
      icon: <XCircle size={20} />,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-500 dark:text-red-400',
    },
    4: { // Reminder 12h
      icon: <Calendar size={20} />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    5: { // Reminder 2h
      icon: <Calendar size={20} />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500 dark:text-blue-400',
    }
  };

  const { icon, bgColor, iconColor } = icons[type] || {
    icon: <Bell size={20} />,
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    iconColor: 'text-gray-500 dark:text-gray-400',
  };

  const time = new Date(createdAt).toLocaleTimeString(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div 
      onClick={() => !isRead && onRead(id)}
      className={`p-4 rounded-2xl border ${isRead ? 'border-gray-100 dark:border-gray-800' : 'border-teal-100 dark:border-teal-900/30'} bg-white dark:bg-[#1E293B] shadow-sm mb-3 last:mb-0 transition-all hover:shadow-md cursor-pointer`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${bgColor} ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className={`text-sm ${isRead ? 'font-medium' : 'font-bold'} text-gray-900 dark:text-white truncate`}>
              {title}
            </h4>
          </div>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {message}
          </p>
          <div className={`mt-2 flex ${isRTL ? 'justify-start' : 'justify-end'} items-center gap-2`}>
            {!isRead && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>}
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { notifications, markNotificationAsRead, markAllAsRead } = useNotifications();
  const isRTL = i18n.dir() === 'rtl';

  if (!isOpen) return null;

  return (
    <div 
      className={`absolute top-12 ${isRTL ? 'left-0' : 'right-0'} w-[380px] bg-[#F8FAFC] dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 ${isRTL ? 'origin-top-left' : 'origin-top-right'}`}
      style={{ boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.15)' }}
    >
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E293B]">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {t('nav.notifications')}
        </h3>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              markAllAsRead();
            }}
            className="text-[13px] font-semibold text-[#00BBA7] hover:text-[#00a392] transition-colors"
          >
            {t('nav.markAllRead')}
          </button>
        )}
      </div>

      {/* List */}
      <div className="p-4 max-h-[480px] overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-[#0F172A]">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItem 
              key={notif.id} 
              {...notif}
              onRead={markNotificationAsRead}
            />
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400">
            <Bell size={48} strokeWidth={1} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">{t('nav.noNotifications') || 'No new notifications'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
