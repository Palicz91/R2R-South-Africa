// supabase/functions/schedule-review-reminder/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { wheel_id, business_id, user_email, delay_days, due_at } = await req.json();

    // Alap validáció
    if (!wheel_id || !business_id || !user_email) {
      return new Response(JSON.stringify({ error: "wheel_id, business_id, user_email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Egyszerű e‑mail check
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user_email);
    if (!emailOk) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // dueAt számítása: due_at param elsőbbséget élvez (teszteléshez), különben delay_days, különben 2 nap
    const dd = Number.isFinite(delay_days) ? Number(delay_days) : 2;
    const computedDueAt = due_at ? new Date(due_at) : new Date(Date.now() + dd * 24 * 60 * 60 * 1000);
    if (Number.isNaN(computedDueAt.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid due_at" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    // Ne ütemezzünk, ha a kerékhez tiltva van a Google review gyűjtés
    const { data: project, error: projErr } = await admin
      .from("wheel_projects")
      .select("id, no_google_review")
      .eq("id", wheel_id)
      .maybeSingle();

    if (projErr) {
      return new Response(JSON.stringify({ error: "Project lookup failed", details: projErr.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!project || project.no_google_review === true) {
      // Nem hiba, csak nincs teendő
      return new Response(JSON.stringify({ ok: true, skipped: "no_google_review" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Ha van már pending ugyanarra a (wheel_id, email) párra, frissítjük a due_at‑et
    const { data: existing, error: findErr } = await admin
      .from("review_reminders")
      .select("id, due_at, status")
      .eq("wheel_id", wheel_id)
      .eq("user_email", user_email)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();

    if (findErr) {
      return new Response(JSON.stringify({ error: "Lookup failed", details: findErr.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (existing?.id) {
      // Upsert‑szerű viselkedés: módosítjuk a due_at‑et
      const { error: updErr } = await admin
        .from("review_reminders")
        .update({ due_at: computedDueAt })
        .eq("id", existing.id);

      if (updErr) {
        return new Response(JSON.stringify({ error: "Update failed", details: updErr.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({ ok: true, id: existing.id, updated: true, due_at: computedDueAt.toISOString() }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Új pending emlékeztető létrehozása
    const { data: inserted, error: insErr } = await admin
      .from("review_reminders")
      .insert({
        wheel_id,
        business_id,
        user_email,
        due_at: computedDueAt,
        status: "pending",
      })
      .select("id, due_at")
      .maybeSingle();

    if (insErr) {
      return new Response(JSON.stringify({ error: "Insert failed", details: insErr.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: inserted?.id, due_at: inserted?.due_at }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unhandled", details: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
