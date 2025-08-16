import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { getCurrentSubscription } from '../lib/stripe';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  en: {
    title: "Payment Successful!",
    subscriptionText: "You are now subscribed to the {productName}",
    renewalText: "Your subscription will renew on {date}",
    dashboardButton: "Go to Dashboard"
  },
  hu: {
    title: "Sikeres fizetés!",
    subscriptionText: "Mostantól előfizettél a {productName} csomagra",
    renewalText: "Az előfizetésed megújul: {date}",
    dashboardButton: "Ugrás a vezérlőpulthoz"
  }
};

export default function CheckoutSuccessPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const sub = await getCurrentSubscription();
        setSubscription(sub);
      } catch (err) {
        console.error('Error loading subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t.title}
        </h1>

        {subscription && (
          <div className="mb-6">
            <p className="text-gray-600">
              {t.subscriptionText.replace('{productName}', subscription.productName)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {t.renewalText.replace(
                '{date}',
                new Date(subscription.current_period_end * 1000).toLocaleDateString(
                  language === 'hu' ? 'hu-HU' : 'en-US'
                )
              )}
            </p>
          </div>
        )}

        <Link
          to="/dashboard"
          className="inline-block w-full py-3 px-6 text-center bg-[#4FC3F7] text-white rounded-lg
                   font-medium hover:brightness-110 transition-all"
        >
          {t.dashboardButton}
        </Link>
      </div>
    </div>
  );
}