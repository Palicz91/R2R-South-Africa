import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface OnboardingGateProps {
  children: React.ReactNode;
}

export default function OnboardingGate({ children }: OnboardingGateProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkOnboardingStatus(); // ✅ ez csak ellenőrzi az állapotot
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        navigate('/auth');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_metadata')
        .select('completed_onboarding')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { error: insertError } = await supabase
          .from('user_metadata')
          .insert({ user_id: user.id, completed_onboarding: false });

        if (insertError) throw insertError;

        navigate('/onboarding');
        setLoading(false);
        return;
      }

      if (!data.completed_onboarding) {
        navigate('/onboarding');
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Error checking onboarding status:', err);
      
      // Handle timeout errors specifically
      if (err.message?.includes('timeout') || err.name === 'AbortError') {
        setError('Connection timeout - please check your internet connection and try again');
      } else {
        setError('An error occurred while checking your status. Please try again.');
      }
      
      setLoading(false);
    }
  };

  const handleSkipOnboarding = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        navigate('/auth');
        return;
      }

      // Update the completed_onboarding field to true in user_metadata table
      const { data, error: updateError } = await supabase
        .from('user_metadata')
        .update({ completed_onboarding: true })
        .eq('user_id', user.id)
        .select();

      if (updateError || !data || data.length === 0) {
        // If record doesn't exist yet, create it
        const { error: insertError } = await supabase
          .from('user_metadata')
          .insert({ user_id: user.id, completed_onboarding: true });
        
        if (insertError) throw insertError;
      }

      // Navigate to dashboard after successful update
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error skipping onboarding:', err);
      if (err.message?.includes('timeout') || err.name === 'AbortError') {
        setError('Connection timeout - please check your internet connection and try again');
      } else {
        setError('An error occurred while updating your status. Please try again.');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => {
            setError(null);
            checkOnboardingStatus();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Skip button at the bottom */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSkipOnboarding}
          disabled={loading}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="inline-block mr-2 h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
              Skipping...
            </>
          ) : (
            "Skip for now"
          )}
        </button>
      </div>
    </>
  );
}