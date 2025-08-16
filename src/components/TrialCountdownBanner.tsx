import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface TrialCountdownBannerProps {
  daysLeft: number;
  trialEndDate: Date | null;
}

const countdownTranslations = {
  en: {
    days_left: (days: number) =>
      `Your trial ends in ${days} day${days !== 1 ? 's' : ''} — don't lose access to your data!`,
    countdown: (timeLeft: string) =>
      `⏰ Your trial ends in ${timeLeft} — upgrade now to keep everything!`,
    upgrade: 'Upgrade now',
  },
  hu: {
    days_left: (days: number) =>
      `A próbaidőszakod ${days} nap múlva lejár — Siess, ha nem akarod veszni hagyni az eredményeid!`,
    countdown: (timeLeft: string) =>
      `⏰ A próbaidőszakod ${timeLeft} múlva lejár — frissíts most, hogy ne vesszenek el az eredményeid`,
    upgrade: 'Frissíts most',
  },
};

export default function TrialCountdownBanner({ daysLeft, trialEndDate }: TrialCountdownBannerProps) {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState('');
  const t = countdownTranslations[language];

  useEffect(() => {
    if (daysLeft > 1 || !trialEndDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = trialEndDate.getTime();
      const distance = end - now;

      if (distance <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [daysLeft, trialEndDate]);

  const message =
    daysLeft > 1 ? t.days_left(daysLeft) : t.countdown(timeLeft);

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto relative flex items-center justify-end">
        <p className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-center whitespace-nowrap max-w-[calc(100%-160px)] truncate">
          {message}
        </p>

        <Link
          to="/pricing"
          className="inline-flex items-center px-4 py-1.5 bg-white text-pink-600 rounded-lg text-sm font-medium 
                     hover:bg-pink-50 transition-colors"
        >
          {t.upgrade}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
