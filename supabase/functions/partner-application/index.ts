// /supabase/functions/partner-application.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.2.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
};

// --- lokalizált szövegek ---
const i18n = {
  en: {
    subjectInternal: "New Partner Application",
    internalHeader: "New Partner Form Submission",
    confirmSubject: (name: string) => `Thanks for applying, ${name}!`,
    confirmHeader: "Thanks for your interest 🚀",
    confirmBody:
      "We've received your application and will come back to you within 24 hours.",
    yourData: "Your application details",
    regards: "Best regards,",
    team: "The Review‑to‑Revenue Team",
  },
  hu: {
    subjectInternal: "Új partner jelentkezés",
    internalHeader: "Új partner‑űrlap érkezett",
    confirmSubject: (name: string) => `Köszönjük a jelentkezést, ${name}!`,
    confirmHeader: "Köszönjük az érdeklődést 🚀",
    confirmBody:
      "Megkaptuk a jelentkezésed, 24 órán belül válaszolunk.",
    yourData: "A jelentkezésed adatai",
    regards: "Üdvözlettel,",
    team: "A Review to Revenue csapata",
  },
} as const;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  try {
    const body = await req.json();

    /* ---------- 1. validáció ---------- */
    const {
      name,
      email,
      country,
      link = "",
      hasContacts,
      note,
      language = "en",
    } = body as {
      name: string;
      email: string;
      country: string;
      link?: string;
      hasContacts: "yes" | "no";
      note: string;
      language?: "en" | "hu";
    };

    if (!name || !email || !country || !hasContacts || !note) {
      throw new Error("Missing required fields");
    }

    const t = i18n[language as keyof typeof i18n] ?? i18n.en;
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

    /* ---------- 2. belső értesítő ---------- */
    const { error: intErr } = await resend.emails.send({
      from: "Partner Form <partners@reviewtorevenue.io>",
      to: Deno.env.get("TEAM_EMAIL") ?? "hello@reviewtorevenue.io",     // belső értesítő
      subject: `${t.subjectInternal}: ${name}`,
      html: `
        <h2 style="color:#4FC3F7;margin:0 0 16px">${t.internalHeader}</h2>
        <table style="font-family:Arial;font-size:14px">
          <tr><td><b>Name:</b></td><td>${name}</td></tr>
          <tr><td><b>Email:</b></td><td>${email}</td></tr>
          <tr><td><b>Country:</b></td><td>${country}</td></tr>
          <tr><td><b>Hospitality network:</b></td><td>${hasContacts}</td></tr>
          ${link ? `<tr><td><b>Link:</b></td><td>${link}</td></tr>` : ""}
        </table>
        <p style="margin-top:16px;white-space:pre-wrap"><b>Motivation:</b><br>${note}</p>
      `,
    });
    if (intErr) throw intErr;

    /* ---------- 3. visszaigazoló ---------- */
    const { error: confErr } = await resend.emails.send({
      from: "Review‑to‑Revenue <hello@reviewtorevenue.io>",
      to: email,                           // visszaigazoló a jelentkezőnek
      subject: t.confirmSubject(name.split(" ")[0]),
      html: `
        <h2 style="color:#4FC3F7">${t.confirmHeader}</h2>
        <p>${t.confirmBody}</p>
        <h4 style="margin-bottom:4px">${t.yourData}</h4>
        <ul style="margin-top:0;font-size:14px">
          <li><b>Name:</b> ${name}</li>
          <li><b>Country:</b> ${country}</li>
          <li><b>Hospitality network:</b> ${hasContacts}</li>
          ${link ? `<li><b>Link:</b> ${link}</li>` : ""}
        </ul>
        <p style="margin-top:16px;white-space:pre-wrap">
          <b>Motivation:</b><br>${note}
        </p>
        <p>${t.regards}<br/>${t.team}</p>
      `,
    });
    if (confErr) throw confErr;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("edge‑function error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});
