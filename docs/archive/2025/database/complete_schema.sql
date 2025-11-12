-- ===========================================
-- ARCHIVED: Complete schema dump - use migrations in supabase/migrations/ instead
-- Archived on: 2025-11-12
-- Note: This is a snapshot dump. Use individual migrations in supabase/migrations/ for production.
-- ===========================================
-- COMPLETE SUPABASE SCHEMA FOR AIAS PLATFORM
-- ===========================================
-- This script creates all database tables, policies, and functions
-- Run this in Supabase SQL Editor
-- Note: Edge functions are TypeScript files deployed separately via Supabase CLI

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For AI embeddings

-- ===========================================
-- CORE USER & PROFILE TABLES
-- ===========================================

-- App role enum
CREATE TYPE IF NOT EXISTS public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  referral_code TEXT UNIQUE,
  total_xp INT DEFAULT 0,
  total_referrals INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- ===========================================
-- GAMIFICATION TABLES
-- ===========================================

-- Journal entries
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE IF NOT EXISTS public.badges (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id BIGINT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Streaks
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  days INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts
CREATE TABLE IF NOT EXISTS public.posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[],
  is_pinned BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reactions
CREATE TABLE IF NOT EXISTS public.reactions (
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id, emoji)
);

-- Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  parent_id BIGINT REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moderation flags
CREATE TABLE IF NOT EXISTS public.moderation_flags (
  id BIGSERIAL PRIMARY KEY,
  flagged_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id BIGINT REFERENCES public.comments(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT one_target CHECK ((post_id IS NOT NULL)::INT + (comment_id IS NOT NULL)::INT = 1)
);

-- Referrals
CREATE TABLE IF NOT EXISTS public.referrals (
  id BIGSERIAL PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted', 'rewarded')),
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('weekly', 'monthly', 'seasonal', 'special')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  xp_reward INT DEFAULT 50,
  badge_id BIGINT REFERENCES public.badges(id),
  requirements JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge participants
CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id BIGSERIAL PRIMARY KEY,
  challenge_id BIGINT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- Leaderboard entries
CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'all_time')),
  period_start TIMESTAMPTZ NOT NULL,
  xp_earned INT DEFAULT 0,
  rank INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period, period_start)
);

-- Push subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('streak_reminder', 'challenge_started', 'challenge_completed', 'badge_earned', 'level_up', 'comment_reply', 'reaction', 'referral_reward', 'milestone')),
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User follows
CREATE TABLE IF NOT EXISTS public.user_follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Activities
CREATE TABLE IF NOT EXISTS public.activities (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('post_created', 'comment_added', 'badge_earned', 'level_up', 'challenge_completed', 'streak_milestone', 'referral_sent')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription tiers
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'starter', 'pro', 'enterprise')),
  xp_multiplier DECIMAL(3,2) DEFAULT 1.0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User points
CREATE TABLE IF NOT EXISTS public.user_points (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points INT DEFAULT 0,
  total_earned INT DEFAULT 0,
  total_spent INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Point transactions
CREATE TABLE IF NOT EXISTS public.point_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'expired', 'bonus')),
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding quests
CREATE TABLE IF NOT EXISTS public.onboarding_quests (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_type TEXT NOT NULL CHECK (quest_type IN ('profile_setup', 'first_post', 'first_journal', 'first_reaction', 'invite_friend')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_type)
);

-- Milestones
CREATE TABLE IF NOT EXISTS public.milestones (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('streak_7', 'streak_30', 'streak_100', 'level_10', 'level_25', 'level_50', 'xp_1000', 'xp_10000', 'first_badge', 'badge_collector')),
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, milestone_type)
);

-- ===========================================
-- ANALYTICS & TELEMETRY TABLES
-- ===========================================

-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  app TEXT,
  type TEXT,
  path TEXT,
  meta JSONB,
  ts TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  device TEXT,
  locale TEXT,
  country TEXT
);

-- User apps
CREATE TABLE IF NOT EXISTS public.user_apps (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app TEXT NOT NULL,
  connected BOOLEAN DEFAULT FALSE,
  meta JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, app)
);

