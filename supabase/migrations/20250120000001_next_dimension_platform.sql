-- Next Dimension Platform Schema
-- Multi-tenant SaaS platform with marketplace and AI agent ecosystem

-- Tenant Management
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled', 'trial')),
  settings JSONB DEFAULT '{}',
  limits JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB NOT NULL DEFAULT '[]',
  limits JSONB NOT NULL DEFAULT '{}',
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'professional', 'enterprise', 'custom')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant Usage Tracking
CREATE TABLE IF NOT EXISTS tenant_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace Items
CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('template', 'agent', 'integration', 'app')),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  author_id UUID REFERENCES auth.users(id),
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  preview_url TEXT,
  documentation_url TEXT,
  requirements TEXT[] DEFAULT '{}',
  compatibility TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Agents
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  capabilities TEXT[] DEFAULT '{}',
  model TEXT NOT NULL,
  training_data TEXT[] DEFAULT '{}',
  personality JSONB DEFAULT '{}',
  pricing JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'training', 'error')),
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Interactions
CREATE TABLE IF NOT EXISTS agent_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  output_text TEXT,
  processing_time DECIMAL(10,3),
  cost DECIMAL(10,4),
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Templates
CREATE TABLE IF NOT EXISTS workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  price DECIMAL(10,2) DEFAULT 0,
  nodes JSONB NOT NULL DEFAULT '[]',
  connections JSONB NOT NULL DEFAULT '[]',
  preview_url TEXT,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'beta', 'deprecated')),
  configuration JSONB DEFAULT '{}',
  capabilities TEXT[] DEFAULT '{}',
  pricing JSONB DEFAULT '{}',
  documentation_url TEXT,
  support_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant Integrations
CREATE TABLE IF NOT EXISTS tenant_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  configuration JSONB DEFAULT '{}',
  credentials JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, integration_id)
);

-- Revenue Tracking
CREATE TABLE IF NOT EXISTS revenue_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('subscription', 'usage', 'one_time', 'commission', 'licensing')),
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  period TEXT,
  item_id UUID,
  item_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Services
CREATE TABLE IF NOT EXISTS api_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
  pricing JSONB DEFAULT '{}',
  documentation_url TEXT,
  sdk_languages TEXT[] DEFAULT '{}',
  rate_limits JSONB DEFAULT '{}',
  authentication JSONB DEFAULT '{}',
  examples JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'beta', 'deprecated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Usage
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  api_service_id UUID REFERENCES api_services(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time DECIMAL(10,3),
  cost DECIMAL(10,4),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Demo Environments
CREATE TABLE IF NOT EXISTS demo_environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('workflow', 'agent', 'integration', 'app')),
  configuration JSONB DEFAULT '{}',
  data JSONB DEFAULT '{}',
  permissions TEXT[] DEFAULT '{}',
  time_limit INTEGER DEFAULT 60, -- in minutes
  max_users INTEGER DEFAULT 10,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactive Tutorials
CREATE TABLE IF NOT EXISTS interactive_tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration INTEGER DEFAULT 30, -- in minutes
  prerequisites TEXT[] DEFAULT '{}',
  outcomes TEXT[] DEFAULT '{}',
  resources JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('question', 'tip', 'showcase', 'announcement')),
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expert Profiles
CREATE TABLE IF NOT EXISTS expert_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  bio TEXT,
  avatar_url TEXT,
  expertise TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  projects INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
  hourly_rate DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action JSONB,
  read BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  channels TEXT[] DEFAULT '{}',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communication Channels
CREATE TABLE IF NOT EXISTS communication_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'slack', 'teams', 'discord', 'webhook')),
  configuration JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- Compliance Reports
CREATE TABLE IF NOT EXISTS compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('gdpr', 'ccpa', 'sox', 'hipaa', 'pci')),
  status TEXT NOT NULL CHECK (status IN ('compliant', 'non_compliant', 'partial', 'pending')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  issues JSONB DEFAULT '[]',
  recommendations TEXT[] DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_tenant_id ON tenant_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_metric_type ON tenant_usage(metric_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_type ON marketplace_items(type);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_status ON marketplace_items(status);
CREATE INDEX IF NOT EXISTS idx_ai_agents_tenant_id ON ai_agents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_status ON ai_agents(status);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_agent_id ON agent_interactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_tenant_id ON agent_interactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_tenant_id ON workflow_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_category ON workflow_templates(category);
CREATE INDEX IF NOT EXISTS idx_tenant_integrations_tenant_id ON tenant_integrations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_revenue_streams_tenant_id ON revenue_streams(tenant_id);
CREATE INDEX IF NOT EXISTS idx_revenue_streams_type ON revenue_streams(type);
CREATE INDEX IF NOT EXISTS idx_api_usage_tenant_id ON api_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_api_service_id ON api_usage(api_service_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts(type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Row Level Security (RLS) Policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;

-- Tenant Policies
CREATE POLICY "Users can view their tenant" ON tenants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_id = tenants.id AND user_id = auth.uid()
    )
  );

-- Marketplace Items Policies (Public read, Author write)
CREATE POLICY "Anyone can view published marketplace items" ON marketplace_items
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their marketplace items" ON marketplace_items
  FOR ALL USING (author_id = auth.uid());

-- AI Agents Policies
CREATE POLICY "Users can view agents in their tenant" ON ai_agents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_id = ai_agents.tenant_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create agents in their tenant" ON ai_agents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_id = ai_agents.tenant_id AND user_id = auth.uid()
    )
  );

