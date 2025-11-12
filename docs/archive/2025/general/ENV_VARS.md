> Archived on 2025-11-12. Superseded by: (see docs/final index)

# AIAS Platform - Environment Variables

## Overview
This document provides a comprehensive guide to all environment variables used in the AIAS platform, including their purpose, required status, default values, and security considerations.

## Environment Files
- **Development**: `.env.local` (gitignored)
- **Staging**: `.env.staging`
- **Production**: `.env.production`
- **Example**: `.env.example` (template)

## Core Configuration

### Application Settings
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `NODE_ENV` | Yes | `development` | Application environment | Public |
| `NEXT_PUBLIC_APP_URL` | Yes | `http://localhost:3000` | Public application URL | Public |
| `LOG_LEVEL` | No | `info` | Logging level (error, warn, info, debug) | Internal |
| `PORT` | No | `3000` | Application port | Internal |

## Database Configuration

### PostgreSQL
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `DATABASE_URL` | Yes | - | Primary database connection string | Secret |
| `DIRECT_URL` | Yes | - | Direct database connection (bypasses connection pooling) | Secret |
| `POSTGRES_DB` | No | `postgres` | Database name | Internal |
| `POSTGRES_USER` | No | `postgres` | Database username | Secret |
| `POSTGRES_PASSWORD` | Yes | - | Database password | Secret |
| `POSTGRES_HOST` | No | `localhost` | Database host | Internal |
| `POSTGRES_PORT` | No | `5432` | Database port | Internal |

### Redis
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `REDIS_URL` | Yes | - | Redis connection string | Secret |
| `REDIS_PASSWORD` | No | - | Redis password | Secret |
| `REDIS_HOST` | No | `localhost` | Redis host | Internal |
| `REDIS_PORT` | No | `6379` | Redis port | Internal |

## Supabase Configuration

### Authentication & Storage
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `SUPABASE_URL` | Yes | - | Supabase project URL | Public |
| `SUPABASE_ANON_KEY` | Yes | - | Supabase anonymous key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | - | Supabase service role key | Secret |
| `SUPABASE_SERVICE_KEY` | Yes | - | Supabase service key (alias) | Secret |

### JWT Configuration
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `PGRST_JWT_SECRET` | Yes | - | PostgREST JWT secret | Secret |
| `PGRST_JWT_EXP` | No | `3600` | JWT expiration time (seconds) | Internal |
| `JWT_SECRET` | Yes | - | Application JWT secret | Secret |
| `SECRET_KEY_BASE` | Yes | - | Secret key base for encryption | Secret |

## Payment Processing

### Stripe
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `STRIPE_SECRET_KEY` | Yes | - | Stripe secret key | Secret |
| `STRIPE_WEBHOOK_SECRET` | Yes | - | Stripe webhook secret | Secret |
| `STRIPE_PRICE_BASIC` | No | - | Stripe price ID for basic plan | Internal |
| `STRIPE_PRICE_PRO` | No | - | Stripe price ID for pro plan | Internal |
| `STRIPE_PRICE_ADDON` | No | - | Stripe price ID for addon | Internal |

### PayPal
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `PAYPAL_CLIENT_ID` | No | - | PayPal client ID | Secret |
| `PAYPAL_CLIENT_SECRET` | No | - | PayPal client secret | Secret |
| `PAYPAL_WEBHOOK_ID` | No | - | PayPal webhook ID | Internal |

## AI Providers

### OpenAI
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `OPENAI_API_KEY` | No | - | OpenAI API key | Secret |
| `AI_PRIMARY_PROVIDER` | No | `openai` | Primary AI provider | Internal |

### Anthropic
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `ANTHROPIC_API_KEY` | No | - | Anthropic API key | Secret |

### Google
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `GOOGLE_API_KEY` | No | - | Google API key | Secret |

## Email Services

### Resend
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `RESEND_API_KEY` | No | - | Resend API key | Secret |

### Postmark
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `POSTMARK_API_TOKEN` | No | - | Postmark API token | Secret |

## Observability & Monitoring

### OpenTelemetry
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | No | - | OpenTelemetry endpoint | Internal |
| `OTEL_SERVICE_NAME` | No | `aias-platform` | Service name for tracing | Internal |

