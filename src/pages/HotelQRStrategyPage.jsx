import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import PublicNavBar from "../components/PublicNavBar";

export const hotelQRStrategyTranslations = {
  en: {
    hero_title: "Review to Revenue QR Codes: How Hotels Turn Every Guest Into a Repeat Customer",
    hero_subtitle: "Unlock the power of in‑room and lobby touchpoints to boost reviews and loyalty",

    intro_1: "Let's get one thing straight: most hotels are stuck in the dark ages when it comes to guest engagement.",
    intro_2: "Meanwhile, the smart hoteliers are using Review to Revenue's QR system to solve multiple guest problems with one scan – and turning those solutions into revenue machines.",
    intro_3: "Here's exactly how they're doing it (and why your guests will actually thank you for it).",

    section_inroom_title: "The In‑Room Hub Strategy (One Scan, Three Problems Solved)",
    inroom_setup: "A strategically placed QR code on the bedside table that handles Wi‑Fi login, concierge services, and review requests all in one flow.",
    inroom_why: "Guests immediately reach for their phone to connect to Wi‑Fi – you intercept that moment with real value first, then ask for feedback.",
    inroom_psych: "You give value first (Wi‑Fi, local tips, room service), then \"Mind sharing how your stay is going?\" is just a gentle ask.",
    inroom_adoption: "Hotels go from around 5% to over 40% review‑rate with this approach.",
    inroom_tip: "Pro tip: make the code big enough to scan without squinting.",

    section_checkout_title: "Check‑Out Fast Lane (Turn Friction Into Loyalty)",
    checkout_concept: "QR codes on lobby screens that handle express check‑out AND review capture simultaneously.",
    checkout_why: "You remove the biggest pain point – wait time – and request feedback as guests mentally process their stay.",
    checkout_psych: "Check‑out is when guests ask themselves \"Was it worth it? Would I stay again?\" – golden moment for review.",
    checkout_flow: "No line, no small talk, just scan‑confirm‑go. Happy guests leave better reviews.",
    checkout_tip: "Real talk: no express check‑out via QR in 2025 signals you don't value business travelers.",

    section_explorer_title: "Local Explorer Map (The Value‑Add That Keeps Giving)",
    explorer_placement: "Elevator‑poster QR codes linking to curated local recommendations.",
    explorer_why: "Guests have 30‑60s of captive time in elevators – give them something useful.",
    explorer_content: "Tailor recommendations (business vs. family vs. couples), not generic tourist traps.",
    explorer_data: "Track engagement per recommendation to inform partnerships and amenities.",
    explorer_upsell: "\"Loved that restaurant? Concierge can make reservations\" – turning recommendations into paid service.",

    section_roomservice_title: "Room Service Upsell System (Personalization That Pays)",
    roomservice_setup: "Dynamic QR codes on room‑service menus personalized per room based on past orders.",
    roomservice_personal: "Room 501 sees wine suggestions; room 302 sees family meals – prediction drives orders.",
    roomservice_revpar: "Personalized upsell increases revenue per available room.",
    roomservice_data: "Track premium‑item orders → VIP prospects for loyalty marketing.",
    roomservice_flow: "No phone call, no hold music – just scan, order, relax.",

    section_email_title: "Post‑Stay Email Strategy (Capture Tomorrow's Revenue Today)",
    email_timing: "24‑h follow‑up email with QR for early‑bird rebooking discount.",
    email_psych: "Guests hit while memories are fresh and before competitor messages land.",
    email_urgency: "\"Book next stay within 7 days and save 15%\" – creates scarce urgency.",
    email_competition: "Most hotels wait weeks; by then guests are in others' promos.",
    email_ltv: "One repeat booking > ten new acquisitions – capturing repeats fast is essential.",

    section_mistakes_title: "What Most Hotels Get Catastrophically Wrong",
    mistakes_list: [
      "Treating QR codes as an afterthought rather than integrating into the full guest journey",
      "Asking for reviews without providing value first – feedback must be earned",
      "One‑size‑fits‑all messaging instead of personalizing per guest type",
      "Focusing on tech over guest experience – content + timing matter",
      "No tracking or optimization – every scan is data that should guide actions"
    ],

    section_journey_title: "The Guest Journey Optimization Framework",
    journey_list: [
      "Pre‑arrival: confirmation emails, travel tips, local weather",
      "Arrival: check‑in process, room orientation, immediate needs",
      "In‑room: comfort, entertainment, convenience, service access",
      "During stay: exploration, dining, activities, problem-solving",
      "Check‑out: speed, efficiency, final impressions",
      "Post‑stay: memory reinforcement, future planning, referrals"
    ],

    section_roadmap_title: "Your Implementation Roadmap",
    roadmap_list: [
      "Week 1: in‑room hub QR → Wi‑Fi + concierge; measure usage",
      "Week 2: lobby express check‑out QR; track satisfaction",
      "Week 3: elevator explorer maps; monitor engagement",
      "Week 4: room‑service personalization; build profiles",
      "Week 5: post‑stay early‑bird campaigns; measure rebookings"
    ],

    section_bottom_title: "The Bottom Line",
    bottom_summary_1: "Hotels using QR codes for real value → loyalty → revenue will dominate their markets.",
    bottom_summary_2: "Guests already use phones – make it work for you, don't let them wander to competitors.",
    bottom_cta: "The choice is yours: keep doing the same, or build a guest engagement system that turns each stay into repeat business.",

    cta_title: "Ready to capture lifetime guests?",
    cta_subtitle: "Start your free 14‑day trial and see how QR engagement transforms your hotel revenue.",
    cta_button: "Get Started Free"
  },
  hu: {
    hero_title: "Review to Revenue QR‑kódok: hogyan alakítják a szállodák minden vendégből visszatérőt",
    hero_subtitle: "Használd ki a szobán belüli és közösségi terek QR‑pontjait az értékelések és a lojalitás növeléséhez",

    intro_1: "Tegyük tisztába: a legtöbb szálloda még a sötét középkorban ragadt, ha vendég‑elkötelezésről van szó.",
    intro_2: "Aztán ott vannak a menők, akik egyetlen scanneléssel oldanak meg Wi‑Fi‑t, recepciós szolgáltatásokat és visszajelzés‑kérést.",
    intro_3: "Pontosan így csinálják – és a vendégek még hálásak is lesznek érte.",

    section_inroom_title: "Szobai Hub Stratégia (egy kóddal három probléma megoldva)",
    inroom_setup: "QR‑kód az éjjeliszekrényen: Wi‑Fi belépés, concierge, visszajelzés egy folyamban.",
    inroom_why: "A vendég azonnal a Wi‑Fi‑hez nyúl – ott szállsz be te értékkel, mielőtt kérdezel.",
    inroom_psych: "Értékadás (Wi‑Fi, helyi tippek, room service), aztán finoman: „Megosztanád, hogyan alakult a tartózkodásod?",
    inroom_adoption: "Több szálloda 5%-ról 40%+ review‑arányra ugrott ezzel.",
    inroom_tip: "Profi tipp: legyen elég nagy a kód – ne kelljen pislogni a vendégének.",

    section_checkout_title: "Gyorsított kijelentkezés (súrlódásból lojalitás)",
    checkout_concept: "QR a lobby képernyőin: express check‑out + review egy lépésben.",
    checkout_why: "A kijelentkezéskor a vendég értékeli az élményt – ott a legjobb idő a visszajelzésre kérni.",
    checkout_psych: "Pillanat: Megérte? Visszatérnék? – ez a te aranyablakod.",
    checkout_flow: "Nincs sor, nincs kis beszélgetés – csak scan, confirm, go. Boldog vendég jobb értékelést ír.",
    checkout_tip: "Igazából, ha 2025‑ben nem kínálsz QR express check‑out‑ot, azt üzened, hogy nem fontosak az üzleti vendégek.",

    section_explorer_title: "Local Explorer térkép (érték, ami újraérték)",
    explorer_placement: "Liftben elhelyezett QR‑poszter a helyi élményekhez.",
    explorer_why: "Liftben 30–60s szabadidő – adj valami hasznos néznivalót.",
    explorer_content: "Nem csak turistacsapdák – üzleti, családi, romantikus vendégeknek külön ajánlások.",
    explorer_data: "Kövesd, mit néznek meg leginkább – ebből tudsz partnerségeket és szolgáltatásokat építeni.",
    explorer_upsell: "Tetszett az étterem? Concierge foglal helyet – ingyen ajánlásból fizetős szolgáltatás.",

    section_roomservice_title: "Szobaszerviz upsell rendszer (személyre‑szabás, ami bevételt hoz)",
    roomservice_setup: "Dinamikus QR‑kódok szobaszerviz‑menün, személyre szabva korábbi rendelések alapján.",
    roomservice_personal: "501‑es szobában borajánló, 302‑ben családi étel – a vendég előre jelzett preferenciájára.",
    roomservice_revpar: "Upsell növeli a bevételt elérhető szobánként.",
    roomservice_data: "Kövesd, ki mit rendel gyakran – ezek VIP‑vendégek a hűségprogramhoz.",
    roomservice_flow: "Telefonhívás nélkül – csak scan, rendelés, relax.",

    section_email_title: "Utó‑tartózkodási email stratégia (holnapi bevétel ma)",
    email_timing: "24h‑on belül follow‑up email QR‑rel early‑bird újrafoglaláshoz.",
    email_psych: "Amikor élénk az emlék, még versenytársak promó hangja előtt.",
    email_urgency: "Foglalj újra 7 napon belül, és spórolj 15% – mesterséges sürgősség.",
    email_competition: "A legtöbben hetekig várnak – addig már más promóinál járnak a vendégek.",
    email_ltv: "Egy visszatérés többet ér, mint tíz új vendég – vidd be gyorsan a visszatérőket.",

    section_mistakes_title: "Hol rontják el a szállodák (katasztrofálisan)",
    mistakes_list: [
      "A QR‑kódokat utólagos apróságként kezelik a teljes vendég‑út helyett",
      "Visszajelés kérése érték nélkül – azt ki kell érdemelni",
      "Egyféle, általános üzenetek személyre‑szabás helyett",
      "A technológiára fókuszálnak, nem a vendég élményére – tartalom + időzítés a kulcs",
      "Nem mérnek, nem optimalizálnak – minden scan adat, az döntést kell vezesse"
    ],

    section_journey_title: "Vendégút optimalizációs keretrendszer",
    journey_list: [
      "Elő‑érkezés: visszaigazolás, utazási tippek, helyi időjárás",
      "Érkezés: bejelentkezés, szoba orientáció, azonnali igények",
      "Szobában: kényelem, kiszolgálás, szórakozás",
      "Tartózkodás alatt: felfedezés, étkezés, problémamegoldás",
      "Kijelentkezés: gyorsaság, hatékonyság, végső benyomás",
      "Utó‑tartózkodás: emlék erősítés, újrafoglalás, ajánlások"
    ],

    section_roadmap_title: "Megvalósítási ütemterv",
    roadmap_list: [
      "1. hét: szobai hub QR – Wi‑Fi + concierge, mérd a használatot",
      "2. hét: lobby express QR – mérd a vendégelégedettséget",
      "3. hét: lift explorer térképek – monitor engagement",
      "4. hét: szobaszerviz személyre‑szabás – vendégprofil építés",
      "5. hét: utó‑tartózkodási early‑bird kampány – mérd az újrafoglalást"
    ],

    section_bottom_title: "A lényeg",
    bottom_summary_1: "A QR‑kód nem csak kényelem – értéket teremtenek, ami lojalitássá növekszik.",
    bottom_summary_2: "A vendégek telefonja már a ti szolgáltatásotok – ne hagyd, hogy versenytársaknál landoljanak.",
    bottom_cta: "A döntés a tiéd: a régi úton maradsz, vagy építesz egy vendég‑elkötelező rendszert, ami minden tartózkodást a hosszú távú lojalitás kezdetévé tesz.",

    cta_title: "Készen állsz élethosszig tartó vendégeket szerezni?",
    cta_subtitle: "Indítsd el az ingyenes 14 napos próbaverziót, és lásd, hogyan formálja a QR‑elkötelezés a szállodai bevételedet.",
    cta_button: "Indítsd el ingyen"
  }
};

