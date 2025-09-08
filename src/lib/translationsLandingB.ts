// src/lib/translationsLandingB.ts
import { getTranslation as getBase } from "./translations";

type Dict = Record<string, any>;

// tiny deep merge
function merge(base: Dict, patch: Dict): Dict {
  const out: Dict = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(patch)) {
    const v = patch[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = merge(base?.[k] ?? {}, v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** ✅ Fallback-ek: minden olyan blokkot alapértékkel adunk, amire a komponensek .title / .map stb. hívásokat tesznek */
const fallbacks: Dict = {
  // szimpla stringek
  landingHeroHeadline: "",
  landingHeroSubline: "",
  landingHeroCta: "",
  separatorWheel: "",
  postHeroSeparatorWheel: "",
  statsTitle: "",
  statsDescription: "",
  testimonialsTitle: "",
  pricingTeaserTitle: "",
  satisfiedGuestsToMarketing: "",
  revenueBoostHeadline: "",
  finalCtaTitle: "",
  finalCtaDescription: "",
  freeTrialBanner: "",
  monthly: "",
  yearly: "",
  save20Percent: "",

  // összetett blokkok
  postHeroMistake: {
    title: "", intro: "", channelsTitle: "", channels: [] as string[],
    costQuestion: "", pivot: "", researchTitle: "", researchBullets: [] as string[],
    conclusion: "", question: "", cta: ""
  },
  newGuestsBlock: {
    title: "", intro: "", strategy: "", warning: "",
    question: "", solution: "", cta: ""
  },
  emailListBlock: {
    title: "", leadQuestion: "", leadAnswer: "", reason1: "",
    reason2Title: "", reason2Bullets: [] as string[],
    ownership: "", challenge: "", r2rHelp: "", speed: "",
    finalQuestion: "", cta: ""
  },
  notForYouBlock: {
    title: "", bullets: [] as string[], conclusion1: "", conclusion2: "", conclusion3: "", cta: ""
  },
  reliefBlock: { 
    title: "", p1: "", p2: "", p3: "", p4: "", p5: "", cta: "" 
  },
  coreBenefits: {
    // ÚJ kulcsok a hero alatti 3 kártyához
    moreRepeatGuestsTitle: "",
    moreRepeatGuestsDesc: "",
    moreReviewsTitle: "",
    moreReviewsDesc: "",
    moreEmailSubsTitle: "",
    moreEmailSubsDesc: "",

    // Meglévő kulcsok
    skyHighStarRating: "", 
    captureAuthenticFeedback: "",
    privateNegativeFeedback: "", 
    addressConcerns: "",
    moreRepeatVisits: "", 
    turnOneTimeVisitors: ""
  },
  pricingPlans: {
    solo: { name: "", period: "", buttonText: "", features: [] as string[] },
    growth: { name: "", period: "", buttonText: "", features: [] as string[] },
    unlimited: { name: "", period: "", buttonText: "", features: [] as string[] }
  },
  ltd: {
    badge: "", title: "", subtitle: "", priceNote: "",
    features: { wheels: "", reviews: "", emails: "", tutorials: "", stats: "", updates: "" },
    addExtraLabel: "", each: "", totalLabel: "", cta: "", redirecting: "",
    bannerTitle: "", endsIn: "", ctaShort: "", ended: ""
  },
  testimonialsRepeat: {
    review1: "", review2: "", review3: "",
    name1: "", name2: "", name3: ""
  },
  trustedBySectionHeadline: "",
  trustedByCards: [] as string[],
  trustedBySectionClosing: "",
  trustedByCta: "",
};

// Only put A/B overrides here. Anything not listed falls back to base.
const overrides = {
  hu: {
    // Review timing section - NEW
    reviewTimingParagraph: "Fizetés után a vendéged mosolyog, a telefonja a kezében. Készen áll, hogy elmondja a világnak, mennyire jól érezte magát. Ha elmulasztod ezt a pillanatot, később már sokkal nehezebb őket motiválni erre. Ahelyett, hogy napokkal később kérnél értékelést (ha egyáltalán eszedbe jut a napi mókuskerékben), adj nekik egy 60 másodperces játékot, amivel szívesen játszanak. Ők kapnak egy jutalmat, te pedig egy friss Google értékelést: mindenki nyer.",
    reviewTimingHeadline: "Az elégedett vendégeket alakítsd át a legerősebb marketing csatornáddá – értékelésekkel, amelyek megsokszorozzák a bevételeidet!",

    // Landing page
landingHeroHeadline: "Pörgesd fel a forgalmad<br/>– akár 50%-kal! 🚀",
landingHeroSubline: `Adj a vendégeid kezébe egy QR-kódos <strong>digitális szerencsekereket</strong> és zsebeld be ezt a három hasznot:<br/><br/>
🎯 <strong>több visszatérő vendég</strong>,<br/>
⭐ <strong>több Google Review</strong>,<br/>
📩 <strong>egyre bővülő email lista</strong>.<br/><br/>
Ezek a folyamatos teltház építőkövei, amit most egyetlen előfizetéssel megszerezhetsz.`,
landingHeroCta: "Pont erre van szükségem",

    postHeroSeparatorWheel: "Egy szerencsekerék - tripla haszon: növeld velünk a vendég számod, a bevételed és a hírneved.",

    // Relief block
    reliefBlock: {
      title: "Lehet könnyebb a vendéglátás",
      p1: "Ismerős a gyomortájékon szorító érzés egy gyengébb hónap után? A <strong>folyamatos bizonytalanság, az üresen kongó asztalok és a hullámzó bevétel</strong> szinte minden vendéglátóst kísért. Néha tudod az okát – szezonalitás, események hiánya –, máskor csak értetlenül nézed, miért üres a hely, miközben a konkurencia tele van vendégekkel és csillogó értékelésekkel.",
      p2: "A <strong>te helyed jobb</strong>, csak még kevesebben mondták el. Az árakat nem tudod tovább emelni – már így is annyiba kerül egy pizza nálad, mint Rómában, a költségeid pedig felzabálják a profitot. A matek egyszerű: <strong>több vendég kell</strong>.",
      p3: "Itt jön képbe a <strong>Review-to-Revenue digitális szerencsekereke</strong>. Egyetlen QR-kód és a vendégeid játékosan segítenek neked több értékelést, visszatérő vevőt és email címet szerezni.",
      p4: "A következő hónap elején úgy fogsz a számaidra ránézni, hogy nem rándul görcsbe a gyomrod, hanem <strong>megnyugszol: végre van egy rendszered</strong>, ami stabilabbá és tervezhetőbbé teszi a forgalmad.",
      p5: "Képzeld el, hogy a te helyed lesz a környék <strong>legendás találkozóhelye</strong> – a város Central Perk kávézója vagy MacLaren's Pub-ja. Ahová a törzsvendégek családtagként térnek vissza, az új vendégek pedig bizalommal ülnek be. Ahol nem az üres asztalok aggasztanak, hanem az, hogy a sorban állók mikor férnek be.<br/><br/>Mindehhez <strong>nem kell varázslat, csak egy egyszerű, de okos eszköz</strong>, ami a vendéglátóhelyedet stabil növekedési pályára állítja – és neked végre lehetőséget ad, hogy kifújd magad.",
      cta: "AZONNAL KEZDJÜNK",
    },

calculatorIntro: {
  text:
    'Képzeld el, hogy van egy <strong>speciális bankszámlád</strong>. Ennek az egyenlege azt az összeget mutatja, <strong>amit megkereshettél volna adott hónapban</strong> – de nem tetted, mert mindent úgy hagytál, ahogy most van. <br/><br/>Hogy mekkora ez az összeg? <strong>Könnyen kiszámolhatod.</strong><br/><br/>Ezzel a kalkulátorral megtudhatod, <strong>mekkora pénztől esel el havonta</strong>, ha nem építesz ki egy <strong>vevő visszaszerző-, Google Review- és email gyűjtő rendszert</strong>.'
},
revenueCouldHaveMade: "Bevétel, amitől elesel minden hónapban",

// összetett blokkok
postHeroMistake: {
  title: "Sok vállalkozó elköveti ezt a drága hibát",
  intro: "A legtöbb vendéglátós a <strong>marketingbüdzsé oroszlánrészét új vendégek becsalogatására költi</strong>. Biztos téged is győzködtek már arról, hogy ez így működik:",
  channels: {
    title: "Kutatások szerint:",
    bullets: [
      "profi TikTok videók gyártásával,",
      "influencer együttműködésekkel,",
      "Google és Facebook hirdetésekkel,",
      "vagy épp a teljes marketing kiszervezésével."
    ]
  },
  costQuestion: "Ezek persze hoznak néhány új vendéget — de a <strong>valódi kérdés: megéri a több százezres havi költséget?</strong>",
  pivot: "Miközben koncentrálhatnál egy sokkal jövedelmezőbb csoportra: a meglévő vendégeidre.",
  researchTitle: "Kutatások szerint:",
  researchBullets: [
    `egy új vásárló megszerzése 5–10-szer drágább, mint egy meglévőt visszahozni`,
    `a visszatérő vendégek átlagosan 67%-kal többet költenek`,
    `már 5%-kal több visszatérő vendég akár 25–95%-kal növeli a profitot`
  ],
  conclusion: "Vagyis: <strong>jobban jársz, ha nem az új vendégeket hajszolod, hanem a törzsközönséged erősíted.</strong>"
},

newGuestsBlock: {
  title: "De akkor mondjak le az új vendégekről?!",
  intro:
    "Szó sincs róla! Minden helynek kell utánpótlás – csak érdemes költséghatékonyan megszerezni őket. A <strong>legtöbb új vendég ugyanis Google Review-k alapján dönt</strong> két hely között, főleg ha először jár a környéken.",
  strategy:
    "Ha már erős a csillagátlagod, az nem szerencse, hanem tudatos stratégia. A Review-to-Revenue ebben <strong>is</strong> segít: automatizálja a folyamatot, és sokszorosára növeli az eredményeid.",
  warning:
    "Ha 4.4 vagy az alatt állsz, a matek egyszerű: egy 4.8-as hely mindig megnyeri a versenyt. Ez <strong>napi 3–5 elvesztett vendéget jelenthet – vagyis akár 1 millió forint bevételkiesést havonta</strong>.",
  question: "Te ezt megengedheted magadnak?",
  cta: "MUTASD A MEGOLDÁST"
},

    crisisHeadline: "A vendégek ma már Google-vélemények alapján döntenek, főleg ha turisták vagy először járnak a környéken.",
    crisisDescription: `Ha te már jól állsz a csillagok gyűjtésében, akkor ez nem a véletlen műve, hanem tudatos stratégia. Ez esetben imádni fogod a Review-to-Revenue-t, mert <span class="font-semibold text-[#4FC3F7]">automatizálja folyamataid</span> és <span class="font-semibold text-[#4FC3F7]">sokszorosára növeli az eredményeid</span>.<br/>
    <span class="block mt-2">Hamarosan mutatok <span class="font-semibold">3 bevételtermelő képességet</span>, amit a rendszerünk tud neked nyújtani.</span><br/><br/>
    Ha 4.5 vagy az alatti az átlagod a GoogleMaps-en, akkor jobb, ha szembenézel a húsbavágó valósággal. Ha a konkurenciád két sarokkal odébb 4.8-an áll, akkor így néz ki a vendégek fejében a matek:<br/>
    <span class="font-semibold">A 4.8 csillag mindig legyőzi a 4.5-öt (vagy az alattiakat).</span><br/>
    <span class="block mt-2">Minden. Egyes. Alkalommal.</span><br/>
    Egy vendéglátóhely naponta nagyjából 3–5 vevőt veszít el csak az értékelési különbség miatt. <span class="italic text-gray-700">(De a szállásadók, szépségszalonok, jógastúdiók, stb. is hasonló arányban esnek el bevételtől.)</span><br/>
    <span class="block text-lg font-semibold text-red-600 mt-2">‼️ Ez nagyjából 1 millió Ft veszteség havonta. ‼️</span>`,
    crisisSolution: `Van egy <span class="font-semibold text-[#4FC3F7]">pofonegyszerű rendszerünk</span>, ami két pizza áráért visszaszerzi neked ezt a pénzt.`,    
    crisisCta: "Mutasd a megoldást!",

    // New text additions
    noCreditCardRequired: "Nem kell bankkártya. Nincs elköteleződés. Csak eredmények.",
    rightAfterPayment: "Fizetés után a vendéged elégedetten mosolyog, a kezében a telefonja. <strong>Készen áll, hogy elmondja a világnak, mennyire nagyszerűen érezte magát nálad.</strong>  Ha elmulasztod ezt a varázslatos pillanatot, később már sokkal nehezebb lesz őt rávenni erre.",
    awkwardReviewRequest: "💡 <strong>Használd ki a momentumot</strong>, amikor a vendéged épp átélte a szuper élményt. De hogyan vedd rá őt erre a szívességre?",
    awkwardReviewRequest_2: "Létezik egy <strong>pofonegyszerű megoldás, amivel az emberek imádnak véleményt írni.</strong>",    

    // micro-CTA in problem block
    startTrialCta: "Kezdd el a 14 napos próbaidőt →",

    // CTA texts
    startFreeTrial: "Kezdd el az ingyenes próbát",
    comparePlans: "Összes csomag összehasonlítása →",

    // Pricing Section
    pricing: {
      solo: "Alap",
      growth: "Növekedés",
      unlimited: "Korlátlan",
      perMonth: "/hó",
      soloBullet: "200 értékelésig",
      growthBullet: "1 000 értékelésig",
      unlimitedBullet: "Minden, korlátlanul",
      bestValue: "Legjobb ajánlat",
      redirectingToStripe: 'Átirányítás a Stripe fizetéshez...',
    },

    // Description text for steps
    scanDescription: "A vendég beszkenneli az egyedi QR-kódodat a tökéletes pillanatban—amikor a legnagyobb az elégedettség és valóban lelkesek attól, amit kaptak",
    leaveReviewDescription: "Megosztják valódi élményüket ott, ahol számít—a Google-on—vagy privát visszajelzést adnak, amely segít neked fejlődni anélkül, hogy rontaná az online hírnevedet",
    spinRedeemDescription: "A varázslatos pillanat: azonnal megpörgetik a digitális szerencsekereket, és nyernek egy valódi nyereményt, ami nemcsak mosolyt csal az arcukra—hanem visszahozza őket az ajtódon",

    // Steps titles
    steps: {
      scanTitle: "1 · Beolvasás",
      leaveReviewTitle: "2 · Értékelés",
      spinRedeemTitle: "3 · Pörgetés és beváltás"
    },
    starsAndRevenueTagline: "Te pedig csak elégedetten számolod a szaporodó csillagokat és bevételt. 💸",

    // Other landing page section translations
    problemSolutionTitle: "A vendégek 74%-a figyelmen kívül hagyja az egy hónapnál régebbi értékeléseket.",
    howItWorksTitle: "A JÁTÉK, AMI MINDENT MEGVÁLTOZTAT",
    coreBenefits: {
      skyHighStarRating: "Magasba szökő csillagértékelés",
      captureAuthenticFeedback: "Valódi visszajelzéseket gyűjteni a legnagyobb elégedettség mellett",
      privateNegativeFeedback: "E-mail gyűjtés",
      addressConcerns: "A vendég értékelt, nyert, és máris megadta az e-mail-címét. Tökéletes alkalom, hogy exkluzív ajánlatokat küldj.",
      moreRepeatVisits: "Több visszatérő látogató",
      turnOneTimeVisitors: "Fordítsd a látogatókat hűséges, visszatérő vendégekké",
      // Keep the existing simplified keys for backward compatibility
      starRating: "Magasba szökő csillagértékelés",
      privateFeedback: "Privát negatív visszajelzések",
      repeatVisits: "Több visszatérő vendég",

        moreRepeatGuestsTitle: " +21% visszatérő vendég",
        moreRepeatGuestsDesc: "ami stabilizálja a forgalmad",
        moreReviewsTitle: "5× több ötcsillagos értékelés",
        moreReviewsDesc: "ami új vendégeket csábít hozzád",
        moreEmailSubsTitle: "32% email feliratkozási arány",
        moreEmailSubsDesc: "amivel saját értékesítési csatornád lesz",
    },

    statsTitle: "+15% értékelés / +21% visszatérés / +32% feliratkozás",
    statsDescription: "A teszthelyeken 3 hónap alatt átlagosan ötször több új értékelés érkezett, 21%-os növekedés volt a visszatérő vendégek számában és minden harmadik szerencsekerék pörgetés hozott hírlevél feliratkozást.",
    trustedByTitle: "KINEK VALÓ a Review-toRevenue?",
    restaurantsTitle: "Éttermek",
    barbershopsTitle: "Fodrászszalonok",
    cafesTitle: "Kávézók",
    hotelsTitle: "Szállodák",
    retailTitle: "Kiskereskedelem",
    salonsTitle: "Szépségszalonok",
    trustedByMore: "Konditermek, bisztrók, pékségek, sörházak, reggelizők, salátabárok, virágboltok, autószerelők, masszőrök, stb.",
    testimonialsTitle: "Ügyfeleink véleménye",
    moreReviewsFlow: "Több visszatérő vendég ➕ több Google Review ➕ több email feliratkozó = Bevételpörgetés 🚀",
    pricingTeaserTitle: "Bevételnövelés már két pizza áráért",
    differentiatorTitle: "A gamifikált értékelések minden esetben felülmúlják a hagyományos kéréseket",
    differentiatorDescription: "A hagyományos értékelési kérések azért nem működnek, mert könnyen figyelmen kívül hagyják őket, személytelenek, és nem kínálnak igazi ösztönzőt az ügyfeleknek. A szórólapok elvésznek, az e-mailek törlődnek, és a potenciális 5 csillagos értékelések eltűnnek.",
    engagementTitle: "47%-kal több elköteleződés",
    engagementDescription: "A gamifikálás izgalmas, jutalmazó élménnyé alakítja az értékelési kéréseket, amelyeket az ügyfelek aktívan keresnek, így szinte kétszer annyi részvételt eredményez.",
    revenueTitle: "32%-kal magasabb bevétel",
    revenueDescription: "Azok a vállalkozások, amelyek friss, erős Google értékelésekkel rendelkeznek, lényegesen magasabb bevételt keresnek, mert az ügyfelek jobban bíznak a magas értékelésű márkákban.",
    ignoreReviewsTitle: "74%-uk figyelmen kívül hagyja az egy hónapnál régebbi értékeléseket.",
    ignoreReviewsDescription: "A legtöbb ügyfél kihagyja az egy hónapnál régebbi értékeléseket, ezért fontos, hogy folyamatosan gyűjtsünk friss visszajelzéseket, amelyek tükrözik a jelenlegi kiválóságot.",
    marketingChannelDescription: "A kielégített vendégeket alakítsd át a legerősebb marketingcsatornává — értékelésekkel, amelyek megsokszorozzák a bevételeidet.",

    ltdTeaser: {
  title: "Lifetime ajánlat - limitált ideig!",
  intro: "Szerezd be most <strong>pár havi előfizetés áráért</strong> az <strong>egész életre szóló hozzáférést</strong> a Review-to-Revenue digitális szerencsekerekéhez! <br/><br/>Siess, mert <strong>hónapról hónapra emelkednek az áraink</strong> és legkésőbb <strong>2026. január 1.</strong> napjától - vagy amikor elérjük az <strong>500 előfizetőt</strong> - megszüntetjük ezt a lehetőséget.",
  tiersTitle: "Ársávok",
  tiers: [
    "Super early bird: <strong>39&nbsp;990 Ft</strong> szeptember 30-ig",
    "Early bird: <strong>49&nbsp;990 Ft</strong> október 31-ig",
    "Standard: <strong>59&nbsp;990 Ft</strong> november 30-ig",
    "Last minute: <strong>69&nbsp;990 Ft</strong> december 31-ig"
  ],
  closer: "Gyorsan csapj le a Lifetime Deal-re és spórolj több százezret!",
  cta: "Megnézem a Lifetime Deal-t",
  badge: "Lifetime - limitált",
  note: "Az ajánlat a megjelölt határidőkig vagy a készlet erejéig él."
},

    // Final CTA Section
    finalCtaTitle: "Állítsd végre stabil növekedési pályára a vendéglátóhelyed!",
    finalCtaDescription: "Kezdj el 5 csillagos értékeléseket gyűjteni perceken belül egy játékkal, amit az ügyfeleid imádni fognak.",

  testimonialsRepeat: {
    review1: "Az első látogatóból törzsvendég: 6 hét alatt +31% visszatérő vendég, nulla extra hirdetés.",
    review2: "A hétvégi újrafoglalások +27%. A kerékből épülő email lista minden pénteken kitermeli az árát.",
    review3: "A helyiek a kedvezményekért jönnek vissza. Havi bevétel +18% Facebook hirdetés nélkül.",
    name1: "Koloni Étterem",
    name2: "Bali Babe Szalon",
    name3: "YOU Suite Seminyak"
  },

  trustedBySectionHeadline: "Neked való a Review-to-Revenue, ha...",
  trustedByCards: [
    "<strong>Régi motoros vagy, de fogy a törzsvendég</strong><br/>A régi arcok kikoptak, az újak meg nem jönnek elég gyorsan. Kell egy rendszer, ami folyamatosan visszahozza a vendégeidet, miközben újakat is bevonz.",
    "<strong>Most nyitottál és „láthatatlan” vagy a Google Mapsen</strong><br/>Új a helyed, minden szép, de ha nincs legalább 100 értékelésed, a turisták simán elsétálnak melletted. Az első 100 review megszerzése létkérdés – ezzel a játékkal gyorsan behozhatod a hátrányt.",
    "<strong>Rád nyitott egy „tiktoksztár” hely a sarkon</strong><br/>Profi marketing, influencerek, napi posztok – a verseny egyre keményebb. Ha nem kötöd magadhoz a vendégeidet, szépen lassan átcsábítja őket a konkurencia.",
    "<strong>A Google értékelésed lecsúszott 4.5 alá</strong><br/>Egy-két rossz nap, pár kritikus vendég, és már érezhető a bevételkiesés. A folyamatosan gyarapodó pozitív értékelések segítenek visszahozni a magas átlagot – és az új vendégeket.",
    "<strong>Nem tudsz többet költeni marketingre</strong><br/>Hirdetésekre, videókra, marketingesre már így is egy vagyon megy el. Itt az ideje egy saját, olcsó és eredményes értékesítési csatornát kiépíteni."
  ],
  // opcionális rövid zárómondat (ha nem kell, hagyd üresen: "")
  trustedBySectionClosing: "",
  // új: CTA gomb szöveg
  trustedByCta: "MAGAMRA ISMERTEM, JÖVÖK!",
    revenueBoostHeadline: "A Review-to-Revenue nekik pörgeti a bevételt:",

    // Navigation
    nav: {
      useCases: "Megoldások",
      pricing: "Árazás",
      contact: "Kapcsolat",
      signIn: "Bejelentkezés"
    },

    pricingPlans: {
      solo: {
        name: "Kezdő",
        period: "/hó",
        buttonText: "Regisztrálok",
        features: [
          "Egy üzlet kezelése",
          "Max. 3 szerencsekerék",
          "Havonta max. 200 új értékelés",
          "Letölthető vendég e-mail lista",
          "Rövid, videós útmutatók",
          "Magyar nyelvű ügyfélszolgálat – 24 órán belüli válaszadással",
          "Saját statisztikák elérése",
        ]
      },
      growth: {
        name: "Fejlődő",
        period: "/hó",
        buttonText: "Ezt választom",
        features: [
          "Minden a Kezdő csomagból",
          "Max. 3 üzlet kezelése",
          "Max. 15 szerencsekerék",
          "Havonta max. 1000 új értékelés",
          "Egyedi design",
        ],
        badge: "Népszerű választás"
      },
      unlimited: {
        name: "Professzionális",
        period: "/hó",
        buttonText: "Indulhat!",
        features: [
          "Minden a Fejlődő csomagból",
          "Max. 10 üzlet kezelése",
          "Havonta korlátlan számú új értékelés",
          "Korlátlan számú szerencsekerék",
          "Gyors támogatás – 2 órán belüli válaszadással",
          "Fejlesztési kérések",
          "Egyéni betanítás",
        ],
        badge: "Minden benne van",
      }
    },

    // Add new Hungarian translations for trial and pricing
    daysLeftInTrial: "{days} nap maradt a próbaidőszakból",
    choosePlanAfterTrial: "Válassz egy csomagot a funkciók további használatához a próbaidőszak után.",
    choosePerfectPlan: "Válaszd ki a vállalkozásodnak megfelelő csomagot",
    freeTrialBanner: "30 napos pénzvisszafizetési garancia",
    freeTrialShortLine: "Kezdd el a 30 napos próbát — nem kell bankkártya!",
    noCreditCardRequired: "Nem kell bankkártya. Nincs elköteleződés. Csak eredmények.",
    currentPlan: "Jelenlegi csomag",
    monthly: "Havi",
    yearly: "Éves",
    save20Percent: "20% kedvezmény",
    getStarted: "Kezdd el",

    infoBlock1Headline: "TUDTAD?",
    infoBlock1Body: "➡️ A vásárlók 92%-a elolvassa az online értékeléseket, mielőtt vásárolna (PowerReviews 2023, Trustmary 2025)",

    infoBlock2Headline: "A friss értékelések még többet számítanak",
    infoBlock2Body: "➡️ A vásárlók 88%-a annyira megbízik az értékelésekben, mint a személyes ajánlásokban (WiserNotify 2025)",

    infoBlock3Body: "➡️ Az ügyfelek 72%-ának megerősíti a bizalmát a szolgáltató felé, ha pozitív véleményeket olvas róla (WiserNotify 2025)",

    infoBlockFinalCta: "Az a vállalkozás tud talpon maradni és bevételt növelni, amely folyamatosan gyűjti a pozitív vásárlói visszajelzéseket.",

    // ---------- Pain-points block ----------
    problemsBlockHeadline: "3 probléma, ami viszi tőled a pénzt:",
    
    problems1Title: "A néma vásárlói többség",
    problems1Bullet1: "A boldog vásárlóid 95%-a anélkül távozik, hogy megosztaná a tapasztalatait",
    problems1Bullet2: "Pozitív történeteik sosem jutnak el a leendő vásárlókhoz",
    problems1Bullet3: "A szájról szájra terjedő ajánlások megrekednek a privát beszélgetésekben",
    
    problems2Title: "A Google-láthatatlanság válsága",
    problems2Bullet1: "Vállalkozásod kevésbé tűnik megbízhatónak, mint a több értékeléssel rendelkező versenytársaké",
    problems2Bullet2: "A gyengébb Google-helyezés miatt kevesebben találnak rád",
    problems2Bullet3: "A potenciális ügyfelek az értékelések száma és átlaga alapján a konkurenciát választják",
    
    problems3Title: "A visszatérő vásárlók elvesztése",
    problems3Bullet1: "Nincs rendszeres kapcsolat a már elégedett ügyfelekkel",
    problems3Bullet2: "Elmaradnak az ajánlások és az ismételt vásárlások",
    problems3Bullet3: "A meglévő ügyfelek élettartam-értéke nem tudod megnövelni",

    // ---------- Cost of Inaction block ----------
    inactionBlockHeadline: "A TÉTLENSÉG ÁRA",
    inactionBullet1: "<strong>Elveszett vásárlók:</strong> Minden nap értékelések nélkül azt jelenti, hogy a potenciális vásárlók a konkurenciához mennek",
    inactionBullet2: "<strong>Csökkenő árazási mozgástér:</strong> Folyamatos pozitív vélemények nélkül nehéz prémium árat kérni",
    inactionBullet3: "<strong>Elmulasztott növekedés:</strong> Hiteles vásárlói visszajelzések hiányában nehéz szintet lépni",
    
    // Transition Question Block
    transitionQuestionHeadline: "Szeretnéd te is folyamatosan friss és pozitív Google értékelésekkel növelni a bevételed?",

    // New content block
    newBlockDescription: `<h2 class='text-2xl sm:text-3xl font-semibold text-gray-900 mb-2'>Mindössze annyi a feladatod, hogy <strong class='font-semibold'>állítsd végre csatasorba a vendégeid.</strong></h2>`,
    newBlockDescriptionExtended: `<h2 class='text-2xl sm:text-3xl font-semibold text-gray-900 mb-2'>A <strong class='font-semibold'>Review-to-Revenue-val</strong> a <strong class='font-semibold'>legjobb vendégeidből</strong> 30 másodperc alatt <strong class='font-semibold'>lelkes értékelők</strong> lesznek.</h2>`,
    newBlockNoNeedListTitle: "Nincs szükséged:",
    newBlockNoNeedList: [
      "❌ több százezer forintért legyártott profi videókra,",
      "❌ drága influencer együttműködésekre,",
      "❌ megduplázni a PPC kampányod büdzséjét,",
      "❌ vagy naponta TikTok videók posztolására."
    ],
    newBlockFinalLine: "Mindössze annyi a feladatod, hogy állítsd végre csatasorba a vendégeid.",
    revenueEngineHeadline: "Így termel bevételt neked a Review-to-Revenue",

    // Review-to-Revenue Intro Section
    r2rIntroHeadline: "Ez a Review-to-Revenue.",
    r2rIntroSubline: "Egy <strong>játékos eszköz, amivel villámgyorsan gyűjtöd az új vásárlói véleményeket</strong>. Ez az egyszerű, magyarul is működő rendszer segít automatikusan több vendégértékelést gyűjteni – <strong>QR-kódos, mobilbarát, nem kell hozzá semmit letölteni</strong> vagy applikációt telepíteni sem neked, sem a vendégednek. Azért zseniális, mert minden új vélemény új esély arra, hogy egy ismeretlenből vendéged legyen. <strong>Minél több friss, pozitív értékelésed van, annál többen fognak téged választani</strong> a konkurencia helyett.",    

    r2rFeatures: [
      "✅ Több friss Google-értékelés – automatikusan\nNincs több könyörgés a vendégeknek, a rendszer helyetted dolgozik.",
      "✅ Kiemelkedsz a többi hely közül\nTöbb vélemény = jobb helyezés és több kattintás a Google-ben.",
      "✅ Nem kell hirdetni, mégis több vendég jön\nA jó vélemények a legolcsóbb, leghitelesebb reklámok.",
      "✅ Pár perc alatt beállítható – technikai tudás nélkül\nEgyszerű, gyors, felhasználóbarát – bárki elboldogul vele.",
      "✅ Negatív vélemények szűrése\nA kevésbé jó értékelések privátban segítenek fejlődni – anélkül, hogy romlana a hírneved.",
      "✅ Értékes e-mail címek gyűjtése\nPlusz egy kattintással feliratkoztathatod a vendégeid a hírleveledre, így kapcsolatban tudtok maradni.",
      "✅ Mindezt havi 10 kávé áráért\nCsak 29 dollár havonta – és megkapod a legértékesebb online eszközt, amivel beelőzheted a konkurenciád."
    ],
r2rHowToUseTitle: "Így működik a vendégeknél a Review-to-Revenue",
r2rHowToUseLead:
  "A vendéged épp most kapott egy szuper élményt – egy finom kávét, ízletes ebédet vagy egy feltöltő jógaórát. <strong>Ez az a pillanat, amikor szívesen ad visszajelzést</strong>. Ha közben még nyerhet is valamit? 🎉 Még jobb!",
r2rHowToUseStepsTitle: "Lépésről lépésre:",
r2rHowToUseSteps: [
  "A vendég jól érezte magát → <strong>megkéred, hogy pörgessen egy nyereményért</strong>.",
  "Megpörgeti a kereket → <strong>nyer egy kis ajándékot</strong> vagy kedvezményt, ami visszahozza.",
  "A rendszer kéri a Google értékelést → az ajándék után <strong>szívesebben ír Google értékelést</strong>.",
  "<strong>Megadja az email címét</strong> → hiszen most ajánlotta nyilvánosan a helyed.",
  "Neked pedig <strong>lett egy új törzsvendéged, 5 csillagos véleményed és egy friss feliratkozód</strong>."
],
r2rHowToUseFinalQuestion: "👉 Indulhat a forgalmad felpörgetése?",
r2rHowToUseCta: "VÁGJUNK BELE",

    r2rGuestExperienceIntro: "Így működik a Review-to-Revenue a vendégeknél",
r2rGuestExperienceHeadline: "Ezért hasít a Review-to-Revenue módszere",
gamifiedRequestText: 
  "🔁 <strong>Visszatérésre ösztönöz</strong> - A vendég minden pörgetés után nyer, amit <strong>egyszer használatos QR-kóddal</strong> válthat be nálad. <strong>Automatikus emlékeztetőt is kap</strong> a beváltásra - <strong>asztalfoglalási linkkel együtt</strong>.<br/><br/>" +
  "🎯 <strong>Értékelés játékosan</strong> – A sima „kérlek értékelj” helyett egy <strong>szórakoztató játék</strong> várja. A <strong>nyeremény lekötelezi</strong>, így <strong>sokkal nagyobb eséllyel ír pozitív Google Review-t</strong>.<br/><br/>" +
  "📱 <strong>30 másodperc az egész</strong> – <strong>Applikáció és regisztráció nélkül</strong> működik: <strong>QR-kódot beolvas, pörget, emailt megad, értékel</strong>. Tökéletesen passzol az <strong>Y és Z generáció okostelefonos világához</strong>.",
gamifiedRequestCta: "MEGYEK VELETEK",
engagementBoostHeadline: "",
    satisfiedGuestsToMarketing: "Egy szerencsekerék - tripla haszon: növeld velünk a vendég számod, a bevételed és a hírneved.",
    guestsScanPlayWin: "A vendégek beszkennelik a QR kódot, írnak egy értékelést, megpörgetik a kereket és visszajönnek a nyereményért. Te csak számold az új csillagokat és a növekvő bevételt.",

    // New revenue block keys
    revenueBlockHeadline: "3 + 1 bevételtermelő képesség, amit kiaknázhatsz a Review-to-Revenue-val",
    rev1Title: "Több Google értékelés ⭐️⭐️⭐️⭐️⭐️",
    rev1Body: "Amikor valaki éttermet, kávézót vagy cukrászdát keres, szinte biztos, hogy megnézi a Google-térképen a véleményeket. <strong>Ha látja, hogy nálad sok a friss, pozitív értékelés, nagyobb eséllyel választ téged.</strong><br/><br/>Gyorsabban jelensz meg a Google Maps-en, előrébb rangsorol a kereső, és kitűnsz a versenytársak közül, akik még mindig a régi \"Légyszi értékelj!\" módszert használják.",
    rev2Title: "Nem csak a mennyiség, a minőség is számít 💯",
    rev2Body: "Egy rossz nap, egy figyelmetlen pillanat, és máris beeshet pár negatív értékelés, ami lehúzza az átlagot – emiatt vendégek dönthetnek úgy, hogy máshol költik a pénzüket.🥴<br/><br/><strong>A Review to Revenue abban segít, hogy a legjobb vendégélményeid hangosabban szóljanak.</strong> Minél több elégedett vendég értékel, annál kevésbé számít egy-egy kevésbé jól sikerült pillanat.",
    rev3Title: "Visszatérő vásárlók generálása ♻️",
    rev3Body: "Adj olyan nyereményeket, amelyeket a vendég csak a következő látogatáskor válthat be, és máris elindítottad a visszatérés folyamatát.<br/><br/><strong>Egy 10–15 %-os kupon hamar lejár – a vendég emlékezni fog, hogy érdemes visszajönnie.</strong>",
    rev4Title: "E-mail gyűjtés – valódi aranybánya 💸",
    rev4Body: "A vendég értékelt, nyert, és máris megadta az e-mail-címét. <strong>Tökéletes alkalom, hogy exkluzív ajánlatokat küldj.</strong><br/><br/>Ügyfeleink 30–40 %-os feliratkozási arányt látnak – máshol akár 1500–2000 Ft-ot fizetnél egy címért, itt gyakorlatilag ajándék.",
    revenueBlockCta: "Építsd a bevételed most!",

emailListBlock: {
  title: "A folyamatos teltház titka",
  leadQuestion: "Tudod, mi a legolcsóbb és legerősebb értékesítési csatorna?",
  leadAnswer: "👉 A saját email címlistád.",
  reason1: "Egy <strong>email küldése fillérekbe kerül, miközben közvetlenül a vendégeid postaládájában landol</strong>. Nem algoritmusokon múlik, hogy eljut-e hozzájuk.",
  // Kék hátterű kártya szövege (az előző title+bullets helyett)
  reasonCardText: "Egy jól időzített hírlevél (pl. „péntek esti borvacsora” vagy „új szezonális pizza”) pillanatok alatt visszacsábítja őket, akik egyébként máshová mentek volna.",
  ownership: "Ráadásul <strong>az email lista a te tulajdonod</strong>. Nem a Google-é, nem a Facebook-é. Akkor is a tiéd marad, ha bármelyik platform szabályt változtat.",
  // Ezt jelenítsd meg H1-ként a komponensben
  challenge: "Egyetlen kihívás van: rávenni a vendégeidet, hogy adják meg az email címüket.",
  r2rHelp: "📧 Ebben segít a Review-to-Revenue digitális szerencsekereke: <strong>ügyfeleink átlagosan 32% feliratkozási arányt érnek el!</strong>",
  speed: "Így rekordsebességgel épül a címlistád a legértékesebb vendégeidből.",
  cta: "EZ KELL NEKEM"
},
    separatorWheel: "Egy szerencsekerék - tripla haszon: növeld velünk a vendég számod, a bevételed és a hírneved.",

    // Setup lépések
setupStepsTitle: "Így hozd létre 15 perc alatt a bevételpörgető rendszered",
setupStepsSubtitle:
  "A vendég fizetett, mosolyog, a kezében a telefonja – ez a tökéletes „wow pillanat”. A QR-kódos szerencsekerékkel ekkor egy mozdulattal:",
setupStepsHighlights: [
  "🎯 visszatérésre ösztönzöd,",
  "⭐ kéred az ötcsillagos értékelését,",
  "📩 és még az email címét is begyűjtöd."
],
setupStepsIntro: "",
setupSteps: [
  "Kattints a Regisztrálok gombra és hozd létre az üzleti profilod (3 perc).",
  "Add meg a nyereményeket és az esélyeiket a szerencsekerekedhez (2 perc).",
  "Töltsd le az így kapott egyedi QR-kódodat (1 perc).",
  "Használd digitálisan vagy nyomtasd ki, pl. matricára, szórólapra (5 perc).",
  "Tedd ki jól látható helyre: asztalra, kasszához, mosdóba (4 perc)."
],
setupStepsTip: 
  "💡 <strong>Tipp: A QR-kód mellé írd ki a főnyereményt és a mondatot: „Pörgess egy nyereményért!”</strong> – garantáltan vonzza a figyelmet.\n\nA főnyeremény legyen értékes (pl. kétfős vacsora, üveg bor), de állíts be 1-2%-os esélyt, a többi, gyakori nyeremény pedig apró, de örömteli (pl. ajándék kávé, 5% kedvezmény, 1+1 akció) legyen.",
setupStepsOutro:
  "Ezután nincs más dolgod, a rendszer automatikusan hozza neked a visszatérő vendégeket, az ötcsillagos értékeléseket és az email feliratkozásokat – hónapról hónapra.",
setupStepsFinalQuestion: "Szeretnéd te is felpörgetni a forgalmad?",
setupStepsCta: "NANÁ, INDULJUNK!",
setupStepsImageAlt: "barista fotó",

    ltd: {
      badge: "Lifetime",
      title: "Lifetime Deal",
      subtitle: "Egyszer fizetsz. Örökre használod.",
      priceNote: "egyszeri díj 1 üzletre",
      features: {
        wheels: "Legfeljebb 3 szerencsekerék",
        reviews: "Havi 200 új értékelés",
        emails: "Vendég e‑mailek letöltése",
        tutorials: "Rövid videós útmutatók",
        stats: "Saját statisztika felület",
        updates: "Minden jövőbeli frissítés"
      },
      addExtraLabel: "További üzlet hozzáadása",
      each: "+{price} / üzlet",
      totalLabel: "Összesen",
      cta: "Lifetime Deal megszerzése",
      redirecting: "Átirányítás…",
    },
// Not for you
notForYouBlock: {
  title: "Nem neked való a Review-to-Revenue, ha...",
  bullets: [
    {
      title: "Nem zavar a drága hirdetés",
      text: "Kényelmesebb neked, hogy vagyonokat fizess havonta a Facebooknak vagy a Google-nek, ahelyett hogy fillérekért építenél egy saját, újra meg újra elérhető vendégkört."
    },
    {
      title: "Nem teszed bele magad",
      text: "Azt hiszed, hogy elég megvenni egy eszközt, és onnantól hátradőlhetsz, magától jönnek a vendégek – bármilyen rendszer csak akkor működik, ha te is aktívan használod."
    },
    {
      title: "Irtózol a kedvezményektől",
      text: "Sajnálod adni egy ajándék kávét vagy 5% kedvezményt a visszatérő vendégeidnek, de grafikusra, dekorációra vagy PR cikkekre lazán kiadsz hatszámjegyű összeget."
    },
    {
      title: "Nem figyeled a versenytársaid",
      text: "Nem zavar, hogy a konkurencia tele van vidám vendégekkel és ötcsillagos értékelésekkel, miközben nálad egyre csendesebb a kassza."
    },
    {
      title: "Nem érdekelnek a negatív értékelések",
      text: "Elfogadod, hogy néhány rossz vélemény lehúzza a Google Review átlagod, és emiatt kevesebben választanak téged."
    }
  ],
  conclusion1:
    "Ez esetben valószínűleg nem egymást keressük.",
  conclusion2:
    "A Review-to-Revenue azoknak való, akik nem érik be azzal, ami épp van – hanem folyamatosan fejlődni és jobbá válni akarnak.",
  conclusion3:
    "Az ő munkájukat segíti és sokszorozza meg a Review-to-Revenue 3 az 1-ben bevételpörgető szerencsekereke.",
  cta: ""
},
  },
  
  en: {
landingHeroHeadline: "Spin up your revenue<br/>– by up to 50%! 🚀",
landingHeroSubline: `Put a QR-powered <strong>digital Prize Wheel</strong> into your guests' hands and pocket these three benefits:<br/><br/>
🎯 <strong>more repeat guests</strong>,<br/>
⭐ <strong>more Google reviews</strong>,<br/>
📩 <strong>a growing email list</strong>.<br/><br/>
These are the building blocks of a fully booked business – all with just one subscription.`,
landingHeroCta: "This is exactly what I need",

    postHeroSeparatorWheel: "One prize wheel — triple win: grow your footfall, revenue, and reputation.",

    // Relief block
    reliefBlock: {
      title: "Hospitality can be easier",
      p1: "That knot in your stomach after a weak month? The <strong>constant uncertainty, empty tables and roller-coaster revenue</strong> haunt almost every owner. Sometimes you know why — seasonality, no events — other times you just stare, wondering why it's quiet while competitors are full and glowing with reviews.",
      p2: "Your <strong>place is better</strong>, fewer people have just said it out loud. You can't raise prices further; costs eat your margin. The maths is simple: <strong>you need more guests</strong>.",
      p3: "Enter the <strong>Review-to-Revenue digital prize wheel</strong>. One QR code, and your guests happily help you collect more reviews, bring back repeat visits, and grow your email list.",
      p4: "Next month you'll open your numbers and <strong>feel calm instead of clutching your stomach</strong> — because you finally have a system that makes demand steadier and more predictable.",
      p5: "Imagine your venue becoming the neighbourhood's <strong>\"legendary\" hangout</strong> — the local Central Perk or MacLaren's. Regulars return like family, first-timers sit with confidence. You worry less about empty tables and more about when the queue will fit inside.<br/><br/>And it takes <strong>no magic — just a simple, smart tool</strong> that puts you on a steady growth path and lets you finally breathe.",   
      cta: "LET'S START NOW",
    },

calculatorIntro: {
  text:
    'Imagine you had a <strong>special bank account</strong>. Its balance shows the amount <strong>you could have earned in a given month</strong> — but didn’t, because you kept everything as it is. <br/><br/>How big is that amount? <strong>You can easily calculate it.</strong><br/><br/>With this calculator you’ll see <strong>how much money you miss out on every month</strong> if you don’t set up a <strong>customer return, Google Review, and email collection system</strong>.'
},
revenueCouldHaveMade: "Revenue you miss out on every month",

// complex blocks
postHeroMistake: {
  title: "Most owners make this expensive mistake",
  intro:
    "Most hospitality owners pour <strong>the lion’s share of their marketing budget into chasing new guests</strong>. You’ve heard it before, right?",
  channels: {
    title: "Research says:",
    bullets: [
      "polished TikTok videos,",
      "influencer collabs,",
      "Google & Facebook ads,",
      "or fully outsourced marketing."
    ]
  },
  costQuestion:
    "They can bring some traffic — but the <strong>real question: is it worth the massive monthly burn?</strong>",
  pivot:
    "Meanwhile there’s a far more profitable group: your existing guests.",
  researchTitle: "Research says:",
  researchBullets: [
    `acquiring a new customer costs 5–10× more than retaining one`,
    `repeat customers spend ~67% more on average`,
    `a +5% retention lift can grow profit by 25–95%`
  ],
  conclusion:
    "In short: <strong>you’re better off not chasing only new people, but strengthening your regulars.</strong>"
},

    // New guests block (keeps repeat-focus logic)
newGuestsBlock: {
  title: "So… should I forget new guests?",
  intro:
    "Not at all. You still need demand — just acquire smarter. <strong>Most first-timers decide based on Google reviews</strong> when choosing between places.",
  strategy:
    "If your star average is strong, that’s not luck — it’s a system. Review-to-Revenue helps with that <strong>too</strong>: it automates the process and multiplies results.",
  warning:
    "If you’re at 4.4★ or below, maths is brutal: a 4.8★ venue wins every time. That can mean <strong>3–5 lost guests a day — ~€2–3k/month gone</strong>.",
  question: "Can you afford that?",
  cta: "SHOW ME THE SOLUTION"
},

    // Crisis / reality check
    crisisHeadline:
        "People choose by Google reviews — especially tourists and first-timers.",
    crisisDescription:
        `If you’re already great at earning stars, it’s not luck — it’s strategy. You’ll <span class="font-semibold text-[#4FC3F7]">love</span> Review-to-Revenue because it <span class="font-semibold text-[#4FC3F7]">automates</span> your flow and <span class="font-semibold text-[#4FC3F7]">multiplies</span> outcomes.<br/><br/>
If you’re at 4.5★ or below, face the hard truth: with a 4.8★ competitor around the corner, <span class="font-semibold">4.8 beats 4.5 every single time.</span> That’s daily lost covers — real money.`,
    crisisSolution:
        `We’ve built a <span class="font-semibold text-[#4FC3F7]">ridiculously simple system</span> that wins this back for the price of two pizzas.`,

    // Separator
    separatorWheel:
        "One prize wheel — triple upside: more guests, more revenue, stronger reputation.",

    // Setup steps
setupStepsTitle: "Create your revenue-boosting system in just 15 minutes",
setupStepsSubtitle:
  "The guest has paid, they’re smiling, phone in hand — this is the perfect “wow moment”. With the QR prize wheel, in one move you can:",
setupStepsHighlights: [
  "🎯 encourage them to come back,",
  "⭐ ask for a five-star review,",
  "📩 and collect their email."
],
setupStepsIntro: "",
setupSteps: [
  "Click the Register button and create your business profile (3 min).",
  "Add prizes and their odds to your prize wheel (2 min).",
  "Download your unique QR code (1 min).",
  "Use it digitally or print it on stickers, flyers, or table tents (5 min).",
  "Place it in visible spots: on tables, at checkout, even in the restroom (4 min)."
],
setupStepsTip:
  "💡 <strong>Tip: Next to the QR code, display the top prize and the line “Spin to win a prize!”</strong> — it instantly grabs attention.\n\nMake the top prize valuable (e.g. dinner for two, a bottle of wine) but set the chance low (1–2%). Let common prizes be small but joyful (e.g. free coffee, 5% discount, 1+1 offer).",
setupStepsOutro:
  "After that, the system automatically brings you repeat customers, five-star reviews, and email subscribers — month after month.",
setupStepsFinalQuestion: "Want to spin up your revenue too?",
setupStepsCta: "YES, LET’S GO!",
    setupStepsImageAlt: "barista photo",

r2rHowToUseTitle: "How guests experience Review-to-Revenue",
r2rHowToUseLead:
  "Your guest just had a great time — <strong>perfect moment to ask for feedback</strong>. If they can also win something… even better! 🎉",
r2rHowToUseStepsTitle: "Step by step:",
r2rHowToUseSteps: [
  "<strong>Ask them to spin for a prize</strong>.",
  "They spin → <strong>win a small treat/discount</strong> that brings them back.",
  "The system asks for a Google review — and they’re <strong>more willing to leave it</strong> right after the win.",
  "<strong>They share their email</strong> — the timing is perfect.",
  "You’ve just <strong>created a new regular, earned a 5-star review and captured an email</strong>."
],
r2rHowToUseFinalQuestion: "👉 Ready to boost your floor traffic?",
r2rHowToUseCta: "START NOW",
// Gamified ask
gamifiedRequestHeadline: "This is why the Review-to-Revenue method works",
gamifiedRequestText:
  "🔁 <strong>Drives repeat visits</strong> - Guests win a prize after every spin, which they can redeem at your place with a <strong>one-time QR code</strong>. They also get an <strong>automatic reminder</strong> to redeem it — complete with your <strong>table booking link</strong>.<br/><br/>" +
  "🎯 <strong>Reviews made fun</strong> – Instead of a boring “please review us,” guests play a game. The <strong>prize makes them feel grateful</strong>, so they’re <strong>far more likely to leave a positive Google Review</strong>.<br/><br/>" +
  "📱 <strong>Just 30 seconds</strong> – <strong>No app, no signup</strong>: <strong>scan the QR, spin, enter email, leave a review</strong>. Perfectly fits the <strong>Gen-Y and Gen-Z mobile-first lifestyle</strong>.",
gamifiedRequestCta: "I'M IN",
      engagementBoostHeadline: "",
      ctaSecondary: "Let’s do it",
      ctaTertiary: "Try it",

      // Trusted by / suitability
      trustedBySectionHeadline:
        "It’s for you if…",
      trustedByCards: [
        "<strong>Your regulars faded, new guests are slow</strong><br/>You need a system that brings people back — while still attracting new ones.",
        "<strong>You just opened and are invisible on Google Maps</strong><br/>Without ~100 reviews tourists simply pass by. This wheel gets you there fast.",
        "<strong>A “TikTok-star” competitor opened nearby</strong><br/>If you don’t lock in your guests, hype will steal them over time.",
        "<strong>Your rating slipped below 4.5★</strong><br/>Continuous positives help recover the average — and new demand.",
        "<strong>No more ad budget left</strong><br/>Build an owned, low-cost channel that works every day."
      ],
      trustedBySectionClosing: "",
      trustedByCta: "THAT’S ME — LET’S GO",
      partnersImageAlt: "Partners photo",
// Not for you
notForYouBlock: {
  title: "It’s not for you if…",
  bullets: [
    {
      title: "You don’t mind expensive ads",
      text: "You’re more comfortable paying Meta or Google thousands every month instead of building your own repeat audience for pennies."
    },
    {
      title: "You won’t put yourself into it",
      text: "You think buying a tool means you can sit back — but any system only works if you actively use it."
    },
    {
      title: "You hate giving small perks",
      text: "You refuse to offer a free coffee or 5% off for loyal guests, but have no problem burning money on design, decor or PR."
    },
    {
      title: "You ignore your competitors",
      text: "It doesn’t bother you that they’re full of happy guests and 5-star reviews while your till goes quiet."
    },
    {
      title: "You don’t care about bad reviews",
      text: "You accept that a few negative ratings drag down your Google average — and cost you bookings."
    }
  ],
  conclusion1: "Then we’re probably not a match.",
  conclusion2: "Review-to-Revenue is for owners who won’t settle for average — but keep improving.",
  conclusion3: "Our 3-in-1 prize wheel multiplies their work and results.",
  cta: ""
},


      // Core benefits
      coreBenefits: {
        skyHighStarRating: "Sky-high star rating",
        captureAuthenticFeedback:
          "Capture authentic feedback at peak satisfaction",
        privateNegativeFeedback: "Email capture",
        addressConcerns:
          "After the win & review, email is a natural next step for offers.",
        moreRepeatVisits: "More repeat visits",
        turnOneTimeVisitors:
          "Turn one-timers into loyal regulars",

        moreRepeatGuestsTitle: "+21% more repeat guests",
        moreRepeatGuestsDesc: "that stabilizes your revenue",
        moreReviewsTitle: "5× more 5-star reviews",
        moreReviewsDesc: "that attract new guests",
        moreEmailSubsTitle: "32% email signup rate",
        moreEmailSubsDesc: "that builds your own sales channel"
      },

      // Use-cases grid
      revenueBoostHeadline: "Review-to-Revenue spins profits for:",
      restaurantsTitle: "Restaurants",
      barbershopsTitle: "Barbershops",
      cafesTitle: "Cafés",
      hotelsTitle: "Hotels",
      retailTitle: "Retail",
      salonsTitle: "Salons",
      trustedByMore:
        "Gyms, bistros, bakeries, taprooms, breakfast bars, salad shops, florists, mechanics, massage, and more.",

      // Stats
      satisfiedGuestsToMarketing:
        "One wheel, triple win: more guests, higher revenue, stronger reputation.",
      statsTitle: "+15% reviews / +21% repeats / +32% opt-ins",
      statsDescription:
        "Across pilots in 3 months: ~5× more fresh reviews, +21% repeat visits, and ~1/3 of spins become email opt-ins.",

      // Testimonials section
      testimonialsTitle: "What customers say",
      testimonialsRepeat: {
        review1:
          "From first-timer to regular: +31% repeat visits in 6 weeks — with zero extra ads.",
        review2:
          "Weekend re-bookings +27%. The email list from the wheel pays for itself every Friday.",
        review3:
          "Locals keep coming back for small rewards. +18% monthly revenue without Facebook ads.",
        name1: "Koloni Restaurant",
        name2: "Bali Babe Salon",
        name3: "YOU Suite Seminyak"
      },
      finalCtaTitle: "Finally put your venue on a stable growth path!",
      finalCtaDescription: "Start collecting 5-star reviews within minutes with a game your guests will love.",

      moreReviewsFlow: "More returning guests ➕ more Google Reviews ➕ more email subscribers = Revenue boost 🚀",
      pricingTeaserTitle: "More revenue for the price of a cheap dinner for 2.",


      ltdTeaser: {
  title: "Lifetime Offer - limited time!",
  intro: "Get <strong>lifetime access</strong> to Review-to-Revenue’s digital Wheel of Fortune for the price of just <strong>a few months of subscription</strong>! <br/><br/>Hurry up: <strong>prices increase month by month</strong>, and this option will end by <strong>January 1, 2026</strong> - or once we reach <strong>500 customers</strong>.",
  tiersTitle: "Price tiers",
  tiers: [
    "Super early bird: <strong>39,990 HUF</strong> until September 30",
    "Early bird: <strong>49,990 HUF</strong> until October 31",
    "Standard: <strong>59,990 HUF</strong> until November 30",
    "Last minute: <strong>69,990 HUF</strong> until December 31"
  ],
  closer: "Grab the Lifetime Deal now and save hundreds of thousands!",
  cta: "View Lifetime Deal",
  badge: "Lifetime - limited",
  note: "Valid until the deadlines above or while supplies last."
},


      // Pricing / LTD bits used on the page
      freeTrialBanner:
        "30 days money-back guarantee.",
      monthly: "Monthly",
      yearly: "Yearly",
      save20Percent: "Save 20%",

      pricingPlans: {
        solo: {
          name: "Starter",
          period: "/mo",
          buttonText: "Get started",
          features: [
            "Manage 1 location",
            "Up to 3 prize wheels",
            "Up to 200 new reviews/month",
            "Downloadable guest email list",
            "Short video tutorials",
            "Support within 24h",
            "Your own stats dashboard"
          ]
        },
        growth: {
          name: "Growth",
          period: "/mo",
          buttonText: "Choose plan",
          features: [
            "Everything in Starter",
            "Up to 3 locations",
            "Up to 15 wheels",
            "Up to 1000 new reviews/month",
            "Custom branding"
          ],
          badge: "Most popular"
        },
        // unlimited left out here (not rendered)
      },

emailListBlock: {
  title: "The secret to staying fully booked",
  leadQuestion: "Do you know the cheapest and strongest sales channel?",
  leadAnswer: "👉 Your own email list.",
  reason1:
    "Sending an email <strong>costs just cents while landing directly in your guests’ inbox</strong>. No algorithms decide whether they see it.",
  // Blue card text instead of reason2Title + bullets
  reasonCardText:
    "A well-timed newsletter (e.g. “Friday night wine dinner” or “new seasonal pizza”) instantly brings them back — guests who otherwise would have gone elsewhere.",
  ownership:
    "And <strong>the list is yours</strong>. Not Google’s, not Facebook’s. Even if platforms change the rules, it still belongs to you.",
  // Render this as H1 in the component
  challenge:
    "The only challenge: getting your guests to actually share their email.",
  r2rHelp: "📧 Here’s how the Review-to-Revenue digital wheel of fortune helps: <strong>our clients achieve an average 32% opt-in rate!</strong>",
  speed:
    "That way your list grows at record speed — from your most valuable guests.",
  cta: "SHOW ME THE SOLUTION"
},

    ltd: {
      badge: "Lifetime",
      title: "Lifetime Deal",
      subtitle: "Pay once. Use forever.",
      priceNote: "one-time for 1 location",
      features: {
        wheels: "Up to 3 prize wheels",
        reviews: "200 new reviews/month",
        emails: "Download guest emails",
        tutorials: "Short video tutorials",
        stats: "Your own stats dashboard",
        updates: "All future updates"
      },
      addExtraLabel: "Add extra location",
      each: "+{price} each",
      totalLabel: "Total",
      cta: "Get Lifetime Deal",
      redirecting: "Redirecting…"
    },

    // Misc alts
    qrScanImageAlt: "QR code scan",
    partnersImageAlt: "Partners photo"
  }
};

export function getTranslationLandingB(language: string) {
  const base = getBase(language) || {};
  const patch = overrides[language as "en" | "hu"] || overrides.en || {};
  // 1) fallbacks → 2) base (A) → 3) overrides (B)
  return merge(merge(fallbacks, base), patch);
}
