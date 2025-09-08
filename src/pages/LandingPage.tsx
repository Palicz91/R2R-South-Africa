import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Brain, TrendingUp, Check, Sparkles, RotateCcw, Star, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';
import TestimonialsCarouselRepeat from '../components/TestimonialsCarouselRepeat';
import useTranslation from '../hooks/useTranslationLandingB';
import { useOptiMonk } from '../hooks/useOptiMonk';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import '../styles/typography.css';
import RoiCalculator from '../components/RoiCalculator';
import { useLanguage } from '../context/LanguageContext';

const CALENDLY_LINK_HU = "https://calendly.com/hello-reviewtorevenue/review-to-revenue-hu";
const CALENDLY_LINK_EN = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1cBfiHZeT3AwuKq8SSfevbdt86d57qssUoE5RnLksvtQJqlPslCv4H81ymd0UkPkhdMuIMt_ms";
const WHATSAPP_LINK = "https://wa.me/4915143369633";

const FM_BASE_BY_CUR = { USD: 99.0, HUF: 39990, MYR: 449, SGD: 129, ZAR: 99.0 } as const;
const FM_ADDON_BY_CUR = { USD: 69.0, HUF: 24900, MYR: 299, SGD: 89, ZAR: 69.0 } as const;
const FM_ADDON_MAX = 10;

