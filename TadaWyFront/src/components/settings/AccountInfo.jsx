import { LuShield } from "react-icons/lu";
import { useTranslation } from 'react-i18next';

const AccountInfo = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <LuShield className="dark:text-white w-5 h-5" />
          <h2 className="text-lg font-medium dark:text-white">
            {t('settings.accountInfo.title')}
          </h2>
        </div>
        <p className="text-[#64748B] dark:text-gray-400 mt-1 font-normal text-lg">
          {t('settings.accountInfo.subtitle')}
        </p>
      </div>

      <div className="px-6 pb-6 space-y-4">
        <div className="flex justify-between text-sm border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
          <span className="text-[#64748B] dark:text-gray-400">
            {t('settings.accountInfo.email')}
          </span>
          <span className="dark:text-white">omaralsmnaji@igh.com</span>
        </div>

        <div className="flex justify-between text-sm border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
          <span className="text-[#64748B] dark:text-gray-400">
            {t('settings.accountInfo.accountId')}
          </span>
          <span className="dark:text-white">1</span>
        </div>

        <button className="mt-2 px-3 py-2 border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-lg hover:bg-gray-50 dark:hover:bg-[#334155] font-medium font-[Inter] dark:text-white">
          {t('settings.accountInfo.changePassword')}
        </button>
      </div>
    </div>
  );
};

export default AccountInfo;