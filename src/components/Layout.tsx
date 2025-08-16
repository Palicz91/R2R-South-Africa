import { ReactNode, useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Link, useLocation } from 'react-router-dom';
import { Home, UserCircle, LogOut, Boxes, DollarSign, Book, CreditCard, ChevronDown } from 'lucide-react';
import Footer from './Footer';
import BusinessSelector from './BusinessSelector';
import TrialCountdownBanner from './TrialCountdownBanner';
import useTrialStatus from '@/hooks/useTrialStatus';
import SubscriptionExpiredOverlay from './SubscriptionExpiredOverlay';
import { useLanguage } from '@/context/LanguageContext';

interface LayoutProps {
  children: ReactNode;
  fullBleed?: boolean;        // ➕ új, alapérték: false
}

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
}

export const translations = {
  en: {
    nav_home: 'Home',
    nav_profile: 'Profile',
    nav_projects: 'My Projects',
    nav_playbook: 'Playbook',
    nav_pricing: 'Pricing',
    nav_billing: 'Subscription',
    nav_story: 'Our Story',
    logout: 'Logout',
    app_name: 'Review to Revenue',
    billing_error_no_subscription: 'You do not have an active subscription. Please select a plan to continue.',
    go_to_pricing: 'View Plans',
  },
  hu: {
    nav_home: 'Kezdőlap',
    nav_profile: 'Profilom',
    nav_projects: 'Projektjeim',
    nav_playbook: 'Tudásbázis',
    nav_pricing: 'Előfizetés',
    nav_billing: 'Számlázás',
    nav_story: 'Küldetésünk',
    logout: 'Kijelentkezés',
    app_name: 'Review to Revenue',
    billing_error_no_subscription: 'Nincs aktív előfizetésed. Kérlek, válassz egy csomagot a folytatáshoz.',
    go_to_pricing: 'Csomagok',
  },
};

export type Language = 'en' | 'hu';

export const getCurrentTranslation = (language: Language) => translations[language];

