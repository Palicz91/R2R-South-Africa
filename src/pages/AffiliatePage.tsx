import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Loader2, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const ADMIN_EMAILS = ['hello@reviewtorevenue.io'];
const AFFILIATE_PREFIX = "https://reviewtorevenue.io/?ref=";

export default function AffiliatePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    partner_name: '',
    partner_email: '',
    affiliate_code: '',
    promo_code: '',
    discount_percent: 10,
    duration: 'once',
    duration_in_months: 1,
    notify_signup: true,            // ← ÚJ mező a form-state-ben
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !ADMIN_EMAILS.includes(user.email!)) {
        navigate('/');
      } else {
        setUser(user);
        setLoading(false);
        toast.success('Welcome to the Affiliate Management page');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError(null);
    setCopied(false);

    const loadingToast = toast.loading('Creating affiliate partner...');

    try {
      // Check if affiliate code already exists
      const { data: existingAffiliate } = await supabase
        .from('affiliate_partners')
        .select('affiliate_code')
        .eq('affiliate_code', formData.affiliate_code.trim())
        .single();

      if (existingAffiliate) {
        throw new Error('This affiliate code is already taken. Please choose another one.');
      }

      // 1. Save the promo code if needed
      let promoId = null;
      if (formData.promo_code.trim()) {
        const { data: promo, error: promoError } = await supabase
          .from('promo_codes')
          .insert({
            code: formData.promo_code.trim(),
            discount_percentage: formData.discount_percent,
          })
          .select()
          .single();
        if (promoError) throw promoError;
        promoId = promo.id;
      }

      // 2. Save the affiliate partner record with affiliate_code
      const { error: affiliateError } = await supabase
        .from('affiliate_partners')
        .insert({
          partner_name: formData.partner_name.trim(),
          email: formData.partner_email.trim(),
          affiliate_code: formData.affiliate_code.trim(),
          promo_code_id: promoId,
          notify_signup: formData.notify_signup,   // ← MENTJÜK A FLAG-ET
        });

      if (affiliateError) throw affiliateError;

      // 3. Create Stripe coupon if promo code exists
      if (formData.promo_code.trim()) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          try {
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-create-coupon`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                partner_name: formData.partner_name.trim(),
                partner_email: formData.partner_email.trim(),
                promo_code: formData.promo_code.trim(),
                discount_percent: formData.discount_percent,
                duration: formData.duration,
                duration_in_months: formData.duration_in_months,
              }),
            });

            if (!response.ok) {
              console.warn('Stripe coupon creation failed, but affiliate was created');
            }
          } catch (stripeError) {
            console.warn('Stripe coupon creation failed:', stripeError);
          }
        }
      }

      setSuccess(true);
      setFormData({
        partner_name: '',
        partner_email: '',
        affiliate_code: '',
        promo_code: '',
        discount_percent: 10,
        duration: 'once',
        duration_in_months: 1,
        notify_signup: true,
      });

      toast.dismiss(loadingToast);
      toast.success('Affiliate partner created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create affiliate');
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Failed to create affiliate');
    } finally {
      setSubmitting(false);
    }
  };

  const affiliateLink = `${AFFILIATE_PREFIX}${formData.affiliate_code}`;

  const copyAffiliateLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    toast.success('Affiliate link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Register Affiliate Partner</h1>

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Affiliate successfully registered with tracking code.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Partner Name</label>
            <input
              type="text"
              value={formData.partner_name}
              onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Partner Email</label>
            <input
              type="email"
              value={formData.partner_email}
              onChange={(e) => setFormData({ ...formData, partner_email: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Affiliate Tracking Code
            </label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <span className="bg-gray-100 px-3 flex items-center text-gray-600 text-sm border-r whitespace-nowrap min-w-[220px]">
                reviewtorevenue.io/?ref=
              </span>
              <input
                type="text"
                value={formData.affiliate_code}
                onChange={(e) => setFormData({ ...formData, affiliate_code: e.target.value.replace(/\s/g, "").toLowerCase() })}
                className="px-3 py-2 w-full flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. partner123"
                maxLength={24}
                pattern="[a-zA-Z0-9_-]+"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Only letters, numbers, underscore, and dash allowed
            </p>
            
            {formData.affiliate_code && (
              <div className="mt-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 text-sm transition-colors"
                  onClick={copyAffiliateLink}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Affiliate Link"}
                </button>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Full affiliate link:</p>
                  <code className="text-xs break-all font-mono text-gray-800">
                    {affiliateLink}
                  </code>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Promo Code <span className="text-gray-400">(optional - for Stripe discounts)</span>
            </label>
            <input
              type="text"
              value={formData.promo_code}
              onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 uppercase focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. SAVE20"
            />
          </div>

          {/* E-mail értesítés kapcsoló */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={formData.notify_signup}
                onChange={(e) =>
                  setFormData({ ...formData, notify_signup: e.target.checked })
                }
              />
              <span className="text-sm font-medium text-gray-700">Send e-mail notification on new sign-ups</span>
            </label>
          </div>

          {formData.promo_code && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount %</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="once">Once</option>
                  <option value="forever">Forever</option>
                  <option value="repeating">Repeating</option>
                </select>
              </div>

              {formData.duration === 'repeating' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration in Months</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_in_months}
                    onChange={(e) => setFormData({ ...formData, duration_in_months: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${
              submitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? (
              <div className="flex items-center gap-2 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" /> Creating Affiliate...
              </div>
            ) : (
              'Create Affiliate Partner'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}