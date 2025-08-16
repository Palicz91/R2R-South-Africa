// /supabase/functions/wipe-user-by-email/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // vagy 'https://reviewtorevenue.io'
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // 1) CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let payload;
    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'invalid JSON body' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const { email, dryRun = false, hardDeleteAuth = true } = payload;

    if (!email) {
      return new Response(JSON.stringify({ error: "email is required" }), { 
        status: 400,
        headers: corsHeaders
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: corsHeaders
      });
    }

    // Validate caller is admin
    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: meErr } = await supabaseAnon.auth.getUser();
    if (meErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Use service role for destructive ops
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check user role from database
    const { data: roleRow, error: roleErr } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleErr) {
      console.error('Role check error:', roleErr);
      return new Response(JSON.stringify({ error: 'Role check failed' }), {
        status: 500,
        headers: corsHeaders
      });
    }

    if (roleRow?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: corsHeaders
      });
    }

    // 1) run RPC to collect+delete all public schema rows in a single TX
    const { data: wipeResult, error: wipeErr } = await supabaseAdmin
      .rpc(dryRun ? "wipe_user_by_email_dry" : "wipe_user_by_email", { p_email: email });

    if (wipeErr) {
      console.error(wipeErr);
      return new Response(JSON.stringify({ error: wipeErr.message }), { 
        status: 500,
        headers: corsHeaders
      });
    }

    // 2) delete auth user if exists & not dryRun
    let authDeleted = false;
    if (!dryRun && hardDeleteAuth && wipeResult?.user_id) {
      const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(wipeResult.user_id);
      if (delErr) {
        console.error("❌ Failed to delete auth user:", delErr.message);
      } else {
        authDeleted = true;
      }
    }

    return new Response(
      JSON.stringify({ dryRun, authDeleted, ...(wipeResult ?? {}) }, null, 2),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Internal error" }), { 
      status: 500,
      headers: corsHeaders
    });
  }
});
