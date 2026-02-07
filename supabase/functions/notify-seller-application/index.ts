import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ApplicationRequest {
  applicationId: string;
  serverName: string;
  serverIp: string;
  discordUrl?: string;
  reason: string;
  applicantEmail: string;
  applicantName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify user is authenticated
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const {
      applicationId,
      serverName,
      serverIp,
      discordUrl,
      reason,
      applicantEmail,
      applicantName,
    }: ApplicationRequest = await req.json();

    // Validate required fields
    if (!applicationId || !serverName || !serverIp || !reason) {
      throw new Error("Missing required fields");
    }

    const adminEmail = "elabdellaouisalman11@gmail.com";
    const baseUrl = Deno.env.get("SUPABASE_URL")!;
    
    // Create approve/reject URLs that will be handled by an edge function
    const approveUrl = `${baseUrl}/functions/v1/handle-seller-decision?id=${applicationId}&action=approve`;
    const rejectUrl = `${baseUrl}/functions/v1/handle-seller-decision?id=${applicationId}&action=reject`;

    const emailResponse = await resend.emails.send({
      from: "Core CMS <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🎮 طلب بائع جديد: ${serverName}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #1a1a2e; color: #fff; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 16px; padding: 30px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #22c55e; margin: 0; font-size: 28px; }
            .info-card { background: #0f3460; border-radius: 12px; padding: 20px; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1a1a2e; }
            .info-row:last-child { border-bottom: none; }
            .label { color: #94a3b8; }
            .value { color: #fff; font-weight: 600; }
            .reason-box { background: #0f3460; border-radius: 12px; padding: 20px; margin: 20px 0; }
            .reason-box h3 { color: #22c55e; margin-top: 0; }
            .buttons { display: flex; gap: 15px; justify-content: center; margin-top: 30px; }
            .btn { display: inline-block; padding: 15px 40px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; }
            .btn-approve { background: linear-gradient(135deg, #22c55e, #16a34a); color: #000; }
            .btn-reject { background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎮 طلب بائع جديد</h1>
              <p style="color: #94a3b8;">شخص يريد الانضمام كبائع في Core CMS</p>
            </div>
            
            <div class="info-card">
              <div class="info-row">
                <span class="label">اسم المتقدم:</span>
                <span class="value">${applicantName}</span>
              </div>
              <div class="info-row">
                <span class="label">البريد الإلكتروني:</span>
                <span class="value">${applicantEmail}</span>
              </div>
              <div class="info-row">
                <span class="label">اسم السيرفر:</span>
                <span class="value">${serverName}</span>
              </div>
              <div class="info-row">
                <span class="label">عنوان السيرفر:</span>
                <span class="value" style="font-family: monospace;">${serverIp}</span>
              </div>
              ${discordUrl ? `
              <div class="info-row">
                <span class="label">Discord:</span>
                <span class="value"><a href="${discordUrl}" style="color: #60a5fa;">${discordUrl}</a></span>
              </div>
              ` : ''}
            </div>
            
            <div class="reason-box">
              <h3>سبب الانضمام:</h3>
              <p style="line-height: 1.8;">${reason}</p>
            </div>
            
            <div class="buttons">
              <a href="${approveUrl}" class="btn btn-approve">✅ قبول الطلب</a>
              <a href="${rejectUrl}" class="btn btn-reject">❌ رفض الطلب</a>
            </div>
            
            <div class="footer">
              <p>Core CMS - منصة متاجر Minecraft</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Seller application notification sent:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-seller-application:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message === "Unauthorized" ? 401 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
