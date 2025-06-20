import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RaffleWidget from '@/components/RaffleWidget';
import TradingChart from '@/components/TradingChart';
import MarketOrders from '@/components/MarketOrders';
import ActiveTrades from '@/components/ActiveTrades';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTradeSuccess, setTradeDetails } from '@/store/index.ts';

const Trading = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const collectible = location.state?.collectible || null;
  const [marketStats, setMarketStats] = useState({
    totalVolume: 0,
    activeTrades: 0,
    priceChange: 0,
    topGainer: null
  });
  const [randomRatio, setRandomRatio] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMarketStats();
    }
  }, [user]);

  useEffect(() => {
    if (collectible) {
      setRandomRatio(Math.random() * 0.1 + 0.95); // Random ratio between 0.95 and 1.05
    }
  }, [collectible]);

  const fetchMarketStats = async () => {
    try {
      // Fetch market statistics
      const { data: trades } = await supabase
        .from('trades')
        .select('*')
        .eq('status', 'completed');

      const { data: activeTrades } = await supabase
        .from('trades')
        .select('*')
        .eq('status', 'pending');

      const totalVolume = trades?.reduce((sum, trade) => sum + Number(trade.price), 0) || 0;
      
      setMarketStats({
        totalVolume,
        activeTrades: activeTrades?.length || 0,
        priceChange: Math.random() * 10 - 5, // Random price change for demo
        topGainer: null
      });
    } catch (error) {
      console.error('Error fetching market stats:', error);
    }
  };

  const handleTradeComplete = (tradeData: any) => {
    dispatch(setTradeSuccess(true));
    dispatch(setTradeDetails(tradeData));
    
    // Redirect to marketplace with trade success
    navigate('/marketplace?trade=success&type=' + tradeData.type, { replace: true });
  };

  const statCards = [
    {
      title: 'Total Volume',
      value: `${marketStats.totalVolume.toFixed(2)} ETH`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      change: '+12.5%'
    },
    {
      title: 'Active Trades',
      value: marketStats.activeTrades,
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      change: '+5.2%'
    },
    {
      title: '24h Change',
      value: `${marketStats.priceChange.toFixed(2)}%`,
      icon: marketStats.priceChange >= 0 ? TrendingUp : TrendingDown,
      color: marketStats.priceChange >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500',
      change: marketStats.priceChange >= 0 ? '+' : ''
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <RaffleWidget />
      
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Trading</span> Hub
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Trade digital collectibles with advanced charts, real-time market data, and professional trading tools.
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {collectible && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Trading {collectible.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {collectible.image_url ? (
                      <img src={collectible.image_url} alt={collectible.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                    ) : (
                      <div className="w-full h-48 bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-slate-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-slate-400 mb-2"><strong>Description:</strong> {collectible.description}</p>
                    <p className="text-slate-400 mb-2"><strong>Category:</strong> {collectible.category.charAt(0).toUpperCase() + collectible.category.slice(1)}</p>
                    <p className="text-slate-400 mb-2"><strong>Rarity:</strong> {collectible.rarity.charAt(0).toUpperCase() + collectible.rarity.slice(1)}</p>
                    <p className="text-slate-400 mb-2"><strong>Base Price:</strong> {collectible.price} ETH</p>
                    <p className="text-slate-300 font-bold">Current Trading Price: {(collectible.price * randomRatio).toFixed(3)} ETH (Ratio: {randomRatio.toFixed(2)})</p>
                  </div>
                </div>
              </div>
            )}
            <TradingChart collectible={collectible} ratio={randomRatio} />
            <ActiveTrades collectibleId={collectible?.id} onTradeComplete={handleTradeComplete} />
          </div>
          <div>
            <MarketOrders collectibleId={collectible?.id} onTradeComplete={handleTradeComplete} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Trading;
