import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { Resend } from "npm:resend@3.2.0";
import QRCode from "npm:qrcode@1.5.3";

// Translation types and utilities
type Language = 'en' | 'hu' | 'de';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    emailSubject: "Your reward is ready 🎁",
    emailGreeting: "Hey there",
    emailThanks: "Thanks for being part of the experience 🙌",
    emailWinMessage: "You spun the wheel—and you've just won",
    emailImportant: "Important",
    emailQrCodeTitle: "Your reward QR code:",
    emailQrCodeInstructions: "Show this QR code to staff to redeem your reward",
    emailQrBackupLinkText: "QR code hiding? You can open it here",
    emailHope: "We hope this little surprise adds something nice to your day!",
    emailSignature: "With appreciation,",
    emailTeam: "The team",
    emailWarningOneTime: "Your QR code can only be used once",
    emailWarningExpiry: "It expires on",
    emailPS: "PS: Know someone who could benefit from getting more Google reviews and turning them into revenue?",
    emailPSLinkText: "👉 Try Review to Revenue – simple, powerful, and made for local businesses 🚀",
  },
  hu: {
    emailSubject: "A jutalmad készen áll 🎁",
    emailGreeting: "Szia",
    emailThanks: "Köszönjük, hogy velünk játszottál 🙌, ",
    emailWinMessage: "Megforgattad a kereket – és nyertél",
    emailImportant: "Fontos",
    emailQrCodeTitle: "A QR kódod:",
    emailQrCodeInstructions: "Mutasd meg ezt a QR kódot a személyzetnek a jutalom beváltásához",
    emailQrBackupLinkText: "A QR kód rejtőzködik? Nyisd meg itt",
    emailHope: "Reméljük, ez a kis meglepetés bearanyozza a napodat!",
    emailSignature: "Üdvözlettel,",
    emailTeam: "A csapat",
    emailWarningOneTime: "A QR kód csak egyszer szekkenlhető be",
    emailWarningExpiry: "Lejárati dátum",
    emailPS: "UI: Ismersz olyat, akinek jól jönne néhány Google értékelés és több bevétel?",
    emailPSLinkText: "👉 Próbáld ki a Review to Revenue-t – egyszerű, hatékony, és kifejezetten helyi vállalkozásoknak készült 🚀",
  },
  de: {
    emailSubject: "Deine Belohnung ist bereit 🎁",
    emailGreeting: "Hallo",
    emailThanks: "Danke, dass du Teil des Erlebnisses bist 🙌",
    emailWinMessage: "Du hast das Rad gedreht—und gewonnen",
    emailImportant: "Wichtig",
    emailQrCodeTitle: "Dein Belohnungs-QR-Code:",
    emailQrCodeInstructions: "Zeige diesen QR-Code dem Personal, um deine Belohnung einzulösen",
    emailQrBackupLinkText: "QR-Code nicht sichtbar? Hier klicken",
    emailHope: "Wir hoffen, diese kleine Überraschung versüßt deinen Tag!",
    emailSignature: "Mit freundlichen Grüßen,",
    emailTeam: "Das Team",
    emailWarningOneTime: "Dein QR-Code kann nur einmal verwendet werden",
    emailWarningExpiry: "Er läuft ab am",
    emailPS: "PS: Kennst du jemanden, der von mehr Google-Bewertungen profitieren und daraus Einnahmen erzielen könnte?",
    emailPSLinkText: "👉 Probiere Review to Revenue – einfach, effektiv und für lokale Unternehmen gemacht 🚀",
  }
};

