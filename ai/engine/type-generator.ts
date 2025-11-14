/**
 * Type Generation System - Auto-generate typed SDKs for MCP endpoints
 */

import { ToolManifest, ToolSchema } from './types';
import { ToolRegistry } from './tool-registry';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export class TypeGenerator {
  /**
   * Generate TypeScript SDK from tool manifests
   */
  static async generateSDK(
    registry: ToolRegistry,
    outputPath: string
  ): Promise<void> {
    const manifests = registry.getAllManifests();
    
    // Generate types
    const types = this.generateTypes(manifests);
    
    // Generate client functions
    const clientFunctions = this.generateClientFunctions(manifests);
    
    // Generate index
    const index = this.generateIndex(manifests);
    
    // Write files
    await writeFile(join(outputPath, 'types.ts'), types);
    await writeFile(join(outputPath, 'client.ts'), clientFunctions);
    await writeFile(join(outputPath, 'index.ts'), index);
  }

  /**
   * Generate TypeScript types from schemas
   */
  private static generateTypes(manifests: ToolManifest[]): string {
    const typeDefs: string[] = [
      '// Auto-generated types from tool manifests',
      '// Do not edit manually',
      '',
    ];

    for (const manifest of manifests) {
      if (!manifest.schema) continue;

      const toolName = this.toPascalCase(manifest.name);
      
      // Input type
      if (manifest.schema.inputSchema) {
        const inputType = this.schemaToType(manifest.schema.inputSchema, `${toolName}Input`);
        typeDefs.push(`export interface ${toolName}Input ${inputType}`);
      } else {
        typeDefs.push(`export interface ${toolName}Input extends Record<string, any> {}`);
      }

      // Output type
      if (manifest.schema.outputSchema) {
        const outputType = this.schemaToType(manifest.schema.outputSchema, `${toolName}Output`);
        typeDefs.push(`export interface ${toolName}Output ${outputType}`);
      } else {
        typeDefs.push(`export type ${toolName}Output = any;`);
      }

      typeDefs.push('');
    }

    return typeDefs.join('\n');
  }

  /**
   * Generate client functions
   */
  private static generateClientFunctions(manifests: ToolManifest[]): string {
    const functions: string[] = [
      "import { ToolRegistry } from '../tool-registry';",
      "import type {",
    ];

    // Import types
    for (const manifest of manifests) {
      const toolName = this.toPascalCase(manifest.name);
      functions.push(`  ${toolName}Input,`);
      functions.push(`  ${toolName}Output,`);
    }

    functions.push("} from './types';");
    functions.push('');
    functions.push('export class ToolClient {');
    functions.push('  constructor(private registry: ToolRegistry) {}');
    functions.push('');

    // Generate function for each tool
    for (const manifest of manifests) {
      const toolName = manifest.name;
      const pascalName = this.toPascalCase(toolName);
      
      functions.push(`  /**`);
      functions.push(`   * ${manifest.description}`);
      functions.push(`   */`);
      functions.push(`  async ${toolName}(params: ${pascalName}Input): Promise<${pascalName}Output> {`);
      functions.push(`    const tool = await this.registry.loadTool('${toolName}');`);
      functions.push(`    return tool(params);`);
      functions.push(`  }`);
      functions.push('');
    }

    functions.push('}');

    return functions.join('\n');
  }

  /**
   * Generate index file
   */
  private static generateIndex(manifests: ToolManifest[]): string {
    return [
      "export * from './types';",
      "export * from './client';",
      "export { ToolRegistry, getToolRegistry } from '../tool-registry';",
      "export { createAgentEngine } from '../agent-engine';",
    ].join('\n');
  }

  /**
   * Convert schema to TypeScript type
   */
  private static schemaToType(schema: Record<string, any>, name: string): string {
    if (schema.type === 'object' && schema.properties) {
      const props: string[] = [];
      for (const [key, value] of Object.entries(schema.properties)) {
        const propType = this.getTypeFromSchema(value as any);
        props.push(`  ${key}${schema.required?.includes(key) ? '' : '?'}: ${propType};`);
      }
      return `{\n${props.join('\n')}\n}`;
    }

    return 'Record<string, any>';
  }

  /**
   * Get TypeScript type from JSON schema
   */
  private static getTypeFromSchema(schema: any): string {
    if (schema.type === 'string') return 'string';
    if (schema.type === 'number' || schema.type === 'integer') return 'number';
    if (schema.type === 'boolean') return 'boolean';
    if (schema.type === 'array') {
      const itemType = schema.items ? this.getTypeFromSchema(schema.items) : 'any';
      return `${itemType}[]`;
    }
    if (schema.type === 'object') {
      return 'Record<string, any>';
    }
    return 'any';
  }

  /**
   * Convert kebab-case to PascalCase
   */
  private static toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}
