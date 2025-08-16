// context/LanguageContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language | null;
    if (storedLang) {
      setLanguageState(storedLang);
    } else {
      fetch('https://ipinfo.io/json?token=53cd9f60a714e6')
        .then(res => res.json())
        .then(data => {
          const lang = data?.country === 'HU' ? 'hu' : 'en';
          setLanguageState(lang);
          localStorage.setItem('language', lang);
        })
        .catch(() => setLanguageState('en'));
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
