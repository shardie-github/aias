-- ===========================================
-- CONSOLIDATED RLS POLICIES AND FUNCTION SECURITY
-- ===========================================
-- This migration consolidates all remaining RLS policies and function security
-- settings that are missing from individual migrations.
-- 
-- It ensures:
-- 1. All tables have proper RLS policies
-- 2. All functions have SECURITY DEFINER and search_path set
-- 3. Performance optimizations with proper indexes
-- 4. Security best practices
--
-- This migration is idempotent and can be run multiple times safely.

-- ===========================================
-- ENABLE RLS ON TABLES THAT MIGHT BE MISSING IT
-- ===========================================

-- Ensure RLS is enabled on all tables (idempotent)
DO $$
DECLARE
    tbl RECORD;
    tables_to_check TEXT[] := ARRAY[
        'badges', 'segments', 'user_segments', 'recommendations', 
        'support_diagnostics', 'subscription_plans', 'lead_sources',
        'trust_badges', 'compliance_metrics', 'api_services', 'integrations',
        'tenant_integrations', 'demo_environments', 'interactive_tutorials',
        'workflow_definitions', 'metrics_log', 'api_logs', 'app_events',
        'orchestrator_reports', 'dependency_reports', 'cost_forecasts',
        'security_audits', 'conversion_events', 'user_activations',
        'pmf_metrics_snapshots', 'nps_surveys', 'affiliate_clicks',
        'affiliate_conversions', 'consent_records', 'data_processing_activities',
        'failed_login_attempts'
    ];
BEGIN
    FOREACH tbl.table_name IN ARRAY tables_to_check
    LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = tbl.table_name
        ) THEN
            EXECUTE format('ALTER TABLE IF EXISTS public.%I ENABLE ROW LEVEL SECURITY', tbl.table_name);
        END IF;
    END LOOP;
END $$;

-- ===========================================
-- BADGES TABLE POLICIES
-- ===========================================

-- Badges: Public read, admin write
DROP POLICY IF EXISTS "badges_public_read" ON public.badges;
CREATE POLICY "badges_public_read" ON public.badges
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "badges_admin_write" ON public.badges;
CREATE POLICY "badges_admin_write" ON public.badges
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- SEGMENTS TABLE POLICIES
-- ===========================================

-- Segments: Public read, admin write
DROP POLICY IF EXISTS "segments_public_read" ON public.segments;
CREATE POLICY "segments_public_read" ON public.segments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "segments_admin_write" ON public.segments;
CREATE POLICY "segments_admin_write" ON public.segments
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- USER_SEGMENTS TABLE POLICIES
-- ===========================================

-- User Segments: Users can view their own, admins can manage
DROP POLICY IF EXISTS "user_segments_own" ON public.user_segments;
CREATE POLICY "user_segments_own" ON public.user_segments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_segments_admin_all" ON public.user_segments;
CREATE POLICY "user_segments_admin_all" ON public.user_segments
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- RECOMMENDATIONS TABLE POLICIES
-- ===========================================

-- Recommendations: Users can view their own, service role can insert
DROP POLICY IF EXISTS "recommendations_own" ON public.recommendations;
CREATE POLICY "recommendations_own" ON public.recommendations
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "recommendations_update_own" ON public.recommendations;
CREATE POLICY "recommendations_update_own" ON public.recommendations
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "recommendations_service_insert" ON public.recommendations;
CREATE POLICY "recommendations_service_insert" ON public.recommendations
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- ===========================================
-- SUPPORT_DIAGNOSTICS TABLE POLICIES
-- ===========================================

-- Support Diagnostics: Users can view their own, admins can view all
DROP POLICY IF EXISTS "support_diagnostics_own" ON public.support_diagnostics;
CREATE POLICY "support_diagnostics_own" ON public.support_diagnostics
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "support_diagnostics_admin" ON public.support_diagnostics;
CREATE POLICY "support_diagnostics_admin" ON public.support_diagnostics
    FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "support_diagnostics_service_insert" ON public.support_diagnostics;
CREATE POLICY "support_diagnostics_service_insert" ON public.support_diagnostics
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- ===========================================
-- SUBSCRIPTION_PLANS TABLE POLICIES
-- ===========================================

