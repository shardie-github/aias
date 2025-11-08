# Health Check Endpoints

The AIAS Platform provides health check endpoints to monitor backend status.

## API Health Endpoint

### `/api/healthz`

**Method**: `GET`

**Description**: Comprehensive health check for database, auth, storage, and RLS.

**Response** (200 OK):

```json
{
  "ok": true,
  "timestamp": "2025-01-22T12:00:00.000Z",
  "db": {
    "ok": true,
    "latency_ms": 45
  },
  "rest": {
    "ok": true,
    "latency_ms": 120
  },
  "auth": {
    "ok": true,
    "latency_ms": 80
  },
  "rls": {
    "ok": true,
    "note": "RLS policies active (anon access may be restricted)"
  },
  "storage": {
    "ok": true,
    "latency_ms": 60,
    "buckets_count": 2
  },
  "total_latency_ms": 305
}
```

**Response** (503 Service Unavailable):

```json
{
  "ok": false,
  "timestamp": "2025-01-22T12:00:00.000Z",
  "db": {
    "ok": false,
    "latency_ms": null,
    "error": "Connection timeout"
  },
  ...
}
```

### Usage

**Local Development**:

```bash
curl http://localhost:3000/api/healthz
```

**Production**:

```bash
curl https://your-app.vercel.app/api/healthz
```

## Edge Function Health Endpoint

### `app-health` Edge Function

**URL**: `https://{project-ref}.supabase.co/functions/v1/app-health`

Replace `{project-ref}` with your actual Supabase project reference.

**Method**: `GET`

**Description**: Lightweight health check from Supabase Edge Functions.

**Headers**:

```bash
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

**Response** (200 OK):

```json
{
  "ok": true,
  "timestamp": "2025-01-22T12:00:00.000Z",
  "db": {
    "ok": true,
    "latency_ms": 50
  },
  "auth": {
    "ok": true
  },
  "realtime": {
    "ok": true,
    "note": "Realtime publication verified via schema"
  },
  "total_latency_ms": 100
}
```

### Usage

```bash
curl https://{project-ref}.supabase.co/functions/v1/app-health \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
```

Replace `{project-ref}` with your actual Supabase project reference.

## Monitoring Integration

### Vercel

Vercel automatically monitors `/api/healthz` for deployments. Ensure the endpoint returns 200 OK for successful deployments.

### GitHub Actions

The CI workflow runs smoke tests that include health checks. See `.github/workflows/ci.yml`.

### Custom Monitoring

You can set up external monitoring services (UptimeRobot, Pingdom, etc.) to ping `/api/healthz`:

```bash
# Check every 5 minutes
*/5 * * * * curl -f https://your-app.vercel.app/api/healthz || echo "Health check failed"
```

## Health Check Components

### Database Check

- Connects to Supabase via REST API
- Verifies `app_events` table is accessible
- Measures query latency

### Auth Check

- Tests service role access to Supabase Auth
- Verifies admin API is functional
- Measures auth API latency

### RLS Check

- Verifies Row Level Security policies are active
- Tests anon access restrictions
- Confirms service role bypass works

### Storage Check

- Lists available storage buckets
- Verifies `public` and `private` buckets exist
- Measures storage API latency

### Realtime Check

- Verifies Realtime publication exists
- Confirms tables are added to publication
- Checks subscription capability

## Troubleshooting

### Health check fails

1. Check environment variables are set:
   ```bash
   pnpm run doctor
   ```

2. Verify Supabase project is active:
   - Go to Supabase Dashboard
   - Check project status

3. Review error messages in health check response:
   ```bash
   curl https://your-app.vercel.app/api/healthz | jq
   ```

### Database check fails

- Verify `DATABASE_URL` is correct
- Check Supabase database is accessible
- Review connection pooling settings

### Auth check fails

- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check service role key hasn't expired
- Review Supabase Auth logs

### Storage check fails

- Verify storage buckets exist (run migrations)
- Check storage policies are configured
- Review Supabase Storage settings

## Expected Response Times

- **Database**: < 100ms
- **Auth**: < 150ms
- **Storage**: < 200ms
- **Total**: < 500ms

If response times exceed these thresholds, investigate:
- Database connection pooling
- Network latency
- Supabase region selection
