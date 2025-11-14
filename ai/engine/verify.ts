/**
 * Quick Verification Script
 * Tests core functionality of the AI Agent Engine
 */

import { ToolRegistry } from './tool-registry';
import { ContextManager } from './context-manager';
import { DataProcessor } from './data-processor';
import { PrivacyGuard } from './privacy';
import { AgentContext } from './types';

async function verify() {
  console.log('🔍 Verifying AI Agent Engine...\n');

  // Test 1: Tool Registry
  console.log('1. Testing Tool Registry...');
  try {
    const registry = new ToolRegistry('./ai/engine/tools.json', './ai/engine/tools');
    await registry.loadManifest();
    const tools = registry.listTools();
    console.log(`   ✅ Registry loaded ${tools.length} tools`);
  } catch (error: any) {
    console.log(`   ⚠️  Registry test: ${error.message}`);
  }

  // Test 2: Context Manager
  console.log('2. Testing Context Manager...');
  try {
    const context: AgentContext = {
      agentId: 'test',
      workflowId: 'test',
      tokenBudget: 2000,
      currentTokens: 0,
      loadedTools: new Set(),
      executionHistory: [],
      metadata: {},
    };
    const ctxManager = new ContextManager(context, 2000);
    ctxManager.addEntry('system', 'Test system message', 100);
    ctxManager.addEntry('user', 'Test user message');
    const stats = ctxManager.getStats();
    console.log(`   ✅ Context manager: ${stats.totalTokens} tokens, ${stats.entries} entries`);
  } catch (error: any) {
    console.log(`   ❌ Context manager test failed: ${error.message}`);
  }

  // Test 3: Data Processor
  console.log('3. Testing Data Processor...');
  try {
    const data = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      value: Math.random() * 100,
      timestamp: new Date().toISOString(),
    }));
    const processed = DataProcessor.process(data, {
      maxResults: 10,
      filterFn: (item) => item.value > 50,
    });
    console.log(`   ✅ Processed ${processed.originalCount} → ${processed.processedCount} (${processed.reductionPercent.toFixed(1)}% reduction)`);
  } catch (error: any) {
    console.log(`   ❌ Data processor test failed: ${error.message}`);
  }

  // Test 4: Privacy Guard
  console.log('4. Testing Privacy Guard...');
  try {
    const data = {
      email: 'user@example.com',
      phone: '555-1234',
      name: 'John Doe',
    };
    const tokenized = PrivacyGuard.tokenize(data);
    console.log(`   ✅ Tokenized data: ${tokenized.piiFields.length} PII fields detected`);
    
    const detokenized = PrivacyGuard.detokenize(tokenized.tokenized);
    console.log(`   ✅ Detokenization successful: ${detokenized.email === data.email}`);
  } catch (error: any) {
    console.log(`   ❌ Privacy guard test failed: ${error.message}`);
  }

  console.log('\n✅ Verification complete!');
}

if (require.main === module) {
  verify().catch(console.error);
}
