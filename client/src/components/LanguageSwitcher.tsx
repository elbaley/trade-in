import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          i18n.changeLanguage("tr");
        }}
      >
        TR
      </Button>
      <Button
        onClick={() => {
          i18n.changeLanguage("en");
        }}
      >
        EN
      </Button>
    </div>
  );
};
