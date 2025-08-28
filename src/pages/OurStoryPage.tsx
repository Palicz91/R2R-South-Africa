// src/pages/OurStoryPage.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Layout from '../components/Layout';
import PublicNavBar from '../components/PublicNavBar';
import Section from '../components/ui/Section';
import Footer from '../components/Footer';
import PartnerFormModal from "../components/PartnerFormModal";
import { motion } from 'framer-motion';
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';

const translations = {
  en: {
    manifestoSectionTitle: "Our Manifesto",
    manifestoSectionDescription: "A manifesto is a clear and public declaration of values, intentions, and beliefs. Ours lays the foundation for everything we build — and how we build it.",
    wePlayBigTitle: "1. We Play Big",
wePlayBigParagraphs: [
  `Our goal is not to launch a <strong>"nice-to-have"</strong> subscription product, but to <strong>reform how businesses collect reviews</strong>. There should be no more awkward moments asking for reviews. The goal is that employees feel they’re genuinely helping the guest — since the guest might win something big.`,
  `With a single transaction, we don’t just collect a review — we also <strong>generate a repeat customer</strong> and <strong>build an email list</strong>. <strong>One transaction, three wins</strong> — without discomfort.`,
  `<strong>One of our test venues doubled their review count in 3 weeks</strong> — without embarrassingly asking guests even once.`,
  `Too many amazing small businesses go unnoticed — <strong>not because they aren’t great</strong>, but because no one knows they exist. We’re changing that.`,
  `<strong>We’re aiming for 1,000 customers</strong> in our first year and <strong>10,000 in three years</strong>.`,
],
    topTechLeanOrgTitle: "2. Top Technology and Lean Organization",
    topTechLeanOrgParagraph: `We don’t pile up employees – we <strong>automate at every possible level</strong>. We use <strong>AI and other top-notch technologies</strong>. The whole platform was built to always keep <strong>customer experience, logic, and business thinking</strong> in focus.`,
    highRiskTitle: "3. High Risk, High Reward",
    highRiskParagraphs: [
      `As mentioned, we’re not looking for <strong>employees</strong> – we’re looking for <span class="text-[#4FC3F7] font-semibold">partners</span>. <strong>People who are hungry</strong>, who want to create something big, but haven’t yet found how or with what. People who are happy to put in <strong>time and energy</strong> into something with <strong>real business potential</strong>.`,
      `People who <strong>accept the risk of failure</strong> – but instead of being paralyzed by it, are <strong>driven to try again</strong>, test another method, take a different approach.`,
      `It’s a bonus if you have <strong>contacts in hospitality</strong>, but for now it’s enough if you’re willing to work <span class="text-[#4FC3F7] font-semibold">hard and/or smart</span> for the goal.`,
      `If you’ve been looking for that <span class="text-[#4FC3F7] font-semibold">“one thing”</span> to pour yourself into – this might be it.`,
      `And what do you get in return? <strong>High reward</strong>. Not pennies – you earn up to <span class="text-[#4FC3F7] font-semibold">50% of all revenue</span> from clients you bring in – <span class="text-[#4FC3F7] font-semibold">for life</span>.`,
      `We provide <strong>training</strong>, <strong>peer knowledge-sharing</strong>, access to a <strong>working product</strong> and <strong>full tech infrastructure</strong>.`,
      `We already have partners in <span class="text-[#4FC3F7] font-semibold">Hungary, UK, Indonesia, Singapore, and Switzerland</span>, and more than <span class="text-[#4FC3F7] font-semibold">40 businesses</span> are actively using the product.`,
    ],    
    innovationTitle: "4. Innovation and Adaptation",
    innovationParagraphs: [
  `<strong>We don’t sit on decisions</strong> for weeks or months.`,
  `What works, we <strong>double down on</strong>. What doesn’t, we <strong>drop fast</strong>.`,
  `<strong>Fast decisions. Faster action.</strong>`,
  `If we make a mistake — <span class="text-[#4FC3F7] font-semibold">no problem</span>. We fix it.`,
    ],
    openCommunicationTitle: "5. Open Communication",
    openCommunicationParagraphs: [
  `We communicate <strong>honestly and openly</strong> with each other, with <strong>maximum respect</strong> — and with confrontation, if necessary.`,
  `Say what you think, even if you're <strong>playing devil’s advocate</strong>.`,
  `Ask what you don’t know or aren’t sure about — <span class="text-[#4FC3F7] font-semibold">there are no bad questions</span>, only the ones you didn’t ask.`,
    ],
    customerCenteredTitle: "6. Customer-Centered Thinking",
    customerCenteredParagraphs: [
  `Our goal is to provide customers with the <strong>best experience</strong> and <strong>top-tier service</strong>.`,
  `We aim for <strong>solutions</strong> and <strong>win-win situations</strong>.`,
  `We communicate <strong>transparently</strong> with customers — even when it’s uncomfortable.`,
  `We prioritize <strong>long-term customer satisfaction</strong> over short-term interests.`,
  `We see customers as <span class="text-[#4FC3F7] font-semibold">partners — equals</span>. We’re neither above them nor below. And because this is what we give, we expect the same in return.`,
  `We commit to a <span class="text-[#4FC3F7] font-semibold">24-hour response SLA</span> across all active support channels.`,
    ],
    simplicityTitle: "7. Simplicity",
    simplicityParagraphs: [
  `At every level, we strive for <strong>simplicity</strong>.`,
  `The platform is built so that anyone can <strong>create their first QR code</strong> — ready to print — <span class="text-[#4FC3F7] font-semibold">in 5 minutes</span>.`,
  `The simpler a solution or idea, the <strong>better</strong> and more <strong>valuable</strong> it is.`,
  `Review to Revenue uses <strong>simple psychology</strong>, <strong>sales</strong>, and <strong>gamification techniques</strong> to elevate the review collection process to a whole new level.`,
    ],
    freedomTitle: "8. Freedom",
    freedomParagraphs: [
  `We believe everyone can <strong>organize and manage their own life</strong>, and that we’re most effective when <strong>working in our own rhythm</strong> — wherever we are in the world.`,
  `For those with a <span class="text-[#4FC3F7] font-semibold">high risk, high reward</span> mentality, this freedom doesn’t reduce effectiveness — <strong>it multiplies it</strong>, and brings <strong>long-term satisfaction</strong>.`,
  `This freedom comes paired with <strong>clear scorecards</strong>, <strong>metrics</strong>, and <strong>shared accountability</strong>.`,
    ],
    bootstrapTitle: "+1 Bootstrap",
    bootstrapParagraphs: [
  `We’re building <strong>organically, from the ground up</strong>, without external funding.`,
  `We don’t plan to take on outside capital, because we won’t put ourselves under <strong>financial or growth pressure</strong> that would compromise our <strong>company’s culture</strong>, <strong>customer-centricity</strong>, or <strong>core values</strong>.`,
  `Staying <span class="font-semibold text-white underline">VC-free</span> allows us to <strong>move intentionally</strong>, <strong>serve our customers — not investors</strong>, and <strong>stay true to the mission</strong>, not a growth-at-all-costs narrative.`,
    ],
    closingSectionTitle: "🚀 Ready to play big with us?",
    closingSectionText: `Become a partner because the time is now! Join the movement that's turning invisible businesses into local legends.<br />You're not just signing up to a tool. You're joining a team that believes local businesses deserve the spotlight – and we’re building it together.`,
    closingCta: "Become a Founding Partner",
    meetTeamTitle: "Meet Our Team",
    exclusiveBadge: "Exclusive Partner",
    adamRole: "Founder & CEO – Bali",
    silingRole: "Strategic Partner – Singapore",
    anitaRole: "Strategic Partner – Hungary",
    greigRole: "Exclusive Partner",
    aliceRole: "Partner",
    partnerCountriesText: "We're also proud to have partners in the UK 🇬🇧, Switzerland 🇨🇭, Indonesia 🇮🇩 and Croatia 🇭🇷.", 

    adamQuote: `Whenever I travel, I choose the restaurant, café, hotel — even the gym — based on reviews. But honestly, some of the best spots are totally off the radar...`,
    silingQuote: `I never book a table without checking reviews first. But last week I found this incredible family restaurant with only 56 reviews – they'd been open for 15 years.`,
    anitaQuote: `A Google Review is an under-the-radar marketing tool. If a guest sees a 4.2-star and a 4.8-star place on the map, they'll almost always choose the 4.8. It's simple psychology: if that many people were satisfied, chances are I will be too.`,
    greigQuote: `In South Africa's SMB market, many businesses operate far below their potential and lack the big marketing budgets to boost revenue. Review to Revenue offers an affordable, effective way to increase visibility, attract new customers, and keep them coming back.`,
    aliceQuote: `In New York and California, great spots can get buried under noise. When a guest's voice becomes visible proof, discovery and repeat visits follow. Review to Revenue makes that simple: one scan, one game, one more reason to come back.`,

  }
};

