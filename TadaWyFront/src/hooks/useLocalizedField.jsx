// hooks/useLocalizedField.js
import { useTranslation } from "react-i18next";

export function useLocalizedField() {
  const { i18n } = useTranslation();
  return (obj, field) => {
    if (!obj) return "";
    const isAr = i18n.language === "ar";
    const suffixes = isAr ? ["Ar", "AR", "_ar"] : ["En", "EN", "_en"];
    
    // 1. Try common suffixes for the field (e.g., nameAr, doctorNameAr)
    for (const suffix of suffixes) {
      const key = `${field}${suffix}`;
      const capKey = `${field.charAt(0).toUpperCase()}${field.slice(1)}${suffix}`;
      
      if (obj[key]) return obj[key];
      if (obj[capKey]) return obj[capKey];
    }
    
    // 2. Try the base field name
    const capField = field.charAt(0).toUpperCase() + field.slice(1);
    if (obj[field]) return obj[field];
    if (obj[capField]) return obj[capField];
    
    return ""; 
  };
}