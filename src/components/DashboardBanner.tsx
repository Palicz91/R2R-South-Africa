import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useUserPlan } from '../hooks/useUserPlan';
import TrialCountdownBanner from './TrialCountdownBanner';

interface DashboardBannerProps {
  onDismiss: () => void;
}

export default function DashboardBanner({ onDismiss }: DashboardBannerProps) {
  const { status, trial_ends_at } = useUserPlan();
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(true);

  // Calculate days left in trial
  const daysLeftInTrial = trial_ends_at 
    ? Math.ceil((new Date(trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Show trial countdown if applicable
  if (status === 'trialing' && daysLeftInTrial !== null && daysLeftInTrial <= 3) {
    return <TrialCountdownBanner daysLeft={daysLeftInTrial} />;
  }

  // Show onboarding banner if not dismissed
  if (showOnboardingBanner) {
    return (
      <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-purple-700">
              We need a few more details to personalize your experience.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/onboarding"
              className="text-sm font-medium text-purple-600 hover:text-purple-500"
            >
              Complete now
            </Link>
            <button
              onClick={() => {
                setShowOnboardingBanner(false);
                onDismiss();
              }}
              className="text-purple-400 hover:text-purple-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}