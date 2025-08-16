import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    const apiKey = Deno.env.get("MAILERLITE_API_KEY");

    if (!email || !apiKey) {
      throw new Error("Missing email or API key");
    }

    // Frissítés a MailerLite v2 API-n keresztül
    const res = await fetch(
      `https://api.mailerlite.com/api/v2/subscribers/${encodeURIComponent(email)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-MailerLite-ApiKey": apiKey,
        },
        body: JSON.stringify({
          fields: {
            purchase: "yes",
          },
        }),
      }
    );

    const responseJson = await res.json();
    console.log("🧾 MailerLite UPDATE:", res.status, responseJson);

    return new Response(
      JSON.stringify({ success: res.ok }),
      {
        status: res.ok ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("❌ Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 400, headers: corsHeaders }
    );
  }
});
