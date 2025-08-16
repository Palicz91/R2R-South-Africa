import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';

export const retailQRStrategyTranslations = {
  en: {
    hero_title: "Review to Revenue QR Codes: Your Retail Shop's Secret Weapon",
    hero_subtitle: "How smart retailers turn passive QR codes into active customer engagement machines",

    intro_p1: "Look, I'm going to be brutally honest with you. Most retail shops are doing QR codes completely wrong. They slap a basic code on their window and wonder why nobody scans it.",
    intro_p2: "But here's the thing – when you use Review to Revenue's QR system strategically? You're not just collecting reviews. You're building a customer engagement machine that works 24/7, even when you're sleeping.",
    intro_p3: "Let me show you exactly how the smart retailers are doing it.",

    section_shelf_title: "The Shelf‑Edge Code Strategy (This One's Pure Gold)",
    shelf_what: "What it is: QR codes right on your price tags that lead to product videos + review requests at checkout.",
    shelf_why: "Why it works: You're hitting customers at the exact moment they're considering a purchase. They scan, watch a quick demo, get educated about the product, and you've just primed them to leave a review after they buy.",
    shelf_think: "Think about it – how many times have you stood in a store wondering if something actually works the way it's supposed to? That's your moment.",
    shelf_tip: "Pro tip: Don't overthink the video production. A 30‑second phone video of the product in action beats a fancy production that took you three weeks to make.",

    section_packaging_title: "Smart Packaging (The Compliance Play That Actually Pays)",
    pack_rule: "The EU's Digital Product Passport rules are coming whether you like it or not. Smart retailers are getting ahead of this with dynamic QR codes that serve dual purposes.",
    pack_setup: "The setup: Dynamic codes on packaging that show product transparency info AND capture reviews post‑purchase.",
    pack_payoff: "The payoff: You're future‑proofing your compliance while building trust. Customers trust businesses more when the review process is simple and transparent.",
    pack_miss: "Here's what most people miss – compliance isn't just about avoiding fines. It's about positioning your brand as trustworthy before your competitors catch on.",

    section_gamified_title: "Gamified Receipts (Turn \"Thank You\" Into Hype)",
    game_desc: "This is where Review to Revenue really shines. Instead of a boring receipt, your customers get a mini‑experience.",
    game_process: "The process: Purchase complete → QR scan → spin‑the‑wheel for discount/freebie → review request → social share prompt.",
    game_why: "Why this is genius: You're converting that post‑purchase dopamine hit into three valuable actions: review, future purchase incentive, and social proof.",
    game_stat: "I've seen shops increase their review rate by 340% with this approach. The secret? People love games, even tiny ones.",

    section_window_title: "Window CTAs That Work While You Sleep",
    window_strategy: "\"Scan to see how this fits IRL\" with AR try‑on demos or styling videos.",
    window_desc: "Your window display is prime real estate, but most retailers waste it on static displays. A strategically placed QR code with compelling copy can capture curious foot traffic 24/7.",
    window_psych: "The psychology: People are naturally curious. Give them a reason to engage when they're already looking at your stuff.",
    window_tip: "Real talk: Your window QR should be big enough to scan from 3 feet away. I've seen too many shops put tiny codes that require customers to press their face against the glass like they're looking for Waldo.",

    section_analytics_title: "The Analytics Loop (Where the Magic Really Happens)",
    analytics_miss: "Here's where most retailers drop the ball. They set up QR codes and... that's it. No analysis. No optimization. No doubling down on what works.",
    analytics_system: "The system: Track scan rates by product line monthly. Identify your top 20% performers. Double up QR placement on those winners.",
    analytics_why: "Why this matters: Not all products are created equal. Some naturally generate more engagement. Instead of spreading your efforts thin, concentrate on what's already working.",
    analytics_mind: "The mindset shift: You're not just running a retail shop anymore. You're running experiments. Every QR code is a test. Every scan is data.",

    section_mistakes_title: "What Most Shops Get Wrong (Don't Be These People)",
    mistakes_list: [
      "Static thinking: \"I put up a QR code, job done.\" Wrong. QR codes need updating and optimization just like any other marketing channel.",
      "Weak calls-to-action: \"Scan for reviews\" is boring. \"Scan to see if this actually works\" is intriguing.",
      "Placement problems: Putting codes where they can't be easily scanned, or worse, where they compete with other visual elements.",
      "No follow-through: Getting the scan but not having a compelling experience afterward."
    ],

    section_bottom_title: "The Bottom Line",
    bottom_p1: "QR codes aren't just about convenience – they're about creating moments of engagement that compound over time. Every scan is an opportunity to deepen the relationship with your customer.",
    bottom_p2: "The retailers who get this right aren't just collecting reviews. They're building communities of engaged customers who become their best marketers.",
    bottom_p3: "Your next step? Pick one strategy from this list. Implement it properly. Measure the results. Then expand from there.",
    bottom_p4: "Don't try to do everything at once. Master one approach, then add the next.",
    bottom_emphasis: "Because here's what I know for sure – the shops that embrace this systematic approach to customer engagement are going to eat the lunch of those that don't.",
    bottom_italic: "The question isn't whether QR codes work for retail. The question is whether you're going to use them strategically or just slap them on your wall and hope for the best.",
    bottom_final: "What's it going to be?",

    cta_title: "Ready to turn scans into sales?",
    cta_subtitle: "Start your free 14‑day trial and see the magic of data‑driven retail engagement.",
    cta_button: "Get Started Free"
  },
  hu: {
    hero_title: "Review to Revenue QR‑kódok: A Te üzleted titkos fegyvere",
    hero_subtitle: "Hogyan alakítják az okos kiskereskedők a passzív QR kódokat aktív ügyfél‑elkötelező gépezetté",

    intro_p1: "Őszintén szólva: a legtöbb bolt teljesen rosszul használja a QR kódokat. Rátapasztanak egyet az ablakra, aztán csodálkoznak, miért nem olvassa senki le.",
    intro_p2: "De ha stratégiailag használod a Review to Revenue rendszerét? Nem csak értékeléseket gyűjtesz. Egy 0–24 (még alvás közben is pörögő) ügyfél‑elkötelező gépezetet építesz.",
    intro_p3: "Mutatom, hogyan csinálják az okosok pontosan.",

    section_shelf_title: "Polcszél kód stratégia (Ez a tiszta arany)",
    shelf_what: "Mi ez: QR kódok az árkártyákon, amik termék‑videókhoz és értékelés‑kéréshez vezetnek a pénztárnál.",
    shelf_why: "Miért működik: pont akkor éred el a vevőt, amikor a vásárláson gondolkodik. Beolvas, megnéz egy rövid demót, többet megért a termékről – és már kész is a visszajelzésre.",
    shelf_think: "Gondold végig – hányszor álltál már boltban azzal a kérdéssel, hogy vajon tényleg működik‑e, ahogyan ígérik? Ez a Te pillanatod.",
    shelf_tip: "Praktikus tipp: ne túlbonyolítsd a videót. Egy 30 másodperces mobilvideó a termékről többet ér, mint háromhetes profi munka.",

    section_packaging_title: "Okos csomagolás (A szabályozás, ami tényleg kifizetődik)",
    pack_rule: "Az EU Digital Product Passport szabályai jönnek, akár tetszik, akár nem. A tudatos kereskedők dinamikus QR kódokkal lépnek rá a kettős célra.",
    pack_setup: "Beállítás: dinamikus kódok a csomagoláson, amik egyszerre mutatják az átláthatóságot és gyűjtik az értékeléseket a vásárlás után.",
    pack_payoff: "Előny: jövőbiztossá teszed a compliance‑t, és építed a bizalmat. Az egyszerű, átlátható értékelési folyamat iránt a vásárlók sokkal lojálisabbak.",
    pack_miss: "A legtöbben azt hiszik, hogy a compliance csak bírság elkerülése. Valójában ez egy lehetőség a márka iránti bizalom kialakítására – még mielőtt a konkurencia észrevenné.",

    section_gamified_title: "Gamifikált nyugták (A „Köszönöm\"‑ből Hype lesz)",
    game_desc: "Itt brillírozik a Review to Revenue. Ahelyett, hogy egy unalmas blokkot adnál, mini‑élményt kínálsz.",
    game_process: "Folyamat: Vásárlás → QR olvasás → szerencsekerekes nyeremény/kedvezmény → értékelés kérése → közösségi megosztás ösztönzése.",
    game_why: "Miért zseniális: a vásárlás utáni dopaminlöketet három értékes akcióra fordítod: értékelés, jövőbeni kedvezmény és social proof.",
    game_stat: "Volt bolt, ahol 340 %-kal nőtt az értékelési arány ennek hatására. A titok? Az emberek szeretik a játékot – még a mini‑játékon is.",

    section_window_title: "Ablak CTA‑k, amik PRÓBÁLNAK helyetted is dolgozni",
    window_strategy: 'Szkenneld le, és nézd meg, hogyan mutat a valóságban – például egy próbavideón vagy öltöztetős demón keresztül.',
    window_desc: "Az üzletablak kiemelt hirdetési felület – mégis sokan csak statikus dekorációként használják. Egy jól megjelenő QR kód szöveggel már 0‑24‑be generál forgalmat.",
    window_psych: "Pszichológia: az emberek kíváncsiak. Adj nekik okot a kattintásra, amikor már nézik a cuccodat.",
    window_tip: "Őszinte beszéd: az ablak QR‑nak elég nagynak kell lennie, hogy 1 m‑ről is leolvasható legyen. Láttam már olyan kódokat is, ahol az arcukat kellett az üveghez nyomniuk, mint Waldo‑vadászoknak.",

    section_analytics_title: "Analitika hurok (Ott történik az igazi varázslat)",
    analytics_miss: "Itt sok bolt elvérzik: felteszi a QR‑t… és kész. Nincs elemzés, nincs optimalizálás, nincs duplikálás, ahol működik.",
    analytics_system: "Rendszer: havonta termékcsaládonként gyűjtsd a szkennelési arányokat. Azonosítsd a top 20 %-ot, és dupla kóddal támogasd.",
    analytics_why: "Miért fontos ez: nem minden termék egyforma. Egyesek jobban generálnak elköteleződést. Ahelyett, hogy mindenhol dolgoznál, fókuszálj a nyertesekre.",
    analytics_mind: "Gondolkodásmód‑váltás: nem csak boltvezető vagy többé. Kísérleteket futtatsz. Minden QR kód teszt, minden scan adat.",

    section_mistakes_title: "Miket rontanak el a legtöbben (Ne ess bele te!)",
    mistakes_list: [
      "Statikus gondolkodás: Felraktam a kódot, kész is. Téves. A QR‑nek frissítésre és optimalizálásra van szüksége, mint bármely más marketingcsatornának.",
"Gyenge CTA‑k: Szkenneld az értékelést unalmas. Szkenneld, hogy lásd, tényleg működik‑e izgalmas.",
"Elhelyezkedési gondok: olyan helyre tett kódot, ahol nehéz leolvasni, vagy versenyez más vizuális elemmel.",
"Nincs követés: megvan a scan, de nincs utóélmény vagy ösztönző a továbblépésre."
    ],

    section_bottom_title: "Összegzés",
    bottom_p1: "A QR‑kódok nem csak kényelmet jelentenek – élmények teremtéséről szólnak, amik idővel összeadódnak. Minden scan lehetőség a vendégeddel való kapcsolat mélyítésére.",
    bottom_p2: "Azok az üzletek, akik jól használják ezt, nem csak értékeléseket gyűjtenek – közösséget építenek elkötelezett vásárlókból, akik a legjobb marketingesekké válnak.",
    bottom_p3: "A következő lépés? Válassz egy stratégiát a listából. Kivitelezd rendesen. Mérd az eredményt. Aztán bővítsd tovább.",
    bottom_p4: "Ne próbálj mindent egyszerre. Tanulj meg egy megközelítést tökéletesen, majd adj hozzá újat.",
    bottom_emphasis: "Mert ezt tudom biztosan – azok az üzletek fognak nyerni, amelyek tudatosan, rendszerszinten közelítenek az ügyfél‑elköteleződéshez.",
    bottom_italic: "A kérdés nem az, működik‑e a QR‑kód a kiskereskedelemben. A kérdés az, hogy stratégiailag használod‑e, vagy csak odaragasztod, és reméled, hogy valaki olvasni fogja.",
    bottom_final: "Mi lesz a következő lépés?",

    cta_title: "Készen állsz átalakítani a scannelést eladásokká?",
    cta_subtitle: "Kezdd el az ingyenes 14 napos próbaidőszakot, és tapasztald meg az adatvezérelt retail‑elkötelezés varázsát.",
    cta_button: "Indítsd el ingyen"
  }
};

