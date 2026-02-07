import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const applicationId = url.searchParams.get("id");
    const action = url.searchParams.get("action");

    if (!applicationId || !action || !["approve", "reject"].includes(action)) {
      throw new Error("Invalid parameters");
    }

    // Use service role key for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the application
    const { data: application, error: fetchError } = await supabase
      .from("seller_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (fetchError || !application) {
      console.error("Error fetching application:", fetchError);
      throw new Error("Application not found");
    }

    if (application.status !== "pending") {
      return new Response(
        generateHtmlResponse(
          "⚠️ تم معالجة هذا الطلب مسبقاً",
          `حالة الطلب الحالية: ${application.status === 'approved' ? 'مقبول ✅' : 'مرفوض ❌'}`,
          "warning"
        ),
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    // Update the application status
    const { error: updateError } = await supabase
      .from("seller_applications")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", applicationId);

    if (updateError) {
      console.error("Error updating application:", updateError);
      throw new Error("Failed to update application");
    }

    // If approved, grant seller role to the user
    if (action === "approve") {
      // Check if user already has seller role
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", application.user_id)
        .eq("role", "seller")
        .single();

      if (!existingRole) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: application.user_id, role: "seller" });

        if (roleError) {
          console.error("Error granting seller role:", roleError);
        }
      }

      // Create the store for the seller
      const slug = application.server_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const { error: storeError } = await supabase
        .from("stores")
        .insert({
          owner_id: application.user_id,
          name: application.server_name,
          slug: slug + "-" + Date.now().toString(36),
          server_ip: application.server_ip,
          discord_url: application.discord_url,
          status: "approved",
        });

      if (storeError) {
        console.error("Error creating store:", storeError);
      }
    }

    const title = action === "approve" 
      ? "✅ تم قبول الطلب بنجاح!"
      : "❌ تم رفض الطلب";
    
    const message = action === "approve"
      ? `تم قبول طلب "${application.server_name}" ومنح صلاحيات البائع وإنشاء المتجر.`
      : `تم رفض طلب "${application.server_name}".`;

    console.log(`Seller application ${applicationId} ${action}ed`);

    return new Response(
      generateHtmlResponse(title, message, action === "approve" ? "success" : "error"),
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (error: any) {
    console.error("Error in handle-seller-decision:", error);
    return new Response(
      generateHtmlResponse("❌ حدث خطأ", error.message, "error"),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
};

function generateHtmlResponse(title: string, message: string, type: "success" | "error" | "warning"): string {
  const colors = {
    success: { bg: "#22c55e", icon: "✅" },
    error: { bg: "#ef4444", icon: "❌" },
    warning: { bg: "#f59e0b", icon: "⚠️" },
  };

  const { bg } = colors[type];

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Core CMS - ${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          padding: 20px;
        }
        .container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 50px;
          text-align: center;
          max-width: 500px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .icon {
          width: 100px;
          height: 100px;
          background: ${bg};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          margin: 0 auto 30px;
          box-shadow: 0 0 40px ${bg}60;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 15px;
          color: #fff;
        }
        p {
          color: #94a3b8;
          font-size: 16px;
          line-height: 1.8;
        }
        .footer {
          margin-top: 40px;
          color: #64748b;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">${colors[type].icon}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <div class="footer">
          <p>Core CMS - منصة متاجر Minecraft</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
