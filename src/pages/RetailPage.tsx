import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Star, TrendingUp, Store, DollarSign, ArrowRight, ShoppingBag } from 'lucide-react';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const retailPageTranslations = {
  en: {
    label: 'Retail Shops',
    hero_title: 'Build Reputation at Checkout – Turn Every Customer into a Brand Advocate',
    hero_p1: "Your shelves are stocked.\nYour team is helpful.\nYour checkout line is moving.\nBut unless your customers are sharing their experience online, your store stays a best-kept secret.",
    hero_p2: "In a world where Google reviews are the first impression, a strong local reputation isn't a bonus — it's your lifeline.\nAnd if you don't actively collect reviews, the internet assumes you don't have any.",
    invisible_title: 'Why Most Retailers Stay Invisible',
    invisible_intro: "Here's what's killing growth for many small shops:",
    invisible_points: [
      'Low review count = low Google visibility',
      "Less than 4 stars? You're skipped by over half of searchers",
      "No recent reviews? 73% of people won't trust them anyway"
    ],
    invisible_footer: "Even if you're delivering 5-star service, you're not getting the recognition—or foot traffic—you deserve.",
    psychology_title: 'Customer Psychology in Retail: The Missed Opportunity',
    psychology_intro: "Shoppers often leave smiling.\nBut that energy disappears as soon as they leave the store.\nUnless…",
    psychology_action: 'You catch them in the moment.',
    psychology_ask_intro: "That's where a simple ask + a small reward can flip the switch:",
    psychology_quote: '"Leave a quick Google review & spin to win 5% off, a free item, or a secret prize."',
    psychology_why_title: 'Why it works:',
    psychology_reasons: [
      "It's fun",
      "It's instant",
      "It appeals to reciprocity (you gave them something, now they give back)"
    ],
    interaction_title: 'From Transaction to Interaction',
    interaction_p1: "Retail isn't just about what you sell—it's about how people feel buying it.",
    interaction_p2: "Gamification makes checkout more than a payment step. It becomes a positive memory.\nA quick spin of the wheel turns the end of the sale into a surprise-and-delight moment.",
    interaction_results_title: '📈 And the results are real:',
    interaction_stats: [
      '47% more engagement from gamified review prompts',
      '22% more repeat visits when rewards are involved',
      "76% of people say they're more likely to leave a review if there's a small incentive"
    ],
    interaction_footer: 'Even symbolic prizes (stickers, points, discounts) can move the needle—and drive reviews.',
    features_title: 'What You Get with Review to Revenue',
    features_points: [
      'Beautiful, on-brand QR code display for your checkout counter',
      'Instant "Spin & Win" experience after review submission',
      'Custom rewards: store credit, mini freebies, loyalty perks',
      'Google-safe review approach: reward the act, not the rating',
      'Dashboard with real-time stats on review count and reward claims'
    ],
    features_footer: 'No awkward "please leave us a review" conversations.\nNo fake ratings.\nJust honest feedback—collected playfully.',
    local_search_title: 'Why This Matters for Local Search',
    local_search_points: [
      'More reviews → higher local ranking',
      'Higher ranking → more in-store visits',
      'Recent reviews → more trust and more conversions'
    ],
    local_search_data_intro: 'According to data:',
    local_search_stats: [
      'Stores with 200+ Google reviews earn up to 2x the revenue of those with under 50',
      'The sweet spot for trust? 4.2 to 4.5 stars—credible, consistent, human'
    ],
    qr_best_practice_title: '🛍️ How to Get the Most Out of Your QR Codes',
    qr_best_practice_desc: 'See how top retailers turn reviews into foot traffic, loyalty, and sales.\nExplore our easy-to-implement best practices.',
    qr_best_practice_cta: 'Explore Retail Best Practices',
    templates_title: 'Ready-Made Wheel Templates for Retail Shops',
    templates: [
      {
        title: 'Checkout Cheer Spin',
        desc: 'Ask for a quick review right at the till → tempt them back within two weeks.',
        rules: ['Use within: 14 days', 'Need: 4★ review', 'Top win: 10% store credit']
      },
      {
        title: 'Weekend Window Winner',
        desc: 'Turn Saturday-Sunday shoppers into 5★ fans and mid-week buyers.',
        rules: ['Use within: 7 days', 'Need: 4★ review', 'Top win: Free tote bag + goodies']
      },
      {
        title: 'Seasonal Sale Spin',
        desc: 'Highlight new collections & keep shoppers coming back all season.',
        rules: ['Use within: 30 days', 'Need: 4★ review', 'Top win: VIP early-access pass']
      }
    ],
    preview_template: 'Preview full template',
    cta_title: '🚀 Ready to Be the Local Favorite?',
    cta_text: 'Turn every happy customer into your marketing team.\nMake it simple, fast, and fun to leave a review—and reward them for it.',
    cta_button: 'Start Your Free Trial',
    cta_note: 'No credit card needed'
  },

  hu: {
    label: 'Kiskereskedelmi üzletek',
    hero_title: 'Építs hírnevet a pénztárnál – váltsd a vásárlóidat márkanagykövetekké',
    hero_p1: 'A polcaid tele vannak.\nA csapatod segítőkész.\nA sor halad.\nDe ha a vásárlóid nem osztják meg az élményt online, az üzleted titok marad.',
    hero_p2: 'Egy olyan világban, ahol a Google értékelés az első benyomás, a helyi hírnév nem extra – ez az éltetőerőd.\nHa nem kérsz aktívan véleményt, az internet úgy veszi: nincs itt semmi látnivaló.',
    invisible_title: 'Miért marad láthatatlan sok üzlet?',
    invisible_intro: 'Íme, mi gátolja a kisboltok növekedését:',
    invisible_points: [
      'Kevés értékelés = alacsony Google-láthatóság',
      '4 csillag alatt? A keresők több mint fele továbblép',
      'Nincs friss értékelés? 73% nem fog megbízni benned'
    ],
    invisible_footer: 'Lehet, hogy 5 csillagos szolgáltatást adsz, mégsem kapod meg az elismerést – vagy a forgalmat.',
    psychology_title: 'A vásárlók pszichológiája: elmulasztott lehetőség',
    psychology_intro: 'A vásárlók gyakran mosolyogva távoznak.\nDe ez az élmény elillan, mihelyt kilépnek a boltból.\nKivéve ha…',
    psychology_action: 'Elkapod őket abban a pillanatban.',
    psychology_ask_intro: 'Egy egyszerű kérés és egy kis jutalom mindent megváltoztathat:',
    psychology_quote: '"Írj gyorsan egy Google-véleményt, és pörgess a nyereményért: 5% kedvezmény, ajándék vagy meglepetés!"',
    psychology_why_title: 'Miért működik:',
    psychology_reasons: [
      'Szórakoztató',
      'Azonnali',
      'Kölcsönösségen alapul (adtál valamit – most ő ad vissza)'
    ],
    interaction_title: 'A tranzakcióból kapcsolat lesz',
    interaction_p1: 'A kiskereskedelem nem csak arról szól, mit árulsz – hanem arról, hogy a vásárló hogy érzi magát közben.',
    interaction_p2: 'A játékosítás élménnyé változtatja az egyszerű fizetést.\nEgy gyors pörgetés emlékezetessé teszi az utolsó pillanatot.',
    interaction_results_title: '📈 És az eredmények valósak:',
    interaction_stats: [
      '47%-kal több elköteleződés játékosított véleménykéréssel',
      '22%-kal több visszatérő vásárló jutalom esetén',
      '76% hajlamosabb véleményt írni, ha van kis ösztönző'
    ],
    interaction_footer: 'Még a szimbolikus nyeremények (matricák, pontok, kedvezmények) is működnek – és hozzák az értékeléseket.',
    features_title: 'Ezt kapod a Review to Revenue-val',
    features_points: [
      'Szépen kialakított, arculathoz illő QR-kód a pénztárnál',
      'Azonnali „Pörgess & Nyerj" élmény értékelés után',
      'Saját boltodra szabott jutalmak: kedvezmény, ajándék, hűségpontok',
      'Google-barát megoldás: a vélemény írása a jutalmazott, nem a tartalom',
      'Valós idejű irányítópult: értékelések, pörgetések, nyeremények'
    ],
    features_footer: 'Nincs több kínos „írj véleményt" kérés.\nNincs hamis csillagozás.\nCsak őszinte visszajelzés – játékosan begyűjtve.',
    local_search_title: 'Miért fontos ez a helyi keresésben?',
    local_search_points: [
      'Több vélemény → jobb helyezés a térképen',
      'Magasabb helyezés → több látogató a boltban',
      'Friss vélemények → több bizalom és konverzió'
    ],
    local_search_data_intro: 'Az adatok szerint:',
    local_search_stats: [
      'A 500+ Google értékeléssel rendelkező boltok akár kétszer annyit keresnek, mint a kevesebb mint 250 értékeléssel bírók',
      'Az ideális értékelési tartomány: 4.4–4.7 – megbízható, valóságos, emberi'
    ],
    qr_best_practice_title: '🛍️ Hozd ki a legtöbbet a QR-kódjaidból',
    qr_best_practice_desc: 'Nézd meg, hogyan alakítják a legjobb boltok a véleményeket forgalommá, lojalitássá és eladássá.\nHasználj egyszerűen bevezethető módszereket!',
    qr_best_practice_cta: 'Nézd meg a bevált bolti módszereket',
    templates_title: 'Előkészített „Szerencsekerék" sablonok boltoknak',
    templates: [
      {
        title: 'Pénztári Pörgetés',
        desc: 'Kérj véleményt közvetlenül fizetéskor → csalogasd vissza két héten belül.',
        rules: ['Felhasználható: 14 nap', 'Feltétel: 4★ vélemény', 'Fődíj: 10% bolt kredit']
      },
      {
        title: 'Hétvégi nyertes',
        desc: 'Váltsd a szombat-vasárnapi vásárlókat 5★ rajongókká és hétköznapi vevőkké.',
        rules: ['Felhasználható: 7 nap', 'Feltétel: 4★ vélemény', 'Fődíj: Ajándék vászontáska']
      },
      {
        title: 'Szezonális Akció',
        desc: 'Emeld ki az új kollekciókat, és hozd vissza a vásárlóid még a szezonban.',
        rules: ['Felhasználható: 30 nap', 'Feltétel: 4★ vélemény', 'Fődíj: VIP elővásárlási jogosultság']
      }
    ],
    preview_template: 'Sablon megtekintése',
    cta_title: '🚀 Legyél te a környék kedvence!',
    cta_text: 'Fordíts minden boldog vásárlót a marketingeseddé.\nTedd egyszerűvé, gyorssá és szórakoztatóvá a véleményírást – és jutalmazd meg őket.',
    cta_button: 'Próbáld ki ingyen',
    cta_note: 'Nincs szükség bankkártyára'
  }
};