export default function LandingPage() {
  const navigate = useNavigate();
  const [showAnnual, setShowAnnual] = useState(false);
  
  // Currency state
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [currencyReady, setCurrencyReady] = useState(false);

  // LTD countdown state
  const [countdown, setCountdown] = useState('');
  const [ltdExpired, setLtdExpired] = useState(false);

  // LTD state
  const [extraBusinesses, setExtraBusinesses] = useState(0);
  const [ltdLoading, setLtdLoading] = useState(false);

  const { t } = useTranslation();
  const { language } = useLanguage();
  
  useOptiMonk();

  // LTD values
  const fmBase = FM_BASE_BY_CUR[currency] ?? FM_BASE_BY_CUR.USD;
  const fmAddon = FM_ADDON_BY_CUR[currency] ?? FM_ADDON_BY_CUR.USD;
  const fmTotal = fmBase + extraBusinesses * fmAddon;

  // 3) Lifetime tier prices by currency (USD default, MYR, SGD)
  const LTD_PRICES_BY_CUR: Partial<Record<SupportedCurrency, number[]>> = {
    USD: [99, 149, 199, 249],
    MYR: [449, 649, 849, 1049],
    SGD: [129, 199, 269, 339],
    // HUF uses the translated numbers as-is (no override)
  };

  // Helper: replace the first <strong>…</strong> in a line with the formatted price.
  // If no <strong>…</strong> found, append the price at the end.
  const injectPrice = (rowHtml: string, price: number) => {
    const priceHtml = `<strong>${fmtMoney(price)}</strong>`;
    if (/<strong>.*?<\/strong>/.test(rowHtml)) {
      return rowHtml.replace(/<strong>.*?<\/strong>/, priceHtml);
    }
    return `${rowHtml} — ${priceHtml}`;
  };

  // LTD countdown effect
  useEffect(() => {
    const now = new Date();
    const deadline = new Date(now.getFullYear(), 9, 0, 23, 59, 59);
    const id = setInterval(() => {
      const ms = deadline.getTime() - Date.now();
      if (ms <= 0) {
        setCountdown('0d 0h 0m 0s');
        setLtdExpired(true);
        clearInterval(id);
        return;
      }
      const s = Math.floor(ms / 1000);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      setCountdown(`${d}d ${h}h ${m}m ${sec}s`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Currency detection from geo/query params with language override
  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const qp = (params.get('currency') || '').toUpperCase();
      // 1) Add SGD to the explicit currency allow-list
      const explicit = (['USD','ZAR','MYR','HUF','SGD'].includes(qp) ? qp : null) as SupportedCurrency | null;

      let cur = await resolveCurrencyFromGeo(explicit);

      // Only override with language if there's NO explicit query param
      if (!explicit && language === 'hu') {
        cur = 'HUF';
      }

      setCurrency(cur);
      setCurrencyReady(true);
    })();
  }, [language]);

  // Currency formatter
  // 2) Locale tweak (add en-SG)
  const numberLocale =
    currency === 'MYR' ? 'ms-MY'
  : currency === 'HUF' ? 'hu-HU'
  : currency === 'ZAR' ? 'en-ZA'
  : currency === 'SGD' ? 'en-SG'
  : 'en-US';

  const fmt = new Intl.NumberFormat(numberLocale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'HUF' ? 0 : 2,
  });

  // Unified money formatter for consistent SGD handling
  const fmtMoney = (v: number) =>
    currency === 'SGD' ? `S$${v.toFixed(2)}` : fmt.format(v);

  // Currency-aware price calculator for teaser
  const teaserDisplayPrice = (planKey: 'solo'|'growth'|'unlimited') => {
    // Base monthly in each currency
    const base = (() => {
      if (currency === 'MYR') {
        if (planKey === 'solo') return 129;
        if (planKey === 'growth') return 219;
        if (planKey === 'unlimited') return 549;
      }
      if (currency === 'HUF') {
        if (planKey === 'solo') return 9990;
        if (planKey === 'growth') return 19990;
        if (planKey === 'unlimited') return 44990; // "Professional"
      }
      if (currency === 'ZAR') {
        if (planKey === 'solo') return 750;
        if (planKey === 'growth') return 1250;
        if (planKey === 'unlimited') return 3250;
      }
      if (currency === 'SGD') {
        if (planKey === 'solo') return 39.99;
        if (planKey === 'growth') return 64.99;
        if (planKey === 'unlimited') return 169.99;
      }
      // USD defaults
      if (planKey === 'solo') return 29.99;
      if (planKey === 'growth') return 49.99;
      if (planKey === 'unlimited') return 129.99;
      return 0;
    })();

    const amount = showAnnual ? base * 12 * 0.8 : base; // Yearly = 20% off
    let price = fmt.format(amount);
    
    // Special case for SGD
    if (currency === 'SGD') {
      price = 'S$' + amount.toFixed(2);
    }
    
    return price;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/dashboard');
      }
    });
  }, []);
  
  // Add AgentiveHub Chat Widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://agentivehub.com/production.bundle.min.js';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      if (!document.getElementById('root')) {
        const root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);
      }

      if (window.myChatWidget && typeof window.myChatWidget.load === 'function') {
        window.myChatWidget.load({
          id: '6147b061-c410-4f56-b2ca-e3e62b98384f',
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Guard render until currency is ready
  if (!currencyReady) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />
      
{/* Hero Section */}
<section className="bg-gradient-to-br from-blue-50 to-indigo-50 pt-4 sm:pt-12 pb-4 sm:pb-12 lg:pb-9 lg:min-h-[75vh] overflow-hidden">
  <motion.div 
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <div className="grid md:grid-cols-2 gap-y-3 sm:gap-y-12 gap-x-0 md:gap-12 items-center">
      <div className="text-center sm:text-left">
        <motion.h1 
          className="text-3xl sm:text-4xl lg:text-[3rem] lg:leading-tight mb-4"
          style={{ color: '#4FC3F7', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
          {...fadeIn}
          dangerouslySetInnerHTML={{ __html: t.landingHeroHeadline }}
        />

        <motion.p 
          className="text-base sm:text-lg lg:text-xl lg:leading-relaxed text-gray-600 mb-4"
          style={{ fontFamily: 'Alexandria, sans-serif' }}
          {...fadeIn}
          transition={{ delay: 0.2 }}
          dangerouslySetInnerHTML={{ __html: t.landingHeroSubline }}
        />
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Hero section CTA */}
          <button
            onClick={() => {
              fbq('trackCustom', 'Landing_Hero_CTA');
              const el = document.getElementById('roi-calculator');
              if (!el) return;

              const header = document.querySelector('nav, [data-fixed-header]')?.offsetHeight || 0;
              const y = el.getBoundingClientRect().top + window.scrollY - header + 10;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }}
            className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white font-semibold text-lg shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 pulse-custom"
          >
            {t.landingHeroCta}
          </button>
          <p className="text-sm lg:text-base text-gray-500"></p>
        </motion.div>
      </div>

      {/* Hero Visual */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center items-center"
      >
        <img
          src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/hero.webp"
          alt="Review to Revenue demo"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[110%] xl:max-w-[110%] rounded-2xl shadow-lg object-contain"
          loading="lazy"
        />
      </motion.div>
    </div>
  </motion.div>

  {/* Background decoration */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
    <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl" />
  </div>
</section>

{/* Core Benefits Section */}
<Section className="pb-8">
  <div className="grid md:grid-cols-3 gap-8">
    {[
      {
        icon: RotateCcw, // 🔄 - Changed from ArrowCounterClockwise to RotateCcw
        title: "moreRepeatGuestsTitle",
        description: "moreRepeatGuestsDesc",
      },
      {
        icon: Star, // ⭐
        title: "moreReviewsTitle",
        description: "moreReviewsDesc",
      },
      {
        icon: Mail, // 📩
        title: "moreEmailSubsTitle",
        description: "moreEmailSubsDesc",
      },
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
        <h3 className="h3 text-gray-900 mb-4">{t.coreBenefits[benefit.title]}</h3>
        <p className="text-lg text-gray-600">{t.coreBenefits[benefit.description]}</p>
      </motion.div>
    ))}
  </div>
</Section>

{/* Post-Hero Separator */}
<section 
  id="post-hero-separator" 
  className="py-8 sm:py-12 bg-gradient-to-r from-[#4FC3F7] to-[#1A8FBF] text-white"
>
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.postHeroSeparatorWheel}
    </motion.h2>
  </div>
</section>


{/* Relief / Ease Block – single column layout */}
<section id="relief-block" className="bg-white py-12 sm:py-16">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Title */}
    <h2
      className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-4"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.reliefBlock.title}
    </h2>

    {/* Lead */}
    <p
      className="text-lg sm:text-xl text-gray-800 mb-5"
      style={{ fontFamily: 'Montserrat, sans-serif', lineHeight: 1.7 }}
      dangerouslySetInnerHTML={{ __html: t.reliefBlock.p1 }}
    />

{/* Body copy */}
<div
  className="space-y-5 text-gray-800 text-base sm:text-lg"
  style={{ fontFamily: 'Montserrat, sans-serif', lineHeight: 1.85, maxWidth: '62ch' }}
>
  {/* Highlighted p2 */}
  <blockquote className="relative pl-4 sm:pl-6 py-3 border-l-4 border-[#4FC3F7] bg-blue-50/60 rounded-r-xl text-gray-900">
    <span 
      className="block text-base sm:text-lg" 
      style={{ fontFamily: 'Alexandria, sans-serif' }}
      dangerouslySetInnerHTML={{ __html: t.reliefBlock.p2 }}
    />
  </blockquote>

  {/* Kép blokk */}
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.15 }}
    className="mt-4 px-0"
  >
    <div className="mx-auto w-full max-w-[560px] flex justify-center items-center">
      <img
        src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/gondterhelt.png"
        alt={t.reliefBlock.imageAlt || "Gondterhelt vendéglátós képe"}
        className="w-full h-auto rounded-2xl shadow-lg object-contain"
        loading="lazy"
      />
    </div>
  </motion.div>

  <p dangerouslySetInnerHTML={{ __html: t.reliefBlock.p3 }} />

  {/* Pull-quote (p4) */}
  <blockquote className="relative pl-4 sm:pl-6 py-3 border-l-4 border-[#4FC3F7] bg-blue-50/60 rounded-r-xl text-gray-900">
    <span 
      className="block text-base sm:text-lg font-semibold" 
      style={{ fontFamily: 'Alexandria, sans-serif' }}
      dangerouslySetInnerHTML={{ __html: t.reliefBlock.p4 }}
    />
  </blockquote>

  <p dangerouslySetInnerHTML={{ __html: t.reliefBlock.p5 }} />
</div>

    {/* CTA button only */}
    <div className="mt-10">
      <button
        onClick={() => {
          fbq?.('trackCustom', 'Relief_Block_CTA');
          const el = document.getElementById('pricing-teaser') || document.getElementById('roi-calculator');
          if (!el) return;
          const header = document.querySelector('nav, [data-fixed-header]')?.offsetHeight || 0;
          const y = el.getBoundingClientRect().top + window.scrollY - header + 10;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }}
        className="inline-flex w-full items-center justify-center px-6 py-4 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white font-semibold text-lg shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 pulse-custom"
      >
        {t.reliefBlock.cta}
      </button>
    </div>
  </div>
</section>


{/* Partners Image – egységes méret */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.6 }}
  className="mt-8 px-4"
