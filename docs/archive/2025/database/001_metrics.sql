-- ===========================================
-- ARCHIVED: This migration has been superseded by newer migrations in supabase/migrations/
-- Archived on: 2025-11-12
-- Superseded by: supabase/migrations/20250123000000_performance_metrics.sql
-- ===========================================
-- Finance → Automation → Growth Metrics Schema
-- Migration: 001_metrics.sql
-- Created: 2025-01-28
-- Timezone: America/Toronto
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- EVENTS TABLE
-- Tracks all user and system events for analytics
-- ===========================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  user_id UUID,
  session_id TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for events
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON public.events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_event_name ON public.events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_timestamp_event_type ON public.events(timestamp DESC, event_type);

-- ===========================================
-- ORDERS TABLE
-- Tracks all orders/transactions
-- ===========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, refunded, cancelled
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  items JSONB DEFAULT '[]'::jsonb,
  payment_method TEXT,
  payment_provider TEXT,
  refunded_amount NUMERIC(10, 2) DEFAULT 0,
  refunded_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON public.orders(status, created_at DESC);

-- ===========================================
-- SPEND TABLE
-- Tracks marketing/advertising spend by channel
-- ===========================================
CREATE TABLE IF NOT EXISTS public.spend (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  channel TEXT NOT NULL, -- meta, tiktok, google, organic, etc.
  campaign_id TEXT,
  campaign_name TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  impressions BIGINT,
  clicks BIGINT,
  conversions BIGINT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(date, channel, campaign_id)
);

-- Indexes for spend
CREATE INDEX IF NOT EXISTS idx_spend_date ON public.spend(date DESC);
CREATE INDEX IF NOT EXISTS idx_spend_channel ON public.spend(channel);
CREATE INDEX IF NOT EXISTS idx_spend_date_channel ON public.spend(date DESC, channel);
CREATE INDEX IF NOT EXISTS idx_spend_campaign_id ON public.spend(campaign_id) WHERE campaign_id IS NOT NULL;

-- ===========================================
-- EXPERIMENTS TABLE
-- Tracks growth experiments and A/B tests
-- ===========================================
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  hypothesis TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, running, paused, completed, cancelled
  variant_a_name TEXT NOT NULL DEFAULT 'control',
  variant_b_name TEXT NOT NULL DEFAULT 'treatment',
  traffic_split NUMERIC(3, 2) DEFAULT 0.50, -- 0.50 = 50/50 split
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  success_threshold JSONB, -- {"metric": "conversion_rate", "min_improvement": 0.10}
  sample_size_required BIGINT,
  sample_size_actual BIGINT DEFAULT 0,
  results JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for experiments
CREATE INDEX IF NOT EXISTS idx_experiments_slug ON public.experiments(slug);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON public.experiments(status);
CREATE INDEX IF NOT EXISTS idx_experiments_start_date ON public.experiments(start_date) WHERE start_date IS NOT NULL;

-- ===========================================
-- METRICS_DAILY TABLE
-- Aggregated daily metrics for finance and growth tracking
-- ===========================================
CREATE TABLE IF NOT EXISTS public.metrics_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  
  -- Revenue metrics
  revenue NUMERIC(10, 2) DEFAULT 0,
  refunds NUMERIC(10, 2) DEFAULT 0,
  net_revenue NUMERIC(10, 2) DEFAULT 0,
  order_count BIGINT DEFAULT 0,
  refund_count BIGINT DEFAULT 0,
  refund_rate NUMERIC(5, 4) DEFAULT 0, -- 0.05 = 5%
  
  -- Marketing metrics
  spend_total NUMERIC(10, 2) DEFAULT 0,
  spend_meta NUMERIC(10, 2) DEFAULT 0,
  spend_tiktok NUMERIC(10, 2) DEFAULT 0,
  spend_other NUMERIC(10, 2) DEFAULT 0,
  impressions_total BIGINT DEFAULT 0,
  clicks_total BIGINT DEFAULT 0,
  conversions_total BIGINT DEFAULT 0,
  
  -- Unit economics
  cac NUMERIC(10, 2), -- Customer Acquisition Cost
  ltv NUMERIC(10, 2), -- Lifetime Value
  ltv_cac_ratio NUMERIC(5, 2),
  cac_payback_days INTEGER,
  
  -- Customer metrics
  new_customers BIGINT DEFAULT 0,
  active_customers BIGINT DEFAULT 0,
  churned_customers BIGINT DEFAULT 0,
  churn_rate NUMERIC(5, 4) DEFAULT 0,
  
  -- Cost metrics
  cogs NUMERIC(10, 2) DEFAULT 0,
  cogs_percentage NUMERIC(5, 2) DEFAULT 0, -- 40.0 = 40%
  gross_margin NUMERIC(10, 2) DEFAULT 0,
  gross_margin_percentage NUMERIC(5, 2) DEFAULT 0,
  
  -- Operating expenses (from assumptions, not tracked daily)
  operating_expenses NUMERIC(10, 2),
  ebitda NUMERIC(10, 2),
  ebitda_margin NUMERIC(5, 2),
  
  -- Cash metrics
  cash_balance NUMERIC(12, 2),
  cash_runway_days INTEGER,
  
  -- Experiment metrics
  active_experiments_count INTEGER DEFAULT 0,
  experiments_completed_count INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for metrics_daily
