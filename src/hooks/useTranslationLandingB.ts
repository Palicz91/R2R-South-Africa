// src/hooks/useTranslationLandingB.ts
import { getTranslationLandingB } from "../lib/translationsLandingB";

export default function useTranslation(opts?: { forceLang?: 'en'|'hu' }) {
  const lang = opts?.forceLang ?? 'en';
  // töltsd a megfelelő nyelvi objektumot, de most mindig en
  const translations = {
    en: getTranslationLandingB('en'),
    hu: getTranslationLandingB('hu'),

  };
  return { t: translations[lang], lang };
}
