import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, AlertCircle, Star } from 'lucide-react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabaseClient';
import WheelOfFortune from '../components/WheelOfFortune';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

// 🔝 Language type definition
type Language = 'en' | 'hu';

// Add this type declaration for the window object to use myChatWidget
declare global {
  interface Window {
    myChatWidget?: {
      load: (config: { id: string }) => void;
      unload?: () => void;
    };
  }
}

export {};

// ➊ put this near the top, after your imports
const CHAT_ID = 'bd78b7ea-fbda-4365-8ed7-afc30953b4d1';

// Prize-ötletelő ChatGPT asszisztens
const CHAT_ASSISTANT_URL =
  'https://chatgpt.com/g/g-68469ab187cc8191a8014125e23fdc69-review-to-revenue-wheel-assistant';

// 🔑 Tutorial page_key ehhez az oldalhoz
const TUTORIAL_PAGE_KEY = 'wheels' as const;

// 🎬 YouTube videók nyelv szerint
const YT_BY_LANG: Record<string, string> = {
  hu: 'wlzxhetbh3s',      // HU
  default: 'FbFy_ghEHsI', // EN/egyéb
};

const getYoutubeId = (lang?: string) => (lang === 'hu' ? YT_BY_LANG.hu : YT_BY_LANG.default);

// localStorage kulcs user+page szerint
const seenKey = (userId?: string) => `tutorial_seen_${TUTORIAL_PAGE_KEY}_${userId ?? 'anon'}`;

// ——— tutorial_views "lusta" létrehozás + jelölés ———
const ensureTutorialRow = async (pageKey: 'wheels' | 'profile') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  try {
    await supabase
      .from('tutorial_views')
      .upsert(
        { user_id: user.id, page_key: pageKey, viewed: false, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,page_key', ignoreDuplicates: true } // konfliktus esetén DO NOTHING
      );
  } catch (e) {
    console.error('tutorial_views upsert (ensure) failed', e);
  }
};

const markTutorialViewed = async (pageKey: 'wheels' | 'profile') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  try {
    await supabase
      .from('tutorial_views')
      .upsert(
        {
          user_id: user.id,
          page_key: pageKey,
          viewed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,page_key' }
      );
  } catch (e) {
    console.error('tutorial_views upsert (mark viewed) failed', e);
  }
};

