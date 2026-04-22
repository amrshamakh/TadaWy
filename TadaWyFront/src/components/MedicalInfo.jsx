import { useState, useRef, useEffect } from "react";
import { RiPulseFill } from "react-icons/ri";
import { X, Search, ChevronDown } from "lucide-react";
import { assets } from "../assets/assets";
import { useTranslation } from 'react-i18next';

/**
 * A searchable selection component that only allows choosing from a provided list.
 */
const TagSelection = ({ 
  label, 
  selectedNames, 
  lookupItems, 
  onAdd, 
  onRemove, 
  tagColor = "teal",
  placeholder
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = lookupItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) &&
    !selectedNames.includes(item.name)
  );

  const colors = {
    red: {
      chip: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      remove: "hover:bg-red-200 dark:hover:bg-red-800 text-red-500",
      highlight: "text-red-600 dark:text-red-400",
    },
    teal: {
      chip: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800",
      remove: "hover:bg-teal-200 dark:hover:bg-teal-800 text-teal-500",
      highlight: "text-teal-600 dark:text-teal-400",
    }
  }[tagColor];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedNames.map(name => (
          <span 
            key={name}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${colors.chip}`}
          >
            {name}
            <button 
              type="button" 
              onClick={() => onRemove(name)}
              className={`p-0.5 rounded-full transition-colors ${colors.remove}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || t('auth.doctor.searchSpecialization', 'Search to select...')}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#3341554D] border border-gray-100 dark:border-[#334155] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all dark:text-white"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && query && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl shadow-2xl max-h-56 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="overflow-y-auto max-h-56 py-1">
            {filtered.length > 0 ? (
              filtered.map(item => (
                <li
                  key={item.id}
                  onClick={() => {
                    onAdd(item.name);
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className="px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-teal-500/10 text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-between"
                >
                  {item.name}
                  <ChevronDown size={14} className="text-teal-500 -rotate-90 opacity-0 group-hover:opacity-100" />
                </li>
              ))
            ) : (
              <li className="px-4 py-4 text-center text-sm text-gray-400 italic">
                {t('auth.doctor.noMatches', 'No matches found')}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const MedicalInfo = ({
  data,
  isEditing,
  onBloodChange,
  // New props for selection
  allAllergies = [],
  allDiseases = [],
  toggleAllergy,
  toggleDisease,
}) => {
  const { t } = useTranslation();

  const selectedAllergies = Object.entries(data.allergies)
    .filter(([_, checked]) => checked)
    .map(([name]) => name);

  const selectedDiseases = Object.entries(data.chronicDiseases)
    .filter(([_, checked]) => checked)
    .map(([name]) => name);

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
      <div className="px-6 py-4 border-b border-gray-50 dark:border-[#334155]">
        <div className="flex gap-2 items-center">
          <RiPulseFill className="text-teal-500 text-xl" />
          <h2 className="text-lg font-bold dark:text-white">
            {t('profile.medicalInfo.title')}
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t('profile.medicalInfo.subtitle')}
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Blood Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            {t('profile.medicalInfo.bloodType')}
          </label>
          {isEditing ? (
            <select
              value={data.bloodType}
              onChange={(e) => onBloodChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all dark:text-white ${
                isEditing
                  ? "bg-teal-50/40 dark:bg-teal-900/10 border border-gray-100 dark:border-[#334155]"
                  : "bg-gray-50 dark:bg-[#3341554D] border border-gray-100 dark:border-[#334155]"
              }`}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          ) : (
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#3341554D] text-gray-600 dark:text-gray-300 rounded-xl font-medium border border-gray-100 dark:border-[#334155]">
              {data.bloodType || "—"}
            </div>
          )}
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            {t('profile.medicalInfo.allergies')}
          </label>
          {isEditing ? (
            <TagSelection
              label={t('profile.medicalInfo.allergies')}
              selectedNames={selectedAllergies}
              lookupItems={allAllergies}
              onAdd={toggleAllergy}
              onRemove={toggleAllergy}
              tagColor="red"
              placeholder={t("profile.medicalInfo.searchAllergies", "Search Allergies")}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedAllergies.length > 0 ? (
                selectedAllergies.map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-lg text-sm font-medium"
                  >
                    <img className="h-4 w-4 opacity-70" src={assets.allergylIcon} alt="" />
                    {name}
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">{t('profile.medicalInfo.noAllergies', 'No allergies recorded')}</span>
              )}
            </div>
          )}
        </div>

        {/* Chronic Diseases */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            {t('profile.medicalInfo.chronicDiseases')}
          </label>
          {isEditing ? (
            <TagSelection
              label={t('profile.medicalInfo.chronicDiseases')}
              selectedNames={selectedDiseases}
              lookupItems={allDiseases}
              onAdd={toggleDisease}
              onRemove={toggleDisease}
              tagColor="teal"
              placeholder={t("profile.medicalInfo.searchDiseases", "Search Diseases")}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedDiseases.length > 0 ? (
                selectedDiseases.map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-800 rounded-lg text-sm font-medium"
                  >
                    <img className="h-4 w-4 opacity-70" src={assets.medical1Icon} alt="" />
                    {name}
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">{t('profile.medicalInfo.noDiseases', 'No chronic diseases recorded')}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalInfo;