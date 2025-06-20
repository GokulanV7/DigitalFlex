-- Create trades table for tracking buy/sell transactions
CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  collectible_id UUID REFERENCES public.collectibles(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  trade_type TEXT NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create market_prices table for price history and charts
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collectible_id UUID REFERENCES public.collectibles(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  volume INTEGER DEFAULT 1,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activities table for tracking user actions
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stats table for tracking user performance
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_trades INTEGER DEFAULT 0,
  total_volume DECIMAL(10,2) DEFAULT 0,
  profit_loss DECIMAL(10,2) DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  reputation_points INTEGER DEFAULT 100,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create market_orders table for future trading orders
CREATE TABLE public.market_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  collectible_id UUID REFERENCES public.collectibles(id) ON DELETE CASCADE,
  order_type TEXT NOT NULL CHECK (order_type IN ('buy', 'sell', 'limit', 'market')),
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'filled', 'cancelled', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for trades
CREATE POLICY "Users can view trades they're involved in" ON public.trades
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create trades" ON public.trades
  FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can update their trades" ON public.trades
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- RLS policies for market_prices (public read, system write)
CREATE POLICY "Anyone can view market prices" ON public.market_prices
  FOR SELECT USING (true);

-- RLS policies for user_activities
CREATE POLICY "Users can view own activities" ON public.user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activities" ON public.user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_stats
CREATE POLICY "Users can view own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for market_orders
CREATE POLICY "Users can view own orders" ON public.market_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.market_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.market_orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update user stats after trades
CREATE OR REPLACE FUNCTION public.update_user_stats_on_trade()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update buyer stats
    INSERT INTO public.user_stats (user_id, total_trades, total_volume)
    VALUES (NEW.buyer_id, 1, NEW.price)
    ON CONFLICT (user_id) DO UPDATE SET
      total_trades = user_stats.total_trades + 1,
      total_volume = user_stats.total_volume + NEW.price,
      last_updated = NOW();
    
    -- Update seller stats
    INSERT INTO public.user_stats (user_id, total_trades, total_volume)
    VALUES (NEW.seller_id, 1, NEW.price)
    ON CONFLICT (user_id) DO UPDATE SET
      total_trades = user_stats.total_trades + 1,
      total_volume = user_stats.total_volume + NEW.price,
      last_updated = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating user stats
CREATE TRIGGER on_trade_completed
  AFTER UPDATE ON public.trades
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_on_trade();

-- Create function to initialize user stats
CREATE OR REPLACE FUNCTION public.initialize_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for initializing user stats
CREATE TRIGGER on_user_stats_init
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_stats();
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_stats();
