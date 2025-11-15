# API Documentation

Complete API reference for the AIAS Platform.

## Base URL

- **Production**: `https://aias-platform.com/api`
- **Development**: `http://localhost:3000/api`

## Authentication

Most endpoints require authentication. Include the access token in one of the following ways:

1. **Authorization Header** (Recommended):
   ```
   Authorization: Bearer <access_token>
   ```

2. **Cookie**:
   ```
   Cookie: sb-access-token=<access_token>
   ```

## Multi-Tenant Support

For multi-tenant endpoints, include the tenant ID:

1. **Header**:
   ```
   X-Tenant-ID: <tenant_id>
   ```

2. **Query Parameter**:
   ```
   ?tenant_id=<tenant_id>
   ```

## Rate Limiting

Rate limits are applied per endpoint:

- **Auth endpoints**: 5 requests/minute
- **Stripe endpoints**: 20 requests/minute
- **Telemetry endpoints**: 100 requests/minute
- **Default**: 100 requests/minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## Endpoints

### Health Check

#### GET /api/healthz

Check system health and connectivity.

**Response:**
```json
{
  "ok": true,
  "timestamp": "2025-01-30T12:00:00Z",
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
    "latency_ms": 25
  },
  "rls": {
    "ok": true,
    "note": "RLS policies active"
  },
  "storage": {
    "ok": true,
    "latency_ms": 30,
    "buckets_count": 3
  },
  "total_latency_ms": 90
}
```

### Settings

#### GET /api/settings

Get user settings and preferences.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `X-Tenant-ID: <tenant_id>` (optional)

**Query Parameters:**
- `tenant_id` (optional): Tenant ID

**Response:**
```json
{
  "settings": {
    "id": "uuid",
    "user_id": "uuid",
    "email_notifications_enabled": true,
    "push_notifications_enabled": true,
    "sms_notifications_enabled": false,
    "notification_types": {
      "system": true,
      "security": true,
      "marketing": false,
      "product_updates": true,
      "community": true,
      "billing": true
    },
    "theme": "system",
    "language": "en",
    "timezone": "UTC",
    "date_format": "YYYY-MM-DD",
    "time_format": "24h",
    "profile_visibility": "private",
    "analytics_opt_in": true,
    "data_sharing_enabled": false,
    "beta_features_enabled": false,
    "experimental_features_enabled": false,
    "custom_settings": {},
    "created_at": "2025-01-30T12:00:00Z",
    "updated_at": "2025-01-30T12:00:00Z"
  }
}
```

#### PUT /api/settings

Update user settings.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json` (required)
- `X-Tenant-ID: <tenant_id>` (optional)

**Request Body:**
```json
{
  "email_notifications_enabled": true,
  "push_notifications_enabled": true,
  "theme": "dark",
  "language": "en",
  "timezone": "America/Toronto",
  "time_format": "24h",
  "profile_visibility": "private",
  "analytics_opt_in": true,
  "beta_features_enabled": false
}
```

**Response:**
```json
{
  "settings": {
    // Updated settings object
  }
}
```

### Notifications

#### GET /api/notifications

Get user notifications.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `X-Tenant-ID: <tenant_id>` (optional)

**Query Parameters:**
- `type` (optional): Filter by notification type (`system`, `security`, `marketing`, `product_updates`, `community`, `billing`, `achievement`, `reminder`, `alert`)
- `read` (optional): Filter by read status (`true`/`false`)
- `archived` (optional): Filter by archived status (`true`/`false`)
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `tenant_id` (optional): Tenant ID

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "tenant_id": "uuid",
      "type": "system",
      "title": "Welcome!",
      "message": "Welcome to AIAS Platform",
      "action_url": "https://example.com/action",
      "action_label": "Get Started",
      "read": false,
      "archived": false,
      "priority": "normal",
      "created_at": "2025-01-30T12:00:00Z",
      "updated_at": "2025-01-30T12:00:00Z"
    }
  ],
  "unread_count": 5,
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 1
  }
}
```

#### POST /api/notifications

Create a notification (admin/service role only).

**Headers:**
- `Authorization: Bearer <service_role_token>` (required)
- `Content-Type: application/json` (required)

**Request Body:**
```json
{
  "user_id": "uuid",
  "tenant_id": "uuid",
  "type": "system",
  "title": "Notification Title",
  "message": "Notification message",
  "action_url": "https://example.com/action",
  "action_label": "View",
  "priority": "normal",
  "expires_at": "2025-12-31T23:59:59Z",
  "metadata": {}
}
```

**Response:**
```json
{
  "notification": {
    // Created notification object
  }
}
```

#### PATCH /api/notifications/[id]

Update a notification (mark as read, archive, etc.).

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json` (required)

**Request Body:**
```json
{
  "read": true,
  "archived": false
}
```

**Response:**
```json
{
  "notification": {
    // Updated notification object
  }
}
```

#### DELETE /api/notifications/[id]

Delete a notification.

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**
```json
{
  "success": true
}
```

#### POST /api/notifications/mark-read

Mark notifications as read.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json` (required)

**Request Body:**
```json
{
  "notification_ids": ["uuid1", "uuid2"],
  "all": false
}
```

**Response:**
```json
{
  "success": true,
  "count": 2
}
```

### Stripe

#### POST /api/stripe/create-checkout

Create a Stripe checkout session.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json` (required)

**Request Body:**
```json
{
  "price_id": "price_xxx",
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel"
}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/..."
}
```

#### POST /api/stripe/webhook

Stripe webhook endpoint (no authentication required, uses Stripe signature verification).

### Telemetry

#### POST /api/telemetry/ingest

Ingest telemetry data.

**Headers:**
- `Authorization: Bearer <token>` (optional)
- `Content-Type: application/json` (required)

**Request Body:**
```json
{
  "events": [
    {
      "name": "page_view",
      "properties": {},
      "timestamp": "2025-01-30T12:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "ingested": 1
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {}
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable

## Examples

### cURL

```bash
# Get settings
curl -X GET https://aias-platform.com/api/settings \
  -H "Authorization: Bearer <token>"

# Update settings
curl -X PUT https://aias-platform.com/api/settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark"}'

# Get notifications
curl -X GET "https://aias-platform.com/api/notifications?limit=10&read=false" \
  -H "Authorization: Bearer <token>"
```

### JavaScript/TypeScript

```typescript
// Get settings
const response = await fetch('/api/settings', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();

// Update settings
const response = await fetch('/api/settings', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    theme: 'dark',
    language: 'en'
  })
});
const data = await response.json();
```

## Changelog

### 2025-01-30
- Added `/api/settings` endpoints
- Added `/api/notifications` endpoints
- Enhanced error handling
- Added rate limiting headers
