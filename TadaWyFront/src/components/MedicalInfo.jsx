import { useState, useRef, useEffect } from "react";
import { RiPulseFill } from "react-icons/ri";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";
import { X, Plus } from "lucide-react";

/* ─── Small reusable tag-input component ─────────────────────────────────── */
const TagInput = ({
  label,
  selectedNames,    // string[]  – names currently selected
  lookupItems,      // { id, name }[]  – master list from API
  onAdd,            // (name) => void  – add existing item
  onRemove,         // (name) => void
  onCreate,         // (name) => Promise<void>  – create new item in lookup + select it
  tagColor = "red", // "red" | "teal"
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  const trimmed = query.trim();

  const filtered = lookupItems.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedNames.includes(item.name)
  );

  /* check if the typed text exactly matches any existing item (case-insensitive) */
  const allNames = lookupItems.map((i) => i.name.toLowerCase());
  const existsInLookup = allNames.includes(trimmed.toLowerCase());
  const alreadySelected = selectedNames
    .map((n) => n.toLowerCase())
    .includes(trimmed.toLowerCase());
  const showAddButton =
    trimmed.length > 0 && !existsInLookup && !alreadySelected;

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCreate = async () => {
    if (!trimmed || !onCreate) return;
    try {
      setCreating(true);
      await onCreate(trimmed);
      setQuery("");
      setOpen(false);
    } catch (err) {
      console.error("Failed to create item:", err);
    } finally {
      setCreating(false);
    }
  };

  const colorMap = {
    red: {
      tag: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700",
      btn: "hover:bg-red-200 dark:hover:bg-red-800",
      highlight: "text-red-600 dark:text-red-400",
      addBtn: "bg-red-500 hover:bg-red-600",
    },
    teal: {
      tag: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-700",
      btn: "hover:bg-teal-200 dark:hover:bg-teal-800",
      highlight: "text-teal-600 dark:text-teal-400",
      addBtn: "bg-teal-500 hover:bg-teal-600",
    },
  };
  const c = colorMap[tagColor] || colorMap.red;

  return (
    <div ref={wrapRef} className="relative">
      {/* selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedNames.map((name) => (
          <span
            key={name}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm border ${c.tag}`}
          >
            {name}
            <button
              type="button"
              onClick={() => onRemove(name)}
              className={`rounded-full p-0.5 transition-colors ${c.btn}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* text input + add button */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={`${t("common.search") || "Search"} ${label}…`}
          className="flex-1 font-normal text-sm px-3 py-2 border border-white dark:border-[#334155] outline-teal-500 text-gray-500 bg-[#F8FAFC] dark:bg-[#04070a4d] tracking-tight"
        />

        {showAddButton && (
          <button
            type="button"
            disabled={creating}
            onClick={handleCreate}
            className={`flex items-center gap-1 px-4 py-2 text-sm text-white rounded-lg transition-colors disabled:opacity-50 ${c.addBtn}`}
          >
            <Plus size={14} />
            {creating ? (t("common.adding") || "Adding…") : (t("common.add") || "Add")}
          </button>
        )}
      </div>

      {/* dropdown */}
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-44 overflow-y-auto bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg shadow-lg">
          {filtered.map((item) => (
            <li
              key={item.id}
              onMouseDown={(e) => {
                e.preventDefault();
                onAdd(item.name);
                setQuery("");
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-[#F8FAFC] dark:hover:bg-[#334155] ${c.highlight}`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ─── MedicalInfo ─────────────────────────────────────────────────────────── */
const MedicalInfo = ({
  data,
  isEditing,
  onBloodChange,
  // lookup master arrays
  allAllergies,   // { id, name }[]
  allDiseases,    // { id, name }[]
  // edit callbacks
  onAddAllergy,
  onRemoveAllergy,
  onAddDisease,
  onRemoveDisease,
  // create new items
  onCreateAllergy,   // (name) => Promise<void>
  onCreateDisease,   // (name) => Promise<void>
}) => {
  const { t } = useTranslation();

  /* derive selected names from the boolean map */
  const selectedAllergyNames = Object.entries(data.allergies)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const selectedDiseaseNames = Object.entries(data.chronicDiseases)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
      {/* header */}
      <div className="px-6 py-4">
        <div className="flex gap-2 items-center">
          <RiPulseFill className="dark:text-white text-lg" />
          <h2 className="text-lg font-semibold dark:text-white">
            {t("profile.medicalInfo.title")}
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {t("profile.medicalInfo.subtitle")}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* ── Blood Type ─────────────────────────────────────── */}
        <div className="flex flex-col justify-between items-start">
          <p className="text-sm font-medium mb-1 dark:text-white">
            {t("profile.medicalInfo.bloodType")}
          </p>

          {isEditing ? (
            <select
              value={data.bloodType}
              onChange={(e) => onBloodChange(e.target.value)}
              className="border px-3 py-2 outline-none w-full border-white dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#3341554D] dark:text-gray-400"
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => (
                <option key={bt}>{bt}</option>
              ))}
            </select>
          ) : (
            <span className="px-4 py-2 w-full bg-[#F8FAFC] dark:bg-[#3341554D] text-sm font-medium text-gray-500 dark:text-gray-400">
              {data.bloodType || "—"}
            </span>
          )}
        </div>

        {/* ── Allergies ──────────────────────────────────────── */}
        <div>
          <p className="text-sm font-medium mb-2 dark:text-white">
            {t("profile.medicalInfo.allergies")}
          </p>

          {isEditing ? (
            <TagInput
              label={t("profile.medicalInfo.allergies")}
              selectedNames={selectedAllergyNames}
              lookupItems={allAllergies || []}
              onAdd={onAddAllergy}
              onRemove={onRemoveAllergy}
              onCreate={onCreateAllergy}
              tagColor="red"
            />
          ) : selectedAllergyNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedAllergyNames.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-3 py-1 h-9 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm"
                >
                  <img className="h-4 w-4" src={assets.allergylIcon} alt="" />
                  {name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">—</p>
          )}
        </div>

        {/* ── Chronic Diseases ───────────────────────────────── */}
        <div>
          <p className="text-sm font-medium mb-2 dark:text-white">
            {t("profile.medicalInfo.chronicDiseases")}
          </p>

          {isEditing ? (
            <TagInput
              label={t("profile.medicalInfo.chronicDiseases")}
              selectedNames={selectedDiseaseNames}
              lookupItems={allDiseases || []}
              onAdd={onAddDisease}
              onRemove={onRemoveDisease}
              onCreate={onCreateDisease}
              tagColor="teal"
            />
          ) : selectedDiseaseNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedDiseaseNames.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-3 py-1 h-9 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg text-sm"
                >
                  {name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">—</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalInfo;