# Architecture Documentation

## Overview

The AIAS Platform is a modern, full-stack SaaS application built with Next.js 14, Supabase, and TypeScript. It follows a multi-tenant architecture with comprehensive security, observability, and scalability features.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

### Backend
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma (for migrations)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage

### Infrastructure
- **Hosting**: Vercel
- **Database**: Supabase (PostgreSQL)
- **CDN**: Vercel Edge Network
- **Monitoring**: OpenTelemetry
- **CI/CD**: GitHub Actions

## Architecture Patterns

### Multi-Tenant Architecture

The platform supports multiple tenants with complete data isolation:

1. **Tenant Identification**:
   - Subdomain-based routing (`tenant.aias-platform.com`)
   - Header-based (`X-Tenant-ID`)
   - Query parameter (`?tenant_id=xxx`)

2. **Row-Level Security (RLS)**:
   - All tables have RLS policies
   - Policies enforce tenant isolation
   - Service role bypasses RLS for admin operations

3. **Tenant Context**:
   - Middleware extracts tenant ID
   - Context passed to all API routes
   - Database queries filtered by tenant

### API Architecture

#### Route Structure
```
app/api/
├── [endpoint]/
│   ├── route.ts          # GET, POST handlers
│   └── [id]/
│       └── route.ts       # PATCH, DELETE handlers
```

#### Request Flow
1. **Middleware**:
   - Security headers
   - Rate limiting
   - Tenant extraction
   - Authentication

2. **Route Handler**:
   - Request validation (Zod)
   - Business logic
   - Database operations
   - Response formatting

3. **Error Handling**:
   - Centralized error handling
   - Consistent error format
   - Logging and telemetry

### Database Architecture

#### Schema Design
- **Multi-tenant tables**: Include `tenant_id` column
- **User tables**: Reference `auth.users`
- **RLS policies**: Enforce tenant isolation
- **Indexes**: Optimize common queries

#### Migration Strategy
- Supabase migrations in `supabase/migrations/`
- Prisma for schema management
- Versioned migrations with timestamps
- Rollback support

### Security Architecture

#### Authentication
- Supabase Auth (JWT-based)
- Session management via cookies
- Token refresh handling

#### Authorization
- Role-based access control (RBAC)
- Tenant-based access control
- RLS policies at database level

#### Security Headers
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

#### Rate Limiting
- Per-endpoint limits
- Per-user/IP tracking
- Redis-backed (optional)

### Observability

#### Logging
- Structured logging (JSON)
- Log levels (debug, info, warn, error)
- Request tracing

#### Metrics
- OpenTelemetry integration
- Performance metrics
- Business metrics
- Custom metrics

#### Tracing
- Distributed tracing
- Request correlation IDs
- Performance profiling

### State Management

#### Server State
- React Query for server data
- Automatic caching
- Background refetching
- Optimistic updates

#### Client State
- React Context for global state
- Local state for component state
- URL state for shareable state

## Directory Structure

```
/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── [pages]/           # Page routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # UI primitives
│   └── [feature]/         # Feature components
├── lib/                   # Shared libraries
│   ├── api/               # API utilities
│   ├── auth/              # Auth utilities
│   ├── db/                # Database utilities
│   └── utils/            # General utilities
├── supabase/              # Supabase config
│   ├── migrations/        # Database migrations
│   └── functions/        # Edge functions
├── scripts/               # Utility scripts
├── tests/                 # Test files
└── docs/                  # Documentation
```

## Data Flow

### User Request Flow
1. User makes request → Browser
2. Request → Vercel Edge Network
3. Edge → Next.js Middleware
4. Middleware → Route Handler
5. Route Handler → Supabase (Database/Auth)
6. Response ← Route Handler
7. Response ← Middleware
8. Response ← Edge Network
9. Response → Browser

### Authentication Flow
1. User logs in → Supabase Auth
2. Auth returns JWT token
3. Token stored in cookie
4. Token included in requests
5. Middleware validates token
6. User context available in routes

### Multi-Tenant Flow
1. Request includes tenant ID
2. Middleware extracts tenant ID
3. Tenant ID added to request context
4. Database queries filtered by tenant
5. RLS policies enforce isolation

## Scalability

### Horizontal Scaling
- Stateless API routes
- Database connection pooling
- CDN for static assets
- Edge functions for compute

### Performance Optimization
- Next.js Image Optimization
- Code splitting
- Lazy loading
- Caching strategies
- Database indexing

### Monitoring
- Performance monitoring
- Error tracking
- Usage analytics
- Cost tracking

## Deployment

### Environments
- **Development**: Local development
- **Preview**: Vercel preview deployments
- **Staging**: Staging environment
- **Production**: Production environment

### CI/CD Pipeline
1. Code push → GitHub
2. GitHub Actions triggered
3. Run tests and linting
4. Build application
5. Deploy to Vercel
6. Run smoke tests
7. Monitor deployment

## Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **Input Validation**: Validate all inputs
3. **SQL Injection**: Use parameterized queries
4. **XSS Prevention**: Sanitize user input
5. **CSRF Protection**: Use CSRF tokens
6. **Rate Limiting**: Prevent abuse
7. **HTTPS Only**: Enforce HTTPS
8. **Security Headers**: Set appropriate headers

## Future Improvements

1. **Microservices**: Split into services
2. **Event-Driven**: Add event bus
3. **Caching Layer**: Add Redis cache
4. **Search**: Add full-text search
5. **Analytics**: Enhanced analytics
6. **AI Integration**: AI-powered features

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
