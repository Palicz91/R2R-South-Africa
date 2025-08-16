import { useEffect } from 'react';

export function useOptiMonk() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const allowedPaths = ['/', '/pricing'];
    const currentPath = window.location.pathname;

    if (!allowedPaths.includes(currentPath)) return;

    const timeout = setTimeout(() => {
      const existing = document.getElementById('optimonk-script');
      if (existing) return;

      const script = document.createElement('script');
      script.src = 'https://onsite.optimonk.com/script.js?account=254569';
      script.async = true;
      script.id = 'optimonk-script';
      document.body.appendChild(script);
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.getElementById('optimonk-script')?.remove();
    };
  }, []);
}
