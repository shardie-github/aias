/**
 * Progressive Tool Discovery & Registry System
 * Lazy-loads tools on demand, maintains lightweight manifest
 */

import { ToolManifest, ToolSchema } from './types';
import { readFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

export class ToolRegistry {
  private manifests: Map<string, ToolManifest> = new Map();
  private loadedModules: Map<string, any> = new Map();
  private manifestPath: string;
  private toolsBasePath: string;

  constructor(manifestPath = './ai/engine/tools.json', toolsBasePath = './ai/engine/tools') {
    this.manifestPath = manifestPath;
    this.toolsBasePath = toolsBasePath;
  }

  /**
   * Load manifest from disk (lightweight, cached)
   */
  async loadManifest(): Promise<void> {
    try {
      if (existsSync(this.manifestPath)) {
        const content = await readFile(this.manifestPath, 'utf-8');
        const manifest: ToolManifest[] = JSON.parse(content);
        
        manifest.forEach(tool => {
          if (tool.enabled) {
            this.manifests.set(tool.name, tool);
          }
        });
      } else {
        // Auto-discover tools if manifest doesn't exist
        await this.discoverTools();
      }
    } catch (error) {
      console.warn(`Failed to load manifest: ${error.message}`);
      await this.discoverTools();
    }
  }

  /**
   * Auto-discover tools from filesystem
   */
  async discoverTools(): Promise<void> {
    try {
      if (!existsSync(this.toolsBasePath)) {
        return;
      }

      const entries = await readdir(this.toolsBasePath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.ts')) {
          const toolName = entry.name.replace('.ts', '');
          const toolPath = join(this.toolsBasePath, entry.name);
          
          // Extract schema from tool file (lazy, minimal read)
          const schema = await this.extractSchema(toolPath);
          
          const manifest: ToolManifest = {
            name: toolName,
            path: toolPath,
            version: '1.0.0',
            description: schema?.description || `Tool: ${toolName}`,
            category: 'native',
            schema,
            enabled: true,
          };
          
          this.manifests.set(toolName, manifest);
        }
      }
    } catch (error) {
      console.warn(`Tool discovery failed: ${error.message}`);
    }
  }

  /**
   * Extract minimal schema from tool file (token-efficient)
   */
  private async extractSchema(filePath: string): Promise<ToolSchema | undefined> {
    try {
      const content = await readFile(filePath, 'utf-8');
      
      // Extract schema using regex (fast, no full parse)
      const schemaMatch = content.match(/export\s+const\s+toolSchema\s*[:=]\s*({[\s\S]*?});/);
      if (schemaMatch) {
        // Evaluate minimal schema object
        const schemaStr = schemaMatch[1];
        const schema = eval(`(${schemaStr})`);
        return schema;
      }
      
      // Fallback: extract from JSDoc or function signature
      const descMatch = content.match(/\/\*\*[\s\S]*?\*\s*@description\s+(.+?)(?:\n|$)/);
      const nameMatch = content.match(/export\s+(?:async\s+)?function\s+(\w+)/);
      
      if (nameMatch) {
        return {
          name: nameMatch[1],
          description: descMatch ? descMatch[1].trim() : `Tool: ${nameMatch[1]}`,
          inputSchema: {},
        };
      }
    } catch (error) {
      // Schema extraction failed, return undefined
    }
    return undefined;
  }

  /**
   * Get tool manifest without loading module (token-efficient)
   */
  getManifest(toolName: string): ToolManifest | undefined {
    return this.manifests.get(toolName);
  }

  /**
   * List available tools (names only, no schemas)
   */
  listTools(): string[] {
    return Array.from(this.manifests.keys());
  }

  /**
   * Search tools by name/description (progressive discovery)
   */
  searchTools(query: string): ToolManifest[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.manifests.values()).filter(tool =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Lazy-load tool module only when needed
   */
  async loadTool(toolName: string): Promise<any> {
    // Check cache first
    if (this.loadedModules.has(toolName)) {
      return this.loadedModules.get(toolName);
    }

    const manifest = this.manifests.get(toolName);
    if (!manifest) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    if (!manifest.enabled) {
      throw new Error(`Tool disabled: ${toolName}`);
    }

    try {
      // Dynamic import (lazy)
      const module = await import(manifest.path);
      const toolModule = module.default || module[toolName] || module;
      
      this.loadedModules.set(toolName, toolModule);
      return toolModule;
    } catch (error) {
      throw new Error(`Failed to load tool ${toolName}: ${error.message}`);
    }
  }

  /**
   * Unload tool from memory (free resources)
   */
  unloadTool(toolName: string): void {
    this.loadedModules.delete(toolName);
  }

  /**
   * Get schema for tool (cached, minimal)
   */
  getToolSchema(toolName: string): ToolSchema | undefined {
    const manifest = this.manifests.get(toolName);
    return manifest?.schema;
  }

  /**
   * Register tool dynamically (runtime registration)
   */
  registerTool(manifest: ToolManifest): void {
    this.manifests.set(manifest.name, manifest);
  }

  /**
   * Get all manifests (for SDK generation)
   */
  getAllManifests(): ToolManifest[] {
    return Array.from(this.manifests.values());
  }
}

// Singleton instance
let registryInstance: ToolRegistry | null = null;

export function getToolRegistry(): ToolRegistry {
  if (!registryInstance) {
    registryInstance = new ToolRegistry();
  }
  return registryInstance;
}
