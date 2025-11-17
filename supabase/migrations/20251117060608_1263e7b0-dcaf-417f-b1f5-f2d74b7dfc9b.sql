-- Create trading_intents table for order management
CREATE TABLE IF NOT EXISTS public.trading_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chain TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  amount_qc DECIMAL(15,2) NOT NULL,
  min_edge_bps DECIMAL(10,2) NOT NULL,
  max_slippage_bps DECIMAL(10,2) NOT NULL,
  order_type TEXT NOT NULL DEFAULT 'MARKET' CHECK (order_type IN ('MARKET', 'LIMIT')),
  limit_price DECIMAL(15,2),
  stop_loss DECIMAL(15,2),
  take_profit DECIMAL(15,2),
  time_in_force TEXT NOT NULL DEFAULT 'GTC' CHECK (time_in_force IN ('GTC', 'IOC', 'FOK', 'DAY')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'filled', 'cancelled', 'expired', 'rejected')),
  qty_filled DECIMAL(15,8) DEFAULT 0,
  avg_price DECIMAL(15,8),
  capture_bps DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  filled_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create executions table for execution history
CREATE TABLE IF NOT EXISTS public.executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id TEXT REFERENCES public.trading_intents(intent_id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chain TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  qty_filled DECIMAL(15,8) NOT NULL,
  avg_price DECIMAL(15,8) NOT NULL,
  capture_bps DECIMAL(10,2),
  execution_venue TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.trading_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executions ENABLE ROW LEVEL SECURITY;

-- RLS policies for trading_intents
CREATE POLICY "Users can view their own intents"
ON public.trading_intents FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own intents"
ON public.trading_intents FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intents"
ON public.trading_intents FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all intents"
ON public.trading_intents FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RLS policies for executions
CREATE POLICY "Users can view their own executions"
ON public.executions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all executions"
ON public.executions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trading_intents_user_id ON public.trading_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_intents_intent_id ON public.trading_intents(intent_id);
CREATE INDEX IF NOT EXISTS idx_trading_intents_status ON public.trading_intents(status);
CREATE INDEX IF NOT EXISTS idx_executions_user_id ON public.executions(user_id);
CREATE INDEX IF NOT EXISTS idx_executions_intent_id ON public.executions(intent_id);
CREATE INDEX IF NOT EXISTS idx_executions_timestamp ON public.executions(timestamp DESC);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_trading_intents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trading_intents_updated_at
BEFORE UPDATE ON public.trading_intents
FOR EACH ROW
EXECUTE FUNCTION update_trading_intents_updated_at();