>
  <div className="mx-auto w-full max-w-[560px] flex justify-center items-center">
    <img
      src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/partnerspic.png"
      alt={t.partnersImageAlt || "Partnerek képe"}
      className="w-full h-auto rounded-2xl shadow-lg object-contain"
      loading="lazy"
    />
  </div>
</motion.div>

{/* Post-Hero: Expensive Mistake Section */}
<section id="post-hero-mistake" className="bg-white pt-8 sm:pt-12 pb-6 sm:pb-8">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2
        className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center"
        style={{ fontFamily: 'Alexandria, sans-serif' }}
      >
        {t.postHeroMistake.title}
      </h2>

      <p
        className="text-gray-700 text-lg"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.postHeroMistake.intro }}
      />

      {/* Bullets with blue background (same style as research) */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
        <ul className="space-y-2">
          {t.postHeroMistake.channels.bullets.map((ch: string, i: number) => (
            <li
              key={i}
              className="flex items-start gap-2 text-gray-900"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Check className="w-5 h-5 text-[#1A237E] mt-0.5 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: ch }} />
            </li>
          ))}
        </ul>
      </div>

      <p
        className="text-gray-800 font-medium"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.postHeroMistake.costQuestion }}
      />

      <p
        className="text-gray-700"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.postHeroMistake.pivot }}
      />

      {/* Research block */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
        <p
          className="text-sm font-semibold text-gray-900 mb-3"
          style={{ fontFamily: 'Alexandria, sans-serif' }}
        >
          {t.postHeroMistake.researchTitle}
        </p>
        <ul className="space-y-2">
          {(() => {
            const researchLinks = [
              "https://www.outboundengine.com/blog/customer-retention-marketing-vs-customer-acquisition-marketing/?utm_source=chatgpt.com",
              "https://www.business.com/articles/returning-customers-spend-67-more-than-new-customers-keep-your-customers-coming-back-with-a-recurring-revenue-sales-model/?utm_source=chatgpt.com",
              "https://www.outboundengine.com/blog/customer-retention-marketing-vs-customer-acquisition-marketing/?utm_source=chatgpt.com"
            ];

            return t.postHeroMistake.researchBullets.map((b: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2 text-gray-800"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <Check className="w-5 h-5 text-[#1A237E] mt-0.5 flex-shrink-0" />
                <span>
                  {b},{" "}
                  <a
                    href={researchLinks[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {language === 'hu' ? 'forrás' : 'source'}
                  </a>
                </span>
              </li>
            ));
          })()}
        </ul>
      </div>

      <p
        className="text-gray-900"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.postHeroMistake.conclusion }}
      />
    </motion.div>

    {/* Kép */}
    <div className="flex justify-center mt-4 mb-0">
      <img
        src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/telthaz.jpg"
        alt="Telthaz"
        className="w-full max-w-md rounded-xl shadow-lg object-cover"
      />
    </div>
  </div>
</section>


{/* New Guests Block */}
<section id="new-guests-block" className="bg-white pt-6 sm:pt-8 pb-8 sm:pb-12">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6 text-left"
    >
      <h2
        className="text-2xl sm:text-3xl font-semibold text-gray-900"
        style={{ fontFamily: 'Alexandria, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.newGuestsBlock.title }}
      />

      <p
        className="text-gray-700 text-lg"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.newGuestsBlock.intro }}
      />

      <p
        className="text-gray-700 text-lg"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.newGuestsBlock.strategy }}
      />

      <p
        className="text-gray-800 font-medium text-lg"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.newGuestsBlock.warning }}
      />

      <h2
        className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center"
        style={{ fontFamily: 'Alexandria, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.newGuestsBlock.question }}
      />

      <p
        className="text-gray-700 text-lg text-center"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.newGuestsBlock.solution }}
      />

      <div className="pt-4 flex justify-center">
        <button
          onClick={() => {
            fbq?.('trackCustom', 'NewGuests_Block_CTA');
            const el = document.getElementById('pricing-teaser');
            if (!el) return;
            const header = document.querySelector('nav, [data-fixed-header]')?.offsetHeight || 0;
            const y = el.getBoundingClientRect().top + window.scrollY - header + 10;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }}
          className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white font-semibold text-lg shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 pulse-custom"
        >
          {t.newGuestsBlock.cta}
        </button>
      </div>
    </motion.div>

    {/* SAME-LOOK IMAGE, but hard-limited width */}
    <div className="w-full px-4 sm:px-0 flex justify-center">
      <motion.img
        src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/five-star-writing.png"
        alt="Five star review illustration"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="mt-6 w-full max-w-[540px] rounded-2xl shadow-lg object-contain"
        loading="lazy"
      />
    </div>
  </div>
</section>

