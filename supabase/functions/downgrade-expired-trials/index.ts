import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Find expired trials
    const { data: expiredTrials, error: findError } = await supabase
      .from('subscriptions')
      .select('id, user_id')
      .eq('status', 'trialing')
      .lt('trial_end', new Date().toISOString());

    if (findError) throw findError;

    if (!expiredTrials?.length) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No expired trials found',
          processed: 0,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Update expired trials
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        plan: 'free',
        status: 'canceled',
        ended_at: new Date().toISOString(),
      })
      .in('id', expiredTrials.map(trial => trial.id));

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully downgraded expired trials',
        processed: expiredTrials.length,
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