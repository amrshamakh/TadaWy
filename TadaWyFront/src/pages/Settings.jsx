import AppearanceSettings from "../components/settings/AppearanceSettings";
import LanguageSettings from "../components/settings/LanguageSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import AccountInfo from "../components/settings/AccountInfo";
import DangerZone from "../components/settings/DangerZone";
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div className=" space-y-6 ">
      <div>
        <h1 className="dark:text-white text-2xl font-bold">
          {t('settings.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      <AppearanceSettings />
      <LanguageSettings />
      <NotificationSettings />
      <AccountInfo />
      <DangerZone />
    </div>
  );
};

export default Settings;