{/* Email List Block */}
<section id="email-list-block" className="bg-white pt-6 sm:pt-8 pb-8 sm:pb-12">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2
        className="text-2xl sm:text-3xl font-semibold text-gray-900"
        style={{ fontFamily: 'Alexandria, sans-serif' }}
      >
        {t.emailListBlock.title}
      </h2>

      <p
        className="text-gray-800 font-semibold text-lg"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {t.emailListBlock.leadQuestion}
      </p>
      <p
        className="text-gray-900 text-lg"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {t.emailListBlock.leadAnswer}
      </p>

      <p
        className="text-gray-700 text-lg"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.emailListBlock.reason1 }}
      />

      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
        <p
          className="text-gray-800 text-lg"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          dangerouslySetInnerHTML={{ __html: t.emailListBlock.reasonCardText }}
        />
      </div>

      <p
        className="text-gray-700 text-lg"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.emailListBlock.ownership }}
      />

      <h2
        className="text-2xl sm:text-3xl font-semibold text-gray-900"
        style={{ fontFamily: 'Alexandria, sans-serif' }}
      >
        {t.emailListBlock.challenge}
      </h2>

      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
        <p
          className="text-gray-800 text-lg"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          dangerouslySetInnerHTML={{ __html: t.emailListBlock.r2rHelp }}
        />
      </div>

      <p
        className="text-gray-700 text-lg"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {t.emailListBlock.speed}
      </p>

      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            fbq?.('trackCustom', 'EmailList_Block_CTA');
            const el = document.getElementById('pricing-teaser');
            if (!el) return;
            const header = document.querySelector('nav, [data-fixed-header]')?.offsetHeight || 0;
            const y = el.getBoundingClientRect().top + window.scrollY - header + 10;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }}
          className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white font-semibold text-lg shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 pulse-custom"
        >
          {t.emailListBlock.cta}
        </button>
      </div>
    </motion.div>
  </div>
</section>

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
          <h3 className="h3 text-gray-900 mb-4">{t.coreBenefits[benefit.title]}</h3>
          <p className="text-lg text-gray-600">{t.coreBenefits[benefit.description]}</p>
        </motion.div>
      ))}
    </div>

      {/* Revenue Image */}
      <Section className="pt-0 pb-0">
        <div className="max-w-4xl mx-auto flex justify-center">
          <img
            src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/salesmarketing.png"
            alt="Sales and Marketing"
            className="w-full max-w-lg rounded-2xl shadow-lg object-contain"
          />
        </div>
      </Section>

{/* Separator Strip */}
<section
  id="separator-wheel"
  className="py-8 sm:py-12 bg-gradient-to-r from-[#4FC3F7] to-[#1A8FBF] text-white"
>
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.separatorWheel}
    </motion.h2>
  </div>
</section>

{/* Setup Steps Block (új szöveg + highlight + tip + CTA) */}
<div id="setup-steps" className="max-w-4xl mx-auto mt-6 mb-10 text-center">
  <h3
    className="text-2xl sm:text-3xl font-semibold text-gray-900"
    style={{ fontFamily: 'Alexandria, sans-serif' }}
  >
    {t.setupStepsTitle}
  </h3>

  <p
    className="mt-2 text-gray-600"
    style={{ fontFamily: 'Montserrat, sans-serif' }}
  >
    {t.setupStepsSubtitle}
  </p>

  {/* 3 kiemelt bullet (🎯 ⭐ 📩) */}
  <ul className="mt-4 inline-flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-center">
    {t.setupStepsHighlights?.map?.((h: string, i: number) => (
      <li
        key={i}
        className="text-gray-800 font-medium"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {h}
      </li>
    ))}
  </ul>

  {/* Bevezető sor a lépésekhez */}
  <p
    className="mt-6 text-gray-800 font-semibold"
    style={{ fontFamily: 'Montserrat, sans-serif' }}
  >
    {t.setupStepsIntro}
  </p>

{/* 5 lépés */}
<ol className="mt-6 grid gap-4 sm:grid-cols-2">
  {t.setupSteps.map((step: string, idx: number) => (
    <li
      key={idx}
      className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/60 shadow-sm text-left"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Fejléc sor: badge + szöveg */}
      <div className="flex items-start gap-4">
        {/* Számozott badge – mindig a kártya belsejében */}
        <div
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#4FC3F7] text-white text-lg font-bold shadow-md shrink-0"
          style={{ aspectRatio: '1 / 1' }}
        >
          {idx + 1}
        </div>

        {/* Szöveg */}
        <p className="text-gray-800 leading-relaxed">{step}</p>
      </div>
    </li>
  ))}
</ol>

  {/* Tipp doboz */}
  <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left shadow-sm">
    <p
      className="text-gray-900"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
      dangerouslySetInnerHTML={{ __html: t.setupStepsTip }}
    />
  </div>

  {/* Outro */}
  <p
    className="mt-6 text-lg text-gray-700"
    style={{ fontFamily: 'Montserrat, sans-serif' }}
  >
    {t.setupStepsOutro}
  </p>

  {/* Záró kérdés */}
  <h2
    className="mt-8 text-2xl sm:text-3xl font-semibold text-gray-900"
    style={{ fontFamily: 'Alexandria, sans-serif' }}
  >
    {t.setupStepsFinalQuestion}
  </h2>

  {/* CTA gomb */}
  <div className="mt-4 flex justify-center">
    <button
      onClick={() => {
        fbq?.('trackCustom', 'SetupSteps_CTA');
        const el = document.getElementById('pricing-teaser');
        if (!el) return;
        const header = document.querySelector('nav, [data-fixed-header]')?.offsetHeight || 0;
        const y = el.getBoundingClientRect().top + window.scrollY - header + 10;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }}
      className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white font-semibold text-lg shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 pulse-custom"
    >
      {t.setupStepsCta}
    </button>
  </div>
</div>

{/* Barista Image – egységes méret */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.6 }}
  className="mt-8 px-4"
>
  <div className="mx-auto w-full max-w-[560px] flex justify-center items-center">
    <img
      src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/barista.png"
      alt={t.setupStepsImageAlt || "barista pasi kép"}
      className="w-full h-auto rounded-2xl shadow-lg object-contain"
      loading="lazy"
    />
  </div>