export default function RetailPage() {
  const { language } = useLanguage();
  const t = retailPageTranslations[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center text-2xl mb-4">
              🛍️ {t.label}
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
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-green-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-emerald-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg">
            <div className="bg-red-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Trophy className="w-6 h-6 text-red-500" />
                {t.invisible_title}
              </h2>
              
              <p className="font-medium mb-4">{t.invisible_intro}</p>
              <ul className="space-y-2">
                {t.invisible_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    {point}
                  </li>
                ))}
              </ul>

              <p className="mt-4 font-medium">
                {t.invisible_footer}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                {t.psychology_title}
              </h2>

              <p className="mb-4 whitespace-pre-line">
                {t.psychology_intro}
              </p>

              <p className="font-medium mb-4">{t.psychology_action}</p>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="mb-2">{t.psychology_ask_intro}</p>
                <blockquote className="text-lg font-medium text-blue-900 border-l-4 border-blue-200 pl-4">
                  {t.psychology_quote}
                </blockquote>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-medium mb-4">{t.psychology_why_title}</p>
                <ul className="space-y-2">
                  {t.psychology_reasons.map((reason, index) => (
                    <li key={index}>• {reason}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Store className="w-6 h-6 text-purple-500" />
                {t.interaction_title}
              </h2>

              <p className="mb-4">
                {t.interaction_p1}
              </p>

              <p className="mb-6 whitespace-pre-line">
                {t.interaction_p2}
              </p>

              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="font-medium mb-4">{t.interaction_results_title}</p>
                <ul className="space-y-2">
                  {t.interaction_stats.map((stat, index) => (
                    <li key={index}>• {stat}</li>
                  ))}
                </ul>
                <p className="mt-4">
                  {t.interaction_footer}
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <ShoppingBag className="w-6 h-6 text-green-600" />
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
                <TrendingUp className="w-6 h-6 text-blue-500" />
                {t.local_search_title}
              </h2>

              <ul className="space-y-2 mb-6">
                {t.local_search_points.map((point, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-medium mb-4">{t.local_search_data_intro}</p>
                <ul className="space-y-2">
                  {t.local_search_stats.map((stat, index) => (
                    <li key={index}>• {stat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Best Practices Section */}
      <section className="py-16 bg-emerald-50 border-t border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            {t.qr_best_practice_title}
          </motion.h2>
          <p className="text-lg text-gray-700 mb-8 whitespace-pre-line">
            {t.qr_best_practice_desc}
          </p>
          <Link
            to="/use-cases/retail/qr-strategy"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold
                     hover:bg-emerald-700 transition transform hover:scale-105 shadow"
          >
            {t.qr_best_practice_cta}
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
              <h3 className="text-xl font-semibold text-emerald-600 mb-2">
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
                to="/templates/retail/checkout-charm/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-emerald-600 text-white font-semibold
                           hover:bg-emerald-700 transition"
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
                to="/templates/retail/weekend-window-winner/v1.0"
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
              <h3 className="text-xl font-semibold text-rose-600 mb-2">
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
                to="/templates/retail/seasonal-sale-spin/v1.0"
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
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-600 text-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-xl text-green-100 mb-8 whitespace-pre-line">
            {t.cta_text}
          </p>
          <Link
            to="https://reviewtorevenue.io/auth"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-green-600 font-semibold text-lg
                     hover:bg-green-50 transform transition-all hover:scale-105 shadow-lg group"
          >
            {t.cta_button}
            <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-sm text-green-100 mt-4">{t.cta_note}</p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}