import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Star, TrendingUp, Sparkles, DollarSign, ArrowRight, Scissors } from 'lucide-react';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';

const salonPageTranslations = {
  en: {
    label: 'Salons & Spas',
    hero_title: 'Turn Relaxation into Reputation – Let Happy Clients Speak for You',
    hero_p1: "You just gave someone their best hair day in months.\nYou helped someone feel pampered, radiant, and renewed.\nThat's a perfect moment to ask for a review — but most salons let it slip away.",
    hero_p2: "Why? Because the client is already heading out the door, glowing… but unprompted.\nNo QR code. No reminder. No gentle nudge.",
    hero_p3: "That review never gets written.\nAnd your future clients never get to read it.",
    missed_moments_title: 'Missed Moments = Missed Bookings',
    missed_moments_data_intro: "Here's what the data says:",
    missed_moments_points: [
      '73% of people ignore reviews older than a month',
      "91% won't even consider a salon with less than 3 stars",
      'Businesses with 4.0+ stars? They earn about 32% more revenue',
      'Salons with 200+ Google reviews make 2× more than those with fewer reviews',
    ],
    missed_moments_footer: 'In an industry driven by trust and word-of-mouth, reviews = reputation = revenue.',
    qr_best_practice_title: '✨ How to Get the Most Out of Your QR Codes',
    qr_best_practice_p: 'Ready to see exactly how top salons & spas are using QR codes to boost reviews, repeat visits, and client loyalty? Dive into our step-by-step best practices.',
    qr_best_practice_cta: 'Explore Salon Best Practices',
    glow_title: 'Capture the Glow (Right When It Happens)',
    glow_p1: 'The perfect time to collect a review is right after the service.\nThey\'ve just looked in the mirror and smiled.\nThey\'re feeling seen. Beautiful. Cared for.',
    glow_p2: "That's when you say:",
    glow_quote: `"We'd love your feedback! Scan this & spin to win a 10% discount, free sample, or your next treatment on us."`,
    glow_footer: "It's natural. It's playful. It works.",
    gamification_title: 'Why Gamification Makes Clients Engage',
    gamification_intro: 'We all love a little surprise.\nAnd science backs this up:',
    gamification_points: [
      '76% of people say a small reward makes them more likely to leave a review',
      '47% higher engagement when gamification is used',
      'Even symbolic rewards (e.g. "VIP reviewer" badge) increase action through reciprocity and status',
    ],
    gamification_footer: "You're turning a task (leave a review) into a treat (play & win).\nThat's how you make feedback feel good.",
    features_title: 'What You Get with Review to Revenue',
    features_points: [
      'Beautifully branded QR codes placed at reception or styling stations',
      '"Spin the Wheel" experience after review submission',
      'Rewards tailored to your salon or spa (discounts, freebies, loyalty perks)',
      'Google-compliant approach: reward the act of reviewing, not the content',
      'Real-time dashboard showing reviews collected, spins triggered, and rewards claimed',
    ],
    features_footer: "This is not about asking for 5 stars.\nIt's about encouraging honest feedback in a way that's fun and fair.",
    growth_title: 'From One Review to Many Clients',
    growth_intro: 'Positive reviews attract new clients. Period.',
    growth_p1: 'Whether it\'s a nervous first-timer or a local looking for a new stylist,\nyour Google presence will either bring them in—or send them elsewhere.',
    growth_points: [
      'More reviews = higher ranking on Google Maps',
      'Higher rating = more trust and bookings',
      'Recent reviews = relevance and reach',
    ],
    shareable_title: '🚀 Make Self-Care Shareable',
    shareable_intro: 'Every treatment you offer is a chance to build your online reputation.',
    shareable_list_intro: 'With Review to Revenue, you can turn:',
    shareable_points: [
      'First-time clients into loyal customers',
      'Satisfied smiles into 5-star stories',
      'Walk-outs into come-backs',
    ],
    templates_title: 'Ready-Made Wheel Templates for Salons & Spas',
    templates: [
      {
        title: 'Fresh Glow Spin',
        desc: 'Catch the "wow" right after the mirror moment → book their next trim or facial on the spot.',
        rules: [
          'Use within: 14 days',
          'Need: 4★ review',
          'Top win: 20% off next service',
        ],
      },
      {
        title: 'Weekend Pamper Wheel',
        desc: 'Turn Saturday spa vibes into weekday bookings & 5★ love online.',
        rules: [
          'Use within: 7 days',
          'Need: 4★ review',
          'Top win: Free deluxe manicure',
        ],
      },
      {
        title: 'VIP Repeat Treat',
        desc: 'Show love to loyal clients, upsell add-ons, and spark referrals.',
        rules: [
          'Use within: 30 days',
          'Need: 4★ review',
          'Top win: Free full-size product bundle',
        ],
      },
    ],
    preview_template: 'Preview full template',
    cta_title: '👉 Start Your Free Trial Now',
    cta_text: 'Turn every satisfied client into a vocal advocate.\nMake review collection effortless, engaging, and effective.',
    cta_button: 'Start Your Free Trial',
    cta_note: 'No credit card needed',
  },

  hu: {
    label: 'Szépségszalonok & Wellnesek',
    hero_title: 'Fordítsd a relaxációt hírnévvé – hagyd, hogy elégedett vendégeid beszéljenek rólad',
    hero_p1: 'Most adtál valakinek egy tökéletes hajnapot.\nKényeztetted, felfrissítetted, önbizalmat adtál.\nEz a tökéletes pillanat a véleménykérésre – mégis sok szalon elszalasztja.',
    hero_p2: 'Miért? Mert a vendég már úton van kifelé, ragyogva – de kérés nélkül.\nNincs QR-kód. Nincs emlékeztető. Nincs finom ösztönzés.',
    hero_p3: 'Így az értékelés sosem születik meg.\nÉs a jövőbeli vendégeid sosem olvassák el.',
    missed_moments_title: 'Elmulasztott pillanatok = Elveszített foglalások',
    missed_moments_data_intro: 'Mit mondanak az adatok:',
    missed_moments_points: [
      'Az emberek 73%-a figyelmen kívül hagyja az 1 hónapnál régebbi értékeléseket',
      'A vendégek 91%-a nem választ olyan helyet, ahol 4 csillagnál kevesebb van',
      'A 4+ csillagos vállalkozások átlagosan 32%-kal több bevételt termelnek',
      'A 500+ Google értékeléssel rendelkező szalonok dupláját keresik a többinek',
    ],
    missed_moments_footer: 'Egy olyan iparágban, amit a bizalom hajt, az értékelés = hírnév = bevétel.',
    qr_best_practice_title: '✨ Hogyan hozd ki a legtöbbet a QR kódokból',
    qr_best_practice_p: 'Kíváncsi vagy, hogyan használják a vezető szépségszalonok és wellnesek a QR kódokat az értékelések, visszatérő vendégek és ügyfélhűség növelésére? Fedezd fel lépésről lépésre a legjobb gyakorlatokat.',
    qr_best_practice_cta: 'Szalon Best Practice-ek felfedezése',
    glow_title: 'Ragadd meg a ragyogást (pont amikor megtörténik)',
    glow_p1: 'A tökéletes időpont értékelés kérésre közvetlenül a szolgáltatás után van.\nÉpp a tükörbe néztek és mosolyogtak.\nSzépnek, ragyognak, értékesnek érzik magukat.',
    glow_p2: 'Ekkor mondod:',
    glow_quote: '"Szeretnénk a véleményét! Olvasd be ezt a QR kódot és pörgess, hogy nyerj 10% kedvezményt, ingyenes mintát vagy akár egy következő kezelést!"',
    glow_footer: 'Természetes. Játékos. Működik.',
    gamification_title: 'Miért ösztönzi a játékosítás a vendégeket',
    gamification_intro: 'Mindannyian szeretjük a kis meglepetéseket.\nÉs a tudomány is ezt támasztja alá:',
    gamification_points: [
      'Az emberek 76%-a szerint egy kis jutalom növeli az értékelésadási hajlandóságot',
      '47%-kal magasabb az elköteleződés játékosítással',
      'Még a szimbolikus jutalmak is (pl. "VIP értékelő" jelvény) növelik az aktivitást',
    ],
    gamification_footer: 'Egy feladatot (értékelés írása) változtatsz jutalommá (játék és nyeremény).\nÍgy teheted kellemessé a visszajelzést.',
    features_title: 'Mit kapsz a Review to Revenue-val',
    features_points: [
      'Gyönyörűen márkázott QR kódok a recepcióban vagy kezelőszékek mellett',
      '"Szerencsekerék" élmény az értékelés beküldése után',
      'Szalonodhoz szabott jutalmak (kedvezmények, ajándékok, hűségprogramok)',
      'Google-szabályoknak megfelelő megközelítés: az értékelést jutalmazzuk, nem a tartalmat',
      'Valós idejű dashboard az összegyűjtött értékelésekkel, pörgetésekkel és beváltott jutalmakkal',
    ],
    features_footer: 'Nem 5 csillagért kérdezünk.\nArról van szó, hogy őszinte visszajelzést ösztönözzünk szórakoztató és fair módon.',
    growth_title: 'Egy értékeléstől a sok (visszatérő) vendégig',
    growth_intro: 'A pozitív értékelések új vendégeket vonzanak. Pont.',
    growth_p1: 'Legyen szó egy izgult újoncról vagy egy új fodrászt kereső helyiről,\na Google jelenléteted vagy behozza őket – vagy máshova küldi.',
    growth_points: [
      'Több értékelés = magasabb rangsor a Google Mapsen',
      'Magasabb értékelés = több bizalom és foglalás',
      'Friss értékelések = relevancia és elérés',
    ],
    shareable_title: '🚀 Tedd megoszthatóvá az önápolást',
    shareable_intro: 'Minden kezelés lehetőség az online hírnév építésére.',
    shareable_list_intro: 'A Review to Revenue-val ezt csinálhatod:',
    shareable_points: [
      'Először látogatókból törzsvendégeket',
      'Elégedett mosolyokból 5 csillagos történeteket',
      'Távozókból visszatérőket',
    ],
    templates_title: 'Kész szerencsekerék sablonok szalonoknak & wellneseknek',
    templates: [
      {
        title: 'Fresh Glow',
        desc: 'Ragadd meg a "wow" pillanatot közvetlenül a tükör előtt → foglald le a következő vágást vagy arckezelést.',
        rules: [
          'Felhasználható: 14 napon belül',
          'Szükséges: 4★ értékelés',
          'Fő nyeremény: 20% kedvezmény a következő kezelésre',
        ],
      },
      {
        title: 'Hétvégi Kényeztetés',
        desc: 'Változtasd a szombati spa hangulatot hétköznapi foglalásokká és 5★ szeretetté online.',
        rules: [
          'Felhasználható: 7 napon belül',
          'Szükséges: 4★ értékelés',
          'Fő nyeremény: Ingyenes deluxe manikűr',
        ],
      },
      {
        title: 'VIP Visszatérő Jutalom',
        desc: 'Mutasd meg a szeretetet a hűséges vendégeknek, ajánlj kiegészítőket és ösztönözz ajánlásokat.',
        rules: [
          'Felhasználható: 30 napon belül',
          'Szükséges: 4★ értékelés',
          'Fő nyeremény: Ingyenes termékcsomag',
        ],
      },
    ],
    preview_template: 'Megnézem a sablont',
    cta_title: '👉 Indítsd el az ingyenes próbaidőszakot',
    cta_text: 'Változtasd minden elégedett vendéget hangos szószólóvá.\nTedd az értékelés gyűjtést könnyűvé, izgalmassá és hatékonnyá.',
    cta_button: 'Ingyenes próba indítása',
    cta_note: 'Bankkártya sem szükséges',
  }
};

