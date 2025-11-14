# AI Agent Engine - MCP-Powered Automation

Production-grade, cost-efficient, low-latency AI agent engine that fuses code execution with Model Context Protocol (MCP).

## Architecture Overview

### Core Tenets

1. **Token Efficiency** - Progressive tool discovery, 2K token context cap, cached schemas
2. **Code-as-API** - MCP servers as importable TypeScript modules
3. **In-Environment Processing** - Filter/aggregate before model access (10K rows → 10 insights)
4. **Progressive Discovery** - Lazy-load tools on demand via registry pattern
5. **Privacy & Observability** - PII tokenization, sanitized telemetry
6. **Deterministic Control Flow** - Code-based branching, fallback layers
7. **Composability** - Self-describing modules, auto-generated typed SDKs
8. **Value-Add Layer** - Smart summaries, actionable insights, cost deltas

## Components

### 1. Tool Registry (`tool-registry.ts`)
- Progressive discovery from filesystem or manifest
- Lazy-loading: modules loaded only when requested
- Lightweight manifest (tools.json) maps tool names → paths → schemas
- Auto-discovery extracts schemas from tool files

### 2. MCP Client (`mcp-client.ts`)
- Wraps MCP servers as code modules
- Supports stdio, HTTP transports
- Creates typed wrapper functions: `import { getShopifyProducts } from "@/tools/shopify"`
- JSON-RPC protocol handling

### 3. Context Manager (`context-manager.ts`)
- Rolling context cap: 2,000 tokens per agent
- Automatic pruning: removes low-priority entries first
- Never removes system messages
- Compression: summarizes old entries

### 4. Data Processor (`data-processor.ts`)
- In-environment filtering/aggregation
- Reduces large datasets before model access
- Example: 10,000 ad rows → 10 high-value insights
- Grouping, aggregation, enrichment

### 5. Privacy Guard (`privacy.ts`)
- PII tokenization before model exposure
- Detects emails, phones, SSNs, IPs, user IDs
- Sanitizes telemetry logs
- Reversible tokenization for results

### 6. Workflow Executor (`workflow-executor.ts`)
- Deterministic control flow (no "let model decide")
- Fallback layers: try primary → secondary → cached result
- Retries with exponential backoff
- Timeout management (1.5s target per roundtrip)

### 7. Value-Add Layer (`value-add.ts`)
- Business impact interpretation
- Optimized JSON reports + natural language narratives
- Actionable outputs: metrics, cost deltas, next best action
- Efficiency scoring

### 8. Type Generator (`type-generator.ts`)
- Auto-generates typed SDKs from tool manifests
- TypeScript interfaces for inputs/outputs
- Client functions with full type safety

### 9. Agent Engine (`agent-engine.ts`)
- Main orchestrator
- Manages lifecycle: initialize → execute → cleanup
- Telemetry logging (sanitized)
- Stats and monitoring

## Usage

### Basic Example

```typescript
import { createAgentEngine } from './ai/engine';

// Create agent
const agent = createAgentEngine({
  agentId: 'my-agent',
  tokenBudget: 2000,
  enableTelemetry: true,
});

// Initialize
await agent.initialize();

// Define workflow
const workflow = {
  workflowId: 'example',
  steps: [
    {
      stepId: 'fetch-data',
      toolName: 'getShopifyProducts',
      params: { limit: 10 },
    },
  ],
};

// Execute
const result = await agent.executeWorkflow(workflow);
console.log(result);
```

### Creating Tools

```typescript
// tools/my-tool.ts
export const toolSchema = {
  name: 'myTool',
  description: 'Does something useful',
  inputSchema: {
    type: 'object',
    properties: {
      param: { type: 'string' },
    },
  },
};

export async function myTool(params: { param: string }) {
  // Your implementation
  return { result: 'success' };
}
```

### MCP Integration

```typescript
import { createMCPClient, createMCPToolWrapper } from './ai/engine';

// Connect to MCP server
const client = createMCPClient({
  name: 'shopify-mcp',
  transport: 'stdio',
  command: 'npx',
  args: ['@modelcontextprotocol/server-shopify'],
});

await client.connect();

// Create typed wrapper
const getProducts = createMCPToolWrapper(client, 'get_products');
const products = await getProducts({ limit: 10 });
```

## Token Efficiency

- **Progressive Discovery**: Only load tool schemas when needed
- **Context Pruning**: Automatically removes low-priority entries
- **Data Reduction**: Process 10K rows → 10 insights before model
- **Cached Schemas**: Never resend large JSON definitions

## Privacy & Security

- **PII Tokenization**: All PII tokenized before model exposure
- **Sanitized Telemetry**: Only tool_name, token_used, latency_ms logged
- **On-Prem Support**: Model never sees raw user data in isolated mode

## Performance Targets

- **Latency**: < 1.5s per workflow roundtrip
- **Token Budget**: 2,000 tokens per active agent
- **Context Window**: Rolling cap with automatic pruning
- **Efficiency Score**: 0-100 based on latency, tokens, success rate

## File Structure

```
ai/engine/
├── types.ts              # Core type definitions
├── tool-registry.ts       # Progressive discovery & lazy loading
├── mcp-client.ts          # MCP server wrapper
├── context-manager.ts     # Rolling token cap management
├── data-processor.ts      # In-environment filtering/aggregation
├── privacy.ts             # PII tokenization
├── workflow-executor.ts   # Deterministic control flow
├── value-add.ts           # Smart summaries & insights
├── type-generator.ts      # Auto-generate typed SDKs
├── agent-engine.ts        # Main orchestrator
├── index.ts               # Public API exports
├── example.ts             # Usage example
├── tools.json             # Tool manifest
└── tools/
    └── example-tools.ts   # Example tool implementations
```

## Next Steps

1. **Add More Tools**: Create tools in `ai/engine/tools/`
2. **Configure MCP Servers**: Add MCP configs to your agent
3. **Generate SDK**: Run type generator to create typed client
4. **Monitor**: Enable telemetry to track token usage and latency
5. **Optimize**: Review efficiency scores and optimize workflows

## License

MIT