-- Signals
CREATE TABLE IF NOT EXISTS public.signals (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  window TEXT NOT NULL,
  k TEXT NOT NULL,
  v NUMERIC NOT NULL,
  meta JSONB,
  computed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Segments
CREATE TABLE IF NOT EXISTS public.segments (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT
);

-- User segments
CREATE TABLE IF NOT EXISTS public.user_segments (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  segment_id BIGINT REFERENCES public.segments(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, segment_id)
);

-- Recommendations
CREATE TABLE IF NOT EXISTS public.recommendations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  kind TEXT NOT NULL,
  score NUMERIC NOT NULL DEFAULT 0,
  rationale JSONB,
  cta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  dismissed BOOLEAN DEFAULT FALSE,
  accepted BOOLEAN DEFAULT FALSE
);

-- Support diagnostics
CREATE TABLE IF NOT EXISTS public.support_diagnostics (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hypothesis TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  evidence JSONB,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Telemetry events
CREATE TABLE IF NOT EXISTS public.telemetry_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app TEXT DEFAULT 'web',
  type TEXT NOT NULL,
  path TEXT,
  meta JSONB,
  ts TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- AI & EMBEDDINGS TABLES
-- ===========================================

-- AI embeddings
CREATE TABLE IF NOT EXISTS ai_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  namespace TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI health metrics
CREATE TABLE IF NOT EXISTS ai_health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deployment_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  metrics JSONB NOT NULL,
  patterns JSONB NOT NULL,
  recommendations TEXT[] DEFAULT '{}',
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI insights
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deployment_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  insights JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- CHAT TABLES
-- ===========================================

-- Chat conversations
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- MULTI-TENANT TABLES
-- ===========================================

-- Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  domain TEXT,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled', 'trial')),
  settings JSONB DEFAULT '{}',
  limits JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription plans
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant members
CREATE TABLE IF NOT EXISTS tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer', 'billing')),
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'removed')),
  last_active TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Tenant usage
CREATE TABLE IF NOT EXISTS tenant_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  usage_count INT DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- MARKETPLACE & AI AGENTS TABLES
-- ===========================================

-- Marketplace items
CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('template', 'agent', 'integration', 'app')),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  author_id UUID REFERENCES auth.users(id),
  downloads INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  preview_url TEXT,
  documentation_url TEXT,
  requirements TEXT[] DEFAULT '{}',
  compatibility TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI agents
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent interactions
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow templates
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
  downloads INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant integrations
CREATE TABLE IF NOT EXISTS tenant_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  configuration JSONB DEFAULT '{}',
  credentials JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, integration_id)
);

-- Revenue streams
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API services
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API usage
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  api_service_id UUID REFERENCES api_services(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INT,
  response_time DECIMAL(10,3),
  cost DECIMAL(10,4),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PRIVACY & SECURITY TABLES
-- ===========================================

-- Privacy consents
CREATE TABLE IF NOT EXISTS privacy_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_id TEXT UNIQUE NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  jurisdiction TEXT NOT NULL DEFAULT 'EU',
  consent_version TEXT NOT NULL DEFAULT '2.1',
  ip_address INET,
  user_agent TEXT,
  data_processing_purposes TEXT[],
  retention_period INT NOT NULL DEFAULT 365,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data subjects
CREATE TABLE IF NOT EXISTS data_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_id TEXT REFERENCES privacy_consents(consent_id),
  data_categories TEXT[],
  processing_basis TEXT NOT NULL DEFAULT 'consent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data subject requests
CREATE TABLE IF NOT EXISTS data_subject_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'rectification', 'erasure', 'portability', 'restriction', 'objection')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  request_data JSONB,
  response_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Security events
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Threat detections
CREATE TABLE IF NOT EXISTS threat_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  threat_type TEXT NOT NULL,
  risk_score INT NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  details JSONB,
  mitigated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Failed attempts
CREATE TABLE IF NOT EXISTS failed_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  attempt_count INT DEFAULT 1,
  last_attempt TIMESTAMPTZ DEFAULT NOW(),
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security policies
CREATE TABLE IF NOT EXISTS security_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('access_control', 'data_protection', 'audit', 'compliance')),
  rules JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- AUTOMATION & WORKFLOW TABLES
-- ===========================================

-- Automation workflows
CREATE TABLE IF NOT EXISTS automation_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_config JSONB NOT NULL,
  steps JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
  category TEXT NOT NULL,
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow executions
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES automation_workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  trigger_data JSONB,
  context JSONB,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  error_message TEXT
);

-- Step executions
CREATE TABLE IF NOT EXISTS step_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL,
  step_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ
);

