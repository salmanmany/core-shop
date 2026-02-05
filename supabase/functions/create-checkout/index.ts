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

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get cart items and optional storeId from request body
    const { items, storeId } = await req.json();
    logStep("Received items", { itemCount: items?.length, storeId });

    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    // Get authenticated user (optional - allows guest checkout)
    let userEmail: string | null = null;
    let userId: string | null = null;
    let customerId: string | undefined;
    
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user?.email) {
        userEmail = data.user.email;
        userId = data.user.id;
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
    const lineItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    logStep("Creating checkout session", { lineItems: lineItems.length });

    // Get origin with fallback
    const rawOrigin = req.headers.get("origin");
    const origin = rawOrigin && rawOrigin.startsWith("http") 
      ? rawOrigin 
      : "https://id-preview--1cd3eb4a-9672-46bf-864a-717280a30431.lovable.app";
    
    logStep("Using origin", { origin });

    // Calculate total
    const totalAmount = items.reduce((sum: number, item: { price: number; quantity: number }) => 
      sum + (item.price * item.quantity), 0);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail || undefined,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: {
        items: JSON.stringify(items.map((i: { id: string; type: string }) => ({ id: i.id, type: i.type }))),
        storeId: storeId || '',
        userId: userId || '',
      },
    });

    logStep("Checkout session created", { sessionId: session.id });

    // Create order record if storeId is provided (multi-vendor checkout)
    if (storeId) {
      const { error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          store_id: storeId,
          buyer_id: userId,
          buyer_email: userEmail || 'guest@checkout.com',
          stripe_session_id: session.id,
          status: 'pending',
          total_amount: totalAmount,
          currency: 'usd',
        });

      if (orderError) {
        logStep("Error creating order", { error: orderError.message });
      } else {
        logStep("Order created for store", { storeId });
      }
    }

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
