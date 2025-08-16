import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    // Get user from auth header
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('Not authenticated');

    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (subError) throw subError;
    if (!subscription) throw new Error('No subscription found');

    // Get plan limits
    const { data: planFeatures, error: planError } = await supabase
      .from('plan_features')
      .select('max_reviews_per_month, max_wheels')
      .eq('plan', subscription.plan)
      .single();

    if (planError) throw planError;

    // Get current usage
    const { data: usage, error: usageError } = await supabase
      .from('usage_metrics')
      .select('review_count, wheel_count')
      .eq('user_id', user.id)
      .eq('month', new Date().toISOString().slice(0, 7))
      .single();

    if (usageError && usageError.code !== 'PGRST116') throw usageError;

    const currentUsage = usage || { review_count: 0, wheel_count: 0 };
    const limits = {
      reviews: {
        used: currentUsage.review_count,
        limit: planFeatures.max_reviews_per_month,
        exceeded: currentUsage.review_count >= planFeatures.max_reviews_per_month,
      },
      wheels: {
        used: currentUsage.wheel_count,
        limit: planFeatures.max_wheels,
        exceeded: currentUsage.wheel_count >= planFeatures.max_wheels,
      },
    };

    return new Response(
      JSON.stringify({
        success: true,
        limits,
        plan: subscription.plan,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
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