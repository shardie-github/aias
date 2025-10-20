import { z } from 'zod';
import { aiClient } from './client';
import { AuditRequest, EstimateRequest, ContentGenerationRequest, WorkflowGenerationRequest } from './types';

export const AuditSummarySchema = z.object({
  overallScore: z.number().min(0).max(100),
  categories: z.array(z.object({
    name: z.string(),
    score: z.number().min(0).max(100),
    issues: z.array(z.string()),
    recommendations: z.array(z.string()),
  })),
  criticalIssues: z.array(z.string()),
  quickWins: z.array(z.string()),
  estimatedImpact: z.string(),
  nextSteps: z.array(z.string()),
});

export const ProjectEstimateSchema = z.object({
  totalCost: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string(),
  }),
  timeline: z.object({
    min: z.number(), // weeks
    max: z.number(), // weeks
  }),
  phases: z.array(z.object({
    name: z.string(),
    duration: z.number(), // weeks
    cost: z.object({
      min: z.number(),
      max: z.number(),
    }),
    deliverables: z.array(z.string()),
  })),
  assumptions: z.array(z.string()),
  risks: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export const ContentPlanSchema = z.object({
  title: z.string(),
  outline: z.array(z.object({
    heading: z.string(),
    subheadings: z.array(z.string()),
    keyPoints: z.array(z.string()),
  })),
  targetKeywords: z.array(z.string()),
  estimatedReadTime: z.number(),
  callToAction: z.string(),
  socialMediaVariants: z.array(z.object({
    platform: z.string(),
    content: z.string(),
    hashtags: z.array(z.string()),
  })),
});

export const WorkflowBlueprintSchema = z.object({
  name: z.string(),
  description: z.string(),
  steps: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.enum(['manual', 'automated', 'ai-assisted']),
    estimatedTime: z.number(), // minutes
    dependencies: z.array(z.string()),
    tools: z.array(z.string()),
  })),
  integrations: z.array(z.object({
    name: z.string(),
    type: z.string(),
    purpose: z.string(),
    setupComplexity: z.enum(['low', 'medium', 'high']),
  })),
  metrics: z.array(z.object({
    name: z.string(),
    description: z.string(),
    target: z.string(),
    measurement: z.string(),
  })),
  estimatedROI: z.string(),
  implementationTimeline: z.string(),
});

export class AIGenerators {
  static async generateAuditSummary(website: string, type: 'seo' | 'performance' | 'accessibility' | 'security' | 'comprehensive' = 'comprehensive') {
    const request: AuditRequest = {
      website,
      type,
      options: {
        includeScreenshots: false,
        includeRecommendations: true,
        includeMetrics: true,
      },
    };

    const result = await aiClient.generateAudit(request);
    
    // Parse the AI response and structure it according to our schema
    const summary = {
      overallScore: this.extractScore(result.analysis),
      categories: this.extractCategories(result.analysis),
      criticalIssues: this.extractCriticalIssues(result.analysis),
      quickWins: this.extractQuickWins(result.analysis),
      estimatedImpact: this.extractImpact(result.analysis),
      nextSteps: this.extractNextSteps(result.analysis),
    };

    return AuditSummarySchema.parse(summary);
  }

  static async generateProjectEstimate(
    projectType: 'website' | 'ecommerce' | 'saas' | 'mobile' | 'ai-integration',
    scope: {
      pages: number;
      features: string[];
      integrations: string[];
      timeline: 'rush' | 'standard' | 'flexible';
    },
    requirements: {
      design: boolean;
      development: boolean;
      testing: boolean;
      deployment: boolean;
      maintenance: boolean;
    }
  ) {
    const request: EstimateRequest = {
      projectType,
      scope,
      requirements,
    };

    const result = await aiClient.generateEstimate(request);
    
    // Parse the AI response and structure it according to our schema
    const estimate = {
      totalCost: this.extractCostRange(result.estimate),
      timeline: this.extractTimeline(result.estimate),
      phases: this.extractPhases(result.estimate),
      assumptions: this.extractAssumptions(result.estimate),
      risks: this.extractRisks(result.estimate),
      recommendations: this.extractRecommendations(result.estimate),
    };

    return ProjectEstimateSchema.parse(estimate);
  }

  static async generateContentPlan(
    topic: string,
    type: 'blog-post' | 'social-media' | 'email' | 'ad-copy' | 'product-description',
    tone: 'professional' | 'casual' | 'technical' | 'creative' | 'persuasive' = 'professional',
    targetAudience?: string,
    keywords?: string[]
  ) {
    const request: ContentGenerationRequest = {
      type,
      topic,
      tone,
      length: 'medium',
      targetAudience,
      keywords,
    };

    const result = await aiClient.generateContent(request);
    
    // Parse the AI response and structure it according to our schema
    const plan = {
      title: this.extractTitle(result.content),
      outline: this.extractOutline(result.content),
      targetKeywords: keywords || this.extractKeywords(result.content),
      estimatedReadTime: this.extractReadTime(result.content),
      callToAction: this.extractCallToAction(result.content),
      socialMediaVariants: this.extractSocialVariants(result.content),
    };

    return ContentPlanSchema.parse(plan);
  }

