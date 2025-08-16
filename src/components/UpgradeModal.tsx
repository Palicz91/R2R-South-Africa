import { X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpgradeModalProps {
  currentPlan: string;
  nextPlan: string;
  onClose: () => void;
}

export default function UpgradeModal({ currentPlan, nextPlan, onClose }: UpgradeModalProps) {
  const planFeatures = {
    free: {
      reviews: 50,
      wheels: 1,
      businesses: 1,
      features: [
        'Basic analytics',
        'Standard support',
        'Basic customization'
      ]
    },
    solo: {
      reviews: 200,
      wheels: 3,
      businesses: 1,
      features: [
        'Advanced analytics',
        'Priority email support',
        'Custom branding',
        'QR code customization'
      ]
    },
    growth: {
      reviews: 1000,
      wheels: 15,
      businesses: 3,
      features: [
        'Everything in Solo',
        'Multiple businesses',
        'Custom prize weighting',
        'Priority support'
      ]
    },
    unlimited: {
      reviews: 'Unlimited',
      wheels: 'Unlimited',
      businesses: 'Unlimited',
      features: [
        'Everything in Growth',
        'Unlimited usage',
        'Custom integrations',
        'Dedicated support'
      ]
    }
  };

  const current = planFeatures[currentPlan as keyof typeof planFeatures];
  const next = planFeatures[nextPlan as keyof typeof planFeatures];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full transform transition-all animate-modal-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Upgrade to {nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Plan */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">{current.reviews}</span> reviews/month
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">{current.wheels}</span> active wheels
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">{current.businesses}</span> business{current.businesses !== 1 && 'es'}
                </li>
                {current.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Plan */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Next: {nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1)}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-blue-700">
                  <span className="font-medium">{next.reviews}</span> reviews/month
                </li>
                <li className="flex items-center gap-2 text-blue-700">
                  <span className="font-medium">{next.wheels}</span> active wheels
                </li>
                <li className="flex items-center gap-2 text-blue-700">
                  <span className="font-medium">{next.businesses}</span> business{next.businesses !== 1 && 'es'}
                </li>
                {next.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-700">
                    <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <Link
            to="/pricing"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upgrade to {nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1)}
          </Link>
        </div>
      </div>
    </div>
  );
}