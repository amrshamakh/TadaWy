import { useState, useEffect } from "react";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import LanguageSettings from "../components/settings/LanguageSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import AccountInfo from "../components/settings/AccountInfo";
import DangerZone from "../components/settings/DangerZone";
import { useTranslation } from 'react-i18next';
import { getSettings, updateSettings } from "../services/settingService";
import { toast } from "react-toastify";

const Settings = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getSettings();
      // response is directly the data object from ApiClient
      setSettings(response);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error(t('error.failedToLoadSettings') || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    // Optimistic update
    setSettings(newSettings);
    
    try {
      await updateSettings({
        theme: newSettings.theme || 'light',
        language: newSettings.language || 'en',
        emailNotifications: newSettings.emailNotifications ?? true,
        applicationNotifications: newSettings.applicationNotifications ?? true
      });
      // Removing success toast as requested
    } catch (error) {
      console.error("Failed to update setting:", error);
      toast.error(t('error.failedToUpdateSettings') || "Failed to update settings.");
      // Revert on failure
      setSettings(settings);
    }
  };

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

      {loading || !settings ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
        </div>
      ) : (
        <>
          <AppearanceSettings settings={settings} onUpdate={handleUpdateSetting} />
          <LanguageSettings settings={settings} onUpdate={handleUpdateSetting} />
          <NotificationSettings settings={settings} onUpdate={handleUpdateSetting} />
          
          <AccountInfo settings={settings} />
          <DangerZone />
        </>
      )}
    </div>
  );
};

export default Settings;