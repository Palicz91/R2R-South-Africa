import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.2.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "content-type, authorization, apikey, x-client-info",
};

const emailTranslations = {
  en: {
    thanksHeader: 'Thanks for reaching out!',
    thanksBody: "Thanks for contacting us. We've received your message and will get back to you within 24 hours.",
    yourMessage: 'Your message:',
    seeUseCases: 'Use Cases',
    replyNote: "Have questions? Just reply to this email – we're here to help!",
    cta: 'Read Our Use Cases',
    regards: 'Best regards,',
    team: 'The Review to Revenue Team'
  },
  hu: {
    thanksHeader: 'Köszönjük, hogy írtál nekünk!',
    thanksBody: 'Megkaptuk az üzeneted, és 24 órán belül válaszolunk.',
    yourMessage: 'Az üzeneted:',
    seeUseCases: 'Felhasználási példák',
    replyNote: 'Kérdésed van? Egyszerűen válaszolj erre az e-mailre – szívesen segítünk!',
    cta: 'Nézd meg kiknek ajánljuk a Review to Revenue-t',
    regards: 'Üdvözlettel,',
    team: 'A Review to Revenue csapata'
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const { record, language = 'en' } = await req.json();

    if (!record) {
      throw new Error("Missing record data");
    }

    const full_name = record.full_name || record.fullName;
    const email = record.email;
    const topic = record.topic;
    const message = record.message;
    
    const t = emailTranslations[language as keyof typeof emailTranslations] || emailTranslations.en;

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Internal email (always in English)
    const { error: internalError } = await resend.emails.send({
      from: "Review to Revenue <contact@reviewtorevenue.io>",
      to: ["hello@reviewtorevenue.io"],
      subject: `New Contact Message from ${full_name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .content {
              background: white;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .field {
              margin-bottom: 16px;
            }
            .label {
              font-weight: bold;
              color: #64748b;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .value {
              margin-top: 4px;
            }
            .message {
              white-space: pre-wrap;
              background: #f8fafc;
              padding: 16px;
              border-radius: 6px;
              margin-top: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin:0;color:#4FC3F7;font-size:24px;">New Contact Form Submission</h1>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">From</div>
              <div class="value">${full_name}</div>
            </div>

            <div class="field">
              <div class="label">Email</div>
              <div class="value">${email}</div>
            </div>

            <div class="field">
              <div class="label">Topic</div>
              <div class="value">${topic}</div>
            </div>

            <div class="field">
              <div class="label">Message</div>
              <div class="message">${message}</div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (internalError) throw internalError;

    // User confirmation email (localized)
    const { error: confirmationError } = await resend.emails.send({
      from: "Review to Revenue <hello@reviewtorevenue.io>",
      to: [email],
      subject: `${t.thanksHeader} ${full_name}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${t.thanksHeader}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 8px;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 24px;
            }
            .content {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #64748b;
              margin-top: 24px;
            }
            .button {
              display: inline-block;
              background: #4FC3F7;
              color: white;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              margin-top: 16px;
            }
            .button:hover {
              background: #33BFFF;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color:#4FC3F7;margin:0;">${t.thanksHeader}</h1>
            </div>

            <p>Hi ${full_name},</p>

            <p>${t.thanksBody}</p>

            <div class="content">
              <strong>${t.yourMessage}</strong><br>
              ${message}
            </div>

            <p>${t.replyNote}</p>

            <div style="text-align:center;">
              <a href="https://reviewtorevenue.io/use-cases" class="button">
                ${t.cta}
              </a>
            </div>

            <div class="footer">
              <p>${t.regards}<br>${t.team}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (confirmationError) throw confirmationError;

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error sending notification:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while sending the notification",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
