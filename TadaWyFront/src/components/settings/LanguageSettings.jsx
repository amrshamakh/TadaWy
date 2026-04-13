import { MdOutlineLanguage } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const LanguageSettings = () => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    
    // Update document direction and language attribute
    if (languageCode === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  };

  // Document direction is handled Globally in App.jsx

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm min-h-40">
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <MdOutlineLanguage className="dark:text-white w-5 h-5" />
          <h2 className="text-lg font-medium dark:text-white">
            {t('settings.languageRegion.title')}
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          {t('settings.languageRegion.subtitle')}
        </p>
      </div>

      <div className="px-6 pb-6">
        <p className="text-sm font-medium mb-1 dark:text-white">
          {t('settings.languageRegion.language')}
        </p>
        <div className="relative w-64">
          <select 
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="w-full px-3 py-2 dark:text-white text-sm bg-[#F8FAFC] dark:bg-[#3341554D] border border-white dark:border-[#334155] rounded-lg outline-0 appearance-none pe-10 cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;