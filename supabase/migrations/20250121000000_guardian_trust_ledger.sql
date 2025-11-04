-- Trust Ledger Roots Table
-- Stores daily hash roots for trust ledger verification

CREATE TABLE IF NOT EXISTS trust_ledger_roots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hash_root TEXT NOT NULL,
    event_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trust_ledger_roots_user_id ON trust_ledger_roots(user_id);
CREATE INDEX IF NOT EXISTS idx_trust_ledger_roots_date ON trust_ledger_roots(date);

-- RLS Policies
ALTER TABLE trust_ledger_roots ENABLE ROW LEVEL SECURITY;

-- Users can only view their own ledger roots
CREATE POLICY "Users can view their own trust ledger roots" ON trust_ledger_roots
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own ledger roots
CREATE POLICY "Users can insert their own trust ledger roots" ON trust_ledger_roots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Guardian Preferences Table
-- Stores user's trust fabric preferences and adaptive settings

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guardian_preferences_user_id ON guardian_preferences(user_id);

-- RLS Policies
ALTER TABLE guardian_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own guardian preferences" ON guardian_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own guardian preferences" ON guardian_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guardian preferences" ON guardian_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Guardian Events Table (for aggregation and reporting)
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guardian_events_user_id ON guardian_events(user_id);
CREATE INDEX IF NOT EXISTS idx_guardian_events_created_at ON guardian_events(created_at);
CREATE INDEX IF NOT EXISTS idx_guardian_events_risk_level ON guardian_events(risk_level);
CREATE INDEX IF NOT EXISTS idx_guardian_events_scope ON guardian_events(scope);

-- RLS Policies
ALTER TABLE guardian_events ENABLE ROW LEVEL SECURITY;

-- Users can only view their own events
CREATE POLICY "Users can view their own guardian events" ON guardian_events
    FOR SELECT USING (auth.uid() = user_id);

-- System can insert events (will be handled by service role)
CREATE POLICY "System can insert guardian events" ON guardian_events
    FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE TRIGGER update_guardian_preferences_updated_at
    BEFORE UPDATE ON guardian_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get user's guardian summary
CREATE OR REPLACE FUNCTION get_guardian_summary(p_user_id UUID, p_days INTEGER DEFAULT 7)
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