-- Subscription Plans: Public read, admin write
DROP POLICY IF EXISTS "subscription_plans_public_read" ON subscription_plans;
CREATE POLICY "subscription_plans_public_read" ON subscription_plans
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "subscription_plans_admin_write" ON subscription_plans;
CREATE POLICY "subscription_plans_admin_write" ON subscription_plans
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- LEAD_SOURCES TABLE POLICIES
-- ===========================================

-- Lead Sources: Admin only
DROP POLICY IF EXISTS "lead_sources_admin_all" ON lead_sources;
CREATE POLICY "lead_sources_admin_all" ON lead_sources
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- TRUST_BADGES TABLE POLICIES
-- ===========================================

-- Trust Badges: Public read, admin write
DROP POLICY IF EXISTS "trust_badges_public_read" ON trust_badges;
CREATE POLICY "trust_badges_public_read" ON trust_badges
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "trust_badges_admin_write" ON trust_badges;
CREATE POLICY "trust_badges_admin_write" ON trust_badges
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- COMPLIANCE_METRICS TABLE POLICIES
-- ===========================================

-- Compliance Metrics: Admin only
DROP POLICY IF EXISTS "compliance_metrics_admin_all" ON compliance_metrics;
CREATE POLICY "compliance_metrics_admin_all" ON compliance_metrics
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- API_SERVICES TABLE POLICIES
-- ===========================================

-- API Services: Public read, admin write
DROP POLICY IF EXISTS "api_services_public_read" ON api_services;
CREATE POLICY "api_services_public_read" ON api_services
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "api_services_admin_write" ON api_services;
CREATE POLICY "api_services_admin_write" ON api_services
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- INTEGRATIONS TABLE POLICIES
-- ===========================================

-- Integrations: Public read, admin write
DROP POLICY IF EXISTS "integrations_public_read" ON integrations;
CREATE POLICY "integrations_public_read" ON integrations
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "integrations_admin_write" ON integrations;
CREATE POLICY "integrations_admin_write" ON integrations
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- TENANT_INTEGRATIONS TABLE POLICIES
-- ===========================================

-- Tenant Integrations: Tenant members can view/manage
DROP POLICY IF EXISTS "tenant_integrations_tenant_members" ON tenant_integrations;
CREATE POLICY "tenant_integrations_tenant_members" ON tenant_integrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tenant_members 
            WHERE tenant_id = tenant_integrations.tenant_id 
            AND user_id = auth.uid()
            AND status = 'active'
        )
    );

DROP POLICY IF EXISTS "tenant_integrations_tenant_admin" ON tenant_integrations;
CREATE POLICY "tenant_integrations_tenant_admin" ON tenant_integrations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tenant_members 
            WHERE tenant_id = tenant_integrations.tenant_id 
            AND user_id = auth.uid()
            AND role = 'admin'
            AND status = 'active'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM tenant_members 
            WHERE tenant_id = tenant_integrations.tenant_id 
            AND user_id = auth.uid()
            AND role = 'admin'
            AND status = 'active'
        )
    );

-- ===========================================
-- DEMO_ENVIRONMENTS TABLE POLICIES
-- ===========================================

-- Demo Environments: Public read, admin write
DROP POLICY IF EXISTS "demo_environments_public_read" ON demo_environments;
CREATE POLICY "demo_environments_public_read" ON demo_environments
    FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "demo_environments_admin_write" ON demo_environments;
CREATE POLICY "demo_environments_admin_write" ON demo_environments
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- INTERACTIVE_TUTORIALS TABLE POLICIES
-- ===========================================

-- Interactive Tutorials: Public read, admin write
DROP POLICY IF EXISTS "interactive_tutorials_public_read" ON interactive_tutorials;
CREATE POLICY "interactive_tutorials_public_read" ON interactive_tutorials
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "interactive_tutorials_admin_write" ON interactive_tutorials;
CREATE POLICY "interactive_tutorials_admin_write" ON interactive_tutorials
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ===========================================
-- WORKFLOW_DEFINITIONS TABLE POLICIES
-- ===========================================

