// supabase/functions/process-review-reminders/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@3.2.0";

/** ---- i18n setup ---- */
type Language = "en" | "hu" | "de";

const translations: Record<Language, {
  subject: (bizName: string) => string;
  intro: string;
  ctaLabel: string;
  outro: string;
  unsubscribe: string;
  preheader: string;
}> = {
  en: {
    subject: (biz) => `How was your experience at ${biz}?`,
    preheader: "Quick reminder to share a short Google review.",
    intro: "Thanks again for visiting us a couple of days ago. If you have a minute, a short Google review would mean a lot.",
    ctaLabel: "Write a Google review",
    outro: "Thank you for helping others make great choices!",
    unsubscribe: 'If you don’t want to receive reminders like this, reply with "unsubscribe".',
  },
  hu: {
    subject: (biz) => `Hogy érezted magad a(z) ${biz}-nál/-nél?`,
    preheader: "Rövid emlékeztető: kérünk egy rövid Google értékelést.",
    intro: "Köszönjük, hogy pár napja nálunk jártál. Ha van egy perced, sokat jelentene egy rövid Google értékelés.",
    ctaLabel: "Értékelés írása Google-on",
    outro: "Köszönjük, hogy segítesz másoknak is jó döntést hozni!",
    unsubscribe: 'Ha nem szeretnél ilyen emlékeztetőket kapni, válaszolj azzal, hogy "unsubscribe".',
  },
  de: {
    subject: (biz) => `Wie war dein Erlebnis bei ${biz}?`,
    preheader: "Kurze Erinnerung: Teile bitte eine kurze Google‑Bewertung.",
    intro: "Danke, dass du vor ein paar Tagen bei uns warst. Wenn du eine Minute hast, freuen wir uns sehr über eine kurze Google‑Bewertung.",
    ctaLabel: "Google‑Bewertung schreiben",
    outro: "Vielen Dank, dass du anderen bei einer guten Entscheidung hilfst!",
    unsubscribe: 'Wenn du solche Erinnerungen nicht erhalten möchtest, antworte mit „unsubscribe“.',
  },
};

const getLang = (val?: string | null): Language =>
  (val === "hu" || val === "de" || val === "en") ? val : "en";

/** ---- CORS / env ---- */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BATCH = Number(Deno.env.get("REMINDER_BATCH_SIZE") || 50);
const LOCK_MIN = Number(Deno.env.get("REMINDER_LOCK_MIN") || 15);
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Hello <hello@reviewtorevenue.io>";

/** ---- helpers ---- */
function withUtm(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "r2r");
    u.searchParams.set("utm_medium", "email");
    u.searchParams.set("utm_campaign", "review_reminder");
    return u.toString();
  } catch {
    return url;
  }
}

