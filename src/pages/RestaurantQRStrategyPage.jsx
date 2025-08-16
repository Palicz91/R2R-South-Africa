import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import PublicNavBar from "../components/PublicNavBar";

export const restaurantQRStrategyTranslations = {
  en: {
    hero_title: "2025 QR-Code Strategy: Restaurant Edition",
    hero_subtitle: "Your North Star Guide to More Scans, Reviews, and Repeat Visits",

    intro_1: "Let's be honest – most QR codes get ignored harder than a gym membership in February.",
    intro_2: "But here's the thing: when done right, QR codes are pure gold for restaurants.",
    intro_3: "They're your secret weapon for turning satisfied diners into raving reviewers, and mediocre moments into memorable experiences.",
    intro_4: "The difference? Strategy beats spray-and-pray every single time.",

    psychology_title: "The Psychology Behind the Scan",
    psychology_list_intro: "Before we dive into tactics, let's get into your customer's head for a second. People don't scan QR codes because they're bored. They scan because:",
    psychology_list: [
      "They're getting something valuable right now",
      "The ask feels personal, not corporate",
      "The timing makes perfect sense",
      "The effort feels minimal"
    ],
    psychology_miss: "Miss any of these four elements? Your QR code becomes expensive wall art.",

    placement_title: "The Power of Prime Placement",
    placement_1_title: "1. Table-Toppers: The Waiting Game Winner",
    placement_1_why: "Why it works: Diners are literally sitting there with nothing to do. No phones to distract them (well, mostly). No rush to leave yet.",
    placement_1_setup: "The setup: Small, elegant table tent with your QR code front and center. Not buried under specials and wine lists – featured.",
    placement_1_tip: "Pro tip: Test different table positions. Corner placement often wins because it's visible from multiple seats without blocking conversation.",

    placement_2_title: "2. Bill Folder: The Golden Moment",
    placement_2_problem: "Here's where most restaurants blow it. The check arrives, and what do you include? A generic \"rate us\" card that screams corporate desperation.",
    placement_2_fix: "Instead, try this: A personal note from the chef or owner with the QR code integrated naturally. Something like:",
    placement_2_example: "\"Hope you loved tonight's meal as much as we loved preparing it. Your thoughts help us stay your neighborhood favorite.\" – Chef Maria",
    placement_2_reason: "Why it converts: The meal is fresh in their mind, they're in a good mood (hopefully), and the personal touch makes it feel like a conversation, not a transaction.",

    placement_3_title: "3. Exit Door Decal: The Last Impression",
    placement_3_intro: "Most people miss this entirely, but it's brilliant when done right.",
    placement_3_psych: "The psychology: They're leaving satisfied (hopefully), walking slowly, often waiting for others or their ride. Perfect scanning moment.",
    placement_3_execution: "The execution: Clean, professional decal at eye level. Include a benefit that matters: \"Help us improve\" is weak. \"Help other foodies find us\" hits different.",

    dynamic_menu_title: "Dynamic Menus: Your Secret Weapon",
    dynamic_menu_intro: "This is where restaurants are absolutely crushing it in 2025.",
    dynamic_menu_old: "The old way: Print menus, hope for the best, reprint when prices change, repeat forever.",
    dynamic_menu_new: "The new way: QR code leads to digital menu that seamlessly transitions to feedback collection within 7 days of their visit.",
    dynamic_menu_benefits: [
      "Cost savings – No more reprinting every time you run out of the sea bass",
      "Fresh memory – They're reviewing while they can still taste the experience",
      "Seamless flow – From menu to feedback feels natural, not forced"
    ],
    dynamic_menu_tools: "Tools that make this easy: Menu Tiger and similar platforms let you update in real-time and integrate feedback collection without feeling pushy.",

    gratification_title: "The Instant Gratification Hook",
    gratification_tip: "Want to see scan rates jump overnight? Give people something today.",
    gratification_compare: "\"Scan for your receipt\" = boring. \"Scan for 10% off dessert today\" = genius.",
    gratification_list: [
      "Creates immediate value",
      "Boosts tonight's ticket size",
      "Triggers the scan you actually want",
      "Makes the review ask feel like part of the experience, not an afterthought"
    ],
    gratification_staff: "Implementation: Make sure your staff knows about the offer and can explain it naturally. Nothing kills momentum like a confused server.",

    script_title: "The Server Script That Actually Works",
    script_bad: "Most review requests sound like this: \"Can you please leave us a review online?\" Crickets.",
    script_good: "Try this instead: \"Loved that risotto? A quick scan helps us stay your favorite spot.\"",
    script_list: [
      "References something specific they enjoyed",
      "Positions the review as helping them (keeping their favorite restaurant thriving)",
      "Uses casual language that doesn't feel corporate",
      "Implies they're already part of your community"
    ],
    script_training: "Training tip: Role-play this with your team. The delivery matters as much as the words.",

    tracking_title: "Track, Test, Iterate (Or You're Flying Blind)",
    tracking_list: [
      "Scan rates by location (table-top vs. bill folder vs. exit)",
      "Time of day patterns",
      "Day of week variations",
      "Conversion from scan to review"
    ],
    tracking_heatmap: "Weekly heat-mapping: Which tables are scanning most? Move codes from dead zones to hot spots. Let data drive your decisions, not gut feelings.",
    tracking_mindset: "The iteration mindset: What worked last month might be stale this month. Keep testing new approaches, new copy, new placements.",

    mistakes_title: "Common Mistakes That Kill Conversions",
    mistakes_list: [
      "Mistake #1: QR codes that lead to your homepage.",
      "Mistake #2: Making the ask too early.",
      "Mistake #3: Generic, corporate messaging.",
      "Mistake #4: No follow-through."
    ],

    bottom_title: "The Bottom Line",
    bottom_summary_1: "QR codes aren't magic. But they're incredibly powerful when you understand the psychology behind the scan and create systems that feel natural, valuable, and personal.",
    bottom_summary_2: "Your goal isn't just more reviews – it's turning satisfied customers into genuine advocates who can't wait to share their experience.",
    bottom_summary_3: "Start with one strategy. Master it. Then add the next.",
    bottom_cta: "Ready to turn your satisfied diners into raving reviewers? The strategies above are your roadmap. The execution? That's up to you.",

    cta_title: "Ready to turn reviews into revenue?",
    cta_sub: "Start your free 14-day trial. No credit card needed.",
    cta_button: "Get Started Free"
  },
  hu: {
    hero_title: "2025-ös QR-kód stratégia: Éttermi kiadás",
    hero_subtitle: "Északi csillag útmutatód több szkenneléshez, értékeléshez és visszatérő vendéghez",

    intro_1: "Légy őszinte – a legtöbb QR-kódot jobban ignorálják, mint az edzőtermi bérletet februárban.",
    intro_2: "Pedig ha jól használod, a QR-kód aranyat ér az éttermednek.",
    intro_3: "Titkos fegyvered lehet: elégedett vendégeket alakít át lelkes értékelőkké, középszerű pillanatokat emlékezetessé.",
    intro_4: "A különbség? A stratégia mindig veri a lövöldözős megközelítést.",

    psychology_title: "A szkennelés pszichológiája",
    psychology_list_intro: "Mielőtt a taktikákba merülnénk, nézzük meg, mit gondol a vendéged. Nem unalomból szkennelnek az emberek. Az okok:",
    psychology_list: [
      "Azonnal valami értékeset kapnak",
      "A kérés személyes, nem céges",
      "Jó az időzítés",
      "Kevés az erőfeszítés"
    ],
    psychology_miss: "Ha ezek közül bármelyik hiányzik, a QR-kódod drága falidísz lesz.",

    placement_title: "A jó elhelyezés ereje",
    placement_1_title: "1. Asztali kártyák: Az várakozás nyertese",
    placement_1_why: "Miért működik: A vendégek csak ülnek és várnak. Nincs mivel elvonni a figyelmüket (többnyire). Még nincs rohanás.",
    placement_1_setup: "Beállítás: Kis, elegáns asztali kártya, rajta a QR-kód középen. Ne temessük el ajánlatok és borlapok alá – legyen fókuszban.",
    placement_1_tip: "Profi tipp: Teszteld a különböző asztali pozíciókat. A sarok gyakran nyer, mert több helyről látható, de nem zavarja a beszélgetést.",

    placement_2_title: "2. Számlatartó: Az arany pillanat",
    placement_2_problem: "Itt rontja el a legtöbb étterem. Jön a számla, és mit tesznek mellé? Egy általános értékelj minket kártyát, ami céges kétségbeeséstől ordít.",
    placement_2_fix: "Helyette próbáld ezt: Személyes üzenet a séftől vagy tulajdonostól, természetesen beépített QR-kóddal. Valami ilyesmi:",
placement_2_example: "„Reméljük, annyira élvezted a mai vacsorát, mint mi elkészíteni. A véleményed segít abban, hogy a környék kedvence maradjunk.” – Maria séf",
    placement_2_reason: "Miért működik: Friss az élmény, jó hangulatban vannak (remélhetőleg), és a személyes hang beszélgetéssé teszi, nem tranzakcióvá.",

    placement_3_title: "3. Kijárati matrica: Az utolsó benyomás",
    placement_3_intro: "A legtöbben ezt teljesen kihagyják, pedig zseniális, ha jól csinálod.",
    placement_3_psych: "Pszichológia: Elégedetten távoznak (remélhetőleg), lassan sétálnak, gyakran várnak másokra vagy a fuvarukra. Tökéletes szkennelési pillanat.",
    placement_3_execution: "Kivitelezés: Tiszta, profi matrica szemmagasságban. Tartalmazzon valódi előnyt: Segíts javítani - gyenge. Segíts más ínyenceknek megtalálni minket - sokkal jobb.",

    dynamic_menu_title: "Dinamikus menük: A titkos fegyver",
    dynamic_menu_intro: "Ebben az éttermek 2025-ben abszolút királyok.",
    dynamic_menu_old: "Régi módszer: Nyomtatott menük, remény a legjobbért, újranyomtatás áremeléskor, ismételd végtelenségig.",
    dynamic_menu_new: "Új módszer: QR-kód digitális menühöz vezet, ami zökkenőmentesen átvált visszajelzés-gyűjtésre 7 napon belül.",
    dynamic_menu_benefits: [
      "Költségmegtakarítás – Nincs többé újranyomtatás, amikor elfogy a tengeri sügér",
      "Friss emlék – Akkor értékelnek, amikor még érzik az ízeket",
      "Zökkenőmentes folyamat – A menütől a visszajelzésig természetes, nem erőltetett"
    ],
    dynamic_menu_tools: "Eszközök, amik megkönnyítik: A Menu Tiger és hasonló platformok lehetővé teszik a valós idejű frissítést és a visszajelzés-gyűjtés integrálását tolakodás nélkül.",

    gratification_title: "Az azonnali jutalom horog",
    gratification_tip: "Látni akarod, hogy egyik napról a másikra megugorjanak a szkennelési arányok? Adj ma valamit az embereknek.",
    gratification_compare: "Szkennelje be a számláját = unalmas. Szkennelje be 10% desszert kedvezményért ma = zseniális.",
    gratification_list: [
      "Azonnali értéket teremt",
      "Növeli a mai bevételt",
      "Kiváltja a szkennelést, amire tényleg szükséged van",
      "Az értékeléskérést az élmény részévé teszi, nem utólagos gondolattá"
    ],
    gratification_staff: "Megvalósítás: Győződj meg róla, hogy a személyzet tudja az ajánlatot és természetesen tudja elmagyarázni. Semmi sem öli meg jobban a lendületet, mint egy tanácstalan pincér.",

    script_title: "A pincér szöveg, ami tényleg működik",
    script_bad: "A legtöbb értékeléskérés így hangzik: Tudna értékelést írni rólunk az interneten? Csend.",
    script_good: "Helyette próbáld ezt: Tetszett a rizottó? Egy gyors szkennelés segít, hogy a kedvenc helyetek maradjunk.",
    script_list: [
      "Konkrét dologra hivatkozik, amit élveztek",
      "Az értékelést úgy pozicionálja, mintha nekik segítene (kedvenc éttermük fennmaradása)",
      "Laza nyelvezet, ami nem cégesnek hat",
      "Azt sugallja, már a közösség részei"
    ],
    script_training: "Képzési tipp: Gyakorold el a csapatoddal szerepjátékban. A kivitelezés ugyanannyira számít, mint a szavak.",

    tracking_title: "Mérj, tesztelj, ismételj (különben vakon repülsz)",
    tracking_list: [
      "Szkennelési arányok helyszín szerint (asztali vs. számlatartó vs. kijárat)",
      "Napi időszakos minták",
      "Heti napos eltérések",
      "Szkennelésből értékelés konverzió"
    ],
    tracking_heatmap: "Heti hőtérkép: Melyik asztaloknál szkennelnek a legtöbbet? Mozgasd át a kódokat a halott zónákból a forró pontokra. Az adatok vezéreljék a döntéseidet, ne az ösztönök.",
    tracking_mindset: "Az iterációs gondolkodásmód: Ami múlt hónapban működött, az ebben a hónapban már elavult lehet. Folyamatosan tesztelj új megközelítéseket, új szövegeket, új elhelyezéseket.",

    mistakes_title: "Gyakori hibák, amik megölik a konverziót",
    mistakes_list: [
      "1. hiba: QR-kódok, amik a főoldalra vezetnek.",
      "2. hiba: Túl korai kérés.",
      "3. hiba: Általános, céges üzenetküldés.",
      "4. hiba: Nincs utánkövetés."
    ],

    bottom_title: "A lényeg",
    bottom_summary_1: "A QR-kódok nem varázslat. De hihetetlen erősek, ha megérted a szkennelés pszichológiáját és olyan rendszereket hozol létre, amik természetesnek, értékesnek és személyesnek tűnnek.",
    bottom_summary_2: "A célod nem csak több értékelés – hanem elégedett vásárlók átalakítása őszinte támogatókká, akik alig várják, hogy megoszthassák az élményüket.",
    bottom_summary_3: "Kezdj egy stratégiával. Tanuld meg tökéletesen. Aztán add hozzá a következőt.",
    bottom_cta: "Készen állsz arra, hogy elégedett vendégeidből lelkes értékelők legyenek? A fenti stratégiák az úttérképed. A kivitelezés? Az rajtad múlik.",

    cta_title: "Készen állsz bevételt csinálni az értékelésekből?",
    cta_sub: "Indítsd el az ingyenes 14 napos próbaverziót. Nem kell bankkártya.",
    cta_button: "Kezdjük el ingyen"
  }
};

