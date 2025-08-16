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

export default function PricingPage() {
  const [showAnnual, setShowAnnual] = useState(false);
  const [searchParams] = useSearchParams();
  const { plan: currentPlan, status, trial_ends_at } = useUserPlan();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlanKey, setLoadingPlanKey] = useState<string | null>(null);

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

  const getStripePriceId = (planKey: string, isAnnual: boolean) => {
    // Use the plan key directly rather than the name
    const key = planKey.toLowerCase() + (isAnnual ? '_yearly' : '');
    const product = products[key];
    return product?.priceId || null;
  };

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
                  Start your 14-day free trial — no credit card required!
                </motion.div>

                <p className="text-gray-600 text-sm mb-4">
                  No credit card required. No commitment. Just results.
                </p>

                <a
                  href="https://reviewtorevenue.io/auth?mode=register&redirect=%2Fpricing&src=za"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-all animate-pulse-green"
                >
                  Start free trial
                </a>
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
                        onClick={async () => {
                          if (!user) {
                            window.location.href = `https://reviewtorevenue.io/auth?mode=register&redirect=${encodeURIComponent('/pricing')}&src=za`;
                            return;
                          }

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
                          ? 'Redirecting to Stripe...'
                          : isCurrentPlan
                            ? 'Current Plan'
                            : plan.buttonText}
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

