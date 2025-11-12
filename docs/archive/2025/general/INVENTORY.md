> Archived on 2025-11-12. Superseded by: (see docs/final index)

# AIAS Platform - Technical Inventory

## Project Overview
**Project Name**: AIAS - AI Agent & Automation Consultancy Platform  
**Primary Stack**: React + Vite + TypeScript + Supabase + PostgreSQL  
**Architecture**: Multi-tenant SaaS with marketplace and AI agent ecosystem  
**Deployment**: Docker + Docker Compose (Production-ready)  

## Tech Surface

### Frontend Framework & Build
- **Framework**: React 18.2.0 with Vite 5.x
- **Language**: TypeScript 5.3.0 (non-strict mode - needs hardening)
- **Styling**: Tailwind CSS 3.3.6 + PostCSS + Autoprefixer
- **UI Components**: Radix UI primitives + custom components (53 UI components)
- **State Management**: React hooks + local state
- **Routing**: React Router (implied from page structure)
- **PWA**: Vite PWA plugin with service worker, manifest, offline caching
- **Build Target**: ESNext with Terser minification
- **Bundle Analysis**: Rollup visualizer plugin configured

### Backend & Database
- **Database**: PostgreSQL 15.1 (primary) + Prisma ORM 5.7.1
- **Auth**: Supabase Auth with JWT tokens
- **API**: Supabase Edge Functions (12 functions) + PostgREST
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage with image proxy
- **Caching**: Redis 7-alpine
- **Queue System**: BullMQ with Redis backend

### Infrastructure & Deployment
- **Containerization**: Docker + Docker Compose (dev + prod configs)
- **API Gateway**: Kong 2.8.1 with declarative config
- **Reverse Proxy**: Nginx (configured)
- **Monitoring**: Prometheus + Grafana + Elasticsearch + Kibana
- **Backup**: Automated PostgreSQL backups
- **Security Scanning**: Trivy container scanner

### AI & Integrations
- **AI Providers**: OpenAI, Anthropic, Google Generative AI
- **AI SDK**: Vercel AI SDK 2.2.29
- **Payments**: Stripe 14.9.0 + PayPal integration
- **Email**: Resend + Postmark
- **Analytics**: Custom analytics + metrics collection
- **Webhooks**: Custom webhook manager with signature verification

## Build Graph & Entry Points

### Main Application
- **Entry Point**: `src/main.tsx`
- **Build Output**: `dist/` directory
- **Dev Server**: Port 8080 (Vite), Port 3000 (Docker)
- **Production**: Port 3000 (Docker)

### Package Structure
```
/workspace/
├── apps/web/                 # Next.js app (unused in current build)
├── packages/
│   ├── config/              # Environment configuration
│   └── lib/                 # Shared libraries (AI, auth, payments, etc.)
├── src/                     # Main React application
│   ├── components/          # 67+ React components
│   ├── pages/              # 8 main pages
│   ├── lib/                # Client-side utilities
│   └── hooks/              # Custom React hooks
├── supabase/               # Database migrations + Edge Functions
└── monitoring/             # Observability configuration
```

### API Routes & Endpoints
- **Supabase Functions**: 12 Edge Functions
  - `chat-api` (JWT verified)
  - `booking-api` (public)
  - `lead-gen-api` (public)
  - `marketplace-api`
  - `billing-api`
- **Kong Gateway**: Routes traffic to services
- **PostgREST**: Auto-generated REST API from schema

## Data Surface

### Database Schema (Prisma)
- **Users**: 34 tables with comprehensive relationships
- **Core Entities**: User, Organization, Project, Subscription
- **AI Tracking**: AiRun with token usage and cost tracking
- **Multi-tenancy**: Tenant management with usage limits
- **Marketplace**: Items, commissions, reviews
- **Analytics**: Metrics, trends, reports
- **Security**: API keys, webhook events, audit logs

### Data Sources & Integrations
- **Shopify**: JSON data feeds
- **Google Trends**: CSV imports
- **TikTok Business**: JSON data
- **AliExpress**: CSV data
- **Generic**: CSV/JSON support

### Caching Strategy
- **Redis**: Session storage, queue management
- **Browser**: Service worker caching (network-first for HTML, stale-while-revalidate for assets)
- **CDN**: Image proxy with WebP detection

## Observability Surface

### Logging
- **Structured Logging**: Pino logger configured
- **Log Aggregation**: Logflare + Elasticsearch + Kibana
- **Request Tracking**: Request IDs for tracing

### Metrics
- **Prometheus**: Custom metrics for AI usage, performance
- **Grafana**: Dashboards for system monitoring
- **Application Metrics**: Token usage, response times, error rates