-- Workflow definitions
CREATE TABLE IF NOT EXISTS workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0',
  definition JSONB NOT NULL,
  triggers JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow steps
CREATE TABLE IF NOT EXISTS workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- LEAD GENERATION & BOOKING TABLES
-- ===========================================

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  phone TEXT,
  source TEXT,
  score INT DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'contacted', 'converted', 'lost')),
  assigned_to UUID REFERENCES auth.users(id),
  qualification_data JSONB,
  enrichment_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead sources
CREATE TABLE IF NOT EXISTS lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  config JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  meeting_type TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
  organizer_id UUID REFERENCES auth.users(id),
  location TEXT,
  meeting_url TEXT,
  participants JSONB,
  ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointment reminders
CREATE TABLE IF NOT EXISTS appointment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  timing_hours INT NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  organizer_id UUID REFERENCES auth.users(id),
  participants JSONB,
  meeting_url TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting notes
CREATE TABLE IF NOT EXISTS meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  transcription TEXT,
  summary TEXT,
  action_items JSONB,
  insights JSONB,
  format TEXT DEFAULT 'text' CHECK (format IN ('text', 'markdown', 'structured', 'ai_enhanced')),
  ai_enhanced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- DESIGN & TRUST TABLES
-- ===========================================

-- Design projects
CREATE TABLE IF NOT EXISTS design_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'review', 'completed', 'archived')),
  owner_id UUID REFERENCES auth.users(id),
  collaborators JSONB,
  ai_assistance BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design versions
CREATE TABLE IF NOT EXISTS design_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES design_projects(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  design_data JSONB NOT NULL,
  ai_enhanced BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trust badges
CREATE TABLE IF NOT EXISTS trust_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  issuer TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  status TEXT DEFAULT 'verified' CHECK (status IN ('verified', 'pending', 'expired')),
  verification_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance metrics
CREATE TABLE IF NOT EXISTS compliance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  target_value NUMERIC,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- GUARDIAN TRUST LEDGER TABLES
-- ===========================================

-- Trust ledger roots
CREATE TABLE IF NOT EXISTS trust_ledger_roots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hash_root TEXT NOT NULL,
  event_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Guardian preferences
CREATE TABLE IF NOT EXISTS guardian_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  trust_level TEXT NOT NULL DEFAULT 'balanced' CHECK (trust_level IN ('strict', 'balanced', 'relaxed')),
  auto_adjust BOOLEAN DEFAULT TRUE,
  risk_weights JSONB DEFAULT '{}',
  disabled_scopes TEXT[] DEFAULT ARRAY[]::TEXT[],
  disabled_data_classes TEXT[] DEFAULT ARRAY[]::TEXT[],
  sensitive_contexts TEXT[] DEFAULT ARRAY[]::TEXT[],
  private_mode_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guardian events
CREATE TABLE IF NOT EXISTS guardian_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  scope TEXT NOT NULL,
  data_class TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  risk_score NUMERIC NOT NULL,
  action_taken TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- AUDIT & MONITORING TABLES
-- ===========================================

-- Audit log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  meta JSONB DEFAULT '{}'::jsonb,
  ts TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs (enhanced)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  resource_type TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- Rate limits
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(identifier, endpoint)
);

-- System metrics
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL,
  metric_unit TEXT,
  tags JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  source TEXT NOT NULL
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  endpoint TEXT,
  response_time_ms INT,
  status_code INT,
  request_size_bytes INT,
  response_size_bytes INT,
  user_id UUID,
  session_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Business metrics
CREATE TABLE IF NOT EXISTS business_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL,
  dimensions JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ
);

-- ===========================================
-- COMMUNITY & DEMO TABLES
-- ===========================================

-- Community posts
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('question', 'tip', 'showcase', 'announcement')),
  tags TEXT[] DEFAULT '{}',
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expert profiles
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
  projects INT DEFAULT 0,
  followers INT DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
  hourly_rate DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo environments
CREATE TABLE IF NOT EXISTS demo_environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('workflow', 'agent', 'integration', 'app')),
  configuration JSONB DEFAULT '{}',
  data JSONB DEFAULT '{}',
  permissions TEXT[] DEFAULT '{}',
  time_limit INT DEFAULT 60,
  max_users INT DEFAULT 10,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interactive tutorials