export default function Layout({ children, fullBleed = false }: LayoutProps) {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const t = getCurrentTranslation(language);
  
  // 1. Add state to track if the user is an admin
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // Add subscription status state
  const [isSubscriptionActive, setIsSubscriptionActive] = useState<boolean>(false);
  
  // Language dropdown state and ref
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const { daysLeft, isTrialing, loading: trialLoading, trialEndDate, trialExists } = useTrialStatus();

  const navItems: NavItem[] = useMemo(() => [
    { to: '/dashboard', label: t.nav_home, icon: Home },
    { to: '/profile', label: t.nav_profile, icon: UserCircle },
    { to: '/wheels', label: t.nav_projects, icon: Boxes },
   // { to: '/playbook', label: t.nav_playbook, icon: Book },
    { to: '/pricing', label: t.nav_pricing, icon: DollarSign },
    { to: '#', label: t.nav_billing, icon: CreditCard }, // 👈 ide jön majd a kattintható gomb
    { to: '/our-story', label: t.nav_story, icon: Book },
  ], [t]);

  // Handle click outside for language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLangDropdown(false);
      }
    };

    if (showLangDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangDropdown]);

  // 2. Check if the user is an admin and subscription status in the useEffect hook
  useEffect(() => {
    const checkUserRole = async () => {
      const { data } = await supabase.auth.getUser();
      if (data && data.user) {
        const userRole = data.user.user_metadata?.role;
        if (userRole === 'admin') {
          setIsAdmin(true);
        }
      }
    };

    const checkSubscriptionStatus = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('stripe_subscriptions')
        .select('status')
        .eq('user_id', userId) // or customer_id if that's how it's stored
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking subscription status:', error);
      } else {
        console.log('[Subscription check] Status:', data?.status);
        setIsSubscriptionActive(data?.status === 'active');
      }
    };

    checkUserRole();
    checkSubscriptionStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleBillingRedirect = async () => {
    if (!isSubscriptionActive) {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.top = '0';
      wrapper.style.left = '0';
      wrapper.style.width = '100vw';
      wrapper.style.height = '100vh';
      wrapper.style.background = 'rgba(0, 0, 0, 0.4)';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.zIndex = '9999';

      const dialog = document.createElement('div');
      dialog.style.background = 'white';
      dialog.style.padding = '2rem';
      dialog.style.borderRadius = '12px';
      dialog.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
      dialog.style.textAlign = 'center';
      dialog.style.maxWidth = '400px';
      dialog.style.width = '90%';
      dialog.style.position = 'relative';
      dialog.style.fontFamily = 'sans-serif';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '10px';
      closeBtn.style.right = '10px';
      closeBtn.style.background = 'transparent';
      closeBtn.style.border = 'none';
      closeBtn.style.fontSize = '1.2rem';
      closeBtn.style.cursor = 'pointer';
      closeBtn.onclick = () => document.body.removeChild(wrapper);

      const msg = document.createElement('p');
      msg.textContent = t.billing_error_no_subscription;
      msg.style.marginBottom = '1.5rem';

      const btn = document.createElement('button');
      btn.textContent = t.go_to_pricing;
      btn.style.backgroundColor = '#4FC3F7';
      btn.style.color = 'white';
      btn.style.padding = '0.5rem 1.25rem';
      btn.style.fontWeight = 'bold';
      btn.style.border = 'none';
      btn.style.borderRadius = '8px';
      btn.style.cursor = 'pointer';

      btn.onclick = () => {
        window.location.href = '/pricing';
        document.body.removeChild(wrapper);
      };

      dialog.appendChild(closeBtn);
      dialog.appendChild(msg);
      dialog.appendChild(btn);
      wrapper.appendChild(dialog);
      document.body.appendChild(wrapper);

      return;
    }

    const { data: session } = await supabase.auth.getSession();
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.session?.access_token}`,
      },
    });

    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
    } else {
      alert('Hiba történt a számlázási oldal betöltésekor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Nav Links */}
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <img
                    src="https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/wheeloffortune.png"
                    alt="Review to Revenue Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <span
                    className="text-xl text-gray-900"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    {t.app_name}
                  </span>
                </Link>
              </div>

              {/* Nav Links */}
              <div
                className={`hidden sm:ml-6 sm:flex ${
                  language === 'hu'
                    ? 'sm:space-x-3 sm:mr-2'   // 🔹 szűkebb gomb‑köz + 0.5 rem extra jobb oldali margó
                    : 'sm:space-x-4'
                }`}
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;

                  // handle Billing as a special button
                  if (item.label === t.nav_billing) {
                    return (
                      <button
                        key={item.label}
                        onClick={handleBillingRedirect}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                          text-gray-600 hover:text-[#1A237E] hover:bg-[#E8EAF6]`}
                      >
                        <CreditCard className="w-5 h-5 mr-1.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                                transition-colors ${
                                  isActive
                                    ? 'text-[#1A237E] bg-[#E8EAF6]'
                                    : 'text-gray-600 hover:text-[#1A237E] hover:bg-[#E8EAF6]'
                                }`}
                    >
                      <Icon className="w-5 h-5 mr-1.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Business Selector, Language Switcher and Logout Button */}
            <div className="flex items-center gap-4">
              {/* 3. Conditionally render the BusinessSelector based on the user's role (isAdmin) */}
              {isAdmin && (  // Only show BusinessSelector if the user is an admin
                <div className="hidden sm:block">
                  <BusinessSelector />
                </div>
              )}

              {/* Language Switcher */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  className="flex items-center gap-1 text-xl hover:scale-105 transition-transform"
                  title="Select language"
                  onClick={() => setShowLangDropdown(prev => !prev)}
                >
                  {language === 'hu' ? '🇭🇺' : '🇬🇧'}
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-[100]">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-100 rounded-t-lg ${
                        language === 'en' ? 'font-semibold text-blue-600' : ''
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('hu');
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-100 rounded-b-lg ${
                        language === 'hu' ? 'font-semibold text-blue-600' : ''
                      }`}
                    >
                      🇭🇺 Magyar
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                style={{ color: '#1A237E' }}
              >
                <LogOut className="w-5 h-5 mr-1.5" />
                {t.logout}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden border-t border-gray-200">
          <div className="grid grid-cols-5 divide-x divide-gray-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              // handle Billing as a special button in mobile view
              if (item.label === t.nav_billing) {
                return (
                  <button
                    key={item.label}
                    onClick={handleBillingRedirect}
                    className={`inline-flex flex-col items-center justify-center py-3
                              text-xs font-medium transition-colors
                              text-gray-600 hover:text-[#1A237E] hover:bg-[#E8EAF6]`}
                  >
                    <CreditCard className="w-5 h-5 mb-1" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex flex-col items-center justify-center py-3
                            text-xs font-medium transition-colors ${
                              isActive
                                ? 'text-[#1A237E] bg-[#E8EAF6]'
                                : 'text-gray-600 hover:text-[#1A237E] hover:bg-[#E8EAF6]'
                            }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Banner directly under navbar */}
      {!trialLoading && isTrialing && !isSubscriptionActive && daysLeft !== null && daysLeft <= 30 && (
        <TrialCountdownBanner daysLeft={daysLeft} trialEndDate={trialEndDate} />
      )}

      {/* Mobile BusinessSelector (only visible on small screens) */}
      {isAdmin && (
        <div className="sm:hidden bg-white shadow-sm border-t border-gray-100">
          <div className="px-4 py-2">
            <BusinessSelector />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        {!trialLoading && trialExists && !isTrialing && !isSubscriptionActive && location.pathname !== '/pricing' && (
          <SubscriptionExpiredOverlay />
        )}
        <div
          className={
            fullBleed
              ? ''                                   // nincs keret, fut ki széléig
              : 'max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'
          }
        >
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
