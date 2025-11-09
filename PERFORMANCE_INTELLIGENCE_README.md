# Performance Intelligence Layer

Autonomous performance monitoring and optimization system for the Hardonia stack. Observes, visualizes, and continuously enhances uptime, speed, and reliability across all connected services.

## 🎯 Overview

The Performance Intelligence Layer automatically:

1. **Collects metrics** from Vercel, Supabase, Expo, and GitHub Actions
2. **Stores telemetry** in a centralized Supabase `metrics_log` table
3. **Visualizes insights** through JSON dashboards at `/admin/metrics`
4. **Detects regressions** automatically (>10% performance degradation)
5. **Recommends optimizations** and applies safe, incremental improvements
6. **Alerts on issues** via GitHub issues and optional webhooks

## 📊 Components

### Database Schema

**Table: `metrics_log`**
- Stores aggregated performance metrics from all sources
- Flexible JSONB structure for different metric types
- RLS policies for secure access
- Indexed for efficient querying

**Functions:**
- `get_latest_metrics(source_filter)` - Get latest metrics by source
- `detect_regressions(source_filter, threshold)` - Compare current vs previous metrics
- `metrics_dashboard` view - Aggregated dashboard data

### API Endpoints

#### `/api/metrics` (GET)
Returns aggregated performance metrics in JSON format.

**Response:**
```json
{
  "performance": {
    "webVitals": { "LCP": 1.8, "CLS": 0.01 },
    "supabase": { "avgLatencyMs": 120 },
    "expo": { "bundleMB": 24 },
    "ci": { "avgBuildMin": 5.2 }
  },
  "status": "healthy",
  "lastUpdated": "2025-01-23T00:00:00Z",
  "trends": { ... }
}
```

**Cache:** 60 seconds (s-maxage=60)

#### `/api/telemetry` (POST)
Ingests performance beacons from client-side code.

**Payload:**
```json
{
  "url": "/page",
  "ttfb": 120,
  "lcp": 1800,
  "cls": 0.01,
  "inp": 150,
  "ts": 1234567890
}
```

