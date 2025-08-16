import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Star, TrendingUp, Coffee, ArrowRight, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';

const cafePageTranslations = {
  en: {
    title: 'Cafés',
    hero_title: 'Be Found, Be Loved: Let Your Regulars Do the Marketing',
    hero_subtitle_1: "You serve perfect coffee.\nYour vibe is cozy, your playlists are on point, your croissants are flaky.\nBut… if your café doesn't rank well on Google Maps, you're missing out on dozens of new customers every single day.",
    hero_subtitle_2: "In tourist-heavy or urban areas, discovery happens online—not by chance.\nAnd people trust stars more than signs.",

    no_reviews_title: 'What Happens Without Reviews?',
    no_reviews_intro: "Here's the harsh truth:",
    no_reviews_stats: [
      '73% of customers ignore reviews older than 1 month',
      "If your café has less than 3 stars, you're invisible to ~71% of potential guests",
      'With 4.0+ stars, you could earn 32% more revenue than lower-rated competitors'
    ],
    no_reviews_footer: "Even if your coffee is world-class, no reviews = no visibility = no foot traffic.\nThat's not fair. But it's fixable.",

    importance_title: 'Why Reviews Matter (Especially for Cafés)',
    importance_intro: 'Cafés thrive on trust, emotion, and atmosphere.\nAnd reviews capture all three.',
    importance_list: [
      'Tourists want glowing comments and pretty photos',
      'Locals want to find their new favorite place',
      'Regulars want to support you – they just need a gentle nudge'
    ],

    gamify_title: 'Gamify the Review Ask (and Make it Fun)',
    gamify_intro: "You don't have to awkwardly beg for reviews.\nJust make it part of the experience.",
    gamify_try_this: 'Try this:',
    gamify_example: '"Scan to leave a quick review & spin to win a free pastry, next-coffee-free card, or secret menu item."',
    gamify_result: 'Boom.\nYou\'ve just turned feedback into a fun moment.',
    gamify_stats_intro: '📊 And it works:',
    gamify_stats: [
      '47% more customer engagement when gamified',
      '22% more loyalty when rewards are involved',
      '76% of people say a small incentive makes them more likely to leave a review'
    ],
    gamify_footer: 'Even better: 200+ Google reviews = double the revenue of a café with few or no reviews.',

    conversion_title: 'Turn Sips Into Stars',
    conversion_intro: 'That perfect latte art? Deserves to be online.\nThat compliment from your regular? Should be public.',
    conversion_with_review: 'With Review to Revenue, you can:',
    conversion_list: [
      'Encourage reviews right at the register (when satisfaction peaks)',
      'Reward every review with a gamified spin',
      'Offer digital or in-store prizes that bring customers back',
      'Stay fully compliant with Google\'s policies (rewarding action, not opinion)'
    ],

    features_title: 'What You Get',
    features_list: [
      'Branded QR codes placed on takeaway cups, receipts, or counters',
      'Instant "spin-to-win" flow tied to leaving a Google review',
      'Customizable reward pool (free drink, discount, merch, etc.)',
      'Built-in reminders so you collect reviews consistently, not just randomly',
      'Real-time data on who\'s spinning and who\'s winning'
    ],
    features_footer: 'All this, with no awkward review begging, no fake ratings—just genuine feedback from happy customers.',

    qr_section_title: '☕️ How to Get the Most Out of Your Café\'s QR Codes',
    qr_section_text: 'Learn how to transform every cup, every checkout, and every moment into a chance to grow your online presence and fill your seats. Dive in for practical tips and success stories.',
    qr_button: 'Explore Café Best Practices',

    wheels_title: 'Ready-to-Go Wheels for Coffee Shops',
    card_1_title: 'Morning Buzz Brew',
    card_1_text: 'Turn the 7–11 AM rush into fresh 5★ reviews and bring them back this week.',
    card_1_stats: ['Use within: 7 days', 'Need: 4★ review', 'Top win: Free 250 g house-roast beans'],
    card_2_title: 'Study Session Spin',
    card_2_text: 'Laptop warriors drop a review now → snag a drink-plus-pastry deal next visit.',
    card_2_stats: ['Use within: 14 days', 'Need: 4★ review', 'Top win: Drink + pastry flight for two'],
    card_3_title: 'Seasonal Sip Surprise',
    card_3_text: 'Show off your limited-time lattes and keep guests coming back all season.',
    card_3_stats: ['Use within: 21 days', 'Need: 4★ review', 'Top win: Seasonal gift box'],
    preview_template: 'Preview full template',

    cta_title: '🚀 Your Café Deserves to Be Discovered',
    cta_text: "Whether it's a local looking for a chill work spot or a tourist craving a flat white…\nYour next loyal customer is already searching.\nLet's make sure they find you.",
    cta_button: 'Start Your Free Trial',
    cta_note: 'No credit card needed'
  },

  hu: {
    title: 'Kávézók',
    hero_title: 'Legyen látható és szerethető – hagyd, hogy a törzsvendégek terjesszék a híred',
    hero_subtitle_1: 'A kávéd tökéletes.\nA hangulat otthonos, a zene válogatott, a croissant ropogós.\nDe ha a Google Térképen nem vagy jól pozicionálva, naponta tucatnyi vendéget veszíthetsz el.',
    hero_subtitle_2: 'Turistaövezetekben és városi környezetben a felfedezés online történik – nem véletlenszerűen.\nAz emberek jobban hisznek a csillagoknak, mint a cégtábláknak.',

    no_reviews_title: 'Mi történik értékelések nélkül?',
    no_reviews_intro: 'A kellemetlen igazság:',
    no_reviews_stats: [
      'A vásárlók 73%-a figyelmen kívül hagyja az 1 hónapnál régebbi értékeléseket',
      'Ha kevesebb mint 4 csillagod van, a potenciális vendégek ~71%-a figyelmen kívül hagy',
      'A 4.0+ csillagos helyek 32%-kal több bevételt termelnek a rosszabbul értékelt versenytársaknál'
    ],
    no_reviews_footer: 'Akár világbajnok a kávéd, értékelés nélkül nincs láthatóság, nincs forgalom.\nEz nem igazságos – de orvosolható.',

    importance_title: 'Miért számítanak az értékelések (főleg kávézóknál)?',
    importance_intro: 'A kávézók bizalomra, érzelmekre és hangulatra építenek.\nAz értékelések mindhárom dolgot megragadják.',
    importance_list: [
      'A turisták ragyogó értékeléseket és szép képeket keresnek',
      'A helyiek új kedvenc helyet keresnek',
      'A törzsvendégek támogatnának – csak egy kis ösztönzés kell'
    ],

    gamify_title: 'Játékosítsd az értékeléskérést (és tedd szórakoztatóvá)',
    gamify_intro: 'Nem kell kellemetlenül könyörögni értékelésért.\nTedd a vendégélmény részévé.',
    gamify_try_this: 'Próbáld ezt:',
    gamify_example: '"Szkenneld be, írj értékelést, és pörgess a nyereményért: ingyen süti, következő kávé ajándékba, vagy egy titkos menü tétel."',
    gamify_result: 'Bumm.\nAzonnal játékos pillanattá vált a visszajelzés.',
    gamify_stats_intro: '📊 És működik is:',
    gamify_stats: [
      '47%-kal több ügyfél-interakció játékos élmény során',
      '22%-kal több hűség, ha jutalmat is kapnak',
      '76% nagyobb eséllyel ír értékelést, ha van egy kis ösztönző'
    ],
    gamify_footer: 'Még jobb: 400+ Google értékelés = kétszeres bevétel a kevés értékeléssel rendelkező kávézókhoz képest.',

    conversion_title: 'Kortyokból csillagokat',
    conversion_intro: 'Egy tökéletes latte? Legyen az online is.\nA törzsvendég dicsérete? Legyen nyilvános.',
    conversion_with_review: 'A Review to Revenue-val:',
    conversion_list: [
      'Kérj értékelést a kasszánál (amikor csúcs a vendégélmény)',
      'Minden értékelést jutalmazz pörgetéssel',
      'Adj digitális vagy helyszíni nyereményeket, amik visszacsábítják őket',
      'Legyél teljesen Google-kompatibilis (a cselekvést jutalmazd, ne a véleményt)'
    ],

    features_title: 'Mit kapsz?',
    features_list: [
      'Márkázott QR-kód poharakon, blokkon vagy pulton',
      'Azonnali "pörgess és nyerj" élmény Google értékelés után',
      'Testreszabható nyeremények (ital, kedvezmény, ajándéktárgy, stb.)',
      'Valós idejű statisztika: ki pörget és mit nyer'
    ],
    features_footer: 'Mindezt nyomulás nélkül, hamis értékelések nélkül – csak valódi visszajelzések boldog vendégektől.',

    qr_section_title: '☕️ Hozd ki a legtöbbet QR-kódjaidból',
    qr_section_text: 'Tudd meg, hogyan válhat minden kávé, kasszázás és pillanat az online jelenlét növelésének és vendégszerzésnek az eszközévé. Gyakorlati példák és sikersztorik várnak.',
    qr_button: 'Kávézós tippek és stratégiák',

    wheels_title: 'Kész sablonok kávézóknak',
    card_1_title: 'Reggeli Roham Pörgetés',
    card_1_text: 'A 7-11 órás csúcsból friss 5★ értékelések – és visszatérő vendégek még a héten.',
    card_1_stats: ['Felhasználás: 7 nap', 'Szükséges: 4★ értékelés', 'Fődíj: 250g saját pörkölésű kávé'],
    card_2_title: 'Tanulós Session Pörgetés',
    card_2_text: 'Laptopharcos írj értékelést most! → ital+süti kombó a következő alkalommal.',
    card_2_stats: ['Felhasználás: 14 nap', 'Szükséges: 4★ értékelés', 'Fődíj: Ital + sütemény válogatás két főre'],
    card_3_title: 'Szezonális Korty Meglepetés',
    card_3_text: 'Mutasd be a limitált kávéidat.',
    card_3_stats: ['Felhasználás: 21 nap', 'Szükséges: 4★ értékelés', 'Fődíj: Szezonális ajándékcsomag'],
    preview_template: 'Megnézem a sablont',

    cta_title: '🚀 A kávézód megérdemli, hogy felfedezzék',
    cta_text: 'Akár ha egy helyi keres chill munkapontot, akár ha egy turista vágyik egy flat white-ra…\nA következő hűséges vendéged már keres.\nGondoskodjunk róla, hogy meg is találjon.',
    cta_button: 'Próbáld ki ingyenesen',
    cta_note: 'Bankkártya sem szükséges'
  }
};

