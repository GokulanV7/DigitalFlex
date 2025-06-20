const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Environment variables
const port = process.env.PORT || 3002;

// Initialize Stripe with the secret key from environment variables
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here');


// Middleware
app.use(cors());
app.use(express.json());

const axios = require('axios');

// Endpoint for chat with Groq integration
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

// Endpoint to create a Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { item, successUrl, cancelUrl } = req.body;

  console.log('Received successUrl:', successUrl);
  console.log('Received cancelUrl:', cancelUrl);

  // Use provided URLs or fallback to marketplace
  const finalSuccessUrl = successUrl || `${new URL(req.headers.origin || 'http://localhost:3000').origin}/marketplace?payment=success&item=${encodeURIComponent(item.name)}`;
  const finalCancelUrl = cancelUrl || `${new URL(req.headers.origin || 'http://localhost:3000').origin}/marketplace?payment=cancelled`;

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
            unit_amount: Math.max(50, Math.round(item.price * 100)), // Convert to cents, ensure minimum of 50 cents
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
    console.error('Stripe Error Details:', JSON.stringify(error, null, 2));
    res.status(500).json({ error: `Failed to create checkout session: ${error.message}` });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
