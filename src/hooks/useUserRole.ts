import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export type UserRole = 'admin' | 'editor' | 'user' | null;

export function useUserRole(): UserRole {
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('No user found:', userError);
          setRole('user');
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error || !data?.role) {
          console.warn('No role found for user, defaulting to user.');
          setRole('user');
        } else {
          setRole(data.role as UserRole);
        }
      } catch (err) {
        console.error('Failed to load user role:', err);
        setRole('user');
      }
    };

    fetchRole();
  }, []);

  return role;
}
