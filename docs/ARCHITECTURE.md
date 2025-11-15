# Architecture Documentation

## Overview

AIAS Platform is a full-stack, multi-tenant SaaS platform built with modern technologies and enterprise-grade architecture patterns.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │     Expo     │  │   Web App    │      │
│  │   (Web)      │  │   (Mobile)   │  │   (PWA)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   API Routes │  │ Server Actions│  │ Edge Functions│     │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Supabase   │  │    Redis     │  │   Workers    │      │
│  │  (PostgreSQL)│  │   (Cache)    │  │  (Jobs)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Integrations                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Stripe    │  │    OpenAI     │  │   Zapier     │      │
│  │  (Payments)  │  │   (AI/ML)    │  │(Automation)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5.3+
- **UI Library:** React 18+
- **Styling:** Tailwind CSS
- **Components:** Radix UI
- **Animations:** Framer Motion
- **State Management:** React Query (TanStack Query)
- **Forms:** React Hook Form + Zod

### Backend

- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Auth:** Supabase Auth
- **API:** Next.js API Routes + Server Actions
- **Edge Functions:** Supabase Edge Functions
- **Caching:** Redis (via ioredis)
- **Job Queue:** BullMQ (if implemented)

### Infrastructure

- **Hosting:** Vercel
- **Database Hosting:** Supabase
- **CDN:** Vercel Edge Network
- **Monitoring:** OpenTelemetry
- **Error Tracking:** Custom telemetry system

## Project Structure

```
/workspace
├── app/                    # Next.js App Router pages and routes
│   ├── api/                # API route handlers
│   ├── (routes)/           # Page routes
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # Base UI components (Radix UI wrappers)
│   └── ...                 # Feature-specific components
├── lib/                    # Shared libraries and utilities
│   ├── env.ts              # Environment variable management
│   ├── supabase/           # Supabase client initialization
│   ├── monitoring/         # Telemetry and monitoring
│   └── utils/              # Utility functions
├── supabase/               # Supabase configuration
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge functions
├── scripts/                # Build and deployment scripts
│   └── guardian/           # Full-stack guardian audit scripts
├── docs/                   # Documentation
└── ops/                    # Operations and deployment configs
```

## Key Architectural Patterns

### 1. Multi-Tenancy

- **Tenant Isolation:** Row Level Security (RLS) in Supabase
- **Tenant Context:** Passed via middleware and API routes
- **Resource Management:** Per-tenant quotas and limits

### 2. API Design

- **RESTful Routes:** Next.js API routes follow REST conventions
- **Server Actions:** For form submissions and mutations
- **Edge Functions:** For high-performance, globally distributed logic

### 3. Error Handling

- **Error Taxonomy:** Structured error types (SystemError, ValidationError, etc.)
- **Error Formatting:** Consistent error responses
- **Error Tracking:** Telemetry system for error monitoring

### 4. Environment Management

- **Centralized Config:** `lib/env.ts` as single source of truth
- **Runtime Detection:** Automatic detection of Vercel/GitHub/local environments
- **Validation:** Startup validation of required environment variables

### 5. Database Schema

- **Migrations:** Version-controlled SQL migrations in `supabase/migrations`
- **Prisma Schema:** Type-safe database access via Prisma
- **RLS Policies:** Row-level security for multi-tenant isolation

## Data Flow

### Request Flow

1. **Client Request** → Next.js App Router
2. **Middleware** → Authentication, tenant context extraction
3. **API Route/Server Action** → Business logic execution
4. **Supabase Client** → Database queries with RLS
5. **Response** → Formatted JSON response

### Authentication Flow

1. **User Login** → Supabase Auth
2. **JWT Token** → Stored in HTTP-only cookie
3. **Request** → Token validated by middleware
4. **Tenant Context** → Extracted from user's organization membership
5. **RLS Policies** → Automatically filter data by tenant

## Security Architecture

### Authentication & Authorization

- **Supabase Auth:** JWT-based authentication
- **RLS Policies:** Database-level access control
- **API Route Guards:** Middleware-based route protection
- **Tenant Isolation:** Enforced at database and application layers

### Data Protection

- **Encryption:** TLS in transit, database encryption at rest
- **Secrets Management:** Environment variables (Vercel/GitHub Secrets)
- **Input Validation:** Zod schemas for all user inputs
- **SQL Injection Prevention:** Parameterized queries via Prisma

### Security Headers

- **CSP:** Content Security Policy configured in `next.config.ts`
- **HSTS:** HTTP Strict Transport Security
- **X-Frame-Options:** Prevent clickjacking
- **X-Content-Type-Options:** Prevent MIME sniffing

## Performance Optimizations

### Frontend

- **Code Splitting:** Automatic via Next.js App Router
- **Image Optimization:** Next.js Image component with Supabase CDN
- **Bundle Optimization:** Webpack configuration in `next.config.ts`
- **Caching:** Static page generation and ISR where applicable

### Backend

- **Connection Pooling:** Prisma connection pooling
- **Edge Functions:** Globally distributed logic
- **Caching:** Redis for frequently accessed data
- **Database Indexes:** Optimized queries with proper indexes

## Monitoring & Observability

### Telemetry

- **Performance Metrics:** Track API response times, database queries
- **Error Tracking:** Structured error logging
- **User Analytics:** Engagement tracking (with privacy compliance)
- **Business Metrics:** Conversion funnels, feature usage

### Health Checks

- **Health Endpoint:** `/api/healthz` for system health
- **Database Checks:** Connection and query latency
- **External Services:** Stripe, Supabase API availability

## Deployment Architecture

### Environments

- **Production:** Vercel production deployment
- **Preview:** Vercel preview deployments (per PR)
- **Development:** Local development with Supabase local instance

### CI/CD Pipeline

- **GitHub Actions:** Automated testing and deployment
- **Vercel:** Automatic deployments on push to main
- **Migrations:** Automated database migrations via Supabase CLI

## Integration Architecture

### External Services

- **Stripe:** Payment processing and subscriptions
- **OpenAI:** AI/ML features
- **Zapier:** Workflow automation
- **TikTok/Meta Ads:** Marketing analytics (if configured)

### Webhook Handlers

- **Stripe Webhooks:** Subscription events
- **Supabase Webhooks:** Database change events
- **Custom Webhooks:** For external integrations

## Scalability Considerations

### Horizontal Scaling

- **Stateless API:** All API routes are stateless
- **Edge Functions:** Automatically distributed globally
- **Database:** Supabase handles connection pooling and scaling

### Vertical Scaling

- **Vercel:** Automatic scaling based on traffic
- **Supabase:** Managed database scaling
- **Redis:** Caching layer for read-heavy workloads

## Future Architecture Considerations

### Planned Improvements

- **Microservices:** Consider splitting into services if needed
- **Event-Driven Architecture:** Event sourcing for audit trails
- **GraphQL API:** Consider GraphQL for complex queries
- **Real-time Features:** Supabase Realtime for live updates

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**Last Updated:** Generated automatically during architecture audit
**Maintained By:** Platform Team
