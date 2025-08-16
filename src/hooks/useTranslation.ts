import { useContext, useMemo } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { getTranslation } from '../lib/translations';

export default function useTranslation() {
  const { language } = useContext(LanguageContext);
  const t = useMemo(() => getTranslation(language), [language]);
  return { t, language };
}