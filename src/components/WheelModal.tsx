import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import WheelOfFortune from './WheelOfFortune';
import { demoPrizes } from '../constants/demoPrize';

export const wheelModalTranslations = {
  en: {
    open_button: 'Spin the Wheel Demo',
    close_button: 'Close'
  },
  hu: {
    open_button: 'Kerék Pörgetés Demo',
    close_button: 'Bezárás'
  }
};

export default function WheelModal() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hu'>('en');

  // Geolocation-based language detection
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        const response = await fetch('https://ipinfo.io/json?token=53cd9f60a714e6');
        const data = await response.json();
        const country = data.country;
        setLanguage(country === 'HU' ? 'hu' : 'en');
      } catch (error) {
        console.error('Geolocation detection failed:', error);
        setLanguage('en'); // Default to English
      }
    };

    detectLanguage();
  }, []);

  const t = wheelModalTranslations[language];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center px-8 py-4 rounded-xl bg-pink-600
                   text-white font-semibold hover:bg-pink-700 transform hover:scale-105 shadow-lg"
      >
        {t.open_button}
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="relative bg-white rounded-2xl p-6 w-[380px]">
            <WheelOfFortune
              prizes={demoPrizes}
              wheelId="demo"          // dummy id
              noGoogleReview={true}   // don't create codes / email
              onComplete={(prize) => {
                // You can add analytics here if needed
                setOpen(false);
              }}
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              title={t.close_button}
            >
              ✕
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}