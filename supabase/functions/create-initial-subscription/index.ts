import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ✅ Group ID-k (default 14 nap vs. kuponos 30 nap)
const GROUPS = {
  hu: {
    default: '157798770283644383',   // jelenlegi HU default
    promo30: '162402031914452649',   // új HU 30 napos lista
  },
  en: {
    default: '157803359137432878',   // jelenlegi EN default
    promo30: '162402016558056570',   // új EN 30 napos lista
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // JSON feldolgozás
    const body = await req.json();
    console.log('📥 Received body:', JSON.stringify(body));
    console.log('🔎 affiliate_ref in body:', body.affiliate_ref);
    
    const language = body.language || 'en';
    const affiliateRef = body.affiliate_ref || null;
    const phone = body.phone || null;
    
    // ⬇️ Case-insensitive coupon handling
    const rawCoupon = (body.coupon_code || '').trim();
    const couponCode = rawCoupon.toUpperCase();
    const coupon30 = (Deno.env.get('COUPON_30') ?? 'FOUNDERS30').toUpperCase();
    const couponApplied = couponCode === coupon30;
    const trialDays = couponApplied ? 30 : 14;
    
    console.log('📍 Final language value:', language);
    console.log('🔗 affiliate_ref for upsert:', affiliateRef);
    console.log('📱 phone for upsert:', phone);
    console.log('🎫 coupon_code received:', couponCode);
    console.log('🎯 coupon30 target:', coupon30);
    console.log('✅ couponApplied:', couponApplied);
    console.log('📅 trial_days calculated:', trialDays);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization')!,
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('Not authenticated');

    // ⬇️ Check existing trial to prevent downgrade
    const { data: existing } = await supabase
      .from('free_trials')
      .select('trial_days')
      .eq('user_id', user.id)
      .maybeSingle();

    const finalTrialDays = Math.max(existing?.trial_days ?? 14, trialDays);
    console.log('🔄 existing trial_days:', existing?.trial_days);
    console.log('🎯 finalTrialDays (no downgrade):', finalTrialDays);

    // Upsert into free_trials
    const { data: trialInsert, error: trialError } = await supabase
      .from('free_trials')
      .upsert(
        {
          user_id: user.id,
          email: user.email,
          status: 'not started',
          language: ['hu', 'en'].includes(language) ? language : 'en',
          affiliate_ref: affiliateRef,
          phone_number: phone,
          trial_days: finalTrialDays,       // ⬅️ PROTECTED FROM DOWNGRADE
          coupon_code: couponCode || null
          // opcionális, ha azonnal akarod indítani:
          // trial_started_at: new Date().toISOString(),
          // trial_ends_at: new Date(Date.now() + finalTrialDays*86400000).toISOString(),
          // status: 'active',
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (trialError) throw trialError;
    console.log('✅ Upserted trial:', JSON.stringify(trialInsert));

    // ⬇️ Smart MailerLite group selection based on trial days and language
    const mailerLiteApiKey = Deno.env.get('MAILERLITE_API_KEY');
    const lang = ['hu','en'].includes(language) ? language : 'en';
    const targetGroupId = finalTrialDays >= 30 ? GROUPS[lang].promo30 : GROUPS[lang].default;

    console.log('🎯 MailerLite group selection:', { lang, finalTrialDays, targetGroupId });

    try {
      const subscribeRes = await fetch(`https://api.mailerlite.com/api/v2/groups/${targetGroupId}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': mailerLiteApiKey!,
        },
        body: JSON.stringify({
          email: user.email,
          name: user.user_metadata?.full_name || '',
          fields: {
            language: lang,
            trial_days: finalTrialDays,
          }
        })
      });

      const subscribeJson = await subscribeRes.json();
      console.log('📧 MailerLite response:', subscribeRes.status, subscribeJson);

      if (!subscribeRes.ok) {
        console.warn('⚠️ MailerLite failed:', subscribeJson);
      }
    } catch (e) {
      console.warn('⚠️ MailerLite error:', e);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        trial_days: finalTrialDays,
        coupon_applied: couponApplied
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('🔥 Edge error object:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error && typeof error === 'object' && 'message' in error
            ? (error as any).message
            : JSON.stringify(error),
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
