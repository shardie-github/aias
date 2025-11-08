import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '@ai-consultancy/config';
import { prisma } from './database';
import { aiClient } from './ai/client';
import { AIGenerators } from './ai/generators';

const connection = new IORedis(config.redis.url);

// Queue definitions
export const feedIngestQueue = new Queue('feeds:ingest', { connection });
export const aiGenerateQueue = new Queue('ai:generate', { connection });
export const reportPdfQueue = new Queue('reports:pdf', { connection });
export const billingSyncQueue = new Queue('billing:sync', { connection });

// Job types
export interface FeedIngestJob {
  sourceId: string;
  data: any;
  metadata?: Record<string, any>;
}

export interface AIGenerateJob {
  type: 'audit' | 'estimate' | 'content' | 'workflow';
  userId: string;
  data: any;
  metadata?: Record<string, any>;
}

export interface ReportPdfJob {
  reportId: string;
  userId: string;
  data: any;
}

export interface BillingSyncJob {
  orgId: string;
  subscriptionId: string;
  event: string;
}

// Queue processors
export class QueueProcessors {
  static async processFeedIngest(job: Job<FeedIngestJob>) {
    const { sourceId, data, metadata } = job.data;
    
    try {
      // Update ingest event status
      const ingestEvent = await prisma.ingestEvent.create({
        data: {
          sourceId,
          status: 'RUNNING',
          stats: { startedAt: new Date() },
        },
      });

      // Get source configuration
      const source = await prisma.source.findUnique({
        where: { id: sourceId },
      });

      if (!source) {
        throw new Error('Source not found');
      }

      let processedData: any[] = [];

      // Process based on source type
      switch (source.type) {
        case 'SHOPIFY_JSON':
          processedData = await this.processShopifyData(data);
          break;
        case 'GOOGLE_TRENDS_CSV':
          processedData = await this.processGoogleTrendsData(data);
          break;
        case 'TIKTOK_BUSINESS_JSON':
          processedData = await this.processTikTokData(data);
          break;
        case 'ALIEXPRESS_CSV':
          processedData = await this.processAliExpressData(data);
          break;
        case 'GENERIC_CSV':
          processedData = await this.processGenericCsvData(data);
          break;
        case 'GENERIC_JSON':
          processedData = await this.processGenericJsonData(data);
          break;
        default:
          throw new Error(`Unsupported source type: ${source.type}`);
      }

      // Store processed data
      await this.storeProcessedData(source.type, processedData, source.orgId);

      // Update source last run
      await prisma.source.update({
        where: { id: sourceId },
        data: { lastRun: new Date() },
      });

      // Update ingest event
      await prisma.ingestEvent.update({
        where: { id: ingestEvent.id },
        data: {
          status: 'COMPLETED',
          stats: {
            startedAt: ingestEvent.stats?.startedAt,
            completedAt: new Date(),
            recordsProcessed: processedData.length,
          },
        },
      });

      console.log(`Processed ${processedData.length} records for source ${sourceId}`);
    } catch (error) {
      console.error('Feed ingest error:', error);
      
      // Update ingest event with error
      await prisma.ingestEvent.updateMany({
        where: { sourceId },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  static async processAIGenerate(job: Job<AIGenerateJob>) {
    const { type, userId, data, metadata } = job.data;
    
    try {
      let result: any;

      switch (type) {
        case 'audit':
          result = await AIGenerators.generateAuditSummary(data.website, data.type);
          break;
        case 'estimate':
          result = await AIGenerators.generateProjectEstimate(
            data.projectType,
            data.scope,
            data.requirements
          );
          break;
        case 'content':
          result = await AIGenerators.generateContentPlan(
            data.topic,
            data.type,
            data.tone,
            data.targetAudience,
            data.keywords
          );
          break;
        case 'workflow':
          result = await AIGenerators.generateWorkflowBlueprint(
            data.businessType,
            data.goals,
            data.currentProcesses,
            data.painPoints,
            data.budget,
            data.timeline
          );
          break;
        default:
          throw new Error(`Unsupported AI generation type: ${type}`);
      }

      // Store AI run record
      await prisma.aiRun.create({
        data: {
          userId,
          kind: type.toUpperCase() as any,
          provider: 'openai', // This would be determined by the AI client
          model: 'gpt-4',
          tokensIn: 0, // This would be populated by the AI client
          tokensOut: 0,
          cost: 0,
          durationMs: 0,
          metadata: {
            type,
            data,
            result,
          },
        },
      });

      console.log(`Generated ${type} for user ${userId}`);
      return result;
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  static async processReportPdf(job: Job<ReportPdfJob>) {
    const { reportId, userId, data } = job.data;
    
    try {
      // Update report status
      await prisma.report.update({
        where: { id: reportId },
        data: { status: 'GENERATING' },
      });

      // Generate PDF (this would use a PDF generation library)
      const pdfBuffer = await this.generatePdf(data);

      // Upload to storage (this would use Supabase storage)
      const fileUrl = await this.uploadPdf(pdfBuffer, reportId);

      // Update report with file URL
      await prisma.report.update({
        where: { id: reportId },
        data: {
          status: 'COMPLETED',
          fileUrl,
        },
      });

      console.log(`Generated PDF report ${reportId}`);
    } catch (error) {
      console.error('PDF generation error:', error);
      
      await prisma.report.update({
        where: { id: reportId },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  }

  static async processBillingSync(job: Job<BillingSyncJob>) {
    const { orgId, subscriptionId, event } = job.data;
    
    try {
      // Sync subscription data with Stripe
      // This would fetch the latest subscription data and update the database
      console.log(`Syncing billing for org ${orgId}, subscription ${subscriptionId}, event ${event}`);
    } catch (error) {
      console.error('Billing sync error:', error);
      throw error;
    }
  }

  // Helper methods for data processing
  private static async processShopifyData(data: any): Promise<any[]> {
    // Process Shopify product data
    if (data.products && Array.isArray(data.products)) {
      return data.products.map((product: any) => ({
        name: product.title,
        description: product.body_html,
        price: parseFloat(product.variants[0]?.price || '0'),
        currency: 'USD',
        category: product.product_type,
        tags: product.tags ? product.tags.split(',').map((tag: string) => tag.trim()) : [],
        metadata: {
          shopifyId: product.id,
          handle: product.handle,
          vendor: product.vendor,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        },
      }));
    }
    return [];
  }

  private static async processGoogleTrendsData(data: any): Promise<any[]> {
    // Process Google Trends CSV data
    // This would parse CSV and extract trend data
    return [];
  }

  private static async processTikTokData(data: any): Promise<any[]> {
    // Process TikTok Business API data
    return [];
  }

  private static async processAliExpressData(data: any): Promise<any[]> {
    // Process AliExpress CSV data
    return [];
  }

  private static async processGenericCsvData(data: any): Promise<any[]> {
    // Process generic CSV data
    return [];
  }

  private static async processGenericJsonData(data: any): Promise<any[]> {
    // Process generic JSON data
    return [];
  }

  private static async storeProcessedData(type: string, data: any[], orgId: string) {
    // Store processed data in appropriate tables
    switch (type) {
      case 'SHOPIFY_JSON':
        await prisma.product.createMany({
          data: data.map(item => ({
            ...item,
            metadata: item.metadata || {},
          })),
        });
        break;
      case 'GOOGLE_TRENDS_CSV':
        await prisma.trend.createMany({
          data: data.map(item => ({
            ...item,
            metadata: item.metadata || {},
          })),
        });
        break;
      // Add other cases as needed
    }
  }

  private static async generatePdf(data: any): Promise<Buffer> {
    // This would use a PDF generation library like Puppeteer or @react-pdf/renderer
    // For now, return a dummy buffer
    return Buffer.from('PDF content would be generated here');
  }

  private static async uploadPdf(buffer: Buffer, reportId: string): Promise<string> {
    // Get Supabase URL from environment variables dynamically
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.SUPABASE_URL || 
                       '';
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is required for PDF upload');
    }
    
    // Extract project ref from Supabase URL to construct storage URL
    const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1] || '';
    
    if (!projectRef) {
      throw new Error('Invalid Supabase URL format');
    }
    
    return `https://${projectRef}.supabase.co/storage/v1/object/public/reports/${reportId}.pdf`;
  }
}

// Start workers
export function startWorkers() {
  // Feed ingest worker
  new Worker('feeds:ingest', QueueProcessors.processFeedIngest, { connection });

  // AI generate worker
  new Worker('ai:generate', QueueProcessors.processAIGenerate, { connection });

  // Report PDF worker
  new Worker('reports:pdf', QueueProcessors.processReportPdf, { connection });

  // Billing sync worker
  new Worker('billing:sync', QueueProcessors.processBillingSync, { connection });

  console.log('All queue workers started');
}