export default function CafePage() {
  const { language, setLanguage } = useLanguage();
  const t = cafePageTranslations[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center text-2xl mb-4">
              ☕ {t.title}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t.hero_title}
            </h1>
            <p className="text-xl text-gray-600 whitespace-pre-line">
              {t.hero_subtitle_1}
            </p>
            <p className="text-xl text-gray-600 mt-4 whitespace-pre-line">
              {t.hero_subtitle_2}
            </p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-amber-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-orange-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg">
            <div className="bg-red-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Trophy className="w-6 h-6 text-red-500" />
                {t.no_reviews_title}
              </h2>
              
              <p className="font-medium mb-4">{t.no_reviews_intro}</p>
              <ul className="space-y-2 mb-6">
                {t.no_reviews_stats.map((stat, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    {stat}
                  </li>
                ))}
              </ul>

              <p className="font-medium whitespace-pre-line">
                {t.no_reviews_footer}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Coffee className="w-6 h-6 text-amber-700" />
                {t.importance_title}
              </h2>

              <p className="mb-4 whitespace-pre-line">
                {t.importance_intro}
              </p>

              <ul className="space-y-2 mb-6">
                {t.importance_list.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                {t.gamify_title}
              </h2>

              <p className="mb-6 whitespace-pre-line">
                {t.gamify_intro}
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="font-medium mb-2">{t.gamify_try_this}</p>
                <p className="text-lg font-medium text-blue-900">
                  {t.gamify_example}
                </p>
                <p className="mt-4 whitespace-pre-line">
                  {t.gamify_result}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-medium mb-4">{t.gamify_stats_intro}</p>
                <ul className="space-y-2">
                  {t.gamify_stats.map((stat, index) => (
                    <li key={index}>• {stat}</li>
                  ))}
                </ul>
                <p className="mt-4 font-medium">
                  {t.gamify_footer}
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <TrendingUp className="w-6 h-6 text-green-500" />
                {t.conversion_title}
              </h2>

              <p className="mb-4 whitespace-pre-line">
                {t.conversion_intro}
              </p>

              <div className="bg-green-50 p-6 rounded-lg">
                <p className="font-medium mb-4">{t.conversion_with_review}</p>
                <ul className="space-y-2">
                  {t.conversion_list.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <MapPin className="w-6 h-6 text-amber-600" />
                {t.features_title}
              </h2>

              <ul className="space-y-4">
                {t.features_list.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="mt-6 font-medium">
                {t.features_footer}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* QR Code Best Practices Section */}
      <section className="py-16 bg-amber-50 border-t border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            {t.qr_section_title}
          </motion.h2>
          <p className="text-lg text-gray-700 mb-8">
            {t.qr_section_text}
          </p>
          <Link
            to="/use-cases/cafes/qr-best-practices"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-amber-600 text-white font-semibold
                     hover:bg-amber-700 transition transform hover:scale-105 shadow"
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
            {t.wheels_title}
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
              <h3 className="text-xl font-semibold text-amber-600 mb-2">
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
                to="/templates/cafe/morning-buzz-brew/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-amber-600 text-white font-semibold
                           hover:bg-amber-700 transition"
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
              <h3 className="text-xl font-semibold text-teal-600 mb-2">
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
                to="/templates/cafe/study-session-spin/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-teal-600 text-white font-semibold
                           hover:bg-teal-700 transition"
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
              <h3 className="text-xl font-semibold text-rose-700 mb-2">
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
                to="/templates/cafe/seasonal-sip-surprise/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-rose-600 text-white font-semibold
                           hover:bg-rose-700 transition"
              >
                {t.preview_template}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-xl text-amber-100 mb-8 whitespace-pre-line">
            {t.cta_text}
          </p>
          <Link
            to="https://reviewtorevenue.io/auth"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-amber-600 font-semibold text-lg
                     hover:bg-amber-50 transform transition-all hover:scale-105 shadow-lg group"
          >
            {t.cta_button}
            <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-sm text-amber-100 mt-4">{t.cta_note}</p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}