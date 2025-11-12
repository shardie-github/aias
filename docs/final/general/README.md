# Partner Integration Guide

See `/partners/postman.json` for Postman collection.

## Integration Contracts

### TikTok Business API
- Version: 1.0
- Endpoints: POST /api/partners/tiktok/ads
- Webhooks: campaign.created, campaign.updated

### Meta Ads API
- Version: 1.0
- Endpoints: POST /api/partners/meta/ads
- Webhooks: campaign.created, campaign.updated

## Testing

Run contract tests: `npm run ops test:e2e -- --project partners`