CREATE INDEX IF NOT EXISTS idx_metrics_daily_date ON public.metrics_daily(date DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_daily_revenue ON public.metrics_daily(revenue DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_daily_cac ON public.metrics_daily(cac) WHERE cac IS NOT NULL;

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to compute refund rate
CREATE OR REPLACE FUNCTION compute_refund_rate(
  p_date DATE
)
RETURNS NUMERIC AS $$
DECLARE
  v_refund_rate NUMERIC;
BEGIN
  SELECT 
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE COUNT(*) FILTER (WHERE status = 'refunded')::NUMERIC / COUNT(*)::NUMERIC
    END
  INTO v_refund_rate
  FROM public.orders
  WHERE DATE(created_at) = p_date;
  
  RETURN COALESCE(v_refund_rate, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to compute CAC (Customer Acquisition Cost)
CREATE OR REPLACE FUNCTION compute_cac(
  p_date DATE,
  p_channel TEXT DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
  v_spend NUMERIC;
  v_new_customers BIGINT;
  v_cac NUMERIC;
BEGIN
  -- Get total spend for date (and channel if specified)
  SELECT COALESCE(SUM(amount), 0)
  INTO v_spend
  FROM public.spend
  WHERE date = p_date
    AND (p_channel IS NULL OR channel = p_channel);
  
  -- Get new customers for date
  SELECT COUNT(DISTINCT user_id)
  INTO v_new_customers
  FROM public.orders
  WHERE DATE(created_at) = p_date
    AND user_id IS NOT NULL;
  
  -- Compute CAC
  IF v_new_customers > 0 THEN
    v_cac := v_spend / v_new_customers;
  ELSE
    v_cac := NULL;
  END IF;
  
  RETURN v_cac;
END;
$$ LANGUAGE plpgsql;

-- Function to compute LTV (Lifetime Value) - simplified 30-day window
CREATE OR REPLACE FUNCTION compute_ltv(
  p_user_id UUID,
  p_days_back INTEGER DEFAULT 90
)
RETURNS NUMERIC AS $$
DECLARE
  v_ltv NUMERIC;
BEGIN
  SELECT COALESCE(SUM(total_amount - refunded_amount), 0)
  INTO v_ltv
  FROM public.orders
  WHERE user_id = p_user_id
    AND created_at >= NOW() - (p_days_back || ' days')::INTERVAL
    AND status IN ('completed', 'refunded');
  
  RETURN v_ltv;
END;
$$ LANGUAGE plpgsql;

-- Function to get or create metrics_daily record
CREATE OR REPLACE FUNCTION get_or_create_metrics_daily(
  p_date DATE
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.metrics_daily (date)
  VALUES (p_date)
  ON CONFLICT (date) DO UPDATE SET updated_at = NOW()
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- COMMENTS
-- ===========================================
COMMENT ON TABLE public.events IS 'Tracks all user and system events for analytics';
COMMENT ON TABLE public.orders IS 'Tracks all orders/transactions with refund tracking';
COMMENT ON TABLE public.spend IS 'Tracks marketing/advertising spend by channel and campaign';
COMMENT ON TABLE public.experiments IS 'Tracks growth experiments and A/B tests';
COMMENT ON TABLE public.metrics_daily IS 'Aggregated daily metrics for finance and growth tracking';

COMMENT ON COLUMN public.metrics_daily.cac IS 'Customer Acquisition Cost = spend / new_customers';
COMMENT ON COLUMN public.metrics_daily.ltv IS 'Lifetime Value = average revenue per customer over 90 days';
COMMENT ON COLUMN public.metrics_daily.refund_rate IS 'Refund rate = refund_count / order_count';
COMMENT ON COLUMN public.metrics_daily.cogs_percentage IS 'COGS as percentage of revenue';

-- ===========================================
-- GRANTS (will be refined in RLS file)
-- ===========================================
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.metrics_daily TO anon; -- Allow public read of aggregated metrics