export default function HotelQRStrategyPage() {
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

  const t = hotelQRStrategyTranslations[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-50 to-orange-50 py-20 overflow-hidden">
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
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-yellow-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-orange-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-600">
          <p>{t.intro_1}</p>
          <p>{t.intro_2}</p>
          <p>{t.intro_3}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_inroom_title}</h3>
          <p>{t.inroom_setup}</p>
          <p>{t.inroom_why}</p>
          <p>{t.inroom_psych}</p>
          <p>{t.inroom_adoption}</p>
          <p className="italic">{t.inroom_tip}</p>

          <img 
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Hotel lobby with modern design" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_checkout_title}</h3>
          <p>{t.checkout_concept}</p>
          <p>{t.checkout_why}</p>
          <p>{t.checkout_psych}</p>
          <p>{t.checkout_flow}</p>
          <p className="italic">{t.checkout_tip}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_explorer_title}</h3>
          <p>{t.explorer_placement}</p>
          <p>{t.explorer_why}</p>
          <p>{t.explorer_content}</p>
          <p>{t.explorer_data}</p>
          <p>{t.explorer_upsell}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_roomservice_title}</h3>
          <p>{t.roomservice_setup}</p>
          <p>{t.roomservice_personal}</p>
          <p>{t.roomservice_revpar}</p>
          <p>{t.roomservice_data}</p>
          <p>{t.roomservice_flow}</p>

          <img 
            src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Luxury hotel room interior" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_email_title}</h3>
          <p>{t.email_timing}</p>
          <p>{t.email_psych}</p>
          <p>{t.email_urgency}</p>
          <p>{t.email_competition}</p>
          <p>{t.email_ltv}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_mistakes_title}</h3>
          <ul className="list-disc list-inside space-y-2">
            {t.mistakes_list.map((mistake, index) => (
              <li key={index}>{mistake}</li>
            ))}
          </ul>

          <img 
            src="https://images.unsplash.com/photo-1614957004131-9e8f2a13123c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Guest relaxing at luxury hotel pool" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_journey_title}</h3>
          <ul className="list-disc list-inside space-y-2">
            {t.journey_list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_roadmap_title}</h3>
          <ul className="list-disc list-inside space-y-2">
            {t.roadmap_list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_bottom_title}</h3>
          <p>{t.bottom_summary_1}</p>
          <p>{t.bottom_summary_2}</p>
          <p className="text-xl font-semibold text-yellow-600 mt-8">{t.bottom_cta}</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-600 to-orange-700 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-lg text-yellow-100 mb-8">{t.cta_subtitle}</p>
          <Link
            to="/pricing"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-yellow-600 font-semibold text-lg
                       hover:bg-yellow-50 transform transition-all hover:scale-105 shadow-lg"
          >
            {t.cta_button}
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
