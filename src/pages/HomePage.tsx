import { useState } from 'react';
import DashboardBanner from '../components/DashboardBanner';

export default function HomePage() {
  const [showBanner, setShowBanner] = useState(true);
  const profile = { completed_onboarding: false }; // Mock profile object for demonstration

  return (
    <div>
      {showBanner && !profile?.completed_onboarding && (
        <DashboardBanner onDismiss={() => setShowBanner(false)} />
      )}
      {/* Rest of the HomePage content */}
    </div>
  );
}