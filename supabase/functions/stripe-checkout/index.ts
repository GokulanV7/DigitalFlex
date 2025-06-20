// Import necessary dependencies
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@8.209.0?target=deno";

// Initialize Stripe with the secret key
const stripe = new Stripe("sk_test_51Rb3PQ01Huhx6RGCMub7olYXTt3TGD2DTxuJfvipYm2yY7veOCBQGqg1aeXqYk36rQqzBio9MyDB4jeuz5jo10eG00suvlBxqo", {
  apiVersion: "2022-11-15",
});

// Serve function for handling HTTP requests
serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      headers: { "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    const { item } = await req.json();

    if (!item || !item.id || !item.name || !item.price) {
      return new Response(JSON.stringify({ error: "Invalid item data" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/marketplace?payment=success&session_id={CHECKOUT_SESSION_ID}&item=${encodeURIComponent(item.name)}`,
      cancel_url: `${req.headers.get("origin")}/marketplace?payment=cancelled`,
      metadata: {
        collectible_id: item.id,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating Checkout Session:", error);
    return new Response(JSON.stringify({ error: "Failed to create Checkout Session" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}, { port: 54321 });
