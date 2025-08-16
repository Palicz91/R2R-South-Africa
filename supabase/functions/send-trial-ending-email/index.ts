import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { Resend } from "npm:resend@3.2.0";

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

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // Find users whose trial ends in 2 days
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    // Set times to beginning and end of day for more precise filtering
    today.setHours(0, 0, 0, 0);
    twoDaysFromNow.setHours(23, 59, 59, 999);

    const { data: trialEndingUsers, error: usersError } = await supabase
      .from('subscriptions')
      .select('user_id, trial_end, plan')
      .eq('status', 'trialing')
      .gte('trial_end', today.toISOString())
      .lte('trial_end', twoDaysFromNow.toISOString());

    if (usersError) throw usersError;

    if (!trialEndingUsers?.length) {
      return new Response(
        JSON.stringify({ message: 'No trials ending soon', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user emails
    const { data: profiles, error: profilesError } = await supabase
      .auth.admin.listUsers();

    if (profilesError) throw profilesError;

    // Send emails
    const results = await Promise.allSettled(trialEndingUsers.map(async (trialUser) => {
      const userProfile = profiles.users.find(u => u.id === trialUser.user_id);
      if (!userProfile?.email) return { status: 'skipped', reason: 'No email found' };

      try {
        const result = await resend.emails.send({
          from: 'Review to Revenue <hello@reviewtorevenue.io>',
          to: userProfile.email,
          subject: '⏳ Your free trial is ending in 2 days',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Trial is Ending Soon</title>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                  <h1 style="color: #1F2937; margin-bottom: 24px;">Don't lose access to your data!</h1>
                  
                  <p style="margin-bottom: 24px; font-size: 16px;">
                    Your free trial of Review to Revenue ${trialUser.plan ? `(${trialUser.plan} plan)` : ''} ends in 2 days. 
                    To keep collecting reviews and growing your business, upgrade now to continue using all features without interruption.
                  </p>

                  <div style="background-color: #F3F4F6; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                    <h2 style="color: #1F2937; margin-top: 0;">What happens when your trial ends?</h2>
                    <ul style="padding-left: 20px; margin: 16px 0;">
                      <li>Your account will be downgraded to the free plan</li>
                      <li>Limited to 50 reviews per month</li>
                      <li>Only 1 active Wheel of Fortune</li>
                      <li>Basic features only</li>
                    </ul>
                  </div>

                  <a href="${Deno.env.get('FRONTEND_URL') || 'https://reviewtorevenue.io'}/pricing" 
                     style="display: inline-block; background-color: #2563EB; color: white; padding: 12px 24px; 
                            border-radius: 8px; text-decoration: none; font-weight: 500;">
                    Upgrade Now
                  </a>

                  <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">
                    Need help choosing a plan? Reply to this email and we'll help you pick the perfect one for your business.
                  </p>
                </div>
              </body>
            </html>
          `,
        });
        return { status: 'fulfilled', id: result.id };
      } catch (err) {
        return { status: 'rejected', reason: err.message, userId: trialUser.user_id };
      }
    }));

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    const skipped = results.filter(r => r.value?.status === 'skipped').length;

    return new Response(
      JSON.stringify({ 
        success: true,
        stats: {
          total: trialEndingUsers.length,
          emailsSent: successful,
          failed: failed,
          skipped: skipped
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});