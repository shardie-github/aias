-- ===========================================
-- ENTERPRISE SECURITY & COMPLIANCE MIGRATION
-- ===========================================
-- This migration implements advanced security features,
-- compliance frameworks, and enterprise-grade monitoring

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_audit";
CREATE EXTENSION IF NOT EXISTS "pgaudit";

-- ===========================================
-- SECURITY & AUDIT TABLES
-- ===========================================

-- Security Events Table
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    source_ip INET,
    user_id UUID,
    resource_type TEXT,
    resource_id TEXT,
    action TEXT NOT NULL,
    details JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive'))
);

-- Failed Login Attempts
CREATE TABLE failed_login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    ip_address INET NOT NULL,
    user_agent TEXT,
    attempt_count INTEGER DEFAULT 1,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blocked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Policies
CREATE TABLE security_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    policy_type TEXT NOT NULL CHECK (policy_type IN ('access_control', 'data_protection', 'audit', 'compliance')),
    rules JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- PRIVACY & COMPLIANCE TABLES
-- ===========================================

-- Data Subjects (GDPR/CCPA)
CREATE TABLE data_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    phone TEXT,
    external_id TEXT,
    data_residency_region TEXT DEFAULT 'US',
    consent_status TEXT DEFAULT 'pending' CHECK (consent_status IN ('pending', 'granted', 'withdrawn', 'expired')),
    consent_version TEXT,
    consent_timestamp TIMESTAMP WITH TIME ZONE,
    data_retention_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consent Management
CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_subject_id UUID REFERENCES data_subjects(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL,
    purpose TEXT NOT NULL,
    granted BOOLEAN NOT NULL,
    consent_method TEXT,
    ip_address INET,
    user_agent TEXT,
    consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    withdrawn_at TIMESTAMP WITH TIME ZONE,
    version TEXT DEFAULT '1.0'
);

-- Data Processing Activities
CREATE TABLE data_processing_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    purpose TEXT NOT NULL,
    legal_basis TEXT NOT NULL,
    data_categories TEXT[],
    data_subjects TEXT[],
    recipients TEXT[],
    third_country_transfers BOOLEAN DEFAULT false,
    retention_period INTEGER, -- in days
    technical_measures JSONB,
    organizational_measures JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data Subject Requests (GDPR Article 15-22)
CREATE TABLE data_subject_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_subject_id UUID REFERENCES data_subjects(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('access', 'rectification', 'erasure', 'portability', 'restriction', 'objection')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
    description TEXT,
    requested_data JSONB,
    response_data JSONB,
    verification_method TEXT,
    verification_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE
);

-- ===========================================
-- ENTERPRISE MONITORING TABLES
-- ===========================================

-- System Metrics
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value DECIMAL,
    metric_unit TEXT,
    tags JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT NOT NULL
);

-- Performance Metrics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    endpoint TEXT,
    response_time_ms INTEGER,
    status_code INTEGER,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    user_id UUID,
    session_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Metrics
CREATE TABLE business_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL,
    dimensions JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE
);

-- ===========================================
-- AUTOMATION & WORKFLOW TABLES
-- ===========================================

