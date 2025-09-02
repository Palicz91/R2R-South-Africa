import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserPlan } from '../hooks/useUserPlan';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

// Map ZA → Global plan keys
const PLAN_MAP: Record<string, 'solo'|'growth'|'unlimited'> = {
  starter: 'solo',
  growth: 'growth',
  professional: 'unlimited',
};

// Helper to pick specific params
const pickParams = (sp: URLSearchParams, keys: string[]) => {
  const out = new URLSearchParams();
  keys.forEach(k => {
    const v = sp.get(k);
    if (v) out.set(k, v);
  });
  return out.toString();
};

const EXTRA_KEYS = ['ref','utm_source','utm_medium','utm_campaign','utm_term','utm_content'];

const buildIoAuthRedirect = (zaKey: string, isAnnual: boolean, sp?: URLSearchParams) => {
  const mapped = PLAN_MAP[zaKey];
  if (!mapped) return null;

  const planParam = mapped + (isAnnual ? '_yearly' : '');
  const base = new URLSearchParams({ plan: planParam, currency: 'ZAR', src: 'za' });

  // UTM/ref parameter transfer
  if (sp) {
    const extra = pickParams(sp, EXTRA_KEYS);
    if (extra) {
      const extraQs = new URLSearchParams(extra);
      extraQs.forEach((v, k) => base.set(k, v));
    }
  }

  const redirectPath = `/pricing?${base.toString()}`;

  // NEW: coupon directly in /auth query (if exists)
  const authQs = new URLSearchParams({ mode: 'register', redirect: redirectPath });
  const coupon = sp?.get('coupon');
  if (coupon) authQs.set('coupon', coupon);

  // NEW: top-level src=za for AuthPage (mandatory phone)
  authQs.set('src', 'za');

  return `https://reviewtorevenue.io/auth?${authQs.toString()}`;
};

const buildIoAuthRedirectLTD = (sp?: URLSearchParams) => {
  const redirQs = new URLSearchParams({ ltd: '1', currency: 'ZAR', src: 'za' });
  const redirectPath = `/pricing?${redirQs.toString()}#founding-member`;

  const authQs = new URLSearchParams({ mode: 'register', redirect: redirectPath });

  // optional coupon forwarding
  const coupon = sp?.get('coupon');
  if (coupon) authQs.set('coupon', coupon);

  // top-level src for AuthPage
  authQs.set('src', 'za');

  return `https://reviewtorevenue.io/auth?${authQs.toString()}`;
};