**Features:**
- IP anonymization (stores only IP prefix)
- User agent truncation
- Best-effort delivery (doesn't break on failure)

### Dashboard

**Route:** `/admin/metrics`

Visual dashboard showing:
- Web Vitals (LCP, CLS, INP, TTFB, FCP)
- Supabase performance metrics
- Expo build metrics
- CI/CD performance
- 7-day trends
- Raw JSON data

Auto-refreshes every 60 seconds.

### Scripts

#### `scripts/collect-metrics.ts`
Collects metrics from all sources:
- **Vercel:** Web Vitals via Analytics API
- **Supabase:** Query performance and latency
- **Expo:** Bundle size and build duration
- **GitHub Actions:** CI timing and success rates

**Usage:**
```bash
npm run perf:collect
```

#### `scripts/generate-performance-report.ts`
Analyzes metrics and generates `PERFORMANCE_REPORT.md`:
- Regression detection
- Health scores
- Cost estimates
- Next best actions
- 7-day trends

**Usage:**
```bash
npm run perf:report
```

#### `scripts/auto-optimize.ts`
Analyzes metrics and suggests optimizations:
- Image optimization recommendations
- Database index suggestions
- Bundle size optimizations
- CI concurrency tuning

**Usage:**
```bash
npm run perf:optimize
```

#### `scripts/alert-regressions.ts`
Detects regressions and creates alerts:
- GitHub issue creation (if 3+ consecutive regressions)
- Webhook notifications (if configured)
- Regression analysis

**Usage:**
```bash
npm run perf:alert
```

### Client-Side Components

#### `components/performance-beacon.tsx`
Automatically sends Web Vitals to `/api/telemetry`:
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- INP (Interaction to Next Paint)
- TTFB (Time to First Byte)
- FCP (First Contentful Paint)

Mounted in root layout, runs on every page load.

## 🔄 Workflow

### Nightly Collection (GitHub Actions)

Runs at 2 AM UTC via `.github/workflows/telemetry.yml`:

1. **Collect Metrics** - Gathers data from all sources
2. **Generate Report** - Creates `PERFORMANCE_REPORT.md`
3. **Auto-Optimize** - Analyzes and suggests improvements
4. **Alert Regressions** - Creates GitHub issues if needed

### Manual Execution

Run all steps:
```bash
npm run perf:all
```

Or individually:
```bash
npm run perf:collect   # Collect metrics
npm run perf:report    # Generate report
npm run perf:optimize  # Analyze optimizations
npm run perf:alert     # Check for regressions
```

## 🔧 Configuration

### Environment Variables

Required:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for writes

Optional:
- `VERCEL_TOKEN` - For Vercel Analytics API
- `VERCEL_PROJECT_ID` - Vercel project ID
- `GITHUB_TOKEN` - For CI metrics and issue creation
- `GITHUB_REPOSITORY` - Repository name (default: auto-detect)
- `TELEMETRY_WEBHOOK_URL` - Slack/Discord webhook for alerts

### GitHub Secrets

Set these in your repository settings:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VERCEL_TOKEN` (optional)
- `VERCEL_PROJECT_ID` (optional)
- `GITHUB_TOKEN` (for issue creation)
- `TELEMETRY_WEBHOOK_URL` (optional)

## 📈 Metrics Collected

### Web Vitals
- **LCP** - Largest Contentful Paint (target: <2500ms)
- **CLS** - Cumulative Layout Shift (target: <0.1)
- **INP** - Interaction to Next Paint (target: <200ms)
- **TTFB** - Time to First Byte (target: <800ms)
- **FCP** - First Contentful Paint (target: <1800ms)

### Supabase
- Average query latency
- Query execution time
- Row counts
- Edge latency

### Expo
- Bundle size (MB)
- Build duration
- Build success rate

### CI/CD
- Average build time
- Success rate
- Queue length

## 🚨 Alerting

### Regression Detection

A regression is detected when:
- A metric worsens by >10% compared to previous measurement
- Three consecutive regressions occur

### Alert Actions

1. **GitHub Issue** - Created automatically with:
   - Regression details
   - Recommended actions
   - Labels: `performance`, `regression`, `automated`

2. **Webhook** - Sent to `TELEMETRY_WEBHOOK_URL` (if configured)

## 🛡️ Security & Privacy

- **IP Anonymization** - Only IP prefix stored (e.g., `192.168.x.x`)
- **User Agent Truncation** - Limited to 100 characters
- **RLS Policies** - Secure access to metrics data
- **No PII** - No personally identifiable information stored
- **Service Role** - Only used server-side, never exposed to client

## 📝 Generated Artifacts

1. **PERFORMANCE_REPORT.md** - Updated after each collection
2. **optimization-log.json** - Audit trail of optimizations
3. **GitHub Issues** - Created for regressions
4. **Dashboard** - Live at `/admin/metrics`

## 🔍 Monitoring

### Dashboard Access

Visit `/admin/metrics` to view:
- Real-time metrics
- 7-day trends
- Health status
- Raw JSON data

### API Access

```bash
curl https://your-domain.com/api/metrics
```

Returns JSON with all aggregated metrics.

## 🎓 Best Practices

1. **Review Reports** - Check `PERFORMANCE_REPORT.md` regularly
2. **Act on Recommendations** - Implement suggested optimizations
3. **Monitor Trends** - Watch for gradual degradation
4. **Set Thresholds** - Adjust regression thresholds as needed
5. **Test Changes** - Verify optimizations don't break functionality

## 🚀 Future Enhancements

- [ ] OpenTelemetry integration
- [ ] Grafana dashboard
- [ ] ML-based anomaly detection
- [ ] Predictive scaling
- [ ] EAS crash analytics integration
- [ ] Unified reliability index

## 📚 Related Documentation

- [Performance Monitoring Guide](../docs/performance-monitoring.md)
- [Supabase Migrations](../supabase/migrations/)
- [GitHub Actions Workflows](../.github/workflows/)

---

*Built with ❤️ for continuous performance improvement*
