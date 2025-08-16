import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import PublicNavBar from '../components/PublicNavBar';

const translations = {
  en: {
    title: "Email Confirmation",
    description: "Please wait while we confirm your email address.",
    verifying: "Verifying your email...",
    successMessage: "Your email has been successfully confirmed!",
    noTokenMessage: "No confirmation token found.",
    footer: "© 2025 Review to Revenue. All rights reserved."
  },
  hu: {
    title: "Email megerősítés",
    description: "Kérjük várjon, amíg megerősítjük az email címét.",
    verifying: "Email cím ellenőrzése...",
    successMessage: "Az email címe sikeresen megerősítve!",
    noTokenMessage: "Nincs megerősítő token.",
    footer: "© 2025 Review to Revenue. Minden jog fenntartva."
  }
};

type Language = 'en' | 'hu';

const ConfirmEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Try to detect user's location/language
    const detectLanguage = async () => {
      try {
        // First try browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('hu')) {
          setLanguage('hu');
          return;
        }

        // Then try geolocation API if available
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Use a geolocation service to determine country
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
                );
                const data = await response.json();
                
                if (data.countryCode === 'HU') {
                  setLanguage('hu');
                }
              } catch (error) {
                console.log('Geolocation service failed, using fallback');
              }
            },
            (error) => {
              console.log('Geolocation failed, using fallback');
            }
          );
        }
      } catch (error) {
        console.log('Language detection failed, using English fallback');
      }
    };

    detectLanguage();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    const confirmEmail = async () => {
      if (token) {
        const { error } = await supabase.auth.api.confirmEmail(token);
        if (error) {
          console.error('Error confirming email:', error.message);
          return;
        }

        // Sikeres megerősítés után átirányítás a /dashboard-ra
        alert(t.successMessage);
        navigate('/dashboard'); // átirányítás
      } else {
        alert(t.noTokenMessage);
      }
    };

    confirmEmail();
  }, [location.search, navigate, language]);

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* NavBar - Ha van, használhatjuk */}
      <div className="bg-white shadow-md">
        {/* Navbar content here */}
      </div>
      
      <div className="max-w-2xl mx-auto text-center py-24 px-6">
        <h2 className="text-3xl font-semibold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {t.title}
        </h2>
        <p className="mt-4 text-lg text-gray-600" style={{ fontFamily: 'Alexandria, sans-serif' }}>
          {t.description}
        </p>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl" />
        </div>

        {/* Loader or Spinner */}
        <div className="mt-8">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t.verifying}
          </p>
        </div>
      </div>

      <footer className="mt-auto py-4 bg-white text-center">
        <p className="text-sm text-gray-500">{t.footer}</p>
      </footer>
    </div>
  );
};

export default ConfirmEmail;
