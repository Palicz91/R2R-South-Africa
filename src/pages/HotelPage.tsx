import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Star, TrendingUp, Building2, DollarSign, ArrowRight, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';

const hotelPageTranslations = {
  en: {
    title: 'Hotels & Guesthouses',
    hero_title: 'Great Stays Deserve Great Reviews – Make Sure You Get Them',
    hero_subtitle_1: "Your guests loved the view.\nThe room was spotless. The breakfast? Chef's kiss.\nBut if you're not capturing that moment before they walk out the door, you're losing valuable reviews—and potential bookings.",
    hero_subtitle_2: "Here's the reality:\nPeople check Google before booking. They trust the stars. They read the latest reviews.\nAnd if your property isn't well-rated (or barely reviewed), many will skip you without a second thought.",

    silence_title: 'The Risk of Silence',
    silence_paragraph_1: "Most guests don't leave reviews unless you ask.\nAnd if the only ones writing are the few who had a problem? Your online reputation doesn't reflect the real experience you offer.",
    silence_paragraph_2: 'Let the numbers speak:',
    silence_stats: [
      '94% of travelers avoid hotels with bad reviews',
      '73% ignore reviews older than 1 month',
      'Businesses with 4.0+ stars earn ~32% more revenue'
    ],
    silence_footer: "It's not about being perfect. It's about being actively reviewed.",

    timing_title: 'Capture the Moment Before Checkout',
    timing_paragraph_1: "When's the best time to ask for a review?\nRight after a great stay—before the bags are packed and the memory fades.",
    timing_intro: 'Drop a simple sign at the front desk or include it in your digital checkout flow:',
    timing_card_quote: '"Loved your stay? Leave a quick Google review & spin to win a discount, free upgrade, or local treat."',
    timing_card_footer: "It's light, engaging, and instantly boosts participation.",
    timing_results_title: '✅ Results you can expect:',
    timing_results: [
      'Higher guest satisfaction through playful engagement',
      'Increased return visits when rewards bring guests back',
      'Better rankings on Google Maps = more bookings'
    ],

    psychology_title: 'The Power of Play',
    psychology_paragraph_1: "Gamification doesn't just motivate—it delights.",
    psychology_paragraph_2: "That last interaction with your brand (checkout) becomes memorable, not transactional.\nAnd when guests feel good, they write good things.",
    psychology_proof_title: 'Psychology backs this:',
    psychology_stats: [
      '47% increase in engagement from gamified interactions',
      "76% of customers are more likely to leave a review if there's a small incentive",
      'Even symbolic rewards (a keychain, badge, or free coffee) trigger reciprocity – the urge to give back'
    ],

    features_title: 'What You Get with Review to Revenue',
    features_list: [
      'Branded QR codes placed at reception or in post-stay emails',
      'Gamified "Spin to Win" experience tied to reviews',
      'Custom reward options: free upgrades, discounts, vouchers, loyalty points',
      'Google-compliant system: rewards are for the action, not the rating',
      'Review collection that runs quietly in the background—while you focus on guest experience'
    ],

    revenue_title: 'More Reviews = More Bookings',
    revenue_intro: 'The math is simple:',
    revenue_list: [
      'More reviews → better local SEO',
      'Better ratings → higher trust and conversion',
      'Recent reviews → increased visibility in Google Travel & Maps'
    ],
    revenue_footer_title: 'According to recent data:',
    revenue_footer_stats: [
      'Properties with 200+ reviews earn 2× more revenue than similar listings with minimal reviews',
      'A high rating (4.2–4.5 stars) is the sweet spot for trust and credibility'
    ],

    qr_title: '🏨 How to Get the Most Out of Your QR Codes',
    qr_text: 'Discover how top hotels and guesthouses use smart QR code strategies to boost reviews, loyalty, and repeat bookings. Dive in for practical insights and proven tactics.',
    qr_button: 'Explore Hotel Best Practices',

    wheels_title: 'Ready-to-Go Wheels for Hotels & Guesthouses',
    card_1_title: 'Guest Checkout Spin',
    card_1_text: 'Ask for a quick review at check-out → fill tomorrow\'s empty rooms.',
    card_1_stats: ['Use within: 7 days', 'Need: 4★ or 5★ review', 'Top win: Free early check-in next time'],
    card_2_title: 'Weekend Fun Wheel',
    card_2_text: 'Turn Sunday smiles into 5★ buzz & new bookings.',
    card_2_stats: ['Use within: 30 days', 'Need: 4★ or 5★ review', 'Top win: 50% off a 2-night stay'],
    card_3_title: 'VIP Upgrade Spin',
    card_3_text: 'Say thanks to repeat guests → get fresh reviews that rank.',
    card_3_stats: ['Use within: 60 days', 'Need: 4★ or 5★ review', 'Top win: Free room upgrade'],
    preview_template: 'Preview full template',

    cta_title: '🚀 Make Every Stay Count',
    cta_text: "You've already delivered a great guest experience.\nNow let's make sure the world hears about it.",
    cta_button: 'Start Your Free Trial',
    cta_note: 'No credit card needed'
  },

  hu: {
    title: 'Hotelek és panziók',
    hero_title: 'A nagyszerű élmények megérdemlik a nagyszerű értékeléseket – Gondoskodj róla, hogy meg is kapd őket',
    hero_subtitle_1: 'Vendégeid imádták a kilátást.\nA szoba makulátlan volt. A reggeli? Egy kulináris élmény.\nDe ha nem kérsz értékelést, mielőtt kilépnek az ajtón, értékes visszajelzésekről és foglalásokról maradhatsz le.',
    hero_subtitle_2: 'A valóság:\nAz emberek a Google-t nézik meg, mielőtt foglalnak. A csillagok számítanak. Elolvassák a legfrissebb értékeléseket.\nHa az ingatlanod nincs jól értékelve (vagy alig van értékelésed), könnyen továbbállnak.',

    silence_title: 'A csend kockázata',
    silence_paragraph_1: 'A legtöbb vendég nem ír értékelést, hacsak nem kéred meg.\nÉs ha csak azok írnak, akiknek gondjuk volt? Az online hírneved nem tükrözi a valódi élményt.',
    silence_paragraph_2: 'Beszéljenek a számok:',
    silence_stats: [
      'Az utazók 94%-a elkerüli a rosszul értékelt szállásokat',
      'A vendégek 73%-a figyelmen kívül hagyja az 1 hónapnál régebbi értékeléseket',
      'A 4.0+ csillagos helyek ~32%-kal több bevételt termelnek'
    ],
    silence_footer: 'Nem a tökéletesség számít, hanem az, hogy aktívan érkeznek-e az értékelések.',

    timing_title: 'Kérj értékelést a kijelentkezés előtt',
    timing_paragraph_1: 'Mikor a legjobb értékelést kérni?\nKözvetlenül a nagyszerű élmény után – mielőtt becsomagolnának és az emlék elhalványulna.',
    timing_intro: 'Helyezz egy egyszerű táblát a recepcióra vagy add hozzá a digitális kijelentkezési folyamathoz:',
    timing_card_quote: '"Jó volt a tartózkodás? Írj gyors Google értékelést, pörgesd meg a kereket és nyerj - kedvezméynt a következő foglalásból, ajándékot, hűtőmágnest"',
    timing_card_footer: 'Könnyed, szórakoztató, és azonnal növeli a részvételt.',
    timing_results_title: '✅ Ezekre számíthatsz:',
    timing_results: [
      'Nagyobb vendégelégedettség játékos élményen keresztül',
      'Több visszatérő vendég, ha a nyeremény visszacsábítja őket',
      'Jobb rangsor a Google Térképen = több foglalás'
    ],

    psychology_title: 'A játék ereje',
    psychology_paragraph_1: 'A játékosítás nem csak motivál – örömet is szerez.',
    psychology_paragraph_2: 'Az utolsó pillanat (kijelentkezés) emlékezetessé válik, nem csak formális lezárássá.\nHa a vendég jól érzi magát, jó dolgokat is fog írni.',
    psychology_proof_title: 'A pszichológia is alátámasztja:',
    psychology_stats: [
      '47%-kal nagyobb elköteleződés játékos élmények hatására',
      '76%-kal nagyobb eséllyel ír értékelést, ha van kis ösztönző',
      'Még a jelképes ajándékok is (kulcstartó, badge, kávé) aktiválják a viszonzás ösztönét'
    ],

    features_title: 'Mit kapsz a Review to Revenue-val?',
    features_list: [
      'Márkázott QR-kódok a recepción vagy utólagos e-mailben',
      'Játékosított "Pörgesd meg a kereket" élmény az értékelésekért',
      'Egyedi nyeremények: ingyenes frissítés, kedvezmény, kupon, pontgyűjtés',
      'Google-kompatibilis rendszer: a cselekvést jutalmazza, nem az értékelést',
      'Automatikus értékelésgyűjtés a háttérben – miközben te a vendégekre fókuszálsz'
    ],

    revenue_title: 'Több értékelés = több foglalás',
    revenue_intro: 'Egyszerű a képlet:',
    revenue_list: [
      'Több értékelés → jobb helyi keresési eredmények',
      'Jobb értékelés → nagyobb bizalom és konverzió',
      'Friss értékelések → jobb láthatóság a Google Travel-ben és Térképen'
    ],
    revenue_footer_title: 'A legújabb statisztikák szerint:',
    revenue_footer_stats: [
      'A 500+ értékeléssel rendelkező szállások 2× annyi bevételt hoznak, mint az alig értékelt versenytársak',
      'A 4.4–4.7 csillagos átlag a bizalom szempontjából az ideális tartomány'
    ],

    qr_title: '🏨 Hozd ki a legtöbbet QR-kódjaidból',
    qr_text: 'Nézd meg, hogyan használják a QR-stratégiákat a top hotelek és panziók, hogy növeljék az értékelések számát, a hűséget és a visszatérő foglalásokat. Gyakorlati tippek és bevált módszerek várnak.',
    qr_button: 'Hotel tippek és stratégiák',

    wheels_title: 'Kész sablonok hoteleknek és panzióknak',
    card_1_title: 'Kijelentkezési Játék',
    card_1_text: 'Kérj gyors értékelést kijelentkezéskor → töltsd meg a holnapi üres szobákat.',
    card_1_stats: ['Felhasználás: 7 nap', 'Szükséges: 4★ vagy 5★ értékelés', 'Fődíj: Ingyenes korai bejelentkezés legközelebb'],
    card_2_title: 'Hétvégi Szórakoztató',
    card_2_text: 'Változtasd a vasárnapi mosolyokat 5★ hírnévre és új foglalásokra.',
    card_2_stats: ['Felhasználás: 30 nap', 'Szükséges: 4★ vagy 5★ értékelés', 'Fődíj: 50% kedvezmény 2 éjszakás tartózkodásra'],
    card_3_title: 'VIP Frissítési',
    card_3_text: 'Köszönd meg a visszatérő vendégeknek → szerezz friss értékeléseket.',
    card_3_stats: ['Felhasználás: 60 nap', 'Szükséges: 4★ vagy 5★ értékelés', 'Fődíj: Ingyenes szoba upgrade'],
    preview_template: 'Sablon teljes előnézete',

    cta_title: '🚀 Minden tartózkodás számít',
    cta_text: 'Már nyújtottál nagyszerű élményt.\nMost mutassuk meg a világnak is.',
    cta_button: 'Indítsd el az ingyenes próbaidőszakot',
    cta_note: 'Bankkártya nélkül is működik'
  }
};

