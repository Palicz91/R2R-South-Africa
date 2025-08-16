// supabase/functions/mark-review-click/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ✅ Modul-szinten hozzuk létre
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  try {
    const { wheel_id, user_email, reward_code } = await req.json();
    if (!wheel_id || (!user_email && !reward_code)) {
      return new Response(JSON.stringify({ error: "wheel_id and (user_email or reward_code) required" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const norm = (s?: string | null) => s?.trim().toLowerCase() || undefined;
    let email = norm(user_email);
    let effectiveWheelId: string = wheel_id;
    let rcId: string | null = null;

    // 1) Reward code lookup ('code' és 'reward_code' oszlop is próbálva)
    if (reward_code) {
      const byCode = await admin
        .from('reward_codes')
        .select('id, wheel_project_id, user_email')
        .eq('code', reward_code)
        .maybeSingle();

      const byAlt = (!byCode.data)
        ? await admin
            .from('reward_codes')
            .select('id, wheel_project_id, user_email')
            .eq('reward_code', reward_code)
            .maybeSingle()
        : null;

      const rc = byCode.data ?? byAlt?.data ?? null;
      if (rc) {
        rcId = rc.id;
        effectiveWheelId = rc.wheel_project_id;   // ⬅️ helyes oszlopnév
        email = email ?? norm(rc.user_email);
      }
    }

    // 2) Fallback: wheel_project_id + email
    if (!rcId && email) {
      const byWe = await admin
        .from('reward_codes')
        .select('id, wheel_project_id, user_email')
        .eq('wheel_project_id', effectiveWheelId) // ⬅️ helyes oszlopnév
        .eq('user_email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (byWe.data) {
        rcId = byWe.data.id;
        effectiveWheelId = byWe.data.wheel_project_id; // ⬅️ frissítés
        email = email ?? norm(byWe.data.user_email);
      }
    }

    // 3) Update, majd select('id') hogy lásd a darabszámot
    let updated = 0;
    if (rcId) {
      const upd = await admin
        .from('reward_codes')
        .update({ review_clicked_at: new Date().toISOString() })
        .eq('id', rcId)
        .is('review_clicked_at', null)
        .select('id');

      if (upd.error) throw upd.error;
      updated = upd.data?.length ?? 0;
    }

    return new Response(JSON.stringify({ ok: true, updated }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unhandled", details: String(e) }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