function renderEmailHTML(t: ReturnType<typeof translations["en"]>, reviewUrl: string) {
  const link = withUtm(reviewUrl);
  return `
  <!doctype html>
  <html><head>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no"/>
    <meta name="description" content="${t.preheader}">
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#374151;margin:0;padding:0}
      .container{max-width:600px;margin:0 auto;padding:28px 20px}
      .btn{display:inline-block;padding:12px 16px;border-radius:9999px;background:#2563eb;color:#fff;text-decoration:none;font-weight:600}
      .hr{border-top:1px solid #e5e7eb;margin:24px 0}
      .foot{font-size:12px;color:#6b7280}
    </style>
  </head>
  <body>
    <div class="container">
      <p>${t.intro}</p>
      <p><a class="btn" href="${link}">${t.ctaLabel}</a></p>
      <p>${t.outro}</p>
      <div class="hr"></div>
      <p class="foot">${t.unsubscribe}</p>
    </div>
  </body></html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const resend = new Resend(RESEND_API_KEY);

  try {
    // 1) Batch claim
    const { data: claimed, error: claimErr } = await admin
      .rpc("claim_due_review_reminders", { p_limit: BATCH, p_lock_minutes: LOCK_MIN });

    if (claimErr) throw claimErr;

    const tasks = (claimed ?? []) as Array<{
      id: string;
      wheel_id: string;
      business_id: string;
      user_email: string;
    }>;

    if (!tasks.length) {
      return new Response(JSON.stringify({ ok: true, processed: 0 }), {
        status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let sent = 0, canceled = 0, failed = 0;

    for (const t of tasks) {
      try {
        // 2) project flags + language egy lekérésben
        const { data: project, error: projErr } = await admin
          .from("wheel_projects")
          .select("no_google_review, language")
          .eq("id", t.wheel_id)
          .maybeSingle();
        if (projErr) throw projErr;

        const lang = getLang(project?.language || "en");
        const tr = translations[lang];

        if (!project || project.no_google_review === true) {
          await admin.from("review_reminders")
            .update({ status: "canceled", canceled_at: new Date().toISOString(), locked_by: null, locked_at: null })
            .eq("id", t.id);
          canceled++;
          continue;
        }

        // 3) ha közben kattintott (count korrekt lekérése)
        const { count: clickedCount, error: clickErr } = await admin
          .from("reward_codes")
          .select("*", { count: "exact", head: true })
          .eq("wheel_id", t.wheel_id)
          .eq("user_email", t.user_email)
          .not("review_clicked_at", "is", null);
        if (clickErr) throw clickErr;
        if ((clickedCount ?? 0) > 0) {
          await admin.from("review_reminders")
            .update({ status: "canceled", canceled_at: new Date().toISOString(), locked_by: null, locked_at: null })
            .eq("id", t.id);
          canceled++;
          continue;
        }

        // 4) e‑mail adatok
        const { data: biz, error: bizErr } = await admin
          .from("business_profiles")
          .select("business_name, google_review_link")
          .eq("id", t.business_id)
          .maybeSingle();
        if (bizErr) throw bizErr;

        if (!biz?.google_review_link) {
          await admin.from("review_reminders")
            .update({ status: "canceled", canceled_at: new Date().toISOString(), locked_by: null, locked_at: null })
            .eq("id", t.id);
          canceled++;
          continue;
        }

        // 5) küldés (Resend)
        const subject = tr.subject(biz.business_name);
        const html = renderEmailHTML(tr, biz.google_review_link);

        const res = await resend.emails.send({
          from: FROM_EMAIL,
          to: t.user_email,
          subject,
          html,
        });

        if ((res as any)?.error) {
          throw new Error(`Resend error: ${(res as any).error?.message || "unknown"}`);
        }

        await admin.from("review_reminders")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            attempts: (undefined as unknown as number), // placeholder ignored
            locked_by: null,
            locked_at: null,
          })
          .eq("id", t.id);

        // attempts inkrement külön update-ben (Postgres: attempts = attempts + 1)
        await admin.rpc("noop"); // optional placeholder if you use RPCs; remove if not used
        await admin.from("review_reminders")
          .update({ attempts: (null as unknown as number) }) // TS placers ignored in Deno; we'll use raw SQL below
          .eq("id", t.id);

        // mivel supabase-js nem tud "attempts = attempts + 1"-et natívan, raw SQL:
        await admin.rpc("exec_sql", {
          q: "update public.review_reminders set attempts = coalesce(attempts,0) + 1 where id = $1::uuid",
          params: [t.id],
        }).catch(() => { /* ha nincs exec_sql RPC, ezt elhagyhatod */ });

        sent++;
      } catch (e) {
        // failed + last_error + unlock + attempts++
        await admin.from("review_reminders")
          .update({
            status: "failed",
            last_error: String(e).slice(0, 2000),
            locked_by: null,
            locked_at: null,
          })
          .eq("id", t.id);

        // attempts++
        await admin.rpc("exec_sql", {
          q: "update public.review_reminders set attempts = coalesce(attempts,0) + 1 where id = $1::uuid",
          params: [t.id],
        }).catch(() => {});

        failed++;
        continue;
      }
    }

    return new Response(
      JSON.stringify({ ok: true, processed: sent + canceled + failed, sent, canceled, failed }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unhandled", details: String(e) }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
