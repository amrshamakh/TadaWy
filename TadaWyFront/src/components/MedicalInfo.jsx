import { RiPulseFill } from "react-icons/ri";
import { assets } from "../assets/assets";
import { useTranslation } from 'react-i18next';

const MedicalInfo = ({
  data,
  isEditing,
  onBloodChange,
  toggleAllergy,
  toggleDisease,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
      <div className="px-6 py-4">
        <div className="flex gap-2 items-center">
          <RiPulseFill className="dark:text-white text-lg" />
          <h2 className="text-lg font-semibold dark:text-white">
            {t('profile.medicalInfo.title')}
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {t('profile.medicalInfo.subtitle')}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Blood Type */}
        <div className="flex flex-col justify-between items-start">
          <p className="text-sm font-medium mb-1 dark:text-white">
            {t('profile.medicalInfo.bloodType')}
          </p>

          {isEditing ? (
            <select
              value={data.bloodType}
              onChange={(e) => onBloodChange(e.target.value)}
              className="border px-3 py-2 outline-none w-full border-white dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#3341554D] dark:text-gray-400"
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          ) : (
            <span className="px-4 py-2 w-full bg-[#F8FAFC] dark:bg-[#3341554D] text-sm font-medium text-gray-500 dark:text-gray-400">
              {data.bloodType}
            </span>
          )}
        </div>

        {/* Allergies */}
        <div>
          <div className="flex items-center mb-2">
            <span className="font-semibold dark:text-white">
              {t('profile.medicalInfo.allergies')}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isEditing &&
              Object.entries(data.allergies).map(
                ([k, v]) =>
                  v && (
                    <div
                      key={k}
                      className="flex items-center gap-2 px-3 py-1 w-auto h-9 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-inter font-normal text-[14px] leading-5px tracking-[-0.15px] align-middle"
                    >
                      <img
                        className="h-4 w-4 align-middle"
                        src={assets.allergylIcon}
                        alt=""
                      />
                      {k}
                    </div>
                  ),
              )}

            {isEditing &&
              Object.keys(data.allergies).map((a) => (
                <label
                  key={a}
                  className={`flex items-center gap-2 px-3 py-1 w-auto h-9 rounded-lg font-inter font-normal text-[14px] leading-5px tracking-[-0.15px] align-middle cursor-pointer border transition-colors ${
                    data.allergies[a]
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-[#F8FAFC] dark:bg-[#3341554D] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={data.allergies[a]}
                    onChange={() => toggleAllergy(a)}
                    className="hidden"
                  />
                  {a}
                </label>
              ))}
          </div>
        </div>

        {/* Chronic Diseases */}
        <div>
          <div className="flex items-center mb-2">
            <span className="font-semibold dark:text-white">
              {t('profile.medicalInfo.chronicDiseases')}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isEditing &&
              Object.entries(data.chronicDiseases).map(
                ([k, v]) =>
                  v && (
                    <div
                      key={k}
                      className="flex items-center gap-2 px-3 text-[#00BBA7] dark:text-[#00BBA7] py-1 w-auto h-9.5 bg-[#00BBA71A] dark:bg-[#00BBA71A] rounded-lg font-inter font-normal text-[14px] leading-5px tracking-[-0.15px] align-middle"
                    >
                      <img src={assets.medical1Icon} alt="" />
                      {k}
                    </div>
                  ),
              )}

            {isEditing &&
              Object.keys(data.chronicDiseases).map((d) => (
                <label
                  key={d}
                  className={`flex items-center gap-2 px-3 py-1 w-auto h-9 rounded-lg font-inter font-normal text-[14px] leading-5px tracking-[-0.15px] align-middle cursor-pointer border transition-colors ${
                    data.chronicDiseases[d]
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-[#F8FAFC] dark:bg-[#3341554D] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={data.chronicDiseases[d]}
                    onChange={() => toggleDisease(d)}
                    className="hidden"
                  />
                  {d}
                </label>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalInfo;