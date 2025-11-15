# Workflow Documentation

## Overview

This document describes development workflows, deployment processes, and operational procedures for the AIAS Platform.

## Development Workflow

### Local Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/aias-platform.git
   cd aias-platform
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Fill in values from Supabase Dashboard
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   pnpm run db:generate
   
   # Run migrations (if using local Supabase)
   pnpm run db:push
   ```

5. **Start Development Server**
   ```bash
   pnpm run dev
   ```

6. **Verify Setup**
   - Open http://localhost:3000
   - Check `/api/healthz` endpoint
   - Verify database connection

### Code Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following TypeScript/React best practices
   - Add tests for new features
   - Update documentation as needed

3. **Run Linting & Type Checking**
   ```bash
   pnpm run lint
   pnpm run typecheck
   ```

4. **Run Tests**
   ```bash
   pnpm run test
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

6. **Push & Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

## CI/CD Workflow

### GitHub Actions Pipeline

The CI/CD pipeline runs automatically on:
- **Push to main:** Full test suite + deployment
- **Pull Requests:** Test suite + linting + type checking
- **Scheduled:** Nightly ETL jobs (if configured)

### Pipeline Stages

1. **Lint & Type Check**
   - ESLint
   - TypeScript type checking
   - Prettier formatting check

2. **Tests**
   - Unit tests (Vitest)
   - Integration tests
   - E2E tests (Playwright)

3. **Build**
   - Next.js production build
   - Prisma client generation
   - Bundle analysis

4. **Deploy**
   - Vercel preview deployment (PRs)
   - Vercel production deployment (main branch)

### Manual Deployment

#### Deploy to Vercel Preview

```bash
vercel deploy --prebuilt --token $VERCEL_TOKEN
```

#### Deploy to Production

```bash
vercel deploy --prebuilt --prod --token $VERCEL_TOKEN
```

## Database Workflow

### Creating Migrations

1. **Make Schema Changes**
   - Update Prisma schema (`apps/web/prisma/schema.prisma`)
   - Or create SQL migration directly

2. **Generate Migration**
   ```bash
   # For Prisma
   pnpm run db:generate
   
   # For Supabase
   supabase migration new your_migration_name
   ```

3. **Test Migration Locally**
   ```bash
   pnpm run db:push  # Prisma
   # Or apply SQL migration manually
   ```

4. **Commit Migration**
   ```bash
   git add supabase/migrations/
   git commit -m "migration: add your migration"
   ```

### Applying Migrations

**Production:**
```bash
pnpm run db:migrate
```

**Via Supabase CLI:**
```bash
supabase db push --local false
```

## Environment Management Workflow

### Adding New Environment Variables

1. **Update `.env.example`**
   - Add variable with placeholder value
   - Add documentation comment

2. **Update `lib/env.ts`**
   - Add variable to `env` object
   - Add validation if required

3. **Update Documentation**
   - Add to `docs/ENVIRONMENT.md`
   - Document where to set (Vercel/GitHub/Supabase)

4. **Set in Environments**
   - Vercel: Dashboard → Settings → Environment Variables
   - GitHub: Repository → Settings → Secrets
   - Supabase: Dashboard → Settings → API (if applicable)

## Testing Workflow

### Unit Tests

```bash
pnpm run test
```

### Integration Tests

```bash
pnpm run test:integration
```

### E2E Tests

```bash
pnpm run test:e2e
```

### Test Coverage

```bash
pnpm run test:coverage
```

## Monitoring Workflow

### Health Checks

**Manual Check:**
```bash
curl https://your-app.vercel.app/api/healthz
```

**Automated Monitoring:**
- Vercel Analytics
- Custom telemetry endpoints
- External monitoring services (if configured)

### Logs

**Vercel Logs:**
```bash
vercel logs --follow
```

**Local Logs:**
- Check console output during development
- Check `reports/` directory for audit reports

## Release Workflow

### Pre-Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Environment variables verified
- [ ] Database migrations tested
- [ ] Performance benchmarks met
- [ ] Security audit completed

### Release Process

1. **Create Release Branch**
   ```bash
   git checkout -b release/v1.x.x
   ```

2. **Update Version**
   - Update `package.json` version
   - Update CHANGELOG.md

3. **Merge to Main**
   ```bash
   git checkout main
   git merge release/v1.x.x
   git push origin main
   ```

4. **Deploy to Production**
   - Vercel automatically deploys on push to main
   - Or manually: `vercel deploy --prod`

5. **Create Git Tag**
   ```bash
   git tag v1.x.x
   git push origin v1.x.x
   ```

## Rollback Workflow

### Database Rollback

```bash
# Revert last migration
supabase migration repair --status reverted <migration-name>
```

### Application Rollback

**Vercel:**
1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "Promote to Production"

**Git:**
```bash
git revert <commit-hash>
git push origin main
```

## Troubleshooting Workflow

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify dependencies are installed
   - Check build logs in Vercel

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check Supabase project status
   - Verify network connectivity

3. **API Errors**
   - Check `/api/healthz` endpoint
   - Review error logs
   - Verify authentication tokens

### Debugging Steps

1. **Check Health Endpoint**
   ```bash
   curl https://your-app.vercel.app/api/healthz
   ```

2. **Review Logs**
   - Vercel Dashboard → Logs
   - Local console output

3. **Run Guardian Audit**
   ```bash
   pnpm run guardian:audit
   ```

4. **Check Environment Variables**
   ```bash
   pnpm run omega:validate-env
   ```

## Operational Workflows

### Daily Operations

- Monitor health endpoints
- Review error logs
- Check deployment status
- Monitor performance metrics

### Weekly Operations

- Review audit reports
- Check for security updates
- Review performance trends
- Update documentation

### Monthly Operations

- Rotate secrets (if needed)
- Review and optimize database
- Performance analysis
- Cost review

## Emergency Procedures

### Service Outage

1. **Identify Issue**
   - Check health endpoint
   - Review error logs
   - Verify external services

2. **Mitigate**
   - Rollback if recent deployment
   - Scale resources if needed
   - Disable problematic features

3. **Communicate**
   - Update status page
   - Notify team
   - Post-mortem after resolution

### Security Incident

1. **Contain**
   - Rotate affected secrets
   - Disable compromised accounts
   - Isolate affected systems

2. **Investigate**
   - Review logs
   - Identify attack vector
   - Assess impact

3. **Remediate**
   - Fix vulnerabilities
   - Update security policies
   - Document incident

## Best Practices

### Code Quality

- Write tests for all new features
- Follow TypeScript best practices
- Use consistent error handling
- Document complex logic

### Security

- Never commit secrets
- Use environment variables
- Validate all inputs
- Follow principle of least privilege

### Performance

- Monitor performance metrics
- Optimize database queries
- Use caching where appropriate
- Profile before optimizing

### Documentation

- Keep README updated
- Document API changes
- Update architecture docs
- Maintain changelog

---

**Last Updated:** Generated automatically during workflow audit
**Maintained By:** Platform Team