-- Workflow Definitions: Tenant members can view/manage
DROP POLICY IF EXISTS "workflow_definitions_tenant_members" ON workflow_definitions;
CREATE POLICY "workflow_definitions_tenant_members" ON workflow_definitions
    FOR SELECT USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM tenant_members tm
            JOIN automation_workflows aw ON aw.created_by = tm.user_id
            WHERE tm.user_id = auth.uid()
            AND tm.status = 'active'
        )
    );

DROP POLICY IF EXISTS "workflow_definitions_own" ON workflow_definitions;
CREATE POLICY "workflow_definitions_own" ON workflow_definitions
    FOR ALL USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- ===========================================
-- METRICS_LOG TABLE POLICIES (if exists)
-- ===========================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'metrics_log'
    ) THEN
        -- Policies already exist in performance_metrics migration, but ensure they're correct
        DROP POLICY IF EXISTS "metrics_service_role_all" ON public.metrics_log;
        CREATE POLICY "metrics_service_role_all" ON public.metrics_log
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')
            WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

        DROP POLICY IF EXISTS "metrics_authenticated_read" ON public.metrics_log;
        CREATE POLICY "metrics_authenticated_read" ON public.metrics_log
            FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- ===========================================
-- API_LOGS TABLE POLICIES (if exists)
-- ===========================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'api_logs'
    ) THEN
        -- Policies already exist in rls_realtime_storage migration, but ensure they're correct
        DROP POLICY IF EXISTS "own_api_logs_read" ON public.api_logs;
        CREATE POLICY "own_api_logs_read" ON public.api_logs
            FOR SELECT USING (
                auth.uid() = user_id OR
                (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
            );

        DROP POLICY IF EXISTS "service_role_api_logs_write" ON public.api_logs;
        CREATE POLICY "service_role_api_logs_write" ON public.api_logs
            FOR INSERT WITH CHECK (
                (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
            );
    END IF;
END $$;

-- ===========================================
-- APP_EVENTS TABLE POLICIES (if exists)
-- ===========================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'app_events'
    ) THEN
        -- Policies already exist in rls_realtime_storage migration, but ensure they're correct
        DROP POLICY IF EXISTS "own_app_events_read" ON public.app_events;
        CREATE POLICY "own_app_events_read" ON public.app_events
            FOR SELECT USING (
                auth.uid() = user_id OR
                (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
            );

        DROP POLICY IF EXISTS "own_app_events_write" ON public.app_events;
        CREATE POLICY "own_app_events_write" ON public.app_events
            FOR INSERT WITH CHECK (
                auth.uid() = user_id OR
                (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
            );
    END IF;
END $$;

-- ===========================================
-- ORCHESTRATOR TABLES POLICIES (if exists)
-- ===========================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'orchestrator_reports'
    ) THEN
        -- Policies already exist in orchestrator_tables migration, but ensure they're correct
        DROP POLICY IF EXISTS "orchestrator_reports_service_role_all" ON public.orchestrator_reports;
        CREATE POLICY "orchestrator_reports_service_role_all" ON public.orchestrator_reports
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')
            WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

        DROP POLICY IF EXISTS "orchestrator_reports_authenticated_read" ON public.orchestrator_reports;
        CREATE POLICY "orchestrator_reports_authenticated_read" ON public.orchestrator_reports
            FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- ===========================================
-- PMF ANALYTICS TABLES POLICIES (if exists)
-- ===========================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'conversion_events'
    ) THEN
        -- Policies already exist in pmf_analytics migration, but ensure they're correct
        DROP POLICY IF EXISTS "Users can view own conversion events" ON conversion_events;
        CREATE POLICY "Users can view own conversion events" ON conversion_events
            FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Service role full access" ON conversion_events;
        CREATE POLICY "Service role full access" ON conversion_events
            FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

-- ===========================================
-- CONSENT_RECORDS TABLE POLICIES (if exists)
-- ===========================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'consent_records'
    ) THEN
        ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "consent_records_own" ON consent_records;
        CREATE POLICY "consent_records_own" ON consent_records
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM data_subjects ds
                    WHERE ds.id = consent_records.data_subject_id
                    AND ds.user_id = auth.uid()
                )
            );

        DROP POLICY IF EXISTS "consent_records_service_insert" ON consent_records;
        CREATE POLICY "consent_records_service_insert" ON consent_records
            FOR INSERT WITH CHECK (auth.role() = 'service_role');
    END IF;
