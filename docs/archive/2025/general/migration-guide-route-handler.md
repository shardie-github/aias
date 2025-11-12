> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Migration Guide: Using Route Handler Utility

**Purpose:** Migrate API routes to use the centralized `createRouteHandler` utility for consistent error handling, security, caching, and validation.

---

## Benefits

- ✅ Consistent error handling
- ✅ Automatic input validation
- ✅ Built-in caching
- ✅ Security headers
- ✅ Rate limiting support
- ✅ Tenant isolation
- ✅ Performance tracking

---

## Before: Manual Route Handler

```typescript
// app/api/example/route.ts (OLD)
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    // Business logic
    const data = await fetchData(id);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## After: Using Route Handler Utility

```typescript
// app/api/example/route.ts (NEW)
import { NextRequest, NextResponse } from "next/server";
import { createGETHandler } from "@/lib/api/route-handler";
import { z } from "zod";

const querySchema = z.object({
  id: z.string().uuid(),
});

export const GET = createGETHandler(
  async (context) => {
    const { request } = context;
    const { searchParams } = new URL(request.url);
    
    // Validation is automatic via validateBody/query params
    const id = searchParams.get("id")!; // Safe after validation
    
    // Business logic
    const data = await fetchData(id);
    
    return NextResponse.json(data);
  },
  {
    // Options
    requireAuth: false, // Set to true if auth required
    validateBody: querySchema, // For POST/PUT requests
    cache: {
      enabled: true,
      ttl: 300, // 5 minutes
      tags: ["example"],
    },
  }
);
```

---

## Migration Steps

### Step 1: Import Route Handler

```typescript
import { createGETHandler, createPOSTHandler } from "@/lib/api/route-handler";
```

### Step 2: Wrap Handler Function

```typescript
// OLD
export async function GET(req: NextRequest) {
  // handler code
}

// NEW
export const GET = createGETHandler(
  async (context) => {
    // handler code - use context.request instead of req
  },
  { /* options */ }
);
```

### Step 3: Update Request Access

```typescript
// OLD
const body = await req.json();
const { searchParams } = new URL(req.url);

// NEW
const { request } = context;
const body = await request.json(); // Or use validateBody option
const { searchParams } = new URL(request.url);
```

### Step 4: Add Validation Schema

```typescript
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const POST = createPOSTHandler(
  async (context) => {
    // Body is already validated
    const body = await context.request.json();
    // Use body safely
  },
  {
    validateBody: bodySchema,
  }
);
```

### Step 5: Remove Manual Error Handling

```typescript
// OLD
try {
  // code
} catch (error) {
  return NextResponse.json({ error: "..." }, { status: 500 });
}

// NEW
// Error handling is automatic - just throw or return errors
// Route handler will catch and format appropriately
```

---

## Options Reference

### `requireAuth: boolean`
Requires authentication. User ID extracted from JWT token.

```typescript
{
  requireAuth: true,
}
```

### `requireTenant: boolean`
Requires tenant ID and validates tenant access.

```typescript
{
  requireTenant: true,
  requiredPermission: "read", // Optional permission check
}
```

### `validateBody: ZodSchema`
Validates request body with Zod schema.

```typescript
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
});

{
  validateBody: schema,
}
```

### `cache: CacheOptions`
Enables response caching.

```typescript
{
  cache: {
    enabled: true,
    ttl: 300, // seconds
    tags: ["users", "public"], // For cache invalidation
  },
}
```

### `rateLimit: RateLimitOptions`
Configures rate limiting.

```typescript
{
  rateLimit: {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
  },
}
```

### `maxBodySize: number`
Maximum request body size in bytes.

```typescript
{
  maxBodySize: 1024 * 1024, // 1MB
}
```

---

## Examples

### Example 1: Public GET Endpoint with Caching

```typescript
import { createGETHandler } from "@/lib/api/route-handler";

export const GET = createGETHandler(
  async (context) => {
    const data = await fetchPublicData();
    return NextResponse.json(data);
  },
  {
    cache: {
      enabled: true,
      ttl: 3600, // 1 hour
    },
  }
);
```

### Example 2: Authenticated POST with Validation

```typescript
import { createPOSTHandler } from "@/lib/api/route-handler";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const POST = createPOSTHandler(
  async (context) => {
    const body = await context.request.json();
    const userId = context.userId!; // Available when requireAuth: true
    
    const user = await createUser({
      ...body,
      createdBy: userId,
    });
    
    return NextResponse.json(user, { status: 201 });
  },
  {
    requireAuth: true,
    validateBody: createUserSchema,
  }
);
```

### Example 3: Tenant-Scoped Endpoint

```typescript
import { createGETHandler } from "@/lib/api/route-handler";

export const GET = createGETHandler(
  async (context) => {
    const tenantId = context.tenantId!;
    const data = await fetchTenantData(tenantId);
    return NextResponse.json(data);
  },
  {
    requireTenant: true,
    requiredPermission: "read",
    cache: {
      enabled: true,
      ttl: 300,
      tags: ["tenant-data"],
    },
  }
);
```

---

## Migration Checklist

- [ ] Import route handler utility
- [ ] Wrap handler with `createGETHandler` or `createPOSTHandler`
- [ ] Update request access (`context.request` instead of `req`)
- [ ] Add validation schema (if needed)
- [ ] Remove manual error handling
- [ ] Add caching (if applicable)
- [ ] Test endpoint
- [ ] Update tests
- [ ] Deploy and monitor

---

## Common Issues

### Issue: Request Body Already Consumed

**Problem:** Route handler caches request body, but you're trying to read it again.

**Solution:** Use the cached body from context or access it once.

```typescript
// ❌ Wrong
const body1 = await request.json();
const body2 = await request.json(); // Error!

// ✅ Correct
const body = await request.json();
// Use body
```

### Issue: Validation Errors Not Formatted

**Problem:** Validation errors don't match expected format.

**Solution:** Route handler automatically formats validation errors. Check `details` field in error response.

```typescript
// Error response format:
{
  error: "Invalid request body",
  details: [
    { path: ["email"], message: "Invalid email" }
  ]
}
```

### Issue: Cache Not Working

**Problem:** Responses not being cached.

**Solution:** Check cache configuration and ensure Redis/memory cache is available.

```typescript
// Check cache stats
import { cacheService } from "@/lib/performance/cache";
const stats = await cacheService.getStats();
console.log(stats);
```

---

## Testing Migrated Routes

```typescript
// tests/api/example.test.ts
import { GET } from "@/app/api/example/route";
import { NextRequest } from "next/server";

describe("GET /api/example", () => {
  it("should return data", async () => {
    const req = new NextRequest("http://localhost/api/example?id=123");
    const res = await GET(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data).toBeDefined();
  });
  
  it("should validate input", async () => {
    const req = new NextRequest("http://localhost/api/example");
    const res = await GET(req);
    
    expect(res.status).toBe(400);
  });
});
```

---

## Rollback

If migration causes issues, rollback is simple:

```bash
# Revert to previous version
git checkout HEAD~1 -- app/api/example/route.ts
git commit -m "rollback: revert route handler migration"
git push origin main
```

---

## Related Documentation

- [Route Handler Source](../../lib/api/route-handler.ts)
- [Error Handling](../../src/lib/errors.ts)
- [Caching](../../lib/performance/cache.ts)

---

**Last Updated:** 2025-01-27
