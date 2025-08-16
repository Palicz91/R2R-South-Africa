import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { supabase } from './lib/supabaseClient';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AuthPage from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';
import BusinessProfilePage from './pages/BusinessProfilePage';
import CreateWheelPage from './pages/CreateWheelPage';
import ProjectsOverviewPage from './pages/ProjectsOverviewPage';
import WheelPreviewPage from './pages/WheelPreviewPage';
import QRCodePage from './pages/QRCodePage';
import ReviewLandingPage from './pages/ReviewLandingPage';
import QrCodeRedeem from './pages/QrCodeRedeem';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import PricingPage from './pages/PricingPage';
import LandingPage from './pages/LandingPage';
import LandingPageNew from './pages/LandingPageNew';
import PlaybookPage from './pages/PlaybookPage';
import PlaybookArticlePage from './pages/PlaybookArticlePage';
import ContactPage from './pages/ContactPage';
import OurStoryPage from './pages/OurStoryPage';
import UseCasesPage from './pages/UseCasesPage';
import RedeemPage from './pages/RedeemPage';
import OnboardingWizard from './pages/OnboardingWizard';
import OnboardingGate from './components/OnboardingGate';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import AddBusinessPage from './pages/AddBusinessPage';
import RestaurantPage from './pages/RestaurantPage';
import RestaurantQRStrategyPage from './pages/RestaurantQRStrategyPage';
import BarbershopPage from './pages/BarbershopPage';
import BarbershopQRStrategyPage from './pages/BarbershopQRStrategyPage';
import HotelPage from './pages/HotelPage';
import HotelQRStrategyPage from './pages/HotelQRStrategyPage';
import CafePage from './pages/CafePage';
import SalonPage from './pages/SalonPage';
import RetailPage from './pages/RetailPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import AffiliatePage from './pages/AffiliatePage';
import RetailQRStrategyPage from './pages/RetailQRStrategyPage';
import QRCafeBestPracticesPage from './pages/QRCafeBestPracticesPage';
import SalonQRStrategyPage from './pages/SalonQRStrategyPage';
import RoiProofPage from './pages/RoiProofPage'; // ÚJ
import GlobalProgress from './components/GlobalProgress';
import ChallengeLandingPage1 from './pages/landings/ChallengeLandingPage1';
import ChallengeLandingPage2 from './pages/landings/ChallengeLandingPage2';
import ChallengeLandingPage3 from './pages/landings/ChallengeLandingPage3';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ConfirmEmail from './pages/ConfirmEmail'; 
import './styles/typography.css';

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://groot.mailerlite.com/js/w/webforms.min.js?v176e10baa5e7ed80d35ae235be3d5024";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) localStorage.setItem('affiliate_ref', ref);
  }, []);

  return (
    <HelmetProvider>
      <LanguageProvider>
        {/* Global Progress Bar */}
        <GlobalProgress />
        
        {/* Add ScrollToTop before Routes to ensure it runs on every route change */}
        <ScrollToTop />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPageNew />} />
          <Route path="/landingpagenew" element={<LandingPage />} />
          <Route path="/challenge-hospitality" element={<ChallengeLandingPage1 />} />
          <Route path="/challenge-host" element={<ChallengeLandingPage2 />} />
          <Route path="/challenge-beauty" element={<ChallengeLandingPage3 />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/use-cases" element={<UseCasesPage />} />
          <Route path="/use-cases/restaurants" element={<RestaurantPage />} />
          <Route path="/use-cases/restaurants/qr-strategy" element={<RestaurantQRStrategyPage />} />
          <Route path="/use-cases/retail/qr-strategy" element={<RetailQRStrategyPage />} />
          <Route path="/use-cases/cafes/qr-best-practices" element={<QRCafeBestPracticesPage />} />
          <Route path="/use-cases/barbershops" element={<BarbershopPage />} />
          <Route path="/use-cases/barbershops/qr-strategy" element={<BarbershopQRStrategyPage />} />
          <Route path="/use-cases/hotels" element={<HotelPage />} />
          <Route path="/use-cases/hotels/qr-strategy" element={<HotelQRStrategyPage />} />
          <Route path="/use-cases/cafes" element={<CafePage />} />
          <Route path="/use-cases/salons" element={<SalonPage />} />
          <Route path="/use-cases/salons/qr-strategy" element={<SalonQRStrategyPage />} />
          <Route path="/use-cases/retail" element={<RetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/proof" element={<RoiProofPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/playbook" element={<PlaybookPage />} />
          <Route path="/playbook/:slug" element={<PlaybookArticlePage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/onboarding" element={<OnboardingWizard />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <OnboardingGate>
                <Layout>
                  <HomePage />
                </Layout>
              </OnboardingGate>
            }
          />
          <Route
            path="/profile"
            element={
              <OnboardingGate>
                <Layout>
                  <BusinessProfilePage />
                </Layout>
              </OnboardingGate>
            }
          />
          <Route
            path="/wheels"
            element={
              <OnboardingGate>
                <Layout>
                  <ProjectsOverviewPage />
                </Layout>
              </OnboardingGate>
            }
          />
          <Route
            path="/wheels/create"
            element={
              <OnboardingGate>
                <Layout>
                  <CreateWheelPage />
                </Layout>
              </OnboardingGate>
            }
          />
          <Route
            path="/wheels/:id"
            element={
              <OnboardingGate>
                <Layout>
                  <WheelPreviewPage />
                </Layout>
              </OnboardingGate>
            }
          />
          <Route
            path="/wheels/:id/edit"
            element={
              <OnboardingGate>
                <Layout>
                  <CreateWheelPage />
                </Layout>
              </OnboardingGate>
            }
          />
          <Route
            path="/business/add"
            element={
              <OnboardingGate>
                <Layout>
                  <AddBusinessPage />
                </Layout>
              </OnboardingGate>
            }
          />
          <Route
            path="/affiliate"
            element={
              <OnboardingGate>
                <Layout>
                  <AffiliatePage />
                </Layout>
              </OnboardingGate>
            }
          />

          {/* Public Feature Routes */}
          <Route path="/wheels/:id/qr" element={<QRCodePage />} />
          <Route path="/redeem/:code" element={<RedeemPage />} />
          <Route path="/qr/:id" element={<QrCodeRedeem />} />     
          <Route path="/review/:wheelId" element={<ReviewLandingPage />} />
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;