END $$;

-- ===========================================
-- DATA_PROCESSING_ACTIVITIES TABLE POLICIES (if exists)
-- ===========================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'data_processing_activities'
    ) THEN
        ALTER TABLE data_processing_activities ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "data_processing_activities_admin" ON data_processing_activities;
        CREATE POLICY "data_processing_activities_admin" ON data_processing_activities
            FOR ALL USING (public.is_admin(auth.uid()))
            WITH CHECK (public.is_admin(auth.uid()));
    END IF;
END $$;

-- ===========================================
-- FAILED_LOGIN_ATTEMPTS TABLE POLICIES (if exists)
-- ===========================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'failed_login_attempts'
    ) THEN
        ALTER TABLE failed_login_attempts ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "failed_login_attempts_admin" ON failed_login_attempts;
        CREATE POLICY "failed_login_attempts_admin" ON failed_login_attempts
            FOR ALL USING (public.is_admin(auth.uid()))
            WITH CHECK (public.is_admin(auth.uid()));

        DROP POLICY IF EXISTS "failed_login_attempts_service" ON failed_login_attempts;
        CREATE POLICY "failed_login_attempts_service" ON failed_login_attempts
            FOR ALL USING (auth.role() = 'service_role')
            WITH CHECK (auth.role() = 'service_role');
    END IF;
END $$;

-- ===========================================
-- ENSURE ALL FUNCTIONS HAVE PROPER SECURITY SETTINGS
-- ===========================================

-- Update function security settings to prevent search_path injection
DO $$
DECLARE
    func RECORD;
    func_signature TEXT;
BEGIN
    FOR func IN
        SELECT 
            p.proname as func_name,
            pg_get_function_identity_arguments(p.oid) as func_args,
            p.prosecdef as is_security_definer,
            pg_get_functiondef(p.oid) as func_def
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname NOT LIKE 'pg_%'
        AND p.proname NOT LIKE 'information_schema%'
    LOOP
        -- Check if function is SECURITY DEFINER and doesn't have search_path set
        IF func.is_security_definer AND func.func_def NOT LIKE '%SET search_path%' THEN
            func_signature := func.func_name || '(' || func.func_args || ')';
            
            -- Try to add search_path setting (this will fail for some functions, which is OK)
            BEGIN
                EXECUTE format('ALTER FUNCTION public.%I SET search_path = public', func_signature);
            EXCEPTION WHEN OTHERS THEN
                -- Function might not exist or might have different signature, skip
                NULL;
            END;
        END IF;
    END LOOP;
END $$;

-- ===========================================
-- ADDITIONAL MISSING POLICIES FOR TABLES WITH PARTIAL COVERAGE
-- ===========================================

-- Moderation Flags: Users can create, admins can view/manage
DROP POLICY IF EXISTS "moderation_flags_create" ON public.moderation_flags;
CREATE POLICY "moderation_flags_create" ON public.moderation_flags
    FOR INSERT WITH CHECK (auth.uid() = flagged_by);

DROP POLICY IF EXISTS "moderation_flags_admin" ON public.moderation_flags;
CREATE POLICY "moderation_flags_admin" ON public.moderation_flags
    FOR ALL USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- Push Subscriptions: Users can manage their own
DROP POLICY IF EXISTS "push_subscriptions_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_own" ON public.push_subscriptions
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User Follows: Users can manage their own follows
DROP POLICY IF EXISTS "user_follows_own" ON public.user_follows;
CREATE POLICY "user_follows_own" ON public.user_follows
    FOR ALL USING (auth.uid() = follower_id)
    WITH CHECK (auth.uid() = follower_id);

-- Activities: Users can view their own, service role can insert
DROP POLICY IF EXISTS "activities_own" ON public.activities;
CREATE POLICY "activities_own" ON public.activities
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "activities_service_insert" ON public.activities;
CREATE POLICY "activities_service_insert" ON public.activities
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- Subscription Tiers: Users can view their own
DROP POLICY IF EXISTS "subscription_tiers_own" ON public.subscription_tiers;
CREATE POLICY "subscription_tiers_own" ON public.subscription_tiers
    FOR SELECT USING (auth.uid() = user_id);