CREATE TABLE IF NOT EXISTS interactive_tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration INT DEFAULT 30,
  prerequisites TEXT[] DEFAULT '{}',
  outcomes TEXT[] DEFAULT '{}',
  resources JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication channels
CREATE TABLE IF NOT EXISTS communication_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'slack', 'teams', 'discord', 'webhook')),
  configuration JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance reports
CREATE TABLE IF NOT EXISTS compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('gdpr', 'ccpa', 'sox', 'hipaa', 'pci')),
  status TEXT NOT NULL CHECK (status IN ('compliant', 'non_compliant', 'partial', 'pending')),
  score INT NOT NULL CHECK (score >= 0 AND score <= 100),
  issues JSONB DEFAULT '[]',
  recommendations TEXT[] DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL
);

-- ===========================================
-- CREATE INDEXES
-- ===========================================

-- Profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Gamification indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON public.challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON public.leaderboard_entries(period, period_start, rank);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON public.user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON public.activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_user ON public.subscription_tiers(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON public.point_transactions(user_id, created_at DESC);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_ts ON public.events(ts);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_signals_user_id ON public.signals(user_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_user_id ON public.telemetry_events(user_id);

-- AI indexes
CREATE INDEX IF NOT EXISTS ai_embeddings_embedding_idx ON ai_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS ai_embeddings_namespace_idx ON ai_embeddings(namespace);
CREATE INDEX IF NOT EXISTS ai_embeddings_metadata_idx ON ai_embeddings USING GIN (metadata);
CREATE INDEX IF NOT EXISTS ai_health_metrics_deployment_idx ON ai_health_metrics(deployment_id, environment);
CREATE INDEX IF NOT EXISTS ai_health_metrics_timestamp_idx ON ai_health_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS ai_insights_deployment_idx ON ai_insights(deployment_id, environment);

-- Chat indexes
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Tenant indexes
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant_id ON tenant_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_user_id ON tenant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_role ON tenant_members(role);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_tenant_id ON tenant_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_metric_type ON tenant_usage(metric_type);

-- Marketplace indexes
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
CREATE INDEX IF NOT EXISTS idx_api_usage_tenant_id ON api_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_api_service_id ON api_usage(api_service_id);

-- Privacy indexes
CREATE INDEX IF NOT EXISTS idx_privacy_consents_user_id ON privacy_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_consents_consent_id ON privacy_consents(consent_id);
CREATE INDEX IF NOT EXISTS idx_data_subjects_user_id ON data_subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_threat_detections_user_id ON threat_detections(user_id);
CREATE INDEX IF NOT EXISTS idx_failed_attempts_user_ip ON failed_attempts(user_id, ip_address);

-- Workflow indexes
CREATE INDEX IF NOT EXISTS idx_automation_workflows_status ON automation_workflows(status);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_category ON automation_workflows(category);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_step_executions_execution_id ON step_executions(execution_id);

-- Lead indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_organizer_id ON appointments(organizer_id);
CREATE INDEX IF NOT EXISTS idx_meetings_organizer_id ON meetings(organizer_id);
CREATE INDEX IF NOT EXISTS idx_meeting_notes_meeting_id ON meeting_notes(meeting_id);
CREATE INDEX IF NOT EXISTS idx_design_projects_owner_id ON design_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_design_versions_project_id ON design_versions(project_id);

-- Guardian indexes
CREATE INDEX IF NOT EXISTS idx_trust_ledger_roots_user_id ON trust_ledger_roots(user_id);
CREATE INDEX IF NOT EXISTS idx_trust_ledger_roots_date ON trust_ledger_roots(date);
CREATE INDEX IF NOT EXISTS idx_guardian_preferences_user_id ON guardian_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_guardian_events_user_id ON guardian_events(user_id);
CREATE INDEX IF NOT EXISTS idx_guardian_events_created_at ON guardian_events(created_at);
CREATE INDEX IF NOT EXISTS idx_guardian_events_risk_level ON guardian_events(risk_level);

-- Audit indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_ts ON public.audit_log(ts DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON public.audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_service ON performance_metrics(service_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- Community indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts(type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON notifications(tenant_id);

-- ===========================================
-- ENABLE ROW LEVEL SECURITY
-- ===========================================

-- Core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Analytics tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_events ENABLE ROW LEVEL SECURITY;

-- AI tables
ALTER TABLE ai_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Chat tables
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Tenant tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
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

-- Privacy & security tables
ALTER TABLE privacy_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_policies ENABLE ROW LEVEL SECURITY;

-- Workflow tables
ALTER TABLE automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;

-- Lead & booking tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_versions ENABLE ROW LEVEL SECURITY;

-- Guardian tables
ALTER TABLE trust_ledger_roots ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_events ENABLE ROW LEVEL SECURITY;

-- Audit tables
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- CREATE FUNCTIONS
-- ===========================================

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Check user role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Check if admin function
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Handle new user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Generate referral code function
CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INT, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Set referral code trigger function
CREATE OR REPLACE FUNCTION set_referral_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    LOOP
      NEW.referral_code := generate_referral_code();
      IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = NEW.referral_code) THEN
        EXIT;
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update leaderboard function
CREATE OR REPLACE FUNCTION update_leaderboard() RETURNS TRIGGER AS $$
DECLARE
  period_start TIMESTAMPTZ;
  period_type TEXT;
BEGIN
  period_start := date_trunc('week', NOW());
  period_type := 'weekly';
  
  INSERT INTO public.leaderboard_entries (user_id, period, period_start, xp_earned)
  VALUES (NEW.user_id, period_type, period_start, COALESCE(NEW.total_xp, 0))
  ON CONFLICT (user_id, period, period_start) 
  DO UPDATE SET xp_earned = COALESCE(NEW.total_xp, 0), updated_at = NOW();
  
  period_start := date_trunc('month', NOW());
  period_type := 'monthly';
  
  INSERT INTO public.leaderboard_entries (user_id, period, period_start, xp_earned)
  VALUES (NEW.user_id, period_type, period_start, COALESCE(NEW.total_xp, 0))
  ON CONFLICT (user_id, period, period_start) 
  DO UPDATE SET xp_earned = COALESCE(NEW.total_xp, 0), updated_at = NOW();
  
  period_start := '1970-01-01'::TIMESTAMPTZ;
  period_type := 'all_time';
  
  INSERT INTO public.leaderboard_entries (user_id, period, period_start, xp_earned)
  VALUES (NEW.user_id, period_type, period_start, COALESCE(NEW.total_xp, 0))
  ON CONFLICT (user_id, period, period_start) 
  DO UPDATE SET xp_earned = COALESCE(NEW.total_xp, 0), updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Search embeddings function
CREATE OR REPLACE FUNCTION search_embeddings(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 10,
  filter_namespace TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  namespace TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE SQL
AS $$
  SELECT
    ai_embeddings.id,
    ai_embeddings.namespace,
    ai_embeddings.content,
    ai_embeddings.metadata,
    1 - (ai_embeddings.embedding <=> query_embedding) AS similarity
  FROM ai_embeddings
  WHERE
    (filter_namespace IS NULL OR ai_embeddings.namespace = filter_namespace)
    AND 1 - (ai_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY ai_embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Create tenant function
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
  
  INSERT INTO tenant_members (tenant_id, user_id, role, permissions)
  VALUES (new_tenant_id, auth.uid(), 'admin', '{"all": true}');
  
  RETURN new_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Track usage function
CREATE OR REPLACE FUNCTION track_usage(
  p_tenant_id UUID,
  p_metric_type TEXT,
  p_increment INT DEFAULT 1
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

-- Check tenant limit function
CREATE OR REPLACE FUNCTION check_tenant_limit(
  p_tenant_id UUID,
  p_metric_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INT;
  limit_value INT;
  tenant_limits JSONB;
BEGIN
  SELECT COALESCE(SUM(usage_count), 0)
  INTO current_usage
  FROM tenant_usage
  WHERE tenant_id = p_tenant_id
    AND metric_type = p_metric_type
    AND period_start = date_trunc('month', NOW());
  
  SELECT limits INTO tenant_limits
  FROM tenants
  WHERE id = p_tenant_id;
  
  limit_value := (tenant_limits->>p_metric_type)::INT;
  
  IF limit_value = -1 THEN
    RETURN TRUE;
  END IF;
  
  RETURN current_usage < limit_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tenant member functions
CREATE OR REPLACE FUNCTION add_tenant_member(
  p_tenant_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'member',
  p_permissions JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  new_member_id UUID;
BEGIN
  INSERT INTO tenant_members (tenant_id, user_id, role, permissions, invited_by)
  VALUES (p_tenant_id, p_user_id, p_role, p_permissions, auth.uid())
  RETURNING id INTO new_member_id;
  RETURN new_member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_tenant_member(
  p_tenant_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tenant_members 
    WHERE tenant_id = p_tenant_id 
    AND user_id = p_user_id 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Guardian summary function
CREATE OR REPLACE FUNCTION get_guardian_summary(p_user_id UUID, p_days INT DEFAULT 7)
RETURNS JSONB AS $$
DECLARE
  summary JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_events', COUNT(*),
    'by_risk_level', jsonb_object_agg(risk_level, count),
    'by_data_class', jsonb_object_agg(data_class, count),
    'violations_prevented', COUNT(*) FILTER (WHERE action_taken IN ('block', 'mask'))
  ) INTO summary
  FROM (
    SELECT 
      risk_level,
      data_class,
      COUNT(*) as count,
      action_taken
    FROM guardian_events
    WHERE user_id = p_user_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY risk_level, data_class, action_taken
  ) subq;
  
  RETURN COALESCE(summary, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log audit event function
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, metadata)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_metadata);
END;
$$;

-- Check rate limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_endpoint TEXT,
  p_max_requests INT,
  p_window_seconds INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_count INT;
  v_window_start TIMESTAMPTZ;
BEGIN
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - (p_window_seconds || ' seconds')::INTERVAL;
  
  SELECT request_count, window_start
  INTO v_current_count, v_window_start
  FROM public.rate_limits
  WHERE identifier = p_identifier
    AND endpoint = p_endpoint
    AND window_start > NOW() - (p_window_seconds || ' seconds')::INTERVAL
  FOR UPDATE;
  
  IF NOT FOUND THEN
    INSERT INTO public.rate_limits (identifier, endpoint, request_count, window_start)
    VALUES (p_identifier, p_endpoint, 1, NOW())
    ON CONFLICT (identifier, endpoint)
    DO UPDATE SET
      request_count = 1,
      window_start = NOW();
    RETURN TRUE;
  END IF;
  
  IF v_current_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.rate_limits
  SET request_count = request_count + 1
  WHERE identifier = p_identifier
    AND endpoint = p_endpoint;
  
  RETURN TRUE;
END;
$$;

-- ===========================================
-- CREATE TRIGGERS
-- ===========================================

-- New user trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_referral_code_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION set_referral_code();

CREATE TRIGGER update_leaderboard_trigger
  AFTER INSERT OR UPDATE OF total_xp ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_leaderboard();

CREATE TRIGGER update_guardian_preferences_updated_at
  BEFORE UPDATE ON guardian_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at
  BEFORE UPDATE ON marketplace_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_agents_updated_at
  BEFORE UPDATE ON ai_agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_templates_updated_at
  BEFORE UPDATE ON workflow_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_members_updated_at
  BEFORE UPDATE ON tenant_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================
-- CREATE RLS POLICIES
-- ===========================================

-- Profile policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- User roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- Gamification policies
DROP POLICY IF EXISTS "own_journal" ON public.journal_entries;
CREATE POLICY "own_journal" ON public.journal_entries
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_streak" ON public.streaks;
CREATE POLICY "own_streak" ON public.streaks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_badges" ON public.user_badges;
CREATE POLICY "own_badges" ON public.user_badges
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "read_posts" ON public.posts;
CREATE POLICY "read_posts" ON public.posts FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "write_own_posts" ON public.posts;
CREATE POLICY "write_own_posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "edit_own_posts" ON public.posts;
CREATE POLICY "edit_own_posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "react_own" ON public.reactions;
CREATE POLICY "react_own" ON public.reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "unreact_own" ON public.reactions;
CREATE POLICY "unreact_own" ON public.reactions
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "read_comments" ON public.comments;
CREATE POLICY "read_comments" ON public.comments FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "write_comments" ON public.comments;
CREATE POLICY "write_comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "edit_own_comments" ON public.comments;
CREATE POLICY "edit_own_comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_comments" ON public.comments;
CREATE POLICY "delete_own_comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_referrals" ON public.referrals;
CREATE POLICY "own_referrals" ON public.referrals FOR ALL USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

DROP POLICY IF EXISTS "read_challenges" ON public.challenges;
CREATE POLICY "read_challenges" ON public.challenges FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "join_challenges" ON public.challenge_participants;
CREATE POLICY "join_challenges" ON public.challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "read_leaderboards" ON public.leaderboard_entries;
CREATE POLICY "read_leaderboards" ON public.leaderboard_entries FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "own_notifications" ON public.notifications;
CREATE POLICY "own_notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own_points" ON public.user_points;
CREATE POLICY "own_points" ON public.user_points FOR ALL USING (auth.uid() = user_id);

-- Analytics policies
DROP POLICY IF EXISTS "events_owner" ON public.events;
CREATE POLICY "events_owner" ON public.events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "sessions_owner" ON public.sessions;
CREATE POLICY "sessions_owner" ON public.sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "signals_owner" ON public.signals;
CREATE POLICY "signals_owner" ON public.signals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "telemetry_owner" ON public.telemetry_events;
CREATE POLICY "telemetry_owner" ON public.telemetry_events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AI policies
DROP POLICY IF EXISTS "Allow authenticated users to read embeddings" ON ai_embeddings;
CREATE POLICY "Allow authenticated users to read embeddings" ON ai_embeddings
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow service role to manage embeddings" ON ai_embeddings;
CREATE POLICY "Allow service role to manage embeddings" ON ai_embeddings
  FOR ALL USING (auth.role() = 'service_role');

-- Chat policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.chat_conversations;
CREATE POLICY "Users can view their own conversations"
  ON public.chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.chat_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON public.chat_conversations FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.chat_messages;
CREATE POLICY "Users can view messages in their conversations"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE id = chat_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE id = chat_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages in their conversations"
  ON public.chat_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE id = chat_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages in their conversations"
  ON public.chat_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE id = chat_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

-- Tenant policies
DROP POLICY IF EXISTS "Users can view their tenant" ON tenants;
CREATE POLICY "Users can view their tenant" ON tenants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members 
      WHERE tenant_id = tenants.id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view their own tenant memberships" ON tenant_members;
CREATE POLICY "Users can view their own tenant memberships" ON tenant_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Tenant admins can view all members in their tenant" ON tenant_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members tm
      WHERE tm.tenant_id = tenant_members.tenant_id 
      AND tm.user_id = auth.uid() 
      AND tm.role = 'admin'
    )
  );

-- Privacy policies
DROP POLICY IF EXISTS "Users can view their own privacy consents" ON privacy_consents;
CREATE POLICY "Users can view their own privacy consents" ON privacy_consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own privacy consents" ON privacy_consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Audit policies
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "audit_owner" ON public.audit_log;
CREATE POLICY "audit_owner" ON public.audit_log
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Guardian policies
DROP POLICY IF EXISTS "Users can view their own trust ledger roots" ON trust_ledger_roots;
CREATE POLICY "Users can view their own trust ledger roots" ON trust_ledger_roots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trust ledger roots" ON trust_ledger_roots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own guardian preferences" ON guardian_preferences;
CREATE POLICY "Users can view their own guardian preferences" ON guardian_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own guardian preferences" ON guardian_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guardian preferences" ON guardian_preferences
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own guardian events" ON guardian_events;
CREATE POLICY "Users can view their own guardian events" ON guardian_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert guardian events" ON guardian_events
  FOR INSERT WITH CHECK (TRUE);

-- ===========================================
-- INSERT DEFAULT DATA
-- ===========================================

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
 'enterprise')
ON CONFLICT DO NOTHING;

-- Insert default security policies
INSERT INTO security_policies (name, description, policy_type, rules) VALUES
('Default Access Control', 'Default access control policy', 'access_control', '{"max_failed_attempts": 5, "lockout_duration": 900, "require_mfa": false}'),
('Data Protection Policy', 'GDPR/CCPA data protection policy', 'data_protection', '{"retention_period": 2555, "anonymization_required": true, "consent_required": true}'),
('Audit Policy', 'Comprehensive audit logging policy', 'audit', '{"log_all_changes": true, "retention_period": 2555, "include_metadata": true}'),
('Compliance Policy', 'Regulatory compliance policy', 'compliance', '{"gdpr_compliant": true, "ccpa_compliant": true, "sox_compliant": true}')
ON CONFLICT DO NOTHING;

-- ===========================================
-- COMPLETE
-- ===========================================

-- Note: Edge functions are TypeScript files in supabase/functions/
-- Deploy them separately using: supabase functions deploy <function-name>