export default function RetailQRStrategyPage() {
  const [language, setLanguage] = useState("en");

  // Geolocation-based language detection
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        const response = await fetch("https://ipinfo.io/json?token=53cd9f60a714e6");
        const data = await response.json();
        const country = data.country;
        setLanguage(country === "HU" ? "hu" : "en");
      } catch (error) {
        console.error("Geolocation detection failed:", error);
        setLanguage("en"); // Default to English
      }
    };

    detectLanguage();
  }, []);

  const t = retailQRStrategyTranslations[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.hero_title}
            </h1>
            <p className="text-xl text-gray-600">
              {t.hero_subtitle}
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
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-600">
          <p>{t.intro_p1}</p>
          <p>{t.intro_p2}</p>
          <p>{t.intro_p3}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_shelf_title}</h3>
          <p>{t.shelf_what}</p>
          <p>{t.shelf_why}</p>
          <p>{t.shelf_think}</p>
          <p className="italic">{t.shelf_tip}</p>

          <img 
            src="https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=2990&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Customer shopping in retail store" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_packaging_title}</h3>
          <p>{t.pack_rule}</p>
          <p>{t.pack_setup}</p>
          <p>{t.pack_payoff}</p>
          <p>{t.pack_miss}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_gamified_title}</h3>
          <p>{t.game_desc}</p>
          <p>{t.game_process}</p>
          <p>{t.game_why}</p>
          <p>{t.game_stat}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_window_title}</h3>
          <p>{t.window_strategy}</p>
          <p>{t.window_desc}</p>
          <p>{t.window_psych}</p>
          <p className="italic">{t.window_tip}</p>

          <img 
            src="https://images.unsplash.com/photo-1637666639858-e914177a9146?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="QR code interaction in retail setting" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_analytics_title}</h3>
          <p>{t.analytics_miss}</p>
          <p>{t.analytics_system}</p>
          <p>{t.analytics_why}</p>
          <p>{t.analytics_mind}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_mistakes_title}</h3>
          <ul className="list-disc list-inside space-y-2">
            {t.mistakes_list.map((mistake, index) => (
              <li key={index}>{mistake}</li>
            ))}
          </ul>

          <img 
            src="https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Retail store environment with QR codes" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_bottom_title}</h3>
          <p>{t.bottom_p1}</p>
          <p>{t.bottom_p2}</p>
          <p>{t.bottom_p3}</p>
          <p>{t.bottom_p4}</p>
          <p className="font-semibold">{t.bottom_emphasis}</p>
          <p className="italic">{t.bottom_italic}</p>
          <p className="text-xl font-semibold text-emerald-600 mt-8">{t.bottom_final}</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-lg text-green-100 mb-8">{t.cta_subtitle}</p>
          <Link
            to="/pricing"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-green-600 font-semibold text-lg
                       hover:bg-green-50 transform transition-all hover:scale-105 shadow-lg"
          >
            {t.cta_button}
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