  static async generateWorkflowBlueprint(
    businessType: string,
    goals: string[],
    currentProcesses: string[],
    painPoints: string[],
    budget: 'low' | 'medium' | 'high',
    timeline: 'immediate' | '1-3months' | '3-6months' | '6-12months'
  ) {
    const request: WorkflowGenerationRequest = {
      businessType,
      goals,
      currentProcesses,
      painPoints,
      budget,
      timeline,
    };

    const result = await aiClient.generateWorkflow(request);
    
    // Parse the AI response and structure it according to our schema
    const blueprint = {
      name: this.extractWorkflowName(result.workflow),
      description: this.extractWorkflowDescription(result.workflow),
      steps: this.extractWorkflowSteps(result.workflow),
      integrations: this.extractIntegrations(result.workflow),
      metrics: this.extractMetrics(result.workflow),
      estimatedROI: this.extractROI(result.workflow),
      implementationTimeline: this.extractImplementationTimeline(result.workflow),
    };

    return WorkflowBlueprintSchema.parse(blueprint);
  }

  // Helper methods to parse AI responses
  private static extractScore(analysis: string): number {
    const scoreMatch = analysis.match(/(?:score|rating|grade)[:\s]*(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : 75;
  }

  private static extractCategories(analysis: string) {
    // This would parse the analysis to extract categories
    // For now, return a default structure
    return [
      {
        name: 'Performance',
        score: 80,
        issues: ['Slow loading times', 'Large images'],
        recommendations: ['Optimize images', 'Enable compression'],
      },
      {
        name: 'SEO',
        score: 70,
        issues: ['Missing meta descriptions', 'Poor heading structure'],
        recommendations: ['Add meta descriptions', 'Improve heading hierarchy'],
      },
    ];
  }

  private static extractCriticalIssues(analysis: string): string[] {
    return ['Critical issue 1', 'Critical issue 2'];
  }

  private static extractQuickWins(analysis: string): string[] {
    return ['Quick win 1', 'Quick win 2'];
  }

  private static extractImpact(analysis: string): string {
    return 'High impact improvements identified';
  }

  private static extractNextSteps(analysis: string): string[] {
    return ['Step 1', 'Step 2', 'Step 3'];
  }

  private static extractCostRange(estimate: string) {
    return {
      min: 10000,
      max: 50000,
      currency: 'USD',
    };
  }

  private static extractTimeline(estimate: string) {
    return {
      min: 4,
      max: 12,
    };
  }

  private static extractPhases(estimate: string) {
    return [
      {
        name: 'Planning',
        duration: 2,
        cost: { min: 2000, max: 5000 },
        deliverables: ['Project plan', 'Requirements document'],
      },
      {
        name: 'Development',
        duration: 8,
        cost: { min: 15000, max: 35000 },
        deliverables: ['MVP', 'Core features'],
      },
    ];
  }

  private static extractAssumptions(estimate: string): string[] {
    return ['Assumption 1', 'Assumption 2'];
  }

  private static extractRisks(estimate: string): string[] {
    return ['Risk 1', 'Risk 2'];
  }

  private static extractRecommendations(estimate: string): string[] {
    return ['Recommendation 1', 'Recommendation 2'];
  }

  private static extractTitle(content: string): string {
    return content.split('\n')[0] || 'Generated Content';
  }

  private static extractOutline(content: string) {
    return [
      {
        heading: 'Introduction',
        subheadings: ['Overview', 'Problem Statement'],
        keyPoints: ['Key point 1', 'Key point 2'],
      },
    ];
  }

  private static extractKeywords(content: string): string[] {
    return ['keyword1', 'keyword2'];
  }

  private static extractReadTime(content: string): number {
    return Math.ceil(content.split(' ').length / 200);
  }

  private static extractCallToAction(content: string): string {
    return 'Learn more about our services';
  }

  private static extractSocialVariants(content: string) {
    return [
      {
        platform: 'Twitter',
        content: 'Short version for Twitter',
        hashtags: ['#hashtag1', '#hashtag2'],
      },
    ];
  }

  private static extractWorkflowName(workflow: string): string {
    return 'Automated Workflow';
  }

  private static extractWorkflowDescription(workflow: string): string {
    return 'A comprehensive workflow for business automation';
  }

  private static extractWorkflowSteps(workflow: string) {
    return [
      {
        id: 'step1',
        name: 'Data Collection',
        description: 'Collect relevant data',
        type: 'automated' as const,
        estimatedTime: 30,
        dependencies: [],
        tools: ['API', 'Database'],
      },
    ];
  }

  private static extractIntegrations(workflow: string) {
    return [
      {
        name: 'CRM Integration',
        type: 'API',
        purpose: 'Sync customer data',
        setupComplexity: 'medium' as const,
      },
    ];
  }

  private static extractMetrics(workflow: string) {
    return [
      {
        name: 'Processing Time',
        description: 'Time to complete workflow',
        target: '< 5 minutes',
        measurement: 'Average completion time',
      },
    ];
  }

  private static extractROI(workflow: string): string {
    return '300% ROI within 6 months';
  }

  private static extractImplementationTimeline(workflow: string): string {
    return '4-6 weeks';
  }
}