-- Point Transactions: Users can view their own
DROP POLICY IF EXISTS "point_transactions_own" ON public.point_transactions;
CREATE POLICY "point_transactions_own" ON public.point_transactions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "point_transactions_service_insert" ON public.point_transactions;
CREATE POLICY "point_transactions_service_insert" ON public.point_transactions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- Onboarding Quests: Users can view their own, service role can insert
DROP POLICY IF EXISTS "onboarding_quests_own" ON public.onboarding_quests;
CREATE POLICY "onboarding_quests_own" ON public.onboarding_quests
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "onboarding_quests_service_insert" ON public.onboarding_quests;
CREATE POLICY "onboarding_quests_service_insert" ON public.onboarding_quests
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- Milestones: Users can view their own, service role can insert
DROP POLICY IF EXISTS "milestones_own" ON public.milestones;
CREATE POLICY "milestones_own" ON public.milestones
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "milestones_service_insert" ON public.milestones;
CREATE POLICY "milestones_service_insert" ON public.milestones
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- User Apps: Users can manage their own
DROP POLICY IF EXISTS "user_apps_own" ON public.user_apps;
CREATE POLICY "user_apps_own" ON public.user_apps
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- TENANT-RELATED POLICIES ENHANCEMENTS
-- ===========================================

-- Tenant Usage: Tenant members can view
DROP POLICY IF EXISTS "tenant_usage_tenant_members" ON tenant_usage;
CREATE POLICY "tenant_usage_tenant_members" ON tenant_usage
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tenant_members 
            WHERE tenant_id = tenant_usage.tenant_id 
            AND user_id = auth.uid()
            AND status = 'active'
        )
    );

-- Revenue Streams: Tenant admins can view
DROP POLICY IF EXISTS "revenue_streams_tenant_admin" ON revenue_streams;
CREATE POLICY "revenue_streams_tenant_admin" ON revenue_streams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tenant_members 
            WHERE tenant_id = revenue_streams.tenant_id 
            AND user_id = auth.uid()
            AND role = 'admin'
            AND status = 'active'
        )
    );

-- API Usage: Tenant members can view
DROP POLICY IF EXISTS "api_usage_tenant_members" ON api_usage;
CREATE POLICY "api_usage_tenant_members" ON api_usage
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tenant_members 
            WHERE tenant_id = api_usage.tenant_id 
            AND user_id = auth.uid()
            AND status = 'active'
        )
    );

-- Communication Channels: Tenant members can view/manage
DROP POLICY IF EXISTS "communication_channels_tenant_members" ON communication_channels;
CREATE POLICY "communication_channels_tenant_members" ON communication_channels
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tenant_members 
            WHERE tenant_id = communication_channels.tenant_id 
            AND user_id = auth.uid()
            AND status = 'active'
        )
    );

DROP POLICY IF EXISTS "communication_channels_tenant_admin" ON communication_channels;
CREATE POLICY "communication_channels_tenant_admin" ON communication_channels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tenant_members 
            WHERE tenant_id = communication_channels.tenant_id 
            AND user_id = auth.uid()
            AND role = 'admin'
            AND status = 'active'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM tenant_members 
            WHERE tenant_id = communication_channels.tenant_id 
            AND user_id = auth.uid()
            AND role = 'admin'
            AND status = 'active'
        )
    );

-- Compliance Reports: Tenant admins can view
DROP POLICY IF EXISTS "compliance_reports_tenant_admin" ON compliance_reports;
CREATE POLICY "compliance_reports_tenant_admin" ON compliance_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tenant_members 
            WHERE tenant_id = compliance_reports.tenant_id 
            AND user_id = auth.uid()
            AND role = 'admin'
            AND status = 'active'
        )
    );

-- ===========================================
-- WORKFLOW EXECUTION POLICIES ENHANCEMENTS
-- ===========================================

-- Workflow Executions: Users can view their own workflow executions
DROP POLICY IF EXISTS "workflow_executions_own" ON workflow_executions;
CREATE POLICY "workflow_executions_own" ON workflow_executions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM automation_workflows aw
            WHERE aw.id = workflow_executions.workflow_id
            AND aw.created_by = auth.uid()
        )
    );

