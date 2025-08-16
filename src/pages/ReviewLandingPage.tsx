import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, MapPin, Phone, Mail, Download, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import { supabase } from '../lib/supabaseClient';
import { logFlowEvent } from '../lib/eventTracking';
import WheelOfFortune from '../components/WheelOfFortune';
import EmailCollectionForm from '../components/EmailCollectionForm';
import DisclaimerText from '../components/DisclaimerText';
import BusinessPreviewCard from '../components/BusinessPreviewCard';
import { useTranslation, type Language } from '../lib/translations';

// Ezeken a domaineken NE legyen perzisztencia
const NO_PERSIST_PATTERNS = [
  /webcontainer-api\.io/i,   // a megadott fejlesztői linkcsalád
  /localhost/i,              // opcionális: helyi fejlesztés
  /127\.0\.0\.1/i            // opcionális
];

// true, ha a jelenlegi URL hostja vagy teljes URL-je illeszkedik bármely mintára
const noPersist = NO_PERSIST_PATTERNS.some(re => re.test(location.hostname) || re.test(location.href));

// helper a storage kulcshoz
const completedKey = (id: string) => `r2r-completed-${id}`;

interface BusinessProfile {
  id: string;
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

interface WheelProject {
  id: string;
  user_id: string;
  name: string;
  disclaimer?: string;
  language: Language;
  no_google_review?: boolean;
  prizes: Array<{
    label: string;
    probability: number;
    starred: boolean;
  }>;
  expires_in_days: number | null;
}

export default function ReviewLandingPage() {
  const { wheelId } = useParams();
  const wheelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const schedulingRef = useRef(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [project, setProject] = useState<WheelProject | null>(null);
  const [showWheel, setShowWheel] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);
  const [emailSaved, setEmailSaved] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [trialExists, setTrialExists] = useState(true);
  const [rewardCode, setRewardCode] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // Get translations based on project language
  const t = useTranslation(project?.language || 'en');

  // "Starred" nyeremény címkéje (ha van)
  const getStarredPrize = () =>
    project?.prizes?.find((p) => p.starred)?.label ?? null;

  const starredPrize = getStarredPrize();

  // Egységes „scrollOnce" segédfüggvény
  const scrollToTopOf = (el: HTMLElement, offset = 0, behavior: ScrollBehavior = 'smooth') => {
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior });
  };

  useEffect(() => {
    if (wheelId) logFlowEvent(wheelId, 'qr_scan');
  }, [wheelId]);

  useEffect(() => {
    if (showWheel && wheelId) logFlowEvent(wheelId, 'game_started');
  }, [showWheel, wheelId]);

  useEffect(() => {
    if (!showWheel || hasScrolledRef.current) return;

    const isMobile = window.innerWidth <= 768;
    if (!isMobile || !logoRef.current) return;

    hasScrolledRef.current = true;

    // kis késleltetés, hogy a layout/képek stabilizálódjanak
    const timer = setTimeout(() => {
      const y = logoRef.current!.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 300);

    return () => clearTimeout(timer);
  }, [showWheel]);

  useEffect(() => {
    loadData();
  }, [wheelId]);
  
  // A) Event log for review prompt
  useEffect(() => {
    if (emailSaved && business?.google_review_link && !project?.no_google_review && wheelId) {
      logFlowEvent(wheelId, 'review_prompt_shown');
    }
  }, [emailSaved, business?.google_review_link, project?.no_google_review, wheelId]);

  const loadData = async () => {
    try {
      // 🔁 RESET a wheelId-hez kötött UI state-ekre
      setSelectedPrize(null);
      setEmailSaved(false);
      setRewardCode(null);
      setCompleted(false);
      setShowWheel(false);

      if (!wheelId) {
        setError('Invalid project ID');
        setLoading(false);
        return;
      }

      const { data: wheelData, error: wheelError } = await supabase
        .from('wheel_projects')
        .select(`
          id,
          user_id,
          name,
          prizes,
          disclaimer,
          language,
          no_google_review,
          expires_in_days
        `)
        .eq('id', wheelId.trim())
        .maybeSingle();

      if (wheelError || !wheelData) {
        throw new Error('Failed to load project data');
      }

      setProject(wheelData);

      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', wheelData.user_id)
        .maybeSingle();

      if (businessError || !businessData) {
        throw new Error('Failed to load business data');
      }

      setBusiness(businessData);

      const { data: trialData, error: trialError } = await supabase
        .from('free_trials')
        .select('created_at, trial_days, completed')
        .eq('user_id', wheelData.user_id)
        .maybeSingle();

      if (trialError) throw trialError;

      if (!trialData) {
        setTrialExists(false); // nincs trial rekord → tekintsük aktívnak (előfizetés)
      } else {
        setTrialExists(true);
        
        const trialEnd = new Date(new Date(trialData.created_at).getTime() + (trialData.trial_days ?? 14) * 86400000);
        const now = new Date();
        const isTrialExpired = trialData.completed || now > trialEnd;

        if (isTrialExpired) {
          setError('This review page is no longer active.');
          return;
        }
      }

      // Kerék csak akkor induljon, ha nincs completed flag
      if (wheelId) {
        const raw = noPersist ? null : localStorage.getItem(completedKey(wheelId));
        if (!raw) {
          setShowWheel(true);
        } else {
          setCompleted(true);
          setShowWheel(false);
          try {
            const parsed = JSON.parse(raw);
            if (parsed.prize) setSelectedPrize(parsed.prize);
            if (parsed.emailSaved) setEmailSaved(true);
            if (parsed.rewardCode) setRewardCode(parsed.rewardCode);
          } catch {
            // ignore parse error
          }
        }
      } else {
        setShowWheel(false);
      }
    } catch (err) {
      console.error('Error in loadData:', err);
      setError(err instanceof Error ? err.message : 'Failed to load review page');
    } finally {
      setLoading(false);
    }
  };

  const handleWheelComplete = (prize: string) => {
    if (!wheelId) return;
    
    setSelectedPrize(prize);
    logFlowEvent(wheelId, 'wheel_spin');
    logFlowEvent(wheelId, 'prize_awarded', { prize });

    setCompleted(true);
    if (wheelId && !noPersist) {
      // minimál payload (később bővíthető)
      localStorage.setItem(
        completedKey(wheelId),
        JSON.stringify({ completed: true, prize })
      );
    }

    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00', '#FF4500'],
        startVelocity: 45,
        gravity: 1.2,
        ticks: 400,
        shapes: ['circle', 'square'],
        zIndex: 1000,
      });
    }, 400);
  };

  // A) Review link handler
  const handleOpenReviewLink = () => {
    if (!business?.google_review_link) return;

    // 1) azonnal nyissuk meg (különben popup block jöhet)
    window.open(business.google_review_link, '_blank', 'noopener,noreferrer');

    // 2) event log
    if (wheelId) logFlowEvent(wheelId, 'review_link_clicked');

    // 3) fire-and-forget backend jelzés (ne blokkolja az UI-t)
    try {
      if (wheelId && (userEmail || rewardCode)) {
        void supabase.functions.invoke('mark-review-click', {
          body: {
            wheel_id: wheelId,
            user_email: userEmail ?? undefined,
            reward_code: rewardCode ?? undefined,
            debug: true, // csak ideiglenesen!
          },
        }).then(({ data, error }) => {
          console.log('mark-review-click resp:', { data, error });
        }).catch((e) => console.error('mark-review-click invoke error:', e));
      }
    } catch (e) {
      console.error('mark-review-click invoke error', e);
    }
  };

  const handleDownloadCard = async () => {
    if (!downloadRef.current) return;

    const canvas = await html2canvas(downloadRef.current, {
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imageUrl = canvas.toDataURL('image/png');

    // 💾 Letöltés automatikusan
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = `reward-card-${wheelId}.png`;
    downloadLink.click();

    // 🪟 Kép megnyitása új ablakban
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`<img src="${imageUrl}" style="max-width: 100%;" />`);
    }
  };

  // Calculate expiry date for the warning (using project's expires_in_days)
  const getFormattedExpiryDate = () => {
    const days = project?.expires_in_days ?? 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const localeMap = { en: 'en-US', hu: 'hu-HU', de: 'de-DE' } as const;
    return expiryDate.toLocaleDateString(localeMap[project?.language ?? 'en'], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if ((error && trialExists) || !business || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">This review link is inactive</h1>
          <p className="text-gray-600 mb-6">
            This QR code is no longer active because the trial or subscription has ended.
          </p>
          <a
            href="/pricing"
            className="inline-block bg-[#4FC3F7] hover:bg-[#303F9F] text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200"
          >
            View Upgrade Options
          </a>
        </div>
      </div>
    );
  }

  const defaultBanner = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80';
  const defaultLogo = 'https://placehold.co/200x200?text=' + encodeURIComponent(business.business_name.charAt(0));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner with Logo */}
      <div ref={bannerRef} className="relative aspect-[18/10] max-h-[600px] w-full">
        <div className="absolute inset-0">
          <img
            src={business.banner_url || defaultBanner}
            alt={`${business.business_name} banner`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        </div>

        <div ref={logoRef} className="absolute left-1/2 -bottom-16 -translate-x-1/2">
          <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl bg-white p-2">
            <img
              src={business.logo_url || defaultLogo}
              alt={`${business.business_name} logo`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <div className="relative mt-24 bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              {business.business_name}
            </h1>
            
            {business.description && (
              <p className="text-gray-600 text-center mb-6">{business.description}</p>
            )}

            {(business.address || business.phone || business.email) && (
              <div className="space-y-2 mb-6 text-center">
                {business.address && (
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{business.address}</span>
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span>{business.email}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-8">
              {showWheel && (
                <div ref={wheelRef} className="space-y-8 text-center mt-6 sm:mt-8">

                  {/* ⭐ Starred prize banner — csak pörgetés előtt */}
                  {starredPrize && !selectedPrize && (
                    <div>
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border-2 border-yellow-200 shadow-lg"
                      >
                        <div className="grid grid-cols-[auto,1fr,auto] items-center justify-center gap-1 mb-2">
                          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                          <h3 className="text-xl font-bold text-yellow-800 text-center">
                            {t.reviewHeadline ?? "Today's Top Prize"}
                          </h3>
                          <Sparkles className="w-6 h-6 text-yellow-500" />
                        </div>
                        <p className="text-center text-yellow-700">
                          {t.standachance ?? "Spin the wheel for a chance to win"}
                        </p>
                        <p className="text-center text-2xl font-bold text-yellow-900 mt-2">
                          {starredPrize}
                        </p>
                      </motion.div>

                      {/* Tényleges rés a banner UTÁN (nem növeli a sárga dobozt) */}
                      <div aria-hidden className="h-6 sm:h-6" />
                    </div>
                  )}

                  {!selectedPrize ? (
                    <WheelOfFortune
                      prizes={project.prizes}
                      wheelId={wheelId || ''}
                      userEmail={userEmail || undefined}
                      onComplete={handleWheelComplete}
                      language={project.language}
                      noGoogleReview={project.no_google_review}
                    />
                  ) : !emailSaved ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 shadow-lg"
                      >
                        <h2 className="text-2xl font-bold text-yellow-800 mb-4">
                          {t.congratulations} {t.youWon} {selectedPrize}!
                        </h2>
                        <EmailCollectionForm
                          wheelId={wheelId || ''}
                          prize={selectedPrize}
                          onSuccess={async ({ code, email }) => {
                            setUserEmail(email);
                            setRewardCode(code);
                            setEmailSaved(true);

                            // localStorage update változatlanul:
                            if (wheelId && !noPersist) {
                              try {
                                const raw = localStorage.getItem(completedKey(wheelId));
                                const prev = raw ? JSON.parse(raw) : {};
                                localStorage.setItem(
                                  completedKey(wheelId),
                                  JSON.stringify({ ...prev, emailSaved: true, rewardCode: code })
                                );
                              } catch { /* ignore */ }
                            }

                            // 🔔 Ütemezés hívása (guards + dupla hívás védelem)
                            if (!wheelId || !business?.id || !email) return;
                            if (project?.no_google_review) return;
                            if (schedulingRef.current) return;
                            
                            schedulingRef.current = true;
                            try {
                              const { data, error } = await supabase.functions.invoke('schedule-review-reminder', {
                                body: {
                                  wheel_id: wheelId,
                                  business_id: business.id,
                                  user_email: email,
                                },
                              });
                              if (error) {
                                console.error('schedule-review-reminder error', error);
                              } else {
                                console.log('schedule-review-reminder ok', data);
                              }
                            } catch (err) {
                              console.error('invoke failed', err);
                            } finally {
                              schedulingRef.current = false;
                            }
                          }}
                          language={project.language}
                          businessName={business.business_name}
                          expiresInDays={project.expires_in_days ?? 30}
                        />

                        {/* Separate disclaimer box with gray styling */}
                        {project.disclaimer && (
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4 text-left text-sm text-gray-600 shadow-inner">
                            <DisclaimerText text={project.disclaimer} language={project.language} />
                          </div>
                        )}
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* REVIEW PANEL – felül, brand-es, pulzáló CTA */}
                      {!project?.no_google_review && business.google_review_link && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                          className="
                            relative overflow-hidden
                            rounded-2xl border border-cyan-200/70
                            bg-gradient-to-br from-cyan-50 to-blue-50
                            ring-1 ring-cyan-200/40
                            shadow-[0_10px_40px_-12px_rgba(79,195,247,0.35)]
                            p-6 sm:p-7 text-center
                          "
                        >
                          {/* finom fényfolt a háttérben */}
                          <div
                            className="
                              pointer-events-none absolute inset-0 opacity-40
                              bg-[radial-gradient(1200px_400px_at_50%_-10%,rgba(255,255,255,0.6),transparent)]
                            "
                          />

                          <div className="relative">
                            <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center justify-center gap-2">
                              <Sparkles className="w-5 h-5 text-[#4FC3F7]" />
                              {t.reviewAskTitle}
                            </h4>

                            {/* 5 csillag – társas bizonyíték */}
                            <div className="mt-2 flex justify-center gap-1 text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400" />
                              ))}
                            </div>

                            {/* rövid, barátságos másolat – extra mikromásolat nélkül */}
                            <p
                            className="mt-2 text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: t.reviewAskCopy }}
                             />

                            {/* CTA gomb: gradiens + shimmer + gyűrű */}
                            <motion.button
                              onClick={handleOpenReviewLink}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              animate={{
                                boxShadow: [
                                  '0 0 0 0 rgba(79,195,247,0.45)',
                                  '0 0 0 12px rgba(79,195,247,0)'
                                ]
                              }}
                              transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop' }}
                              className="
                                group relative mt-4 inline-flex items-center justify-center gap-2
                                px-7 py-4 rounded-full font-semibold text-white
                                focus:outline-none focus:ring-4 focus:ring-cyan-200
                                shadow-lg
                              "
                              style={{
                                background:
                                  `linear-gradient(90deg, ${business.primary_color || '#4FC3F7'} 0%, #60a5fa 100%)`
                              }}
                              aria-label={t.openGoogleReviews}
                            >
                              <span
                                className="
                                  pointer-events-none absolute inset-0 rounded-full
                                  before:content-[''] before:absolute before:inset-0
                                  before:-translate-x-full before:bg-gradient-to-r
                                  before:from-transparent before:via-white/40 before:to-transparent
                                  group-hover:before:translate-x-full before:transition-transform before:duration-700
                                "
                              />
                              <Star className="w-5 h-5" />
                              {t.openGoogleReviews}
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* Success card – most alul */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-green-50 p-8 rounded-xl text-center"
                      >
                        <h3 className="text-2xl font-bold text-green-800 mb-4">
                          {t.congratulations}
                        </h3>
                        <p className="text-green-700 text-lg mb-2">
                          {t.youWon} {selectedPrize}
                        </p>
                        
                        <div className="text-center mb-6">
                          <button
                            onClick={handleDownloadCard}
                            className="text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 mx-auto"
                            style={{ backgroundColor: '#4FC3F7' }}
                          >
                            <Download className="w-5 h-5" />
                            {t.downloadYourPrize}
                          </button>
                        </div>
                        
                        <div className="text-green-600" dangerouslySetInnerHTML={{ __html: t.successMessage }} />
                      </motion.div>
                    </>
                  )}
                </div>
              )}

              {/* 3) Fallback when wheel is not shown but completed */}
              {!showWheel && completed && (
                <div className="space-y-8 text-center mt-6 sm:mt-8">
                  {(rewardCode || selectedPrize) ? (
                    <>
                      {/* Review panel first if applicable */}
                      {!project?.no_google_review && business.google_review_link && emailSaved && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                          className="
                            relative overflow-hidden
                            rounded-2xl border border-cyan-200/70
                            bg-gradient-to-br from-cyan-50 to-blue-50
                            ring-1 ring-cyan-200/40
                            shadow-[0_10px_40px_-12px_rgba(79,195,247,0.35)]
                            p-6 sm:p-7 text-center
                          "
                        >
                          {/* finom fényfolt a háttérben */}
                          <div
                            className="
                              pointer-events-none absolute inset-0 opacity-40
                              bg-[radial-gradient(1200px_400px_at_50%_-10%,rgba(255,255,255,0.6),transparent)]
                            "
                          />

                          <div className="relative">
                            <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center justify-center gap-2">
                              <Sparkles className="w-5 h-5 text-[#4FC3F7]" />
                              {t.reviewAskTitle}
                            </h4>

                            {/* 5 csillag – társas bizonyíték */}
                            <div className="mt-2 flex justify-center gap-1 text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400" />
                              ))}
                            </div>

                            {/* rövid, barátságos másolat – extra mikromásolat nélkül */}
                            <p
                             className="mt-2 text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: t.reviewAskCopy }}
                            />

                            {/* CTA gomb: gradiens + shimmer + gyűrű */}
                            <motion.button
                              onClick={handleOpenReviewLink}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              animate={{
                                boxShadow: [
                                  '0 0 0 0 rgba(79,195,247,0.45)',
                                  '0 0 0 12px rgba(79,195,247,0)'
                                ]
                              }}
                              transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop' }}
                              className="
                                group relative mt-4 inline-flex items-center justify-center gap-2
                                px-7 py-4 rounded-full font-semibold text-white
                                focus:outline-none focus:ring-4 focus:ring-cyan-200
                                shadow-lg
                              "
                              style={{
                                background:
                                  `linear-gradient(90deg, ${business.primary_color || '#4FC3F7'} 0%, #60a5fa 100%)`
                              }}
                              aria-label={t.openGoogleReviews}
                            >
                              <span
                                className="
                                  pointer-events-none absolute inset-0 rounded-full
                                  before:content-[''] before:absolute before:inset-0
                                  before:-translate-x-full before:bg-gradient-to-r
                                  before:from-transparent before:via-white/40 before:to-transparent
                                  group-hover:before:translate-x-full before:transition-transform before:duration-700
                                "
                              />
                              <Star className="w-5 h-5" />
                              {t.openGoogleReviews}
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* Success card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-green-50 p-8 rounded-xl text-center"
                      >
                        <h3 className="text-2xl font-bold text-green-800 mb-4">{t.congratulations}</h3>
                        {selectedPrize && (
                          <p className="text-green-700 text-lg mb-2">
                            {t.youWon} {selectedPrize}
                          </p>
                        )}
                        {rewardCode && (
                          <div className="text-center mb-6">
                            <button
                              onClick={handleDownloadCard}
                              className="text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 mx-auto"
                              style={{ backgroundColor: '#4FC3F7' }}
                            >
                              <Download className="w-5 h-5" />
                              {t.downloadYourPrize}
                            </button>
                          </div>
                        )}
                        <div className="text-green-600" dangerouslySetInnerHTML={{ __html: t.successMessage }} />
                      </motion.div>
                    </>
                  ) : (
                    /* Semleges "már játszottál" + Review CTA */
                    <div className="rounded-xl border border-cyan-200 shadow-md bg-gradient-to-br from-cyan-50 to-blue-50 p-6 text-center">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#4FC3F7]" />
                        {t.alreadyPlayedTitle || 'You already participated.'}
                      </h4>
                      <p className="text-gray-700 mt-1">
                        {t.alreadyPlayedCopy || "Thanks for playing! If you didn't receive your email, please check Spam/Promotions."}
                      </p>
                      {!project?.no_google_review && business?.google_review_link && (
                        <motion.button
                          onClick={handleOpenReviewLink}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          animate={{
                            boxShadow: [
                              '0 0 0 0 rgba(79,195,247,0.45)',
                              '0 0 0 12px rgba(79,195,247,0)'
                            ]
                          }}
                          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'loop' }}
                          className="
                            group relative mt-4 inline-flex items-center justify-center gap-2
                            px-7 py-4 rounded-full font-semibold text-white
                            focus:outline-none focus:ring-4 focus:ring-cyan-200
                            shadow-lg
                          "
                          style={{
                            background:
                              `linear-gradient(90deg, ${business.primary_color || '#4FC3F7'} 0%, #60a5fa 100%)`
                          }}
                        >
                          <span
                            className="
                              pointer-events-none absolute inset-0 rounded-full
                              before:content-[''] before:absolute before:inset-0
                              before:-translate-x-full before:bg-gradient-to-r
                              before:from-transparent before:via-white/40 before:to-transparent
                              group-hover:before:translate-x-full before:transition-transform before:duration-700
                            "
                          />
                          <Star className="w-5 h-5" />
                          {t.openGoogleReviews}
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-4 pb-3">
          Powered by Review to Revenue
        </div>
      </div>

      {/* Hidden download card */}
      <div style={{ position: 'absolute', top: -9999, left: -9999 }}>
        <div ref={downloadRef} style={{ width: '360px', padding: '16px', backgroundColor: '#fff' }}>
          <BusinessPreviewCard
            name={business.business_name}
            logoUrl={business.logo_url}
            bannerUrl={business.banner_url}
            address={business.address}
            phone={business.phone}
            email={business.email}
          />
          
          {/* Warning section above QR code */}
          {rewardCode && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fef3c7', 
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              margin: '8px 0',
              fontSize: '12px',
              lineHeight: '1.4'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                ⚠️ {t.emailImportant}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                <li>{t.emailQrOneTime}</li>
                <li>
                  {t.emailQrExpires} <strong>{getFormattedExpiryDate()}</strong>
                </li>
              </ul>
            </div>
          )}
          
          <div className="p-4 flex justify-center">
            {rewardCode && (
              <QRCodeCanvas value={`https://reviewtorevenue.io/qr/${rewardCode}`} size={160} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}