/**
 * Generate Embeddings Script
 * Syncs product copy, docs, or user data via OpenAI Embeddings v3 + store in Supabase
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

class EmbeddingsGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.supabase = createClient(
      process.env.SUPABASE_URL || `https://${process.env.SUPABASE_PROJECT_REF || 'ghqyxhbyyirveptgwoqm'}.supabase.co`,
      process.env.SUPABASE_ANON_KEY || ''
    );
    
    this.projectRef = process.env.SUPABASE_PROJECT_REF || 'ghqyxhbyyirveptgwoqm';
  }

  /**
   * Generate embeddings for content
   */
  async generateEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  /**
   * Chunk text into smaller pieces for embedding
   */
  chunkText(text, maxChunkSize = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
      let end = Math.min(start + maxChunkSize, text.length);
      
      // Try to break at sentence boundary
      if (end < text.length) {
        const lastPeriod = text.lastIndexOf('.', end);
        const lastNewline = text.lastIndexOf('\n', end);
        const breakPoint = Math.max(lastPeriod, lastNewline);
        
        if (breakPoint > start + maxChunkSize * 0.5) {
          end = breakPoint + 1;
        }
      }

      chunks.push(text.slice(start, end).trim());
      start = end - overlap;
    }

    return chunks.filter(chunk => chunk.length > 0);
  }

  /**
   * Process markdown files
   */
  async processMarkdownFiles(directory, namespace = 'docs') {
    const files = this.findFiles(directory, ['.md', '.mdx']);
    const results = [];

    for (const file of files) {
      try {
        console.log(`Processing markdown file: ${file}`);
        const content = readFileSync(file, 'utf-8');
        
        // Extract frontmatter if present
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        let metadata = {};
        let text = content;

        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          text = frontmatterMatch[2];
          
          // Parse frontmatter (basic implementation)
          frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
              metadata[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
            }
          });
        }

        // Add file metadata
        metadata = {
          ...metadata,
          type: 'documentation',
          file: file,
          namespace: namespace
        };

        // Chunk the content
        const chunks = this.chunkText(text);
        
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const embedding = await this.generateEmbedding(chunk);
          
          results.push({
            namespace,
            content: chunk,
            embedding,
            metadata: {
              ...metadata,
              chunk_index: i,
              total_chunks: chunks.length
            }
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }

    return results;
  }

  /**
   * Process TypeScript/JavaScript files
   */
  async processCodeFiles(directory, namespace = 'code') {
    const files = this.findFiles(directory, ['.ts', '.tsx', '.js', '.jsx']);
    const results = [];

    for (const file of files) {
      try {
        console.log(`Processing code file: ${file}`);
        const content = readFileSync(file, 'utf-8');
        
        // Extract functions, classes, and interfaces
        const codeBlocks = this.extractCodeBlocks(content);
        
        for (const block of codeBlocks) {
          const embedding = await this.generateEmbedding(block.content);
          
          results.push({
            namespace,
            content: block.content,
            embedding,
            metadata: {
              type: 'code',
              file: file,
              block_type: block.type,
              block_name: block.name,
              namespace: namespace
            }
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }

    return results;
  }

  /**
   * Extract code blocks from source files
   */
  extractCodeBlocks(content) {
    const blocks = [];
    
    // Extract function declarations
    const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g;
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      blocks.push({
        type: 'function',
        name: match[1],
        content: match[0]
      });
    }

    // Extract class declarations
    const classRegex = /(?:export\s+)?class\s+(\w+)(?:\s+extends\s+\w+)?\s*\{[\s\S]*?\n\}/g;
    while ((match = classRegex.exec(content)) !== null) {
      blocks.push({
        type: 'class',
        name: match[1],
        content: match[0]
      });
    }

    // Extract interface declarations
    const interfaceRegex = /(?:export\s+)?interface\s+(\w+)\s*\{[\s\S]*?\n\}/g;
    while ((match = interfaceRegex.exec(content)) !== null) {
      blocks.push({
        type: 'interface',
        name: match[1],
        content: match[0]
      });
    }

    // Extract type declarations
    const typeRegex = /(?:export\s+)?type\s+(\w+)\s*=\s*[\s\S]*?;/g;
    while ((match = typeRegex.exec(content)) !== null) {
      blocks.push({
        type: 'type',
        name: match[1],
        content: match[0]
      });
    }

    return blocks;
  }

  /**
   * Process API documentation
   */
  async processAPIDocs(directory, namespace = 'api') {
    const files = this.findFiles(directory, ['.ts', '.js']);
    const results = [];

    for (const file of files) {
      try {
        console.log(`Processing API file: ${file}`);
        const content = readFileSync(file, 'utf-8');
        
        // Extract API routes and endpoints
        const apiBlocks = this.extractAPIBlocks(content);
        
        for (const block of apiBlocks) {
          const embedding = await this.generateEmbedding(block.content);
          
          results.push({
            namespace,
            content: block.content,
            embedding,
            metadata: {
              type: 'api',
              file: file,
              method: block.method,
              path: block.path,
              namespace: namespace
            }
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }

    return results;
  }

  /**
   * Extract API blocks from source files
   */
  extractAPIBlocks(content) {
    const blocks = [];
    
    // Extract Next.js API routes
    const apiRouteRegex = /export\s+(?:default\s+)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g;
    let match;
    while ((match = apiRouteRegex.exec(content)) !== null) {
      const method = this.extractHTTPMethod(match[0]);
      const path = this.extractAPIPath(match[0]);
      
      blocks.push({
        method,
        path,
        content: match[0]
      });
    }

    return blocks;
  }

  /**
   * Extract HTTP method from API code
   */
  extractHTTPMethod(code) {
    if (code.includes('req.method === \'GET\'')) return 'GET';
    if (code.includes('req.method === \'POST\'')) return 'POST';
    if (code.includes('req.method === \'PUT\'')) return 'PUT';
    if (code.includes('req.method === \'DELETE\'')) return 'DELETE';
    if (code.includes('req.method === \'PATCH\'')) return 'PATCH';
    return 'UNKNOWN';
  }

  /**
   * Extract API path from code
   */
  extractAPIPath(code) {
    const pathMatch = code.match(/\/api\/([^\s'"]+)/);
    return pathMatch ? `/api/${pathMatch[1]}` : '/api/unknown';
  }

  /**
   * Find files with specific extensions
   */
  findFiles(directory, extensions) {
    const files = [];
    
    const scanDir = (dir) => {
      try {
        const entries = readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            scanDir(fullPath);
          } else if (entry.isFile() && extensions.includes(extname(entry.name))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`Could not scan directory ${dir}:`, error.message);
      }
    };

    scanDir(directory);
    return files;
  }

  /**
   * Store embeddings in Supabase
   */
  async storeEmbeddings(embeddings) {
    console.log(`Storing ${embeddings.length} embeddings...`);
    
    try {
      const { error } = await this.supabase
        .from('ai_embeddings')
        .upsert(embeddings, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      
      console.log('Embeddings stored successfully');
    } catch (error) {
      console.error('Error storing embeddings:', error);
      throw error;
    }
  }

  /**
   * Clear existing embeddings for a namespace
   */
  async clearNamespace(namespace) {
    try {
      const { error } = await this.supabase
        .from('ai_embeddings')
        .delete()
        .eq('namespace', namespace);

      if (error) throw error;
      
      console.log(`Cleared existing embeddings for namespace: ${namespace}`);
    } catch (error) {
      console.error('Error clearing namespace:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for all content
   */
  async generateAll(options = {}) {
    const {
      clearExisting = false,
      namespaces = ['docs', 'code', 'api'],
      directories = {
        docs: './docs',
        code: './src',
        api: './src/pages/api'
      }
    } = options;

    console.log('🚀 Starting embeddings generation...\n');

    for (const namespace of namespaces) {
      console.log(`📁 Processing namespace: ${namespace}`);
      
      if (clearExisting) {
        await this.clearNamespace(namespace);
      }

      let embeddings = [];

      switch (namespace) {
        case 'docs':
          embeddings = await this.processMarkdownFiles(directories.docs, namespace);
          break;
        case 'code':
          embeddings = await this.processCodeFiles(directories.code, namespace);
          break;
        case 'api':
          embeddings = await this.processAPIDocs(directories.api, namespace);
          break;
        default:
          console.warn(`Unknown namespace: ${namespace}`);
          continue;
      }

      if (embeddings.length > 0) {
        await this.storeEmbeddings(embeddings);
        console.log(`✅ Generated ${embeddings.length} embeddings for ${namespace}\n`);
      } else {
        console.log(`⚠️ No embeddings generated for ${namespace}\n`);
      }
    }

    console.log('🎉 Embeddings generation completed!');
  }
}

// Export for use in other modules
export { EmbeddingsGenerator };

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new EmbeddingsGenerator();
  
  const options = {
    clearExisting: process.argv.includes('--clear'),
    namespaces: process.argv.includes('--namespaces') 
      ? process.argv[process.argv.indexOf('--namespaces') + 1].split(',')
      : ['docs', 'code', 'api']
  };

  generator.generateAll(options).catch(console.error);
}