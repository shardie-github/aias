-- AI Embeddings Table
CREATE TABLE IF NOT EXISTS ai_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  namespace TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimensions
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS ai_embeddings_embedding_idx ON ai_embeddings 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for namespace filtering
CREATE INDEX IF NOT EXISTS ai_embeddings_namespace_idx ON ai_embeddings (namespace);

-- Create index for metadata filtering
CREATE INDEX IF NOT EXISTS ai_embeddings_metadata_idx ON ai_embeddings USING GIN (metadata);

-- AI Health Metrics Table
CREATE TABLE IF NOT EXISTS ai_health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deployment_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  metrics JSONB NOT NULL,
  patterns JSONB NOT NULL,
  recommendations TEXT[] DEFAULT '{}',
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for deployment queries
CREATE INDEX IF NOT EXISTS ai_health_metrics_deployment_idx ON ai_health_metrics (deployment_id, environment);

-- Create index for timestamp queries
CREATE INDEX IF NOT EXISTS ai_health_metrics_timestamp_idx ON ai_health_metrics (timestamp DESC);

-- Create index for severity queries
CREATE INDEX IF NOT EXISTS ai_health_metrics_severity_idx ON ai_health_metrics (severity);

-- AI Insights Table
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deployment_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  insights JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for deployment queries
CREATE INDEX IF NOT EXISTS ai_insights_deployment_idx ON ai_insights (deployment_id, environment);

-- Create index for timestamp queries
CREATE INDEX IF NOT EXISTS ai_insights_timestamp_idx ON ai_insights (created_at DESC);

-- Enable Row Level Security
ALTER TABLE ai_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_embeddings
CREATE POLICY "Allow authenticated users to read embeddings" ON ai_embeddings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role to manage embeddings" ON ai_embeddings
  FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for ai_health_metrics
CREATE POLICY "Allow authenticated users to read health metrics" ON ai_health_metrics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role to manage health metrics" ON ai_health_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for ai_insights
CREATE POLICY "Allow authenticated users to read insights" ON ai_insights
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role to manage insights" ON ai_insights
  FOR ALL USING (auth.role() = 'service_role');

-- Create function for vector similarity search
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

-- Create function for hybrid search (semantic + keyword)
CREATE OR REPLACE FUNCTION hybrid_search(
  query_text TEXT,
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
  similarity FLOAT,
  rank FLOAT
)
LANGUAGE SQL
AS $$
  WITH semantic_search AS (
    SELECT
      ai_embeddings.id,
      ai_embeddings.namespace,
      ai_embeddings.content,
      ai_embeddings.metadata,
      1 - (ai_embeddings.embedding <=> query_embedding) AS similarity,
      0.7 AS weight
    FROM ai_embeddings
    WHERE
      (filter_namespace IS NULL OR ai_embeddings.namespace = filter_namespace)
      AND 1 - (ai_embeddings.embedding <=> query_embedding) > match_threshold
  ),
  keyword_search AS (
    SELECT
      ai_embeddings.id,
      ai_embeddings.namespace,
      ai_embeddings.content,
      ai_embeddings.metadata,
      ts_rank(to_tsvector('english', ai_embeddings.content), plainto_tsquery('english', query_text)) AS similarity,
      0.3 AS weight
    FROM ai_embeddings
    WHERE
      (filter_namespace IS NULL OR ai_embeddings.namespace = filter_namespace)
      AND to_tsvector('english', ai_embeddings.content) @@ plainto_tsquery('english', query_text)
  ),
  combined_search AS (
    SELECT * FROM semantic_search
    UNION ALL
    SELECT * FROM keyword_search
  )
  SELECT
    id,
    namespace,
    content,
    metadata,
    similarity,
    (similarity * weight) AS rank
  FROM combined_search
  ORDER BY rank DESC
  LIMIT match_count;
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_ai_embeddings_updated_at
  BEFORE UPDATE ON ai_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO ai_embeddings (namespace, content, metadata) VALUES
  ('docs', 'This is a sample documentation about AI automation', '{"type": "doc", "category": "ai"}'),
  ('api', 'API endpoint for user authentication and authorization', '{"type": "api", "method": "POST"}'),
  ('code', 'React component for displaying user dashboard with real-time updates', '{"type": "component", "framework": "react"}');