</motion.div>

{/* Review-to-Revenue Intro Section – New Version */}
<Section id="how-to-use" className="pt-4 pb-0">
  <div className="max-w-4xl mx-auto text-center space-y-8">
    {/* Címsor */}
    <h3
      className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-2"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.r2rHowToUseTitle}
    </h3>

    {/* Lead bekezdés */}
    <p
      className="text-lg sm:text-xl text-gray-700"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
      dangerouslySetInnerHTML={{ __html: t.r2rHowToUseLead }}
    />

    {/* Lépések cím */}
    <p
      className="text-base sm:text-lg font-semibold text-gray-900"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.r2rHowToUseStepsTitle}
    </p>

    {/* Lépések számozva / kártyák */}
    <div className="grid gap-4 mt-2">
      {t.r2rHowToUseSteps.map((text: string, idx: number) => (
        <div
          key={idx}
          className="flex items-start gap-4 bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100 text-left"
        >
          <div
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#4FC3F7] text-white text-lg font-bold shrink-0"
            style={{ aspectRatio: '1 / 1' }}
          >
            {idx + 1}
          </div>
          <p
            className="text-gray-700 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      ))}
    </div>

    {/* Záró kérdés + CTA */}
    <div className="space-y-4 mt-6">
      <p
        className="text-lg text-gray-900 font-semibold"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.r2rHowToUseFinalQuestion }}
      />
      <div className="flex justify-center">
        <motion.button
          onClick={() => {
            fbq?.('trackCustom', 'HowToUse_CTA');
            const el = document.getElementById('pricing-teaser');
            if (!el) return;
            const header = document.querySelector('nav, [data-fixed-header]')?.offsetHeight || 0;
            const y = el.getBoundingClientRect().top + window.scrollY - header + 10;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }}
          className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white font-semibold text-lg shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 pulse-custom"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t.r2rHowToUseCta}
        </motion.button>
      </div>
    </div>
  </div>
</Section>

{/* QR Scan Image – egységes méret */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.6 }}
  className="mt-8 px-4"
>
  <div className="mx-auto w-full max-w-[560px] flex justify-center items-center">
    <img
      src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/qrscan.jpg"
      alt={t.qrScanImageAlt || "QR-kód szkennelés"}
      className="w-full h-auto rounded-2xl shadow-lg object-contain"
      loading="lazy"
    />
  </div>
</motion.div>

{/* ROI Intro Block – goes right before the #roi-calculator section */}
<section id="roi-intro" className="bg-white pt-6 pb-0">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto text-center">
      <h1
        className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        style={{ fontFamily: 'Alexandria, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.revenueCouldHaveMade }}
      />
      <p
        className="text-lg sm:text-xl text-gray-800"
        style={{ fontFamily: 'Montserrat, sans-serif', lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: t.calculatorIntro.text }}
      />
    </div>
  </div>
</section>

    {/* Calculator – */}
    <section 
      id="roi-calculator"
      className="py-6 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RoiCalculator hideFooterNote={false} />
      </div>
    </section>

{/* Gamified Request + Wheel Demo side-by-side */}
<Section className="pb-4">
  <div className="max-w-6xl mx-auto space-y-10">
    {/* Headline a teljes blokk fölött */}
    <h2
      className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.r2rGuestExperienceHeadline}
    </h2>

    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Left - Text + CTA */}
      <div className="space-y-8 text-center sm:text-left">
        <p
          className="text-lg text-gray-700"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          dangerouslySetInnerHTML={{ __html: t.gamifiedRequestText }}
        />

        {t.engagementBoostHeadline && (
          <>
            <h3
              className="h3 text-gray-900 pt-4"
              style={{ fontFamily: 'Alexandria, sans-serif' }}
            >
              {t.engagementBoostHeadline}
            </h3>
            <p
              className="text-lg text-gray-700"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              dangerouslySetInnerHTML={{ __html: t.engagementBoostText }}
            />
          </>
        )}

        <motion.button
          onClick={() => {
            fbq?.('trackCustom', 'Landing_Gamified_CTA');
            document.getElementById('pricing-teaser')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white font-semibold text-lg shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 pulse-custom"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t.gamifiedRequestCta}
        </motion.button>
      </div>

      {/* Right - Wheel Demo Video */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <Card className="p-4 rounded-3xl shadow-2xl">
          <div className="w-[288px] h-[504px] bg-gray-100 rounded-2xl overflow-hidden relative">
            <video
              src="https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/demo-wheel.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
          </div>
        </Card>
      </motion.div>
    </div>
  </div>
</Section>

            {/* Trusted By Section */}
            <Section>
        <div className="text-center">
          {/* H1 – cím */}
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
          >
            {t.trustedBySectionHeadline}
          </h1>

{/* Zöld pipás kártyák */}
<div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
  {t.trustedByCards.map((text: string, idx: number) => (
    <div
      key={idx}
      className={`
        ${idx === 4 ? 'md:col-span-2 flex justify-center' : ''}
      `}
    >
      <Card className="flex items-start gap-3 p-6 max-w-xl">
        <span className="text-green-600 text-xl flex-shrink-0">✅</span>
        <p
          className="text-left text-gray-700 leading-relaxed text-base"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Card>
    </div>
  ))}
</div>
{/* H3 – lezáró mondat (opcionális) */}
{(t.trustedBySectionClosing && t.trustedBySectionClosing.trim().length > 0) && (
  <h3
    className="text-xl text-gray-800 font-semibold leading-snug max-w-2xl mx-auto mb-8"
    style={{ fontFamily: 'Alexandria, sans-serif' }}
  >
    {t.trustedBySectionClosing}
  </h3>
)}

{/* CTA gomb */}
<div className="flex justify-center mb-12">
  <Link
    onClick={() => fbq?.('trackCustom', 'TrustedBy_CTA')}
    to={`/auth?mode=register&currency=${currency}`}
    className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white font-semibold text-lg shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 pulse-custom"
  >
    {t.trustedByCta}
  </Link>
</div>

{/* Money Image – egységes méret */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.6 }}
  className="mt-8 px-4"
>
  <div className="mx-auto w-full max-w-[560px] flex justify-center items-center">
    <img
      src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/money.jpg"
      alt={t.partnersImageAlt || "Money"}
      className="w-full h-auto rounded-2xl shadow-lg object-contain"
      loading="lazy"
    />
  </div>
</motion.div>

        </div>
      </Section>

{/* Not For You – Card layout */}
<Section id="not-for-you">
  <div className="text-center">
    {/* Cím */}
    <h1
      className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.notForYouBlock.title}
    </h1>

{/* ❌ Piros kártyák */}
<div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
  {(t.notForYouBlock.bullets as (string | { title: string; text: string })[]).map((item, idx) => {
    const wrapperClass =
      idx === 4 ? "md:col-span-2 flex justify-center" : "";

    // ha string (régi kulcs)
    if (typeof item === "string") {
      return (
        <div key={idx} className={wrapperClass}>
          <Card className="flex items-start gap-3 p-6 max-w-xl border-red-200 bg-red-50/70">
            <span className="text-red-600 text-xl flex-shrink-0">❌</span>
            <p
              className="text-left text-gray-800 leading-relaxed text-base"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {item}
            </p>
          </Card>
        </div>
      );
    }

    // ha objektum (új kulcs)
    return (
      <div key={idx} className={wrapperClass}>
        <Card className="flex items-start gap-3 p-6 max-w-xl border-red-200 bg-red-50/70">
          <span className="text-red-600 text-xl flex-shrink-0">❌</span>
          <div>
            <h4
              className="text-left text-gray-900 font-semibold mb-1"
              style={{ fontFamily: "Alexandria, sans-serif" }}
            >
              {item.title}
            </h4>
            <p
              className="text-left text-gray-800 leading-relaxed text-base"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {item.text}
            </p>
          </div>
        </Card>
      </div>
    );
  })}
</div>

    {/* Lezáró mondatok */}
    <p
      className="mt-4 mb-2 text-gray-900 font-medium max-w-2xl mx-auto"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {t.notForYouBlock.conclusion1}
    </p>
    <h3
      className="text-xl text-gray-900 font-semibold leading-snug max-w-2xl mx-auto mb-2"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.notForYouBlock.conclusion2}
    </h3>
    <p
      className="text-gray-700 max-w-2xl mx-auto"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {t.notForYouBlock.conclusion3}
    </p>

    {/* Opcionális CTA */}
    {t.notForYouBlock.cta && t.notForYouBlock.cta.trim().length > 0 && (
      <div className="flex justify-center mt-6">
        <button
          onClick={() => {
            fbq?.('trackCustom', 'NotForYou_CTA');
            const el = document.getElementById('pricing-teaser');
            if (!el) return;
            const header = document.querySelector('nav, [data-fixed-header]')?.offsetHeight || 0;
            const y = el.getBoundingClientRect().top + window.scrollY - header + 10;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }}
          className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white font-semibold text-lg shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 pulse-custom"
        >
          {t.notForYouBlock.cta}
        </button>
      </div>
    )}
  </div>
