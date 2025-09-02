import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card, { CardContent } from './ui/Card';

const USD_TO_ZAR = 18.5; // 1 USD ≈ 18.5 ZAR

const BENCHMARKS = {
  emailOptInRate: 0.32, // 32% saját adat
  subscriberLTV: 7.8, // $7.8/subscriber/year (DMA, 2024)
  subscriptionFee: 29, // $ per hó
  prizeCost: 0.40, // $ per spin
};

const REVIEW_RATE = 0.132; // 13,2%
const REDEMPTION_RATE = 0.283;   // 28,3 % vendég váltja be a nyereményt

const liftPer01 = (rating: number) => (0.15 - ((rating - 1) / 4) * 0.135) * 0.6;

// új state – a select mező értéke (string)
const REVIEW_BANDS = {
  "0-100":     1.30,   // <25 → 1.40, 25-100 → 1.30  → konzervatív átlag
  "101-250":   1.20,
  "251-500":   1.10,
  "500-1000":  1.00,   // baseline
  "1000+":     0.90,   // 1000-2000 → 0.90, 2000+ → 0.85 (tartalékkal)
} as const;

const STORAGE_KEY = 'roiCalc';

type RoiCalcSaved = {
  v: 1;
  exchangeRate: number;
  avgSpend: number;
  txInput: number;
  txMode: 'day' | 'month';
  currentRating: number;
  reviewBand: keyof typeof REVIEW_BANDS;

  // Derived
  txPerMonth: number;
  newReviews: number;
  emailSubs: number;
  returnRate: number;
  returningGuests: number;
  ratingLiftLocal: number;
  emailRevenueLocal: number;
  returningRevenueLocal: number;
  totalGainLocal: number;
  totalGainUSD: number;
  totalCostUSD: number;
  roiPct: number;

  // Assumptions/benchmarks used
  assumptions: {
    reviewRate: number;
    redemptionRate: number;
    emailOptInRate: number;
    subscriberLTV: number;
    subscriptionFee: number;
    prizeCost: number;
  };

  // Backward-compat a Proof oldalhoz
  revenueIncrease: number;

  timestamp: string;
};

// 1️⃣ DEFAULT AOV segédfüggvény
const getDefaultAov = () => 370; // R370 ~ $20 USD

