import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, QrCode, Trophy, CheckCircle2, Brain, TrendingUp, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import RoiCalculator from '../components/RoiCalculator';
import useTranslation from '../hooks/useTranslation';
import FAQLocal from '../components/FAQ';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/dashboard');
      }
    });
  }, []);
  
  useEffect(() => {
    const loadOptiMonkCampaign = async () => {
      try {
        const res = await fetch('https://ipinfo.io/json?token=your_token_here');
        const data = await res.json();
        const country = data.country;

        // Magyar kampány = 2, Angol = 3
        const campaignId = country === 'HU' ? 2 : 3;

        // Kampány betöltése ha elérhető az OptiMonk
        window.OptiMonk?.Api?.campaigns.show(campaignId);
      } catch (err) {
        console.error('OptiMonk geolocation error:', err);
        // fallback: angol kampány
        window.OptiMonk?.Api?.campaigns.show(3);
      }
    };

    loadOptiMonkCampaign();
  }, []);
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20 overflow-hidden">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <motion.h1 
                className="text-4xl sm:text-5xl mb-4 text-gray-900"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                {...fadeIn}
              >
                {t.landingHeroHeadline}
              </motion.h1>
              <p
                className="text-2xl text-gray-600 mb-4"
                style={{ fontFamily: 'Alexandria, sans-serif' }}
              >
                {t.landingHeroSubline}
              </p>
              <motion.div
                {...fadeIn}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {/* 🔥 1️⃣ Hero section CTA */}
                <button
                  onClick={() => {
                    document.getElementById('pricing-teaser')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center px-8 py-4 rounded-xl
                           bg-[#4FC3F7] text-white font-semibold text-lg
                           hover:brightness-110 transform transition-all
                           hover:scale-105 shadow-lg pulse-custom"
                >
                  {t.landingHeroCta}
                </button>
                <p className="text-sm text-gray-500">{t.noCreditCardRequired}</p>
              </motion.div>
            </div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative flex justify-center items-center"
            >
              <div
                className="bg-white rounded-3xl shadow-2xl p-4"
                style={{ maxWidth: "400px", maxHeight: "700px" }}
              >
                <div className="relative aspect-[9/16] bg-gray-100 rounded-2xl overflow-hidden">
                  <video
                    src="https://res.cloudinary.com/dsqgb1lxe/video/upload/v1749387380/demo_wheel_1_c4b7p1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl"
                    loading="lazy"
                  ></video>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

            {/* ROI Calculator – only visible for internal testing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            ROI kalkulátor teszt
          </h2>
          <RoiCalculator />
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t.problemSolutionTitle}
            </h2>

            <div className="space-y-6 text-lg text-gray-600">
              <p>
                {t.rightAfterPayment}
              </p>
              <p>
                {t.awkwardReviewRequest}
              </p>
            </div>

            {/* micro-CTA inside the problem block */}
            <div className="flex justify-end mt-8">
              {/* 🔥 2️⃣ Problem → Solution section CTA */}
              <Link
                to="/pricing"
                className="inline-flex items-center px-8 py-4 rounded-xl
                           bg-pink-600 text-white font-semibold text-lg
                           hover:bg-pink-700 transform transition-all
                           hover:scale-105 shadow-lg pulse" // Added pulse class
              >
                {t.startTrialCta}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t.howItWorksTitle}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: QrCode,
                title: t.steps.scanTitle, // Dinamikus title
                description: t.scanDescription,
                color: "bg-blue-50",
                iconColor: "text-blue-600"
              },
              {
                icon: Star,
                title: t.steps.leaveReviewTitle, // Dinamikus title
                description: t.leaveReviewDescription,
                color: "bg-indigo-50",
                iconColor: "text-indigo-600"
              },
              {
                icon: Trophy,
                title: t.steps.spinRedeemTitle, // Dinamikus title
                description: t.spinRedeemDescription,
                color: "bg-purple-50",
                iconColor: "text-purple-600"
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                className={`${step.color} rounded-xl p-8 shadow-lg transform hover:scale-105 transition-transform`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-lg bg-white shadow-md ${step.iconColor}`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle2,
                title: "skyHighStarRating",
                description: "captureAuthenticFeedback"
              },
              {
                icon: Brain,
                title: "privateNegativeFeedback",
                description: "addressConcerns"
              },
              {
                icon: TrendingUp,
                title: "moreRepeatVisits",
                description: "turnOneTimeVisitors"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <benefit.icon className="w-12 h-12 text-[#1A237E] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.coreBenefits[benefit.title]}</h3>
                <p className="text-gray-600">{t.coreBenefits[benefit.description]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#4FC3F7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">
            {t.statsTitle}
          </h2>
          <p className="text-xl text-blue-100">
            {t.statsDescription}
          </p>
        </div>
      </section>


      {/* Trusted By Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm uppercase mb-8 tracking-wide font-semibold">
            {t.trustedByTitle}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 items-center">
            {[
              {
                title: t.restaurantsTitle, // Dinamikus title
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
                link: '/use-cases/restaurants'
              },
              {
                title: t.barbershopsTitle, // Dinamikus title
                image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
                link: '/use-cases/barbershops'
              },
              {
                title: t.cafesTitle, // Dinamikus title
                image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
                link: '/use-cases/cafes'
              },
              {
                title: t.hotelsTitle, // Dinamikus title
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
                link: '/use-cases/hotels'
              },
              {
                title: t.retailTitle, // Dinamikus title
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
                link: '/use-cases/retail'
              },
              {
                title: t.salonsTitle, // Dinamikus title
                image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80',
                link: '/use-cases/salons'
              },
            ].map(({ title, image, link }) => (
              <Link to={link} key={title} className="group">
                <div className="overflow-hidden rounded-lg shadow-md">
                  <img
                    src={image}
                    alt={title}
                    className="h-28 w-full object-cover transition duration-300"
                  />
                </div>
                <p className="mt-2 text-base font-semibold text-gray-700 group-hover:text-blue-600 transition">
                  {title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            {t.testimonialsTitle}
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <TestimonialsCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* === In-page Pricing Teaser ================================= */}
      <section id="pricing-teaser" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            {t.pricingTeaserTitle || "Simple, scalable pricing"}
          </h2>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                key: 'solo',
                name: 'Solo',
                price: 29.99,
                period: '/month',
                highlight: false,
                features: [
                  '1 business', 
                  'Up to 3 Active Wheel of Fortunes', 
                  'Up to 200 reviews/month', 
                  'QR code customization', 
                  'Review page customization', 
                  'Priority email support', 
                  'Video Onboarding'
                ],
                buttonText: 'Get Started'
              },
              {
                key: 'growth',
                name: 'Growth',
                price: 49.99,
                period: '/month',
                highlight: true,
                features: [
                  'Everything in Solo', 
                  'Up to 3 businesses', 
                  'Up to 15 Active Wheels', 
                  'Up to 1000 reviews/month', 
                  'Custom branding', 
                  'Custom prize weighting'
                ],
                buttonText: 'Get Started'
              },
              {
                key: 'unlimited',
                name: 'Unlimited',
                price: 129.99,
                period: '/month',
                highlight: false,
                features: [
                  'Everything in Growth', 
                  'Unlimited businesses & reviews', 
                  'Unlimited Wheel of Fortunes', 
                  'Priority support (chat + email)', 
                  'Feature-request fast-lane', 
                  'Personalized Onboarding'
                ],
                buttonText: 'Get Started'
              }
            ].map((plan) => {
              // Try to get translation if available
              const planTranslation = t.pricingPlans?.[plan.key];
              
              return (
                <div
                  key={plan.key}
                  className={`relative bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm text-left 
                    ${plan.highlight ? 'border border-[#4FC3F7] ring-2 ring-[#4FC3F7]' : ''}`}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {planTranslation?.name || plan.name}
                  </h3>

                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">{planTranslation?.period || plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {(planTranslation?.features || plan.features).map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2 text-gray-600">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/pricing?plan=${plan.key}`}
                    className="inline-block w-full py-4 rounded-full font-semibold text-center text-white bg-[#4FC3F7] hover:brightness-110 transition"
                  >
                    {planTranslation?.buttonText || plan.buttonText}
                  </Link>
                </div>
              );
            })}
          </div>

          <Link
            to="/pricing"
            className="inline-flex items-center mt-10 text-sm font-medium text-blue-600 hover:underline"
          >
            {t.comparePlans || "Compare all plans →"}
          </Link>
        </div>
      </section>


      {/* Differentiator Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t.differentiatorTitle}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t.differentiatorDescription}
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
              {[ 
                {
                  icon: TrendingUp,
                  title: t.engagementTitle,
                  description: t.engagementDescription
                },
                {
                  icon: Star,
                  title: t.revenueTitle,
                  description: t.revenueDescription
                },
                {
                  icon: Brain,
                  title: t.ignoreReviewsTitle,
                  description: t.ignoreReviewsDescription
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex gap-4 items-start"
                >
                  <item.icon className="w-10 h-10 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-xl font-semibold text-blue-600 mt-12">
              {t.marketingChannelDescription}
            </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24" style={{ backgroundColor: '#4FC3F7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">{t.finalCtaTitle}</h2>
          <p className="text-xl text-white">{t.finalCtaDescription}</p>
        </div>
      </section>

      <FAQLocal
        id="faq"
        showSchema
        // lang="hu" // opcionális: manuális nyelvválasztás, ha nem a contextet szeretnéd
        // itemsOverride={[ { q: 'Kérdés…', a: 'Válasz…' } ]} // opcionális: egyedi Q&A lista
        className="pt-20"
      />

      <Footer />
    </div>
  );
}