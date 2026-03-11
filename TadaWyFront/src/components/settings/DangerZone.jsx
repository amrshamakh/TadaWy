import { LuLogOut } from "react-icons/lu";
import { useTranslation } from 'react-i18next';

const DangerZone = () => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-[#DC262680] dark:border-red-900 w-full max-w-full dark:bg-[#1E293B]">
      <div className="px-4 md:px-6 py-4">
        <h2 className="text-lg font-medium text-red-600 dark:text-red-500">
          {t('settings.dangerZone.title')}
        </h2>
        <p className="text-lg text-[#64748B] dark:text-gray-400 mt-4">
          {t('settings.dangerZone.subtitle')}
        </p>
      </div>

      <div className="px-4 md:px-6 pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
          <div>
            <p className="font-medium text-base sm:text-lg dark:text-white">
              {t('settings.dangerZone.signOut')}
            </p>
            <p className="text-sm sm:text-base text-[#64748B] dark:text-gray-400">
              {t('settings.dangerZone.signOutDescription')}
            </p>
          </div>
          <button className="mt-2 sm:mt-0 flex items-center justify-center gap-2 bg-red-500 dark:bg-red-600 text-white rounded-lg text-sm px-3 py-2 sm:px-4 sm:py-2 w-full sm:w-auto hover:bg-red-600 dark:hover:bg-red-700">
            <LuLogOut className="text-base sm:text-lg" />
            {t('settings.dangerZone.signOut')}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <p className="font-medium text-base sm:text-lg font-[Inter] dark:text-white">
              {t('settings.dangerZone.deleteAccount')}
            </p>
            <p className="text-sm sm:text-base text-[#64748B] dark:text-gray-400">
              {t('settings.dangerZone.deleteAccountDescription')}
            </p>
          </div>
          <button className="mt-2 sm:mt-0 px-3 py-2 sm:px-4 sm:py-2 border border-red-500 dark:border-red-600 text-red-500 dark:text-red-400 rounded-lg text-sm w-full sm:w-auto hover:bg-red-50 dark:hover:bg-red-950">
            {t('settings.dangerZone.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangerZone;