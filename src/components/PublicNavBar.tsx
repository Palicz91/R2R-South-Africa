import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ScrollProgressBar from './ScrollProgressBar';

const navbarTranslations = {
  en: {
    useCases: "Use Cases",
    ourStory: "Our Story",
    pricing: "Pricing",
    contact: "Contact",
    signIn: "Sign In",
  },
  hu: {
    useCases: "Felhasználási módok",
    ourStory: "Küldetésünk",
    pricing: "Árak",
    contact: "Kapcsolat",
    signIn: "Bejelentkezés",
  },
};

export default function PublicNavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const t = navbarTranslations[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLangDropdown(false);
      }
    };

    if (showLangDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangDropdown]);

  return (
    <>
      <nav className="sticky top-0 bg-white/80 backdrop-blur z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/wheeloffortune.png"
                  alt="Review to Revenue Logo"
                  className="w-8 h-8 object-contain"
                />
                <span
                  className="text-xl text-gray-900"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                >
                  Review to Revenue
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <Link to="/our-story" className="px-4 py-2 text-sm font-medium rounded-lg transition" style={{ color: '#1A237E', backgroundColor: '#E8EAF6' }}>
                {t.ourStory}
              </Link>
              <Link to="/use-cases" className="px-4 py-2 text-sm font-medium rounded-lg transition" style={{ color: '#1A237E', backgroundColor: '#E8EAF6' }}>
                {t.useCases}
              </Link>
              <Link to="/pricing" className="px-4 py-2 text-sm font-medium rounded-lg transition" style={{ color: '#1A237E', backgroundColor: '#E8EAF6' }}>
                {t.pricing}
              </Link>
              <Link to="/contact" className="px-4 py-2 text-sm font-medium rounded-lg transition" style={{ color: '#1A237E', backgroundColor: '#E8EAF6' }}>
                {t.contact}
              </Link>
              <a
                href="https://reviewtorevenue.io/auth?mode=login&redirect=%2Fpricing&src=za"
                className="px-4 py-2 text-sm font-medium rounded-lg transition"
                style={{ backgroundColor: '#1A237E', color: 'white' }}
              >
                {t.signIn}
              </a>
              
              {/* Language Switcher - Desktop Dropdown */}
              <div className="relative ml-2" ref={langDropdownRef}>
                <button
                  className="flex items-center gap-1 text-xl hover:scale-105 transition-transform"
                  title="Nyelv kiválasztása"
                  onClick={() => setShowLangDropdown(prev => !prev)}
                >
                  {language === 'hu' ? '🇭🇺' : '🇬🇧'}
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-100 rounded-t-lg ${
                        language === 'en' ? 'font-semibold text-blue-600' : ''
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('hu');
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-100 rounded-b-lg ${
                        language === 'hu' ? 'font-semibold text-blue-600' : ''
                      }`}
                    >
                      🇭🇺 Magyar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/our-story" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-md transition" style={{ color: '#1A237E', backgroundColor: '#E8EAF6' }}>
                {t.ourStory}
              </Link>
              <Link to="/use-cases" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-md transition" style={{ color: '#1A237E', backgroundColor: '#E8EAF6' }}>
                {t.useCases}
              </Link>
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-md transition" style={{ color: '#1A237E', backgroundColor: '#E8EAF6' }}>
                {t.pricing}
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-md transition" style={{ color: '#1A237E', backgroundColor: '#E8EAF6' }}>
                {t.contact}
              </Link>
              <a
                href="https://reviewtorevenue.io/auth?mode=login&redirect=%2Fpricing&src=za"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-base font-medium rounded-md transition"
                style={{ backgroundColor: '#1A237E', color: 'white' }}
              >
                {t.signIn}
              </a>
              
              {/* Language Switcher - Mobile Dropdown */}
              <div className="flex justify-center py-3 border-t border-gray-100 relative" ref={langDropdownRef}>
                <button
                  className="flex items-center gap-1 text-2xl hover:scale-105 transition-transform"
                  onClick={() => setShowLangDropdown(prev => !prev)}
                >
                  {language === 'hu' ? '🇭🇺' : '🇬🇧'}
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {showLangDropdown && (
                  <div className="absolute top-full mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setShowLangDropdown(false);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-100 rounded-t-lg ${
                        language === 'en' ? 'font-semibold text-blue-600' : ''
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('hu');
                        setShowLangDropdown(false);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-100 rounded-b-lg ${
                        language === 'hu' ? 'font-semibold text-blue-600' : ''
                      }`}
                    >
                      🇭🇺 Magyar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Progress Bar */}
      <ScrollProgressBar />
    </>
  );
}
