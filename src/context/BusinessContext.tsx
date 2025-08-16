import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

interface BusinessContextType {
  selectedBusinessId: string | null;
  setSelectedBusinessId: (id: string | null) => void;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

interface BusinessProviderProps {
  children: ReactNode;
}

export function BusinessProvider({ children }: BusinessProviderProps) {
  const [selectedBusinessId, setSelectedBusinessIdState] = useState<string | null>(() => {
    // Initialize from localStorage on mount
    return localStorage.getItem('selectedBusinessId');
  });

  const setSelectedBusinessId = (id: string | null) => {
    setSelectedBusinessIdState(id);
    // Sync with localStorage
    if (id) {
      localStorage.setItem('selectedBusinessId', id);
    } else {
      localStorage.removeItem('selectedBusinessId');
    }
  };

  // Optional: Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedBusinessId') {
        setSelectedBusinessIdState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('selectedBusinessId');
        setSelectedBusinessIdState(null);
      }
    });

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BusinessContext.Provider value={{ selectedBusinessId, setSelectedBusinessId }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextType {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}