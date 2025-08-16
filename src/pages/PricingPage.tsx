import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserPlan } from '../hooks/useUserPlan';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';
import Layout from '../components/Layout';
import { createCheckoutSession } from '../lib/stripe';
import { products } from '../stripe-config';
import { supabase } from '../lib/supabaseClient';
import useTranslation from '../hooks/useTranslation';

export default function PricingPage() {
  const [showAnnual, setShowAnnual] = useState(false);
  const [searchParams] = useSearchParams();
  const { plan: currentPlan, status, trial_ends_at } = useUserPlan();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlanKey, setLoadingPlanKey] = useState<string | null>(null);
  const { t } = useTranslation();

  // LTD visibility control
  const showLTD = false; // most nincs kint az LTD

  // Founding Member constants and state
  const FM_BASE_USD = 149.99;    // current one-time base price
  const FM_ADDON_USD = 99.99;   // one-time fee per extra business
  const FM_ADDON_MAX = 10;    // selectable upper limit
  const [extraBusinesses, setExtraBusinesses] = useState(0);
  const [ltdLoading, setLtdLoading] = useState(false);

  // End-of-month countdown
  const [countdown, setCountdown] = useState('');

  // Formatting and calculations
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  const fmTotal = FM_BASE_USD + extraBusinesses * FM_ADDON_USD;

  // End-of-month countdown effect
  useEffect(() => {
    const deadline = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0, 23, 59, 59); // end of month
    const id = setInterval(() => {
      const ms = deadline.getTime() - Date.now();
      if (ms <= 0) return setCountdown('0d 0h 0m 0s');
      const s = Math.floor(ms/1000), d = Math.floor(s/86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60), sec = s%60;
      setCountdown(`${d}d ${h}h ${m}m ${sec}s`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Founding Member checkout function
  async function startFoundingMemberCheckout() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const res = await fetch('/functions/v1/founding-member-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          addonQty: extraBusinesses,
          customerEmail: session?.user?.email || undefined
        })
      });

      if (!res.ok) throw new Error('Checkout init failed');
      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert('Something went wrong starting checkout.');
    }
  }

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

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (!planParam) return;

    const runCheckout = async () => {
      let tries = 0;
      let session = null;

      while (tries < 5 && !session) {
        const result = await supabase.auth.getSession();
        session = result.data.session;
        if (!session) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          tries++;
        }
      }

      if (!session) return;

      const isAnnual = planParam.includes('_yearly');
      const planName = isAnnual ? planParam.replace('_yearly', '') : planParam;
      const priceId = getStripePriceId(planName, isAnnual);
      if (!priceId) return;

      try {
        await createCheckoutSession(priceId, 'subscription');
      } catch (err) {
        console.error("Auto-checkout failed", err);
      }
    };

    runCheckout();
  }, [searchParams]);

  const calculatePrice = (price: number) => {
    return showAnnual ? (price * 12 * 0.8).toFixed(2) : price.toFixed(2);
  };

  const getStripePriceId = (planKey: string, isAnnual: boolean) => {
    // Use the plan key directly rather than the name
    const key = planKey.toLowerCase() + (isAnnual ? '_yearly' : '');
    const product = products[key];
    return product?.priceId || null;
  };

  // Using dynamic data from translations
  const plans = [
    {
      key: 'solo',
      name: 'Solo',
      price: 29.99,
      features: [
        '1 business',
        'Up to 3 Active Wheel of Fortunes',
        'Up to 200 reviews/month',
        'QR code customization',
        'Review page customization',
        'Priority email support',
        'Video Onboarding'
      ],
    },
    {
      key: 'growth',
      name: 'Growth',
      price: 49.99,
      features: [
        'Everything in Solo',
        'Up to 3 businesses',
        'Up to 15 Active Wheels',
        'Up to 1000 reviews/month',
        'Custom branding',
        'Custom prize weighting',
      ],
      highlight: true,
      badge: 'Best Value',
    },
    {
      key: 'unlimited',
      name: 'Unlimited',
      price: 129.99,
      features: [
        'Everything in Growth',
        'Unlimited businesses & reviews',
        'Unlimited Wheel of Fortunes',
        'Priority support (chat + email)',
        'Feature-request fast-lane',
        'Personalized Onboarding',
      ],
      badge: 'Full Access',
    },
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
                {t.daysLeftInTrial?.replace('{days}', Math.ceil((new Date(trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)).toString()) || 
                `${Math.ceil((new Date(trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left in your trial`}
              </div>
              <p className="text-sm text-white/90">
                {t.choosePlanAfterTrial || "Choose a plan to continue using all features after your trial ends."}
              </p>
            </motion.div>
          </div>
        </div>
      )}

      <div className="flex-1 py-12">
        {/* Header csak középre zárva */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.pricingTeaserTitle || "Simple, transparent pricing"}
            </h1>
            <p className="text-xl text-gray-600">
              {t.choosePerfectPlan || "Choose the perfect plan for your business"}
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
                  {t.freeTrialBanner || "Start your 14-day free trial — no credit card required!"}
                </motion.div>

                <p className="text-gray-600 text-sm mb-4">
                  {t.noCreditCardRequired || "Dive in and explore all the features — completely risk-free."}
                </p>

                <Link
                  to="/auth?mode=register"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-all animate-pulse-green"
                >
                  {t.startFreeTrial || "Start Free Trial"}
                </Link>
              </div>
            )}

            {/* Moved Toggle here */}
            <div className="flex justify-center items-center mt-6 mb-12">
              <span className={`text-sm mr-3 ${!showAnnual ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                {t.monthly || "Monthly"}
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
                {t.yearly || "Yearly"} <span className="text-green-500 font-medium">({t.save20Percent || "Save 20%"})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing grid középre zárva */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${showLTD ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8 mb-16`}>
            {plans.map((plan) => {
              // Use plan.key instead of plan.name.toLowerCase() for more robust comparison
              const isCurrentPlan = plan.key === currentPlan;
              // Try to get translation if available
              const planTranslation = t.pricingPlans?.[plan.key];
              
              return (
                <motion.div
                  key={plan.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden w-full
                             ${plan.highlight ? 'ring-2 ring-blue-500' : ''}
                             ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                >
                  {(plan.badge || isCurrentPlan) && (
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                      ${isCurrentPlan 
                                        ? 'bg-green-100 text-green-800'
                                        : plan.highlight 
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-gray-100 text-gray-800'}`}>
                        {isCurrentPlan 
                          ? (t.currentPlan || 'Current Plan') 
                          : (t.pricingPlans?.[plan.key]?.badge || plan.badge)}
                      </span>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {planTranslation?.name || plan.name}
                    </h3>
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        ${calculatePrice(plan.price)}
                      </span>
                      <span className="text-gray-500 ml-1">
                        {showAnnual 
                          ? '/year' 
                          : planTranslation?.period || '/month'}
                      </span>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                      {(planTranslation?.features || plan.features).map((feature: string) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Updated: Cyan "Get Started" button with color-specific pulse effect for highlighted plan */}
                    <button
                      onClick={async () => {
                        if (!user) {
                          window.location.href = `/auth?mode=register&redirect=${encodeURIComponent(window.location.pathname)}`;
                          return;
                        }

                        // Use plan.key instead of plan.name for getting the price ID
                        const priceId = getStripePriceId(plan.key, showAnnual);
                        if (!priceId) {
                          console.error('Price ID not found for plan:', plan.key);
                          return;
                        }

                        try {
                          setLoadingPlanKey(plan.key);
                          await createCheckoutSession(priceId, 'subscription');
                        } catch (error) {
                          console.error('Failed to create checkout session:', error);
                        } finally {
                          setLoadingPlanKey(null);
                        }
                      }}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex justify-center items-center gap-2
                        ${isCurrentPlan
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : plan.highlight
                            ? 'bg-[#4FC3F7] text-white hover:brightness-110 animate-pulse-cyan-shadow'
                            : 'bg-[#4FC3F7] text-white hover:brightness-110'}`}
                      disabled={isCurrentPlan || loadingPlanKey === plan.key}
                    >
                      {loadingPlanKey === plan.key && (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                        </svg>
                      )}
                      {loadingPlanKey === plan.key
                        ? t.redirectingToStripe || 'Redirecting to Stripe...'
                        : isCurrentPlan
                          ? (t.currentPlan || 'Current Plan')
                          : (planTranslation?.buttonText || t.getStarted || 'Get Started')}
                    </button>
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

  // Loading állapot – maradjon semleges shell
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

  // KÉSZ – feltételes shell választás
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

