// Vercel Serverless Function to create a Stripe Checkout Session
const Stripe = require('stripe');

// Initialize Stripe with the secret key (should be set in Vercel environment variables)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { item, successUrl, cancelUrl } = req.body;

    if (!item || !item.id || !item.name || !item.price) {
      return res.status(400).json({ error: 'Invalid item data' });
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || 'https://digital-flex.vercel.app/marketplace?payment=success',
      cancel_url: cancelUrl || 'https://digital-flex.vercel.app/marketplace?payment=cancelled',
      metadata: {
        collectible_id: item.id,
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Checkout Session:', error);
    return res.status(500).json({ error: 'Failed to create Checkout Session' });
  }
};
