# API Documentation

## Overview

This document describes all API endpoints available in the AIAS Platform.

## Base URL

- **Production:** `https://your-app.vercel.app`
- **Preview:** `https://your-app-{branch}.vercel.app`
- **Development:** `http://localhost:3000`

## Authentication

Most API endpoints require authentication via Supabase Auth. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

For endpoints that use Supabase client-side, authentication is handled automatically via cookies.

## API Routes

### Health & Status

#### `GET /api/healthz`

Health check endpoint for monitoring and load balancers.

**Response:**
```json
{
  "ok": true,
  "timestamp": "2025-01-27T12:00:00.000Z",
  "db": {
    "ok": true,
    "latency_ms": 15
  },
  "rest": {
    "ok": true,
    "latency_ms": 20
  },
  "auth": {
    "ok": true,
    "latency_ms": 10
  },
  "rls": {
    "ok": true,
    "note": "RLS policies active"
  },
  "storage": {
    "ok": true,
    "latency_ms": 25,
    "buckets_count": 3
  },
  "total_latency_ms": 70
}
```

**Status Codes:**
- `200`: All checks passed
- `503`: One or more checks failed

---

### Stripe Integration

#### `POST /api/stripe/create-checkout`

Create a Stripe checkout session.

**Request Body:**
```json
{
  "priceId": "price_xxx",
  "userId": "user-uuid",
  "tier": "starter" | "pro" | "enterprise"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_xxx"
}
```

**Status Codes:**
- `200`: Session created successfully
- `400`: Invalid request body
- `500`: Server error

#### `PUT /api/stripe/webhook`

Stripe webhook handler for subscription events.

**Headers:**
- `stripe-signature`: Stripe webhook signature (required)

**Request Body:** Raw Stripe event payload

**Response:**
```json
{
  "received": true
}
```

**Status Codes:**
- `200`: Webhook processed successfully
- `400`: Invalid signature or payload
- `500`: Server error

**Supported Events:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

### Analytics & Telemetry

#### `POST /api/telemetry/ingest`

Ingest telemetry events from clients.

**Request Body:**
```json
{
  "events": [
    {
      "name": "page_view",
      "category": "user",
      "properties": {
        "path": "/dashboard",
        "referrer": "https://example.com"
      },
      "timestamp": 1706364000000
    }
  ]
}
```

**Response:**
```json
{
  "received": true,
  "count": 1
}
```

**Status Codes:**
- `200`: Events ingested successfully
- `400`: Invalid event format
- `500`: Server error

#### `GET /api/analytics/track`

Track analytics events (legacy endpoint).

**Query Parameters:**
- `event`: Event name
- `properties`: JSON-encoded event properties

**Response:**
```json
{
  "tracked": true
}
```

---

### Admin Endpoints

#### `GET /api/admin/compliance`

Get compliance status (admin only).

**Response:**
```json
{
  "status": "compliant",
  "checks": {
    "gdpr": true,
    "ccpa": true,
    "soc2": true
  }
}
```

#### `GET /api/admin/reliability`

Get system reliability metrics (admin only).

**Response:**
```json
{
  "uptime": 99.9,
  "error_rate": 0.01,
  "latency_p95": 150
}
```

---

### Blog & Content

#### `GET /api/blog/rss`

Get blog RSS feed.

**Response:** RSS XML feed

#### `GET /api/blog/comments`

Get blog comments.

**Query Parameters:**
- `postId`: Blog post ID (optional)
- `limit`: Number of comments (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "comments": [
    {
      "id": "comment-uuid",
      "postId": "post-uuid",
      "author": "User Name",
      "content": "Comment text",
      "createdAt": "2025-01-27T12:00:00.000Z"
    }
  ],
  "total": 100
}
```

---

### Feedback

#### `POST /api/feedback`

Submit user feedback.

**Request Body:**
```json
{
  "type": "bug" | "feature" | "general",
  "message": "Feedback text",
  "email": "user@example.com" // optional
}
```

**Response:**
```json
{
  "received": true,
  "id": "feedback-uuid"
}
```

---

### Agent & AI

#### `POST /api/agent/suggest`

Get AI agent suggestions.

**Request Body:**
```json
{
  "context": "User's current context",
  "preferences": {
    "category": "automation"
  }
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "agentId": "agent-uuid",
      "name": "Agent Name",
      "description": "Agent description",
      "relevance": 0.95
    }
  ]
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "statusCode": 400,
  "details": {
    "field": "Additional error details"
  }
}
```

### Error Status Codes

- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Missing or invalid authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error
- `503`: Service Unavailable - Service temporarily unavailable

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authenticated Users:** 1000 requests per hour
- **Anonymous Users:** 100 requests per hour
- **Webhook Endpoints:** 1000 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1706367600
```

## Webhooks

### Stripe Webhooks

Configure in Stripe Dashboard → Developers → Webhooks:

- **URL:** `https://your-app.vercel.app/api/stripe/webhook`
- **Events:** `checkout.session.completed`, `customer.subscription.*`

### Supabase Webhooks

Configure in Supabase Dashboard → Database → Webhooks:

- **Table:** Any table with webhook triggers
- **Events:** INSERT, UPDATE, DELETE
- **URL:** Your webhook handler endpoint

## Integration Examples

### JavaScript/TypeScript

```typescript
const response = await fetch('/api/stripe/create-checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    priceId: 'price_xxx',
    userId: 'user-uuid',
    tier: 'pro'
  })
});

const data = await response.json();
```

### cURL

```bash
curl -X POST https://your-app.vercel.app/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "priceId": "price_xxx",
    "userId": "user-uuid",
    "tier": "pro"
  }'
```

## API Versioning

Currently, all endpoints are unversioned. Future versions will use URL versioning:

- `/api/v1/...` (future)
- `/api/v2/...` (future)

## OpenAPI/Swagger

OpenAPI specification will be available at `/api/openapi.json` (future).

## Support

For API support:
1. Check this documentation
2. Review error messages and status codes
3. Check `/api/healthz` for system status
4. Contact platform team for assistance

---

**Last Updated:** Generated automatically during API audit
**Maintained By:** Platform Team
