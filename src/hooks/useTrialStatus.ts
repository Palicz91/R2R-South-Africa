// src/hooks/useTrialStatus.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';   // ⬅️ igazítsd a saját path-hoz
import { differenceInDays } from 'date-fns';

interface TrialStatus {
  daysLeft: number | null;
  isTrialing: boolean;
  completed: boolean;
  loading: boolean;
  error: string | null;
  trialEndDate: Date | null; 
  trialExists: boolean; // Added new field
}

export default function useTrialStatus(): TrialStatus {
  const [daysLeft, setDaysLeft]     = useState<number | null>(null);
  const [isTrialing, setIsTrialing] = useState(false);
  const [completed, setCompleted]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  const [trialExists, setTrialExists] = useState<boolean>(true); // New state for trial existence

  useEffect(() => {
    let isMounted = true;               // biztonság a lefutó fetch-hez

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) {
          if (isMounted) {
            setLoading(false);
            setError('No active session');
          }
          return;
        }

        const { data, error } = await supabase
          .from('free_trials')
          .select('created_at, trial_days, completed')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (isMounted) {
          if (!data) {
            setIsTrialing(false);            // nincs trial sor
            setTrialExists(false);           // nincs rekord → skip overlay
          } else {
            setTrialExists(true);            // van rekord
            const { created_at, trial_days, completed: dbCompleted } = data;
            setCompleted(dbCompleted);
            const days = trial_days ?? 14;
            const endDate = new Date(new Date(created_at).getTime() + days * 86_400_000);
            const left = Math.max(0, differenceInDays(endDate, new Date()));
            
            setTrialEndDate(endDate);
            setDaysLeft(left);
            setIsTrialing(!dbCompleted && left > 0);
            
            // ha még nem completed, de a napok elfogytak → pipáljuk ki
            if (!dbCompleted && left === 0) {
              await supabase
                .from('free_trials')
                .update({ completed: true })
                .eq('user_id', user.id);
              setCompleted(true);
              setIsTrialing(false);
            }
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message ?? 'Unknown error');
          setLoading(false);
        }
      }
    })();

    return () => { isMounted = false; };
  }, []);

  return { daysLeft, isTrialing, completed, loading, error, trialEndDate, trialExists };
}