export default function HotelPage() {
  const { language, setLanguage } = useLanguage();
  const t = hotelPageTranslations[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center text-2xl mb-4">
              🏨 {t.title}
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
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-sky-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg">
            <div className="bg-red-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Trophy className="w-6 h-6 text-red-500" />
                {t.silence_title}
              </h2>
              
              <p className="mb-4 whitespace-pre-line">
                {t.silence_paragraph_1}
              </p>

              <p className="font-medium mb-4">{t.silence_paragraph_2}</p>
              <ul className="space-y-2">
                {t.silence_stats.map((stat, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    {stat}
                  </li>
                ))}
              </ul>

              <p className="mt-4 font-medium">
                {t.silence_footer}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                {t.timing_title}
              </h2>

              <p className="mb-4 whitespace-pre-line">
                {t.timing_paragraph_1}
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p>{t.timing_intro}</p>
                <p className="text-lg font-medium my-4 text-blue-900">
                  {t.timing_card_quote}
                </p>
                <p>{t.timing_card_footer}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <p className="font-medium mb-4">{t.timing_results_title}</p>
                <ul className="space-y-2">
                  {t.timing_results.map((result, index) => (
                    <li key={index}>• {result}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Building2 className="w-6 h-6 text-purple-500" />
                {t.psychology_title}
              </h2>

              <p className="mb-4">
                {t.psychology_paragraph_1}
              </p>

              <p className="mb-6 whitespace-pre-line">
                {t.psychology_paragraph_2}
              </p>

              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="font-medium mb-4">{t.psychology_proof_title}</p>
                <ul className="space-y-2">
                  {t.psychology_stats.map((stat, index) => (
                    <li key={index}>• {stat}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-sky-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <MapPin className="w-6 h-6 text-sky-600" />
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
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <TrendingUp className="w-6 h-6 text-green-500" />
                {t.revenue_title}
              </h2>

              <p className="text-xl mb-4">{t.revenue_intro}</p>
              <ul className="space-y-2 mb-6">
                {t.revenue_list.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-medium mb-4">{t.revenue_footer_title}</p>
                <ul className="space-y-2">
                  {t.revenue_footer_stats.map((stat, index) => (
                    <li key={index}>• {stat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* QR Code Best Practices Section */}
      <section className="py-16 bg-blue-50 border-t border-blue-100">
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
            {t.qr_text}
          </p>
          <Link
            to="/use-cases/hotels/qr-strategy"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold
                     hover:bg-sky-700 transition transform hover:scale-105 shadow"
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
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
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
                to="/templates/hotel/guest-checkout-spin/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-indigo-600 text-white font-semibold
                           hover:bg-indigo-700 transition"
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
              <h3 className="text-xl font-semibold text-sky-600 mb-2">
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
                to="/templates/hotel/weekend-fun-wheel/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-sky-600 text-white font-semibold
                           hover:bg-sky-700 transition"
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
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">
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
                to="/templates/hotel/vip-upgrade-spin/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-emerald-600 text-white font-semibold
                           hover:bg-emerald-700 transition"
              >
                {t.preview_template}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sky-600 to-blue-600 text-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-xl text-sky-100 mb-8 whitespace-pre-line">
            {t.cta_text}
          </p>
          <Link
            to="https://reviewtorevenue.io/auth"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-sky-600 font-semibold text-lg
                     hover:bg-sky-50 transform transition-all hover:scale-105 shadow-lg group"
          >
            {t.cta_button}
            <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-sm text-sky-100 mt-4">{t.cta_note}</p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}