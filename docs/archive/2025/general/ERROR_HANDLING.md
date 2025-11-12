> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Error Handling Guide

## Overview

This guide explains the error handling system implemented across the codebase, including error taxonomy, retry logic, circuit breakers, and automated error detection.

## Error Taxonomy

All errors are categorized using the error classes defined in `src/lib/errors.ts`:

### Error Classes

1. **ValidationError** (400)
   - Input validation failures
   - Schema validation errors
   - Use when user input is invalid

2. **AuthenticationError** (401)
   - Invalid credentials
   - Expired tokens
   - Use when authentication fails

3. **AuthorizationError** (403)
   - Insufficient permissions
   - Resource access denied
   - Use when user lacks permission

4. **NotFoundError** (404)
   - Resource not found
   - Use when requested resource doesn't exist

5. **ConflictError** (409)
   - Duplicate resources
   - Constraint violations
   - Use when resource conflicts occur

6. **RateLimitError** (429)
   - Rate limit exceeded
   - Use when rate limits are hit

7. **SystemError** (500)
   - Database failures
   - External service failures
   - Use for system-level errors

8. **NetworkError** (503)
   - Timeouts
   - Connection failures
   - Use for network-related errors

## Usage Examples

### Basic Error Handling

```typescript
import { ValidationError, SystemError, formatError } from '@/src/lib/errors';

// Validation error
if (!email || !isValidEmail(email)) {
  const error = new ValidationError('Invalid email address');
  const formatted = formatError(error);
  return NextResponse.json(
    { error: formatted.message },
    { status: formatted.statusCode }
  );
}

// System error
try {
  await databaseOperation();
} catch (err) {
  const error = new SystemError(
    'Database operation failed',
    err instanceof Error ? err : new Error(String(err))
  );
  const formatted = formatError(error);
  return NextResponse.json(
    { error: formatted.message },
    { status: formatted.statusCode }
  );
}
```

### Retry Logic

```typescript
import { retry } from '@/lib/utils/retry';

// Retry with exponential backoff
const result = await retry(
  async () => {
    return await externalApiCall();
  },
  {
    maxAttempts: 3,
    initialDelayMs: 1000,
    onRetry: (attempt, err) => {
      console.warn(`Retry attempt ${attempt}`, { error: err.message });
    },
  }
);
```

### Circuit Breaker

```typescript
import { CircuitBreaker } from '@/lib/utils/retry';

const breaker = new CircuitBreaker(5, 60000, 30000); // threshold, timeout, reset

try {
  const result = await breaker.execute(async () => {
    return await externalServiceCall();
  });
} catch (error) {
  // Handle error or circuit breaker open state
}
```

### Error Detection

```typescript
import { recordError } from '@/lib/utils/error-detection';

try {
  await riskyOperation();
} catch (error) {
  recordError(error, { 
    endpoint: '/api/example',
    userId: user.id,
    context: 'operation_context'
  });
  throw error;
}
```

## Best Practices

1. **Always use error taxonomy** - Don't use generic Error class
2. **Include context** - Add relevant context to error records
3. **Use retry for transient failures** - Network errors, timeouts
4. **Use circuit breaker for external services** - Prevent cascading failures
5. **Record errors for monitoring** - Use `recordError()` for tracking
6. **Format errors consistently** - Use `formatError()` for API responses

## Monitoring Integration

Error detection integrates with:
- Sentry (if `SENTRY_DSN` configured)
- Datadog (if `DATADOG_API_KEY` configured)
- Custom webhook (if `ERROR_WEBHOOK_URL` configured)
- Enhanced telemetry system

## Configuration

Set environment variables for monitoring:
- `SENTRY_DSN` - Sentry integration
- `DATADOG_API_KEY` - Datadog integration
- `ERROR_WEBHOOK_URL` - Custom webhook URL

---

For more details, see `src/lib/errors.ts` and `lib/utils/error-detection.ts`.
