/**
 * MCP Client Wrapper - Code-as-API Design
 * Treats MCP servers as importable TypeScript modules
 */

import { MCPServerConfig, ToolExecution } from './types';
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface MCPCallResult {
  content: any[];
  isError: boolean;
}

export class MCPClient extends EventEmitter {
  private config: MCPServerConfig;
  private process?: ChildProcess;
  private requestId = 0;
  private pendingRequests: Map<number, { resolve: (value: any) => void; reject: (error: Error) => void }> = new Map();
  private connected = false;
  private tools: Map<string, MCPTool> = new Map();

  constructor(config: MCPServerConfig) {
    super();
    this.config = config;
  }

  /**
   * Connect to MCP server
   */
  async connect(): Promise<void> {
    if (this.connected) return;

    if (this.config.transport === 'stdio') {
      await this.connectStdio();
    } else if (this.config.transport === 'http') {
      await this.connectHttp();
    } else {
      throw new Error(`Unsupported transport: ${this.config.transport}`);
    }

    // Initialize: list tools
    await this.initialize();
  }

  /**
   * Connect via stdio
   */
  private async connectStdio(): Promise<void> {
    if (!this.config.command) {
      throw new Error('Command required for stdio transport');
    }

    return new Promise((resolve, reject) => {
      this.process = spawn(this.config.command!, this.config.args || [], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let buffer = '';

      this.process.stdout?.on('data', (data: Buffer) => {
        buffer += data.toString();
        
        // Parse JSON-RPC messages
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const message = JSON.parse(line);
              this.handleMessage(message);
            } catch (error) {
              console.warn(`Failed to parse MCP message: ${error.message}`);
            }
          }
        }
      });

      this.process.stderr?.on('data', (data: Buffer) => {
        console.error(`MCP stderr: ${data.toString()}`);
      });

      this.process.on('exit', (code) => {
        this.connected = false;
        this.emit('disconnect', code);
      });

      // Send initialize request
      setTimeout(() => {
        this.connected = true;
        resolve();
      }, 100);
    });
  }

  /**
   * Connect via HTTP
   */
  private async connectHttp(): Promise<void> {
    if (!this.config.url) {
      throw new Error('URL required for HTTP transport');
    }

    // HTTP connection logic
    this.connected = true;
  }

  /**
   * Initialize MCP connection
   */
  private async initialize(): Promise<void> {
    try {
      // List available tools
      const tools = await this.listTools();
      tools.forEach(tool => {
        this.tools.set(tool.name, tool);
      });
    } catch (error) {
      console.warn(`MCP initialization warning: ${error.message}`);
    }
  }

  /**
   * List available tools from MCP server
   */
  async listTools(): Promise<MCPTool[]> {
    const response = await this.sendRequest('tools/list', {});
    return response.tools || [];
  }

  /**
   * Call MCP tool
   */
  async callTool(toolName: string, params: Record<string, any>): Promise<MCPCallResult> {
    const startTime = Date.now();
    
    try {
      const response = await this.sendRequest('tools/call', {
        name: toolName,
        arguments: params,
      });

      const latencyMs = Date.now() - startTime;

      return {
        content: response.content || [],
        isError: false,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      
      return {
        content: [{ type: 'text', text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  }

  /**
   * Send JSON-RPC request
   */
  private sendRequest(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      };

      this.pendingRequests.set(id, { resolve, reject });

      if (this.config.transport === 'stdio' && this.process) {
        this.process.stdin?.write(JSON.stringify(request) + '\n');
      } else if (this.config.transport === 'http' && this.config.url) {
        fetch(this.config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.config.headers,
          },
          body: JSON.stringify(request),
        })
          .then(res => res.json())
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('Not connected'));
      }

      // Timeout after 30s
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  /**
   * Handle incoming JSON-RPC message
   */
  private handleMessage(message: any): void {
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve, reject } = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message || 'MCP error'));
      } else {
        resolve(message.result);
      }
    }
  }

  /**
   * Get tool schema
   */
  getToolSchema(toolName: string): MCPTool | undefined {
    return this.tools.get(toolName);
  }

  /**
   * Disconnect from MCP server
   */
  disconnect(): void {
    if (this.process) {
      this.process.kill();
      this.process = undefined;
    }
    this.connected = false;
    this.tools.clear();
    this.pendingRequests.clear();
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }
}

/**
 * Code-as-API: Create typed wrapper function for MCP tool
 */
export function createMCPToolWrapper<TParams = any, TResult = any>(
  client: MCPClient,
  toolName: string
): (params: TParams) => Promise<TResult> {
  return async (params: TParams): Promise<TResult> => {
    const result = await client.callTool(toolName, params as any);
    
    if (result.isError) {
      throw new Error(result.content[0]?.text || 'Tool execution failed');
    }

    // Extract result from content array
    const content = result.content[0];
    if (content?.type === 'text') {
      try {
        return JSON.parse(content.text) as TResult;
      } catch {
        return content.text as TResult;
      }
    }

    return result.content as TResult;
  };
}

/**
 * Factory: Create MCP client from config
 */
export function createMCPClient(config: MCPServerConfig): MCPClient {
  return new MCPClient(config);
}
