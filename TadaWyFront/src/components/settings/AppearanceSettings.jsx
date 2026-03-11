import { useEffect, useState } from "react";
import Toggle from "./Toggle";
import { useTheme } from "../../context/themeContext";
import { LuSunMedium } from "react-icons/lu";
import { FaRegMoon } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const AppearanceSettings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm min-h-40">
      <div className="px-4 sm:px-6 py-4 sm:py-2 flex flex-col gap-4 sm:gap-6">
        {/* Header Section */}
        <div>
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <FaRegMoon className="dark:text-white w-5 h-5" alt="Dark mode" />
            ) : (
              <LuSunMedium className="w-5 h-5" alt="Sun icon" />
            )}
            <h2 className="text-lg font-medium dark:text-white">
              {t('settings.appearance.title')}
            </h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-[16px] font-normal font-[Inter]">
            {t('settings.appearance.subtitle')}
          </p>
        </div>

        {/* Theme Toggle Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col">
            <p className="font-[Inter] font-medium text-lg dark:text-white">
              {t('settings.appearance.theme')}
            </p>
            <p className="text-[#64748B] dark:text-gray-400 font-normal text-base sm:text-lg">
              {t('settings.appearance.themeDescription')}
            </p>
          </div>
          <div className="flex items-center justify-start lg:justify-end gap-3">
            <LuSunMedium className="dark:text-white w-5 h-5" alt="Light mode" />
            <div className="[&_button]:bg-teal-500 [&_button:hover]:bg-teal-600">
              <Toggle checked={isDarkMode} onToggle={toggleDarkMode} />
            </div>
            <FaRegMoon className="dark:text-white w-5 h-5" alt="Dark mode" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;