// api/index.js
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is up and running' });
});

// Chat endpoint
const axios = require('axios');
app.post('/chat', async (req, res) => {
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
    console.error('Groq API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
  const { item, successUrl, cancelUrl } = req.body;

  const finalSuccessUrl = successUrl || `${req.headers.origin}/marketplace?payment=success&item=${encodeURIComponent(item.name)}`;
  const finalCancelUrl = cancelUrl || `${req.headers.origin}/marketplace?payment=cancelled`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: item.name },
            unit_amount: Math.max(50, Math.round(item.price * 100)),
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        collectible_id: item.id,
        item_name: item.name,
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export serverless handler
module.exports = serverless(app);
