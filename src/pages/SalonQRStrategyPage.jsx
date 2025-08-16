import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';

export const salonQRStrategyTranslations = {
  en: {
    hero_title: "Review to Revenue QR Codes: How Salons & Spas Build Loyalty That Lasts",
    hero_subtitle: "Tap into your clients' peak emotional moments to create repeat bookings and loyal fans.",

    // Section headings
    section_mirror_title: "The Mirror Magnet Strategy (Strike While the Iron's Hot)",
    section_aroma_title: "Aromatherapy Wi‑Fi Cards (The Sensory Memory Hack)",
    section_post_title: "Post‑Treatment Push (Timing Is Everything)",
    section_bundle_title: "Bundle Preview QR Codes (Turn Browsers Into Buyers)",
    section_referral_title: "Referral Booster System (Turn Clients Into Advocates)",
    section_mistakes_title: "What Most Salons & Spas Get Completely Wrong",
    section_journey_title: "The Emotional Journey Map",
    section_bottom_title: "The Bottom Line",

    // Intro paragraphs
    p1: "Here's something most salon and spa owners don't realize: your clients are in their most vulnerable and receptive state when they're in your chair or on your table. They're relaxed, they trust you, and they're feeling good about themselves.",
    p2: "That's prime real estate for engagement. Yet most businesses completely waste this golden opportunity.",
    p3: "The smart salon owners? They're using Review to Revenue's QR system to turn these peak emotional moments into booking machines that run themselves.",
    p4: "Let me break down exactly how they're doing it.",

    // Mirror Strategy
    mirror_setup: "The setup: Eye‑level QR codes positioned perfectly where clients can't miss them – right in the mirror they're admiring themselves in.",
    mirror_action: "The action: One‑tap rebooking before they even leave the chair.",
    mirror_why: "Why this is brilliant: You're catching them at their absolute peak satisfaction moment. They just got their hair done, they look amazing, and they're feeling confident. Of course they want to book their next appointment right now.",
    mirror_psych: "But here's the psychology behind it – people make emotional decisions and then justify them logically later. When someone feels great about how they look, they're not thinking about their budget or their busy schedule. They're thinking about maintaining that feeling.",
    mirror_real: "Real talk: If you're not capturing bookings while they're still in the chair, you're basically gambling that they'll remember to call you next week. (Spoiler alert: they won't.)",

    // Aromatherapy
    aroma_intro: "This one's genius because it hits multiple senses simultaneously.",
    aroma_concept: "The concept: Lightly scented cards with QR codes that lead to your service menu and review prompts.",
    aroma_science: "The science: Scent is the strongest trigger for memory. When they smell that lavender or eucalyptus later, they'll think of your spa. It's not just marketing – it's neuroscience.",
    aroma_exec: "The execution: Hand these out with their receipt or leave them at the reception desk. The scent creates a positive association, and the QR code gives them an immediate action to take while that association is fresh.",
    aroma_missing: "Most spas miss this completely. They focus on the visual experience but ignore the fact that smell creates stronger, longer‑lasting memories than any Instagram post ever will.",

    // Post‑treatment push
    post_strategy: "The strategy: SMS with QR code sent exactly one hour after their treatment.",
    post_psych: "The psychology: That post‑treatment glow doesn't last forever. You've got maybe 2‑3 hours max before the endorphins wear off and they're back to thinking about work stress and grocery lists.",
    post_timing: "One hour is the sweet spot. They're not immediately back to reality, but they're not still lying on your table either. They're in that perfect window where they're still feeling the benefits but can actually take action.",
    post_tone: "The message tone: Keep it personal. \"Hey Sarah, hope you're still feeling as relaxed as you looked when you left! 😊 Mind sharing how your massage was?\"",
    post_pro: "Pro tip: Don't make it feel automated. Even if it is automated (and it should be), make it feel like it's coming from their actual therapist.",

    // Bundle preview
    bundle_placement: "The placement: QR codes on your retail product displays linking to tutorial reels.",
    bundle_psych: "The psychology: Your clients already trust your expertise – that's why they're paying you to touch their face and hair. When you show them how to maintain their results at home, you're extending that trust relationship.",
    bundle_exec: "The execution: Short tutorial videos (30‑60 seconds max) showing the product in action. Not sales pitches – actual helpful content.",
    bundle_wrong: "Here's what most salons get wrong: they try to sell products like they're running a retail store. But you're not Target. You're a trusted advisor. Act like it.",
    bundle_upsell: "The upsell magic: When someone sees how to properly use that $40 serum you recommended, they're way more likely to buy it. Because now it's not just a product – it's the key to maintaining the results you just gave them.",

    // Referral booster
    referral_mechanism: "The mechanism: Scan → generate friend's discount link → both parties get 10% off their next service.",
    referral_why: "Why this works better than traditional referrals: There's no awkward \"ask your friends\" conversation. No business cards to remember to hand out. Just a simple scan that creates immediate value for everyone involved.",
    referral_genius: "The genius part: Your existing client gets a discount for something they were probably going to do anyway (tell their friends about their great experience). Their friend gets a discount for trying somewhere new. You get a new client with a built-in recommendation.",
    referral_multiplier: "The multiplier effect: Happy clients who feel like they're getting exclusive perks become your best marketers. They're not just recommending you – they're actively sharing discount codes.",

    // Mistakes
    mistakes_list: [
      "Mistake #1: Waiting until the client leaves to ask for reviews or rebookings. By then, the moment is gone.",
      "Mistake #2: Generic, boring calls‑to‑action. \"Scan for reviews\" is forgettable. \"Scan to keep this glow going\" creates urgency.",
      "Mistake #3: Not leveraging the emotional high. Your clients feel amazing after their service. Use that energy.",
      "Mistake #4: Treating QR codes like an afterthought instead of integrating them into the entire client experience."
    ],

    // Journey map
    journey_intro: "Think about your client's emotional journey:",
    journey_list: [
      "Pre‑arrival: Anticipation, maybe some anxiety",
      "During service: Relaxation, trust, vulnerability",
      "Immediately after: Confidence, satisfaction, gratitude",
      "One hour later: Still glowing, want to maintain the feeling",
      "Next week: Memory starting to fade, routine taking over"
    ],
    journey_tip: "Your QR strategy should hit every single peak in that emotional journey. Not just the end.",

    // Bottom line
    bottom_p1: "Salons and spas have a massive advantage that most businesses don't: you create genuine emotional transformation for your clients. They don't just buy a service – they buy a feeling.",
    bottom_p2: "The businesses that understand this are using QR codes to capture and extend those feelings into long‑term relationships. They're not just booking appointments – they're building communities of people who feel better about themselves because of what you do.",
    bottom_p3: "Your next move? Look at your client's emotional journey from the moment they walk in until they're home telling their partner about their experience. Then place QR touchpoints at every emotional peak.",
    bottom_italic: "Because here's the truth: your competition is probably still handing out business cards and hoping people remember to call back.",
    bottom_final1: "You can do better than that.",
    bottom_final2: "Ready to turn every client into a raving fan who books themselves?",

    // CTA section
    cta_title: "Ready to turn peak moments into lifelong clients?",
    cta_subtitle: "Start your free 14‑day trial today and see how it feels to never worry about rebookings again.",
    cta_button: "Get Started Free"
  },
  hu: {
    hero_title: "Review to Revenue QR-kódok: Hogyan építenek hűséget a szalonok és spák",
    hero_subtitle: "Érd el az ügyfeleid csúcspontjait érzelmileg, hogy visszatérő vendégek és hűséges rajongók legyenek.",

    section_mirror_title: "Tükör‑mágnes stratégia (Üss, amíg meleg!)",
    section_aroma_title: "Aromaterápiás Wi‑Fi kártyák (Az érzéki memória hack)",
    section_post_title: "Kezelés utáni ösztönzés (Időzítés számít)",
    section_bundle_title: "Termék‑preview QR kódok (Böngészőkből vásárlók)",
    section_referral_title: "Ajánlói booster rendszer (Vevők támogatói lesznek)",
    section_mistakes_title: "Mit rontanak el a legtöbb szalon és spa?",
    section_journey_title: "Az érzelmi utazás térképe",
    section_bottom_title: "Összegzés",

    p1: "A legtöbb szalon- és spa‑tulajdonos nem veszi észre: az ügyfeleik a legsebezhetőbbek és legfogékonyabbak, amikor a székükben vagy az asztalukon vannak. Nyugodtak, bíznak benned, és jól érzik magukat.",
    p2: "Ez az elköteleződés aranybányája. Mégis a legtöbb vállalkozás teljesen elszalasztja ezt a lehetőséget.",
    p3: "Az okos szalon‑tulajdonosok? A Review to Revenue QR rendszerét használják, hogy ezekből az érzelmi csúcspontokból önműködő foglalógépeket varázsoljanak.",
    p4: "Nézzük meg pontosan, hogyan csinálják.",

    mirror_setup: "Beállítás: szemmagasságban elhelyezett QR kódok, amiket nem tudnak elkerülni – pont abban a tükörben, amiben épp nézik magukat.",
    mirror_action: "Művelet: egy koppintásos újrafoglalás még azelőtt, hogy elhagynák a széket.",
    mirror_why: "Miért zseniális: pont a maximális elégedettség pillanatában éred el őket. Frissen kész a frizura, remekül néznek ki, és magabiztosak. Persze akarják a következő időpontot is most rögtön.",
    mirror_psych: "A pszichológia: az emberek érzelmi döntéseket hoznak, aztán utólag indokolják meg logikusan. Ha jól érzik magukat a kinézetüktől, nem a költségvetésen vagy a naptárjukon kattognak – inkább azt akarják megőrizni.",
    mirror_real: "Őszinte beszéd: ha nem azonnal kéred a foglalást, amikor még ülnek a székben, akkor bírsz abban, hogy majd jövő héten felhívnak. (Spoiler: nem fogják.)",

    aroma_intro: "Ez zseniális, mert egyszerre több érzékszervet is megcéloz.",
    aroma_concept: "Koncepció: könnyed illatos kártyák QR kódokkal, amik a szolgáltatás menübe és értékelési felületre viszik a vendéget.",
    aroma_science: "A tudomány: az illat a legerősebb emlékeztető. Ha később a levendula vagy eukaliptusz illatát érzik, rád gondolnak. Nem csak marketing – ez neurológia.",
    aroma_exec: "Megvalósítás: add oda pénztárral együtt vagy hagyd recepción. Az illat pozitív asszociációt kelt, a QR kód pedig azonnali cselekvésre ösztönöz.",
    aroma_missing: "A legtöbb spa ezt teljesen kihagyja. Csak a vizuális élményre fókuszálnak, pedig az illat hosszabb ideig tartó, mélyebb emléket is képes létrehozni, mint bármely Instagram‑poszt.",

    post_strategy: "Stratégia: SMS QR kóddal, pontosan egy órával a kezelés után.",
    post_psych: "A pszichológia: a kezelés utáni ragyogás nem tart örökké. Legfeljebb 2‑3 óra az, amíg az endorfin kitart, utána jön a munka/soron követő stressz.",
    post_timing: "Az egy óra a tökéletes időzítés. Még nem tértek vissza teljesen a valóságba, de már nem is fekszenek az asztalon. Még érzik a hatást, de már cselekedni is tudnak.",
    post_tone: "Hangnem: tartsd személyesnek. \"Szia Sarah, remélem még mindig olyan nyugodtnak érzed magad, mint amikor távoztál! 😊 Megosztanád, milyen volt a masszázs?\"",
    post_pro: "Pro tipp: ne hagyd, hogy automatikusnak tűnjön. Még ha automatizált is (és legyen az!), sugallja, hogy a saját terapeutája küldi.",

    bundle_placement: "Elhelyezés: QR kódok a termék‑kiállításokon, linkelve a tutorial videókhoz.",
    bundle_psych: "Pszichológia: az ügyfél már megbízik benned – ezért kér épp tőled szolgáltatást. Ha megmutatod, hogyan tartsák itthoni eredményt, akkor a bizalom tovább tart.",
    bundle_exec: "Kivitelezés: rövid (30‑60 mp) tutorial videók a termék használatáról. Nem eladás – valódi segítség.",
    bundle_wrong: "A legtöbb szalon ezt elrontja: úgy próbálnak eladni termékeket, akárcsak egy diszkontáruház. De te nem vagy a Target. Te egy megbízható tanácsadó vagy. Viselkedj is úgy.",
    bundle_upsell: "Az upsell varázs: ha valaki látja, hogyan használja helyesen azt a 40 dolláros szérumot, amit ajánlottál, sokkal nagyobb eséllyel megveszi. Mert mostantól nem csak termék – hanem a kulcs az eredmények megőrzéséhez.",

    referral_mechanism: "Mechanizmus: beolvasás → baráti kedvezményhivatkozás generálása → mindkét fél 10% kedvezményt kap a következő szolgáltatásból.",
    referral_why: "Miért jobb ez a hagyományos ajánlásoknál: nincs kínos \"kérd meg a barátod\" beszélgetés. Nincs névjegykártya‑osztogatás. Csak egy egyszerű beolvasás, ami azonnali értéket teremt mindkét félnek.",
    referral_genius: "Zseniális rész: a meglévő vendég kap kedvezményt valamire, amit amúgy is megtenne (elmondja barátainak a fantasztikus élményt). A barát pedig kedvezményt kap az első látogatáskor. Te pedig új vendéget nyersz be built‑in ajánlással.",
    referral_multiplier: "Szorzóhatás: az elégedett vendégek, akik exkluzív előnyöket kapnak, lesznek a legjobb marketingesek. Nem csak ajánlanak – aktívan megosztják a kedvezményeket.",

    mistakes_list: [
      "Hiba #1: Megvárni, míg a vendég elhagyja a székét, hogy értékelést vagy új foglalást kérjek. Akkorra már elmúlt a pillanat.",
      "Hiba #2: Általános, unalmas call‑to‑actionök. \"Szkennelj értékelésért\" felejthető. \"Szkenneld a ragyogás megőrzéséért\" sürgetőbb.",
      "Hiba #3: Nem használják ki az érzelmi magaslatot. A vendég fantasztikusan érzi magát a szolgáltatás után. Használd ki.",
      "Hiba #4: A QR kódot utólagos gondolatként kezelik, ahelyett, hogy végig az élmény részévé tennék."
    ],

    journey_intro: "Gondolj az ügyfeled érzelmi útjára:",
    journey_list: [
      "Érkezés előtt: várakozás, esetleg szorongás",
      "Kezelés közben: relaxáció, bizalom, sebezhetőség",
      "Azonnal utána: magabiztosság, elégedettség, hála",
      "Egy óra múlva: még mindig ragyognak, meg akarják őrizni az érzést",
      "Következő héten: az emlék halványul, a rutin veszi át az uralmat"
    ],
    journey_tip: "A QR stratégiádnak minden érzelmi csúcspontot el kell érnie – nem csak a végét.",

    bottom_p1: "A szalonok és spák hatalmas előnnyel rendelkeznek, amit a legtöbb vállalkozás nem ért: valódi érzelmi átalakulást hozol az ügyfeleidnek. Nem csak szolgáltatást vásárolnak – érzést vesznek.",
    bottom_p2: "Azok a vállalkozások, akik értik ezt, QR kódokat használnak az élmények megragadására és hosszú távú kapcsolatok építésére. Nem csak időpontokat foglalnak – közösségeket építenek, akik jobban érzik magukat attól, amit csinálsz.",
    bottom_p3: "A következő lépés? Vizsgáld át az ügyfeled érzelmi útját attól a pillanattól, amikor belép, amíg otthon meséli a partnerének az élményt. Aztán helyezd el a QR pontokat minden érzelmi csúcspontnál.",
    bottom_italic: "Mert ez az igazság: a versenytársaid valószínűleg még mindig névjegykártyákat osztogatnak, és abban bíznak, hogy a vendégek majd visszaemlékeznek.",
    bottom_final1: "Te ennél jobbat is tudsz.",
    bottom_final2: "Készen állsz arra, hogy minden vendéget rajongóvá változtass, aki saját magát foglalja vissza?",

    cta_title: "Készen állsz arra, hogy az érzelmi csúcspontokat örök ügyfelekké alakítsd?",
    cta_subtitle: "Kezdd el az ingyenes 14 napos próbaidőszakot, és tapasztald meg, milyen érzés többé nem aggódni a visszafoglalások miatt.",
    cta_button: "Indítsd el ingyen"
  }
};

