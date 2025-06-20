import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Minus, TrendingUp, TrendingDown, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { setTradeSuccess, setTradeDetails } from '@/store/index.ts';

interface MarketOrder {
  id: string;
  order_type: string;
  quantity: number;
  price: number;
  status: string;
  created_at: string;
  collectible_id: string;
}

const MarketOrders = ({ collectibleId }: { collectibleId?: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [orderForm, setOrderForm] = useState({
    type: 'buy',
    quantity: 1,
    price: 2.5,
    orderType: 'market'
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
      // Check for payment success redirect
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      if (sessionId) {
        toast({
          title: "Payment Successful",
          description: "Your payment was processed successfully. The order has been placed."
        });
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        // Update order status or insert transaction record
        handlePaymentSuccess(sessionId);
      }
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('market_orders')
        .select('*')
        .eq('user_id', user?.id);
      
      if (collectibleId) {
        query = query.eq('collectible_id', collectibleId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('market_orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled."
      });

      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description: "Failed to cancel order.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentSuccess = async (sessionId) => {
    try {
      // For demo purposes, we'll use a placeholder collectible_id if none is available
      const { data: collectibles } = await supabase
        .from('collectibles')
        .select('id')
        .limit(1);

      const collectible_id = collectibleId || collectibles?.[0]?.id || '123e4567-e89b-12d3-a456-426614174000';

      // Update the most recent active buy order to completed status
      const { data: activeOrders, error } = await supabase
        .from('market_orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('order_type', 'buy')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (activeOrders && activeOrders.length > 0) {
        const orderId = activeOrders[0].id;
        const { error: updateError } = await supabase
          .from('market_orders')
          .update({ status: 'completed', updated_at: new Date().toISOString() })
          .eq('id', orderId);

        if (updateError) throw updateError;

        // Set trade success state
        dispatch(setTradeSuccess(true));
        dispatch(setTradeDetails({
          type: 'buy',
          quantity: orderForm.quantity,
          price: orderForm.price
        }));

        toast({
          title: "Trade Completed Successfully!",
          description: "Your trade has been executed and recorded."
        });

        // Redirect to marketplace with trade success
        setTimeout(() => {
          window.location.href = '/marketplace?trade=success';
        }, 1000);

      } else {
        // Fallback: Insert a new completed order if no active order is found
        const { error: insertError } = await supabase
          .from('market_orders')
          .insert({
            user_id: user.id,
            collectible_id: collectible_id,
            order_type: 'buy',
            quantity: orderForm.quantity,
            price: orderForm.price,
            status: 'completed'
          });

        if (insertError) throw insertError;

        toast({
          title: "Transaction Recorded",
          description: "Your purchase has been recorded successfully as a new order."
        });

        dispatch(setTradeSuccess(true));
        dispatch(setTradeDetails({
          type: 'buy',
          quantity: orderForm.quantity,
          price: orderForm.price
        }));

        // Redirect to marketplace with trade success
        setTimeout(() => {
          window.location.href = '/marketplace?trade=success';
        }, 1000);
      }

      fetchOrders();
    } catch (error) {
      console.error('Error handling payment success:', error);
      toast({
        title: "Error",
        description: "Failed to record transaction. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const createOrder = async () => {
    if (!user) return;

    try {
      // For demo purposes, we'll use a random collectible_id
      const { data: collectibles } = await supabase
        .from('collectibles')
        .select('id, title')
        .limit(1);

      const collectible_id = collectibles?.[0]?.id || '123e4567-e89b-12d3-a456-426614174000';
      const collectible_title = collectibles?.[0]?.title || 'Generic Collectible';

      if (orderForm.type === 'buy') {
        const stripe = await loadStripe('pk_test_51Rb3PQ01Huhx6RGCXNBpqUJwNdtHkunBFVI5AdGdI6oga1500gPQPzRQruS4NHySGJAii8tubFebGCzcDKDiZd8R00paNwaQeU');
        if (!stripe) {
          throw new Error('Stripe failed to load.');
        }

        const item = {
          id: collectible_id,
          name: collectible_title,
          price: orderForm.price * orderForm.quantity
        };

        const successUrl = `${window.location.origin}/marketplace?trade=success&type=${orderForm.type}`;
        const cancelUrl = `${window.location.origin}/marketplace`;
        console.log('Sending successUrl:', successUrl);
        console.log('Sending cancelUrl:', cancelUrl);
        
        const response = await fetch('https://digitalflex.onrender.com/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            item, 
            successUrl: successUrl,
            cancelUrl: cancelUrl
          }),
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
      }

      const { error } = await supabase
        .from('market_orders')
        .insert({
          user_id: user.id,
          collectible_id,
          order_type: orderForm.orderType === 'market' ? orderForm.type : 'limit',
          quantity: orderForm.quantity,
          price: orderForm.price,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;

      toast({
        title: "Order Created",
        description: `${orderForm.type.toUpperCase()} order for ${orderForm.quantity} units created successfully.`
      });

      // Reset form
      setOrderForm({
        type: 'buy',
        quantity: 1,
        price: 2.5,
        orderType: 'market'
      });

      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 animate-fade-in">
      <h3 className="text-xl font-bold text-white mb-6">Market Orders</h3>
      
      {/* Order Form */}
      <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setOrderForm({...orderForm, type: 'buy'})}
            className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all ${
              orderForm.type === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
            }`}
          >
            <TrendingUp size={16} />
            <span>Buy</span>
          </button>
          <button
            onClick={() => setOrderForm({...orderForm, type: 'sell'})}
            className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all ${
              orderForm.type === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
            }`}
          >
            <TrendingDown size={16} />
            <span>Sell</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-2">Order Type</label>
            <select
              value={orderForm.orderType}
              onChange={(e) => setOrderForm({...orderForm, orderType: e.target.value})}
              className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Quantity</label>
            <input
              type="number"
              value={orderForm.quantity}
              onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})}
              className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              min="1"
            />
          </div>

          {orderForm.orderType === 'limit' && (
            <div>
              <label className="block text-slate-300 text-sm mb-2">Price (ETH)</label>
              <input
                type="number"
                value={orderForm.price}
                onChange={(e) => setOrderForm({...orderForm, price: parseFloat(e.target.value)})}
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                step="0.001"
                min="0"
              />
            </div>
          )}

          <button
            onClick={createOrder}
            className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              orderForm.type === 'buy'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
            } text-white`}
          >
            {orderForm.type === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
          </button>
        </div>
      </div>

      {/* Active Orders */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Active Orders</h4>
        {orders.filter(order => order.status === 'active').length === 0 ? (
          <p className="text-slate-400 text-center py-4">No active orders</p>
        ) : (
          <div className="space-y-3">
            {orders.filter(order => order.status === 'active').map((order) => (
              <div key={order.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-3 hover:border-purple-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-sm font-semibold ${
                        order.order_type === 'buy' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {order.order_type.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-sm">{order.quantity} units</span>
                    </div>
                    <p className="text-white font-semibold">{order.price} ETH</p>
                  </div>
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketOrders;
