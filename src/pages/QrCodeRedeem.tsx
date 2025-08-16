import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import BusinessPreviewCard from '../components/BusinessPreviewCard';
import DisclaimerText from '../components/DisclaimerText';

// Language type definition
type Language = 'en' | 'hu' | 'de';

// Translation object
const translations = {
  en: {
    project_id_missing: "Project ID is missing",
    reward_code_missing: "Reward code is missing",
    invalid_qr_code: "Invalid QR code",
    already_redeemed: "This QR code has already been redeemed.",
    failed_to_redeem: "Failed to mark as redeemed – no rows updated. Possibly blocked by RLS or wrong code.",
    surprise_reward: "a surprise reward",
    wheel_project_not_found: "Wheel project not found",
    business_not_found: "Business profile not found",
    failed_to_load: "Failed to load QR code",
    oops: "Oops!",
    unable_to_generate: "Unable to generate QR code",
    you_won_title: "You won:",
    use_coupon_label: "Use this coupon code at checkout:"
  },
  hu: {
    project_id_missing: "A projekt azonosító hiányzik",
    reward_code_missing: "A nyereménykód hiányzik",
    invalid_qr_code: "Érvénytelen QR kód",
    already_redeemed: "Ez a QR kód már beváltásra került.",
    failed_to_redeem: "Nem sikerült beváltottként megjelölni – egyetlen sor sem frissült. Valószínűleg RLS blokkolja vagy rossz a kód.",
    surprise_reward: "meglepetés nyeremény",
    wheel_project_not_found: "Nem található a projekt",
    business_not_found: "Nem található az üzleti profil",
    failed_to_load: "Nem sikerült betölteni a QR kódot",
    oops: "Hoppá!",
    unable_to_generate: "Nem sikerült generálni a QR kódot",
    you_won_title: "Nyertél:",
    use_coupon_label: "Használd ezt a kuponkódot fizetéskor:"
  },
  de: {
    project_id_missing: "Projekt-ID fehlt",
    reward_code_missing: "Belohnungscode fehlt",
    invalid_qr_code: "Ungültiger QR-Code",
    already_redeemed: "Dieser QR-Code wurde bereits eingelöst.",
    failed_to_redeem: "Fehler beim Markieren als eingelöst – keine Zeilen aktualisiert. Möglicherweise durch RLS blockiert oder falscher Code.",
    surprise_reward: "eine Überraschungsbelohnung",
    wheel_project_not_found: "Glücksrad-Projekt nicht gefunden",
    business_not_found: "Unternehmensprofil nicht gefunden",
    failed_to_load: "QR-Code konnte nicht geladen werden",
    oops: "Hoppla!",
    unable_to_generate: "QR-Code konnte nicht generiert werden",
    you_won_title: "Du hast gewonnen:",
    use_coupon_label: "Verwende diesen Gutscheincode beim Checkout:"
  }
};

interface BusinessProfile {
  business_name: string;
  logo_url?: string;
  address?: string;
  primary_color: string;
  google_review_link: string;
  banner_url?: string;
  email?: string;
  phone?: string;
  description?: string;
}

export default function QrCodeRedeem() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [prize, setPrize] = useState<string>('');
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [qrCouponEnabled, setQrCouponEnabled] = useState(false);
  // Language state - will be set by project language
  const [language, setLanguage] = useState<Language>('en');

  // Get current translations
  const t = translations[language];

  useEffect(() => {
    if (!id) {
      setError(translations['en'].project_id_missing); // Use default English for initial error
      setLoading(false);
      return;
    }
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      if (!id) throw new Error(translations['en'].reward_code_missing);

      // 1. Lekérdezzük a reward kódot
      const { data: reward, error: rewardError } = await supabase
        .from('reward_codes')
        .select('*')
        .eq('code', id)
        .maybeSingle();

      if (rewardError) throw rewardError;
      if (!reward) throw new Error(translations['en'].invalid_qr_code);

      // 2. Lekérdezzük a kapcsolódó wheel_project rekordot ELŐSZÖR (hogy meglegyen a nyelv)
      const { data: project, error: projectError } = await supabase
        .from('wheel_projects')
        .select('prizes, user_id, disclaimer, qr_coupon_enabled, language') // FONTOS: language mező is!
        .eq('id', reward.wheel_project_id)
        .maybeSingle();

      if (projectError) throw projectError;
      if (!project) throw new Error(translations['en'].wheel_project_not_found);

      // KRITIKUS: Állítsd be a language state-et a projekt alapján ELSŐ lépésként
      const projectLanguage = project.language as Language || 'en';
      setLanguage(projectLanguage);

      // Most már a helyes nyelvű fordításokat használjuk
      const currentTranslations = translations[projectLanguage];

      if (reward.redeemed) {
        setError(currentTranslations.already_redeemed);
        return;
      }

      // 3. Megjelöljük beváltottnak
      const { data: updatedRows, error: updateError } = await supabase
        .from('reward_codes')
        .update({
          redeemed: true,
          redeemed_at: new Date().toISOString(),
        })
        .eq('code', id)
        .select();

      console.log('Updated rows:', updatedRows);
      
      if (!updatedRows || updatedRows.length === 0) {
        throw new Error(currentTranslations.failed_to_redeem);
      }

      if (updateError) throw updateError;

      setPrize(reward.prize || currentTranslations.surprise_reward);

      // Megkeressük a nyereményhez tartozó coupon kódot
      const matchingPrize = project?.prizes.find((p: any) => p.label === reward.prize);
      setCouponCode(matchingPrize?.coupon_code || null);
      setQrCouponEnabled(project.qr_coupon_enabled || false);

      // 4. Lekérdezzük a business profilt a user_id alapján
      const { data: business, error: bizErr } = await supabase
        .from('business_profiles')
        .select('business_name, logo_url, address, primary_color, google_review_link, banner_url, email, phone, description')
        .eq('user_id', project.user_id)
        .maybeSingle();

      if (bizErr) throw bizErr;
      if (!business) throw new Error(currentTranslations.business_not_found);

      setDisclaimer(project.disclaimer || null);
      setBusiness(business);
    } catch (err: any) {
      console.error('Error loading data:', err.message || err);
      setError(err.message || translations[language].failed_to_load);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.oops}</h1>
          <p className="text-gray-600">{error || t.unable_to_generate}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <BusinessPreviewCard
          name={business.business_name}
          logoUrl={business.logo_url}
          bannerUrl={business.banner_url}
          reviewLink={business.google_review_link}
          primaryColor={business.primary_color}
          address={business.address}
          phone={business.phone}
          email={business.email}
          description={business.description}
        />

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🎁 {t.you_won_title}</h2>
          <p className="text-xl text-green-600 font-semibold break-words">{prize}</p>
        </div>

        {/* A prize kártya után, ha van coupon kód és engedélyezve van a qr coupon funkció */}
        {qrCouponEnabled && couponCode && (
          <div className="bg-white p-6 rounded-xl shadow text-center mt-4 border border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{t.use_coupon_label}</h3>
            <p className="text-2xl font-bold text-purple-600 break-words">{couponCode}</p>
          </div>
        )}

        {disclaimer && (
          <DisclaimerText 
            text={disclaimer} 
            className="whitespace-pre-line"
          />
        )}
      </div>

      {/* 🔒 CSS override: hide stars and review button only on this page */}
      <style>
        {`
          .business-card-stars,
          .business-card-review-button {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
}
