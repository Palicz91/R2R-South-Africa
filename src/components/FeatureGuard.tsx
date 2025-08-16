import { ReactNode, useState } from 'react';
import { Lock } from 'lucide-react';
import { useUserPlan } from '../hooks/useUserPlan';
import UpgradeModal from './UpgradeModal';

interface FeatureGuardProps {
  children: ReactNode;
  feature?: 'custom_branding' | 'priority_support' | 'custom_prizes';
  limit?: 'max_reviews' | 'max_wheels' | 'max_businesses';
  showUpgradeCTA?: boolean;
}

export default function FeatureGuard({ 
  children, 
  feature, 
  limit,
  showUpgradeCTA = true 
}: FeatureGuardProps) {
  const { features, usage, plan, nextBestPlan, loading, error } = useUserPlan();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (loading || error) return null;

  const isFeatureAllowed = feature ? 
    features[`has_${feature}` as keyof typeof features] : true;

  const isWithinLimits = limit ? (() => {
    const limitKey = limit === 'max_reviews' ? 'max_reviews_per_month' : limit;
    const usageKey = limit === 'max_reviews' ? 'reviews' : 
                     limit === 'max_wheels' ? 'wheels' : 'businesses';
    
    const featureValue = features[limitKey as keyof typeof features];
    return usage[usageKey] < (typeof featureValue === 'number' ? featureValue : 0);
  })() : true;

  if (!isFeatureAllowed || !isWithinLimits) {
    if (!showUpgradeCTA) return null;

    return (
      <>
        <div className="relative group">
          <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                {feature ? 'This feature requires an upgrade' : 'You\'ve reached your plan limit'}
              </p>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
        </div>

        {showUpgradeModal && nextBestPlan && (
          <UpgradeModal
            currentPlan={plan}
            nextPlan={nextBestPlan}
            onClose={() => setShowUpgradeModal(false)}
          />
        )}
      </>
    );
  }

  return children;
}