import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';
import RoiCalculator from '../components/RoiCalculator';
import { ChevronDown } from 'lucide-react';

/* ───────────────────────── 1. TRANSLATIONS ───────────────────────── */

const I18N = {
  hu: {
    cta: 'Kipróbálom ingyen!',
    finalCta: '14 nap minden funkció ingyen',
    bullets: {
      noSetup: 'Nincs beállítási díj',
      noContract: 'Nincs hűségidő',
    },
  },
  en: {
    cta: 'Start my free trial!',
    finalCta: 'Every feature free for 14 days',
    bullets: {
      noSetup: 'No setup fees',
      noContract: 'No long-term contracts',
    },
  },
} as const;

/* ───────────────────────── 2. SMALL COMPONENTS ───────────────────────── */

const StatCard = ({ icon, text, source, url }: { icon: string; text: string; source: string; url: string }) => (
  <div className="flex items-center gap-3 bg-white rounded-2xl shadow p-4">
    <span className="text-2xl" role="img" aria-label="stat icon">{icon}</span>
    <div>
      <p className="text-sm font-alexandria">{text}</p>
      <p className="text-[11px] text-gray-500 mt-1">
        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
          {source}
        </a>
      </p>
    </div>
  </div>
);

const Accordion = ({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) => {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const accordionId = `logic-${language}`;
  
  return (
    <div className="bg-white rounded-2xl shadow px-6 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left"
        aria-expanded={open}
        aria-controls={accordionId}
      >
        <span className="font-montserrat font-semibold">{heading}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul id={accordionId} className="mt-3 list-disc list-inside space-y-1 text-sm font-alexandria">
          {items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ───────────────────────── 3. PAGE ───────────────────────── */

export default function RoiProofPage() {
  const { language } = useLanguage();
  const t = I18N[language];

  /* ── SAVED DATA LOADER ───────────────────────────── */
  const getSaved = () => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem('roiCalc') || '{}'); }
    catch { return {}; }
  };

  // useState + useEffect for saved
  const [saved, setSaved] = useState<any>(() => getSaved());
  useEffect(() => {
    setSaved(getSaved());
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'roiCalc') setSaved(getSaved());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // valuta/locale
  const savedCurrency: 'hu' | 'en' = (saved?.currency === 'hu' || saved?.currency === 'en')
    ? saved.currency
    : language;
  const locale = savedCurrency === 'hu' ? 'hu-HU' : 'en-US';
  const symbol = savedCurrency === 'hu' ? 'Ft' : '$';
  const exRate = typeof saved?.exchangeRate === 'number' ? saved.exchangeRate : 341.43;

  // számok (ha nincs, marad null → feltételes megjelenítés)
  const newReviews = typeof saved?.newReviews === 'number' ? saved.newReviews : null;
  const returningGuests = typeof saved?.returningGuests === 'number' ? saved.returningGuests : null;
  const emailSubs = typeof saved?.emailSubs === 'number' ? saved.emailSubs : null;

  const ratingLiftLocal = typeof saved?.ratingLiftLocal === 'number' ? saved.ratingLiftLocal : null;
  const returningRevenueLocal = typeof saved?.returningRevenueLocal === 'number' ? saved.returningRevenueLocal : null;
  const emailRevenueLocal = typeof saved?.emailRevenueLocal === 'number' ? saved.emailRevenueLocal : null;
  const totalGainLocal = typeof saved?.totalGainLocal === 'number' ? saved.totalGainLocal : null;

  // ▼ Fees/assumptions + pénzformázó (előre hozva)
  const assumptions = saved?.assumptions ?? {};
  const prizeCostUSD = typeof assumptions?.prizeCost === 'number' ? assumptions.prizeCost : 0.40;
  const subscriptionFeeUSD = typeof assumptions?.subscriptionFee === 'number' ? assumptions.subscriptionFee : 29;
  const subscriptionFeeLocal = Math.round(subscriptionFeeUSD * (savedCurrency === 'hu' ? exRate : 1));

  const c = (amt: number) =>
    savedCurrency === 'hu'
      ? `${amt.toLocaleString('hu-HU')} Ft`
      : `$${amt.toLocaleString('en-US')}`;

  // ⬇️ Általános szám formázó
  const n = (x: number | null | undefined, max = 0) =>
    typeof x === 'number' && Number.isFinite(x)
      ? x.toLocaleString(locale, { maximumFractionDigits: max })
      : '—';

  // ▼ Robusztusabb revenue számítás
  const revenueLocalRaw =
    (typeof totalGainLocal === 'number' && Number.isFinite(totalGainLocal))
      ? totalGainLocal
      : (
          ((typeof ratingLiftLocal === 'number' ? ratingLiftLocal : 0) +
           (typeof returningRevenueLocal === 'number' ? returningRevenueLocal : 0) +
           (typeof emailRevenueLocal === 'number' ? emailRevenueLocal : 0)) || undefined
        );

  const revenueFmt2 =
    (typeof revenueLocalRaw === 'number' && Number.isFinite(revenueLocalRaw))
      ? c(Math.round(revenueLocalRaw))
      : '';

  /* ── COST DERIVED VALUES (must be BEFORE email/revenue deriveds) ── */
  const calcReviews =
    typeof newReviews === 'number' ? newReviews : 100;

  const calcReturningGuests =
    typeof returningGuests === 'number'
      ? returningGuests
      : (typeof newReviews === 'number' ? Math.round(newReviews * 0.28) : 28);

  const rate = savedCurrency === 'hu' ? exRate : 1;
  const singleSpinCostLocal = Math.round(prizeCostUSD * rate);
  const prizeSpendLocalLegacy = Math.round(calcReviews * prizeCostUSD * rate);

  // Átlagköltés + 15% nyereményérték
  const avgSpendLocal =
    typeof saved?.avgSpend === 'number'
      ? saved.avgSpend
      : (typeof assumptions?.avgSpend === 'number' ? assumptions.avgSpend : null);

  const PRIZE_RATE = 0.15;
  const prizeValuePerReturnLocal =
    typeof avgSpendLocal === 'number' ? Math.round(avgSpendLocal * PRIZE_RATE) : null;

  const prizeSpendLocalByValue =
    typeof prizeValuePerReturnLocal === 'number'
      ? Math.round(calcReturningGuests * prizeValuePerReturnLocal)
      : null;

  const effectivePrizeSpendLocal = prizeSpendLocalByValue ?? prizeSpendLocalLegacy;
  const totalCostLocal = subscriptionFeeLocal + (effectivePrizeSpendLocal ?? 0);

  /* ── EMAIL VALUE DERIVEDS ─────────────────────────────────────────── */
  const emailOptInRate =
    typeof saved?.emailOptInRate === 'number'
      ? saved.emailOptInRate
      : (typeof assumptions?.emailOptInRate === 'number' ? assumptions.emailOptInRate : 0.32);

  const calcEmailSubs =
    typeof emailSubs === 'number'
      ? emailSubs
      : Math.round(calcReviews * emailOptInRate);

  const subscriberValueAnnualLocal =
    typeof saved?.subscriberValueAnnual === 'number'
      ? saved.subscriberValueAnnual
      : (savedCurrency === 'hu' ? 3000 : 7.80);

  const monthlyCohortAnnualValueLocal = Math.round(calcEmailSubs * subscriberValueAnnualLocal);
  const yearlyRunRateFromEmailsLocal = Math.round(monthlyCohortAnnualValueLocal * 12);

  const subscriberValueDisplay =
    savedCurrency === 'hu'
      ? c(subscriberValueAnnualLocal)
      : `$${subscriberValueAnnualLocal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const optInPct = (emailOptInRate * 100).toLocaleString(locale, { maximumFractionDigits: 0 }) + '%';

  /* ── REVENUE HIGHLIGHT: kalkulátorból ─────────────── */
  const extraReviewsRevenueLocal =
    typeof ratingLiftLocal === 'number' ? ratingLiftLocal : null;

  const returningSpendLocal =
    typeof returningRevenueLocal === 'number'
      ? returningRevenueLocal
      : (typeof avgSpendLocal === 'number' && typeof calcReturningGuests === 'number'
          ? Math.round(calcReturningGuests * avgSpendLocal)
          : null);

  const emailValueMonthlyLocal =
    typeof emailRevenueLocal === 'number'
      ? emailRevenueLocal
      : (typeof calcEmailSubs === 'number' && Number.isFinite(subscriberValueAnnualLocal)
          ? Math.round((calcEmailSubs * subscriberValueAnnualLocal) / 12)
          : null);

  // Debug (opcionális, törölhető)
  console.debug({ savedFromLS: saved, totalGainLocal, revenueLocalRaw });

  // HERO szöveg
  const heroCta =
    typeof revenueLocalRaw === 'number' && Number.isFinite(revenueLocalRaw)
      ? (savedCurrency === 'hu'
          ? `Képzeld el: ${c(Math.round(revenueLocalRaw))} extra bevétel évente.`
          : `Imagine: ${c(Math.round(revenueLocalRaw))} in extra revenue per year.`)
      : (savedCurrency === 'hu'
          ? 'Képzeld el, mennyit veszítesz, ha nem kezded el most.'
          : 'Imagine how much you lose by not starting now.');

  return (
    <>
      <Helmet>
        <title>Review-to-Revenue · Proof</title>
        <meta name="description" content="Hard data, instant calculator, and a free 14-day trial." />
      </Helmet>
      <PublicNavBar />
      <main className="font-sans">
        {/* ── HERO (Our-Story stílus) ─────────────────────── */}
<section className="bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-16 text-center relative overflow-hidden">
  <div className="max-w-5xl mx-auto px-4">
    <h1 className="text-4xl sm:text-5xl font-bold text-[#4FC3F7] font-alexandria mb-4">
      {language === 'hu'
        ? (revenueFmt2
            ? `Tudjuk, ${revenueFmt2} túl szépnek hangzik ahhoz, hogy igaz legyen`
            : 'Tudjuk, túl szépnek hangzik ahhoz, hogy igaz legyen')
        : (revenueFmt2
            ? `We know ${revenueFmt2} sounds too good to be true`
            : 'We know it sounds too good to be true')}
    </h1>

    <p className="mt-4 italic text-base sm:text-lg text-gray-600 font-montserrat">
      {language === 'hu'
        ? 'Pontosan ezt gondoltuk mi is, amikor először láttuk a számokat.'
        : "That's exactly what we thought when we first saw the numbers."}
    </p>

    <p className="mt-4 text-base sm:text-lg text-gray-700 font-montserrat">
      {language === 'hu'
        ? '47 tanulmány. 3000+ éttermi adatpont. 18 hónap megszállott kutatás.'
        : '47 studies. 3,000+ restaurant data points. 18 months of obsessive research.'}
    </p>

    <p className="mt-4 text-base sm:text-lg text-gray-700 font-montserrat mb-8">
      {language === 'hu'
        ? 'Mind egy kérdés megválaszolásáért: Képesek-e a jobb értékelések valóban 20–40%-kal növelni az éttermi bevételt?'
        : 'All to answer one question: Can better reviews really increase restaurant revenue by 20–40%?'}
    </p>

    <p className="text-lg sm:text-xl text-black font-montserrat font-semibold italic mb-8">
      {language === 'hu'
        ? 'Spoiler: Igen. És most megmutatjuk pontosan, hogyan.'
        : "Spoiler alert: Yes. And we're about to show you exactly how."}
    </p>

    <Link
      to="/auth?mode=register&utm=proof"
      className="inline-block bg-[#4FC3F7] text-white font-semibold rounded-xl px-8 py-4 shadow hover:brightness-110 transition animate-pulse-cyan-shadow font-montserrat"
    >
      {t.cta}
    </Link>
  </div>

  {/* háttér blobok */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
    <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl" />
  </div>
</section>

        {/* ── PSYCHOLOGY SECTION ──────────────────────── */}
        <section className="py-12 bg-white">
  <div className="max-w-5xl mx-auto px-4 text-center">
    <h2 className="text-3xl sm:text-4xl font-alexandria font-bold text-gray-900 mb-6">
      {language === 'hu'
        ? '"Hogyan befolyásolhat pár csillag ennyire a bevételemet?"'
        : '"How Can a Few Stars Really Impact My Bottom Line That Much?"'}
    </h2>

    <p className="text-base sm:text-lg text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      {language === 'hu' ? 'Jogos kérdés. Mi is ezt kérdeztük.' : 'Fair question. We asked the same thing.'}
    </p>

    <p className="mt-4 text-base sm:text-lg text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      {language === 'hu' ? 'Íme, mit mutatnak az adatok:' : "Here's what the data reveals:"}
    </p>

    <h3 className="text-2xl sm:text-3xl font-alexandria font-bold text-gray-900 mt-10 mb-4"> 
      {language === 'hu' ? 'Az 5-csillagos pszichológiai hatás' : 'The 5-Star Psychology Effect'}
    </h3>
    <p className="text-sm text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      {language === 'hu' ? 'A BrightLocal 2023-as fogyasztói felmérése szerint:' : "According to BrightLocal's 2023 Consumer Review Survey:"}
    </p>

    <ul className="list-disc list-inside space-y-1 text-base text-gray-700 font-montserrat max-w-[65ch] mx-auto text-left mt-4">
      <li>
        {language === 'hu'
          ? 'A vendégek 84%-a olvassa a Google értékeléseket étteremválasztás előtt'
          : '84% of the new customers read Google reviews before choosing a restaurant'
        }
      </li>
      <li>
        {language === 'hu'
          ? '76% csak 4.3+ csillagos helyeket fontolgat'
          : '76% only consider restaurants with 4.3+ stars'
        }
      </li>
      <li>
        {language === 'hu'
          ? '89% még csak rá sem néz a 4 csillag alatti helyekre'
          : "89% won't even look at anything under 4 stars"
        }
      </li>
    </ul>

    <h3 className="text-2xl sm:text-3xl font-alexandria font-bold text-gray-900 mt-10 mb-4">
      {language === 'hu'
        ? 'De itt jön az igazán érdekes rész, az összetett hatás, amiről senki sem beszél'
        : "But here's where it gets interesting… The Compound Effect Nobody Talks About"}
    </h3>
    <p className="text-base sm:text-lg text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      {language === 'hu'
        ? 'Ez nem csak az új vendégekről szól. A jobb értékelések láncolatot indítanak:'
        : "It's not just about new customers. Better reviews trigger a cascade:"}
    </p>

    <ul className="list-disc list-inside space-y-1 text-base text-gray-700 font-montserrat max-w-[65ch] mx-auto text-left mt-4">
      <li>
        {language === 'hu'
          ? 'Jobb helyezés a "közeli éttermek" keresésekben (+37% láthatóság)'
          : 'Higher rankings in "restaurants near me" searches (+37% visibility)'
        }
      </li>
      <li>
        {language === 'hu'
          ? 'Magasabb kattintási arányok (+28% fél csillag növekedésért)'
          : 'Increased click-through rates (+28% per half-star)'
        }
      </li>
      <li>
        {language === 'hu'
          ? 'Jobb konverziós ráták (+33% 4,5+ csillagos helyeknél)'
          : 'Better conversion rates (+33% for 4.5+ stars)'
        }
      </li>
      <li>
        {language === 'hu'
          ? 'Magasabb ár elfogadása (+17-22% 4,7+ csillagos helyeknél)'
          : 'Premium pricing acceptance (+17-22% for 4.7+ stars)'
        }
      </li>
    </ul>

    <p className="mt-6 text-base sm:text-lg text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      {language === 'hu'
        ? 'Összefoglalva: Többen találnak meg, többen kattintanak rád, többen választanak, és hajlandók többet fizetni.'
        : "Summary: More people find you, more click on you, more choose you, and they're willing to pay more."}
    </p>
  </div>
</section>


        {/* ── RETURNING CUSTOMERS (bg-blue-50) ───────────── */}
        <section className="py-12 bg-blue-50">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-alexandria font-bold text-gray-900 mb-6">
          {language === 'hu' ? 'Visszatérő vendégek – a gamifikáció hatása' : 'Returning Guests – The Power of Gamification'}
        </h2>

        <p className="text-base sm:text-lg text-gray-700 font-montserrat max-w-[65ch] mx-auto">
          {language === 'hu'
            ? 'A játékosítás és a nyereményrendszerünk miatt átlagosan +28% olyan vendég tér vissza, aki egyébként nem jönne.'
            : "Thanks to our gamification and prize system, an average of +28% guests come back who otherwise wouldn't."}
        </p>

        <h3 className="text-2xl sm:text-3xl font-alexandria font-bold text-gray-900 mt-10 mb-4">
          {language === 'hu' ? 'Miért értékesebb a visszatérő vendég?' : 'Why are returning guests more valuable?'}
        </h3>

        <ul className="list-disc list-inside space-y-1 text-base text-gray-700 font-montserrat max-w-[65ch] mx-auto text-left">
          <li>
            {language === 'hu'
              ? 'Gyakrabban jönnek vissza (több tranzakció).'
              : 'They visit more often (more transactions).'}
          </li>
          <li>
            {language === 'hu'
              ? 'Magasabb az átlagos költés.'
              : 'Higher average order value.'}
          </li>
          <li>
            {language === 'hu'
              ? 'Nagyobb az ajánlási hajlandóság (több organikus forgalom).'
              : 'Higher referral propensity (more organic traffic).'}
          </li>
        </ul>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-alexandria font-bold">+28%</p>
            <p className="text-sm text-gray-600 mt-1 font-montserrat">
              {language === 'hu' ? 'extra visszatérők' : 'incremental returners'}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-alexandria font-bold">+67%</p>
            <p className="text-sm text-gray-600 mt-1 font-montserrat">
              {language === 'hu' ? 'magasabb átlagköltés' : 'higher AOV'}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-alexandria font-bold">42%</p>
            <p className="text-sm text-gray-600 mt-1 font-montserrat">
              {language === 'hu' ? 'gyakoribb visszatérés' : 'more frequent visits'}
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ── BRIDGE / SEPARATOR (brand stripe) ───────────────────────── */}
    <section className="py-6 md:py-8 bg-[#4FC3F7] text-white text-center">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-lg sm:text-xl font-alexandria font-semibold max-w-[65ch] mx-auto">
          {language === 'hu'
            ? 'Több látogatás × magasabb költés = mérhető, hónapról hónapra növekvő bevétel.'
            : 'More visits × higher spend = measurable, month‑over‑month revenue.'}
        </p>
      </div>
    </section>

        {/* ── EMAIL VALUE (bg-indigo-50) ─────────────────── */}
        <section className="py-12 bg-indigo-50">
  <div className="max-w-5xl mx-auto px-4 text-center">
    <h2 className="text-3xl sm:text-4xl font-alexandria font-bold text-gray-900 mb-6">
      {language === 'hu' ? '"Email egy review tool-tól?"' : '"Email From a Review Tool?"'}
    </h2>

    <p className="text-base sm:text-lg text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      {language === 'hu'
        ? 'Értjük. Az email marketing egy értékelési platformtól távolinak hangzik.'
        : 'We get it. Email marketing from a review platform sounds like a stretch.'}
    </p>

    <p className="mt-4 text-base sm:text-lg text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      {language === 'hu' ? 'De gondolj bele:' : 'But consider this:'}
    </p>

    <h3 className="text-2xl sm:text-3xl font-alexandria font-bold text-gray-900 mt-10 mb-2">
      {language === 'hu' ? 'A 3.000 Ft-os titok' : 'The $7.80 Secret'}
    </h3>
    <p className="text-sm text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      {language === 'hu'
        ? 'A Direct Marketing Association 2024-es jelentése kimutatta:'
        : "The Direct Marketing Association's 2024 report revealed:"}
    </p>

    <ul className="list-disc list-inside space-y-1 text-base text-gray-700 font-montserrat max-w-[65ch] mx-auto text-left mt-3">
      <li>
        {language === 'hu'
          ? 'Egy átlagos email feliratkozó értéke: 3.000 Ft/év'
          : 'An average email subscriber value: $7.80/year'
        }
      </li>
      <li>
        {language === 'hu'
          ? 'Vendég visszatérés növekedése: +31% email marketinggel'
          : 'Guest retention increase: +31% with email marketing'
        }
      </li>
    </ul>

    <h3 className="text-2xl sm:text-3xl font-alexandria font-bold text-gray-900 mt-10 mb-3">
      {language === 'hu' ? 'A mi valós adataink' : 'Our Real-World Data'}
    </h3>
    <ul className="list-disc list-inside space-y-1 text-base text-gray-700 font-montserrat max-w-[65ch] mx-auto text-left">
      <li>
        {language === 'hu'
          ? 'Átlagos email feliratkozási arány: 32% (vs. 2% iparági átlag)'
          : 'Average email opt-in rate: 32% (vs. 2% industry standard)'
        }
      </li>
      <li>
        {language === 'hu'
          ? 'Miért ilyen magas? A vendégek már motiváltak (épp nyertek valamit!)'
          : 'Why so high? Guests are already engaged (they just won something!)'
        }
      </li>
    </ul>

    <h3 className="text-2xl sm:text-3xl font-alexandria font-bold text-gray-900 mt-10 mb-3">
      {language === 'hu' ? 'Gyors matek:' : 'Quick Math:'}
    </h3>
    <ul className="list-disc list-inside space-y-1 text-base text-gray-700 font-montserrat max-w-[65ch] mx-auto text-left">
      <li>
        {language === 'hu'
          ? <>{n(calcReviews)} értékelés / hó → {n(calcEmailSubs)} email feliratkozó <span className="text-gray-500">({optInPct} opt-in)</span></>
          : <>{n(calcReviews)} reviews / month → {n(calcEmailSubs)} email subscribers <span className="text-gray-500">({optInPct} opt-in)</span></>
        }
      </li>
      <li>
        {language === 'hu'
          ? <>{n(calcEmailSubs)} × {subscriberValueDisplay} = <strong>{c(monthlyCohortAnnualValueLocal)}</strong> éves érték az adott havi új listából</>
          : <>{n(calcEmailSubs)} × {subscriberValueDisplay} = <strong>{c(monthlyCohortAnnualValueLocal)}</strong> annual value from that month’s new list</>
        }
      </li>
      <li>
        {language === 'hu'
          ? <>Ha minden hónapban ennyit gyűjtesz: 12 × {c(monthlyCohortAnnualValueLocal)} = <strong>{c(yearlyRunRateFromEmailsLocal)}</strong> évesített email-bevétel</>
          : <>If you collect this every month: 12 × {c(monthlyCohortAnnualValueLocal)} = <strong>{c(yearlyRunRateFromEmailsLocal)}</strong> annualized email value</>
        }
      </li>
    </ul>

    <p className="mt-6 text-xl font-semibold text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      {language === 'hu' ? 'És ez csak az emailből.' : "And that's just from email."}
    </p>
  </div>
</section>

{/* ── COST BREAKDOWN (white) ─────────────────────── */}
<section className="py-12 bg-white">
  <div className="max-w-5xl mx-auto px-4 text-center">
    <h2 className="text-3xl sm:text-4xl font-alexandria font-bold text-gray-900 mb-6">
      {language === 'hu'
        ? '"De a nyeremények költsége nem eszi fel a hasznot?"'
        : '"But Won\'t the Prize Costs Eat Up Any Gains?"'}
    </h2>

    <p className="text-base sm:text-lg text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      {language === 'hu' ? 'Beszéljünk valós számokról.' : "Let's talk real numbers."}
    </p>

    <h3 className="text-2xl sm:text-3xl font-alexandria font-bold text-gray-900 mt-10 mb-4">
      {language === 'hu' ? 'A költségeid:' : 'Your Actual Costs:'}
    </h3>

    <ul className="list-disc list-inside space-y-1 text-base text-gray-700 font-montserrat max-w-[65ch] mx-auto text-left">
      <li>
        {language === 'hu'
          ? <>Review to Revenue előfizetés: <strong>{c(subscriptionFeeLocal)}</strong> / hó</>
          : <>Review to Revenue subscription: <strong>{c(subscriptionFeeLocal)}</strong> / month</>
        }
      </li>
      <li>
        {language === 'hu'
          ? <>Nyereménnyel visszatérő vendégek száma: <strong>{n(calcReturningGuests)}</strong></>
          : <>Number of returning guests with a prize: <strong>{n(calcReturningGuests)}</strong></>
        }
      </li>
      <li>
        {language === 'hu' ? (
          <>
            Havi nyereményköltség: <strong>{c(effectivePrizeSpendLocal || 0)}</strong>{' '}
            {prizeSpendLocalByValue != null ? (
              <span className="text-gray-500">
                (számoljunk úgy hogy az átlag költés {c(avgSpendLocal || 0)} 15%-ával megegyező mértékű kedvezményt vagy nyereményt adsz minden visszatérő vásárlónak)
              </span>
            ) : (
              <span className="text-gray-500">
                (Let’s assume you give a discount or prize equal to 15% of the average spend ({c(avgSpendLocal || 0)}) to every returning customer)
              </span>
            )}
          </>
        ) : (
          <>
            Monthly prize spend: <strong>{c(effectivePrizeSpendLocal || 0)}</strong>{' '}
            {prizeSpendLocalByValue != null ? (
              <span className="text-gray-500">
                ({n(calcReturningGuests)} returners × 15% × {c(avgSpendLocal || 0)} avg spend)
              </span>
            ) : (
              <span className="text-gray-500">
                ({n(calcReviews)} reviews × {c(singleSpinCostLocal)} / spin)
              </span>
            )}
          </>
        )}
      </li>
      <li>
        {language === 'hu' ? (
          <>
            A többi értékelés  költsége: <strong>~0</strong>{' '}
            <span className="text-gray-500">(nincs beváltott nyeremény, gyakorlatilag ingyen volt)</span>
          </>
        ) : (
          <>
            The cost of the other reviews: <strong>~0</strong>{' '}
            <span className="text-gray-500">(no prize was redeemed, it was practically free)</span>
          </>
        )}
      </li>
      <li>
        {language === 'hu'
          ? <>Összes havi költség: <strong>{c(totalCostLocal)}</strong></>
          : <>Total monthly cost: <strong>{c(totalCostLocal)}</strong></>
        }
      </li>
      </ul>
  </div>
</section>

{/* ── HIGHLIGHT: várható havi bevételi oldal ───────── */}
<div className="mt-10 bg-[#4FC3F7] text-white rounded-2xl p-4 sm:p-5 shadow">
  <div className="text-center text-sm sm:text-base font-montserrat">
    {language === 'hu' ? (
      <>
        <span className="font-semibold">Extra review‑kból:</span>{' '}
        {extraReviewsRevenueLocal != null ? c(extraReviewsRevenueLocal) : '—'}
        <span className="mx-3 opacity-70">•</span>
        <span className="font-semibold">Visszatérő vásárlók költése:</span>{' '}
        {returningSpendLocal != null ? c(returningSpendLocal) : '—'}
        <span className="mx-3 opacity-70">•</span>
        <span className="font-semibold">Email feliratkozók (érték):</span>{' '}
        {emailValueMonthlyLocal != null ? c(emailValueMonthlyLocal) : '—'}
        <span className="block mt-3 text-base sm:text-lg">
          <span className="font-bold underline">Összesített bevétel növekedés:</span>{' '}
          <span className="font-bold underline">
            {typeof totalGainLocal === 'number' ? c(Math.round(totalGainLocal)) : '—'}
          </span>
        </span>
      </>
    ) : (
      <>
        <span className="font-semibold">From extra reviews:</span>{' '}
        {extraReviewsRevenueLocal != null ? c(extraReviewsRevenueLocal) : '—'}
        <span className="mx-3 opacity-70">•</span>
        <span className="font-semibold">Returning customers spend:</span>{' '}
        {returningSpendLocal != null ? c(returningSpendLocal) : '—'}
        <span className="mx-3 opacity-70">•</span>
        <span className="font-semibold">Email subscribers (value):</span>{' '}
        {emailValueMonthlyLocal != null ? c(emailValueMonthlyLocal) : '—'}
        <span className="block mt-3 text-base sm:text-lg">
          <span className="font-bold underline">Total revenue gain:</span>{' '}
          <span className="font-bold underline">
            {typeof totalGainLocal === 'number' ? c(Math.round(totalGainLocal)) : '—'}
          </span>
        </span>
      </>
    )}
  </div>
</div>

{/* ── WHY NOT EVERYONE (egységes kártyás) ─────────── */}
<section className="py-12 bg-gray-50">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-3xl sm:text-4xl font-alexandria font-bold text-gray-900 text-center">
      {language === 'hu'
        ? '"Ha ez ennyire jól működik, miért nem csinálják ezt mindenki?"'
        : '"If This Works So Well, Why Isn\'t Everyone Doing It?"'}
    </h2>
    <p className="mt-4 text-base sm:text-lg text-gray-700 font-montserrat max-w-[65ch] mx-auto text-center">
      {language === 'hu' ? 'Kiváló kérdés. Itt az őszinte válasz:' : "Excellent question. Here's the honest answer:"}
    </p>

    <div className="mt-10 grid md:grid-cols-2 gap-6">
      {/* Card 1 */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-xl sm:text-2xl font-alexandria font-bold text-gray-900 flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4FC3F7] text-white text-sm font-semibold">1</span>
          {language === 'hu' ? 'Ez (még) új' : "It's New(ish)"}
        </h3>
        <p className="mt-3 text-base text-gray-700 font-montserrat leading-relaxed">
          {language === 'hu'
            ? 'A QR-kódos értékelés-gyűjtés nagy léptékben csak 2020 után vált népszerűvé. A pszichológia ősi; a technológia nem.'
            : 'QR-code review collection at scale only became popular post-2020. The psychology is ancient; the technology is not.'}
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-xl sm:text-2xl font-alexandria font-bold text-gray-900 flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4FC3F7] text-white text-sm font-semibold">2</span>
          {language === 'hu' ? 'Megvalósítási komplexitás' : 'Implementation Complexity'}
        </h3>
        <p className="mt-3 text-base text-gray-700 font-montserrat leading-relaxed">
          {language === 'hu' ? 'A legtöbb étterem saját megoldásokat próbál:' : 'Most restaurants try DIY solutions:'}
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1 text-base text-gray-700 font-montserrat">
          <li>{language === 'hu' ? 'Általános QR kódok (nincs email gyűjtés)' : 'Generic QR codes (no email capture)'}</li>
          <li>{language === 'hu' ? 'Nincs nyeremény/ösztönző rendszer' : 'No prize/incentive system'}</li>
        </ul>
        <p className="mt-3 text-base text-gray-700 font-montserrat">
          {language === 'hu' ? 'Eredmény: 2–3% értékelési ráta vs. a mi 13,2%-unk' : 'Result: 2–3% review rate vs. our 13.2%'}
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-xl sm:text-2xl font-alexandria font-bold text-gray-900 flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4FC3F7] text-white text-sm font-semibold">3</span>
          {language === 'hu' ? 'A "Beállítom és elfelejtem" mítosz' : 'The "Set It and Forget It" Myth'}
        </h3>
        <p className="mt-3 text-base text-gray-700 font-montserrat">
          {language === 'hu' ? 'A siker megköveteli:' : 'Success requires:'}
        </p>
        <ul className="mt-3 list-disc list-inside space-y-1 text-base text-gray-700 font-montserrat">
          <li>{language === 'hu' ? 'Személyzet részvételét' : 'Involving your staff'}</li>
          <li>{language === 'hu' ? 'Következetes végrehajtás (automatizációnk kezeli)' : 'Consistent execution (our automation handles)'}</li>
          <li>{language === 'hu' ? 'Automatizált rendszer, utánkövetéssel' : 'Automated system with built-in follow-ups'}</li>
        </ul>
      </div>

      {/* Card 4 */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-xl sm:text-2xl font-alexandria font-bold text-gray-900 flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4FC3F7] text-white text-sm font-semibold">4</span>
          {language === 'hu' ? 'Elsőként érkezők előnye' : 'First-Mover Advantage'}
        </h3>
        <p className="mt-3 text-base text-gray-700 font-montserrat leading-relaxed">
          {language === 'hu'
            ? 'Versenyző piacokon a korai alkalmazók látják a legnagyobb nyereséget. Amint mindenki eléri a 4,7 csillagot, az előny normalizálódik.'
            : 'In competitive markets, early adopters see the biggest gains. Once everyone hits 4.7 stars, the advantage normalizes.'}
        </p>
      </div>
    </div>
  </div>
</section>

        {/* ── FINAL CTA (gradient + blobok) ──────────────── */}
<section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 text-center relative overflow-hidden">
  <div className="max-w-5xl mx-auto px-4">
    <h2 className="text-3xl sm:text-4xl font-alexandria font-bold text-gray-900">
      {language === 'hu'
        ? 'A legjobb idő a kezdésre tegnap volt. A második legjobb idő most van.'
        : 'The best time to start was yesterday. The second best time is now.'}
    </h2>

    <ul className="mt-6 list-none space-y-1 text-base text-gray-700 font-montserrat max-w-[65ch] mx-auto">
      <li>✓ {t.bullets.noSetup} ✓ {t.bullets.noContract}</li>
    </ul>

    <Link
      to="/auth?mode=register&utm=proof"
      className="inline-block bg-[#4FC3F7] text-white font-semibold rounded-xl px-8 py-4 mt-6 shadow hover:brightness-110 transition animate-pulse-cyan-shadow font-montserrat"
    >
      {t.cta}
    </Link>
  </div>

  {/* háttér blobok — ne legyen self-closing, zárjuk egyértelműen */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
    <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
  </div>
</section>
      </main>
      <Footer />
    </>
  );
}
