import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Star, TrendingUp, Smile, DollarSign, ArrowRight } from 'lucide-react';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const restaurantPageTranslations = {
  en: {
    title: 'Restaurants',
    subtitle: 'Turn Happy Diners into 5-Star Marketers',
    intro:
      "Running a great restaurant isn't enough anymore. Even if your dishes are divine and your service is flawless, you're invisible online if you don't have a strong review game.",

    problem_title: 'The problem?',
    problem_text:
      "Happy guests rarely leave a review unless nudged. Meanwhile, one annoyed customer? They'll shout from the rooftops. This imbalance kills your Google rating, and with it—your visibility, trust, and bookings.",
    problem_hint:
      "But here's the good news:\nWith the right mix of timing, psychology, and gamification, you can flip that script. Instantly.",

    gap_title: 'The Restaurant Review Gap',
    gap_research_intro: 'Research shows:',
    gap_stats: [
      '94% of people have avoided a restaurant after reading a negative review',
      '73% of diners ignore reviews that are older than a month',
      'If your Google rating drops below 3 stars, you lose 75% of your potential customers'
    ],
    gap_benefits_title: 'Restaurants that actively collect reviews:',
    gap_benefits: [
      'Show up more often on Google Maps (hello, SEO!)',
      'Build trust before guests even walk in',
      'Increase average spend (people will pay 15% more when they trust you)'
    ],

    spin_title: 'Spin-to-Win at Checkout? It Works.',
    spin_subtitle: 'Picture this:',
    spin_intro: 'A guest just finished their meal, smiling. You hand them the bill with a small sign that says:',
    spin_sign: '"Scan to Leave a Review & Spin to Win a Dessert, Discount, or Surprise!"',
    spin_flow: 'They scan. They smile. They review. They spin.\nSudenly, a 30-second interaction just boosted:',
    spin_benefits: [
      'Your online reputation',
      'Their emotional connection',
      'Their likelihood to return'
    ],
    spin_data_intro: "And it's backed by data:",
    spin_stats: [
      'Gamified experiences lead to 47% higher engagement',
      'Restaurants using reward-based loyalty programs see a 22% increase in return visits',
      'Offering even small incentives like a free appetizer or drink increases review volume dramatically'
    ],

    revenue_title: 'The Revenue-Review Connection',
    revenue_intro: "Let's talk numbers.",
    revenue_facts: [
      'Restaurants with 80+ Google reviews earn 54% more than the average.',
      "With 200+ reviews? You're doubling the revenue of your competitors."
    ],
    revenue_best_part: "And here's the best part:",
    revenue_hint:
      "You don't need to \"buy\" reviews. You just need to reward the act of reviewing, honestly and ethically.",
    revenue_tip_intro: 'Pro tip:',
    revenue_tip:
      'Use wording like\n"Leave us an honest review and spin the wheel – every reviewer wins!"\nGoogle-compliant, yet still powerful.',

    psychology_title: 'Why It Works: Restaurant Psychology',
    psychology_intro: 'Diners are driven by:',
    psychology_factors: [
      'Desire for rewards – a free dessert? Count me in.',
      "Reciprocity – they just had great service, now they're happy to give back.",
      'Altruism – they want others to discover your place too.'
    ],
    psychology_closing:
      'Gamification taps into all three. A simple spin-the-wheel adds that final dopamine rush to an already positive experience. And people love to share good vibes.',

    features_title: 'What You Get with Review to Revenue',
    features_list: [
      'A fully gamified Google review funnel',
      'Easy-to-scan QR codes placed at tables, checkout, or receipts',
      'Real-time reward system with spin-the-wheel logic',
      "Transparent review incentives (compliant with Google's policy)",
      'Higher visibility, more foot traffic, and more repeat guests'
    ],

    qr_title: '📈 How to Maximize QR Codes in Your Restaurant',
    qr_subtitle:
      'Ready to see the most effective ways top restaurants are boosting reviews and rebookings? Dive into our step-by-step best practices.',
    qr_button: 'Explore Restaurant Best Practices',

    templates_title: 'Ready-Made Wheel Templates for Restaurants',
    card_1_title: 'Lunch Loyalty Spin',
    card_1_text: 'Snag weekday-lunch reviews and tempt guests back within two weeks.',
    card_1_stats: ['Use within: 14 days', 'Need: 4★ review', 'Top win: Free 2-course dinner for two'],
    card_2_title: 'Weekend Brunch Boost',
    card_2_text: 'Ride the Sat–Sun buzz for 5★ reviews and extra drink sales.',
    card_2_stats: ['Use within: 7 days', 'Need: 4★ review', 'Top win: Bottomless Mimosa Brunch for two'],
    card_3_title: 'Seasonal Delight Wheel',
    card_3_text: 'Show off your new seasonal menu and keep diners coming back.',
    card_3_stats: ['Use within: 21 days', 'Need: 4★ review', "Top win: Chef's tasting menu for two"],
    preview_template: 'Preview full template',

    cta_title: '🚀 Ready to Turn Your Tables into Traffic?',
    cta_text:
      "Don't leave reviews to chance. Turn your happiest moments into lasting visibility—and revenue.",
    cta_button: 'Start Your Free Trial',
    cta_note: 'No credit card needed'
  },

  hu: {
    title: 'Éttermek',
    subtitle: 'Fordítsd az elégedett vendégeket 5 csillagos marketinggé',
    intro:
      'Hiába tökéletes az étel és a kiszolgálás – ha kevés a vélemény rólad online, láthatatlan vagy a térképen.',

    problem_title: 'A probléma?',
    problem_text:
      'Az elégedett vendégek ritkán írnak véleményt maguktól. Az elégedetlenek viszont annál inkább. Ez torzítja a Google értékelést – és ezzel csökken a láthatóság, a bizalom, a forgalom.',
    problem_hint:
      'A jó hír?\nEgy kis pszichológia, jó időzítés és játékosítás – és máris fordul a kocka.',

    gap_title: 'Az Éttermi Vélemény-Rés',
    gap_research_intro: 'A kutatások azt mutatják:',
    gap_stats: [
      'Az emberek 94%-a nem megy olyan helyre, ahol negatív véleményt olvasott',
      'A vendégek 73%-a figyelmen kívül hagyja az 1 hónapnál régebbi értékeléseket',
      'Ha 4 csillag alá esel a Google-on, a potenciális vendégeid 75%-át elveszíted'
    ],
    gap_benefits_title: 'Azok az éttermek, akik aktívan gyűjtenek véleményt:',
    gap_benefits: [
      'Gyakrabban jelennek meg a Google Térképen (SEO!)',
      'Bizalmat keltenek még a belépés előtt',
      'A vendégek átlagosan 15%-kal többet költenek náluk'
    ],

    spin_title: 'Pörgetés fizetéskor? Működik.',
    spin_subtitle: 'Képzeld el:',
    spin_intro: 'Egy vendég most fejezte be az étkezést, mosolyog. Odaadod a számlát egy kis táblával:',
    spin_sign: '"Írj véleményt és pörgess egy desszertért, kedvezményért vagy meglepetésért!"',
    spin_flow: 'Beolvassa. Mosolyog. Ír. Pörget.\nEgy 30 másodperces interakció megemelte:',
    spin_benefits: ['Az online hírnevet', 'Az érzelmi kapcsolatot', 'A visszatérés valószínűségét'],
    spin_data_intro: 'És az adatok is támasztják:',
    spin_stats: [
      'A játékos megközelítés 47%-kal több aktivitást hoz',
      'A jutalmazó rendszert használó éttermeknél 22%-kal többen térnek vissza',
      'Még egy kis jutalom is (pl. előétel) jelentősen növeli a vélemények számát'
    ],

    revenue_title: 'Bevétel és Vélemények kapcsolata',
    revenue_intro: 'Beszéljünk számokról.',
    revenue_facts: [
      'Akiknek 280+ Google véleménye van, 54%-kal többet keresnek az átlagnál.',
      '500+ véleménynél a bevétel megduplázódik a versenytársakhoz képest.'
    ],
    revenue_best_part: 'És itt jön a legjobb rész:',
    revenue_hint:
      'Nem kell „venni" a véleményt. Elég megjutalmazni azt, aki ír – etikusan és őszintén.',
    revenue_tip_intro: 'Profi tipp:',
    revenue_tip:
      'Így fogalmazz:\n"Írj őszinte véleményt és pörgess – mindenki nyer!"\nGoogle-kompatibilis, mégis ütős.',

    psychology_title: 'Miért működik: Éttermi pszichológia',
    psychology_intro: 'A vendégeket ez mozgatja:',
    psychology_factors: [
      'Vágynak a jutalomra – egy desszert? Jöhet!',
      'Viszonzás – jó élmény után szívesen adnak vissza valamit - mondjuk egy értékelést',
      'Altruizmus – másokkal is meg akarják osztani a felfedezést'
    ],
    psychology_closing:
      'A játékosítás mindhárom pszichés gombot megnyomja. Egy kis pörgetés a végén és máris emlékezetes az élmény. És ezt szívesen meg is osztják.',

    features_title: 'Mit kapsz a Review to Revenue-tól?',
    features_list: [
      'Teljes játékosított véleménygyűjtő rendszer',
      'Asztalra, blokkra vagy kasszára helyezhető QR-kódok',
      'Valós idejű nyeremények pörgetés logikával',
      'Átlátható ösztönzők (Google-szabályoknak megfelel)',
      'Több láthatóság, több vendég és több bevétel'
    ],

    qr_title: '📈 Így Használd a QR-kódokat az Éttermedben',
    qr_subtitle:
      'Szeretnéd megtudni, hogyan gyűjtenek véleményt és visszatérő vendégeket a legjobb helyek? Nézd meg a lépésről-lépésre útmutatónkat.',
    qr_button: 'Éttermeknek szóló tippek',

    templates_title: 'Kész Sablonok Éttermeknek',
    card_1_title: 'Ebédidős Értékelés gyűjtés',
    card_1_text: 'Ebédidőben értékeléseket gyűjtesz és 2 héten belül visszacsábítod őket.',
    card_1_stats: ['Felhasználás: 14 nap', 'Szükséges: 4★ vélemény', 'Fődíj: 2 fogásos vacsora 2 fő részére'],
    card_2_title: 'Hétvégi Brunch Boost',
    card_2_text: 'Szombat–vasárnapi pörgés, extra italforgalom, 5★ vélemények.',
    card_2_stats: ['Felhasználás: 7 nap', 'Szükséges: 4★ vélemény', 'Fődíj: Korlátlan Mimóza Brunch 2 főre'],
    card_3_title: 'Szezonális Finomság',
    card_3_text: 'Mutasd be az új szezonális menüt és növeld a visszatéréseket.',
    card_3_stats: ['Felhasználás: 21 nap', 'Szükséges: 4★ vélemény', 'Fődíj: Séf kóstoló menü 2 főre'],
    preview_template: 'Megnézem a sablont',

    cta_title: '🚀 Készen állsz, hogy az értékelésekből forgalom legyen?',
    cta_text:
      'Ne bízd a véleményeket a véletlenre. Váltsd vissza őket láthatóságra – és bevételre.',
    cta_button: 'Próbáld ki ingyen',
    cta_note: 'Bankkártya sem szükséges'
  }
};

