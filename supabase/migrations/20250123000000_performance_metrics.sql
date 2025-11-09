-- Performance Intelligence Layer: metrics_log table
-- Stores aggregated performance metrics from all sources (Vercel, Supabase, Expo, CI)

create table if not exists public.metrics_log (
  id bigint generated always as identity primary key,
  ts timestamptz default now(),
  source text not null, -- 'vercel', 'supabase', 'expo', 'ci', 'telemetry'
  metric jsonb not null, -- flexible JSON structure for different metric types
  created_at timestamptz default now()
);

-- Indexes for efficient querying
create index if not exists idx_metrics_log_ts on public.metrics_log(ts desc);
create index if not exists idx_metrics_log_source on public.metrics_log(source);
create index if not exists idx_metrics_log_source_ts on public.metrics_log(source, ts desc);

-- RLS: Allow service role to insert, allow authenticated users to read aggregated data
alter table public.metrics_log enable row level security;

-- Service role can do everything (for automated collection)
create policy "metrics_service_role_all" on public.metrics_log
  for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');

-- Authenticated users can read aggregated metrics (for dashboards)
create policy "metrics_authenticated_read" on public.metrics_log
  for select
  using (auth.role() = 'authenticated');

-- Anonymous can read aggregated metrics (for public dashboards if needed)
create policy "metrics_anon_read" on public.metrics_log
  for select
  using (true);

-- Function to get latest metrics by source
create or replace function get_latest_metrics(source_filter text default null)
returns table (
  source text,
  latest_ts timestamptz,
  metric jsonb
) as $$
begin
  return query
  select 
    m.source,
    max(m.ts) as latest_ts,
    (array_agg(m.metric order by m.ts desc))[1] as metric
  from public.metrics_log m
  where (source_filter is null or m.source = source_filter)
  group by m.source
  order by m.source;
end;
$$ language plpgsql security definer;

-- Function to detect regressions (compare current vs previous)
create or replace function detect_regressions(
  source_filter text,
  threshold_percent numeric default 10.0
)
returns table (
  metric_key text,
  current_value numeric,
  previous_value numeric,
  change_percent numeric,
  is_regression boolean
) as $$
declare
  current_metric jsonb;
  previous_metric jsonb;
  key text;
  current_val numeric;
  previous_val numeric;
  change_pct numeric;
begin
  -- Get latest two metrics for the source
  select metric into current_metric
  from public.metrics_log
  where source = source_filter
  order by ts desc
  limit 1;
  
  select metric into previous_metric
  from public.metrics_log
  where source = source_filter
  order by ts desc
  offset 1
  limit 1;
  
  if current_metric is null or previous_metric is null then
    return;
  end if;
  
  -- Compare numeric values in the metrics
  for key in select jsonb_object_keys(current_metric) loop
    if jsonb_typeof(current_metric->key) = 'number' and jsonb_typeof(previous_metric->key) = 'number' then
      current_val := (current_metric->>key)::numeric;
      previous_val := (previous_metric->>key)::numeric;
      
      if previous_val > 0 then
        change_pct := ((current_val - previous_val) / previous_val * 100);
        
        -- Return if change exceeds threshold (positive = improvement, negative = regression)
        if abs(change_pct) >= threshold_percent then
          return query select 
            key::text,
            current_val,
            previous_val,
            change_pct,
            (change_pct > threshold_percent) as is_regression;
        end if;
      end if;
    end if;
  end loop;
  
  return;
end;
$$ language plpgsql security definer;

-- View for dashboard aggregation
create or replace view metrics_dashboard as
select 
  source,
  date_trunc('hour', ts) as hour,
  count(*) as count,
  avg((metric->>'value')::numeric) as avg_value,
  min((metric->>'value')::numeric) as min_value,
  max((metric->>'value')::numeric) as max_value
from public.metrics_log
where metric->>'value' is not null
group by source, date_trunc('hour', ts)
order by hour desc;

-- Grant permissions
grant select on public.metrics_log to authenticated, anon;
grant select on metrics_dashboard to authenticated, anon;
