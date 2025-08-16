import { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Star, TrendingUp, Smile, ArrowRight, Scissors } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';

const barbershopPageTranslations = {
  en: {
    title: 'Barbershops',
    hero_title: 'Cut Above the Noise: Turn Great Haircuts into 5-Star Visibility',
    hero_paragraph: "In today's world, one sharp fade won't cut it. If your shop isn't ranking on Google Maps, you're losing walk-ins to competitors with better online reputations—no matter how skilled you are with the clippers.",

    truth_title: 'The Truth About Reviews',
    truth_paragraph_1: 'A single bad review can cost you dozens of new customers. But the real issue? Happy clients almost never leave a review—unless you ask.',
    truth_paragraph_2: "That's where gamified review collection comes in. Subtle. Fun. Incredibly effective.",

    reputation_title: 'Why Reputation Is Everything in Grooming',
    reputation_list_intro: "Let's break it down:",
    reputation_list: [
      '94% of people have avoided a business after reading a negative review',
      'Only 9% of consumers will even consider a barbershop rated below 4 stars',
      'Businesses with 4.0+ stars earn ~32% more revenue than lower-rated competitors'
    ],
    reputation_that_means: 'That means:',
    reputation_paragraph: 'One bad rating without fresh reviews to balance it? 💣 Say goodbye to trust.\nBut flip the switch and start actively collecting reviews? You win big.',
    reputation_footer: 'More trust = more appointments, more word of mouth, and more returning clients.',

    spin_title: 'The Spin That Fills the Chair',
    spin_quote_intro: 'Imagine this:',
    spin_quote_context: 'Your client just looked in the mirror and said, "Damn, that\'s perfect."\nYou smile, hand them a mirror... and a small card that says:',
    spin_quote: '"Loved your cut? Leave us a quick review & spin to win a discount, free product, or next-visit bonus."',
    spin_footer: 'One scan. One spin. One review.\nThey\'re hyped. You\'re visible.',
    spin_stats_intro: "Here's why this works:",
    spin_stats: [
      'Gamified experiences drive 47% more engagement',
      '22% more repeat visits when loyalty + rewards are involved',
      'Even small prizes (a free styling wax, 10% off next visit) trigger action and loyalty'
    ],

    psychology_title: 'Why Barbershops Win with Gamification',
    psychology_intro: 'This is about psychology:',
    psychology_list: [
      'Dopamine hit: Spinning a wheel = instant pleasure boost',
      "Reciprocity: You gave them a boost in confidence—they'll want to give something back",
      'Social proof: They want others to discover "their" barber'
    ],
    psychology_footer: "In fact, 76% of people say they're more likely to leave a review if a reward is offered.\nAnd 29% admit they've only done it because they were rewarded.",
    psychology_footer_2: "Let's face it—reviews aren't altruism. They're a value exchange.\nSo why not make that exchange fun?",

    seo_title: "The Local SEO Boost You Can't Ignore",
    seo_paragraph: "More reviews don't just build trust—they drive traffic.\nLiterally.",
    seo_card: 'The more frequent and positive your reviews, the higher you show up on Google Maps and local search.\nAnd since 73% of people ignore reviews older than 1 month, consistency is key.',
    seo_card_footer: 'Review to Revenue automates that consistency—with a gamified twist.',

    features_title: 'What You Get with Review to Revenue',
    features_list: [
      'QR-code based review flow tailored for barbershops',
      'Fully gamified experience: "Review & Spin to Win"',
      "Google-friendly (we don't pay for reviews—we reward participation ethically)",
      'Easy setup at checkout or mirror stations',
      'Built-in reward distribution system (in-shop or digital)'
    ],
    features_footer: 'You keep cutting. We turn your cuts into customer trust—and revenue.',

    qr_title: '💈 Master the Art of QR-Driven Loyalty',
    qr_text: 'Learn how to turn every haircut, every chair, and every smile into an engine for retention and growth.\nExplore practical QR strategies for barbershops that respect your vibe—and grow your Google game.',
    qr_button: 'Explore Best Practices for Barbershops',

    wheels_title: 'Ready-to-Go Wheels for Barbershops',
    card_1_title: 'Fresh Fade Feedback',
    card_1_text: 'Grab those weekday lunch-hour cuts and get them back in the chair within two weeks.',
    card_1_stats: ['Use within: 14 days', 'Need: 4★ review', 'Top win: Free premium skin-fade cut'],
    card_2_title: 'Weekend Buzz Booster',
    card_2_text: 'Turn Saturday-Sunday hype into fresh 5★ reviews and mid-week bookings.',
    card_2_stats: ['Use within: 7 days', 'Need: 4★ review', 'Top win: "Sharp All-Year" annual pass'],
    card_3_title: 'Loyalty Chair Spin',
    card_3_text: 'Treat your regulars, upsell beard care, and spotlight premium products.',
    card_3_stats: ['Use within: 21 days', 'Need: 4★ review', 'Top win: VIP grooming bundle'],
    preview_template: 'Preview full template',

    cta_title: '🚀 Ready to Build a Buzzcut-Worthy Reputation?',
    cta_text: "Don't wait for reviews to (maybe) happen.\nMake them part of the experience—right when your clients feel their best.",
    cta_button: 'Start Your Free Trial',
    cta_note: 'No credit card needed'
  },

  hu: {
    title: 'Fodrászoknak',
    hero_title: 'Tűnj ki a tömegből: Alakítsd a remek frizurákat 5 csillagos értékelésekké',
    hero_paragraph: 'Ma már egy jól sikerült hajvágás önmagában nem elég. Ha a fordrászüzleted nem jelenik meg a Google Térképen, elveszíted a beugró vendégeket a jobb online jelenlétű versenytársakkal szemben – függetlenül attól, milyen jól bánsz az ollóval.',

    truth_title: 'Az igazság az értékelésekről',
    truth_paragraph_1: 'Egyetlen rossz értékelés tucatnyi új ügyfél elvesztését jelentheti. De a valódi gond? Az elégedett vendégek szinte soha nem írnak értékelést – hacsak nem kéred meg őket.',
    truth_paragraph_2: 'Itt jön képbe a játékba ágyazott értékelésgyűjtés. Diszkrét. Szórakoztató. Hihetetlenül hatékony.',

    reputation_title: 'Miért fontosabb mindennél a hírnév a szépségiparban?',
    reputation_list_intro: 'Nézzük meg számokban:',
    reputation_list: [
      'Az emberek 94%-a elkerül egy üzletet, ha rossz értékelést olvasott róla',
      'Csak a fogyasztók 9%-a fontol meg 4 csillag alatti értékelésű üzletet',
      'A 4.0+ csillagos üzletek átlagosan ~32%-kal több bevételt termelnek'
    ],
    reputation_that_means: 'Ez azt jelenti:',
    reputation_paragraph: 'Egy rossz értékelés friss vélemények nélkül? 💣 Viszlát bizalom.\nDe ha rendszeresen gyűjtesz véleményt? Nagyot nyersz.',
    reputation_footer: 'Több bizalom = több időpont, több ajánlás, több visszatérő vendég.',

    spin_title: 'A játék, ami feltölti a széket',
    spin_quote_intro: 'Képzeld el ezt:',
    spin_quote_context: 'A vendéged épp a tükörbe nézett és azt mondta: "Tökéletes!"\nMosolyogsz, odaadod a tükröt... és egy kis kártyát:',
    spin_quote: '"Tetszett a hajad? Írj egy gyors értékelést és pörgess egy kedvezményért, ajándékért vagy bónuszért!"',
    spin_footer: 'Egy szkennelés. Egy pörgetés. Egy értékelés.\nA vendéged lelkes, te pedig kitűnsz a tömegből.',
    spin_stats_intro: 'Ezért működik ilyen jól, egy kis viselkedés pszihológia:',
    spin_stats: [
      'A játékba ágyazott élmények 47%-kal több elköteleződést hoznak',
      '22%-kal több visszatérő vendéget, ha jutalom is jár',
      'Még a kis ajándékok (pl. ingyen haj wax, 10% kedvezmény) is aktiválják a vendégeket'
    ],

    psychology_title: 'Miért nyernek a fodrászok ha játkossá teszik az értékelésgyűjtést?',
    psychology_intro: 'Ez pszichológia:',
    psychology_list: [
      'Dopaminlöket: A kerék megpörgetése azonnali örömérzetet ad',
      'Viszonzás: Ha adtál a vednégednek egy ajándékot, ők is adni akarnak valamit',
      'Társas bizonyíték: A vendéged azt akarja, más is lássa milyen szuper helyre járnak'
    ],
    psychology_footer: 'A statisztikák szerint 76% nagyobb eséllyel írnak értékelést a vendégek , ha jár érte jutalom.\n29% csak azért írta meg, mert kapott valamit.',
    psychology_footer_2: 'Legyünk őszinték: az értékelés nem önzetlenség – értékcsere.\nAkkor miért ne legyen szórakoztató?',

    seo_title: 'A Google Maps keresések ereje, amit nem hagyhatsz figyelmen kívül',
    seo_paragraph: 'A több értékelés nem csak bizalmat épít – forgalmat is generál.\nSzó szerint.',
    seo_card: 'Minél több és frissebb pozitív értékelést kapsz, annál előrébb kerülsz a Google-ben és a helyi keresésekben.\nMivel az emberek 73%-a figyelmen kívül hagyja az 1 hónapnál régebbi értékeléseket, a rendszeresség kulcsfontosságú.',
    seo_card_footer: 'A Review to Revenue ezt automatizálja – játékos formában.',

    features_title: 'Mit kapsz a Review to Revenue-val',
    features_list: [
      'QR-kód alapú értékelési folyamat fordász üzletekre szabva',
      'Játékos folyamatot: "Értékelj és pörgess!"',
      'Google-barát (nem veszünk értékeléseket, csak a részvételt jutalmazzuk)',
      'Könnyű beállítás, 5 perc és kezdheted is gyűjetni az értékeléseket',
      'Beépített nyereménykezelő rendszer (üzletben vagy digitálisan)'
    ],
    features_footer: 'Te vágod a hajat. Mi bizalmat és bevételt építünk belőle.',

    qr_title: '💈 Mesteri QR-hűségépítés',
    qr_text: 'Tanuld meg, hogyan válhat minden hajvágás, minden vendég és minden mosoly a növekedés motorjává.\nFedezd fel a fodrászüzletekre szabott QR-stratégiákat, amelyek passzolnak a stílusodhoz és segítenek uralni a Google-t.',
    qr_button: 'Fodrászüzletekre szabva:',

    wheels_title: 'Kész sablonok fodrászüzleteknek',
    card_1_title: 'Friss Fade Visszajelzés',
    card_1_text: 'Fogd meg a hétköznapi ebédidős vendégeket és hozd vissza őket két héten belül.',
    card_1_stats: ['Felhasználás: 14 nap', 'Szükséges: 4★ értékelés', 'Fődíj: Ingyenes prémium fade vágás'],
    card_2_title: 'Hétvégi Buzz Booster',
    card_2_text: 'A szombat-vasárnapi hangulatból friss 5★ értékelések és hét közepi foglalások.',
    card_2_stats: ['Felhasználás: 7 nap', 'Szükséges: 4★ értékelés', 'Fődíj: "Egész éves éles" bérlet'],
    card_3_title: 'Hűségszék Pörgetés',
    card_3_text: 'Kényeztesd a törzsvendégeket, add el a szakállápolást és mutasd be a prémium termékeket.',
    card_3_stats: ['Felhasználás: 21 nap', 'Szükséges: 4★ értékelés', 'Fődíj: VIP ápolási csomag'],
    preview_template: 'Sablon teljes előnézete',

    cta_title: '🚀 Készen állsz egy penge hírnévre?',
    cta_text: 'Ne várd meg, hogy véletlenül jöjjön egy értékelés.\nTedd a folyamat részévé – amikor a vendég a legelégedettebb.',
    cta_button: 'Kezdd el az ingyenes próbaiőszakot',
    cta_note: 'Nincs szükség bankkártyára'
  }
};

