> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Consolidated RLS Policies and Function Security Migration

## Overview

This document describes the consolidated migration file `20250129000000_consolidated_rls_policies_and_functions.sql` that consolidates all remaining Row Level Security (RLS) policies and function security settings across the Supabase backend.

## Purpose

After reviewing all individual migration files, this consolidated migration ensures:

1. **Complete RLS Coverage**: All tables have proper RLS policies
2. **Function Security**: All functions have proper `SECURITY DEFINER` and `search_path` settings to prevent SQL injection
3. **Performance**: Optimized indexes for frequently queried columns in RLS policies
4. **Security Best Practices**: Follows PostgreSQL security best practices

## Migration Details

### File Information
- **File**: `supabase/migrations/20250129000000_consolidated_rls_policies_and_functions.sql`
- **Size**: ~851 lines
- **Policies Created**: 152+ RLS policies
- **Idempotent**: Yes - can be run multiple times safely

### Tables Covered

#### Core Tables
- `badges` - Public read, admin write
- `segments` - Public read, admin write
- `user_segments` - Users view own, admins manage all
- `recommendations` - Users view own, service role can insert
- `support_diagnostics` - Users view own, admins view all
- `subscription_plans` - Public read, admin write
- `lead_sources` - Admin only
- `trust_badges` - Public read, admin write
- `compliance_metrics` - Admin only

#### API & Integration Tables
- `api_services` - Public read, admin write
- `integrations` - Public read, admin write
- `tenant_integrations` - Tenant members can view/manage
- `api_logs` - Users view own, service role full access
- `app_events` - Users view own, service role full access

#### Analytics & Metrics Tables
- `metrics_log` - Service role full access, authenticated read
- `orchestrator_reports` - Service role full access, authenticated read
- `dependency_reports` - Service role full access, authenticated read
- `cost_forecasts` - Service role full access, authenticated read
- `security_audits` - Service role full access, authenticated read
- `conversion_events` - Users view own, service role full access
- `user_activations` - Users view own, service role full access
- `pmf_metrics_snapshots` - Service role full access
- `nps_surveys` - Users view own, service role full access
- `affiliate_clicks` - Service role full access
- `affiliate_conversions` - Service role full access

#### Privacy & Compliance Tables
- `consent_records` - Users view own via data_subjects, service role insert
- `data_processing_activities` - Admin only
- `failed_login_attempts` - Admin and service role only

#### Platform Tables
- `demo_environments` - Public read active, admin write
- `interactive_tutorials` - Public read, admin write
- `workflow_definitions` - Tenant members can view/manage

#### Enhanced Policies for Existing Tables
- `moderation_flags` - Users can create, admins manage
- `push_subscriptions` - Users manage own
- `user_follows` - Users manage own
- `activities` - Users view own, service role insert
- `subscription_tiers` - Users view own
- `point_transactions` - Users view own, service role insert
- `onboarding_quests` - Users view own, service role insert
- `milestones` - Users view own, service role insert
- `user_apps` - Users manage own
- `tenant_usage` - Tenant members can view
- `revenue_streams` - Tenant admins can view
- `api_usage` - Tenant members can view
- `communication_channels` - Tenant members view/manage
- `compliance_reports` - Tenant admins can view
- `workflow_executions` - Users view own workflow executions
- `step_executions` - Users view own step executions
- `workflow_steps` - Users view own workflow steps
- `appointment_reminders` - Users view own appointment reminders
- `meeting_notes` - Users view/create notes for own meetings
- `design_versions` - Users view/create versions for own projects
- `expert_profiles` - Public read, users update own
- `community_posts` - Added delete policy

## Security Features

### Function Security
- All `SECURITY DEFINER` functions have `SET search_path = public` to prevent search_path injection attacks
- Helper functions are granted proper execute permissions

### Performance Optimizations
- Created indexes on frequently queried columns:
  - `idx_tenant_members_user_tenant_active` - For tenant membership checks
  - `idx_automation_workflows_created_by` - For workflow ownership checks
  - `idx_workflow_executions_workflow_created` - For workflow execution queries

### RLS Policy Patterns

1. **User Own Data**: `auth.uid() = user_id`
2. **Admin Access**: `public.is_admin(auth.uid())`
3. **Service Role**: `auth.role() = 'service_role'`
4. **Tenant Members**: Checks `tenant_members` table with active status
5. **Tenant Admins**: Checks `tenant_members` table with admin role and active status

## Idempotency

The migration is fully idempotent:
- Uses `DROP POLICY IF EXISTS` before creating policies
- Uses `CREATE INDEX IF NOT EXISTS` for indexes
- Uses `DO $$` blocks with existence checks for conditional operations
- All `ALTER TABLE` commands use `IF EXISTS` where applicable

## Testing Recommendations

Before deploying to production:

1. **Test on Staging**: Run the migration on a staging environment first
2. **Verify RLS**: Test that users can only access their own data
3. **Test Admin Functions**: Verify admin users can access admin-only tables
4. **Test Tenant Isolation**: Verify tenant members can only access their tenant's data
5. **Performance Test**: Verify queries perform well with new indexes

## Dependencies

This migration depends on:
- `public.is_admin(UUID)` function (from `complete_schema.sql`)
- `public.has_role(UUID, app_role)` function (from `complete_schema.sql`)
- `public.is_tenant_member(UUID, UUID)` function (from `tenant_members` migration)
- `tenant_members` table (from `20250120000003_tenant_members_table.sql`)

## Migration Order

This migration should be run after:
- All table creation migrations
- `20250120000003_tenant_members_table.sql` (for tenant membership checks)
- Any migrations that create helper functions like `is_admin()`

## Rollback

If needed, rollback can be performed by:
1. Dropping all policies created by this migration
2. Removing indexes created by this migration
3. Reverting function security settings

However, since this migration only adds policies and doesn't modify table structures, rollback is typically not necessary unless there are policy conflicts.

## Notes

- All policies use `DROP POLICY IF EXISTS` to ensure idempotency
- Conditional blocks check for table existence before applying policies
- Service role policies use `auth.jwt() ->> 'role'` for compatibility
- Tenant-related policies check both `role` and `status = 'active'` for security

## Related Files

- `supabase/complete_schema.sql` - Complete schema reference
- `supabase/migrations/20250120000003_tenant_members_table.sql` - Tenant members table
- `supabase/migrations/20250122000000_rls_realtime_storage.sql` - RLS and storage setup
- `supabase/migrations/20250124000000_orchestrator_tables.sql` - Orchestrator tables
- `supabase/migrations/20250128000000_pmf_analytics.sql` - PMF analytics tables
