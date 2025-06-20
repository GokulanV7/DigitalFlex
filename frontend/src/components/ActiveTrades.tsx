
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Clock, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface Trade {
  id: string;
  buyer_id: string;
  seller_id: string;
  price: number;
  trade_type: string;
  status: string;
  created_at: string;
  completed_at?: string;
  collectible_id: string;
}

const ActiveTrades = ({ collectibleId }: { collectibleId?: string }) => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (user) {
      fetchTrades();
    }
  }, [user]);

  const fetchTrades = async () => {
    try {
      let query = supabase
        .from('trades')
        .select('*')
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`);
      
      if (collectibleId) {
        query = query.eq('collectible_id', collectibleId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const filteredTrades = trades.filter(trade => {
    if (filter === 'all') return true;
    return trade.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-400" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-400" />;
      default:
        return <Clock size={16} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-slate-400 bg-slate-400/10';
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Trades' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Trade History</h3>
        
        <div className="flex bg-slate-700/50 rounded-lg p-1">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id as any)}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                filter === option.id
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTrades.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-400 text-lg mb-2">No trades found</p>
          <p className="text-slate-500">Start trading to see your transaction history here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrades.map((trade) => (
            <div key={trade.id} className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {trade.trade_type === 'buy' ? (
                      <TrendingUp size={20} className="text-green-400" />
                    ) : (
                      <TrendingDown size={20} className="text-red-400" />
                    )}
                    <span className={`font-semibold ${
                      trade.trade_type === 'buy' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.trade_type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-white font-semibold">{trade.price} ETH</p>
                    <p className="text-slate-400 text-sm">
                      {new Date(trade.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(trade.status)}`}>
                    {getStatusIcon(trade.status)}
                    <span className="text-sm font-medium capitalize">{trade.status}</span>
                  </div>
                </div>
              </div>

              {trade.status === 'completed' && trade.completed_at && (
                <div className="mt-3 pt-3 border-t border-slate-600/50">
                  <p className="text-slate-400 text-sm">
                    Completed on {new Date(trade.completed_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveTrades;
