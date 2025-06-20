const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is up and running' });
});

const axios = require('axios');

app.post('/chat', async (req, res) => {
  console.log('Received request to /chat endpoint');
  const { message } = req.body;
  const apiKey = process.env.GROQ_API_KEY || 'your_groq_api_key_here';

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'gemma2-9b-it',
        messages: [
          { role: 'system', content: 'You are a trade assistant. Help users with trading strategies, market analysis, and collectible valuation.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    if (error.response) {
      console.error('Groq API response error:', error.response.data);
      res.status(500).json({ error: `Failed to get response from Groq API: ${error.message}`, details: error.response.data });
    } else {
      res.status(500).json({ error: `Failed to get response from Groq API: ${error.message}` });
    }
  }
});

app.post('/create-checkout-session', async (req, res) => {
  const { item } = req.body;

  const finalSuccessUrl = 'https://digital-flex.vercel.app/marketplace?session_id={CHECKOUT_SESSION_ID}';
  const finalCancelUrl = 'https://digital-flex.vercel.app/marketplace?payment=cancelled';

  console.log('Final successUrl:', finalSuccessUrl);
  console.log('Final cancelUrl:', finalCancelUrl);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: Math.max(50, Math.round(item.price * 100)),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        collectible_id: item.id,
        item_name: item.name,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: `Failed to create checkout session: ${error.message}` });
  }
});

app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'your_webhook_secret_here';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout Session completed:', session.id);
      console.log('Payment successful for:', session.metadata.item_name);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});