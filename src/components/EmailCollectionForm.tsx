import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { logFlowEvent } from '../lib/eventTracking';
import { sendRewardEmail } from '../lib/emailService';
import { useTranslation, type Language } from '../lib/translations';

interface EmailCollectionFormProps {
  wheelId: string;
  rating?: number;
  prize: string;
  onSuccess: (payload: { code: string; email: string }) => void;
  language?: Language;
  businessName?: string;
  expiresInDays?: number;
}

export default function EmailCollectionForm({ 
  wheelId, 
  rating, 
  prize, 
  onSuccess,
  language = 'en',
  businessName,
  expiresInDays = 30
}: EmailCollectionFormProps) {
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get translations
  const t = useTranslation(language);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || saving) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data: wheelData, error: wheelError } = await supabase
        .from('wheel_projects')
        .select('user_id')
        .eq('id', wheelId)
        .maybeSingle();

      if (wheelError) throw new Error('Failed to fetch wheel project: ' + wheelError.message);
      if (!wheelData) throw new Error('Project not found');

      const userId = wheelData.user_id;

      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('id, business_name, logo_url')
        .eq('user_id', wheelData.user_id)
        .maybeSingle();

      if (businessError) throw new Error('Failed to fetch business profile: ' + businessError.message);
      if (!businessData) throw new Error('Business not found');

      // Generate reward code
      const code = `REW-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Create review click record
      const { error: insertError } = await supabase
        .from('review_clicks')
        .insert({
          wheel_id: wheelId,
          business_id: businessData.id,
          email,
          rating: rating ?? null,
          marketing_opt_in: optIn,
          user_id: userId,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error(t.emailAlreadyUsed);
        } else {
          throw new Error(t.genericSaveError);
        }
      }

      // Insert reward code
      const { error: rewardError } = await supabase
        .from('reward_codes')
        .insert({
          user_email: email,
          wheel_project_id: wheelId,
          prize,
          code,
          expires_at: expiresAt.toISOString(),
          marketing_opt_in: optIn,
        });

      if (rewardError) throw new Error('Failed to generate reward code: ' + rewardError.message);

      // Send reward email with the new QR code URL
      await sendRewardEmail(
        email,
        prize,
        code,
        businessData.business_name,
        businessData.logo_url || '',
        wheelId,
        language
      );

      // Log only email_saved event
      await logFlowEvent(wheelId, 'email_saved', { rating: rating ?? null });

      setSuccessMessage(t.successMessage);
      onSuccess({ code, email }); // Pass both code and email to onSuccess
    } catch (err) {
      console.error('Error saving email:', err);
      setError((err as Error).message || t.genericSaveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <div
          className="p-3 bg-green-50 text-green-800 rounded-lg text-sm"
          dangerouslySetInnerHTML={{ __html: successMessage }}
        />
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Marketing opt-in checkbox */}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <input
            id="opt-in"
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            className="mt-1"
          />
          <p
            className="cursor-pointer"
            dangerouslySetInnerHTML={{
              __html: t.emailMarketingOptIn.replace('{business_name}', businessName || 'this business')
            }}
            onClick={() => setOptIn(!optIn)} // Optional: make the text clickable to toggle the checkbox
          />
        </div>

        <button
          type="submit"
          disabled={saving || !email}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                     text-white font-medium transition-colors ${
                       saving || !email
                         ? 'bg-[#A7DBEC] cursor-not-allowed'
                         : 'bg-[#4FC3F7] hover:bg-[#46B5E5]'
                     }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.sending}
            </>
          ) : (
            t.getReward
          )}
        </button>
      </form>
    </div>
  );
}