export default function RestaurantPage() {
  const { language } = useLanguage();
  const t = restaurantPageTranslations[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center text-2xl mb-4">
              🍽️ {t.title}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t.subtitle}
            </h1>
            <p className="text-xl text-gray-600">
              {t.intro}
            </p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-orange-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-yellow-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.problem_title}</h2>
              <p className="text-gray-600">
                {t.problem_text}
              </p>
              <p className="text-gray-600 font-medium whitespace-pre-line">
                {t.problem_hint}
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Trophy className="w-6 h-6 text-orange-500" />
                {t.gap_title}
              </h2>
              
              <div className="mb-8">
                <p className="font-medium mb-4">{t.gap_research_intro}</p>
                <ul className="space-y-2">
                  {t.gap_stats.map((stat, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      {stat}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="font-medium mb-4">{t.gap_benefits_title}</p>
              <ul className="space-y-2">
                {t.gap_benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                {t.spin_title}
              </h2>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="font-medium mb-2">{t.spin_subtitle}</p>
                <p>{t.spin_intro}</p>
                <p className="text-lg font-medium my-4 text-blue-900">
                  👉 {t.spin_sign}
                </p>
              </div>

              <p className="mb-6 whitespace-pre-line">
                {t.spin_flow}
              </p>

              <ul className="space-y-2 mb-6">
                {t.spin_benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-medium mb-4">{t.spin_data_intro}</p>
                <ul className="space-y-2">
                  {t.spin_stats.map((stat, index) => (
                    <li key={index}>• {stat}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <TrendingUp className="w-6 h-6 text-green-500" />
                {t.revenue_title}
              </h2>

              <p className="text-xl mb-4">{t.revenue_intro}</p>
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <ul className="space-y-4">
                  {t.revenue_facts.map((fact, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="font-medium mb-2">{t.revenue_best_part}</p>
              <p>{t.revenue_hint}</p>

              <div className="bg-yellow-50 p-6 rounded-lg mt-6">
                <p className="flex items-center gap-2 font-medium mb-2">
                  <span>💡</span> {t.revenue_tip_intro}
                </p>
                <p className="whitespace-pre-line">
                  {t.revenue_tip}
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Smile className="w-6 h-6 text-purple-500" />
                {t.psychology_title}
              </h2>

              <p className="mb-4">{t.psychology_intro}</p>
              <ul className="space-y-4 mb-6">
                {t.psychology_factors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <strong>{factor}</strong>
                  </li>
                ))}
              </ul>

              <p>
                {t.psychology_closing}
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <span>✅</span> {t.features_title}
              </h2>

              <ul className="space-y-4">
                {t.features_list.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Best Practices Section */}
      <section className="py-16 bg-yellow-50 border-t border-yellow-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            {t.qr_title}
          </motion.h2>
          <p className="text-lg text-gray-700 mb-8">
            {t.qr_subtitle}
          </p>
          <Link
            to="/use-cases/restaurants/qr-strategy"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-orange-600 text-white font-semibold
                     hover:bg-orange-700 transition transform hover:scale-105 shadow"
          >
            {t.qr_button}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Wheel-of-Fortune Template Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12"
          >
            {t.templates_title}
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* === CARD 1 === */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-orange-600 mb-2">
                {t.card_1_title}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                {t.card_1_text}
              </p>

              <ul className="text-sm text-gray-700 mb-6 space-y-1">
                {t.card_1_stats.map((stat, index) => (
                  <li key={index}>• <span className="font-medium">{stat}</span></li>
                ))}
              </ul>

              <Link
                to="/templates/restaurant/lunch-loyalty-spin/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-orange-600 text-white font-semibold
                           hover:bg-orange-700 transition"
              >
                {t.preview_template}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            {/* === CARD 2 === */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-yellow-600 mb-2">
                {t.card_2_title}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                {t.card_2_text}
              </p>

              <ul className="text-sm text-gray-700 mb-6 space-y-1">
                {t.card_2_stats.map((stat, index) => (
                  <li key={index}>• <span className="font-medium">{stat}</span></li>
                ))}
              </ul>

              <Link
                to="/templates/restaurant/weekend-brunch-boost/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-yellow-500 text-white font-semibold
                           hover:bg-yellow-600 transition"
              >
                {t.preview_template}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            {/* === CARD 3 === */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                {t.card_3_title}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                {t.card_3_text}
              </p>

              <ul className="text-sm text-gray-700 mb-6 space-y-1">
                {t.card_3_stats.map((stat, index) => (
                  <li key={index}>• <span className="font-medium">{stat}</span></li>
                ))}
              </ul>

              <Link
                to="/templates/restaurant/seasonal-delight-wheel/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-green-600 text-white font-semibold
                           hover:bg-green-700 transition"
              >
                {t.preview_template}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-yellow-600 text-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-xl text-orange-100 mb-8">
            {t.cta_text}
          </p>
          <Link
            to="https://reviewtorevenue.io/auth"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-orange-600 font-semibold text-lg
                     hover:bg-orange-50 transform transition-all hover:scale-105 shadow-lg group"
          >
            {t.cta_button}
            <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-sm text-orange-100 mt-4">{t.cta_note}</p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}