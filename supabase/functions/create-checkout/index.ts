import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get cart items from request body
    const { items } = await req.json();
    logStep("Received items", { itemCount: items?.length });

    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    // Get authenticated user (optional - allows guest checkout)
    let userEmail: string | null = null;
    let customerId: string | undefined;
    
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user?.email) {
        userEmail = data.user.email;
        logStep("User authenticated", { email: userEmail });
      }
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer exists
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Found existing Stripe customer", { customerId });
      }
    }

    // Build line items for Stripe checkout
    // For simplicity, we use the VIP price for all items and calculate based on quantity
    // In a production app, you'd map each item to its Stripe price_id
    const lineItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    logStep("Creating checkout session", { lineItems: lineItems.length });

    // Get origin with fallback - the tool test might not send origin header
    const rawOrigin = req.headers.get("origin");
    const origin = rawOrigin && rawOrigin.startsWith("http") 
      ? rawOrigin 
      : "https://id-preview--1cd3eb4a-9672-46bf-864a-717280a30431.lovable.app";
    
    logStep("Using origin", { origin, rawOrigin });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail || undefined,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/`,
      metadata: {
        items: JSON.stringify(items.map((i: { id: string; type: string }) => ({ id: i.id, type: i.type }))),
      },
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