### Monitoring
- **Health Checks**: All services have health endpoints
- **Alerting**: Prometheus alert rules configured
- **Security**: Real-time threat detection system

## Security Surface

### Authentication & Authorization
- **Auth Provider**: Supabase Auth with JWT
- **Password Security**: bcrypt with salt, strength validation
- **API Keys**: Secure key management with expiration
- **RBAC**: Role-based access (ADMIN, EDITOR, VIEWER)

### Security Headers & Policies
- **CSP**: Content Security Policy (needs implementation)
- **HSTS**: HTTP Strict Transport Security (needs implementation)
- **CORS**: Kong gateway CORS configuration
- **Input Validation**: Zod schemas for API validation

### Secrets Management
- **Environment Variables**: 20+ secrets in .env files
- **JWT Secrets**: Configurable with fallback (security risk)
- **API Keys**: Multiple provider keys (OpenAI, Stripe, etc.)
- **Database**: PostgreSQL with password authentication

### Security Monitoring
- **Threat Detection**: Real-time security dashboard
- **Audit Logging**: Comprehensive audit trail
- **Vulnerability Scanning**: Trivy container scanning

## Growth & Monetization Surface

### Pricing & Billing
- **Payment Providers**: Stripe + PayPal integration
- **Subscription Plans**: FREE, BASIC, PRO, ENTERPRISE
- **Usage Tracking**: Token-based billing, usage limits
- **Webhooks**: Stripe webhook handling

### Lead Generation
- **Forms**: Lead generation forms with validation
- **Email Capture**: Newsletter signup with double opt-in
- **CRM Integration**: HubSpot/ConvertKit webhook support
- **Analytics**: UTM tracking, conversion tracking

### Marketing & Growth
- **SEO**: Sitemap, robots.txt, meta tags
- **Social**: Open Graph, Twitter cards
- **PWA**: App-like experience with offline support
- **White Label**: Multi-tenant white-label support

## Performance Surface

### Bundle Optimization
- **Code Splitting**: Manual chunks for vendor, UI, charts, AI, payments
- **Tree Shaking**: ESNext target with dead code elimination
- **Compression**: Terser minification with console removal in production
- **Asset Optimization**: Image proxy with WebP support

### Performance Budgets
- **Bundle Size**: 1000KB warning limit
- **Lighthouse**: CI integration configured
- **Core Web Vitals**: Not explicitly configured (needs implementation)

### Caching Strategy
- **Static Assets**: 1-year cache for fonts, immutable assets
- **API Responses**: No explicit caching strategy (needs implementation)
- **Database**: Connection pooling via Supabase

## Accessibility & Internationalization

### Accessibility
- **Testing**: Playwright with axe-core integration
- **Standards**: WCAG compliance not explicitly verified
- **Components**: Radix UI primitives (accessibility built-in)

### Internationalization
- **Framework**: Not implemented (needs i18n setup)
- **Content**: English-only currently
- **Localization**: No RTL or multi-language support

## Development Experience

### Code Quality
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with Tailwind plugin
- **Type Checking**: TypeScript (non-strict mode)
- **Testing**: Vitest + Playwright + Testing Library

### Development Tools
- **Hot Reload**: Vite HMR
- **Database**: Prisma Studio
- **Monitoring**: Grafana dashboards
- **Debugging**: Source maps in development

## Deployment & Operations

### Environments
- **Local**: Docker Compose with full stack
- **Production**: Docker Compose with production config
- **CI/CD**: GitHub Actions workflows (configured but not verified)

### Infrastructure
- **Container Registry**: Not specified (needs configuration)
- **Load Balancing**: Kong API gateway
- **SSL/TLS**: Not explicitly configured (needs implementation)
- **Backup Strategy**: Automated PostgreSQL backups

### Monitoring & Alerting
- **Uptime**: Health check endpoints
- **Performance**: Prometheus metrics
- **Logs**: Centralized logging with Elasticsearch
- **Alerts**: Prometheus alert rules configured

## Risk Assessment Summary

### High Priority Issues
1. **TypeScript Non-Strict**: Missing strict mode configuration
2. **Security Headers**: CSP, HSTS not implemented
3. **Secrets Management**: Fallback secrets in production
4. **Performance Budgets**: Not explicitly defined
5. **SSL/TLS**: Not configured for production

### Medium Priority Issues
1. **Internationalization**: Not implemented
2. **API Caching**: No caching strategy
3. **Error Boundaries**: Not explicitly implemented
4. **Rate Limiting**: Not configured
5. **Input Sanitization**: Needs comprehensive review

### Low Priority Issues
1. **Bundle Analysis**: Needs regular monitoring
2. **Accessibility**: Needs comprehensive audit
3. **Documentation**: API documentation missing
4. **Testing Coverage**: Needs measurement and improvement