</Section>


      {/* Satisfied guests headline */}
      <h2
        className="h2 text-gray-900 mt-8 mb-8 text-center mx-auto max-w-4xl px-4"
        style={{ fontFamily: 'Alexandria, sans-serif' }}
      >
        {t.satisfiedGuestsToMarketing}
      </h2>

{/* Stats Section */}
<section className="py-8 bg-[#4FC3F7] text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2
      className="h2 text-white mt-8 mb-12 text-center mx-auto max-w-4xl px-4"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.statsTitle}
    </h2>
    <p className="text-xl text-white">
      {t.statsDescription}
    </p>
  </div>
</section>

  {/* Core Benefits Section */}
  <Section className="pb-8">
    <div className="text-center">
      {/* Revenue Boost Headline */}
      <h2
        className="h2 text-gray-900 mb-12"
        style={{ fontFamily: 'Alexandria, sans-serif' }}
      >
        {t.revenueBoostHeadline}
      </h2>

      {/* Képes rács (marad minden, csak a címeket veszi a fordításból) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 items-center">
        {[
          { 
            title: t.restaurantsTitle, 
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80', 
            link: '/use-cases/restaurants' 
          },
          { 
            title: t.barbershopsTitle, 
            image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80', 
            link: '/use-cases/barbershops' 
          },
          { 
            title: t.cafesTitle, 
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80', 
            link: '/use-cases/cafes' 
          },
          { 
            title: t.hotelsTitle, 
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', 
            link: '/use-cases/hotels' 
          },
          { 
            title: t.retailTitle, 
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80', 
            link: '/use-cases/retail' 
          },
          { 
            title: t.salonsTitle, 
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
            <p className="mt-4 text-base font-semibold text-gray-700 group-hover:text-blue-600 transition">
              {title}
            </p>
          </Link>
        ))}
      </div>

      {/* Extra szöveg, ha kell */}
      <p className="mt-12 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        {t.trustedByMore}
      </p>
    </div>
  </Section>

      {/* Testimonials Section */}
      <Section className="pt-6 bg-gray-50">
        <div className="text-center">
          <h2 className="h2 text-gray-900 mb-12 text-center">
            {t.testimonialsTitle}
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <TestimonialsCarouselRepeat />
            </div>
          </div>
        </div>
      </Section>

