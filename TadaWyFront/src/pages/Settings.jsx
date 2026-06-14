import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import LanguageSettings from "../components/settings/LanguageSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import AccountInfo from "../components/settings/AccountInfo";
import DangerZone from "../components/settings/DangerZone";
import { useTranslation } from 'react-i18next';
import { getSettings, updateSettings } from "../services/settingService";
import { toast } from "react-toastify";
import { ProfileSkeleton } from "../components/Skeleton";

const Settings = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const { isSidebarOpen } = useOutletContext() || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getSettings();
      setSettings(response);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error(t('error.failedToLoadSettings') || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key, value) => {
    const previousSettings = settings;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await updateSettings({
        theme: newSettings.theme || 'light',
        language: newSettings.language || 'en',
        emailNotifications: newSettings.emailNotifications ?? true,
        applicationNotifications: newSettings.applicationNotifications ?? true,
      });
    } catch (error) {
      console.error("Failed to update setting:", error);
      toast.error(t('error.failedToUpdateSettings') || "Failed to update settings.");
      setSettings(previousSettings);
    }
  };

  return (
    <div className={`max-w-5xl w-full space-y-6 mt-2 transition-all duration-300 ${isSidebarOpen ? "ms-8" : "mx-auto"}`}>
      <div>
        <h1 className="dark:text-white text-3xl font-bold">
          {t('settings.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <>
          <AppearanceSettings settings={settings || {}} onUpdate={handleUpdateSetting} />
          <LanguageSettings settings={settings || {}} onUpdate={handleUpdateSetting} />
          <NotificationSettings settings={settings || {}} onUpdate={handleUpdateSetting} />
          <AccountInfo settings={settings || {}} />
          <DangerZone />
        </>
      )}
    </div>
  );
};

export default Settings;
