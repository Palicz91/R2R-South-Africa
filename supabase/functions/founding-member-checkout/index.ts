// supabase/functions/founding-member-checkout/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.1";

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
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Auth (opcionális, de ajánlott): azonosítjuk a usert a Bearer tokenből
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice("Bearer ".length);
      const { data } = await supabase.auth.getUser(token);
      userId = data.user?.id ?? null;
    }

    const { addonQty = 0, customerEmail } = await req.json();
    const qty = Math.max(0, Math.min(Number(addonQty) || 0, 20)); // szerver oldali limit

    const basePrice = Deno.env.get("STRIPE_PRICE_BASE_ID");
    const addonPrice = Deno.env.get("STRIPE_PRICE_ADDON_ID");
    if (!basePrice || !addonPrice) {
      throw new Error("Missing STRIPE_PRICE_BASE_ID / STRIPE_PRICE_ADDON_ID");
    }

    const line_items: any[] = [{ price: basePrice, quantity: 1 }];
    if (qty > 0) line_items.push({ price: addonPrice, quantity: qty });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      allow_promotion_codes: true,
      customer_email: customerEmail || undefined,
      success_url: `${Deno.env.get("FRONTEND_URL")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get("FRONTEND_URL")}/pricing?canceled=1`,
      metadata: {
        kind: "founding_member_lifetime",
        addon_qty: String(qty),
        user_id: userId || "",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("FM checkout error:", e);
    return new Response(
      JSON.stringify({ error: e?.message ?? "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
