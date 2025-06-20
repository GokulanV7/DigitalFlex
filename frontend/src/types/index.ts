export interface Collectible {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'art' | 'music' | 'video' | 'gaming' | 'collectible' | 'photography';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  buyer_id: string | null;
  seller_id: string | null;
  collectible_id: string | null;
  price: number;
  trade_type: 'buy' | 'sell';
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  completed_at?: string;
}

export interface MarketOrder {
  id: string;
  user_id: string;
  collectible_id: string;
  order_type: 'buy' | 'sell' | 'limit' | 'market';
  quantity: number;
  price?: number;
  status: 'active' | 'filled' | 'cancelled' | 'expired';
  expires_at?: string;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_trades: number;
  total_volume: number;
  profit_loss: number;
  success_rate: number;
  reputation_points: number;
  last_updated: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  collectible_id: string;
  amount: number;
  stripe_session_id?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface RaffleEntry {
  id: string;
  user_id: string;
  collectible_id: string;
  tickets_count: number;
  created_at: string;
}