-- Workflow Definitions
CREATE TABLE workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    version TEXT DEFAULT '1.0',
    definition JSONB NOT NULL,
    triggers JSONB,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflow_definitions(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Steps
CREATE TABLE workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL,
    step_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ENTERPRISE FEATURES TABLES
-- ===========================================

-- Multi-tenant Support
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,
    domain TEXT,
    plan_id UUID,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled', 'trial')),
    settings JSONB,
    limits JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    features JSONB NOT NULL,
    limits JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE tenant_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Security Events Indexes
CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_source_ip ON security_events(source_ip);

-- Failed Login Attempts Indexes
CREATE INDEX idx_failed_logins_email ON failed_login_attempts(email);
CREATE INDEX idx_failed_logins_ip ON failed_login_attempts(ip_address);
CREATE INDEX idx_failed_logins_created_at ON failed_login_attempts(created_at);

-- Data Subjects Indexes
CREATE INDEX idx_data_subjects_email ON data_subjects(email);
CREATE INDEX idx_data_subjects_consent_status ON data_subjects(consent_status);
CREATE INDEX idx_data_subjects_region ON data_subjects(data_residency_region);

-- Consent Records Indexes
CREATE INDEX idx_consent_records_subject_id ON consent_records(data_subject_id);
CREATE INDEX idx_consent_records_type ON consent_records(consent_type);
CREATE INDEX idx_consent_records_timestamp ON consent_records(consent_timestamp);

-- Data Subject Requests Indexes
CREATE INDEX idx_dsr_subject_id ON data_subject_requests(data_subject_id);
CREATE INDEX idx_dsr_type ON data_subject_requests(request_type);
CREATE INDEX idx_dsr_status ON data_subject_requests(status);
CREATE INDEX idx_dsr_created_at ON data_subject_requests(created_at);

-- Performance Metrics Indexes
CREATE INDEX idx_performance_metrics_service ON performance_metrics(service_name);
CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX idx_performance_metrics_user_id ON performance_metrics(user_id);

-- Workflow Indexes
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_workflow_executions_created_at ON workflow_executions(created_at);

-- Tenant Indexes
CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX idx_tenants_status ON tenants(status);

-- Usage Tracking Indexes
CREATE INDEX idx_tenant_usage_tenant_id ON tenant_usage(tenant_id);
CREATE INDEX idx_tenant_usage_metric_type ON tenant_usage(metric_type);
CREATE INDEX idx_tenant_usage_period ON tenant_usage(period_start, period_end);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_processing_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_usage ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- AUDIT TRIGGERS
-- ===========================================

-- Create audit function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO security_events (
        event_type,
        severity,
        user_id,
        resource_type,
        resource_id,
        action,
        details,
        created_at
    ) VALUES (
        'data_change',
        'medium',
        COALESCE(current_setting('app.current_user_id', true)::uuid, auth.uid()),
        TG_TABLE_NAME,
        COALESCE(NEW.id::text, OLD.id::text),
        TG_OP,
        jsonb_build_object(
            'old_data', CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
            'new_data', CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
        ),
        NOW()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_data_subjects_trigger
    AFTER INSERT OR UPDATE OR DELETE ON data_subjects
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_consent_records_trigger
    AFTER INSERT OR UPDATE OR DELETE ON consent_records
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_data_subject_requests_trigger
    AFTER INSERT OR UPDATE OR DELETE ON data_subject_requests
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_tenants_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tenants
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ===========================================
-- SECURITY FUNCTIONS
-- ===========================================

-- Function to check failed login attempts
CREATE OR REPLACE FUNCTION check_failed_login_attempts(
    p_email TEXT,
    p_ip_address INET
) RETURNS BOOLEAN AS $$
DECLARE
    attempt_count INTEGER;
    blocked_until TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get current attempt count and block status
    SELECT 
        attempt_count,
        blocked_until
    INTO 
        attempt_count,
        blocked_until
    FROM failed_login_attempts
    WHERE email = p_email OR ip_address = p_ip_address
    ORDER BY last_attempt DESC
    LIMIT 1;
    
    -- Check if currently blocked
    IF blocked_until IS NOT NULL AND blocked_until > NOW() THEN
        RETURN FALSE;
    END IF;
    
    -- Check attempt count (block after 5 attempts)
    IF attempt_count >= 5 THEN
        -- Block for 15 minutes
        UPDATE failed_login_attempts
        SET blocked_until = NOW() + INTERVAL '15 minutes'
        WHERE email = p_email OR ip_address = p_ip_address;
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record failed login attempt
CREATE OR REPLACE FUNCTION record_failed_login_attempt(
    p_email TEXT,
    p_ip_address INET,
    p_user_agent TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO failed_login_attempts (email, ip_address, user_agent, attempt_count)
    VALUES (p_email, p_ip_address, p_user_agent, 1)
    ON CONFLICT (email, ip_address) 
    DO UPDATE SET 
        attempt_count = failed_login_attempts.attempt_count + 1,
        last_attempt = NOW(),
        user_agent = p_user_agent;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clear failed login attempts on successful login
CREATE OR REPLACE FUNCTION clear_failed_login_attempts(
    p_email TEXT,
    p_ip_address INET
) RETURNS VOID AS $$
BEGIN
    DELETE FROM failed_login_attempts
    WHERE email = p_email OR ip_address = p_ip_address;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- COMPLIANCE FUNCTIONS
-- ===========================================

-- Function to handle data subject access request
CREATE OR REPLACE FUNCTION handle_data_subject_access_request(
    p_data_subject_id UUID,
    p_request_type TEXT
) RETURNS UUID AS $$
DECLARE
    request_id UUID;
BEGIN
    INSERT INTO data_subject_requests (
        data_subject_id,
        request_type,
        due_date
    ) VALUES (
        p_data_subject_id,
        p_request_type,
        NOW() + INTERVAL '30 days'
    ) RETURNING id INTO request_id;
    
    RETURN request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to anonymize personal data
CREATE OR REPLACE FUNCTION anonymize_personal_data(
    p_data_subject_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Anonymize data subjects table
    UPDATE data_subjects
    SET 
        email = 'anonymized_' || id::text || '@example.com',
        phone = NULL,
        external_id = 'anonymized_' || id::text
    WHERE id = p_data_subject_id;
    
    -- Anonymize consent records
    UPDATE consent_records
    SET 
        ip_address = '0.0.0.0',
        user_agent = 'anonymized'
    WHERE data_subject_id = p_data_subject_id;
    
    -- Log the anonymization
    INSERT INTO security_events (
        event_type,
        severity,
        resource_type,
        resource_id,
        action,
        details
    ) VALUES (
        'data_anonymization',
        'high',
        'data_subjects',
        p_data_subject_id::text,
        'anonymize',
        jsonb_build_object('data_subject_id', p_data_subject_id)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- MONITORING FUNCTIONS
-- ===========================================

-- Function to record performance metrics
CREATE OR REPLACE FUNCTION record_performance_metric(
    p_service_name TEXT,
    p_endpoint TEXT,
    p_response_time_ms INTEGER,
    p_status_code INTEGER,
    p_request_size_bytes INTEGER,
    p_response_size_bytes INTEGER,
    p_user_id UUID DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO performance_metrics (
        service_name,
        endpoint,
        response_time_ms,
        status_code,
        request_size_bytes,
        response_size_bytes,
        user_id,
        session_id
    ) VALUES (
        p_service_name,
        p_endpoint,
        p_response_time_ms,
        p_status_code,
        p_request_size_bytes,
        p_response_size_bytes,
        p_user_id,
        p_session_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record business metrics
CREATE OR REPLACE FUNCTION record_business_metric(
    p_metric_type TEXT,
    p_metric_name TEXT,
    p_metric_value DECIMAL,
    p_dimensions JSONB DEFAULT NULL,
    p_period_start TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_period_end TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO business_metrics (
        metric_type,
        metric_name,
        metric_value,
        dimensions,
        period_start,
        period_end
    ) VALUES (
        p_metric_type,
        p_metric_name,
        p_metric_value,
        p_dimensions,
        p_period_start,
        p_period_end
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- INITIAL DATA
-- ===========================================

-- Insert default security policies
INSERT INTO security_policies (name, description, policy_type, rules) VALUES
('Default Access Control', 'Default access control policy', 'access_control', '{"max_failed_attempts": 5, "lockout_duration": 900, "require_mfa": false}'),
('Data Protection Policy', 'GDPR/CCPA data protection policy', 'data_protection', '{"retention_period": 2555, "anonymization_required": true, "consent_required": true}'),
('Audit Policy', 'Comprehensive audit logging policy', 'audit', '{"log_all_changes": true, "retention_period": 2555, "include_metadata": true}'),
('Compliance Policy', 'Regulatory compliance policy', 'compliance', '{"gdpr_compliant": true, "ccpa_compliant": true, "sox_compliant": true}');

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features, limits) VALUES
('Starter', 'Basic plan for small teams', 29.00, 290.00, 
 '{"workflows": 5, "users": 5, "storage": "1GB", "support": "email"}',
 '{"workflow_executions": 1000, "api_calls": 10000, "storage_gb": 1}'),
('Professional', 'Advanced plan for growing businesses', 99.00, 990.00,
 '{"workflows": 25, "users": 25, "storage": "10GB", "support": "priority"}',
 '{"workflow_executions": 10000, "api_calls": 100000, "storage_gb": 10}'),
('Enterprise', 'Full-featured plan for large organizations', 299.00, 2990.00,
 '{"workflows": -1, "users": -1, "storage": "100GB", "support": "dedicated"}',
 '{"workflow_executions": 100000, "api_calls": 1000000, "storage_gb": 100}');

-- ===========================================
-- COMMENTS AND DOCUMENTATION
-- ===========================================

COMMENT ON TABLE security_events IS 'Comprehensive security event logging for threat detection and incident response';
COMMENT ON TABLE failed_login_attempts IS 'Tracks failed login attempts for brute force protection';
COMMENT ON TABLE data_subjects IS 'GDPR/CCPA data subject registry for privacy compliance';
COMMENT ON TABLE consent_records IS 'Detailed consent management for privacy compliance';
COMMENT ON TABLE data_processing_activities IS 'GDPR Article 30 record of processing activities';
COMMENT ON TABLE data_subject_requests IS 'GDPR Article 15-22 data subject rights requests';
COMMENT ON TABLE system_metrics IS 'System performance and health metrics';
COMMENT ON TABLE performance_metrics IS 'Application performance monitoring data';
COMMENT ON TABLE business_metrics IS 'Business intelligence and analytics metrics';
COMMENT ON TABLE workflow_definitions IS 'Automation workflow definitions and templates';
COMMENT ON TABLE workflow_executions IS 'Workflow execution history and status';
COMMENT ON TABLE tenants IS 'Multi-tenant organization management';
COMMENT ON TABLE subscription_plans IS 'Subscription tier definitions and pricing';

-- ===========================================
-- MIGRATION COMPLETE
-- ===========================================

-- Log migration completion
INSERT INTO security_events (
    event_type,
    severity,
    action,
    details
) VALUES (
    'migration',
    'low',
    'enterprise_security_compliance_migration_completed',
    jsonb_build_object(
        'migration_version', '20250120000002',
        'tables_created', 15,
        'indexes_created', 25,
        'functions_created', 8,
        'triggers_created', 4
    )
);
