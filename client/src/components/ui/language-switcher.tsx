import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { supportedLanguages } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  
  const activeLanguage = supportedLanguages.find(lang => lang.code === language);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-2 py-1 rounded-md text-sm font-medium"
        >
          <span className="mr-1">{activeLanguage?.flag}</span> 
          {activeLanguage?.code.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </span>
            {language === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
