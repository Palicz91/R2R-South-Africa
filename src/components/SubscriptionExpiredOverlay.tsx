// components/SubscriptionExpiredOverlay.tsx
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const subscriptionOverlayTranslations = {
  en: {
    expired_title: "Your trial/subscription has ended",
    expired_description: "To continue using Review to Revenue and keep access to your data, please upgrade your plan.",
    upgrade_cta: "Upgrade Now"
  },
  hu: {
    expired_title: "Lejárt a próba/előfizetésed",
    expired_description: "Hogy tovább használhasd a Review to Revenue-t és hozzáférj az adataidhoz, upgrade-elj a csomagod!",
    upgrade_cta: "Upgrade-elj most!"
  }
};

export default function SubscriptionExpiredOverlay() {
  const { language } = useLanguage();
  const t = subscriptionOverlayTranslations[language];

  return (
    <div className="absolute inset-0 z-10 bg-white/80 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl text-center shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          {t.expired_title}
        </h2>
        <p className="text-gray-700 mb-6">
          {t.expired_description}
        </p>
        <Link
          to="/pricing"
          className="inline-flex items-center px-6 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition"
        >
          {t.upgrade_cta}
        </Link>
      </div>
    </div>
  );
}
