// src/hooks/useTranslationLandingB.ts
import { useContext, useMemo } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { getTranslationLandingB } from "../lib/translationsLandingB";

export default function useTranslationLandingB() {
  const { language } = useContext(LanguageContext);
  const t = useMemo(() => getTranslationLandingB(language), [language]);
  return { t, language };
}
