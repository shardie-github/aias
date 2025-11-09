# Admin Dashboard Protection Guide

## Overview

Admin dashboards (`/admin/*`) are protected to prevent unauthorized access to sensitive metrics and operational data.

## Protection Methods

### Vercel Deployments

**Recommended:** Use Vercel Access Controls (IP allowlist or team-based access)

1. **Enable Access Controls:**
   - Vercel Dashboard → Project → Settings → Access Controls
   - Configure IP allowlist or team members
   - Access is managed at platform level

2. **Documentation:**
   - Access control configuration is managed in Vercel Dashboard
   - No code changes required

### Non-Vercel Deployments

**Method:** Basic Authentication via `ADMIN_BASIC_AUTH` secret

1. **Set Secret:**
   ```bash
   # Format: "username:password" (base64 encoded)
   # Example: "admin:secure-password-here"
   export ADMIN_BASIC_AUTH="admin:secure-password-here"
   ```

2. **Access Dashboard:**
   - Browser will prompt for credentials
   - Enter username and password from secret
   - Access granted for session

3. **Secret Name:**
   - `ADMIN_BASIC_AUTH` (environment variable)
   - Never commit actual value to repository
   - Only reference secret name in code

## Implementation

Protection is implemented in `middleware.ts`:

```typescript
// Admin dashboard protection
if (pathname.startsWith('/admin/')) {
  const hasAdminAccess = checkAdminAccess(request);
  
  if (!hasAdminAccess) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
      },
    });
  }
}
```

## Protected Routes

- `/admin/metrics` - Performance metrics dashboard
- `/admin/reliability` - Reliability dashboard
- `/admin/compliance` - Security compliance dashboard

## Security Notes

- **Never echo secret values** - Only reference secret names
- **Rotate credentials regularly** - Update `ADMIN_BASIC_AUTH` secret periodically
- **Use HTTPS** - Basic Auth credentials are sent in headers (use HTTPS only)
- **Monitor access** - Review access logs for unauthorized attempts

## Troubleshooting

### Access Denied

1. **Check Secret Configuration:**
   - Verify `ADMIN_BASIC_AUTH` is set (name only, never value)
   - Verify format: "username:password"

2. **Check Vercel Access Controls:**
   - Verify IP allowlist includes your IP
   - Verify team member access is granted

3. **Check Middleware:**
   - Verify middleware is running (`middleware.ts`)
   - Check middleware logs for errors

### Vercel Access Controls Not Working

- Verify project is deployed on Vercel
- Check Vercel Dashboard → Settings → Access Controls
- Ensure IP allowlist or team access is configured

---

**Last Updated:** {{ date }}  
**Maintained By:** Hardonia Ops Agent