{/* Lifetime Teaser (inside pricing-teaser section) */}
<div id="ltd-teaser" className="relative mb-8">
  <div className="max-w-3xl mx-auto rounded-2xl border border-yellow-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 sm:p-8 shadow-[0_8px_24px_rgba(15,23,42,0.08)] relative">
    
    {/* Title */}
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center"
        style={{ fontFamily: 'Alexandria, sans-serif' }}>
      {t.ltdTeaser.title}
    </h2>

    {/* Intro (with strong + line breaks) */}
    <p className="text-base sm:text-lg text-gray-800 mb-5 text-center"
       style={{ fontFamily: 'Montserrat, sans-serif', lineHeight: 1.7 }}
       dangerouslySetInnerHTML={{ __html: t.ltdTeaser.intro }} />

    {/* 4) Replace the "Tiers" <ul> block inside the Lifetime Teaser with this: */}
    <div className="rounded-xl bg-white/70 border border-yellow-200 p-4 sm:p-5 mb-5">
      <p className="text-sm font-semibold text-gray-900 mb-3"
         style={{ fontFamily: 'Alexandria, sans-serif' }}>
        {t.ltdTeaser.tiersTitle}
      </p>

      {(() => {
        const rows = Array.isArray(t.ltdTeaser?.tiers) ? t.ltdTeaser.tiers : [];
        const override = LTD_PRICES_BY_CUR[currency];

        // If we have override prices for this currency, inject them; else render rows as-is (HUF).
        if (override && rows.length) {
          const out = rows.map((row, i) => injectPrice(row, override[i] ?? override[override.length - 1]));
          return (
            <ul className="space-y-2">
              {out.map((html, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <span className="mt-1">✨</span>
                  <span dangerouslySetInnerHTML={{ __html: html }} />
                </li>
              ))}
            </ul>
          );
        }

        // Fallback (HUF or missing overrides): use the translated rows untouched
        return (
          <ul className="space-y-2">
            {rows.map((row, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <span className="mt-1">✨</span>
                <span dangerouslySetInnerHTML={{ __html: row }} />
              </li>
            ))}
          </ul>
        );
      })()}
    </div>

    {/* Closer line */}
    <p className="text-base sm:text-lg text-gray-900 font-semibold mb-4 text-center"
       style={{ fontFamily: 'Montserrat, sans-serif' }}
       dangerouslySetInnerHTML={{ __html: t.ltdTeaser.closer }} />

    {/* CTA */}
    <div className="flex flex-col items-center gap-3 mb-3">
      <Link
        onClick={() => fbq?.('trackCustom', 'Lifetime_Teaser_CTA')}
        to="/pricing#founding-member"
        className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white font-semibold shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40"
      >
        {t.ltdTeaser.cta}
      </Link>
    </div>

    {/* Note under CTA at the very end */}
    <span className="block text-xs text-gray-600 text-center"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {t.ltdTeaser.note}
    </span>
  </div>
</div>

      {/* In-page Pricing Teaser */}
      <Section id="pricing-teaser">
        <div className="text-center">
          {/* LTD Banner – teaser tetején, nem sticky */}
          {!ltdExpired ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl mb-6"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-sm sm:text-base">
                <div className="grid grid-cols-3 items-center gap-3">
                  {/* spacer a tökéletes középre záráshoz */}
                  <div />
                  {/* középre igazított, sortörés nélküli szöveg */}
                  <div className="flex items-center justify-center gap-2 text-center whitespace-nowrap leading-none">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">
                      {t.ltd?.bannerTitle || 'Lifetime Deal'}
                    </span>
                    <span aria-hidden className="mx-1">•</span>
                    <span className="font-mono tabular-nums">
                      {(t.ltd?.endsIn || 'Ends in') + '\u00A0'}: {countdown}
                    </span>
                  </div>
                  {/* CTA jobbra */}
                  <div className="flex justify-end">
                    <a
                      href="/pricing#founding-member"
                      className="shrink-0 inline-flex items-center rounded-md bg-black/20 px-3 py-1.5 text-sm font-semibold hover:bg-black/25 transition"
                    >
                      {t.ltd?.ctaShort || 'Claim now'}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-100 text-gray-700 rounded-xl mb-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-sm text-center">
                {t.ltd?.ended || 'The Lifetime Deal has ended.'}
              </div>
            </div>
          )}

          {/* Trial + no credit card */}
          <div className="max-w-2xl mx-auto text-center mt-2 mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-2 text-sm font-semibold mb-2"
            >
              <Sparkles className="w-4 h-4" />
              {t.freeTrialBanner}
            </motion.div>
          </div>

          {/* Toggle Monthly / Yearly */}
          <div className="flex justify-center items-center mt-2 mb-10">
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

