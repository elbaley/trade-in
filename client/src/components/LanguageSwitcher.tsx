import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LucideCheck, LucideGlobe } from "lucide-react";

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const currentLang = i18n.resolvedLanguage;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          <LucideGlobe />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>{t("header.language.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            i18n.changeLanguage("en");
          }}
        >
          {t("header.language.english")}
          {currentLang === "en" && <LucideCheck />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            i18n.changeLanguage("tr");
          }}
        >
          {t("header.language.turkish")}
          {currentLang === "tr" && <LucideCheck />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
