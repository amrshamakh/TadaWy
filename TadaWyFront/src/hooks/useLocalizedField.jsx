// hooks/useLocalizedField.js
import { useTranslation } from "react-i18next";

export function useLocalizedField() {
  const { i18n } = useTranslation();
  return (obj, field) => {
    if (!obj) return "";
    const isAr = i18n.language === "ar";

    // Check camelCase (e.g., nameAr, nameEn)
    const camelField = field + (isAr ? "Ar" : "En");
    if (obj[camelField] !== undefined && obj[camelField] !== null) return obj[camelField];

    // Check snake_case (e.g., name_ar, name_en)
    const snakeField = field + (isAr ? "_ar" : "_en");
    if (obj[snakeField] !== undefined && obj[snakeField] !== null) return obj[snakeField];

    // Check PascalCase (e.g., NameAr, NameEn)
    const pascalField = field.charAt(0).toUpperCase() + field.slice(1) + (isAr ? "Ar" : "En");
    if (obj[pascalField] !== undefined && obj[pascalField] !== null) return obj[pascalField];

    return obj[field] ?? ""; // fallback
  };
}