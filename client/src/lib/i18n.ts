import { en } from '../locales/en';
import { fr } from '../locales/fr';

export const languages = {
  en: 'English',
  fr: 'Français'
} as const;

export const translations = {
  en,
  fr
} as const;

export type Language = keyof typeof languages;
```

 becomes

```typescript
import { createContext } from "react";
import { en } from '../locales/en';
import { fr } from '../locales/fr';

export const languages = {
  en: 'English',
  fr: 'Français'
} as const;

export const translations = {
  en,
  fr
} as const;

export type Language = keyof typeof languages;

export interface Translations {
  [key: string]: string | { [key: string]: string | any };
}

export const defaultLanguage: Language = "fr";

export const supportedLanguages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" }
] as const;

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);

// Function to get translation by key (supports nested paths like 'common.buttons.save')
export function getTranslation(language: Language, key: string, params?: Record<string, string>): string {
  const keys = key.split(".");
  let result: any = translations[language];

  for (const k of keys) {
    if (!result[k]) {
      // Fallback to key if translation not found
      return key;
    }
    result = result[k];
  }

  if (typeof result !== "string") {
    return key;
  }

  // Replace parameters in translation string
  if (params) {
    return Object.entries(params).reduce(
      (str, [param, value]) => str.replace(new RegExp(`{${param}}`, "g"), value),
      result
    );
  }

  return result;
}
```

```typescript
import { createContext } from "react";
import { en } from '../locales/en';
import { fr } from '../locales/fr';

export const languages = {
  en: 'English',
  fr: 'Français'
} as const;

export const translations = {
  en,
  fr
} as const;

export type Language = keyof typeof languages;

export interface Translations {
  [key: string]: string | { [key: string]: string | any };
}

export const defaultLanguage: Language = "fr";

export const supportedLanguages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" }
] as const;

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);

// Function to get translation by key (supports nested paths like 'common.buttons.save')
export function getTranslation(language: Language, key: string, params?: Record<string, string>): string {
  const keys = key.split(".");
  let result: any = translations[language];

  for (const k of keys) {
    if (!result[k]) {
      // Fallback to key if translation not found
      return key;
    }
    result = result[k];
  }

  if (typeof result !== "string") {
    return key;
  }

  // Replace parameters in translation string
  if (params) {
    return Object.entries(params).reduce(
      (str, [param, value]) => str.replace(new RegExp(`{${param}}`, "g"), value),
      result
    );
  }

  return result;
}