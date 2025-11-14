/**
 * Example Tool Implementations
 * Demonstrates code-as-API pattern
 */

// Example: Shopify Products Tool
export const shopifyToolSchema = {
  name: 'getShopifyProducts',
  description: 'Fetch products from Shopify store',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', default: 10 },
      collectionId: { type: 'string' },
      query: { type: 'string' },
    },
    required: [],
  },
};

export async function getShopifyProducts(params: {
  limit?: number;
  collectionId?: string;
  query?: string;
}): Promise<any[]> {
  // In production, this would call Shopify API
  // For now, return mock data
  return [
    { id: '1', title: 'Product 1', price: 29.99 },
    { id: '2', title: 'Product 2', price: 39.99 },
  ].slice(0, params.limit || 10);
}

// Example: CRM Contacts Tool
export const crmToolSchema = {
  name: 'getCRMContacts',
  description: 'Fetch contacts from CRM system',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', default: 100 },
      search: { type: 'string' },
    },
    required: [],
  },
};

export async function getCRMContacts(params: {
  limit?: number;
  search?: string;
}): Promise<any[]> {
  // In production, this would call CRM API
  return [];
}

// Example: Analytics Tool
export const analyticsToolSchema = {
  name: 'getAnalytics',
  description: 'Fetch analytics data',
  inputSchema: {
    type: 'object',
    properties: {
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      metrics: { type: 'array', items: { type: 'string' } },
    },
    required: ['startDate', 'endDate'],
  },
};

export async function getAnalytics(params: {
  startDate: string;
  endDate: string;
  metrics?: string[];
}): Promise<any> {
  return {
    visitors: 1000,
    conversions: 50,
    revenue: 5000,
  };
}