// ➊ Fordítási szótár a létrehozáshoz és szerkesztéshez
export const createWheelTranslations = {
  en: {
    title_create: 'Create Wheel Project',
    title_edit: 'Edit Wheel Project',
    error_project_not_found: 'Project not found',
    error_auth_required: 'Authentication required. Please log in and try again.',
    error_business_required: 'No business selected. Please select a business first.',
    form_name_label: 'Project Name',
    form_name_required: 'Project name is required',
    form_language_label: 'Language',
    form_language_help_title: 'What does this language setting affect?',
    form_language_help_body: 'This setting controls the language your customers will see:',
    form_language_help_points: [
      'All texts on the review and reward pages',
      'All automated emails and confirmations',
      'Prize instructions and disclaimers',
    ],
    form_language_note: 'Your own dashboard will remain in English.',
    form_description_label: 'Description (optional)',
    form_expiry_label: 'Reward Expiry (days)',
    form_expiry_help_title: 'What happens when a reward expires?',
    reward_expiration_info: 'Each reward has a built-in expiration based on this number of days.',
    form_expiry_help_points: [
      'After this period, the prize can no longer be redeemed',
      'This encourages faster visits and prevents long-term abuse',
    ],
    form_min_rating_label: 'Minimum Google Review Rating',
    form_min_rating_help_title: 'Why does this setting matter?',
    google_review_filter_info: 'This setting filters which reviews are actually published on Google.',
    form_min_rating_help_points: [
      'Only reviews that meet or exceed this rating will be forwarded to Google',
      'Lower-rated feedback is collected privately and does not go public',
      'This helps you avoid negative reviews while still giving every customer a chance to spin',
    ],
    form_prizes_label: 'Prize Segments',
    form_add_prize: 'Add Prize',
    form_remove_prize: 'Prize removed',
    form_total_probability: 'Total probability',
    form_total_probability_note: '(should be between 99% and 101%)',
    form_manual_prob_toggle: 'Set probabilities manually',
    form_manual_prob_help_title: 'How does manual probability work?',
    custom_probability_info: 'When enabled, you can manually set the probability of each prize — this is useful if you want to favor certain rewards more than others.',
    form_manual_prob_help_points: [
      'The value represents the chance (%) of landing on that prize',
      'Make sure the total adds up to 100% to ensure fairness',
      'If left disabled, all prizes will be equally weighted automatically',
    ],
    form_no_google_toggle: 'No Google Review',
    form_no_google_help_title: 'When should you skip the Google review step?',
    skip_review_info: 'If this setting is enabled, customers will skip the Google review process and go directly to spinning the Wheel of Fortune.',
    form_no_google_help_points: [
      'Use this when the main goal is to incentivize participation, not collect public reviews',
      'Ideal for flyer-based or QR campaigns targeting people before they visit your venue',
      "Great for events, giveaways, or any promotion where a review isn't yet relevant or valuable",
    ],
    form_qr_toggle: 'QR coupon code',
    form_qr_help_title: 'What does the QR coupon code do?',
    coupon_per_prize_info: 'When this setting is enabled, you can assign a unique coupon code to each prize.',
    form_qr_help_points: [
      'These codes are shown to the customer after spinning the wheel',
      'Perfect for online discounts, promo codes, or campaign tracking',
      'Use it to connect the prize to your webshop or booking system',
    ],
    form_qr_example: 'Example: A 10% OFF prize could include a code like WELCOME10 that customers can redeem at checkout.',
    form_disclaimer_label: 'Disclaimers (optional)',
    form_submit_create: 'Create Project',
    form_submit_edit: 'Save Changes',
    advanced_options: 'Advanced Options',
    required: '*',
    loading_project: 'Loading project...',
    template_loaded: 'Template loaded successfully!',
    template_load_error: 'Failed to load template',
    project_loaded: 'Project loaded successfully',
    error_loading_project: 'Error loading project',
    prize_added: 'Prize added',
    minimum_stars: 'Minimum {rating} stars required',
    character_counter: '{count}/12 characters',
    character_warning: 'For best display on the wheel, we recommend using 12 characters or fewer. Longer texts are allowed, but might affect the visual layout. Add any extra details in the disclaimer section below.',
    unstar_prize: 'Unstar prize',
    star_prize: 'Star prize',
    prize_label_placeholder: 'Prize label',
    coupon_code_placeholder: 'Coupon code',
    coupon_code_required: 'Coupon code is required when this option is enabled.',
    percent_placeholder: '%',
    disclaimer_placeholder: 'Enter any terms, conditions, or restrictions that apply to your rewards...',
    preview: 'Preview',
    prizes_intro: {
      title: "Now let's assemble your Wheel with prizes",
      body:
        "Add 3–8 prizes, set their probabilities, and optionally mark one as a ⭐ star prize. Need ideas? Open our specially trained ChatGPT and brainstorm prizes that fit your business and brand.",
      cta: "Open Prize Idea Assistant",
      hint:
        "Tip: Keep labels short (≤12 chars) for the cleanest wheel layout. Put the longer details into the disclaimer field.",
    },
  },
  hu: {
    title_create: 'Új szerencsekerék létrehozása',
    title_edit: 'Szerencsekerék szerkesztése',
    error_project_not_found: 'Nem található a projekt',
    error_auth_required: 'Bejelentkezés szükséges a folytatáshoz.',
    error_business_required: 'Nincs kiválasztva üzlet. Először válassz ki egyet.',
    form_name_label: 'Kerék neve',
    form_name_required: 'A kerék neve kötelező',
    form_language_label: 'Nyelv',
    form_language_help_title: 'Mit befolyásol ez a nyelvi beállítás?',
    form_language_help_body: 'Ez határozza meg, hogy mit lát az ügyfeled:',
    form_language_help_points: [
      'Visszajelzés- és nyereményoldal szövegei',
      'Automatikus emailek, megerősítések',
      'Nyeremény instrukciók és feltételek',
    ],
    form_language_note: 'A saját admin felületedet nem módosítja.',
    form_description_label: 'Leírás (opcionális)',
    form_expiry_label: 'Nyeremény érvényessége (nap)',
    form_expiry_help_title: 'Mi történik, ha lejár a nyeremény?',
    reward_expiration_info: 'Minden nyeremény automatikusan lejár ennyi nap után.',
    form_expiry_help_points: [
      'Ezután a nyeremény nem váltható be',
      'Sürgeti a beváltást és elkerüli a visszaélést',
    ],
    form_min_rating_label: 'Minimum Google értékelés',
    form_min_rating_help_title: 'Miért fontos ez a beállítás?',
    google_review_filter_info: 'Ez a beállítás szűri, hogy mely értékelések kerülnek ténylegesen publikálásra a Google-on.',
    form_min_rating_help_points: [
      'Csak kiválasztott csillagszámot elérő értékelések kerülnek publikálásra',
      'Alacsony értékelések privát visszajelzésként maradnak meg',
      'Alacsony értékelés esetén is meg tudja pörgetni a szerencsekereket a vendég',
    ],
    form_prizes_label: 'Nyeremény szegmensek',
    form_add_prize: 'Nyeremény hozzáadása',
    form_remove_prize: 'Nyeremény törölve',
    form_total_probability: 'Összesített esély',
    form_total_probability_note: '(99% és 101% között legyen)',
    form_manual_prob_toggle: 'Esélyek egyéni beállítása',
    form_manual_prob_help_title: 'Hogyan működik az egyéni esélyállítás?',
    custom_probability_info: 'Ha be van kapcsolva, manuálisan állíthatod be az egyes nyeremények esélyét — ez akkor hasznos, ha bizonyos jutalmakat előnyben szeretnél részesíteni. Vagy nagy nyeremények esélyét csökkenteni.',
    form_manual_prob_help_points: [
      'Az érték a nyeremény esélyét (%) jelöli',
      'Az összesített érték legyen 100%',
      'Ha ki van kapcsolva, minden nyeremény egyforma esélyt kap',
    ],
    form_no_google_toggle: 'Google értékelés kihagyása',
    form_no_google_help_title: 'Mikor érdemes kihagyni az értékelést?',
    skip_review_info: 'Ha ez a beállítás engedélyezve van, az ügyfelek kihagyják a Google értékelési lépést, és egyből pörgethetnek a Szerencsekeréken.',
    form_no_google_help_points: [
      'Ha a cél a részvétel ösztönzése, nem a publikus értékelés',
      'Ideális online kampányokhoz, eseményekhez, nyereményjátékhoz',
      'Ha még nem aktuális vagy nem értékes a Google vélemény számodra',
    ],
    form_qr_toggle: 'QR kuponkód',
    form_qr_help_title: 'Mit csinál a QR kuponkód?',
    coupon_per_prize_info: 'Ha ez a beállítás engedélyezve van, minden nyereményhez egyedi kuponkód rendelhető.',
    form_qr_help_points: [
      'A pörgetés után a kupon kód is megjelenik a látogatónak',
      'Tökéletes webshopos kedvezményekhez vagy kampánykövetéshez',
      'Összekapcsolhatod vele a nyereményt a webáruházaddal',
    ],
    form_qr_example: 'Példa: A "10% kedvezmény" nyeremény tartalmazhat egy WELCOME10 kuponkódot, amit fizetéskor lehet beváltani.',
    form_disclaimer_label: 'Feltételek / Megjegyzések (opcionális)',
    form_submit_create: 'Projekt létrehozása',
    form_submit_edit: 'Változások mentése',
    advanced_options: 'További beállítások',
    required: '*',
    loading_project: 'Projekt betöltése...',
    template_loaded: 'Sablon sikeresen betöltve!',
    template_load_error: 'Sablon betöltése sikertelen',
    project_loaded: 'Projekt sikeresen betöltve',
    error_loading_project: 'Hiba a projekt betöltésekor',
    prize_added: 'Nyeremény hozzáadva',
    minimum_stars: 'Minimum {rating} csillag szükséges',
    character_counter: '{count}/12 karakter',
    character_warning: 'A legjobb megjelenítésért javasoljuk a 12 karakternél rövidebb szövegeket. Hosszabb szögek is megengedettek, de befolyásolhatják a megjelenést. A nyeremények részleteit és limitációit a megjegyzés részbe írd!',
    unstar_prize: 'Csillag eltávolítása',
    star_prize: 'Csillagozás',
    prize_label_placeholder: 'Nyeremény neve',
    coupon_code_placeholder: 'Kuponkód',
    coupon_code_required: 'Kuponkód megadása kötelező, ha ez az opció engedélyezve van.',
    percent_placeholder: '%',
    disclaimer_placeholder: 'Add meg a nyereményekre vonatkozó feltételeket, korlátozásokat...',
    preview: 'Előnézet',
    prizes_intro: {
      title: "Most állítsuk össze a szerencsekereket a nyereményekkel",
      body:
        "Adj hozzá 3–8 nyereményt, állítsd be az esélyeket, és opcionálisan jelöld ki a ⭐ kiemelt nyereményt. Jól jönne néhány nyeremény ötlet? Nyisd meg a speciálisan tréningezett ChatGPT-t, segít az vállalkozásodhoz és márkádhoz illeszkedő nyereménystruktúrákra összeállításában.",
      cta: "Nyeremény-ötlet asszisztens megnyitása",
      hint:
        "Tipp: A legrövidebb (≤12 karakteres) címkék mutatnak a legjobban a keréken. A hosszabb részleteket írd a megjegyzés vagy feltételek mezőbe.",
    },
  }
};

