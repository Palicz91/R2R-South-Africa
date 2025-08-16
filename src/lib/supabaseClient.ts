import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Helper function to get the correct redirect URL
export const getRedirectTo = (): string => {
  const domain = window?.location?.origin || '';
  return `${domain}/auth/callback`;
};

// Initialize Supabase client with retries and timeout
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
});

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