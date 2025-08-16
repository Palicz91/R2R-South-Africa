// src/components/FAQLocal.tsx
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// --- Inline translations (file-scope) ---
const translations = {
  en: {
    sectionTitle: 'Frequently Asked Questions',
    items: [
      {
        q: 'How does Review to Revenue work?',
        a: 'Guests <b>scan a QR</b>, spin a wheel, <b>instantly receive a prize</b>, then they’re <i>invited</i> to leave a Google review. Total time: ~30–60 seconds.',
      },
      {
        q: 'Is it compliant with Google’s policies?',
        a: 'Yes. Rewards are granted <b>for participating</b> (spinning), not for the review’s content. No review-gating, no content-based incentives.',
      },
      {
        q: 'How long does setup take?',
        a: '<b>~5 minutes</b>: sign up → generate your first QR → print → place on-site. 14-day free trial, no credit card required.',
      },
      {
        q: 'How much does it cost and what’s included?',
        a: '<b>From $29.99/month</b>. Unlimited QR generation, customizable prizes, analytics, and video onboarding. Yearly plan available with savings.',
      },
    ],
  },
  hu: {
    sectionTitle: 'Gyakran Ismételt Kérdések',
    items: [
      {
        q: 'Hogyan működik a Review to Revenue?',
        a: 'A vendég <b>QR-kódot szkennel</b>, pörget egy kereket, <b>azonnal megkapja a nyereményét</b>, majd <i>meghívást kap</i> Google-értékelésre. Teljes idő: ~30–60 mp.',
      },
      {
        q: 'Összhangban van a Google irányelveivel?',
        a: 'Igen. A jutalom <b>a részvételért</b> jár (pörgetés), nem az értékelés tartalmáért. Nincs review-gating, nincs tartalom-alapú ösztönzés.',
      },
      {
        q: 'Mennyi idő a beállítás?',
        a: '<b>~5 perc</b>: regisztráció → első QR létrehozása → nyomtatás → kihelyezés. 14 napos ingyenes próba, bankkártya nélkül.',
      },
      {
        q: 'Mennyibe kerül és mit kapok?',
        a: '<b>29.99 USD/hótól</b>. Korlátlan QR, testreszabható nyeremények, statisztikák, video onboarding. Éves csomag kedvezménnyel.',
      },
    ],
  },
};

type Lang = keyof typeof translations;

type FAQLocalProps = {
  id?: string;
  title?: string;
  // Ha megadod, felülírja a LanguageContext nyelvét (manuális nyelvválasztás)
  lang?: Lang;
  // Ha saját Q&A-kat adnál meg (pl. más oldalra), a fordítások helyett ezt használja
  itemsOverride?: { q: string; a: string }[];
  compact?: boolean;
  showSchema?: boolean;
  defaultOpenIndex?: number;
  className?: string;
};

export default function FAQLocal({
  id,
  title,
  lang,
  itemsOverride,
  compact = false,
  showSchema = true,
  defaultOpenIndex = -1,
  className = '',
}: FAQLocalProps) {
  const { language } = useLanguage(); // manuális választás a LanguageContext-ből
  const activeLang: Lang = (lang || language || 'en') as Lang;

  const t = translations[activeLang] || translations.en;
  const sectionTitle = title ?? t.sectionTitle;

  const items = useMemo(() => itemsOverride ?? t.items, [itemsOverride, t.items]);

  const [openIndex, setOpenIndex] = useState<number>(defaultOpenIndex);

  const jsonLd = useMemo(() => {
    if (!showSchema) return null;
    try {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((i) => ({
          '@type': 'Question',
          name: stripHtml(i.q),
          acceptedAnswer: {
            '@type': 'Answer',
            text: stripHtml(i.a),
          },
        })),
      };
    } catch {
      return null;
    }
  }, [items, showSchema]);

  const containerPad = compact ? 'py-8' : 'py-12';
  const cardPad = compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8';

  return (
    <section id={id} className={`relative ${containerPad} bg-white ${className}`}>
      {/* Halvány háttér-halo, hogy illeszkedjen a landing stílushoz */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-24 w-72 h-72 rounded-full bg-blue-50 blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-50 blur-3xl opacity-70" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionTitle ? (
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6 text-center"
            style={{ fontFamily: 'Alexandria, sans-serif' }}
          >
            {sectionTitle}
          </motion.h2>
        ) : null}

        <div className="space-y-4">
          {items.map((item, idx) => {
            const open = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`bg-gray-50 rounded-xl shadow-md border border-blue-100/60 ${cardPad}`}
              >
                <button
                  className="w-full flex items-start gap-3 text-left"
                  onClick={() => setOpenIndex(open ? -1 : idx)}
                  aria-expanded={open}
                >
                  <span className="mt-0.5">
                    <HelpCircle className="w-5 h-5 text-[#1A237E]" />
                  </span>
                  <span
                    className="flex-1 text-lg sm:text-xl text-gray-900"
                    style={{ fontFamily: 'Alexandria, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: item.q }}
                  />
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed border-l-4 pl-4 sm:pl-5"
                        style={{ borderColor: '#4FC3F7', fontFamily: 'Montserrat, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: item.a }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </section>
  );
}

// --- helpers ---
function stripHtml(s: string) {
  return s.replace(/<[^>]*>/g, '');
}