// 2️⃣ Select current translation based on language state
const getCurrentTranslation = (language: Language) => createWheelTranslations[language];

interface PrizeSegment {
  label: string;
  probability: number;
  starred: boolean;
  coupon_code?: string;
}

interface WheelProject {
  name: string;
  description?: string;
  prizes: PrizeSegment[];
  min_rating_required?: number;
  expires_in_days: number;
  disclaimer?: string;
  language: Language;
  no_google_review?: boolean;
  qr_coupon_enabled?: boolean;
}

export default function CreateWheelPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditMode = Boolean(id);
  
  // UI-nyelv a globális contextből
  const { language: uiLanguage } = useLanguage();
  const t = getCurrentTranslation(uiLanguage);

  const [project, setProject] = useState<WheelProject>({
    name: '',
    description: '',
    prizes: [
      { label: '', probability: 33.33, starred: false },
      { label: '', probability: 33.33, starred: false },
      { label: '', probability: 33.34, starred: false },
    ],
    expires_in_days: 14,
    disclaimer: '',
    language: 'en',
    qr_coupon_enabled: false,
  });

  const [manualProbabilities, setManualProbabilities] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Tutorial modal states
  const [showTutorial, setShowTutorial] = useState(false);
  const [ytId, setYtId] = useState<string>(getYoutubeId(uiLanguage));
  const [marking, setMarking] = useState(false);

  // Videó ID frissítés nyelvváltáskor (UI nyelv alapján)
  useEffect(() => {
    setYtId(getYoutubeId(uiLanguage));
  }, [uiLanguage]);

  // Scroll-lock, amíg a modal nyitva van
  useEffect(() => {
    if (showTutorial) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [showTutorial]);

  // Első betöltéskor: előbb biztosítsuk a sort (ensure), majd döntsünk a megjelenítésről
  useEffect(() => {
    const checkTutorial = async () => {
      console.log('[Tutorial] Checking if tutorial should show...');
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('[Tutorial] Supabase user:', user);
        if (!user) {
          console.log('[Tutorial] No user found — skipping tutorial');
          return;
        }

        // 1) legyen biztosan sor a (user_id, page_key) párra
        await ensureTutorialRow(TUTORIAL_PAGE_KEY);
        console.log('[Tutorial] ensureTutorialRow completed');

        // 2) ha localStorage szerint már látta, nem nyitjuk fel
        const seen = localStorage.getItem(seenKey(user.id));
        console.log('[Tutorial] LocalStorage seen key:', seen);
        if (seen === 'true') {
          console.log('[Tutorial] Already seen via localStorage — skipping modal');
          return;
        }

        // 3) DB alapján kell-e modalt mutatni?
        const { data, error } = await supabase
          .from('tutorial_views')
          .select('viewed')
          .eq('user_id', user.id)
          .eq('page_key', TUTORIAL_PAGE_KEY)
          .maybeSingle();

        console.log('[Tutorial] DB check result:', { data, error });

        if (error || !data || data.viewed === false) {
          console.log('[Tutorial] Showing tutorial modal...');
          setShowTutorial(true);
        } else {
          console.log('[Tutorial] Tutorial already viewed in DB — syncing localStorage');
          localStorage.setItem(seenKey(user.id), 'true');
        }
      } catch (e) {
        console.warn('[Tutorial] Tutorial check failed:', e);
        // opcionális: hiba esetén is felnyithatod
        // setShowTutorial(true);
      }
    };
    checkTutorial();
  }, []);

  // Auth-állapot változásnál is felugrathatod, de csak ha valóban szükséges
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      console.log('[Tutorial] Auth state changed:', session?.user?.id || 'no user');
      if (!session?.user) return;
      
      // 1) először localStorage ellenőrzés (gyors)
      const seen = localStorage.getItem(seenKey(session.user.id));
      console.log('[Tutorial] Auth change - localStorage seen:', seen);
      if (seen === 'true') {
        console.log('[Tutorial] Auth change - already seen via localStorage');
        return;
      }

      // 2) majd DB check (lassabb, de pontosabb)
      try {
        const { data } = await supabase
          .from('tutorial_views')
          .select('viewed')
          .eq('user_id', session.user.id)
          .eq('page_key', TUTORIAL_PAGE_KEY)
          .maybeSingle();

        console.log('[Tutorial] Auth change - DB check result:', data);

        if (!data || data.viewed === false) {
          console.log('[Tutorial] Auth change - showing tutorial modal');
          setShowTutorial(true);
        } else {
          // Ha DB-ben már látta, de localStorage üres, szinkronizáljuk
          console.log('[Tutorial] Auth change - syncing localStorage from DB');
          localStorage.setItem(seenKey(session.user.id), 'true');
        }
      } catch (e) {
        console.warn('[Tutorial] Auth tutorial check failed:', e);
        // hiba esetén ne nyissuk fel automatikusan
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // "Láttam" jelölés + bezárás
  const dismissTutorial = async () => {
    console.log('[Tutorial] Dismissing tutorial modal...');
    try {
      setMarking(true);
      const { data: { user } } = await supabase.auth.getUser();
      console.log('[Tutorial] Dismiss - user:', user?.id);

      if (user) {
        await markTutorialViewed(TUTORIAL_PAGE_KEY);          // ✅ DB: viewed=true
        console.log('[Tutorial] Marked as viewed in DB');
        localStorage.setItem(seenKey(user.id), 'true');       // ✅ kliens cache
        console.log('[Tutorial] Marked as viewed in localStorage');
      } else {
        localStorage.setItem(seenKey(), 'true');
        console.log('[Tutorial] Marked as viewed in localStorage (anonymous)');
      }
    } catch (e) {
      console.error('[Tutorial] Error dismissing tutorial:', e);
    } finally {
      setMarking(false);
      setShowTutorial(false);
      console.log('[Tutorial] Modal closed');
    }
  };

  useEffect(() => {
    // Check for template in URL
    const templateParam = searchParams.get('template');
    if (templateParam && !isEditMode) {
      try {
        const template = JSON.parse(decodeURIComponent(templateParam));
        if (template && template.prizes) {
          // Convert template to project format
          setProject({
            name: template.name || '',
            description: template.description || '',
            prizes: template.prizes.map((prize: any) => ({
              label: prize.label,
              probability: prize.probability * 100, // Convert from decimal to percentage
              starred: false,
            })),
            // min_rating_required: template.min_stars || 4, // commented out
            expires_in_days: template.expiry_days || 30,
            disclaimer: template.disclaimer || '',
            language: 'en',
            qr_coupon_enabled: false,
          });
          
          // Set manual probabilities if they're not evenly distributed
          const equalProbability = 100 / template.prizes.length;
          const hasCustomProbabilities = template.prizes.some(
            (prize: any) => Math.abs(prize.probability * 100 - equalProbability) > 0.1
          );
          setManualProbabilities(hasCustomProbabilities);
        }
      } catch (err) {
        console.error('Error parsing template:', err);
      }
    } else if (isEditMode) {
      loadProject();
    }
  }, [id, searchParams]); // ← removed 't' dependency

  // ➋ inside CreateWheelPage() – just after the other useEffect hooks
  useEffect(() => {
    // ⓐ load or re-use the script
    const loadWidget = () => window.myChatWidget?.load({ id: CHAT_ID });

    let scriptEl: HTMLScriptElement | null = null;
    if (!window.myChatWidget) {
      scriptEl = document.createElement('script');
      scriptEl.src = 'https://agentivehub.com/production.bundle.min.js';
      scriptEl.type = 'text/javascript';
      scriptEl.async = true;
      scriptEl.onload = loadWidget;
      document.body.appendChild(scriptEl);
    } else {
      loadWidget();
    }

    // ⓑ clean-up when the user navigates away
    return () => {
      window.myChatWidget?.unload?.();
      if (scriptEl) document.body.removeChild(scriptEl);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const loadProject = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('wheel_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError || !projectData) {
        throw new Error(projectError?.message || t.error_project_not_found);
      }

      setProject({
        name: projectData.name,
        description: projectData.description || '',
        prizes: projectData.prizes,
        // min_rating_required: projectData.min_rating_required, // Commented out
        expires_in_days: projectData.expires_in_days,
        disclaimer: projectData.disclaimer || '',
        language: projectData.language || 'en',
        no_google_review: projectData.no_google_review || false,
        qr_coupon_enabled: projectData.qr_coupon_enabled || false,
      });

      const equalProbability = 100 / projectData.prizes.length;
      const hasCustomProbabilities = projectData.prizes.some(
        prize => Math.abs(prize.probability - equalProbability) > 0.1
      );
      setManualProbabilities(hasCustomProbabilities);
    } catch (err: any) {
      console.error('Error loading project:', err);
      setError(err instanceof Error ? err.message : t.error_loading_project);
    }
  };

  useEffect(() => {
    if (!manualProbabilities) {
      const equalProbability = 100 / project.prizes.length;
      setProject(prev => ({
        ...prev,
        prizes: prev.prizes.map(prize => ({
          ...prize,
          probability: Number(equalProbability.toFixed(2)),
        })),
      }));
    }
  }, [manualProbabilities, project.prizes.length]);

  const totalProbability = project.prizes.reduce((sum, prize) => sum + prize.probability, 0);
  const isValidProbability = totalProbability >= 99 && totalProbability <= 101;
  const isValid = isValidProbability && 
                 project.prizes.every(prize => prize.label.trim()) && 
                 project.name.trim().length > 0 &&
                 project.expires_in_days > 0 &&
                 (!project.qr_coupon_enabled || project.prizes.every(prize => prize.coupon_code?.trim())); // ⬅️ new validation

  const handleAddPrize = () => {
    if (project.prizes.length >= 8) return;
    
    const newPrize = {
      label: '',
      probability: manualProbabilities ? 0 : (100 / (project.prizes.length + 1)),
      starred: false,
    };

    setProject(prev => ({
      ...prev,
      prizes: [...prev.prizes].map(prize => ({
        ...prize,
        probability: manualProbabilities ? prize.probability : (100 / (prev.prizes.length + 1)),
      })).concat(newPrize),
    }));
  };

  const handleRemovePrize = (index: number) => {
    if (project.prizes.length <= 3) return;
    
    setProject(prev => {
      const newPrizes = prev.prizes.filter((_, i) => i !== index);
      if (!manualProbabilities) {
        const equalProbability = 100 / newPrizes.length;
        return {
          ...prev,
          prizes: newPrizes.map(prize => ({
            ...prize,
            probability: Number(equalProbability.toFixed(2)),
          })),
        };
      }
      return { ...prev, prizes: newPrizes };
    });
  };

  const handleStarPrize = (index: number) => {
    setProject(prev => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) => ({
        ...prize,
        starred: i === index ? !prize.starred : false,
      })),
    }));
  };

  const handlePrizeChange = (index: number, field: keyof PrizeSegment, value: string | number | boolean) => {
    setProject(prev => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) =>
        i === index
          ? { ...prize, [field]: field === 'probability' ? Number(value) : value }
          : prize
      ),
    }));
  };

  const handleNameChange = (value: string) => {
    setProject(prev => ({ ...prev, name: value }));
    setNameError(value.trim() ? null : t.form_name_required);
  };

  // 4️⃣ Language change handler - only updates project language, NOT UI language
  const handleLanguageChange = (lang: Language) => {
    setProject(prev => ({ ...prev, language: lang })); // ✅ Only change project language
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.name.trim()) {
      setNameError(t.form_name_required);
      return;
    }
    if (!isValid) {
      return;
    }

    setSaving(true);
    setError(null);
    setNameError(null);
    
    try {
      // Fetch the currently logged-in user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // Check for authentication errors
      if (authError) throw authError;
      
      // Do not proceed if user is undefined (not logged in)
      if (!user) {
        throw new Error(t.error_auth_required);
      }
      
      // Get the selected business ID from localStorage
      const selectedBusinessId = localStorage.getItem('selectedBusinessId');
      if (!selectedBusinessId) {
        throw new Error(t.error_business_required);
      }

      // Create payload with default values for all fields
      const projectData = {
        name: project.name.trim(),
        description: project.description || '',
        prizes: project.prizes,
        // min_rating_required: project.min_rating_required, // Commented out
        expires_in_days: project.expires_in_days,
        disclaimer: project.disclaimer || '',
        language: project.language || 'en',
        user_id: user.id,
        business_id: selectedBusinessId,
        no_google_review: typeof project.no_google_review === 'boolean' ? project.no_google_review : false,
        qr_coupon_enabled: typeof project.qr_coupon_enabled === 'boolean' ? project.qr_coupon_enabled : false,
      };

      console.log('Inserting project data:', projectData);

      if (isEditMode) {
        const { error: updateError } = await supabase
          .from('wheel_projects')
          .update(projectData)
          .eq('id', id);
        if (updateError) throw updateError;

        navigate(`/wheels/${id}/qr`);
      } else {
        const { data, error: insertError } = await supabase
          .from('wheel_projects')
          .insert([projectData])
          .select('id')
          .single();

        if (insertError) throw insertError;

        navigate(`/wheels/${data.id}/qr`);
      }
    } catch (err) {
      console.error('Error saving wheel project:', err);
      setError(err instanceof Error ? err.message : 'Error saving project');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-2">
            <div className="bg-white shadow-lg rounded-lg p-6">
              {/* Title + Quick guide button */}
              <div className="mb-6 flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? t.title_edit : t.title_create}
                </h2>

                <button
                  type="button"
                  onClick={() => setShowTutorial(true)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
                             bg-[#4FC3F7] text-white hover:bg-[#29B6F6]
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4FC3F7]"
                >
                  <span className="mr-1">🎥</span>
                  {uiLanguage === 'hu' ? '2 perces útmutató' : '2-min quick guide'}
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form_name_label} <span className="text-red-500">{t.required}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={project.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`block w-full rounded-lg shadow-sm
                             ${nameError 
                               ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                               : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                             }`}
                  />
                  {nameError && (
                    <p className="mt-1 text-sm text-red-600">{nameError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form_language_label} <span className="text-red-500">{t.required}</span>
                  </label>
                  <LanguageSelector
                    value={project.language}
                    onChange={handleLanguageChange}
                  />
                  <details className="mt-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 leading-relaxed px-4 py-3">
                    <summary className="cursor-pointer select-none font-medium text-blue-700 hover:underline">
                      {t.form_language_help_title}
                    </summary>
                    <div className="mt-2 space-y-2">
                      <p>
                        {t.form_language_help_body}
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        {t.form_language_help_points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                      <p className="pt-2">
                        {t.form_language_note}
                      </p>
                    </div>
                  </details>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t.form_description_label}
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                             focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.form_expiry_label} <span className="text-red-500">{t.required}</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={project.expires_in_days}
                    onChange={(e) => setProject(prev => ({ 
                      ...prev, 
                      expires_in_days: Math.max(1, parseInt(e.target.value) || 1)
                    }))}
                    className="block w-full rounded-lg border-gray-300 shadow-sm
                             focus:ring-blue-500 focus:border-blue-500"
                  />
                  <details className="mt-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 leading-relaxed px-4 py-3">
                    <summary className="cursor-pointer select-none font-medium text-blue-700 hover:underline">
                      {t.form_expiry_help_title}
                    </summary>
                    <div className="mt-2 space-y-2">
                      <p>
                      {t.reward_expiration_info}
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        {t.form_expiry_help_points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>

                {/* 
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t.form_min_rating_label}
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <StarRating
                      initialRating={project.min_rating_required}
                      onChange={(rating) =>
                        setProject((prev) => ({ ...prev, min_rating_required: rating }))
                      }
                    />
                    <span className="text-sm text-gray-500">
                      {t.minimum_stars.replace('{rating}', project.min_rating_required.toString())}
                    </span>
                  </div>
                  <details className="mt-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 leading-relaxed px-4 py-3">
                    <summary className="cursor-pointer select-none font-medium text-blue-700 hover:underline">
                      {t.form_min_rating_help_title}
                    </summary>
                    <div className="mt-2 space-y-2">
                      <p>
                      {t.google_review_filter_info}
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        {t.form_min_rating_help_points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>
                */}

                <div>
                  {/* Prize intro helper block */}
                  <div className="mb-6 rounded-lg bg-[#1A237E]/5 border border-[#1A237E]/10 p-4">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                      {t.prizes_intro.title}
                    </h4>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      {t.prizes_intro.body}
                    </p>

                    <button
                      type="button"
                      onClick={() => window.open(CHAT_ASSISTANT_URL, '_blank', 'noopener,noreferrer')}
                      className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg
                                 bg-[#1A237E]/10 text-[#1A237E] hover:bg-[#1A237E]/20 transition-colors"
                    >
                      {t.prizes_intro.cta}
                    </button>

                    <p className="mt-2 text-xs text-gray-500">
                      {t.prizes_intro.hint}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {t.form_prizes_label}
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPrize}
                      disabled={project.prizes.length >= 8}
                      className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg
                                ${
                                  project.prizes.length >= 8
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#1A237E]/10 text-[#1A237E] hover:bg-[#1A237E]/20'
                                }`}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {t.form_add_prize}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {project.prizes.map((prize, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              required
                              placeholder={t.prize_label_placeholder}
                              value={prize.label}
                              onChange={(e) => handlePrizeChange(index, 'label', e.target.value)}
                              className="block w-full rounded-lg border-gray-300 shadow-sm
                                       focus:ring-blue-500 focus:border-blue-500"
                            />
                            
                            {/* Character counter + guidance */}
                            <div className={`mt-1 text-xs space-y-1 ${
                              prize.label.length > 12 ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              <div>{t.character_counter.replace('{count}', prize.label.length.toString())}</div>
                              {prize.label.length > 12 && (
                                <div className="text-left">
                                  {t.character_warning}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-24">
                            <input
                              type="number"
                              required
                              min="0"
                              max="100"
                              placeholder={t.percent_placeholder}
                              value={prize.probability}
                              disabled={!manualProbabilities}
                              onChange={(e) => handlePrizeChange(index, 'probability', e.target.value)}
                              className={`block w-full rounded-lg border-gray-300 shadow-sm
                                       focus:ring-blue-500 focus:border-blue-500
                                       ${!manualProbabilities && 'bg-gray-100 cursor-not-allowed'}`}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleStarPrize(index)}
                            className={`p-2 rounded-lg transition-colors ${
                              prize.starred
                                ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                            }`}
                            title={prize.starred ? t.unstar_prize : t.star_prize}
                          >
                            <Star className={`w-5 h-5 ${prize.starred ? 'fill-yellow-500' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePrize(index)}
                            disabled={project.prizes.length <= 3}
                            className={`p-2 rounded-lg ${
                              project.prizes.length <= 3
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {project.qr_coupon_enabled && (
                          <>
                            <input
                              type="text"
                              placeholder={t.coupon_code_placeholder}
                              value={prize.coupon_code || ''}
                              onChange={(e) => handlePrizeChange(index, 'coupon_code', e.target.value)}
                              className={`mt-1 block w-full rounded-lg shadow-sm 
                                ${!prize.coupon_code?.trim() && project.qr_coupon_enabled 
                                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                            />
                            {!prize.coupon_code?.trim() && project.qr_coupon_enabled && (
                              <p className="text-sm text-red-600 mt-1">
                                {t.coupon_code_required}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={`mt-3 text-sm ${
                    isValidProbability ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {t.form_total_probability}: {totalProbability.toFixed(2)}% {
                      isValidProbability 
                        ? '✓' 
                        : t.form_total_probability_note
                    }
                  </div>
                </div>

                <div className="mt-6 border-t pt-4">
                  <details className="group">
                    <summary className="flex items-center cursor-pointer text-sm font-semibold text-gray-700 select-none">
                      <span>{t.advanced_options}</span>
                      <svg
                        className="ml-2 h-4 w-4 transform group-open:rotate-180 transition-transform"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>

                    <div className="mt-2 pl-4 text-sm text-gray-600 space-y-4">
                      {/* Set probabilities manually */}
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={manualProbabilities}
                            onChange={(e) => setManualProbabilities(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4
                                        peer-focus:ring-blue-300 rounded-full peer
                                        peer-checked:after:translate-x-full peer-checked:after:border-white
                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                        after:bg-white after:border-gray-300 after:border after:rounded-full
                                        after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            {t.form_manual_prob_toggle}
                          </span>
                        </label>
                      </div>
                      
                      <details className="mt-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 leading-relaxed px-4 py-3">
                        <summary className="cursor-pointer select-none font-medium text-blue-700 hover:underline">
                          {t.form_manual_prob_help_title}
                        </summary>
                        <div className="mt-2 space-y-2">
                          <p>
                          {t.custom_probability_info}
                          </p>
                          <ul className="list-disc list-inside ml-4">
                            {t.form_manual_prob_help_points.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </details>

                      {/* No Google Review option */}
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={project.no_google_review ?? false}
                            onChange={(e) => setProject(prev => ({ ...prev, no_google_review: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4
                                        peer-focus:ring-blue-300 rounded-full peer
                                        peer-checked:after:translate-x-full peer-checked:after:border-white
                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                        after:bg-white after:border-gray-300 after:border after:rounded-full
                                        after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            {t.form_no_google_toggle}
                          </span>
                        </label>
                        <button
                          type="button"
                          title="If enabled, Google review collection is skipped. Only the Wheel of Fortune is used."
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m2-4h.01M12 2a10 10 0 11-7.03 17.03A10 10 0 0112 2z" />
                          </svg>
                        </button>
                      </div>
                      
                      <details className="mt-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 leading-relaxed px-4 py-3">
                        <summary className="cursor-pointer select-none font-medium text-blue-700 hover:underline">
                          {t.form_no_google_help_title}
                        </summary>
                        <div className="mt-2 space-y-2">
                          <p>
                          {t.skip_review_info}
                          </p>
                          <ul className="list-disc list-inside ml-4">
                            {t.form_no_google_help_points.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </details>

                      {/* QR coupon code option */}
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={project.qr_coupon_enabled ?? false}
                            onChange={(e) =>
                              setProject((prev) => ({
                                ...prev,
                                qr_coupon_enabled: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4
          peer-focus:ring-blue-300 rounded-full peer
          peer-checked:after:translate-x-full peer-checked:after:border-white
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:border-gray-300 after:border after:rounded-full
          after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            {t.form_qr_toggle}
                          </span>
                        </label>
                        <button
                          type="button"
                          title="Ha engedélyezve van, a nyeremények QR kuponkóddal jönnek létre, amelyet online vásárlásnál lehet beváltani."
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m2-4h.01M12 2a10 10 0 11-7.03 17.03A10 10 0 0112 2z"
                            />
                          </svg>
                        </button>
                      </div>
                      
                      <details className="mt-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 leading-relaxed px-4 py-3">
                        <summary className="cursor-pointer select-none font-medium text-blue-700 hover:underline">
                          {t.form_qr_help_title}
                        </summary>
                        <div className="mt-2 space-y-2">
                          <p>
                          {t.coupon_per_prize_info}
                          </p>
                          <ul className="list-disc list-inside ml-4">
                            {t.form_qr_help_points.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                          <p className="pt-2">
                            {t.form_qr_example}
                          </p>
                        </div>
                      </details>
                    </div>
                  </details>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t.form_disclaimer_label}
                  </label>
                  <textarea
                    value={project.disclaimer || ''}
                    onChange={(e) => setProject(prev => ({ ...prev, disclaimer: e.target.value }))}
                    rows={4}
                    className="block w-full rounded-lg border-gray-300 shadow-sm
                             focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.disclaimer_placeholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isValid || saving}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent
             rounded-lg text-white font-medium ${
               !isValid || saving
                 ? 'bg-blue-400 cursor-not-allowed'
                 : 'bg-[#4FC3F7] hover:bg-[#29B6F6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4FC3F7]'
             }`}
                >
                  {saving ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    isEditMode ? t.form_submit_edit : t.form_submit_create
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 md:mt-0">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t.preview}</h3>
            <div className="sticky top-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <WheelOfFortune 
                  prizes={project.prizes} 
                  wheelId="" 
                  noGoogleReview={project.no_google_review}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal
          youtubeId={ytId}
          onClose={dismissTutorial}
          language={uiLanguage}
          marking={marking}
        />
      )}
    </div>
  );
}

// Tutorial Modal Component
function TutorialModal({
  youtubeId,
  onClose,
  language = 'en',
  marking = false,
}: {
  youtubeId: string;
  onClose: () => void;
  language?: 'hu' | 'en' | string;
  marking?: boolean;
}) {
  const title = language === 'hu' ? 'Gyors útmutató (2 perc)' : 'Quick Start (2 minutes)';
  const cta   = language === 'hu' ? 'Kezdjük!' : "Let's start";
  const skip  = language === 'hu' ? 'Később nézem meg' : "I'll watch later";
  const saving = language === 'hu' ? 'Mentés…' : 'Saving…';
  const description = language === 'hu'
    ? 'Rövid videós útmutató a kerék-projekt létrehozásához.'
    : 'Short video guide for creating a wheel project.';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !marking) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, marking]);

  useEffect(() => {
    const el = document.querySelector('[role="dialog"]') as HTMLElement | null;
    el?.focus();
  }, []);

  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&controls=1&playsinline=1`;

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
      aria-describedby="tutorial-desc"
      className="fixed inset-0 z-[999] flex items-center justify-center"
      tabIndex={-1}
    >
      <p id="tutorial-desc" className="sr-only">{description}</p>

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={marking ? undefined : onClose}
      />

      <div className="relative w-[calc(100%-2rem)] max-w-3xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20"
             style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)' }}>
          <h3 id="tutorial-title" className="text-xl sm:text-2xl font-semibold text-gray-900">
            {title}
          </h3>
          <button
            onClick={marking ? undefined : onClose}
            disabled={marking}
            aria-label="Close"
            className={`p-2 rounded-lg text-gray-500 transition ${marking ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700 hover:bg-white/60'}`}
          >
            ✕
          </button>
        </div>

        <div className="bg-white">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={src}
              title="Tutorial video"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6 bg-white">
          <button
            onClick={onClose}
            disabled={marking}
            className={`inline-flex items-center px-8 py-4 rounded-xl text-white font-semibold shadow-lg transition ${marking ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
            style={{ backgroundColor: '#4FC3F7' }}
          >
            {marking ? saving : cta}
          </button>
          <button
            onClick={onClose}
            disabled={marking}
            className="text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {skip}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}