import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Eye, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import html2canvas from 'html2canvas';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';

// Language type definition
type Language = 'en' | 'hu';

// 🔑 Tutorial page_key ehhez az oldalhoz
const PAGE_KEY = 'qr' as const;

// user+page alapú localStorage kulcs
const seenKey = (uid?: string) => `tutorial_seen_${PAGE_KEY}_${uid ?? 'anon'}`;

// ——— tutorial_views "lusta" létrehozás (csak ha nincs) ———
const ensureTutorialRow = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await supabase
      .from('tutorial_views')
      .upsert(
        { user_id: user.id, page_key: PAGE_KEY }, // viewed/updated_at -> DB default
        { onConflict: 'user_id,page_key', ignoreDuplicates: true, returning: 'minimal' }
      );
  } catch (e) {
    console.error('tutorial_views upsert (ensure) failed', e);
  }
};

const markTutorialViewed = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  try {
    await supabase
      .from('tutorial_views')
      .upsert(
        {
          user_id: user.id,
          page_key: PAGE_KEY,
          viewed: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,page_key',
          returning: 'minimal',
        }
      );
  } catch (e) {
    console.error('tutorial_views upsert (mark viewed) failed', e);
  }
};

// 🔑 YouTube videók nyelv szerint (HU / EN)
const YT_BY_LANG: Record<string, string> = {
  hu: 's0x6GXXx3Hk',   // magyar
  default: '2W-jVt9CRAA', // minden más
};

const getYoutubeId = (lang?: string) =>
  lang === 'hu' ? YT_BY_LANG.hu : YT_BY_LANG.default;

export const translations = {
  en: {
    qrpage: {
      title: 'QR Code for customer reviews',
      preview_button: 'Preview Experience',
      download_button: 'Download QR Code',
      fallback_prize: 'Spin and win!',
      instructions_title: 'How to use this QR code:',
      instructions: {
        step1: 'Download the QR code image above',
        step2: 'Print it or place it digitally where customers can easily scan it',
        step3: 'Use it in strategic locations where customers spend time or wait, such as:',
        list: {
          menus: 'Menus (physical or digital)',
          stands: 'Tabletop signs or acrylic stands',
          stickers: 'Stickers on tables or near the checkout counter',
          reception: 'Reception desks, hotel lobbies, or salon mirrors',
          packaging: 'To-go packaging or flyers',
          bathroom: 'Bathroom doors or walls for high visibility',
        },
        step4: 'Encourage scanning with a short call-to-action:',
        cta_example: '"Would you leave us a review for a chance to win a prize?"',
        step5: "Customers scan, leave a review, and instantly see what they've won",
        step6: 'You track reviews and redemptions in your dashboard',
      },
      direct_link_label: 'Direct Link:',
      loading: 'QR Code not available',
      error_message: 'Unable to load QR code',
      back_to_projects: 'Back to Projects',
      helper_section: {
        title: "💡 A little help for a smoother experience",
        paragraph1: "Collecting reviews and attracting new customers is key – we're on the same page.",
        paragraph2: "But when you're full of guests, service is buzzing, and someone gets stuck in the 'Spin & Win' experience... well, that can be tricky.",
        paragraph3: "Plus, every phone is different, and it's not always clear where to tap.",
        paragraph4: "That's why we've created a few downloadable guides you can hand out or display at the counter:",
        buttons: {
          bw_guide: "Guide (B/W)",
          color_guide: "Guide (Color)",
          flowchart: "Flowchart"
        }
      }
    },
  },
  hu: {
    qrpage: {
      title: 'QR-kód vásárlói értékelésekhez',
      preview_button: 'Élmény előnézete',
      download_button: 'QR-kód letöltése',
      fallback_prize: 'Pörgess és nyerj!',
      instructions_title: 'Hogyan használd ezt a QR-kódot?',
      instructions: {
        step1: 'Töltsd le a fenti QR-kódot',
        step2: 'Nyomtasd ki vagy helyezd el digitálisan jól látható helyre',
        step3: 'Helyezd ki stratégiai pontokra, ahol az ügyfelek időt töltenek, pl.:',
        list: {
          menus: 'Étlapokon (fizikai vagy digitális)',
          stands: 'Asztali tartók vagy plexi állványok',
          stickers: 'Matricák az asztalokon vagy a kasszánál',
          reception: 'Recepciós pultok, szállodalobbi vagy szépségszalon tükrök',
          packaging: 'Elviteles csomagolás vagy szórólap',
          bathroom: 'Mosdóajtók vagy falak – jól látható helyek',
        },
        step4: 'Bátorítsd az olvasót egy rövid felhívással:',
        cta_example: '„Értékelnél minket egy nyereményért?"',
        step5: 'Az ügyfél szkennel, értékel, és azonnal látja, mit nyert',
        step6: 'Te pedig nyomon követed az értékeléseket és a nyereményeket a vezérlőpulton',
      },
      direct_link_label: 'Közvetlen link:',
      loading: 'A QR-kód nem elérhető',
      error_message: 'Nem sikerült betölteni a QR-kódot',
      back_to_projects: 'Vissza a projektekhez',
      helper_section: {
        title: "💡 Egy kis segítség a zökkenőmentes élményhez",
        paragraph1: "Az értékelések gyűjtése és az új vendégek bevonzása kulcsfontosságú – ebben egyetértünk.",
        paragraph2: "De amikor tele vagytok, pörög a kiszolgálás, és épp valaki elakad a 'Spin & Win' élmény közben… nos, az tud kellemetlen lenni.",
        paragraph3: "Ráadásul minden telefon más, és nem mindig egyértelmű, mit hol kell megnyomni.",
        paragraph4: "Ezért készítettünk nektek pár letölthető segítséget, amit odaadhattok a vendégeknek vagy kihelyezhettek a pultnál:",
        buttons: {
          bw_guide: "Útmutató (ff)",
          color_guide: "Útmutató (színes)",
          flowchart: "Folyamatábra"
        }
      }
    },
  },
};

