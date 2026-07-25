import { Globe2 } from "lucide-react";
import { Language, useLanguage } from "@/i18n/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage, t, languageLabel } = useLanguage();
  return (
    <label className="relative flex items-center text-muted-foreground hover:text-foreground transition-colors" title={t("language")}>
      <Globe2 className="pointer-events-none absolute left-2 w-4 h-4" aria-hidden="true" />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        aria-label={t("language")}
        className="h-9 appearance-none bg-transparent pl-7 pr-2 text-xs font-medium focus:outline-none cursor-pointer"
      >
        {(["id", "en", "zh", "ru"] as Language[]).map((value) => <option key={value} value={value}>{languageLabel(value)}</option>)}
      </select>
    </label>
  );
};