### Sentry
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `SENTRY_DSN` | No | - | Sentry DSN for error tracking | Internal |
| `SENTRY_ORG` | No | - | Sentry organization | Internal |
| `SENTRY_PROJECT` | No | - | Sentry project | Internal |
| `SENTRY_AUTH_TOKEN` | No | - | Sentry auth token | Secret |

### Metrics
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `METRICS_TOKEN` | No | - | Metrics collection token | Secret |

## Logging & Analytics

### Logflare
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `LOGFLARE_API_KEY` | No | - | Logflare API key | Secret |
| `LOGFLARE_LOGGER_BACKEND_API_KEY` | No | - | Logflare backend API key | Secret |

### Analytics
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `NEXT_ANALYTICS_BACKEND_PROVIDER` | No | `postgres` | Analytics backend provider | Internal |
| `NEXT_ANALYTICS_BACKEND_URL` | No | - | Analytics backend URL | Secret |
| `NEXT_ANALYTICS_BACKEND_API_KEY` | No | - | Analytics backend API key | Secret |

## Security Configuration

### Encryption
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `ENCRYPTION_KEY` | Yes | - | 32-character encryption key | Secret |
| `CSP_REPORT_URI` | No | `/csp-report` | CSP report endpoint | Internal |

### Feature Flags
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `ENABLE_LEMON_SQUEEZY` | No | `false` | Enable Lemon Squeezy payments | Internal |
| `ENABLE_SENTRY` | No | `false` | Enable Sentry error tracking | Internal |
| `ENABLE_OTEL` | No | `true` | Enable OpenTelemetry | Internal |

## Docker Configuration

### Container Settings
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `DOCKER_REGISTRY` | No | - | Docker registry URL | Internal |
| `DOCKER_IMAGE_TAG` | No | `latest` | Docker image tag | Internal |

### Health Checks
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `HEALTH_CHECK_INTERVAL` | No | `30s` | Health check interval | Internal |
| `HEALTH_CHECK_TIMEOUT` | No | `10s` | Health check timeout | Internal |

## Monitoring & Alerting

### Grafana
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `GRAFANA_ADMIN_USER` | No | `admin` | Grafana admin username | Secret |
| `GRAFANA_ADMIN_PASSWORD` | No | `admin` | Grafana admin password | Secret |

### Prometheus
| Variable | Required | Default | Description | Security Level |
|----------|----------|---------|-------------|----------------|
| `PROMETHEUS_RETENTION_TIME` | No | `200h` | Prometheus data retention | Internal |

## Security Best Practices

### Secret Management
1. **Never commit secrets** to version control
2. **Use environment-specific** files (.env.local, .env.production)
3. **Rotate secrets regularly** (quarterly for high-security)
4. **Use secret management services** (AWS Secrets Manager, Azure Key Vault)
5. **Encrypt secrets at rest** and in transit

### Environment Separation
1. **Development**: Use .env.local with test values
2. **Staging**: Use .env.staging with staging services
3. **Production**: Use .env.production with production services
4. **Never share** production secrets with development

### Access Control
1. **Principle of least privilege** for environment access
2. **Separate credentials** for each environment
3. **Regular access reviews** and credential rotation
4. **Audit logging** for environment variable access

## Environment Setup

### Development Setup
```bash
# Copy example file
cp .env.example .env.local

# Generate secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 64  # For SECRET_KEY_BASE

# Update .env.local with generated values
```

### Production Setup
```bash
# Use secret management service
# Set environment variables in deployment platform
# Verify all required variables are set
npm run doctor  # Check configuration
```

## Validation

### Required Variables Check
```bash
# Run configuration validation
npm run doctor

# Check specific environment
NODE_ENV=production npm run doctor
```

### Security Scan
```bash
# Scan for exposed secrets
npm run audit:security

# Check for hardcoded secrets
grep -r "sk_live_\|sk_test_\|whsec_" src/
```

## Troubleshooting

### Common Issues
1. **Missing required variables**: Check .env file and deployment platform
2. **Invalid format**: Verify variable format and encoding
3. **Permission denied**: Check file permissions and access rights
4. **Connection failed**: Verify network connectivity and credentials

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Check environment loading
NODE_ENV=development npm run doctor
```

## Rotation Schedule

### High Security (Monthly)
- JWT secrets
- Database passwords
- API keys
- Encryption keys

### Medium Security (Quarterly)
- Service account keys
- Webhook secrets
- Monitoring tokens

### Low Security (Annually)
- Configuration values
- Feature flags
- Non-sensitive defaults