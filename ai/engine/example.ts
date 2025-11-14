/**
 * Example Usage - Demonstrates the AI Agent Engine
 */

import { createAgentEngine } from './agent-engine';
import { WorkflowConfig } from './types';

async function example() {
  // Create agent
  const agent = createAgentEngine({
    agentId: 'example-agent',
    tokenBudget: 2000,
    enableTelemetry: true,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  });

  // Initialize
  await agent.initialize();

  // Define workflow
  const workflow: WorkflowConfig = {
    workflowId: 'example-workflow',
    steps: [
      {
        stepId: 'fetch-products',
        toolName: 'getShopifyProducts',
        params: { limit: 10 },
        retries: 2,
      },
      {
        stepId: 'fetch-analytics',
        toolName: 'getAnalytics',
        params: {
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        },
      },
    ],
    timeoutMs: 5000,
    tokenBudget: 2000,
  };

  // Execute workflow
  const result = await agent.executeWorkflow(workflow);

  // Log results
  console.log('Workflow Result:', JSON.stringify(result, null, 2));
  console.log('Agent Stats:', agent.getStats());

  // Cleanup
  await agent.cleanup();
}

// Run if executed directly
if (require.main === module) {
  example().catch(console.error);
}
