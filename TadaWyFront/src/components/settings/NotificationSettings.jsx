import { useState } from "react";
import Toggle from "./Toggle";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useTranslation } from 'react-i18next';

const NotificationRow = ({ title, description, enabled: initialEnabled }) => {
  const [enabled, setEnabled] = useState(initialEnabled || false);

  return (
    <div className="flex items-center justify-between py-4 border-b border-[#E2E8F0] dark:border-[#334155] last:border-none">
      <div className="flex-1">
        <p className="text-base font-medium text-gray-900 dark:text-white font-[Inter]">
          {title}
        </p>
        <p className="text-sm text-[#64748B] dark:text-gray-400 font-normal font-[Inter] mt-1">
          {description}
        </p>
      </div>
      <div className="ms-4">
        <Toggle checked={enabled} onToggle={() => setEnabled(!enabled)} />
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm min-h-40">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <IoMdNotificationsOutline className="dark:text-white w-5 h-5" alt="Notification icon" />
          <h2 className="text-lg font-medium font-[Inter] dark:text-white">
            {t('settings.notifications.title')}
          </h2>
        </div>
        <p className="text-[#64748B] dark:text-gray-400 mt-1 text-[16px] font-normal font-[Inter]">
          {t('settings.notifications.subtitle')}
        </p>
      </div>

      <div className="px-4 sm:px-6 pb-6">
        <NotificationRow
          title={t('settings.notifications.appointmentReminders')}
          description={t('settings.notifications.appointmentDescription')}
          enabled={true}
        />
        <NotificationRow
          title={t('settings.notifications.emailNotifications')}
          description={t('settings.notifications.emailDescription')}
          enabled={true}
        />
        <NotificationRow
          title={t('settings.notifications.marketingUpdates')}
          description={t('settings.notifications.marketingDescription')}
          enabled={false}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;