export default function RoiCalculator({ hideFooterNote = false }: { hideFooterNote?: boolean }) {
  const navigate = useNavigate();
  const currencySymbol = 'R';

  // --- betöltés ---
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  })();

  // 2️⃣ useState – egyszer indul el mountkor
  const [avgSpend, setAvgSpend] = useState(400);
  const [txInput, setTxInput] = useState(saved.txInput ?? 50);
  const [txMode, setTxMode] = useState<"day"|"month">(saved.txMode ?? "day");
  const [currentRating, setCurrentRating] = useState(saved.currentRating ?? 4.2);
  const [reviewBand, setReviewBand] = useState<keyof typeof REVIEW_BANDS>(saved.reviewBand ?? "500-1000");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const volumeMult = REVIEW_BANDS[reviewBand];

  // --- havi mennyiség előállítása ---
  const txPerMonth = txMode === "day" ? txInput * 30 : txInput;

  // --- számítások ---
  // ❶ avgSpend is in ZAR (R). Convert to USD for ROI math, keep ZAR for display.
  const aovLocal = avgSpend;                    // ZAR
  const aovUsd   = aovLocal / USD_TO_ZAR;       // USD
  const baseRevLocal = aovLocal * txPerMonth;

  // 2. Új reviewk automatikusan számítva
  const newReviews = Math.max(1, Math.round(txPerMonth * REVIEW_RATE));

  // 3. Hány review kell +0,1★-hoz? → irányelv: ~40 (átlag KKV-nél)
  const REVIEWS_PER_01 = 40;

  // 4. Reálisan elérhető rating-javulás (ne lépjük túl az 5★-t)
  const ratingChange = Math.min(
    5 - currentRating,
    (newReviews / REVIEWS_PER_01) * 0.1        // pl. 40 review → +0,1★
  );

  // 5. Bevételi lift (helyi pénznemben)
  const ratingLiftLocal =
    baseRevLocal *
    (ratingChange / 0.1) *
    liftPer01(currentRating) *
    volumeMult;

  // 7. Email lista extra értéke (benchmark LTV, opt-in)
  const emailSubs = Math.round(newReviews * BENCHMARKS.emailOptInRate);
  const emailRevenue = emailSubs * BENCHMARKS.subscriberLTV;
  const emailRevenueLocal = emailRevenue * USD_TO_ZAR;

  // 7.1 visszatérő bevétel – plafon a 20 % havi forgalomnál
  const returningRawLocal = newReviews * REDEMPTION_RATE * aovLocal;
  const returningRevenueLocal = Math.min(baseRevLocal * 0.20, returningRawLocal);

  // 8. Összes extra érték (USD-ben a ROI számítás miatt)
  const totalGainUSD = (ratingLiftLocal + emailRevenueLocal + returningRevenueLocal) / USD_TO_ZAR;

  // 9. Költség
  const totalCost =
    BENCHMARKS.subscriptionFee + newReviews * BENCHMARKS.prizeCost;

  // 10. ROI %
  const roi = totalCost > 0 ? ((totalGainUSD - totalCost) / totalCost) * 100 : 0;

  const totalGainInCurrency = totalGainUSD * USD_TO_ZAR;
  const roundedTotalGain = Math.round(totalGainInCurrency);
  const returningGuests = Math.round(newReviews * REDEMPTION_RATE);

  // Autosave helper
  const saveAll = () => {
    const payload: RoiCalcSaved = {
      v: 1,
      exchangeRate: USD_TO_ZAR,

      avgSpend,
      txInput,
      txMode,
      currentRating,
      reviewBand,

      txPerMonth,
      newReviews,
      emailSubs,
      returnRate: REDEMPTION_RATE,
      returningGuests,

      ratingLiftLocal: Math.round(ratingLiftLocal),
      emailRevenueLocal: Math.round(emailRevenueLocal),
      returningRevenueLocal: Math.round(returningRevenueLocal),

      totalGainLocal: Math.round(totalGainInCurrency),
      totalGainUSD: Math.round(totalGainUSD),
      totalCostUSD: Math.round(totalCost),
      roiPct: Math.round(roi * 10) / 10,

      assumptions: {
        reviewRate: REVIEW_RATE,
        redemptionRate: REDEMPTION_RATE,
        emailOptInRate: BENCHMARKS.emailOptInRate,
        subscriberLTV: BENCHMARKS.subscriberLTV,
        subscriptionFee: BENCHMARKS.subscriptionFee,
        prizeCost: BENCHMARKS.prizeCost,
      },

      // a meglévő Proof oldalhoz:
      revenueIncrease: Math.round(totalGainInCurrency),

      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  };

  // Debounce-olt autosave useEffect
  useEffect(() => {
    const id = window.setTimeout(saveAll, 150);
    return () => window.clearTimeout(id);
  }, [
    avgSpend, txInput, txMode, currentRating, reviewBand,
    txPerMonth, newReviews, emailSubs,
    ratingLiftLocal, emailRevenueLocal, returningRevenueLocal,
    totalGainUSD, totalGainInCurrency, totalCost, roi
  ]);

  // --- formatting ---
  const locale = 'en-US';
  const n = (x: number) => x.toLocaleString(locale, { maximumFractionDigits: 0 });

  const handleCta = () => {
    // Landing detektálás: ha létezik a how-to blokk a DOM-ban, tekintsük landingnek
    const howToEl = document.getElementById('how-to-use');

    if (howToEl) {
      fbq('trackCustom', 'RoiCalc_CTA_Landing');
      const header = document.querySelector('nav, [data-fixed-header]')?.getBoundingClientRect().height || 0;
      const y = howToEl.getBoundingClientRect().top + window.scrollY - header + 10; // +10px lejjebb
      window.scrollTo({ top: y, behavior: 'smooth' });
      return;
    }

    // Nem landing → regisztráció
    fbq('trackCustom', 'RoiCalc_CTA_Register');
    navigate('/auth?mode=register');
  };

  return (
    <Card className="w-full sm:max-w-2xl mx-auto mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl border border-blue-100 overflow-x-hidden">
      <div className="px-4 sm:px-8">
        <CardContent>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#4FC3F7] font-montserrat">
            Review Revenue Calculator
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="font-semibold text-sm font-montserrat text-left w-[220px]">
                Average spend / guest ({currencySymbol})
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={avgSpend}
                onChange={(e) => setAvgSpend(Number(e.target.value))}
                className="flex-1 border border-blue-200 rounded-xl px-4 py-2 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300 outline-none transition"
              />
            </div>
            
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="font-semibold text-sm font-montserrat text-left w-[220px]">
                  Number of guests
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={txInput}
                  onChange={e => setTxInput(+e.target.value || 0)}
                  className="flex-1 border border-blue-200 rounded-xl px-4 py-2 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300 outline-none transition"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm sm:ml-[228px] ml-0">
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="txMode"
                    value="day"
                    checked={txMode === "day"}
                    onChange={() => setTxMode("day")}
                    className="accent-[#4FC3F7]"
                  />
                  per day
                </label>

                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="txMode"
                    value="month"
                    checked={txMode === "month"}
                    onChange={() => setTxMode("month")}
                    className="accent-[#4FC3F7]"
                  />
                  per month
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="font-semibold text-sm font-montserrat text-left w-[220px]">
                Current Google rating (★)
              </label>
              <input
                type="number"
                min={3}
                max={5}
                step={0.1}
                value={currentRating}
                onChange={(e) => setCurrentRating(Number(e.target.value))}
                className="flex-1 border border-blue-200 rounded-xl px-4 py-2 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300 outline-none transition"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="font-semibold text-sm font-montserrat text-left w-[220px]">
                Current review count
              </label>
              <select
                value={reviewBand}
                onChange={e => setReviewBand(e.target.value as keyof typeof REVIEW_BANDS)}
                className="flex-1 border border-blue-200 rounded-xl px-4 py-2 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-300 outline-none transition"
              >
                {Object.keys(REVIEW_BANDS).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="bg-white rounded-2xl px-6 py-6 my-8 border border-blue-100 shadow-inner text-left">
            <p className="text-lg mb-2 font-alexandria">
              <strong className="font-montserrat">New review / month:</strong> {n(newReviews)}
            </p>
            <p className="text-lg mb-2 font-alexandria">
              <strong className="font-montserrat">Returning guests:</strong> {n(returningGuests)}
            </p>
            <p className="text-lg mb-2 font-alexandria">
              <strong className="font-montserrat">Expected subscribers:</strong> {n(emailSubs)}
            </p>
            <p className="text-3xl font-bold text-green-700 mb-1 font-alexandria">
              +{currencySymbol}{n(roundedTotalGain)} monthly extra value
            </p>
            
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              {showBreakdown ? 'Hide breakdown' : 'Show breakdown'}
            </button>

            {showBreakdown && (
              <div className="mt-4 text-sm text-gray-700 space-y-1 font-alexandria">
                <p>
                  ⭐ Review-driven revenue lift: <strong>{currencySymbol}{n(Math.round(ratingLiftLocal))}</strong>
                </p>
                <p>
                  🔁 Returning visits: <strong>{currencySymbol}{n(Math.round(returningRevenueLocal))}</strong>
                </p>
                <p>
                  💌 Email list value: <strong>{currencySymbol}{n(Math.round(emailRevenueLocal))}</strong>
                </p>
                {!hideFooterNote && (
                  <p className="mt-4 text-sm text-gray-600">
                    Sounds unbelievable, right? We thought so too… But it's not magic, and definitely not a scam – it's simple psychology. 
                    <Link 
                      to="/proof" 
                      onClick={saveAll}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Here's everything you need to know
                    </Link>
                    .
                  </p>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleCta}
            className="w-full mt-4 block text-center text-lg font-semibold rounded-xl bg-[#4FC3F7] text-white py-4 shadow-lg hover:brightness-110 transition animate-pulse-cyan-shadow font-montserrat"
          >
            GET STARTED
          </button>
        </CardContent>
      </div>
    </Card>
  );
}