import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  en: {
    title: "Payment Cancelled",
    description: "Your payment was cancelled. No charges were made.",
    returnButton: "Return to Pricing"
  },
  hu: {
    title: "Fizetés megszakítva",
    description: "A fizetés megszakadt. Nem terheltük meg a kártyádat.",
    returnButton: "Vissza az árakhoz"
  }
};

export default function CheckoutCancelPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t.title}
        </h1>

        <p className="text-gray-600 mb-6">
          {t.description}
        </p>

        <Link
          to="/pricing"
          className="inline-block w-full py-3 px-6 text-center bg-[#4FC3F7] text-white rounded-lg
                   font-medium hover:brightness-110 transition-all"
        >
          {t.returnButton}
        </Link>
      </div>
    </div>
  );
}