-- Agent Interactions Policies
CREATE POLICY "Users can view interactions in their tenant" ON agent_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_id = agent_interactions.tenant_id AND user_id = auth.uid()
    )
  );

-- Workflow Templates Policies
CREATE POLICY "Users can view templates in their tenant" ON workflow_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_id = workflow_templates.tenant_id AND user_id = auth.uid()
    )
  );

-- Community Posts Policies
CREATE POLICY "Anyone can view community posts" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create community posts" ON community_posts
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own posts" ON community_posts
  FOR UPDATE USING (author_id = auth.uid());

-- Notifications Policies
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Functions for Platform Management
CREATE OR REPLACE FUNCTION create_tenant(
  p_name TEXT,
  p_subdomain TEXT,
  p_plan_id UUID
)
RETURNS UUID AS $$
DECLARE
  new_tenant_id UUID;
BEGIN
  INSERT INTO tenants (name, subdomain, plan_id)
  VALUES (p_name, p_subdomain, p_plan_id)
  RETURNING id INTO new_tenant_id;
  
  -- Add creator as tenant member
  INSERT INTO tenant_members (tenant_id, user_id, role)
  VALUES (new_tenant_id, auth.uid(), 'admin');
  
  RETURN new_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track usage
CREATE OR REPLACE FUNCTION track_usage(
  p_tenant_id UUID,
  p_metric_type TEXT,
  p_increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO tenant_usage (tenant_id, metric_type, usage_count, period_start, period_end)
  VALUES (
    p_tenant_id,
    p_metric_type,
    p_increment,
    date_trunc('month', NOW()),
    date_trunc('month', NOW()) + INTERVAL '1 month'
  )
  ON CONFLICT (tenant_id, metric_type, period_start)
  DO UPDATE SET usage_count = tenant_usage.usage_count + p_increment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check tenant limits
CREATE OR REPLACE FUNCTION check_tenant_limit(
  p_tenant_id UUID,
  p_metric_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
  limit_value INTEGER;
  tenant_limits JSONB;
BEGIN
  -- Get current usage
  SELECT COALESCE(SUM(usage_count), 0)
  INTO current_usage
  FROM tenant_usage
  WHERE tenant_id = p_tenant_id
    AND metric_type = p_metric_type
    AND period_start = date_trunc('month', NOW());
  
  -- Get tenant limits
  SELECT limits INTO tenant_limits
  FROM tenants
  WHERE id = p_tenant_id;
  
  -- Get limit value (unlimited if -1)
  limit_value := (tenant_limits->>p_metric_type)::INTEGER;
  
  -- Check if unlimited
  IF limit_value = -1 THEN
    RETURN TRUE;
  END IF;
  
  -- Check if within limits
  RETURN current_usage < limit_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at timestamps
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at
  BEFORE UPDATE ON marketplace_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_agents_updated_at
  BEFORE UPDATE ON ai_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_templates_updated_at
  BEFORE UPDATE ON workflow_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_integrations_updated_at
  BEFORE UPDATE ON tenant_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_services_updated_at
  BEFORE UPDATE ON api_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demo_environments_updated_at
  BEFORE UPDATE ON demo_environments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interactive_tutorials_updated_at
  BEFORE UPDATE ON interactive_tutorials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expert_profiles_updated_at
  BEFORE UPDATE ON expert_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_channels_updated_at
  BEFORE UPDATE ON communication_channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features, limits, tier) VALUES
('Starter', 'Perfect for small teams getting started', 29.00, 290.00, 
 '["5 Workflows", "1,000 Executions/month", "1GB Storage", "Basic Support"]',
 '{"workflows": 5, "executions": 1000, "storage": 1, "users": 5, "apiCalls": 10000, "aiProcessing": 100, "customAgents": 1, "integrations": 5}',
 'starter'),
('Professional', 'Advanced features for growing teams', 99.00, 990.00,
 '["25 Workflows", "10,000 Executions/month", "10GB Storage", "Priority Support", "Advanced Analytics"]',
 '{"workflows": 25, "executions": 10000, "storage": 10, "users": -1, "apiCalls": 50000, "aiProcessing": 1000, "customAgents": 5, "integrations": 20}',
 'professional'),
('Enterprise', 'Full-featured solution for large organizations', 299.00, 2990.00,
 '["Unlimited Workflows", "100,000 Executions/month", "100GB Storage", "24/7 Support", "Custom Integrations", "White-label Options"]',
 '{"workflows": -1, "executions": 100000, "storage": 100, "users": -1, "apiCalls": 500000, "aiProcessing": 10000, "customAgents": 50, "integrations": -1}',
 'enterprise');

-- Insert sample integrations
INSERT INTO integrations (name, description, category, provider, configuration, capabilities, pricing) VALUES
('Salesforce CRM', 'Seamless integration with Salesforce for lead management and automation', 'crm', 'Salesforce',
 '{"authType": "oauth2", "scopes": ["api", "refresh_token"], "endpoints": [{"name": "leads", "url": "/api/v1/leads", "method": "GET"}]}',
 '["lead_management", "contact_sync", "opportunity_tracking", "custom_objects"]',
 '{"free": true}'),
('Slack', 'Connect your workflows to Slack for notifications and team collaboration', 'communication', 'Slack',
 '{"authType": "oauth2", "scopes": ["chat:write", "channels:read"], "endpoints": [{"name": "send_message", "url": "/api/chat.postMessage", "method": "POST"}]}',
 '["send_messages", "create_channels", "user_management", "file_sharing"]',
 '{"free": true}'),
('Google Calendar', 'Calendar integration for appointment scheduling and event management', 'calendar', 'Google',
 '{"authType": "oauth2", "scopes": ["https://www.googleapis.com/auth/calendar"], "endpoints": [{"name": "events", "url": "/calendar/v3/events", "method": "GET"}]}',
 '["event_management", "availability_checking", "meeting_scheduling", "recurring_events"]',
 '{"free": true}'),
('HubSpot', 'Comprehensive CRM integration with marketing automation', 'crm', 'HubSpot',
 '{"authType": "api_key", "endpoints": [{"name": "contacts", "url": "/crm/v3/objects/contacts", "method": "GET"}]}',
 '["contact_management", "deal_tracking", "email_marketing", "lead_scoring"]',
 '{"free": true}'),
('Zapier', 'Connect to 5000+ apps through Zapier integration', 'automation', 'Zapier',
 '{"authType": "api_key", "endpoints": [{"name": "triggers", "url": "/v1/triggers", "method": "GET"}]}',
 '["app_connections", "trigger_automation", "data_transformation", "webhook_management"]',
 '{"free": false, "price": 19.99, "currency": "USD", "period": "month"}');

-- Insert sample API services
INSERT INTO api_services (name, description, endpoint, method, pricing, documentation_url, sdk_languages, rate_limits, authentication) VALUES
('AI Text Generation', 'Generate human-like text using advanced AI models', '/api/v1/ai/generate', 'POST',
 '{"freeTier": {"requests": 100, "period": "month"}, "paidTiers": [{"name": "Basic", "price": 0.01, "requests": 1000, "features": ["gpt-3.5-turbo"]}, {"name": "Pro", "price": 0.05, "requests": 10000, "features": ["gpt-4", "claude-3"]}]}',
 'https://docs.aias.com/api/text-generation',
 '["javascript", "python", "curl", "php", "ruby"]',
 '{"requests": 100, "period": "minute", "burst": 200}',
 '{"type": "api_key", "required": true}'),
('Lead Scoring', 'AI-powered lead qualification and scoring', '/api/v1/leads/score', 'POST',
 '{"freeTier": {"requests": 50, "period": "month"}, "paidTiers": [{"name": "Starter", "price": 0.25, "requests": 500, "features": ["basic_scoring"]}, {"name": "Advanced", "price": 0.50, "requests": 2000, "features": ["advanced_scoring", "custom_models"]}]}',
 'https://docs.aias.com/api/lead-scoring',
 '["javascript", "python", "curl"]',
 '{"requests": 50, "period": "minute"}',
 '{"type": "api_key", "required": true}'),
('Workflow Execution', 'Execute automation workflows via API', '/api/v1/workflows/execute', 'POST',
 '{"freeTier": {"requests": 10, "period": "month"}, "paidTiers": [{"name": "Basic", "price": 0.10, "requests": 100, "features": ["basic_workflows"]}, {"name": "Pro", "price": 0.20, "requests": 1000, "features": ["advanced_workflows", "ai_processing"]}]}',
 'https://docs.aias.com/api/workflow-execution',
 '["javascript", "python", "curl", "php"]',
 '{"requests": 20, "period": "minute"}',
 '{"type": "api_key", "required": true}');

COMMIT;