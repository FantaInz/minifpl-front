import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "@/utils/en-translation.json";
import plTranslations from "@/utils/pl-translation.json";

const savedLanguage = localStorage.getItem("language") || "pl";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    pl: { translation: plTranslations },
  },
  fallbackLng: "pl",
  lng: savedLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