export default function PricingPage() {
  const [showAnnual, setShowAnnual] = useState(false);
  const [searchParams] = useSearchParams();
  const { plan: currentPlan, status, trial_ends_at } = useUserPlan();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add ZAR formatter
  const fmtZAR = new Intl.NumberFormat('en-ZA');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error fetching user session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const plans = [
    {
      key: 'starter',
      name: 'Starter',
      price: 750,
      currency: 'R',
      features: [
        '1 business',
        'Up to 3 Wheel of Fortunes',
        'Max. 200 new reviews/month',
        'Downloadable guest email list',
        'Short video tutorials',
        'Access to your own stats'
      ],
      buttonText: 'Get Started'
    },
    {
      key: 'growth',
      name: 'Growth',
      price: 1500,
      currency: 'R',
      features: [
        'Everything in Starter',
        'Up to 5 businesses',
        'Up to 15 Wheel of Fortunes',
        'Max. 1000 new reviews/month',
        'Custom design'
      ],
      highlight: true,
      badge: 'Most popular',
      buttonText: 'I\'ll choose this'
    },
    {
      key: 'professional',
      name: 'Professional (Ideal for Franchise Businesses.)',
      price: null, // Price on request
      features: [
        'Everything in Growth',
        'Unlimited businesses',
        'Unlimited new reviews/month',
        'Unlimited Wheel of Fortunes',
        'Fast support – replies within 2 hours',
        'Feature requests',
        'Personalized onboarding'
      ],
      badge: 'All inclusive',
      buttonText: 'Email greig@reviewtorevenue.co.za for a personalized quote.'
    }
  ];

  const pricingContent = (
    <>
      {/* Optional sticky banner with countdown - full bleed */}
      {/*
      <div className="sticky top-0 z-20 w-full bg-gradient-to-r from-yellow-100 to-yellow-50 border-b border-yellow-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-yellow-900">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            {t.ltd?.barText || 'Founding Member Lifetime is available now. Prices rise next month.'}
          </div>

          <a href="#founding-member" className="text-yellow-700 underline font-medium hover:text-yellow-800 transition">
            {t.ltd?.barCta || 'Grab it'}
          </a>

          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
            {t.ltd?.countdownLabel?.replace('{countdown}', countdown) || `Ends this month in ${countdown}`}
          </span>
        </div>
      </div>
      */}

      {/* Trial Banner */}
      {status === 'trialing' && trial_ends_at && (
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 text-lg font-medium mb-1">
                <Sparkles className="w-5 h-5" />
                {`${Math.ceil((new Date(trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left in your trial`}
              </div>
              <p className="text-sm text-white/90">
                Choose a plan to continue using all features after your trial ends.
              </p>
            </motion.div>
          </div>
        </div>
      )}

      <div className="flex-1 py-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Boost your revenue for the price of a cheap dinner for 2!
            </h1>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your business
            </p>
            
            {/* Free Trial Banner with CTA — Only if user not logged in */}
            {!user && (
              <div className="max-w-3xl mx-auto text-center mt-8 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-2 text-sm font-semibold mb-4"
                >
                  <Sparkles className="w-4 h-4" />
                  30-day money-back guarantee
                </motion.div>
              </div>
            )}

            {/* Toggle */}
            <div className="flex justify-center items-center mt-6 mb-12">
              <span className={`text-sm mr-3 ${!showAnnual ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button 
                onClick={() => setShowAnnual(!showAnnual)} 
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
              >
                <span className="sr-only">Toggle annual pricing</span>
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    showAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ml-3 ${showAnnual ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                Yearly <span className="text-green-500 font-medium">(Save 20%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => {
              const isCurrentPlan = plan.key === currentPlan;
              
              return (
                <motion.div
                  key={plan.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden w-full
                             ${plan.highlight ? 'ring-2 ring-blue-500' : ''}
                             ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                >
                  {plan.key === 'growth' && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                       text-[11px] font-semibold uppercase tracking-wide
                                       bg-[#E6F7FF] text-[#0284C7] border border-[#BAE6FD]
                                       shadow-[0_1px_2px_rgba(2,132,199,0.15)]">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    
                    {plan.price ? (
                      <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.currency}{fmtZAR.format(
                            showAnnual ? Math.round(plan.price * 12 * 0.8) : plan.price
                          )}
                        </span>
                        <span className="text-gray-500 ml-1">
                          {showAnnual ? '/year' : '/month'}
                        </span>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <span className="text-2xl font-bold text-gray-900">Price on request</span>
                      </div>
                    )}

                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.price ? (
                      <button
                        onClick={() => {
                          localStorage.setItem('src', 'za'); // lock ZAR on global site
                          localStorage.setItem('userCountry', 'ZA'); // AuthPage fallback
                          const redirect = buildIoAuthRedirect(plan.key, showAnnual, searchParams);
                          if (redirect) window.location.href = redirect;
                        }}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex justify-center items-center gap-2
                          ${plan.highlight
                            ? 'bg-[#4FC3F7] text-white hover:brightness-110 animate-pulse-cyan-shadow'
                            : 'bg-[#4FC3F7] text-white hover:brightness-110'}`}
                      >
                        {plan.buttonText}
                      </button>
                    ) : (
                      <div className="text-sm text-gray-600 mt-auto text-center">
                        <a 
                          href="mailto:greig@reviewtorevenue.co.za" 
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Email greig@reviewtorevenue.co.za
                        </a>{" "}
                        for a personalized quote.
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Founding Member Lifetime Deal Card */}
            {/*
            <motion.div
              key="founding-member"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              id="founding-member"
              className="relative flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xs
                         ring-4 ring-yellow-400/70 order-first md:order-none h-full"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl"
                   style={{
                     background: 'radial-gradient(120% 80% at 50% -10%, rgba(255,215,0,0.25), transparent 60%)'
                   }} />

              <div className="absolute top-4 right-4 z-[1]">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                                 bg-yellow-100 text-yellow-900 border border-yellow-300"
                      aria-label="Founding Member badge">
                  {t.ltd?.badge || 'Lifetime'}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col relative z-[1]">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {t.ltd?.title || 'Founding Member'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t.ltd?.subtitle || 'Pay once. Use forever.'}
                </p>

                <div className="mb-4">
                  <div className="text-4xl font-black text-gray-900">{fmt.format(FM_BASE_USD)}</div>
                  <div className="text-xs text-gray-500">
                    {t.ltd?.priceNote || 'one-time for 1 business'}
                  </div>
                </div>

                <ul className="space-y-2 text-base text-gray-700 mb-5">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> 
                    {t.ltd?.features?.wheels || 'Up to 3 Wheel of Fortunes'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> 
                    {t.ltd?.features?.reviews || '200 new reviews/month'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> 
                    {t.ltd?.features?.emails || 'Download guest emails'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> 
                    {t.ltd?.features?.tutorials || 'Short video tutorials'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> 
                    {t.ltd?.features?.stats || 'Your own stats dashboard'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" /> 
                    {t.ltd?.features?.updates || 'All future updates'}
                  </li>
                </ul>

                <div className="mb-4">
                  <label htmlFor="extraBiz" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.ltd?.addExtraLabel || 'Add extra business'}
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      id="extraBiz"
                      value={extraBusinesses}
                      onChange={(e) => setExtraBusinesses(Math.max(0, Math.min(FM_ADDON_MAX, Number(e.target.value))))}
                      className="border rounded-lg px-3 py-2 text-gray-800"
                    >
                      {Array.from({ length: FM_ADDON_MAX + 1 }, (_, i) => i).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">
                      {t.ltd?.each?.replace('{price}', fmt.format(FM_ADDON_USD)) || `+${fmt.format(FM_ADDON_USD)} each`}
                    </span>
                  </div>
                  {extraBusinesses > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {fmt.format(FM_ADDON_USD)} × {extraBusinesses} = {fmt.format(FM_ADDON_USD * extraBusinesses)}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-700">
                      {t.ltd?.totalLabel || 'Total'}
                    </span>
                    <span className="text-2xl font-semibold text-gray-900">{fmt.format(fmTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (!user) {
                      window.location.href = `/auth?mode=register&redirect=${encodeURIComponent(window.location.pathname)}`;
                      return;
                    }
                    try { 
                      setLtdLoading(true); 
                      await startFoundingMemberCheckout(); 
                    } finally { 
                      setLtdLoading(false); 
                    }
                  }}
                  disabled={ltdLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-white shadow-[0_8px_20px_rgba(234,179,8,0.35)] mt-auto
                             ${ltdLoading 
                               ? 'opacity-70 cursor-not-allowed bg-gradient-to-r from-yellow-500 to-amber-500' 
                               : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110'}`}
                >
                  {ltdLoading ? 
                    (t.ltd?.redirecting || 'Redirecting…') : 
                    (t.ltd?.cta || 'Get Founding Member Lifetime')
                  }
                </button>
              </div>
            </motion.div>
            */}
          </div>
        </div>
      </div>
    </>
  );

  // Loading state
  if (loading) {
    return user ? (
      <Layout fullBleed>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      </Layout>
    ) : (
      <>
        <PublicNavBar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
        <Footer />
      </>
    );
  }

  return user ? (
    <Layout fullBleed>
      {pricingContent}
    </Layout>
  ) : (
    <>
      <PublicNavBar />
      {pricingContent}
      <Footer />
    </>
  );
}

