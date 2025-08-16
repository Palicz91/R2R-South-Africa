import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract reward code from URL
    const url = new URL(req.url);
    const rewardCode = url.pathname.split('/').pop();

    console.log('Processing reward code:', rewardCode);

    if (!rewardCode) {
      return new Response(
        JSON.stringify({ error: 'Invalid reward code' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get reward details
    const { data: reward, error: rewardError } = await supabase
      .from('reward_codes')
      .select(`
        *,
        wheel_projects(
          user_id,
          name
        )
      `)
      .eq('code', rewardCode)
      .maybeSingle();

    console.log('Reward lookup result:', reward);

    if (rewardError) throw rewardError;
    if (!reward) {
      return new Response(
        JSON.stringify({ error: 'Invalid reward code' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already redeemed
    if (reward.redeemed) {
      return new Response(
        JSON.stringify({ error: 'Reward already redeemed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if expired
    const now = new Date();
    if (reward.expires_at && new Date(reward.expires_at) < now) {
      return new Response(
        JSON.stringify({ error: 'Reward expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get business details
    const { data: business, error: businessError } = await supabase
      .from('business_profiles')
      .select('business_name, logo_url, address, phone')
      .eq('user_id', reward.wheel_projects.user_id)
      .maybeSingle();

    if (businessError) throw businessError;
    if (!business) {
      throw new Error('Business not found');
    }

    // Mark as redeemed
    const { error: updateError } = await supabase
      .from('reward_codes')
      .update({
        redeemed: true,
        redeemed_at: now.toISOString(),
      })
      .eq('code', rewardCode)
      .eq('redeemed', false) // Extra safety check
      .gt('expires_at', now.toISOString()); // Ensure not expired

    if (updateError) throw updateError;

    // Log redemption event
    const { error: eventError } = await supabase
      .from('flow_events')
      .insert({
        wheel_id: reward.wheel_project_id,
        event: 'qr_code_redeemed',
        metadata: {
          code: rewardCode,
          prize: reward.prize,
          redeemed_at: now.toISOString(),
        },
      });

    if (eventError) throw eventError;

    // Return reward and business details
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          prize: reward.prize,
          business_name: business.business_name,
          logo_url: business.logo_url,
          address: business.address,
          phone: business.phone,
          expires_at: reward.expires_at,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in redeem-reward-code function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});