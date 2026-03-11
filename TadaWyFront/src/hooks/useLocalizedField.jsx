// hooks/useLocalizedField.js
import { useTranslation } from "react-i18next";

export function useLocalizedField() {
  const { i18n } = useTranslation();
  return (obj, field) => {
    const key = i18n.language === "ar" ? `${field}_ar` : `${field}_en`;
    return obj[key] ?? obj[field] ?? ""; // fallback chain
  };
}