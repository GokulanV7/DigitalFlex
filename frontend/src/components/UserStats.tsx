
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Star, DollarSign, Package } from 'lucide-react';

const UserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    collectibles: 0,
    purchases: 0,
    totalSpent: 0,
    raffleTickets: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Get collectibles count
      const { data: collectibles } = await supabase
        .from('collectibles')
        .select('id')
        .eq('user_id', user?.id);

      // Get purchases count and total spent
      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount')
        .eq('user_id', user?.id)
        .eq('status', 'completed');

      // Get raffle tickets
      const { data: raffleEntries } = await supabase
        .from('raffle_entries')
        .select('tickets_count')
        .eq('user_id', user?.id);

      const totalSpent = purchases?.reduce((sum, purchase) => sum + Number(purchase.amount), 0) || 0;
      const totalTickets = raffleEntries?.reduce((sum, entry) => sum + entry.tickets_count, 0) || 0;

      setStats({
        collectibles: collectibles?.length || 0,
        purchases: purchases?.length || 0,
        totalSpent,
        raffleTickets: totalTickets
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Collectibles Created',
      value: stats.collectibles,
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Purchases Made',
      value: stats.purchases,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Spent',
      value: `${stats.totalSpent.toFixed(2)} ETH`,
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Raffle Tickets',
      value: stats.raffleTickets,
      icon: Star,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Your Stats</h2>
      
      {statCards.map((stat, index) => (
        <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon size={24} className="text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
