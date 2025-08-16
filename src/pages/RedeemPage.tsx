import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import DisclaimerText from '../components/DisclaimerText';

interface RewardCode {
  id: string;
  prize: string;
  redeemed: boolean;
  redeemed_at: string | null;
  expires_at: string;
  wheel_project_id: string;
  wheel_projects?: {
    id: string;
    disclaimer?: string;
  };
}

export default function RedeemPage() {
  const { code } = useParams();
  const [reward, setReward] = useState<RewardCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReward() {
      try {
        const { data, error } = await supabase
          .from('reward_codes')
          .select(`
            *,
            wheel_projects (
              id,
              disclaimer
            )
          `)
          .eq('code', code)
          .single();

        if (error) throw error;
        setReward(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reward');
      } finally {
        setLoading(false);
      }
    }

    if (code) {
      fetchReward();
    }
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !reward) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Reward
        </h2>
        <p className="text-gray-600">
          {error || 'Reward not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎁 Your Reward
        </h2>
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-xl font-semibold text-blue-900">
            {reward.prize}
          </p>
        </div>
        <DisclaimerText text={reward.wheel_projects?.disclaimer} className="mt-4" />
      </div>
    </div>
  );
}