export default function RestaurantQRStrategyPage() {
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

  const t = restaurantQRStrategyTranslations[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.hero_title}</h1>
            <p className="text-xl text-gray-600">
              {t.hero_subtitle}
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
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-600">
          <p>{t.intro_1} {t.intro_2} {t.intro_3} {t.intro_4}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.psychology_title}</h3>
          <p>{t.psychology_list_intro}</p>
          <ul className="list-disc list-inside space-y-2">
            {t.psychology_list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>{t.psychology_miss}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.placement_title}</h3>
          
          <img 
            src="https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Restaurant table with QR code placement" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          
          <h4 className="text-xl font-semibold mt-4">{t.placement_1_title}</h4>
          <p>{t.placement_1_why}</p>
          <p>{t.placement_1_setup}</p>
          <p>{t.placement_1_tip}</p>

          <h4 className="text-xl font-semibold mt-4">{t.placement_2_title}</h4>
          <p>{t.placement_2_problem}</p>
          <p>{t.placement_2_fix}</p>
          <p className="italic">{t.placement_2_example}</p>
          <p>{t.placement_2_reason}</p>

          <h4 className="text-xl font-semibold mt-4">{t.placement_3_title}</h4>
          <p>{t.placement_3_intro}</p>
          <p>{t.placement_3_psych}</p>
          <p>{t.placement_3_execution}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.dynamic_menu_title}</h3>
          
          <img 
            src="https://images.unsplash.com/photo-1538333581680-29dd4752ddf2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Digital menu with QR code" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          
          <p>{t.dynamic_menu_intro}</p>
          <p>{t.dynamic_menu_old}</p>
          <p>{t.dynamic_menu_new}</p>
          <ul className="list-disc list-inside space-y-2">
            {t.dynamic_menu_benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
          <p>{t.dynamic_menu_tools}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.gratification_title}</h3>
          <p>{t.gratification_tip}</p>
          <p>{t.gratification_compare}</p>
          <ul className="list-disc list-inside space-y-2">
            {t.gratification_list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>{t.gratification_staff}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.script_title}</h3>
          <p>{t.script_bad}</p>
          <p>{t.script_good}</p>
          <ul className="list-disc list-inside space-y-2">
            {t.script_list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>{t.script_training}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.tracking_title}</h3>
          <ul className="list-disc list-inside space-y-2">
            {t.tracking_list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>{t.tracking_heatmap}</p>
          <p>{t.tracking_mindset}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.mistakes_title}</h3>
          <ul className="list-disc list-inside space-y-2">
            {t.mistakes_list.map((mistake, index) => (
              <li key={index}><strong>{mistake}</strong></li>
            ))}
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.bottom_title}</h3>
          <p>{t.bottom_summary_1}</p>
          <p>{t.bottom_summary_2}</p>
          <p>{t.bottom_summary_3}</p>
          <p className="text-xl font-semibold text-blue-600 mt-8">{t.bottom_cta}</p>
          
          <img 
            src="https://images.unsplash.com/photo-1555992336-fb0d29498b13?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Customer scanning QR code in restaurant" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-lg text-blue-100 mb-8">{t.cta_sub}</p>
          <Link
            to="/pricing"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg
                       hover:bg-blue-50 transform transition-all hover:scale-105 shadow-lg"
          >
            {t.cta_button}
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
