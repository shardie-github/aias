import { z } from 'zod';
import { prisma } from './database';
import { feedIngestQueue } from './queues';

export const SourceConfigSchema = z.object({
  url: z.string().url().optional(),
  apiKey: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  region: z.string().optional(),
  timeframe: z.string().optional(),
  file: z.string().optional(),
  mapping: z.record(z.string()).optional(),
});

export interface SourceAdapter {
  name: string;
  type: string;
  validateConfig(config: any): boolean;
  fetchData(config: any): Promise<any>;
}

export class ShopifyAdapter implements SourceAdapter {
  name = 'Shopify';
  type = 'SHOPIFY_JSON';

  validateConfig(config: any): boolean {
    return SourceConfigSchema.parse(config).url !== undefined && 
           SourceConfigSchema.parse(config).apiKey !== undefined;
  }

  async fetchData(config: any): Promise<any> {
    const { url, apiKey } = SourceConfigSchema.parse(config);
    
    const response = await fetch(url!, {
      headers: {
        'X-Shopify-Access-Token': apiKey!,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export class GoogleTrendsAdapter implements SourceAdapter {
  name = 'Google Trends';
  type = 'GOOGLE_TRENDS_CSV';

  validateConfig(config: any): boolean {
    return SourceConfigSchema.parse(config).keywords !== undefined;
  }

  async fetchData(config: any): Promise<any> {
    const { keywords, region = 'US', timeframe = '12m' } = SourceConfigSchema.parse(config);
    
    // This would integrate with Google Trends API or CSV processing
    // For now, return mock data
    return {
      keywords: keywords!,
      region,
      timeframe,
      data: keywords!.map(keyword => ({
        keyword,
        volume: Math.floor(Math.random() * 10000),
        category: 'Technology',
        region,
        period: new Date().toISOString().slice(0, 7),
      })),
    };
  }
}

export class TikTokBusinessAdapter implements SourceAdapter {
  name = 'TikTok Business';
  type = 'TIKTOK_BUSINESS_JSON';

  validateConfig(config: any): boolean {
    return SourceConfigSchema.parse(config).apiKey !== undefined;
  }

  async fetchData(config: any): Promise<any> {
    const { apiKey } = SourceConfigSchema.parse(config);
    
    // This would integrate with TikTok Business API
    // For now, return mock data
    return {
      creatives: [
        {
          id: '1',
          title: 'Sample Creative',
          description: 'A sample TikTok creative',
          type: 'video',
          platform: 'tiktok',
          metrics: {
            views: 1000,
            likes: 50,
            shares: 10,
          },
        },
      ],
    };
  }
}

export class AliExpressAdapter implements SourceAdapter {
  name = 'AliExpress';
  type = 'ALIEXPRESS_CSV';

  validateConfig(config: any): boolean {
    return SourceConfigSchema.parse(config).file !== undefined;
  }

  async fetchData(config: any): Promise<any> {
    const { file } = SourceConfigSchema.parse(config);
    
    // This would process CSV file
    // For now, return mock data
    return {
      products: [
        {
          name: 'Sample Product',
          price: 9.99,
          currency: 'USD',
          category: 'Electronics',
          tags: ['electronics', 'gadgets'],
        },
      ],
    };
  }
}

export class GenericCsvAdapter implements SourceAdapter {
  name = 'Generic CSV';
  type = 'GENERIC_CSV';

  validateConfig(config: any): boolean {
    return SourceConfigSchema.parse(config).file !== undefined;
  }

  async fetchData(config: any): Promise<any> {
    const { file, mapping } = SourceConfigSchema.parse(config);
    
    // This would process CSV file with custom mapping
    // For now, return mock data
    return {
      records: [
        {
          name: 'Sample Record',
          value: 100,
          category: 'Data',
        },
      ],
    };
  }
}

export class GenericJsonAdapter implements SourceAdapter {
  name = 'Generic JSON';
  type = 'GENERIC_JSON';

  validateConfig(config: any): boolean {
    return SourceConfigSchema.parse(config).file !== undefined;
  }

  async fetchData(config: any): Promise<any> {
    const { file, mapping } = SourceConfigSchema.parse(config);
    
    // This would process JSON file with custom mapping
    // For now, return mock data
    return {
      records: [
        {
          name: 'Sample Record',
          value: 100,
          category: 'Data',
        },
      ],
    };
  }
}

export class DataFeedService {
  private static adapters: Map<string, SourceAdapter> = new Map([
    ['SHOPIFY_JSON', new ShopifyAdapter()],
    ['GOOGLE_TRENDS_CSV', new GoogleTrendsAdapter()],
    ['TIKTOK_BUSINESS_JSON', new TikTokBusinessAdapter()],
    ['ALIEXPRESS_CSV', new AliExpressAdapter()],
    ['GENERIC_CSV', new GenericCsvAdapter()],
    ['GENERIC_JSON', new GenericJsonAdapter()],
  ]);

  static async createSource(orgId: string, data: {
    name: string;
    type: string;
    config: any;
  }) {
    const adapter = this.adapters.get(data.type);
    if (!adapter) {
      throw new Error(`Unsupported source type: ${data.type}`);
    }

    if (!adapter.validateConfig(data.config)) {
      throw new Error('Invalid source configuration');
    }

    return prisma.source.create({
      data: {
        name: data.name,
        type: data.type as any,
        config: data.config,
        orgId,
      },
    });
  }

  static async updateSource(id: string, data: {
    name?: string;
    config?: any;
    isActive?: boolean;
  }) {
    const source = await prisma.source.findUnique({
      where: { id },
    });

    if (!source) {
      throw new Error('Source not found');
    }

    if (data.config) {
      const adapter = this.adapters.get(source.type);
      if (!adapter) {
        throw new Error(`Unsupported source type: ${source.type}`);
      }

      if (!adapter.validateConfig(data.config)) {
        throw new Error('Invalid source configuration');
      }
    }

    return prisma.source.update({
      where: { id },
      data: {
        name: data.name,
        config: data.config,
        isActive: data.isActive,
      },
    });
  }

  static async deleteSource(id: string) {
    return prisma.source.delete({
      where: { id },
    });
  }

  static async getSources(orgId: string) {
    return prisma.source.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getSource(id: string) {
    return prisma.source.findUnique({
      where: { id },
    });
  }

  static async runSource(id: string) {
    const source = await prisma.source.findUnique({
      where: { id },
    });

    if (!source) {
      throw new Error('Source not found');
    }

    if (!source.isActive) {
      throw new Error('Source is not active');
    }

    const adapter = this.adapters.get(source.type);
    if (!adapter) {
      throw new Error(`Unsupported source type: ${source.type}`);
    }

    try {
      // Fetch data from source
      const data = await adapter.fetchData(source.config);

      // Queue for processing
      await feedIngestQueue.add('process', {
        sourceId: source.id,
        data,
        metadata: {
          adapter: adapter.name,
          fetchedAt: new Date().toISOString(),
        },
      });

      return { success: true, message: 'Source queued for processing' };
    } catch (error) {
      console.error('Source run error:', error);
      throw new Error(`Failed to run source: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getIngestEvents(sourceId: string) {
    return prisma.ingestEvent.findMany({
      where: { sourceId },
      orderBy: { startedAt: 'desc' },
    });
  }

  static async getIngestStats(orgId: string) {
    const sources = await prisma.source.findMany({
      where: { orgId },
    });

    const stats = {
      totalSources: sources.length,
      activeSources: sources.filter(s => s.isActive).length,
      lastRun: sources.reduce((latest, source) => {
        if (!source.lastRun) return latest;
        if (!latest) return source.lastRun;
        return source.lastRun > latest ? source.lastRun : latest;
      }, null as Date | null),
    };

    return stats;
  }
}