// Get current translation based on language
const getCurrentTranslation = (language: Language) => translations[language];

interface WheelProject {
  id: string;
  name: string;
  description: string | null;
  language?: Language;
}

interface BusinessProfile {
  business_name: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export default function QRCodePage() {
  const { id } = useParams();
  const [project, setProject] = useState<WheelProject | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const { language } = useLanguage();
  const qrRef = useRef<HTMLDivElement>(null);

  // Video tutorial states
  const [showVideo, setShowVideo] = useState(false);
  const [ytId, setYtId] = useState<string>(getYoutubeId(language));

  // Get translations
  const t = getCurrentTranslation(language);

  // Update YouTube video ID when language changes
  useEffect(() => {
    setYtId(getYoutubeId(language));
  }, [language]);

  // ESC key handler for modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { 
      if (e.key === 'Escape' && showVideo) dismissVideo(); 
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showVideo]);

  // Automatikus felugrás (első megnyitáskor) DB-checkkel
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // 1) biztosítsuk, hogy legyen sor
        if (user) await ensureTutorialRow();

        // 2) ha localStorage szerint már látta, kész
        const localSeen = localStorage.getItem(seenKey(user?.id)) === 'true';
        if (localSeen || cancelled) return;

        // 3) ha be van jelentkezve: DB alapján döntsünk
        if (user) {
          const { data, error } = await supabase
            .from('tutorial_views')
            .select('viewed')
            .eq('user_id', user.id)
            .eq('page_key', PAGE_KEY)
            .maybeSingle();

          if (!cancelled) {
            if (error || !data || data.viewed === false) {
              setShowVideo(true);
            } else {
              localStorage.setItem(seenKey(user.id), 'true');
            }
          }
        } else {
          // 4) vendég: csak localStorage
          if (!cancelled) setShowVideo(true);
        }
      } catch (e) {
        console.warn('QR video tutorial check failed', e);
        if (!cancelled && localStorage.getItem(seenKey()) !== 'true') setShowVideo(true);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  // Login után se ugorjon fel feleslegesen
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      if (!session?.user) return;

      // ha localStorage-ben már látott, nincs teendő
      if (localStorage.getItem(seenKey(session.user.id)) === 'true') return;

      // DB check
      try {
        await ensureTutorialRow();

        const { data } = await supabase
          .from('tutorial_views')
          .select('viewed')
          .eq('user_id', session.user.id)
          .eq('page_key', PAGE_KEY)
          .maybeSingle();

        if (!data || data.viewed === false) setShowVideo(true);
        else localStorage.setItem(seenKey(session.user.id), 'true');
      } catch (e) {
        console.warn('QR tutorial onAuthStateChange check failed', e);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Bezáráskor jelöld látottnak DB-ben is
  const dismissVideo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await markTutorialViewed(); // ✅ DB: viewed=true
        localStorage.setItem(seenKey(user.id), 'true'); // ✅ cache
      } else {
        localStorage.setItem(seenKey(), 'true');
      }
    } catch {
      localStorage.setItem(seenKey(), 'true');
    } finally {
      setShowVideo(false);
    }
  };

  // Helper function to get the correct guide URL based on language
  const getGuideUrl = (type: 'bw' | 'color' | 'flowchart') => {
    if (language === 'hu') {
      if (type === 'bw') return 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/instrukciok-ff.png';
      if (type === 'color') return 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/instrukciok-sz.png';
      return 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/folyamatabra.png';
    } else {
      if (type === 'bw') return 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/guide-en-bw.png';
      if (type === 'color') return 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/guide-en-colored.png';
      return 'https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/flowchart-en.png';
    }
  };

  // Download function for guide images - Improved version with fetch + Blob
  const downloadFromUrl = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl); // Cleanup
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Improved useEffect with id guard
  useEffect(() => {
    if (!id) {
      setError('Missing project id');
      setLoading(false);
      return;
    }
    loadData();
  }, [id]);

  // Improved useEffect for converting logo URL to base64
  useEffect(() => {
    const fetchLogoAsBase64 = async () => {
      if (!business?.logo_url) return;
      
      setLogoLoading(true);
      
      try {
        const res = await fetch(business.logo_url);
        
        if (!res.ok) {
          throw new Error('Failed to fetch logo');
        }
        
        const blob = await res.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setLogoBase64(reader.result as string);
          } else {
            console.warn('Logo base64 conversion failed.');
          }
          setLogoLoading(false);
        };
        reader.onerror = () => {
          console.error('FileReader error while loading logo');
          setLogoLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error converting logo to base64:', err);
        setLogoLoading(false);
      }
    };

    fetchLogoAsBase64();
  }, [business]);

  const loadData = async () => {
    try {
      // Load wheel project
      const { data: projectData, error: projectError } = await supabase
        .from('wheel_projects')
        .select('id, name, description, user_id, language')
        .eq('id', id)
        .maybeSingle();

      if (projectError) throw projectError;
      if (!projectData) throw new Error('Project not found');

      setProject(projectData);

      // Load business profile with additional fields
      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('business_name, logo_url, banner_url, address, phone, email, description')
        .eq('user_id', projectData.user_id)
        .limit(1);

      if (businessError) throw businessError;
      if (!businessData || businessData.length === 0) throw new Error('Business profile not found');

      setBusiness(businessData[0]);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Error loading QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!qrRef.current || !project) return;

    try {
      const canvas = await html2canvas(qrRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading QR code:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </Layout>
    );
  }

  if (error || !project || !business) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.qrpage.loading}</h1>
            <p className="text-gray-600 mb-6">{error || t.qrpage.error_message}</p>
            <Link
              to="/wheels"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t.qrpage.back_to_projects}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const qrUrl = `${window.location.origin}/review/${project.id}`;

  return (
    <Layout>
      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600">{t.qrpage.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/wheels/${project.id}`}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg
                         hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-5 h-5 mr-2" />
                {t.qrpage.preview_button}
              </Link>
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                className="inline-flex items-center px-4 py-2 bg-[#4FC3F7] text-white rounded-lg hover:bg-[#46B5E5] transition-colors"
              >
                🎥 {language === 'hu' ? '2 perces útmutató' : '2-min quick guide'}
              </button>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col items-center">
                {/* Business Logo */}
                {business.logo_url && (
                  <img
                    src={business.logo_url}
                    alt={business.business_name}
                    className="w-16 h-16 rounded-lg object-cover mb-4"
                  />
                )}

                {/* QR Code */}
                <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-md">
                  {logoLoading ? (
                    <div className="flex items-center justify-center w-64 h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                  ) : business.logo_url && !logoBase64 ? (
                    <QRCodeSVG
                      value={qrUrl}
                      size={256}
                      level="H"
                      includeMargin
                    />
                  ) : logoBase64 ? (
                    <QRCodeSVG
                      value={qrUrl}
                      size={256}
                      level="H"
                      includeMargin
                      imageSettings={{
                        src: logoBase64,
                        height: 24,
                        width: 24,
                        excavate: true,
                      }}
                    />
                  ) : (
                    <QRCodeSVG
                      value={qrUrl}
                      size={256}
                      level="H"
                      includeMargin
                    />
                  )}
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="mt-6 inline-flex items-center px-6 py-3 bg-[#4FC3F7] text-white rounded-lg
                           font-medium hover:bg-[#46B5E5] transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {t.qrpage.download_button}
                </button>

                {/* Helper Section */}
                <div className="mt-10 text-center max-w-2xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.qrpage.helper_section.title}</h3>
                  <p className="text-gray-700 mb-2">{t.qrpage.helper_section.paragraph1}</p>
                  <p className="text-gray-700 mb-2">{t.qrpage.helper_section.paragraph2}</p>
                  <p className="text-gray-700 mb-2">{t.qrpage.helper_section.paragraph3}</p>
                  <p className="text-gray-700 mb-4">{t.qrpage.helper_section.paragraph4}</p>
                  
                  {/* Guide Buttons */}
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {/* Fekete-fehér útmutató */}
                    <button
                      onClick={() => downloadFromUrl(getGuideUrl('bw'), 'Guide-BW.png')}
                      className="inline-flex items-center px-4 py-2 bg-[#4FC3F7] text-white rounded-lg hover:bg-[#46B5E5] transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {t.qrpage.helper_section.buttons.bw_guide}
                    </button>

                    {/* Színes útmutató */}
                    <button
                      onClick={() => downloadFromUrl(getGuideUrl('color'), 'Guide-Color.png')}
                      className="inline-flex items-center px-4 py-2 bg-[#4FC3F7] text-white rounded-lg hover:bg-[#46B5E5] transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {t.qrpage.helper_section.buttons.color_guide}
                    </button>

                    {/* Folyamatábra */}
                    <button
                      onClick={() => downloadFromUrl(getGuideUrl('flowchart'), 'Guide-Flowchart.png')}
                      className="inline-flex items-center px-4 py-2 bg-[#4FC3F7] text-white rounded-lg hover:bg-[#46B5E5] transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {t.qrpage.helper_section.buttons.flowchart}
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 space-y-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{t.qrpage.instructions_title}</h3>
                  <ol className="text-gray-600 space-y-2 text-left list-decimal list-inside">
                    <li>{t.qrpage.instructions.step1}</li>
                    <li>{t.qrpage.instructions.step2}</li>
                    <li>
                      {t.qrpage.instructions.step3}
                      <ul className="list-disc list-inside mt-1 ml-5 space-y-1 text-gray-600">
                        <li>{t.qrpage.instructions.list.menus}</li>
                        <li>{t.qrpage.instructions.list.stands}</li>
                        <li>{t.qrpage.instructions.list.stickers}</li>
                        <li>{t.qrpage.instructions.list.reception}</li>
                        <li>{t.qrpage.instructions.list.packaging}</li>
                        <li>{t.qrpage.instructions.list.bathroom}</li>
                      </ul>
                    </li>
                    <li>
                      {t.qrpage.instructions.step4} <em>{t.qrpage.instructions.cta_example}</em>
                    </li>
                    <li>{t.qrpage.instructions.step5}</li>
                    <li>{t.qrpage.instructions.step6}</li>
                  </ol>
                </div>

                {/* URL Display */}
                <div className="mt-8 w-full">
                  <p className="text-sm font-medium text-gray-700 mb-2">{t.qrpage.direct_link_label}</p>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg break-all">
                    <span className="text-gray-600 text-sm">{qrUrl}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Tutorial Modal */}
      {showVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] flex items-center justify-center"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={dismissVideo}
          />

          {/* Card */}
          <div className="relative w-[calc(100%-2rem)] max-w-3xl rounded-2xl shadow-2xl overflow-hidden bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">
                {language === 'hu' ? 'Gyors útmutató' : 'Quick Start'}
              </h3>
              <button
                onClick={dismissVideo}
                aria-label="Close"
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&controls=1&playsinline=1`}
                title="Tutorial video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="px-4 py-4 text-right">
              <button
                onClick={dismissVideo}
                className="inline-flex items-center px-4 py-2 bg-[#4FC3F7] text-white rounded-lg hover:bg-[#46B5E5] transition-colors"
              >
                {language === 'hu' ? 'Értem' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}