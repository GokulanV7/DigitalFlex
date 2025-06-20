import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Shield, Zap, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { setPaymentSuccess, setPaymentDetails } from '@/store/index.ts';
import { RootState } from '@/store/index.ts';

interface CollectibleItem {
  id: string;
  name: string;
  price: number;
  image: string;
  creator: string;
  quantity: number;
}

const StripeCheckout = () => {
  const [selectedItem, setSelectedItem] = useState<CollectibleItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paymentSuccess = useSelector((state: RootState) => state.stripe.paymentSuccess);

  // Initialize Stripe with the public key
  const stripePromise = loadStripe('pk_test_51Rb3PQ01Huhx6RGCXNBpqUJwNdtHkunBFVI5AdGdI6oga1500gPQPzRQruS4NHySGJAii8tubFebGCzcDKDiZd8R00paNwaQeU');

  const featuredItems: CollectibleItem[] = [
    {
      id: '1',
      name: 'Golden Dragon Collection',
      price: 2.5,
      image: 'from-yellow-400 via-orange-500 to-red-500',
      creator: 'ArtistDAO',
      quantity: 5
    },
    {
      id: '2',
      name: 'Cyber Genesis NFT',
      price: 1.8,
      image: 'from-blue-500 to-cyan-500',
      creator: 'TechCreator',
      quantity: 3
    },
    {
      id: '3',
      name: 'Nature\'s Harmony',
      price: 0.9,
      image: 'from-green-500 to-emerald-500',
      creator: 'EcoArtist',
      quantity: 10
    },
    {
      id: '4',
      name: 'Mystic Realms',
      price: 3.2,
      image: 'from-purple-500 to-pink-500',
      creator: 'MysticStudio',
      quantity: 2
    }
  ];

  const handlePurchase = async (item: CollectibleItem) => {
    setSelectedItem(item);
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const stripe = await stripePromise;
      const { user } = useAuth(); // Get user from AuthContext to associate purchase
      if (!stripe) {
        throw new Error('Stripe failed to load.');
      }
      console.log('Initiating payment process for:', item.name);

      // Send request to Vercel Serverless Function to create a Checkout Session
      const successUrl = `https://digital-flex.vercel.app/success?payment=success&item=${encodeURIComponent(item.name)}`;
      const cancelUrl = `https://digital-flex.vercel.app/cancel?payment=cancelled`;
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item, successUrl, cancelUrl }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create Checkout Session: ${errorText}`);
      }

      const { sessionId } = await response.json();

      // Set payment details in Redux store before redirecting
      dispatch(setPaymentSuccess(false)); // Reset to false initially
      dispatch(setPaymentDetails(item));

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }

      setIsProcessing(false);
      
      // Simulate saving purchase data to Supabase
      try {
        const { error } = await supabase.from('purchases').insert([
          {
            user_id: user?.id || 'anonymous',
            amount: item.price, // Mapping price to amount as per expected schema
            collectible_id: item.id, // Using collectible_id instead of item_id
            status: 'completed', // Adding a status field for the purchase
            created_at: new Date().toISOString(), // Using created_at instead of purchased_at
          }
        ]);
        if (error) throw error;
        console.log('Purchase saved to Supabase');
      } catch (error) {
        console.error('Error saving purchase to Supabase:', error);
      }
    } catch (error) {
      console.error('Error during Stripe checkout:', error);
      setIsProcessing(false);
      setErrorMessage('Failed to process payment. Please try again.');
    }
  };

  // Removed useEffect for navigation since Stripe handles redirection to successUrl
  if (paymentSuccess && selectedItem) {
    // This UI is intended to be shown briefly before Stripe redirects to success_url
    // In a real implementation, consider handling success confirmation via webhooks or session status
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-xl transform transition-all animate-bounce-in">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Payment Successful!</h3>
            <p className="text-slate-400 mb-6">
              Congratulations! You now own <span className="text-purple-400 font-semibold">{selectedItem.name}</span>
            </p>
            
            <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Transaction ID</span>
                  <div className="font-mono text-purple-400">TX_1234567890</div>
                </div>
                <div>
                  <span className="text-slate-500">Gas Fee</span>
                  <div className="text-white">0.005 ETH</div>
                </div>
                <div>
                  <span className="text-slate-500">Total Paid</span>
                  <div className="text-white font-bold">{selectedItem.price + 0.005} ETH</div>
                </div>
                <div>
                  <span className="text-slate-500">Status</span>
                  <div className="text-green-400 font-semibold">Confirmed</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-500 mb-6">
              Your collectible will appear in your wallet within 5-10 minutes.
            </div>
            
            <button
              onClick={() => {
                dispatch(setPaymentSuccess(false));
                setSelectedItem(null);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing && selectedItem) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-white mb-3">Processing Payment</h3>
          <p className="text-slate-400 mb-6">
            Please wait while we process your purchase of <span className="text-purple-400">{selectedItem.name}</span>
          </p>
          
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Amount</span>
              <span className="text-white font-bold">{selectedItem.price} ETH</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-slate-500 text-sm">
            <Shield size={16} />
            <span>Secured by Stripe & Blockchain</span>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage && selectedItem) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={40} className="text-red-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-3">Payment Failed</h3>
          <p className="text-slate-400 mb-6">
            {errorMessage} for <span className="text-purple-400 font-semibold">{selectedItem.name}</span>
          </p>
          
          <button
            onClick={() => {
              setErrorMessage(null);
              setSelectedItem(null);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Featured Collectibles</h2>
        <p className="text-slate-400">Purchase premium digital assets with secure blockchain technology.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredItems.map((item) => (
          <div key={item.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 group">
            {/* Item Image */}
            <div className={`w-full h-48 bg-gradient-to-br ${item.image} rounded-lg mb-4 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-xs font-semibold">{item.quantity} left</span>
              </div>
            </div>

            {/* Item Info */}
            <div className="mb-4">
              <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
              <p className="text-slate-400 text-sm mb-3">by {item.creator}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-sm">Price</span>
                  <div className="text-2xl font-bold text-purple-400">{item.price} ETH</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-sm">~$</span>
                  <div className="text-white font-semibold">{(item.price * 2000).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={() => handlePurchase(item)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2"
            >
              <CreditCard size={20} />
              <span>Buy Now</span>
              <Zap size={16} />
            </button>

            {/* Trust Indicators */}
            <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <Shield size={12} />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Check size={12} />
                <span>Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap size={12} />
                <span>Instant</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Info */}
      <div className="mt-8 bg-slate-800/30 border border-slate-700/30 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield size={24} className="text-green-400" />
          <h3 className="text-white font-semibold">Secure Payment Processing</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-green-400" />
            <span className="text-slate-300">SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-green-400" />
            <span className="text-slate-300">Stripe Protected</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-green-400" />
            <span className="text-slate-300">Blockchain Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
