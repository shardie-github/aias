/**
 * Partner Hooks
 */

export interface IntegrationContract {
  name: string;
  version: string;
  endpoints: Endpoint[];
  webhooks: Webhook[];
}

export interface Endpoint {
  method: string;
  path: string;
  description: string;
}

export interface Webhook {
  name: string;
  url: string;
  events: string[];
}

export const partnerContracts: IntegrationContract[] = [
  {
    name: 'TikTok Business API',
    version: '1.0',
    endpoints: [
      {
        method: 'POST',
        path: '/api/partners/tiktok/ads',
        description: 'Create TikTok ad campaign',
      },
    ],
    webhooks: [
      {
        name: 'campaign_updated',
        url: '/api/webhooks/tiktok',
        events: ['campaign.created', 'campaign.updated'],
      },
    ],
  },
];

export function validateContractPayload(contract: IntegrationContract, event: string, payload: any): boolean {
  return true;
}
