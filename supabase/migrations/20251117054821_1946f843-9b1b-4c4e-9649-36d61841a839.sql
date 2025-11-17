-- Create bank_statements table
CREATE TABLE IF NOT EXISTS public.bank_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  closing_balance DECIMAL(15,2),
  period_start TEXT,
  period_end TEXT,
  parsed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;

-- RLS policies for bank_statements
CREATE POLICY "Users can view their own bank statements"
ON public.bank_statements FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank statements"
ON public.bank_statements FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank statements"
ON public.bank_statements FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create financial_aggregates table
CREATE TABLE IF NOT EXISTS public.financial_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  avg_daily_surplus DECIMAL(15,2),
  surplus_volatility DECIMAL(15,2),
  closing_balance DECIMAL(15,2),
  cash_buffer_days DECIMAL(10,2),
  confidence_score INTEGER,
  top_categories JSONB DEFAULT '[]'::jsonb,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.financial_aggregates ENABLE ROW LEVEL SECURITY;

-- RLS policies for financial_aggregates
CREATE POLICY "Users can view their own aggregates"
ON public.financial_aggregates FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage aggregates"
ON public.financial_aggregates FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create trading_recommendations table
CREATE TABLE IF NOT EXISTS public.trading_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  inventory_min DECIMAL(15,2),
  inventory_max DECIMAL(15,2),
  min_edge_bps DECIMAL(10,2),
  max_notional_usd DECIMAL(15,2),
  daily_loss_limit_bps DECIMAL(10,2),
  reasoning TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trading_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies for trading_recommendations
CREATE POLICY "Users can view their own recommendations"
ON public.trading_recommendations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage recommendations"
ON public.trading_recommendations FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create recommendation_history table
CREATE TABLE IF NOT EXISTS public.recommendation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES public.trading_recommendations(id) ON DELETE SET NULL,
  inventory_min DECIMAL(15,2),
  inventory_max DECIMAL(15,2),
  min_edge_bps DECIMAL(10,2),
  max_notional_usd DECIMAL(15,2),
  daily_loss_limit_bps DECIMAL(10,2),
  reasoning TEXT,
  confidence_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recommendation_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for recommendation_history
CREATE POLICY "Users can view their own recommendation history"
ON public.recommendation_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert recommendation history"
ON public.recommendation_history FOR INSERT
TO service_role
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bank_statements_user_id ON public.bank_statements(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_aggregates_user_id ON public.financial_aggregates(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_recommendations_user_id ON public.trading_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_history_user_id ON public.recommendation_history(user_id);