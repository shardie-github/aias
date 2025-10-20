# AIAS Platform - Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the AIAS platform across different environments and infrastructure options.

## Prerequisites

### System Requirements
- **Node.js**: 18.17.0 or higher
- **pnpm**: 8.15.0 or higher
- **Docker**: 20.10.0 or higher
- **Docker Compose**: 2.0.0 or higher
- **PostgreSQL**: 15.1 or higher
- **Redis**: 7.0 or higher

### Required Secrets
- Database credentials
- API keys (Stripe, OpenAI, etc.)
- JWT secrets
- Encryption keys
- SSL certificates

## Environment Setup

### 1. Local Development
```bash
# Clone repository
git clone https://github.com/your-org/aias-platform.git
cd aias-platform

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Update environment variables
# Edit .env.local with your local configuration

# Start development server
pnpm run dev
```

### 2. Staging Environment
```bash
# Set environment
export NODE_ENV=staging

# Copy staging environment file
cp .env.example .env.staging

# Update staging-specific variables
# Edit .env.staging with staging configuration

# Build and deploy
pnpm run build
pnpm run deploy:staging
```

### 3. Production Environment
```bash
# Set environment
export NODE_ENV=production

# Copy production environment file
cp .env.example .env.production

# Update production-specific variables
# Edit .env.production with production configuration

# Build and deploy
pnpm run build
pnpm run deploy:production
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

#### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Production
```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale web=3

# Update services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Kubernetes

#### Create Namespace
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: aias-platform
```

#### Deploy Application
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aias-platform
  namespace: aias-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aias-platform
  template:
    metadata:
      labels:
        app: aias-platform
    spec:
      containers:
      - name: aias-platform
        image: aias-platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: aias-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Create Service
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: aias-platform-service
  namespace: aias-platform
spec:
  selector:
    app: aias-platform
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Option 3: Cloud Platforms

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add STRIPE_SECRET_KEY
# ... other variables
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Set environment variables
netlify env:set DATABASE_URL "your-database-url"
netlify env:set STRIPE_SECRET_KEY "your-stripe-key"
# ... other variables
```

#### AWS ECS
```bash
# Build and push Docker image
docker build -t aias-platform .
docker tag aias-platform:latest your-account.dkr.ecr.region.amazonaws.com/aias-platform:latest
docker push your-account.dkr.ecr.region.amazonaws.com/aias-platform:latest

# Deploy to ECS
aws ecs update-service --cluster aias-cluster --service aias-service --force-new-deployment
```

## Database Setup

### PostgreSQL
```bash
# Create database
createdb aias_platform

# Run migrations
pnpm run db:migrate

# Seed database
pnpm run db:seed
```

### Redis
```bash
# Start Redis
redis-server

# Test connection
redis-cli ping
```

## Environment Variables

### Required Variables
```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DIRECT_URL=postgresql://user:password@host:5432/database

# Redis
REDIS_URL=redis://host:6379

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-32-char-encryption-key

# Email
RESEND_API_KEY=re_...
POSTMARK_API_TOKEN=...
```

### Optional Variables
```bash
# Monitoring
SENTRY_DSN=https://...@sentry.io/...
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318

# Feature Flags
ENABLE_SENTRY=true
ENABLE_OTEL=true
ENABLE_LEMON_SQUEEZY=false
```

## SSL/TLS Configuration

### Let's Encrypt with Certbot
```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/aias-platform
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring Setup

### Health Checks
```bash
# Application health
curl http://localhost:3000/health

# Database health
curl http://localhost:3000/health/db

# Redis health
curl http://localhost:3000/health/redis
```

### Logging
```bash
# View application logs
docker-compose logs -f web

# View database logs
docker-compose logs -f postgres

# View Redis logs
docker-compose logs -f redis
```

### Metrics
```bash
# Prometheus metrics
curl http://localhost:9090/metrics

# Grafana dashboard
open http://localhost:3001
```

## Backup and Recovery

### Database Backup
```bash
# Create backup
pg_dump -h localhost -U postgres -d aias_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -h localhost -U postgres -d aias_platform < backup_20240101_120000.sql
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

## Rollback Procedures

### Docker Compose Rollback
```bash
# Stop current services
docker-compose down

# Pull previous image
docker pull aias-platform:previous-tag

# Start with previous image
docker-compose up -d
```

### Kubernetes Rollback
```bash
# Rollback deployment
kubectl rollout undo deployment/aias-platform -n aias-platform

# Check rollback status
kubectl rollout status deployment/aias-platform -n aias-platform
```

## Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
docker-compose logs web

# Check environment variables
docker-compose exec web env

# Check database connection
docker-compose exec web pnpm run db:push
```

#### Database Connection Issues
```bash
# Check database status
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec web pnpm run db:studio
```

#### Performance Issues
```bash
# Check resource usage
docker stats

# Check application metrics
curl http://localhost:3000/metrics

# Check database performance
docker-compose exec postgres psql -c "SELECT * FROM pg_stat_activity;"
```

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=debug
docker-compose up -d

# View debug logs
docker-compose logs -f web
```

## Security Checklist

### Pre-deployment
- [ ] All secrets are properly configured
- [ ] SSL/TLS certificates are valid
- [ ] Security headers are configured
- [ ] Database is secured
- [ ] Firewall rules are configured
- [ ] Monitoring is enabled

### Post-deployment
- [ ] Health checks are passing
- [ ] Security scan is clean
- [ ] Performance metrics are within limits
- [ ] Backup is working
- [ ] Monitoring is active
- [ ] Logs are being collected

## Maintenance

### Regular Tasks
- **Daily**: Check health status and logs
- **Weekly**: Review performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and update infrastructure

### Updates
```bash
# Update application
git pull origin main
pnpm install
pnpm run build
docker-compose up -d

# Update dependencies
pnpm update
pnpm audit fix

# Update Docker images
docker-compose pull
docker-compose up -d
```

## Support

### Documentation
- [API Documentation](https://docs.aias-platform.com/api)
- [User Guide](https://docs.aias-platform.com/user)
- [Admin Guide](https://docs.aias-platform.com/admin)

### Contact
- **Email**: support@aias-platform.com
- **Slack**: #aias-support
- **GitHub**: [Issues](https://github.com/your-org/aias-platform/issues)

### Emergency
- **On-call**: +1-555-EMERGENCY
- **Escalation**: CTO escalation process
- **Status Page**: https://status.aias-platform.com