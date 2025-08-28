import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing Supabase environment variables');
}

// Helper function to get the correct redirect URL
export const getRedirectTo = (): string => {
  const domain = window?.location?.origin || '';
  return `${domain}/auth/callback`;
};

// If no env variables, provide "no-op" client so app doesn't crash:
export const supabase = (url && key)
  ? createClient(url, key, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: localStorage,
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-web',
        },
        // Add fetch options to handle timeouts and retries
        fetch: (url, options) => {
          return fetch(url, {
            ...options,
            // Increase timeout to 60 seconds for slower connections
            signal: AbortSignal.timeout(60000),
          }).catch(async (error) => {
            if (error.name === 'AbortError') {
              throw new Error('Connection timeout - please check your internet connection and try again');
            }
            throw error;
          });
        },
      },
    })
  : {
      auth: { 
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: new Error('Supabase not configured') }),
        update: () => ({ data: null, error: new Error('Supabase not configured') }),
        delete: () => ({ data: null, error: new Error('Supabase not configured') }),
      }),
    } as any;

// Helper function to check if user is authenticated
export const checkAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session) throw new Error('Not authenticated');
    return session.user;
  } catch (error) {
    console.error('Auth check failed:', error);
    throw error;
  }
};