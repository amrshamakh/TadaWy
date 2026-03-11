import { LuUsers } from "react-icons/lu";
import { useTranslation } from "react-i18next";

const EmergencyContact = ({ phone, isEditing, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
      {/* HEADER */}
      <div className="p-6 flex gap-2 items-start h-10">
        <LuUsers className="dark:text-white w-5 h-5" alt="" />
        <h2 className="text-[#1A1F2E] dark:text-white font-['Inter'] font-bold text-lg leading-4 tracking-[-0.31px]">
          {t('profile.emergencyContact.title')}
        </h2>
      </div>

      {/* SUBTITLE */}
      <div className="px-6">
        <p className="text-[#64748B] dark:text-gray-400 font-['Inter'] font-normal text-[16px] leading-6 mt-4 mb-0 tracking-[-0.31px]">
          {t('profile.emergencyContact.subtitle')}
        </p>
      </div>

      {/* PHONE NUMBER */}
      <div className="px-6 pb-6 flex flex-col text-start">
        <div className="font-['Inter'] font-normal text-base leading-6 tracking-[-0.31px] mb-1 dark:text-white">
          {t('profile.emergencyContact.phoneNumber')}
        </div>

        {isEditing ? (
          <input
            type="text"
            value={phone || ""}
            onChange={(e) => onChange(e.target.value)}
            className="px-3 py-2 border border-white dark:border-[#334155] font-['Inter'] font-normal text-sm leading-none tracking-[-0.15px] text-gray-800 dark:text-white bg-[#F8FAFC] dark:bg-[#3341554D] h-9 rounded"
          />
        ) : (
          <p className="px-3 py-2 border border-white dark:border-[#334155] font-['Inter'] font-normal text-sm leading-none tracking-[-0.15px] text-[#64748B] dark:text-gray-400 bg-[#F8FAFC] dark:bg-[#3341554D] h-9 rounded">
            {phone}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmergencyContact;