export default function BarbershopPage() {
  const { language, setLanguage } = useLanguage();
  const t = barbershopPageTranslations[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center text-2xl mb-4">
              💈 {t.title}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t.hero_title}
            </h1>
            <p className="text-xl text-gray-600">
              {t.hero_paragraph}
            </p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.truth_title}
              </h2>
              <p className="text-gray-600 mb-4">
                {t.truth_paragraph_1}
              </p>
              <p className="text-gray-600 font-medium">
                {t.truth_paragraph_2}
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Trophy className="w-6 h-6 text-blue-500" />
                {t.reputation_title}
              </h2>
              
              <p className="font-medium mb-4">{t.reputation_list_intro}</p>
              <ul className="space-y-2 mb-6">
                {t.reputation_list.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="font-medium mb-4">{t.reputation_that_means}</p>
              <p className="whitespace-pre-line mb-4">{t.reputation_paragraph}</p>
              <p className="mt-4">{t.reputation_footer}</p>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                {t.spin_title}
              </h2>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="font-medium mb-2">{t.spin_quote_intro}</p>
                <p className="whitespace-pre-line mb-4">{t.spin_quote_context}</p>
                <p className="text-lg font-medium my-4 text-blue-900">
                  {t.spin_quote}
                </p>
              </div>

              <p className="mb-6 whitespace-pre-line">
                {t.spin_footer}
              </p>

              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-medium mb-4">{t.spin_stats_intro}</p>
                <ul className="space-y-2">
                  {t.spin_stats.map((stat, index) => (
                    <li key={index}>• {stat}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Smile className="w-6 h-6 text-purple-500" />
                {t.psychology_title}
              </h2>

              <p className="mb-4">{t.psychology_intro}</p>
              <ul className="space-y-4 mb-6">
                {t.psychology_list.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <strong>{item}</strong>
                  </li>
                ))}
              </ul>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <p className="whitespace-pre-line mb-4">{t.psychology_footer}</p>
                <p className="font-medium whitespace-pre-line">{t.psychology_footer_2}</p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <TrendingUp className="w-6 h-6 text-green-500" />
                {t.seo_title}
              </h2>

              <p className="text-xl mb-4 whitespace-pre-line">{t.seo_paragraph}</p>

              <div className="bg-green-50 p-6 rounded-lg">
                <p className="whitespace-pre-line mb-4">{t.seo_card}</p>
                <p className="font-medium">{t.seo_card_footer}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-xl mb-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Scissors className="w-6 h-6 text-blue-600" />
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

              <p className="mt-6 font-medium">{t.features_footer}</p>
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
          <p className="text-lg text-gray-700 mb-8 whitespace-pre-line">
            {t.qr_text}
          </p>
          <Link
            to="/use-cases/barbershops/qr-strategy"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold
                     hover:bg-blue-700 transition transform hover:scale-105 shadow"
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
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
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
                to="/templates/barbershop/fresh-fade-feedback/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-blue-600 text-white font-semibold
                           hover:bg-blue-700 transition"
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
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
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
                to="/templates/barbershop/weekend-buzz-booster/v1.0"
                className="mt-auto inline-flex items-center justify-center px-6 py-3
                           rounded-lg bg-indigo-600 text-white font-semibold
                           hover:bg-indigo-700 transition"
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
                to="/templates/barbershop/loyalty-chair-spin/v1.0"
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
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">{t.cta_title}</h2>
            <p className="text-xl text-blue-100 mb-8 whitespace-pre-line">
              {t.cta_text}
            </p>
            <Link
              to="https://reviewtorevenue.io/auth"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg
                      hover:bg-blue-50 transform transition-all hover:scale-105 shadow-lg group"
            >
              {t.cta_button}
              <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-sm text-blue-100 mt-4">{t.cta_note}</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}