const getTranslations = (lang: Language) => translations[lang] || translations['en'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface EmailPayload {
  email: string;
  prize: string;
  rewardCode: string;
  businessName: string;
  logoUrl?: string;
  wheelId: string;
  language?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('Server configuration error: Missing email service credentials');
    }

    const resend = new Resend(resendApiKey);
    const payload: EmailPayload = await req.json();
    console.log('[send-reward-email] Incoming payload:', JSON.stringify(payload, null, 2));

    const { email, prize, rewardCode, businessName, logoUrl, wheelId, language } = payload;
    const safeLanguage = (language === 'hu' || language === 'en' || language === 'de') ? language : 'en';
    const t = getTranslations(safeLanguage as Language);


    if (!email || !prize || !rewardCode || !wheelId || !businessName) {
      console.error('[send-reward-email] Missing required fields:', { email, prize, rewardCode, wheelId, businessName });
      throw new Error('Missing required fields in request');
    }

    // Get wheel project expiry setting
    const { data: wheelProject, error: wheelError } = await supabase
      .from('wheel_projects')
      .select('expires_in_days')
      .eq('id', wheelId)
      .single();

    if (wheelError) throw wheelError;
    if (!wheelProject) throw new Error('Wheel project not found');

    // Generate QR code buffer
    const qrBuffer = await QRCode.toBuffer(`${Deno.env.get('FRONTEND_URL')}/qr/${rewardCode}`, {
      width: 400,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    // Upload QR code to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('qr-codes')
      .upload(`${rewardCode}.png`, qrBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL for the uploaded QR code
    const { data: { publicUrl: qrCodeUrl } } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(`${rewardCode}.png`);

    if (!qrCodeUrl) throw new Error('Failed to get QR code public URL');

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + wheelProject.expires_in_days);
    const localeMap: {[key in Language]: string} = {
      'en': 'en-US',
      'hu': 'hu-HU',
      'de': 'de-DE'
    };
    const formattedExpiryDate = expiryDate.toLocaleDateString(
      localeMap[safeLanguage as Language] || 'en-US', 
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );

    // Send email with embedded QR code
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'hello@reviewtorevenue.io',
      to: email,
      subject: `${t.emailSubject} - ${businessName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="description" content="You've won ${prize} — your QR code is inside.">
          <style>
            body { 
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #374151;
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px;
              margin: 0 auto;
              padding: 32px 24px;
            }
            .logo {
              max-width: 120px;
              margin: 0 auto 24px;
              display: block;
            }
            .warning {
              background-color: #fee2e2;
              border: 1px solid #fecaca;
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
              color: #991b1b;
            }
            .qr-code {
              background: white;
              padding: 16px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              margin: 24px auto;
              width: 200px;
            }
            .divider {
              border-top: 1px solid #e5e7eb;
              margin: 32px 0;
            }
            .footer {
              font-size: 14px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${logoUrl ? `<img src="${logoUrl}" alt="${businessName}" class="logo">` : ''}
            
            <p>${t.emailGreeting},</p>
            
            <p>
              ${t.emailThanks} ${businessName}<br>
              ${t.emailWinMessage} <strong>${safeLanguage === 'hu' ? prize + '-t' : prize}</strong> 🎉
            </p>

            <div class="warning">
              <strong>⚠️ ${t.emailImportant}:</strong>
              <ul>
                <li>${t.emailWarningOneTime}</li>
                <li>${t.emailWarningExpiry} <strong>${formattedExpiryDate}</strong></li>
              </ul>
            </div>

            <div style="text-align: center;">
              <p>🎁 ${t.emailQrCodeTitle}</p>
              <img 
                src="${qrCodeUrl}" 
                alt="Your Reward QR Code"
                style="width: 200px; height: 200px; margin: 16px auto; display: block;"
              >
              <p style="color: #4b5563; font-size: 14px;">
                ${t.emailQrCodeInstructions}
              </p>
              <a href="${qrCodeUrl}" style="color: #2563eb; text-decoration: underline;">
                ${t.emailQrBackupLinkText}
              </a>
            </div>

            <p>${t.emailHope}</p>
            
            <p>
              ${t.emailSignature}<br>
              ${t.emailTeam} ${businessName}
            </p>
            
            <div class="divider"></div>
            
            <div class="footer">
              <p>
                ${t.emailPS}<br>
                <a href="https://reviewtorevenue.io" style="color: #2563eb; text-decoration: none;">
                  ${t.emailPSLinkText}
                </a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (emailError) throw emailError;

    // Track in emails_sent table
    const { error: trackingError } = await supabase
      .from('emails_sent')
      .insert({
        wheel_id: wheelId,
        email,
        prize,
        reward_code: rewardCode,
        sent_at: new Date().toISOString()
      });

    if (trackingError) throw trackingError;

    // Log the event
    const { error: eventError } = await supabase
      .from('flow_events')
      .insert({
        wheel_id: wheelId,
        event: 'email_sent',
        metadata: {
          email,
          prize,
          reward_code: rewardCode,
          qr_code_url: qrCodeUrl,
          expires_at: expiryDate.toISOString()
        },
        ts: new Date().toISOString()
      });

    if (eventError) throw eventError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-reward-email function:', JSON.stringify(error, null, 2));
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});