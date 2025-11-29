import { useLanguage } from "@/lib/language-context";
import type { Language } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const languageLabels: Record<Language, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ["az", "en", "ru"];

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 flex items-center gap-1 bg-card border border-card-border rounded-lg p-1 shadow-md"
      data-testid="language-switcher"
    >
      <Globe className="w-4 h-4 text-muted-foreground ml-2" />
      {languages.map((lang) => (
        <Button
          key={lang}
          variant={language === lang ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage(lang)}
          className={`min-w-[40px] text-xs font-semibold ${
            language === lang ? "" : "text-muted-foreground"
          }`}
          data-testid={`button-lang-${lang}`}
        >
          {languageLabels[lang]}
        </Button>
      ))}
    </div>
  );
}
