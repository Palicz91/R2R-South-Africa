import { useUserPlan } from '../hooks/useUserPlan';

export default function PlanBadge() {
  const { plan, status, trial_ends_at } = useUserPlan();

  if (status === 'trialing' && trial_ends_at) {
    const daysLeft = Math.ceil(
      (new Date(trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        {daysLeft} days left in trial
      </div>
    );
  }

  const badges = {
    free: 'bg-gray-100 text-gray-800',
    solo: 'bg-blue-50 text-blue-700',
    growth: 'bg-green-50 text-green-700',
    unlimited: 'bg-purple-50 text-purple-700'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[plan]}`}>
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}