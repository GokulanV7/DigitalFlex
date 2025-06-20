-- Migration to add triggers for collectibles, purchases, and trades

-- Trigger to update timestamp on collectibles
CREATE OR REPLACE FUNCTION update_collectible_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER collectible_update_timestamp
BEFORE UPDATE ON public.collectibles
FOR EACH ROW
EXECUTE FUNCTION update_collectible_timestamp();

-- Trigger to log user activity on purchases
CREATE OR REPLACE FUNCTION log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_activities (user_id, activity_type, description, metadata)
    VALUES (NEW.user_id, 'purchase', 'Purchased collectible ' || NEW.collectible_id, jsonb_build_object('amount', NEW.amount));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchase_log_activity
AFTER INSERT ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION log_user_activity();

-- Trigger to update user stats on completed trades
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_stats
    SET total_trades = total_trades + 1,
        total_volume = total_volume + NEW.price,
        last_updated = now()
    WHERE user_id = NEW.buyer_id; -- Assuming buyer_id is the user making the trade
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_on_trade
AFTER INSERT ON public.trades
FOR EACH ROW
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION update_user_stats();
