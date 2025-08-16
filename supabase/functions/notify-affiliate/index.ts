import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";   // ← ÚJ
import { Resend } from "npm:resend@3.2.0";

// ---- 0. Supabase service-role kliens -----------------
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ---- 1. CORS -----------------------------------------
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

// ---- 2. Lokalizált szövegek ---------------------------
const i18n = {
  hu: {
    subject: "Új regisztráció a linkeddel! 🎉",
    body: (email: string) => `
      <p>Szia!</p>
      <p>A partnerlinkeddel épp most regisztrált valaki: <b>${email}</b>.</p>
      <p>Köszi, hogy terjeszted a Review-to-Revenue hírét!</p>
      <p>Üdv,<br/>A Review-to-Revenue csapat</p>`,
  },
  en: {
    subject: "New signup via your link! 🎉",
    body: (email: string) => `
      <p>Hi there!</p>
      <p>Someone just signed up using your partner link: <b>${email}</b>.</p>
      <p>Thanks for spreading the word about Review-to-Revenue!</p>
      <p>Best,<br/>The Review-to-Revenue Team</p>`,
  },
} as const;

// ---- 3. Edge Function --------------------------------
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const { affiliate_ref, new_user_email } = await req.json() as {
      affiliate_ref: string | null;
      new_user_email: string;
    };
    console.log("[1] Body", { affiliate_ref, new_user_email });

    if (!affiliate_ref) {
      return new Response(JSON.stringify({ skipped: "no affiliate" }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // 1) Nyelv
    const { data: trial, error: trialErr } = await supabaseClient
      .from("free_trials")
      .select("language")
      .eq("email", new_user_email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (trialErr) throw trialErr;
    const lang = trial?.language === "hu" ? "hu" : "en";
    const t = i18n[lang];
    console.log("[2] Lang:", lang);

    // 2) Partner e-mail és notify_signup flag
    const { data: partner, error: partnerErr } = await supabaseClient
      .from("affiliate_partners")
      .select("email, notify_signup")
      .eq("affiliate_code", affiliate_ref.toLowerCase())
      .maybeSingle();
    if (partnerErr) throw partnerErr;
    if (!partner) throw new Error("Affiliate code not found");
    
    if (!partner?.notify_signup) {
      console.log("[notify] partner kikapcsolta → skip");
      return new Response(JSON.stringify({ ok: true, skipped: "notify_off" }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    
    console.log("[3] Partner email", partner.email);

    // 3) E-mail küldés
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
    const { error: mailErr, id } = await resend.emails.send({
      from: "Review-to-Revenue <hello@reviewtorevenue.io>",
      to: partner.email,
      subject: t.subject,
      html: t.body(new_user_email),
    });
    if (mailErr) throw mailErr;
    console.log("[4] Mail OK", id);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-affiliate error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});
