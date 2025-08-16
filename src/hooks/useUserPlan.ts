import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export type Plan = 'free' | 'solo' | 'growth' | 'unlimited';
export type Status = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';

interface PlanFeatures {
  max_reviews_per_month: number;
  max_wheels: number;
  max_businesses: number;
  has_custom_branding: boolean;
  has_priority_support: boolean;
  has_custom_prizes: boolean;
}

interface Usage {
  reviews: number;
  wheels: number;
  businesses: number;
}

interface UserPlan {
  plan: Plan;
  status: Status;
  features: PlanFeatures;
  trial_ends_at?: string | null;
  usage: Usage;
  loading: boolean;
  error: string | null;
  nextBestPlan: Plan | null;
  daysLeftInTrial?: number;
}

const planUpgradePath: Record<Plan, Plan | null> = {
  'free': 'solo',
  'solo': 'growth',
  'growth': 'unlimited',
  'unlimited': null
};

const defaultFeatures: PlanFeatures = {
  max_reviews_per_month: 50,
  max_wheels: 1,
  max_businesses: 1,
  has_custom_branding: false,
  has_priority_support: false,
  has_custom_prizes: false
};

export function useUserPlan(): UserPlan {
  const [data, setData] = useState<UserPlan>({
    plan: 'free',
    status: 'active',
    features: defaultFeatures,
    usage: {
      reviews: 0,
      wheels: 0,
      businesses: 0
    },
    loading: true,
    error: null,
    nextBestPlan: 'solo'
  });

  useEffect(() => {
    loadUserPlan();
  }, []);

  const loadUserPlan = async () => {
    try {
      // First get the session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      // If no session, return default free plan without error
      if (!session) {
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      // Get user from session
      const user = session.user;
      if (!user) {
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      // Get user's subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('plan, status, trial_end')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subError && subError.code !== 'PGRST116') throw subError;

      // If no subscription found, use default free plan
      const currentPlan = subscription?.plan || 'free';
      const currentStatus = subscription?.status || 'active';

      // Get plan features
      const { data: features, error: featError } = await supabase
        .from('plan_features')
        .select('*')
        .eq('plan', currentPlan)
        .single();

      if (featError) {
        console.warn('Failed to load plan features, using defaults:', featError);
      }

      // Get current usage
      const { data: usage, error: usageError } = await supabase
        .from('usage_metrics')
        .select('review_count, wheel_count, business_count')
        .eq('user_id', user.id)
        .eq('month', new Date().toISOString().slice(0, 7))
        .maybeSingle();

      if (usageError && usageError.code !== 'PGRST116') throw usageError;

      const daysLeftInTrial =
        subscription?.trial_end && currentStatus === 'trialing'
          ? Math.ceil(
              (new Date(subscription.trial_end).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : undefined;

      setData({
        plan: currentPlan,
        status: currentStatus,
        trial_ends_at: subscription?.trial_end || null,
        features: features || defaultFeatures,
        usage: {
          reviews: usage?.review_count || 0,
          wheels: usage?.wheel_count || 0,
          businesses: usage?.business_count || 0
        },
        loading: false,
        error: null,
        nextBestPlan: planUpgradePath[currentPlan as Plan],
        daysLeftInTrial
      });
    } catch (err) {
      console.error('Error loading user plan:', err);
      setData((prev: UserPlan) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load plan data'
      }));
    }
  };

  return data;
}