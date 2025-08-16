import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get the request payload
    const { partner_name, partner_email, promo_code, discount_percent, duration, duration_in_months } = await req.json();

    // Validate required fields
    if (!partner_name || !partner_email || !promo_code || !discount_percent) {
      throw new Error('Missing required fields');
    }

    // Check if promo code already exists in Stripe
    const existingPromoCodes = await stripe.promotionCodes.list({
      code: promo_code.trim().toUpperCase(),
      active: true,
    });

    if (existingPromoCodes.data.length > 0) {
      throw new Error('Promotion code already exists in Stripe');
    }

    // 1. Create Stripe coupon
    const couponParams: Stripe.CouponCreateParams = {
      percent_off: discount_percent,
      duration: duration as 'once' | 'forever' | 'repeating',
      name: `${partner_name} Affiliate Discount`,
      metadata: { partner_email, partner_name, source: 'affiliate_program' },
    };

    if (duration === 'repeating') {
      couponParams.duration_in_months = duration_in_months;
    }

    const coupon = await stripe.coupons.create(couponParams);

    console.log(`Created Stripe coupon: ${coupon.id}`);

    // 2. Create Stripe promotion code
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: promo_code.trim().toUpperCase(),
      metadata: {
        partner_email,
        partner_name,
        source: 'affiliate_program'
      }
    });

    console.log(`Created Stripe promotion code: ${promotionCode.id}`);

    // 3. Update the promo_code record in the database
    const { data: promoData, error: promoError } = await supabase
      .from('promo_codes')
      .update({
        stripe_coupon_id: coupon.id,
        stripe_promo_code_id: promotionCode.id,
        duration,
        duration_in_months: duration === 'repeating' ? duration_in_months : null
      })
      .eq('code', promo_code.trim().toUpperCase())
      .select()
      .single();

    if (promoError) {
      // If update fails, clean up the created Stripe resources
      await stripe.promotionCodes.update(promotionCode.id, { active: false });
      await stripe.coupons.del(coupon.id);
      throw promoError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        coupon_id: coupon.id,
        promotion_code_id: promotionCode.id,
        promo_code: promoData
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error creating Stripe coupon:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});