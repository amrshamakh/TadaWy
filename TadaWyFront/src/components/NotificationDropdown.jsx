import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle2, Stethoscope, Bell } from 'lucide-react';

const NotificationItem = ({ type, title, description, time, actionLabel, isLast }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const icons = {
    reminder: {
      icon: <Calendar size={20} />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    booked: {
      icon: <CheckCircle2 size={20} />,
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
    },
    completed: {
      icon: <Stethoscope size={20} />,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-500 dark:text-orange-400',
    }
  };

  const { icon, bgColor, iconColor } = icons[type] || icons.reminder;

  return (
    <div className={`p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E293B] shadow-sm mb-3 last:mb-0 transition-all hover:shadow-md cursor-pointer`}>
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${bgColor} ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h4>
            {actionLabel && (
              <span className="text-[11px] font-medium text-[#00BBA7] hover:underline whitespace-nowrap">
                {actionLabel}
              </span>
            )}
          </div>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
          <div className={`mt-2 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
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
  const isRTL = i18n.dir() === 'rtl';

  if (!isOpen) return null;

  const notifications = [
    {
      type: 'reminder',
      title: t('nav.appointmentReminder'),
      description: t('nav.appointmentReminderDesc'),
      time: t('nav.justNow'),
      actionLabel: null
    },
    {
      type: 'booked',
      title: t('nav.appointmentBooked'),
      description: t('nav.appointmentBookedDesc'),
      time: t('nav.hoursAgo', { count: 2 }),
      actionLabel: t('nav.clickForDetails')
    },
    {
      type: 'completed',
      title: t('nav.appointmentCompleted'),
      description: t('nav.appointmentCompletedDesc'),
      time: t('nav.yesterday'),
      actionLabel: t('nav.clickToReview')
    }
  ];

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
        <button className="text-[13px] font-semibold text-[#00BBA7] hover:text-[#00a392] transition-colors">
          {t('nav.markAllRead')}
        </button>
      </div>

      {/* List */}
      <div className="p-4 max-h-[480px] overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-[#0F172A]">
        {notifications.length > 0 ? (
          notifications.map((notif, idx) => (
            <NotificationItem 
              key={idx} 
              {...notif} 
              isLast={idx === notifications.length - 1} 
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
