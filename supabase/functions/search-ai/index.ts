/**
 * AI Search Edge Function
 * Hybrid semantic + keyword search using embeddings
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  namespace?: string;
  limit?: number;
  threshold?: number;
  hybrid?: boolean;
}

interface SearchResult {
  id: string;
  namespace: string;
  content: string;
  metadata: Record<string, any>;
  similarity: number;
  rank?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Parse request body
    const { query, namespace, limit = 10, threshold = 0.5, hybrid = true }: SearchRequest = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate embedding for the query
    const embedding = await generateEmbedding(query);

    let results: SearchResult[] = [];

    if (hybrid) {
      // Perform hybrid search (semantic + keyword)
      const { data, error } = await supabaseClient.rpc('hybrid_search', {
        query_text: query,
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit,
        filter_namespace: namespace || null
      });

      if (error) throw error;
      results = data || [];
    } else {
      // Perform semantic search only
      const { data, error } = await supabaseClient.rpc('search_embeddings', {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit,
        filter_namespace: namespace || null
      });

      if (error) throw error;
      results = data || [];
    }

    // Format results
    const formattedResults = results.map(result => ({
      id: result.id,
      namespace: result.namespace,
      content: result.content,
      metadata: result.metadata,
      similarity: result.similarity,
      rank: result.rank || result.similarity
    }));

    // Log search for analytics
    await logSearch(query, namespace, results.length, hybrid);

    return new Response(
      JSON.stringify({
        query,
        namespace: namespace || 'all',
        results: formattedResults,
        total: formattedResults.length,
        hybrid,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Search error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

/**
 * Generate embedding using OpenAI API
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float'
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Log search for analytics
 */
async function logSearch(
  query: string, 
  namespace: string | undefined, 
  resultCount: number, 
  hybrid: boolean
): Promise<void> {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseClient
      .from('ai_search_logs')
      .insert([{
        query,
        namespace: namespace || 'all',
        result_count: resultCount,
        hybrid_search: hybrid,
        created_at: new Date().toISOString()
      }]);
  } catch (error) {
    console.warn('Failed to log search:', error);
    // Don't throw - logging failure shouldn't break the search
  }
}