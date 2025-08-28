import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ScrollProgressBar from './ScrollProgressBar';

const navbarTranslations = {
  en: {
    home: "Home",
    useCases: "Use Cases",
    ourStory: "Our Story",
    pricing: "Pricing",
    contact: "Contact",
    signIn: "Sign In",
  },
};

export default function PublicNavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = navbarTranslations.en;
  const authUrl = "https://reviewtorevenue.io/auth?mode=login&redirect=%2Fpricing&src=za";

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
              <Link to="/" className="px-4 py-2 text-sm font-medium rounded-lg transition" style={{ color: '#1A237E', backgroundColor: '#E8EAF6' }}>
                {t.home}
              </Link>
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
                href={authUrl}
                className="px-4 py-2 text-sm font-medium rounded-lg transition"
                style={{ backgroundColor: '#1A237E', color: 'white' }}
              >
                {t.signIn}
              </a>
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
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-base font-medium rounded-md transition" style={{ color: '#1A237E', backgroundColor: '#E8EAF6' }}>
                {t.home}
              </Link>
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
                href={authUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-base font-medium rounded-md transition"
                style={{ backgroundColor: '#1A237E', color: 'white' }}
              >
                {t.signIn}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Progress Bar */}
      <ScrollProgressBar />
    </>
  );
}
