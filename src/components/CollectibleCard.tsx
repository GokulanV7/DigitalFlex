import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Star, ShoppingCart, TrendingUp, Eye, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface CollectibleCardProps {
  collectible: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    rarity: string;
    image_url?: string;
    user_id: string;
  };
  showActions?: boolean;
}

const CollectibleCard: React.FC<CollectibleCardProps> = ({ collectible, showActions = true }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100) + 10);
  const navigate = useNavigate();

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase collectibles.",
        variant: "destructive"
      });
      return;
    }

    try {
      const stripe = await loadStripe('pk_test_51Rb3PQ01Huhx6RGCXNBpqUJwNdtHkunBFVI5AdGdI6oga1500gPQPzRQruS4NHySGJAii8tubFebGCzcDKDiZd8R00paNwaQeU');
      if (!stripe) {
        throw new Error('Stripe failed to load.');
      }

      const item = {
        id: collectible.id,
        name: collectible.title,
        price: collectible.price
      };

      const successUrl = `${window.location.origin}/marketplace?payment=success&item=${encodeURIComponent(collectible.title)}`;
      const cancelUrl = `${window.location.origin}/marketplace`;

      const response = await fetch('http://localhost:3002/create-checkout-session', {
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
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast({
        title: "Purchase Successful!",
        description: `You've successfully purchased "${collectible.title}" for ${collectible.price} ETH.`
      });

      // Log user activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'purchase',
          description: `Purchased "${collectible.title}"`,
          metadata: { collectible_id: collectible.id, price: collectible.price }
        });

      // Record the purchase to link collectible to user
      await supabase
        .from('user_collectibles')
        .insert({
          user_id: user.id,
          collectible_id: collectible.id,
          purchase_price: collectible.price,
          purchased_at: new Date().toISOString()
        });

    } catch (error) {
      console.error('Error purchasing collectible:', error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase.",
        variant: "destructive"
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      case 'common':
        return 'from-gray-500 to-slate-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 animate-fade-in group">
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
        {collectible.image_url ? (
          <img 
            src={collectible.image_url} 
            alt={collectible.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Star size={32} className="text-white" />
            </div>
          </div>
        )}
        
        {/* Rarity Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full bg-gradient-to-r ${getRarityColor(collectible.rarity)} text-white text-xs font-semibold`}>
          {collectible.rarity || 'Common'}
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
        >
          <Heart 
            size={16} 
            className={`${isLiked ? 'text-red-500 fill-current' : 'text-white'} transition-colors`} 
          />
        </button>

        {/* Stats Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white text-sm">
            <Eye size={14} />
            <span>{Math.floor(Math.random() * 1000) + 100}</span>
          </div>
          <div className="flex items-center space-x-2 text-white text-sm">
            <Heart size={14} />
            <span>{likes}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white truncate">{collectible.title}</h3>
            <span className="text-purple-400 text-sm font-medium">{collectible.category}</span>
          </div>
          <p className="text-slate-400 text-sm line-clamp-2">{collectible.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Current Price</p>
            <p className="text-2xl font-bold text-white">{collectible.price} ETH</p>
            <p className="text-green-400 text-sm">+12.5% (24h)</p>
          </div>

              {showActions && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePurchase}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <ShoppingCart size={16} />
                <span>Buy</span>
              </button>
              
              <button 
                onClick={() => navigate('/trading', { state: { collectible } })}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <TrendingUp size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectibleCard;
