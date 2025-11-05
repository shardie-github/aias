-- [STAKE+TRUST:BEGIN:audit_log_migration]
-- Online-safe migration: Create audit_log table with RLS
-- This migration is safe to run in production (no CONCURRENTLY in transaction)

-- Create audit_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  meta JSONB DEFAULT '{}'::jsonb,
  ts TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);

-- Create index on timestamp for chronological queries
CREATE INDEX IF NOT EXISTS idx_audit_log_ts ON public.audit_log(ts DESC);

-- Enable Row Level Security
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (idempotent)
DROP POLICY IF EXISTS "audit_owner" ON public.audit_log;

-- Create RLS policy: users can only see their own audit log entries
CREATE POLICY "audit_owner" ON public.audit_log
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Optional: Add comment for documentation
COMMENT ON TABLE public.audit_log IS 'User activity audit log. Protected by RLS - users can only access their own entries.';
COMMENT ON COLUMN public.audit_log.user_id IS 'User ID from auth.users. Cascade delete on user deletion.';
COMMENT ON COLUMN public.audit_log.action IS 'Action type (e.g., "login", "feedback", "data_export")';
COMMENT ON COLUMN public.audit_log.meta IS 'Additional metadata as JSONB (e.g., rating, comment, details)';
COMMENT ON COLUMN public.audit_log.ts IS 'Timestamp of the action (defaults to NOW())';
-- [STAKE+TRUST:END:audit_log_migration]
