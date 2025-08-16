import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { BusinessProvider } from './context/BusinessContext';
import { LanguageProvider } from './context/LanguageContext';
import ToastProvider from './components/ToastProvider';
import { getUserCountry, getLanguageFromCountryCode } from './lib/geoIpService';
import './index.css';

(async () => {
  const country = await getUserCountry();
  const lang = country ? getLanguageFromCountryCode(country) : 'en';
  localStorage.setItem('lang', lang);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <LanguageProvider> {/* ✅ IDE KERÜLJÖN */}
          <BusinessProvider>
            <ToastProvider />
            <App />
          </BusinessProvider>
        </LanguageProvider>
      </BrowserRouter>
    </StrictMode>
  );
})();