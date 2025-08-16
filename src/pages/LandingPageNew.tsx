import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, QrCode, Trophy, CheckCircle2, Brain, TrendingUp, Check, Sparkles, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import useTranslation from '../hooks/useTranslation';
import { useOptiMonk } from '../hooks/useOptiMonk';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import '../styles/typography.css';
import RoiCalculator from '../components/RoiCalculator';

export default function LandingPageNew() {
  const navigate = useNavigate();
  const [showAnnual, setShowAnnual] = useState(false);
  const calculatePrice = (price: number) => {
    return showAnnual ? (price * 12 * 0.8).toFixed(2) : price.toFixed(2);
  };

  const { t } = useTranslation();
  
  // Use the OptiMonk hook instead of the manual implementation
  useOptiMonk();
  
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 pt-8 sm:pt-24 pb-8 sm:pb-24 lg:pb-18 lg:min-h-[75vh] overflow-hidden">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-y-3 sm:gap-y-12 gap-x-0 md:gap-12 items-center">
            <div className="text-center sm:text-left">
            <motion.h1 
            className="text-4xl sm:text-5xl lg:text-[3rem] lg:leading-tight mb-4"
            style={{ color: '#4FC3F7', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
           {...fadeIn}
            >
            {t.landingHeroHeadline}
            </motion.h1>

              <motion.p 
                className="text-lg sm:text-2xl lg:text-[1.5rem] lg:leading-relaxed text-gray-600 mb-4"
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

                    // ha van fix/ sticky navbarod, állítsd be a szelektort
                    const header = document.querySelector('nav, [data-fixed-header]')?.offsetHeight || 0;

                    const y = el.getBoundingClientRect().top + window.scrollY - header + 10; // +10px lefelé
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-[#4FC3F7] text-white font-semibold text-lg lg:text-xl shadow-lg hover:brightness-110 transition animate-pulse-cyan-shadow"
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

{/* Crisis / Review Impact Section */}
<Section className="pt-0 pb-2">
  <motion.div
    className="flex flex-col items-center max-w-3xl mx-auto text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div
      className="space-y-6 text-lg text-gray-700"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <h3 className="text-2xl font-semibold text-gray-900">
        {t.crisisHeadline}
      </h3>

      <p
        className="text-base sm:text-lg"
        dangerouslySetInnerHTML={{ __html: t.crisisDescription }}
      />

<p
  className="font-medium text-gray-800"
  dangerouslySetInnerHTML={{ __html: t.crisisSolution }}
/>
    </div>

{/* Calculator – */}
<section 
  id="roi-calculator"
  className="py-6 bg-white"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <RoiCalculator hideFooterNote={false} />
  </div>
</section>

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
  </motion.div>
</Section>

      {/* Info Section: Review Impact Stats */}
      <Section className="pt-4 pb-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left - Text */}
          <div className="space-y-8 text-center sm:text-left">
            {/* More reviews = more revenue */}
            <div>
              <h2 className="h2 text-gray-900" style={{ fontFamily: 'Alexandria, sans-serif' }}>
                {t.infoBlock1Headline}
              </h2>
              <p className="mt-4 text-lg text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t.infoBlock1Body}
              </p>
            </div>

            {/* Fresh reviews drive results */}
            <div>
              <p className="mt-4 text-lg text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {/* Removed headline */}
              </p>
              <p className="mt-4 text-lg text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t.infoBlock2Body}
              </p>
            </div>

            {/* Call to action context */}
            <div className="pt-1">
              <p className="text-lg text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t.infoBlock3Body}
              </p>
              <p className="mt-4 text-xl text-gray-900 font-semibold" style={{ fontFamily: 'Alexandria, sans-serif' }}>
                {t.infoBlockFinalCta}
              </p>
            </div>
          </div>

          {/* Right - Image */}
          <Card className="w-full max-w-lg mx-auto">
            <img
              src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/word-of-mouth.jpg"
              alt="Review to Revenue additional visual"
              className="rounded-xl w-full object-cover"
            />
          </Card>
        </div>
      </Section>

      {/* Pain Points – 3 Problems Block */}
      <Section className="pt-4 pb-4">
        {/* Headline */}
        <motion.div
          className="max-w-6xl mx-auto text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="h2 text-gray-900"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
          >
            {t.problemsBlockHeadline}
          </h2>
        </motion.div>

        {/* 3 Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              num: '1',
              title: t.problems1Title,
              bullets: [
                t.problems1Bullet1,
                t.problems1Bullet2,
                t.problems1Bullet3,
              ],
            },
            {
              num: '2',
              title: t.problems2Title,
              bullets: [
                t.problems2Bullet1,
                t.problems2Bullet2,
                t.problems2Bullet3,
              ],
            },
            {
              num: '3',
              title: t.problems3Title,
              bullets: [
                t.problems3Bullet1,
                t.problems3Bullet2,
                t.problems3Bullet3,
              ],
            },
          ].map((p, idx) => (
            <motion.div
              key={p.num}
              className="bg-gray-50 rounded-xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              {/* Number + Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4FC3F7] text-white text-xl font-bold">
                  {p.num}
                </div>
                <h3 className="h3 text-gray-900">{p.title}</h3>
              </div>

              {/* Bullet list */}
              <ul className="space-y-4 list-disc list-inside text-gray-700">
                {p.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="text-base sm:text-lg"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

{/* Question → Good News (merged) */}
<Section>
  <motion.div
    className="max-w-4xl mx-auto text-center space-y-10"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    {/* Kérdés – headline */}
    <h2
      className="h2 text-gray-900"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.transitionQuestionHeadline}
    </h2>

    {/* Kép */}
    <div className="flex justify-center my-6">
      <img
        src="https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/hell-yes.jpg"
        alt="Excited customer"
        className="w-full max-w-md rounded-xl shadow-lg object-cover"
      />
    </div>

    {/* Új leírás blokk */}
    <div className="space-y-6">
      <p
        className="text-lg text-gray-700"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.newBlockDescription }}
      />
    </div>
  </motion.div>
</Section>

{/* Review-to-Revenue Intro Section – New Version */}
<Section id="how-to-use" className="pt-4 pb-0">
  <div className="max-w-4xl mx-auto text-center space-y-8">
    {/* Címsor */}
    <h3
      className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4"
      style={{ fontFamily: 'Alexandria, sans-serif' }}
    >
      {t.r2rHowToUseTitle}
    </h3>

    {/* Bevezető szöveg */}
    <div className="space-y-6 text-left text-lg text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <p dangerouslySetInnerHTML={{ __html: t.r2rHowToUseIntro1 }} />
      <p dangerouslySetInnerHTML={{ __html: t.r2rHowToUseIntro2 }} />
      <p dangerouslySetInnerHTML={{ __html: t.r2rHowToUseQuestion }} />
    </div>

    {/* Lépések számozva */}
    <div className="grid gap-6 mt-8">
      {t.r2rHowToUseSteps.map((text: string, idx: number) => (
        <div
          key={idx}
          className="flex items-start gap-4 bg-gray-50 p-6 rounded-xl shadow-md"
        >
          <div
            className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-[#4FC3F7] text-white text-xl font-bold shrink-0"
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

    {/* Lábrész + CTA gomb */}
    <div className="space-y-6 mt-10">
      <p
        className="text-sm text-gray-500 italic"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        dangerouslySetInnerHTML={{ __html: t.r2rHowToUseFootnote }}
      />
      <div className="flex justify-center">
        <motion.button
          onClick={() => {
            fbq('trackCustom', 'Landing_Features_CTA');
            const el = document.getElementById('setup-steps');
            if (!el) return;

            const header = document.querySelector('nav, [data-fixed-header]')?.offsetHeight || 0;
            const y = el.getBoundingClientRect().top + window.scrollY - header + 10;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }}
          className="inline-flex items-center px-8 py-4 rounded-xl bg-[#4FC3F7] text-white font-semibold text-lg lg:text-xl shadow-lg hover:brightness-110 transition animate-pulse-cyan-shadow"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t.ctaSecondary}
        </motion.button>
      </div>
    </div>
  </div>
</Section>

{/* Extended leírás blokk */}
<Section>
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="space-y-6 max-w-4xl mx-auto text-center"
  >
    <p
      className="text-lg text-gray-700"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
      dangerouslySetInnerHTML={{ __html: t.newBlockDescriptionExtended }}
    />
  </motion.div>
</Section>


        {/* 3+1 Revenue Boosters */}
        <Section>
        {/* Headline */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="h2 text-gray-900"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
          >
            {t.revenueBlockHeadline}
          </h2>
        </motion.div>

        {/* 4 Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            {
              num: '1.',
              title: t.rev1Title,
              body: t.rev1Body
            },
            {
              num: '2.',
              title: t.rev2Title,
              body: t.rev2Body
            },
            {
              num: '3.',
              title: t.rev3Title,
              body: t.rev3Body
            },
            {
              num: '+1',
              title: t.rev4Title,
              body: t.rev4Body
            }
          ].map((item, idx) => (
            <motion.div
              key={item.num}
              className="bg-gray-50 rounded-xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              {/* Number + Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4FC3F7] text-white text-xl font-bold">
                  {item.num}
                </div>
                <h3 className="h3 text-gray-900">{item.title}</h3>
              </div>

              {/* Body */}
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <motion.button
            onClick={() => {
              fbq('trackCustom', 'Landing_RevenueBooster_CTA');
              document.getElementById('pricing-teaser')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center px-8 py-4 rounded-xl bg-[#4FC3F7] text-white font-semibold text-lg lg:text-xl shadow-lg hover:brightness-110 transition animate-pulse-cyan-shadow"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t.revenueBlockCta}
          </motion.button>
        </div>
      </Section>

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

      {/* Review-to-Revenue Guest Experience Headline (moved) */}
      <Section className="pt-0 pb-0 -mt-3 -mb-6">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="h2 text-gray-900" style={{ fontFamily: 'Alexandria, sans-serif' }}>
      {t.r2rGuestExperienceHeadline}
    </h2>
  </div>
</Section>

      {/* Gamified Request + Wheel Demo side-by-side */}
      <Section className="pb-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left - Text + CTA */}
          <div className="space-y-8 text-center sm:text-left">
            <h3 className="h3 text-gray-900" style={{ fontFamily: 'Alexandria, sans-serif' }}>
              {t.gamifiedRequestHeadline}
            </h3>

            <p
              className="text-lg text-gray-700"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              dangerouslySetInnerHTML={{ __html: t.gamifiedRequestText }}
            />
            {t.engagementBoostHeadline && (
              <>
                <h2 className="h2 text-gray-900 pt-4" style={{ fontFamily: 'Alexandria, sans-serif' }}>
                  {t.engagementBoostHeadline}
                </h2>
                <p
                  className="text-lg text-gray-700"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  dangerouslySetInnerHTML={{ __html: t.engagementBoostText }}
                />
              </>
            )}

            {/* CTA gomb bent tartva a bal oldali blokkon belül */}
            <motion.button
              onClick={() => {
                fbq('trackCustom', 'Landing_Gamified_CTA');
                document.getElementById('pricing-teaser')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-4 inline-flex items-center px-8 py-4 rounded-xl bg-[#4FC3F7] text-white font-semibold text-lg lg:text-xl shadow-lg hover:brightness-110 transition animate-pulse-cyan-shadow"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {t.ctaTertiary}
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
                ></video>
              </div>
            </Card>
          </motion.div>
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

          {/* H3 – lezáró mondat */}
          <h3
            className="text-xl text-gray-800 font-semibold leading-snug max-w-2xl mx-auto mb-12"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
          >
            {t.trustedBySectionClosing}
          </h3>

  {/* Core Benefits Section */}
  <Section className="pb-8">
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
  </Section>

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

      {/* Satisfied guests headline */}
      <h2
        className="h2 text-gray-900 mt-8 mb-12 text-center mx-auto max-w-4xl px-4"
        style={{ fontFamily: 'Alexandria, sans-serif' }}
      >
        {t.satisfiedGuestsToMarketing}
      </h2>


      {/* Stats Section */}
      <section className="py-16 bg-[#4FC3F7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="h1 mb-4 text-white">
            {t.statsTitle}
          </h2>
          <p className="text-xl text-blue-100">
            {t.statsDescription}
          </p>
        </div>
      </section>


      {/* Testimonials Section */}
      <Section className="pt-6 bg-gray-50">
        <div className="text-center">
          <h2 className="h2 text-gray-900 mb-12 text-center">
            {t.testimonialsTitle}
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <TestimonialsCarousel />
            </div>
          </div>
        </div>
      </Section>

{/* 5+1 Setup Steps Block */}
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

  <ol className="mt-8 grid gap-4 sm:grid-cols-2">
    {t.setupSteps.map((step: string, idx: number) => (
      <li
        key={idx}
        className="relative p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/60 shadow-sm text-left"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {/* Számozott badge (az utolsó elem +1) */}
        <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-[#4FC3F7] text-white flex items-center justify-center font-bold shadow-md">
          {idx === t.setupSteps.length - 1 ? '+1' : idx + 1}
        </div>
        <p className="text-gray-800 leading-relaxed">{step}</p>
      </li>
    ))}
  </ol>

  <p
    className="mt-6 text-lg text-gray-700"
    style={{ fontFamily: 'Montserrat, sans-serif' }}
  >
    {t.setupStepsOutro}
  </p>
</div>

      {/* In-page Pricing Teaser */}
      <Section id="pricing-teaser">
        <div className="text-center">
<h2 className="text-xl text-center text-gray-900 font-semibold mb-6">
  {t.moreReviewsFlow}
</h2>
          <h2 className="h2 text-gray-900 mb-4">
            {t.pricingTeaserTitle || "Simple, scalable pricing"}
          </h2>

          {/* Trial + no credit card */}
          <div className="max-w-2xl mx-auto text-center mt-2 mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-2 text-sm font-semibold mb-2"
            >
              <Sparkles className="w-4 h-4" />
              {t.freeTrialBanner || "Start your 14-day free trial — no credit card required!"}
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
              const planTranslation = t.pricingPlans?.[plan.key];
              return (
                <Card
                  key={plan.key}
                  className={`p-8 w-full max-w-sm text-left ${plan.highlight ? 'border border-[#4FC3F7] ring-2 ring-[#4FC3F7]' : ''}`}
                >
                  <h3 className="h3 text-gray-900 mb-4">
                    {planTranslation?.name || plan.name}
                  </h3>

                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold text-gray-900">
                      ${calculatePrice(plan.price)}
                    </span>
                    <span className="text-gray-500 ml-1">
                      {showAnnual ? '/year' : planTranslation?.period || plan.period}
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {(planTranslation?.features || plan.features).map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2 text-gray-600">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://reviewtorevenue.io/auth?mode=register&plan=${plan.key}${showAnnual ? '_yearly' : ''}&redirect=%2Fpricing&src=za`}
                    onClick={() => fbq('trackCustom', `Landing_Pricing_CTA_${plan.key.toUpperCase()}`)}
                    className={`inline-block w-full py-4 rounded-full font-semibold text-center text-white bg-[#4FC3F7] hover:brightness-110 transition ${
                      plan.highlight ? 'animate-pulse-cyan-shadow' : ''
                    }`}
                  >
                    {planTranslation?.buttonText || plan.buttonText}
                  </a>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>


      {/* Final CTA Section */}
      <section className="py-16" style={{ backgroundColor: '#4FC3F7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="h1 mb-4 text-white">{t.finalCtaTitle}</h2>
          <p className="text-xl text-white">{t.finalCtaDescription}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}