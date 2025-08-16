import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Building2, Image as ImageIcon, LinkIcon, Palette, MapPin, Phone, Mail, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import BusinessPreviewCard from '../components/BusinessPreviewCard';
import { useBusiness } from '../context/BusinessContext';
import { useLanguage } from '../context/LanguageContext';

// 🔑 Oldal kulcs ehhez a tutorialhoz
const TUTORIAL_PAGE_KEY = 'profile' as const;

// 🎬 YouTube videók nyelv szerint
const YT_BY_LANG: Record<string, string> = {
  hu: 'dAYlzPlOc8s',           // HU
  default: 'ECSJQlBOqNE',      // EN/egyéb
};

// 🎯 Videó kezdési idő (másodpercben)
const START_AT_BY_LANG: Record<string, number> = {
  hu: 47,       // magyar 0:47
  default: 67,  // angol 1:07
};

// Segéd: visszaadja a megfelelő YouTube ID-t
const getYoutubeId = (lang?: string) => (lang === 'hu' ? YT_BY_LANG.hu : YT_BY_LANG.default);

// localStorage kulcs névterezése user+page szerint
const seenKey = (userId?: string) => `tutorial_seen_${TUTORIAL_PAGE_KEY}_${userId ?? 'anon'}`;

// ‼️ put this near the top of the file, above the component:
const GOOGLE_REVIEW_LINK =
  /^https:\/\/g\.page\/r\/[A-Za-z0-9_-]+\/review$/;

// ——— tutorial_views "lusta" létrehozás + jelölés ———
const ensureTutorialRow = async (pageKey: 'wheels' | 'profile') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  try {
    await supabase
      .from('tutorial_views')
      .upsert(
        { user_id: user.id, page_key: pageKey, viewed: false, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,page_key', ignoreDuplicates: true }
      );
  } catch (e) {
    console.error('tutorial_views upsert (ensure) failed', e);
  }
};

const markTutorialViewed = async (pageKey: 'wheels' | 'profile') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  console.log('[Tutorial] 🧪 Marking tutorial as viewed for:', pageKey);

  const { error } = await supabase
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

  if (error) {
    console.error('[Tutorial] ❌ DB update error:', error);
  } else {
    console.log('[Tutorial] ✅ DB update successful');
  }
};

const businessProfileTranslations = {
  en: {
    title: "Business Profile",
    required_section: "Required Information",
    name: "Business Name",
    logo: "Logo Image",
    banner: "Banner Image",
    link: "Google Review Link",
    how_to: "How to grab your Google Review Link (step-by-step):",
    contact_section: "Contact Info & Description",
    address: "Business Address (optional)",
    phone: "Phone Number (optional)",
    email: "Contact Email (optional)",
    description: "Business Description (optional)",
    placeholder_address: "Enter your business address",
    placeholder_phone: "+1 (555) 123-4567",
    placeholder_email: "contact@yourbusiness.com",
    placeholder_description: "Tell customers about your business...",
    save: "Save Profile",
    no_business_title: "No Business Selected",
    no_business_desc: "You need to select a business before accessing this page.",
    go_to_profile: "Go to Profile",
    preview: "Preview",
    upload_logo: "Upload Logo",
    upload_banner: "Upload Banner",
    logo_size: "Ideal size: 256×256 px",
    banner_size: "Ideal size: 1080×600 px",
    google_link_placeholder: "https://g.page/r/...",
    step1: "Sign in to your Google Business Profile.",
    step2: "Locate the card titled \"Ask for reviews\".",
    step3: "Click \"Share review form\".",
    step4: "Copy the link – it should look like https://g.page/r/XXXXXXXX/review.",
    step5: "If you don't see the card, ensure your profile is verified and you're signed in with the correct Google account.",
    mobile_tip: "Important: you can only copy the Google Review link from a laptop – it doesn't work on mobile."
  },
  hu: {
    title: "Üzleti Profil",
    required_section: "Kötelező adatok",
    name: "Vállalkozás neve",
    logo: "Logó",
    banner: "Borítókép",
    link: "Google értékelési link",
    how_to: "Így találod meg a Google értékelési linkedet (lépésről lépésre):",
    contact_section: "Elérhetőség és leírás",
    address: "Cím (opcionális)",
    phone: "Telefonszám (opcionális)",
    email: "Kapcsolattartó email (opcionális)",
    description: "Leírás a vállalkozásról (opcionális)",
    placeholder_address: "Add meg a vállalkozás címét",
    placeholder_phone: "+36 30 123 4567",
    placeholder_email: "kapcsolat@vallalkozasod.hu",
    placeholder_description: "Mutasd be röviden a vállalkozásod...",
    save: "Profil mentése",
    no_business_title: "Nincs kiválasztott üzlet",
    no_business_desc: "Kérlek válassz ki egy üzletet, mielőtt megnyitnád ezt az oldalt.",
    go_to_profile: "Ugrás a profilhoz",
    preview: "Előnézet",
    upload_logo: "Logó feltöltése",
    upload_banner: "Borítókép feltöltése",
    logo_size: "Ideális méret: 256×256 px",
    banner_size: "Ideális méret: 1080×600 px",
    google_link_placeholder: "https://g.page/r/...",
    step1: "Jelentkezz be a Google Vállalkozásom profilodba.",
    step2: "Keresd meg az \"Értékeléseket kérés\" kártyát.",
    step3: "Kattints a \"Értékelési űrlap megosztása\" gombra.",
    step4: "Másold ki a linket – így kell kinéznie: https://g.page/r/XXXXXXXX/review.",
    step5: "Ha nem látod a kártyát, győződj meg róla, hogy a profilod ellenőrzött és a megfelelő Google fiókkal vagy bejelentkezve.",
    mobile_tip: "Fontos: a Google értékelési linket csak laptopról tudod kimásolni, telefonról nem."
  }
};