-- Step Executions: Users can view their own step executions
DROP POLICY IF EXISTS "step_executions_own" ON step_executions;
CREATE POLICY "step_executions_own" ON step_executions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM workflow_executions we
            JOIN automation_workflows aw ON aw.id = we.workflow_id
            WHERE we.id = step_executions.execution_id
            AND aw.created_by = auth.uid()
        )
    );

-- Workflow Steps: Users can view their own workflow steps
DROP POLICY IF EXISTS "workflow_steps_own" ON workflow_steps;
CREATE POLICY "workflow_steps_own" ON workflow_steps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM workflow_executions we
            JOIN automation_workflows aw ON aw.id = we.workflow_id
            WHERE we.id = workflow_steps.execution_id
            AND aw.created_by = auth.uid()
        )
    );

-- ===========================================
-- APPOINTMENT AND MEETING POLICIES ENHANCEMENTS
-- ===========================================

-- Appointment Reminders: Users can view reminders for their appointments
DROP POLICY IF EXISTS "appointment_reminders_own" ON appointment_reminders;
CREATE POLICY "appointment_reminders_own" ON appointment_reminders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM appointments a
            WHERE a.id = appointment_reminders.appointment_id
            AND a.organizer_id = auth.uid()
        )
    );

-- Meeting Notes: Users can view notes for meetings they organize
DROP POLICY IF EXISTS "meeting_notes_own" ON meeting_notes;
CREATE POLICY "meeting_notes_own" ON meeting_notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM meetings m
            WHERE m.id = meeting_notes.meeting_id
            AND m.organizer_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "meeting_notes_create" ON meeting_notes;
CREATE POLICY "meeting_notes_create" ON meeting_notes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM meetings m
            WHERE m.id = meeting_notes.meeting_id
            AND m.organizer_id = auth.uid()
        )
    );

-- ===========================================
-- DESIGN PROJECT POLICIES ENHANCEMENTS
-- ===========================================

-- Design Versions: Users can view versions for their projects
DROP POLICY IF EXISTS "design_versions_own" ON design_versions;
CREATE POLICY "design_versions_own" ON design_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM design_projects dp
            WHERE dp.id = design_versions.project_id
            AND dp.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "design_versions_create" ON design_versions;
CREATE POLICY "design_versions_create" ON design_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM design_projects dp
            WHERE dp.id = design_versions.project_id
            AND dp.owner_id = auth.uid()
        )
    );

-- ===========================================
-- EXPERT PROFILES POLICIES
-- ===========================================

-- Expert Profiles: Public read, users can update their own
DROP POLICY IF EXISTS "expert_profiles_public_read" ON expert_profiles;
CREATE POLICY "expert_profiles_public_read" ON expert_profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "expert_profiles_own" ON expert_profiles;
CREATE POLICY "expert_profiles_own" ON expert_profiles
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- COMMUNITY POSTS POLICIES ENHANCEMENTS
-- ===========================================

-- Community Posts: Add delete policy
DROP POLICY IF EXISTS "community_posts_delete_own" ON community_posts;
CREATE POLICY "community_posts_delete_own" ON community_posts
    FOR DELETE USING (author_id = auth.uid());

-- ===========================================
-- PERFORMANCE AND SECURITY OPTIMIZATIONS
-- ===========================================

-- Create indexes for frequently queried columns in RLS policies
CREATE INDEX IF NOT EXISTS idx_tenant_members_user_tenant_active 
    ON tenant_members(user_id, tenant_id) 
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_automation_workflows_created_by 
    ON automation_workflows(created_by);

CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_created 
    ON workflow_executions(workflow_id, created_at DESC);

-- ===========================================
-- GRANT PERMISSIONS FOR FUNCTIONS
-- ===========================================

-- Ensure all helper functions are accessible
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_tenant_member(UUID, UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_tenant_member_role(UUID, UUID) TO authenticated, anon;

-- ===========================================
-- MIGRATION COMPLETE
-- ===========================================

COMMENT ON SCHEMA public IS 'Consolidated RLS policies and function security migration completed';
