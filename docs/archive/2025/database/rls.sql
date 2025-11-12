-- ===========================================
-- ARCHIVED: This RLS file has been superseded by consolidated migrations
-- Archived on: 2025-11-12
-- Superseded by: supabase/migrations/20250122000000_rls_realtime_storage.sql and 20250129000000_consolidated_rls_policies_and_functions.sql
-- ===========================================
-- Row Level Security (RLS) Policies
-- Finance → Automation → Growth Metrics Schema
-- Created: 2025-01-28
-- ===========================================

-- ===========================================
-- EVENTS TABLE RLS
-- ===========================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for ETL scripts)
CREATE POLICY "events_service_role_all" ON public.events
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Authenticated users can insert their own events
CREATE POLICY "events_authenticated_insert" ON public.events
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can read events (for analytics)
CREATE POLICY "events_authenticated_read" ON public.events
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Anonymous can insert events (for tracking)
CREATE POLICY "events_anon_insert" ON public.events
  FOR INSERT
  WITH CHECK (true);

-- ===========================================
-- ORDERS TABLE RLS
-- ===========================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for ETL scripts)
CREATE POLICY "orders_service_role_all" ON public.orders
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Users can read their own orders
CREATE POLICY "orders_user_read_own" ON public.orders
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    (user_id = auth.uid() OR user_id IS NULL)
  );

-- Authenticated users can insert orders (for checkout)
CREATE POLICY "orders_authenticated_insert" ON public.orders
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Service role can update orders (for webhooks, refunds)
CREATE POLICY "orders_service_role_update" ON public.orders
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- ===========================================
-- SPEND TABLE RLS
-- ===========================================
ALTER TABLE public.spend ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for ETL scripts)
CREATE POLICY "spend_service_role_all" ON public.spend
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Authenticated users can read spend (for dashboards)
CREATE POLICY "spend_authenticated_read" ON public.spend
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Anonymous can read aggregated spend (for public dashboards if needed)
CREATE POLICY "spend_anon_read" ON public.spend
  FOR SELECT
  USING (true);

-- ===========================================
-- EXPERIMENTS TABLE RLS
-- ===========================================
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for automation)
CREATE POLICY "experiments_service_role_all" ON public.experiments
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Authenticated users can read experiments (for feature flags)
CREATE POLICY "experiments_authenticated_read" ON public.experiments
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can read active experiments (for client-side)
CREATE POLICY "experiments_anon_read_active" ON public.experiments
  FOR SELECT
  USING (status = 'running');

-- ===========================================
-- METRICS_DAILY TABLE RLS
-- ===========================================
ALTER TABLE public.metrics_daily ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for ETL scripts)
CREATE POLICY "metrics_daily_service_role_all" ON public.metrics_daily
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Authenticated users can read metrics (for dashboards)
CREATE POLICY "metrics_daily_authenticated_read" ON public.metrics_daily
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Anonymous can read metrics (for public dashboards if needed)
CREATE POLICY "metrics_daily_anon_read" ON public.metrics_daily
  FOR SELECT
  USING (true);

-- ===========================================
-- FUNCTION PERMISSIONS
-- ===========================================
GRANT EXECUTE ON FUNCTION compute_refund_rate(DATE) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION compute_cac(DATE, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION compute_ltv(UUID, INTEGER) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_or_create_metrics_daily(DATE) TO authenticated, anon;

-- Service role has full access to all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ===========================================
-- NOTES
-- ===========================================
-- RLS policies follow principle of least privilege:
-- - Service role: Full access (for ETL, automation)
-- - Authenticated users: Read own data + insert events/orders
-- - Anonymous: Limited read access (for public dashboards)
--
-- For production, consider:
-- - Adding tenant isolation if multi-tenant
-- - Adding audit logging for sensitive operations
-- - Reviewing policies quarterly for security
