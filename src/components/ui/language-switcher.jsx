import React from "react";
import { GB, PL } from "country-flag-icons/react/3x2";
import { IconButton, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <HStack spacing={4}>
      <IconButton
        aria-label="Switch to Polish"
        onClick={() => changeLanguage("pl")}
        variant={currentLanguage === "pl" ? "subtle" : "plain"}
        colorPalette="purple"
      >
        <PL
          style={{
            width: "2.25rem",
            height: "1.5rem",
            margin: "auto",
            filter: "drop-shadow(0px 0px 2px gray)",
          }}
        />
      </IconButton>
      <IconButton
        aria-label="Switch to English"
        onClick={() => changeLanguage("en")}
        variant={currentLanguage === "en" ? "subtle" : "plain"}
        colorPalette="purple"
      >
        <GB
          style={{
            width: "2.25rem",
            height: "1.5rem",
            margin: "auto",
            filter: "drop-shadow(0px 0px 2px gray)",
          }}
        />
      </IconButton>
    </HStack>
  );
};

export default LanguageSwitcher;