interface BusinessProfile {
  id?: string;
  business_name: string;
  logo_url?: string;
  banner_url?: string;
  google_review_link: string;
  primary_color: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export default function BusinessProfilePage() {
  const { selectedBusinessId, setSelectedBusinessId } = useBusiness();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [hasSavedOnce, setHasSavedOnce] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile>({
    business_name: '',
    google_review_link: '',
    primary_color: '#4FC3F7',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [googleReviewLinkError, setGoogleReviewLinkError] = useState<string | null>(null);

  // Tutorial modal states
  const [showTutorial, setShowTutorial] = useState(false);
  const [ytId, setYtId] = useState<string>(getYoutubeId(language));
  const [marking, setMarking] = useState(false);
  const [startAt, setStartAt] = useState<number | null>(null);

  // Versenyhelyzet (race) elleni guardok
  const decidingRef = useRef(false);  // épp döntünk?
  const decidedRef  = useRef(false);  // már megszületett a döntés?

  const t = businessProfileTranslations[language];

  // Egyetlen „döntéshozó" függvény
  const decideTutorial = async (source: 'initial' | 'auth') => {
    if (decidedRef.current || decidingRef.current) {
      console.log('[Tutorial] ⛔ Skip decideTutorial (locked/already decided)', { source });
      return;
    }

    decidingRef.current = true;
    console.log('[Tutorial] 🔎 decideTutorial start', { source });

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Legyen sor a DB-ben, ha van user
      if (user) await ensureTutorialRow(TUTORIAL_PAGE_KEY);

      // 1) localStorage
      const localSeen = localStorage.getItem(seenKey(user?.id)) === 'true';

      // 2) DB (ha van user)
      let viewed = false;
      if (user) {
        const { data, error } = await supabase
          .from('tutorial_views')
          .select('viewed')
          .eq('user_id', user.id)
          .eq('page_key', TUTORIAL_PAGE_KEY)
          .maybeSingle();

        if (error) console.warn('[Tutorial] DB check error:', error);
        viewed = !!data?.viewed;

        // Ha DB szerint már látta, szinkronizáljuk a localStorage-ot
        if (viewed) localStorage.setItem(seenKey(user.id), 'true');
      }

      const shouldShow = !(localSeen || viewed);
      console.log('[Tutorial] ✅ Decision:', { localSeen, viewed, shouldShow, source });

      if (shouldShow) setShowTutorial(true);
    } catch (e) {
      console.warn('[Tutorial] decideTutorial failed, fallback once:', e);
      // Vendég / hiba: ha nincs LS-ben seen, egyszer mutassuk
      if (!localStorage.getItem(seenKey())) setShowTutorial(true);
    } finally {
      decidedRef.current = true;
      decidingRef.current = false;
    }
  };

  // Ha a nyelv változik, frissítjük a videót
  useEffect(() => {
    setYtId(getYoutubeId(language));
  }, [language]);

  // Scroll-lock amíg a modal nyitva van
  useEffect(() => {
    if (showTutorial) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTutorial]);

  // Initial mount → csak döntés (nincs közvetlen setShowTutorial máshonnan)
  useEffect(() => {
    decideTutorial('initial');
    return () => { decidingRef.current = false; }; // safety cleanup
  }, []);

  // Auth state változás → ugyanaz a döntéshozó, nem külön saját logika
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!session?.user) return;
      decideTutorial('auth'); // a guard megfogja a duplikációt
    });
    return () => subscription.unsubscribe();
  }, []);

  // „Láttam" jelölés (bezáráskor)
  const dismissTutorial = async () => {
    console.log('[Tutorial] ❌ Dismissing tutorial...');
    try {
      setMarking(true);
      const { data: { user } } = await supabase.auth.getUser();
      console.log('[Tutorial] 👤 User on dismiss:', user);

      if (user) {
        await markTutorialViewed(TUTORIAL_PAGE_KEY);
        console.log('[Tutorial] ✅ Marked as viewed in DB');
        localStorage.setItem(seenKey(user.id), 'true');
        console.log('[Tutorial] ✅ LocalStorage updated');
      } else {
        localStorage.setItem(seenKey(), 'true');
        console.log('[Tutorial] ⚠️ Guest: localStorage updated only');
      }
    } finally {
      setMarking(false);
      setShowTutorial(false);
      setStartAt(null);
      decidedRef.current = true; // ✔️ ugyanebben a betöltésben többet ne ugorjon fel
      console.log('[Tutorial] 🔚 Tutorial closed');
    }
  };

  // Chat widget implementation
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://agentivehub.com/production.bundle.min.js';
    script.onload = () => {
      if (!document.getElementById('root')) {
        const root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);
      }
      if (window.myChatWidget && typeof window.myChatWidget.load === 'function') {
        window.myChatWidget.load({
          id: '369379f5-2127-41b7-82fe-560764c64d3f', // this ID can be customized
        });
      }
    };
    document.body.appendChild(script);
    
    // Cleanup function to remove script when component unmounts
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 🔐 Fallback
  useEffect(() => {
    if (!selectedBusinessId) {
      (async () => {
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) { setLoading(false); return; }

        const { data, error } = await supabase
          .from('business_profiles')
          .select('id')
          .eq('user_id', user.id)          // 🔑 csak a saját sorok!
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Fallback fetch error:', error.message);
          setLoading(false);
          return;
        }

        if (data?.id) {
          setSelectedBusinessId(data.id);
        } else {
          setLoading(false);               // az új usernek tényleg nincs profilja
        }
      })();
    }
  }, [selectedBusinessId, setSelectedBusinessId]); // ← hozzáadtuk setSelectedBusinessId-t is

  useEffect(() => {
    if (selectedBusinessId) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [selectedBusinessId]);

  const loadProfile = async () => {
    try {
      if (!selectedBusinessId) {
        throw new Error('No business selected');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', selectedBusinessId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Override the loaded primary color with our fixed color
        setProfile({
          ...data,
          primary_color: '#4FC3F7'
        });
      } else {
        setProfile({
          business_name: '',
          google_review_link: '',
          primary_color: '#4FC3F7',
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : 'Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner'
  ) => {
    try {
      if (!selectedBusinessId) {
        throw new Error('No business selected');
      }

      const file = event.target.files?.[0];
      if (!file) return;

      setSaving(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${selectedBusinessId}-${Date.now()}.${fileExt}`;
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('business-assets')
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates = {
        ...(type === 'logo' ? { logo_url: urlData.publicUrl } : { banner_url: urlData.publicUrl }),
      };

      const { error: updateError } = await supabase
        .from('business_profiles')
        .upsert({
          ...profile,
          ...updates,
          id: selectedBusinessId,
          user_id: user.id,
        });

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, ...updates }));
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading image');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // 1) make sure it isn't empty
    if (!(profile.google_review_link || '').trim()) {
      setSaving(false);
      setGoogleReviewLinkError('The Google-review link can\'t be empty. Paste the full link that ends with "/review".');
      return;
    }

    // 2) make sure it matches the exact "g.page/r/…/review" format
    if (!GOOGLE_REVIEW_LINK.test(profile.google_review_link.trim())) {
      setSaving(false);
      setGoogleReviewLinkError('That isn\'t a valid Google "Leave a review" link. It must look like:\nhttps://g.page/r/XXXXXXXX/review');
      return;
    }
    
    setGoogleReviewLinkError(null); // clear any errors
    
    try {
      if (!selectedBusinessId) {
        throw new Error('No business selected');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existingProfile, error: checkError } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('id', selectedBusinessId)
        .maybeSingle();

      if (checkError) throw checkError;

      // Ensure primary color is fixed
      const profileToSave = {
        ...profile,
        primary_color: '#4FC3F7'
      };

      let error;
      if (existingProfile) {
        const { error: updateError } = await supabase
          .from('business_profiles')
          .update({
            ...profileToSave,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedBusinessId)
          .select();
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('business_profiles')
          .insert({
            ...profileToSave,
            id: selectedBusinessId,
            user_id: user.id,
          })
          .select();
        error = insertError;
      }

      if (error) throw error;
      
      if (!hasSavedOnce) {
        setHasSavedOnce(true);
        navigate('/wheels');
      }
      setSuccess('Profile saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!selectedBusinessId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{t.no_business_title}</h2>
          <p className="text-gray-600 mb-6">
            {t.no_business_desc}
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.go_to_profile}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white shadow-lg rounded-lg p-6">
              {/* --- Címsor + Videó gomb --- */}
              <div className="mb-6 flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>

                {/* ✅ 2. Gombnyomásra induló videó */}
                <button
                  type="button"
                  onClick={() => {
                    const s = language === 'hu' ? START_AT_BY_LANG.hu : START_AT_BY_LANG.default;
                    console.log('[Tutorial] 🎬 Manual open clicked. Setting startAt to:', s);
                    setStartAt(s);
                    setShowTutorial(true);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-[#4FC3F7] text-white rounded-lg hover:bg-[#42b1e0] transition-colors"
                >
                  🎥 {language === 'hu' ? '2 perces útmutató' : '2-min quick guide'}
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Required Fields Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">{t.required_section}</h3>
                  
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.name}
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={profile.business_name}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, business_name: e.target.value }))
                        }
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.logo}
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      {profile.logo_url && (
                        <img
                          src={profile.logo_url}
                          alt="Logo preview"
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300
                                      rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white
                                      hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                        <ImageIcon className="h-5 w-5 mr-2 text-gray-400" />
                        {t.upload_logo}
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'logo')}
                        />
                      </label>
                      <span className="text-sm text-gray-500">{t.logo_size}</span>
                    </div>
                  </div>

                  {/* Banner Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.banner}
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      {profile.banner_url && (
                        <img
                          src={profile.banner_url}
                          alt="Banner preview"
                          className="h-12 w-24 rounded-lg object-cover"
                        />
                      )}
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300
                                      rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white
                                      hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                        <ImageIcon className="h-5 w-5 mr-2 text-gray-400" />
                        {t.upload_banner}
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'banner')}
                        />
                      </label>
                      <span className="text-sm text-gray-500">{t.banner_size}</span>
                    </div>
                  </div>

{/* Google Review Link */}
<div>
  <label className="block text-sm font-medium text-gray-700">
    {t.link}
  </label>
  <div className="mt-1 relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <LinkIcon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="url"
      required
      value={profile.google_review_link}
      onChange={(e) => {
        setProfile((prev) => ({ ...prev, google_review_link: e.target.value }));
        setGoogleReviewLinkError(null); // clear error on typing
      }}
      className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
               focus:ring-blue-500 focus:border-blue-500"
      placeholder={t.google_link_placeholder}
    />
  </div>
  {googleReviewLinkError && (
    <p className="mt-1 text-sm text-red-600">{googleReviewLinkError}</p>
  )}
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 leading-relaxed">
    <p className="font-semibold mb-2">{t.how_to}</p>
    <ol className="list-decimal list-inside space-y-1">
      <li>
        {language === 'en' ? (
          <>
            Sign in to your{' '}
            <a
              href="https://www.google.com/business"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Google Business Profile
            </a>.
          </>
        ) : (
          <>
            {t.step1}{' '}
            <a
              href="https://www.google.com/business"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Google Vállalkozásom
            </a>.
          </>
        )}
      </li>
      <li>{t.step2}</li>
      <li>{t.step3}</li>
      <li><code>https://g.page/r/XXXXXXXX/review</code> {t.step4}</li>
      <li>{t.step5}</li>
    </ol>
    <p className="mt-4 text-xs text-gray-500 italic">{t.mobile_tip}</p>
  </div>
</div>

                  {/* Primary Color section removed */}
                </div>

                {/* Optional Fields Section */}
                <div className="pt-6 space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">{t.contact_section}</h3>
                  
                  {/* Business Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.address}
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={profile.address || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, address: e.target.value }))
                        }
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t.placeholder_address}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.phone}
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t.placeholder_phone}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.email}
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t.placeholder_email}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t.description}
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <Info className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        value={profile.description || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, description: e.target.value }))
                        }
                        rows={4}
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t.placeholder_description}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent
                             rounded-lg text-white font-medium ${
                               saving
                                 ? 'bg-[#b2e4fa] cursor-not-allowed'
                                 : 'bg-[#4FC3F7] hover:bg-[#42b1e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4FC3F7]'
                             }`}
                >
                  {saving ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    t.save
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8 md:mt-0">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t.preview}</h3>
            <div className="sticky top-8">
              <BusinessPreviewCard
                name={profile.business_name}
                logoUrl={profile.logo_url}
                bannerUrl={profile.banner_url}
                reviewLink={profile.google_review_link}
                primaryColor="#4FC3F7" // Fixed primary color
                address={profile.address}
                phone={profile.phone}
                email={profile.email}
                description={profile.description}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal
          youtubeId={ytId}
          onClose={dismissTutorial}
          language={language}
          marking={marking}
          startAt={startAt ?? 0}
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
  startAt = 0,
}: { 
  youtubeId: string; 
  onClose: () => void; 
  language?: 'hu'|'en'|string;
  marking?: boolean;
  startAt?: number;
}) {

  // Szövegek
  const title = language === 'hu' ? 'Gyors útmutató (2 perc)' : 'Quick Start (2 minutes)';
  const cta   = language === 'hu' ? 'Kezdjük!' : 'Let\'s start';
  const skip  = language === 'hu' ? 'Később nézem meg' : 'I\'ll watch later';
  const saving = language === 'hu' ? 'Mentés…' : 'Saving…';
  const description = language === 'hu' 
    ? 'Rövid videós útmutató a profil oldal használatához.' 
    : 'Short video guide for the profile page.';

  // Esc és overlay click
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !marking) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, marking]);

  // Fókuszkezelés - fókusz a modalra megnyitáskor
  useEffect(() => {
    const modalElement = document.querySelector('[role="dialog"]') as HTMLElement;
    if (modalElement) {
      modalElement.focus();
    }
  }, []);

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    controls: '1',
    playsinline: '1',
    ...(startAt > 0 ? { start: String(startAt) } : {}),
  });

  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;

  // ✅ 4. Modal iframe logging
  console.log('[Tutorial] 🖥️ Rendering modal with video:', {
    youtubeId,
    startAt,
    src,
  });

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
      aria-describedby="tutorial-desc"
      className="fixed inset-0 z-[999] flex items-center justify-center"
      tabIndex={-1}
    >
      {/* Screen reader description */}
      <p id="tutorial-desc" className="sr-only">
        {description}
      </p>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={marking ? undefined : onClose}
      />

      {/* Card */}
      <div className="relative w-[calc(100%-2rem)] max-w-3xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Fejléc */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20"
             style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)' }}>
          <h3 
            id="tutorial-title"
            className="text-xl sm:text-2xl font-semibold text-gray-900" 
            style={{ fontFamily: 'Alexandria, sans-serif' }}
          >
            {title}
          </h3>
          <button
            onClick={marking ? undefined : onClose}
            disabled={marking}
            aria-label="Close"
            className={`p-2 rounded-lg text-gray-500 transition ${
              marking 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:text-gray-700 hover:bg-white/60'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Videó */}
        <div className="bg-white">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-none"
              src={src}
              title="Tutorial video"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* Action row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6 bg-white">
          <button
            onClick={onClose}
            disabled={marking}
            className={`inline-flex items-center px-8 py-4 rounded-xl text-white font-semibold shadow-lg transition ${
              marking 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:brightness-110'
            }`}
            style={{ backgroundColor: '#4FC3F7', fontFamily: 'Alexandria, sans-serif' }}
          >
            {marking ? saving : cta}
          </button>
          <button
            onClick={onClose}
            disabled={marking}
            className="text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {skip}
          </button>
        </div>
      </div>
    </div>
  );

  // Portal a stabil rétegződésért
  return createPortal(modalContent, document.body);
}