{/* Pricing Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {[
    {
      key: 'solo',
      name: 'Solo',
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
      period: '/month',
      highlight: false,
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
    /*
    {
      key: 'unlimited',
      name: 'Professional',
      period: '/month',
      highlight: false,
      features: [ ... ],
      buttonText: 'Get Started'
    },
    */
  ].map((plan) => {
    const planTranslation = t.pricingPlans?.[plan.key];
    return (
      <Card
        key={plan.key}
        className={`p-8 w-full text-left flex flex-col h-full ${plan.highlight ? 'border border-[#4FC3F7] ring-2 ring-[#4FC3F7]' : ''}`}
      >
        <h3 className="h3 text-gray-900 mb-4">
          {planTranslation?.name || plan.name}
        </h3>

        <div className="flex items-baseline mb-8">
          <span className="text-4xl font-bold text-gray-900">
            {teaserDisplayPrice(plan.key as 'solo'|'growth')}
          </span>
          <span className="text-gray-500 ml-1">
            {showAnnual ? '/year' : (planTranslation?.period || plan.period)}
          </span>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
          {(planTranslation?.features || plan.features).map((feature: string) => (
            <li key={feature} className="flex items-start gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <span>{feature}</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          onClick={() => fbq?.('trackCustom', `Landing_Pricing_CTA_${plan.key.toUpperCase()}`)}
          to={`/auth?mode=register&plan=${plan.key}${showAnnual ? '_yearly' : ''}&currency=${currency}`}
          className={`mt-auto inline-block w-full py-4 rounded-2xl font-semibold text-center text-white bg-[#4FC3F7] hover:bg-[#1A8FBF] shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 transition pulse-custom ${plan.highlight ? 'animate-pulse-cyan-shadow' : ''}`}
        >
          {planTranslation?.buttonText || plan.buttonText}
        </Link>
      </Card>
    );
  })}

  {/* Founding Member Lifetime Deal Card */}
  <Card
    key="founding-member"
    className="relative p-8 w-full text-left flex flex-col h-full ring-4 ring-yellow-400/70 overflow-hidden"
  >
    <div
      className="pointer-events-none absolute inset-0 rounded-2xl"
      style={{ background: 'radial-gradient(120% 80% at 50% -10%, rgba(255,215,0,0.25), transparent 60%)' }}
    />
    <div className="absolute top-4 right-4 z-[1]">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-900 border border-yellow-300">
        {t.ltd?.badge || 'Lifetime'}
      </span>
    </div>

    <div className="relative z-[1] flex flex-col h-full">
      <h3 className="h3 text-gray-900 mb-1">{t.ltd?.title || 'Founding Member'}</h3>
      <p className="text-sm text-gray-600 mb-4">{t.ltd?.subtitle || 'Pay once. Use forever.'}</p>

      <div className="mb-4">
        <div className="text-4xl font-black text-gray-900">{fmtMoney(fmBase)}</div>
        <div className="text-xs text-gray-500">{t.ltd?.priceNote || 'one-time for 1 business'}</div>
      </div>

      <ul className="space-y-2 text-base text-gray-700 mb-5">
        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> {t.ltd?.features?.wheels   || 'Up to 3 Wheel of Fortunes'}</li>
        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> {t.ltd?.features?.reviews  || '200 new reviews/month'}</li>
        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> {t.ltd?.features?.emails   || 'Download guest emails'}</li>
        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> {t.ltd?.features?.tutorials|| 'Short video tutorials'}</li>
        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> {t.ltd?.features?.stats    || 'Your own stats dashboard'}</li>
        <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-500" /> {t.ltd?.features?.updates || 'All future updates'}</li>
      </ul>

      <div className="mb-4">
        <label htmlFor="teaserExtraBiz" className="block text-sm font-medium text-gray-800 mb-1">
          {t.ltd?.addExtraLabel || 'Add extra business'}
        </label>
        <div className="flex items-center gap-2">
          <select
            id="teaserExtraBiz"
            value={extraBusinesses}
            onChange={(e) => setExtraBusinesses(Math.max(0, Math.min(FM_ADDON_MAX, Number(e.target.value))))}
            className="border rounded-lg px-3 py-2 text-gray-800"
          >
            {Array.from({ length: FM_ADDON_MAX + 1 }, (_, i) => i).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span className="text-sm text-gray-600">
            {t.ltd?.each?.replace?.('{price}', fmtMoney(fmAddon)) || `+${fmtMoney(fmAddon)} each`}
          </span>
        </div>
        {extraBusinesses > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            {fmtMoney(fmAddon)} × {extraBusinesses} = {fmtMoney(fmAddon * extraBusinesses)}
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-gray-700">{t.ltd?.totalLabel || 'Total'}</span>
          <span className="text-2xl font-semibold text-gray-900">{fmtMoney(fmTotal)}</span>
        </div>
      </div>

      <button
        onClick={() => (window.location.href = '/pricing#founding-member')}
        className="mt-auto w-full py-3 px-4 rounded-lg font-semibold transition-all text-white bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 shadow-[0_8px_20px_rgba(234,179,8,0.35)] pulse-custom"
      >
        {t.ltd?.cta || 'Get Founding Member Lifetime'}
      </button>
    </div>
  </Card>

  {/* Inquiry / Contact Card */}
  <Card key="inquiry-card" className="p-8 w-full text-left flex flex-col h-full">
    <h3 className="h3 text-gray-900 mb-2">
      {language === 'hu' ? 'Még nem tudom. Kérdésem lenne, beszéljünk.' : "Not sure yet? Let's talk."}
    </h3>
    <p className="text-gray-600 mb-6">
      {language === 'hu'
        ? 'Segítünk kiválasztani a megfelelő csomagot és megválaszoljuk a kérdéseid.'
        : "We'll help you choose the right plan and answer any questions."}
    </p>

    <ul className="space-y-3 mb-8">
      <li className="flex items-start gap-2 text-gray-600"><Check className="w-5 h-5 text-green-500 mt-1" /> {language === 'hu' ? '15–20 perces gyors egyeztetés' : 'Quick 15–20 min discovery call'}</li>
      <li className="flex items-start gap-2 text-gray-600"><Check className="w-5 h-5 text-green-500 mt-1" /> {language === 'hu' ? 'Demó, válaszok, ajánlás' : 'Short demo, answers, recommendation'}</li>
      <li className="flex items-start gap-2 text-gray-600"><Check className="w-5 h-5 text-green-500 mt-1" /> {language === 'hu' ? 'Egyedi ajánlat 3-nál több üzlet esetén' : 'Custom offer for 3+ businesses'}</li>
    </ul>

    <div className="mt-auto grid grid-cols-1 gap-3">
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 px-4 rounded-lg font-medium text-[#0a7c4a] bg-green-50 hover:bg-green-100 border border-green-200 text-center"
      >
        {language === 'hu' ? 'Írok WhatsAppon' : 'WhatsApp us'}
      </a>

      <a
        href={language === 'hu' ? CALENDLY_LINK_HU : CALENDLY_LINK_EN}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 px-4 rounded-lg font-medium text-white bg-[#4FC3F7] hover:bg-[#1A8FBF] shadow-[0_12px_28px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-sky-300/40 text-center pulse-custom"
      >
        {language === 'hu' ? 'Foglalok időpontot' : 'Book a call'}
      </a>
    </div>
  </Card>
</div>

        </div>
      </Section>


      {/* Final CTA Section */}
      <section className="py-8" style={{ backgroundColor: '#4FC3F7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="h2 mb-4 text-white">{t.finalCtaTitle}</h2>
        </div>
      </section>

      <Footer />
    </div>
  );
}