export default function SalonPage() {
  const { language } = useLanguage();
  const t = salonPageTranslations[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center text-2xl mb-4">
              💅 {t.label}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t.hero_title}
            </h1>
            <p className="text-xl text-gray-600 whitespace-pre-line">
              {t.hero_p1}
            </p>
            <p className="text-xl text-gray-600 mt-4 whitespace-pre-line">
              {t.hero_p2}
            </p>
            <p className="text-xl text-gray-600 mt-4 whitespace-pre-line">
              {t.hero_p3}
            </p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-pink-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg">
            <div className="bg-red-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Trophy className="w-6 h-6 text-red-500" />
                {t.missed_moments_title}
              </h2>
              
              <p className="font-medium mb-4">{t.missed_moments_data_intro}</p>
              <ul className="space-y-2">
                {t.missed_moments_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    {point}
                  </li>
                ))}
              </ul>

              <p className="mt-4 font-medium">
                {t.missed_moments_footer}
              </p>
            </div>

            {/* QR Code Best Practices Section */}
            <section className="py-16 bg-purple-50 border-t border-purple-100">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold text-gray-900 mb-4"
                >
                  {t.qr_best_practice_title}
                </motion.h2>
                <p className="text-lg text-gray-700 mb-8">
                  {t.qr_best_practice_p}
                </p>
                <Link
                  to="/use-cases/salons/qr-strategy"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-pink-600 text-white font-semibold
                             hover:bg-pink-700 transition transform hover:scale-105 shadow"
                >
                  {t.qr_best_practice_cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </section>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                {t.glow_title}
              </h2>

              <p className="mb-4 whitespace-pre-line">
                {t.glow_p1}
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="mb-2">{t.glow_p2}</p>
                <blockquote className="text-lg font-medium text-blue-900 border-l-4 border-blue-200 pl-4">
                  {t.glow_quote}
                </blockquote>
                <p className="mt-4">
                  {t.glow_footer}
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Sparkles className="w-6 h-6 text-purple-500" />
                {t.gamification_title}
              </h2>

              <p className="mb-4 whitespace-pre-line">
                {t.gamification_intro}
              </p>

              <div className="bg-purple-50 p-6 rounded-lg">
                <ul className="space-y-2">
                  {t.gamification_points.map((point, index) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
                <p className="mt-4 whitespace-pre-line">
                  {t.gamification_footer}
                </p>
              </div>
            </div>

            <div className="bg-pink-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Scissors className="w-6 h-6 text-pink-600" />
                {t.features_title}
              </h2>

              <ul className="space-y-4">
                {t.features_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    {point}
                  </li>
                ))}
              </ul>

              <p className="mt-6 font-medium whitespace-pre-line">
                {t.features_footer}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <TrendingUp className="w-6 h-6 text-green-500" />
                {t.growth_title}
              </h2>

              <p className="mb-4 whitespace-pre-line">
                {t.growth_intro}
              </p>

              <p className="mb-6 whitespace-pre-line">
                {t.growth_p1}
              </p>

              <ul className="space-y-2 mb-6">
                {t.growth_points.map((point, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t.shareable_title}
              </h2>

              <p className="mb-6 whitespace-pre-line">
                {t.shareable_intro}
              </p>

              <p className="font-medium mb-4">
                {t.shareable_list_intro}
              </p>
              <ul className="space-y-2">
                {t.shareable_points.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>
          </div>
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
              <h3 className="text-xl font-semibold text-pink-600 mb-2">
                {t.templates[0].title}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                {t.templates[0].desc}
              </p>

              <ul className="text-sm text-gray-700 mb-6 space-y-1">
                {t.templates[0].rules.map((rule, index) => (
                  <li key={index}>• {rule}</li>
                ))}
              </ul>

              <Link
                to="/templates/salon/fresh-glow-spin/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-pink-600 text-white font-semibold
                           hover:bg-pink-700 transition"
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
              <h3 className="text-xl font-semibold text-purple-600 mb-2">
                {t.templates[1].title}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                {t.templates[1].desc}
              </p>

              <ul className="text-sm text-gray-700 mb-6 space-y-1">
                {t.templates[1].rules.map((rule, index) => (
                  <li key={index}>• {rule}</li>
                ))}
              </ul>

              <Link
                to="/templates/salon/weekend-pamper-wheel/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-purple-600 text-white font-semibold
                           hover:bg-purple-700 transition"
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
              <h3 className="text-xl font-semibold text-fuchsia-600 mb-2">
                {t.templates[2].title}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                {t.templates[2].desc}
              </p>

              <ul className="text-sm text-gray-700 mb-6 space-y-1">
                {t.templates[2].rules.map((rule, index) => (
                  <li key={index}>• {rule}</li>
                ))}
              </ul>

              <Link
                to="/templates/salon/vip-repeat-treat/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-fuchsia-600 text-white font-semibold
                           hover:bg-fuchsia-700 transition"
              >
                {t.preview_template}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-600 to-purple-600 text-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            {t.cta_title}
          </h2>
          <p className="text-xl text-pink-100 mb-8 whitespace-pre-line">
            {t.cta_text}
          </p>
          <Link
            to="https://reviewtorevenue.io/auth"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-pink-600 font-semibold text-lg
                     hover:bg-pink-50 transform transition-all hover:scale-105 shadow-lg group"
          >
            {t.cta_button}
            <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-sm text-pink-100 mt-4">
            {t.cta_note}
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}