export default function OurStoryPage() {
  const t = translations.en;
  const [open, setOpen] = useState(false);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const storyContent = (
    <>
      {/* Hero Section - gradient from-blue-50 to-indigo-50 */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-[#4FC3F7]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
           {t.manifestoSectionTitle}
          </motion.h1>
          <motion.p
            className="mt-4 italic text-base sm:text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontFamily: 'Alexandria, sans-serif' }}
          >
            {t.manifestoSectionDescription}
          </motion.p>
        </div>
        
        {/* Background blobs for hero */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* 1. We Play Big - white */}
      <Section className="py-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-bold mr-1">1.</span>
            {t.wePlayBigTitle.replace('1. ', '')}
          </motion.h3>

          <div className="space-y-12">
            {t.wePlayBigParagraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                className="text-base sm:text-lg text-gray-700 leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 2. Top Tech & Lean - bg-blue-50 */}
      <Section className="py-6 bg-blue-50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-bold mr-1">2.</span>
            {t.topTechLeanOrgTitle.replace('2. ', '')}
          </motion.h3>

          <motion.p
            className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: t.topTechLeanOrgParagraph }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
        </div>
      </Section>

      {/* 3. High Risk, High Reward - gray-50 */}
      <Section className="py-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-bold mr-1">3.</span>
            {t.highRiskTitle.replace('3. ', '')}
          </motion.h3>

          <div className="space-y-10">
            {t.highRiskParagraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                className="text-base sm:text-lg text-gray-700 leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 4. Innovation & Adaptation - landing gradient */}
      <Section className="py-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-bold mr-1">4.</span>
            {t.innovationTitle.replace('4. ', '')}
          </motion.h3>

          <div className="space-y-10">
            {t.innovationParagraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                className="text-base sm:text-lg text-gray-700 leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 5. Open Communication - white */}
      <Section className="py-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-bold mr-1">5.</span>
            {t.openCommunicationTitle.replace('5. ', '')}
          </motion.h3>

          <div className="space-y-8">
            {t.openCommunicationParagraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                className="text-base sm:text-lg text-gray-700 leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 6. Customer-Centered - bg-indigo-50 */}
      <Section className="py-6 bg-indigo-50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-bold mr-1">6.</span>
            {t.customerCenteredTitle.replace('6. ', '')}
          </motion.h3>

          <div className="space-y-8">
            {t.customerCenteredParagraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                className="text-base sm:text-lg text-gray-700 leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 7. Simplicity - white */}
      <Section className="py-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-bold mr-1">7.</span>
            {t.simplicityTitle.replace('7. ', '')}
          </motion.h3>

          <div className="space-y-8">
            {t.simplicityParagraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                className="text-base sm:text-lg text-gray-700 leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 8. Freedom - gray-50 */}
      <Section className="py-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-bold mr-1">8.</span>
            {t.freedomTitle.replace('8. ', '')}
          </motion.h3>

          <div className="space-y-8">
            {t.freedomParagraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                className="text-base sm:text-lg text-gray-700 leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 9. +1 Bootstrap - solid brand blue bg-[#4FC3F7] */}
      <Section className="py-6 bg-[#4FC3F7] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-10"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t.bootstrapTitle}
          </motion.h2>

          <div className="space-y-8 text-lg sm:text-xl text-blue-50" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t.bootstrapParagraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: paragraph }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Meet Our Team */}
      <Section className="py-8 bg-white">
  <motion.h2
    className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12"
    style={{ fontFamily: 'Alexandria, sans-serif' }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    {t.meetTeamTitle}
  </motion.h2>

  <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
    {[
      {
        img: 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/adam-founder%20copy.jpg',
        name: 'Adam Palicz',
        country: 'Bali',
        flag: '🇮🇩',
        role: 'Founder & CEO',
        exclusive: true,
        quote: t.adamQuote,
        socials: {
          linkedin: 'https://www.linkedin.com/in/adampalicz/'
        }
      },
      {
        img: 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/greig.jpeg',
        name: 'Greig Stephen Fitzell',
        country: 'South Africa',
        flag: '🇿🇦',
        role: t.greigRole,
        exclusive: true,
        quote: t.greigQuote,
        socials: {
          linkedin: 'https://www.linkedin.com/in/greig-fitzell/'
        }
      },
      {
        img: 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/anita-gal.png',
        name: 'Anita Gál',
        country: 'Hungary',
        flag: '🇭🇺',
        role: '',
        exclusive: true,
        quote: t.anitaQuote,
        socials: {
          facebook: 'https://www.facebook.com/anyavallalkozo',
          instagram: 'https://www.instagram.com/anyavallalkozo/'
        }
      },
    ].map(({ img, name, country, flag, role, exclusive, quote, socials }, idx) => (
      <motion.div
        key={name}
        className={`text-center space-y-4 ring-2 ring-[#4FC3F7] rounded-xl p-6`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.2 }}
      >
        {/* egységes avatar-wrapper mindenkinél */}
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
          <img
            src={img}
            alt={name}
            className={`w-full h-full object-cover
              ${name === "Syed Shaddad" ? "object-[center_40%]" : ""}
            `}
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>

        <div className="flex items-center justify-center flex-wrap gap-2 text-sm text-gray-600">
          {role ? (
            <span className="px-3 py-1 bg-[#4FC3F7] text-white text-xs font-semibold rounded-full">
              {role}
            </span>
          ) : exclusive && (
            <span className="px-3 py-1 bg-[#4FC3F7] text-white text-xs font-semibold rounded-full">
              {t.exclusiveBadge}
            </span>
          )}
          <span className="font-semibold">{country} {flag}</span>
        </div>

        {/* Quote section */}
        {quote && (
          <p className="italic text-gray-600 mt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            "{quote}"
          </p>
        )}

        {/* Social ikonok */}
        {socials && (
          <div className="flex justify-center gap-4 mt-4 text-xl">
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A66C2] hover:opacity-80"
              >
                <FaLinkedin />
              </a>
            )}
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:opacity-80"
              >
                <FaFacebook />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E4405F] hover:opacity-80"
              >
                <FaInstagram />
              </a>
            )}
          </div>
        )}
      </motion.div>
    ))}
  </div>

  {/* Second row: Siling, Alice, Syed */}
  <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto mt-6">
    {[
      {
        img: 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/silin-gan.png',
        name: 'Siling Gan',
        country: 'Singapore',
        flag: '🇸🇬',
        role: '',
        exclusive: true,
        quote: t.silingQuote,
        socials: {
          linkedin: 'https://www.linkedin.com/in/silinggankheeeng/'
        }
      },
      {
        img: 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/alice-tan.jpeg',
        name: 'Alice Tan',
        country: 'USA',
        flag: '🇺🇸',
        role: t.aliceRole,
        exclusive: false,
        quote: t.aliceQuote,
        socials: {
          linkedin: 'https://www.linkedin.com/in/alice2023/'
        }
      },
      {
        img: 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/Syed.jpeg',
        name: 'Syed Shaddad',
        country: 'Malaysia',
        flag: '🇲🇾',
        role: t.syedRole,
        exclusive: false,
        quote: t.syedQuote,
        socials: {
          linkedin: 'https://www.linkedin.com/in/syedshaddad/'
        }
      },
    ].map(({ img, name, country, flag, role, exclusive, quote, socials }, idx) => (
      <motion.div
        key={name}
        className="text-center space-y-4 ring-2 ring-[#4FC3F7] rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.15 }}
      >
        {/* egységes avatar-wrapper mindenkinél */}
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
          <img
            src={img}
            alt={name}
            className={`w-full h-full object-cover
              ${name === "Syed Shaddad" ? "object-[center_40%]" : ""}
            `}
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>

        <div className="flex items-center justify-center flex-wrap gap-2 text-sm text-gray-600">
          {role ? (
            <span className="px-3 py-1 bg-[#4FC3F7] text-white text-xs font-semibold rounded-full">
              {role}
            </span>
          ) : exclusive && (
            <span className="px-3 py-1 bg-[#4FC3F7] text-white text-xs font-semibold rounded-full">
              {t.exclusiveBadge}
            </span>
          )}
          <span className="font-semibold">{country} {flag}</span>
        </div>

        {quote && (
          <p className="italic text-gray-600 mt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            "{quote}"
          </p>
        )}

        {/* Social ikonok */}
        {socials && (
          <div className="flex justify-center gap-4 mt-4 text-xl">
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A66C2] hover:opacity-80"
              >
                <FaLinkedin />
              </a>
            )}
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:opacity-80"
              >
                <FaFacebook />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E4405F] hover:opacity-80"
              >
                <FaInstagram />
              </a>
            )}
          </div>
        )}
      </motion.div>
    ))}
  </div>

  {/* Third row: Joyce centered with invisible side cards */}
  <div className="max-w-5xl mx-auto mt-6">
    <div className="grid md:grid-cols-3 gap-12">
      {/* Left invisible placeholder (only from md) */}
      <div
        className="hidden md:block md:invisible"
        aria-hidden="true"
      >
        <div className="text-center space-y-4 ring-2 ring-[#4FC3F7] rounded-xl p-6">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg" />
          <h3 className="text-xl font-semibold text-gray-900">&nbsp;</h3>
          <div className="flex items-center justify-center flex-wrap gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 bg-[#4FC3F7] text-white text-xs font-semibold rounded-full">&nbsp;</span>
            <span className="font-semibold">&nbsp;</span>
          </div>
          <p className="italic text-gray-600 mt-4">&nbsp;</p>
        </div>
      </div>

      {/* Joyce */}
      <motion.div
        className="text-center space-y-4 ring-2 ring-[#4FC3F7] rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
          <img
            src="https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/Joyce.jpeg"
            alt="Joyce Kau"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-xl font-semibold text-gray-900">Joyce Kau</h3>

        <div className="flex items-center justify-center flex-wrap gap-2 text-sm text-gray-600">
          <span className="px-3 py-1 bg-[#4FC3F7] text-white text-xs font-semibold rounded-full">
            {t.syedRole}
          </span>
          <span className="font-semibold">Malaysia 🇲🇾</span>
        </div>

        <p className="italic text-gray-600 mt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          "{t.joyceQuote}"
        </p>

        <div className="flex justify-center gap-4 mt-4 text-xl">
          <a
            href="https://www.linkedin.com/in/joycekau/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0A66C2] hover:opacity-80"
          >
            <FaLinkedin />
          </a>
        </div>
      </motion.div>

      {/* Right invisible placeholder (only from md) */}
      <div
        className="hidden md:block md:invisible"
        aria-hidden="true"
      >
        <div className="text-center space-y-4 ring-2 ring-[#4FC3F7] rounded-xl p-6">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg" />
          <h3 className="text-xl font-semibold text-gray-900">&nbsp;</h3>
          <div className="flex items-center justify-center flex-wrap gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 bg-[#4FC3F7] text-white text-xs font-semibold rounded-full">&nbsp;</span>
            <span className="font-semibold">&nbsp;</span>
          </div>
          <p className="italic text-gray-600 mt-4">&nbsp;</p>
        </div>
      </div>
    </div>
  </div>

  <p
  className="text-center text-xl text-gray-700 font-semibold mt-12 max-w-5xl mx-auto"
  style={{ fontFamily: 'Montserrat, sans-serif' }}
>
  {t.partnerCountriesText}
</p>
</Section>

      <PartnerFormModal open={open} onClose={() => setOpen(false)} />
    </>
  );

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {user ? (
        // Bejelentkezve: belső Layout kerettel, ez már tartalmaz nav‑ot + logout‑ot
        <Layout fullBleed>{storyContent}</Layout>
      ) : (
        // Nincs session: publikus keret
        <>
          <PublicNavBar />
          {storyContent}
          <Footer />
        </>
      )}
    </div>
  );
}
