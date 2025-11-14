/**
 * Integration Guide - Connecting AI Agent Engine to Existing Codebase
 */

// Example: Integrate with existing CRM connector
import { HubSpotConnector } from '@/packages/lib/connectors/crm-connector';
import { createAgentEngine } from './agent-engine';
import { WorkflowConfig } from './types';

/**
 * Create a tool wrapper for existing CRM connector
 */
export async function getCRMContactsTool(params: {
  limit?: number;
  search?: string;
}) {
  const connector = new HubSpotConnector({
    apiKey: process.env.HUBSPOT_API_KEY!,
    baseUrl: 'https://api.hubspot.com',
  });

  if (params.search) {
    return connector.searchContacts(params.search);
  }

  return connector.getContacts(params.limit || 100);
}

// Register in tools.json:
// {
//   "name": "getCRMContacts",
//   "path": "./ai/engine/tools/crm-tool.ts",
//   "version": "1.0.0",
//   "description": "Fetch contacts from HubSpot CRM",
//   "category": "connector",
//   "enabled": true
// }

/**
 * Example: Use agent engine with existing AI client
 */
export async function runAIWorkflow() {
  const agent = createAgentEngine({
    agentId: 'crm-agent',
    tokenBudget: 2000,
    enableTelemetry: true,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  });

  await agent.initialize();

  const workflow: WorkflowConfig = {
    workflowId: 'crm-analysis',
    steps: [
      {
        stepId: 'fetch-contacts',
        toolName: 'getCRMContacts',
        params: { limit: 100 },
      },
      {
        stepId: 'process-data',
        toolName: 'processContacts',
        params: {},
      },
    ],
  };

  const result = await agent.executeWorkflow(workflow);
  return result;
}

/**
 * Example: Integrate with existing AI insights agent
 */
import { AIInsightsAgent } from '../insights_agent.mjs';

export async function enhancedInsights(deploymentId: string) {
  const agent = createAgentEngine({
    agentId: 'insights-agent',
    tokenBudget: 2000,
  });

  await agent.initialize();

  // Use existing insights agent but with token-efficient context
  const insightsAgent = new AIInsightsAgent();
  const insights = await insightsAgent.analyzeDeployment(deploymentId);

  // Process insights through data processor
  const processed = DataProcessor.process(insights.recommendations || [], {
    maxResults: 10,
    sortFn: (a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    },
  });

  return {
    ...insights,
    processedRecommendations: processed.summary,
    insights: processed.insights,
  };
}