export default function SalonQRStrategyPage() {
  const [language, setLanguage] = useState('en');

  // Geolocation-based language detection
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        const response = await fetch('https://ipinfo.io/json?token=53cd9f60a714e6');
        const data = await response.json();
        const country = data.country;
        setLanguage(country === 'HU' ? 'hu' : 'en');
      } catch (error) {
        console.error('Geolocation detection failed:', error);
        setLanguage('en'); // Default to English
      }
    };

    detectLanguage();
  }, []);

  const t = salonQRStrategyTranslations[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 to-rose-50 py-20 overflow-hidden">
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
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-pink-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-rose-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-600">
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
          <p>{t.p4}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_mirror_title}</h3>
          <p>{t.mirror_setup}</p>
          <p>{t.mirror_action}</p>
          <p>{t.mirror_why}</p>
          <p>{t.mirror_psych}</p>
          <p className="italic">{t.mirror_real}</p>

          <img 
            src="https://images.unsplash.com/photo-1633681926035-ec1ac984418a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Salon treatment experience" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_aroma_title}</h3>
          <p>{t.aroma_intro}</p>
          <p>{t.aroma_concept}</p>
          <p>{t.aroma_science}</p>
          <p>{t.aroma_exec}</p>
          <p>{t.aroma_missing}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_post_title}</h3>
          <p>{t.post_strategy}</p>
          <p>{t.post_psych}</p>
          <p>{t.post_timing}</p>
          <p>{t.post_tone}</p>
          <p className="italic">{t.post_pro}</p>

          <img 
            src="https://plus.unsplash.com/premium_photo-1723867490491-10519f8ed969?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Calm and relaxing spa environment" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_bundle_title}</h3>
          <p>{t.bundle_placement}</p>
          <p>{t.bundle_psych}</p>
          <p>{t.bundle_exec}</p>
          <p>{t.bundle_wrong}</p>
          <p>{t.bundle_upsell}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_referral_title}</h3>
          <p>{t.referral_mechanism}</p>
          <p>{t.referral_why}</p>
          <p>{t.referral_genius}</p>
          <p>{t.referral_multiplier}</p>

          <img 
            src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Client pampering moment in salon" 
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_mistakes_title}</h3>
          <ul className="list-disc list-inside space-y-2">
            {t.mistakes_list.map((mistake, index) => (
              <li key={index}>{mistake}</li>
            ))}
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_journey_title}</h3>
          <p>{t.journey_intro}</p>
          <ul className="list-disc list-inside space-y-2">
            {t.journey_list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>{t.journey_tip}</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">{t.section_bottom_title}</h3>
          <p>{t.bottom_p1}</p>
          <p>{t.bottom_p2}</p>
          <p>{t.bottom_p3}</p>
          <p className="italic">{t.bottom_italic}</p>
          <p className="text-xl font-semibold text-pink-600 mt-8">{t.bottom_final1}</p>
          <p className="text-xl font-semibold text-pink-600">{t.bottom_final2}</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-600 to-rose-700 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-lg text-pink-100 mb-8">{t.cta_subtitle}</p>
          <Link
            to="/pricing"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-pink-600 font-semibold text-lg
                       hover:bg-pink-50 transform transition-all hover:scale-105 shadow-lg"
          >
            {t.cta_button}
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}