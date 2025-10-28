/**
 * Future Runtime Readiness Checker
 * Validates build for Edge Runtime, WASM, Workers, and Hydrogen/Oxygen compatibility
 */

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

interface CompatibilityReport {
  edgeRuntime: {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  };
  wasm: {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  };
  workers: {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  };
  hydrogenOxygen: {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  };
  overall: {
    score: number;
    status: 'excellent' | 'good' | 'needs-work' | 'incompatible';
  };
}

class FutureCheck {
  private projectRoot: string;
  private packageJson: any;
  private nextConfig: any;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.packageJson = this.loadPackageJson();
    this.nextConfig = this.loadNextConfig();
  }

  /**
   * Load package.json
   */
  private loadPackageJson(): any {
    try {
      const packagePath = join(this.projectRoot, 'package.json');
      return JSON.parse(readFileSync(packagePath, 'utf-8'));
    } catch (error) {
      console.warn('Could not load package.json:', error);
      return {};
    }
  }

  /**
   * Load Next.js config
   */
  private loadNextConfig(): any {
    try {
      const configPath = join(this.projectRoot, 'next.config.js');
      if (existsSync(configPath)) {
        // Simple regex-based extraction for basic config
        const configContent = readFileSync(configPath, 'utf-8');
        return this.parseNextConfig(configContent);
      }
      return {};
    } catch (error) {
      console.warn('Could not load next.config.js:', error);
      return {};
    }
  }

  /**
   * Parse Next.js config (basic implementation)
   */
  private parseNextConfig(content: string): any {
    const config: any = {};
    
    // Extract runtime setting
    const runtimeMatch = content.match(/runtime:\s*['"`]([^'"`]+)['"`]/);
    if (runtimeMatch) {
      config.runtime = runtimeMatch[1];
    }

    // Extract experimental settings
    const experimentalMatch = content.match(/experimental:\s*{([^}]+)}/);
    if (experimentalMatch) {
      config.experimental = experimentalMatch[1];
    }

    return config;
  }

  /**
   * Check Edge Runtime compatibility
   */
  checkEdgeRuntime(): CompatibilityReport['edgeRuntime'] {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check if runtime is set to edge
    if (this.nextConfig.runtime !== 'edge') {
      issues.push('Runtime not set to edge in next.config.js');
      recommendations.push('Set runtime: "edge" in next.config.js for Edge Runtime compatibility');
    }

    // Check for Node.js specific dependencies
    const nodeOnlyDeps = this.findNodeOnlyDependencies();
    if (nodeOnlyDeps.length > 0) {
      issues.push(`Node.js only dependencies found: ${nodeOnlyDeps.join(', ')}`);
      recommendations.push('Replace Node.js specific dependencies with Edge Runtime compatible alternatives');
    }

    // Check for file system usage
    if (this.hasFileSystemUsage()) {
      issues.push('File system usage detected (not compatible with Edge Runtime)');
      recommendations.push('Use alternative storage solutions like Supabase or external APIs');
    }

    // Check for native modules
    const nativeModules = this.findNativeModules();
    if (nativeModules.length > 0) {
      issues.push(`Native modules found: ${nativeModules.join(', ')}`);
      recommendations.push('Replace native modules with WASM or pure JS alternatives');
    }

    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Check WASM compatibility
   */
  checkWASM(): CompatibilityReport['wasm'] {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for Node.js specific APIs
    const nodeAPIs = this.findNodeAPIs();
    if (nodeAPIs.length > 0) {
      issues.push(`Node.js APIs used: ${nodeAPIs.join(', ')}`);
      recommendations.push('Replace Node.js APIs with Web APIs or WASM-compatible alternatives');
    }

    // Check for synchronous operations
    if (this.hasSynchronousOperations()) {
      issues.push('Synchronous operations detected (not ideal for WASM)');
      recommendations.push('Use async/await patterns for better WASM compatibility');
    }

    // Check for large dependencies
    const largeDeps = this.findLargeDependencies();
    if (largeDeps.length > 0) {
      issues.push(`Large dependencies found: ${largeDeps.join(', ')}`);
      recommendations.push('Consider code splitting or lighter alternatives for WASM builds');
    }

    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Check Workers compatibility
   */
  checkWorkers(): CompatibilityReport['workers'] {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for global variables
    if (this.hasGlobalVariables()) {
      issues.push('Global variables detected (not compatible with Workers)');
      recommendations.push('Use proper module exports and avoid global state');
    }

    // Check for DOM usage
    if (this.hasDOMUsage()) {
      issues.push('DOM usage detected (not available in Workers)');
      recommendations.push('Remove DOM dependencies or use conditional loading');
    }

    // Check for process.env usage
    if (this.hasProcessEnvUsage()) {
      issues.push('process.env usage detected (use Workers environment variables)');
      recommendations.push('Replace process.env with Workers environment variables');
    }

    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Check Hydrogen/Oxygen compatibility
   */
  checkHydrogenOxygen(): CompatibilityReport['hydrogenOxygen'] {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for Shopify-specific patterns
    if (!this.hasShopifyPatterns()) {
      issues.push('No Shopify-specific patterns detected');
      recommendations.push('Implement Shopify-specific components and utilities');
    }

    // Check for server components
    if (!this.hasServerComponents()) {
      issues.push('Server components not detected');
      recommendations.push('Implement React Server Components for better performance');
    }

    // Check for streaming
    if (!this.hasStreamingSupport()) {
      issues.push('Streaming support not detected');
      recommendations.push('Implement streaming for better user experience');
    }

    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Find Node.js only dependencies
   */
  private findNodeOnlyDependencies(): string[] {
    const nodeOnlyDeps = [
      'fs', 'path', 'os', 'crypto', 'util', 'stream', 'buffer',
      'child_process', 'cluster', 'dgram', 'dns', 'net', 'tls',
      'http', 'https', 'url', 'querystring', 'readline', 'repl',
      'vm', 'v8', 'worker_threads'
    ];

    const dependencies = {
      ...this.packageJson.dependencies,
      ...this.packageJson.devDependencies
    };

    return Object.keys(dependencies).filter(dep => 
      nodeOnlyDeps.some(nodeDep => dep.includes(nodeDep))
    );
  }

  /**
   * Check for file system usage
   */
  private hasFileSystemUsage(): boolean {
    const fsPatterns = [
      'fs.readFile',
      'fs.writeFile',
      'fs.readdir',
      'fs.mkdir',
      'fs.rmdir',
      'fs.unlink',
      'fs.stat',
      'fs.access',
      'require(\'fs\')',
      'import fs from \'fs\''
    ];

    return this.searchInCode(fsPatterns);
  }

  /**
   * Find native modules
   */
  private findNativeModules(): string[] {
    const nativeModules = [
      'bcrypt', 'sqlite3', 'mysql2', 'pg-native', 'sharp',
      'canvas', 'puppeteer', 'playwright', 'selenium'
    ];

    const dependencies = {
      ...this.packageJson.dependencies,
      ...this.packageJson.devDependencies
    };

    return Object.keys(dependencies).filter(dep => 
      nativeModules.some(native => dep.includes(native))
    );
  }

  /**
   * Find Node.js APIs
   */
  private findNodeAPIs(): string[] {
    const nodeAPIs = [
      'process.argv', 'process.env', 'process.cwd', 'process.exit',
      'process.nextTick', 'process.hrtime', 'process.uptime',
      'Buffer', 'global', 'require', 'module', 'exports',
      '__dirname', '__filename'
    ];

    const foundAPIs: string[] = [];
    nodeAPIs.forEach(api => {
      if (this.searchInCode([api])) {
        foundAPIs.push(api);
      }
    });

    return foundAPIs;
  }

  /**
   * Check for synchronous operations
   */
  private hasSynchronousOperations(): boolean {
    const syncPatterns = [
      'readFileSync', 'writeFileSync', 'readdirSync',
      'mkdirSync', 'rmdirSync', 'unlinkSync', 'statSync'
    ];

    return this.searchInCode(syncPatterns);
  }

  /**
   * Find large dependencies
   */
  private findLargeDependencies(): string[] {
    const largeDeps = [
      'puppeteer', 'playwright', 'selenium', 'chromium',
      'electron', 'nwjs', 'openjdk', 'python'
    ];

    const dependencies = {
      ...this.packageJson.dependencies,
      ...this.packageJson.devDependencies
    };

    return Object.keys(dependencies).filter(dep => 
      largeDeps.some(large => dep.includes(large))
    );
  }

  /**
   * Check for global variables
   */
  private hasGlobalVariables(): boolean {
    const globalPatterns = [
      'global.', 'window.', 'self.', 'this.',
      'var ', 'let ', 'const ' // Basic check for variable declarations
    ];

    return this.searchInCode(globalPatterns);
  }

  /**
   * Check for DOM usage
   */
  private hasDOMUsage(): boolean {
    const domPatterns = [
      'document.', 'window.', 'navigator.', 'location.',
      'localStorage', 'sessionStorage', 'indexedDB',
      'getElementById', 'querySelector', 'addEventListener'
    ];

    return this.searchInCode(domPatterns);
  }

  /**
   * Check for process.env usage
   */
  private hasProcessEnvUsage(): boolean {
    return this.searchInCode(['process.env']);
  }

  /**
   * Check for Shopify patterns
   */
  private hasShopifyPatterns(): boolean {
    const shopifyPatterns = [
      'Shopify', 'shopify', 'hydrogen', 'oxygen',
      'useShop', 'useCart', 'useProduct'
    ];

    return this.searchInCode(shopifyPatterns);
  }

  /**
   * Check for server components
   */
  private hasServerComponents(): boolean {
    const serverPatterns = [
      'use server', 'async function', 'await fetch',
      'ServerComponent', 'RSC'
    ];

    return this.searchInCode(serverPatterns);
  }

  /**
   * Check for streaming support
   */
  private hasStreamingSupport(): boolean {
    const streamingPatterns = [
      'Suspense', 'lazy', 'stream', 'renderToPipeableStream',
      'renderToReadableStream'
    ];

    return this.searchInCode(streamingPatterns);
  }

  /**
   * Search for patterns in code
   */
  private searchInCode(patterns: string[]): boolean {
    try {
      // Use grep to search for patterns in source files
      const command = `grep -r "${patterns.join('\\|')}" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" || true`;
      const result = execSync(command, { cwd: this.projectRoot, encoding: 'utf-8' });
      return result.trim().length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Calculate overall compatibility score
   */
  private calculateScore(report: Omit<CompatibilityReport, 'overall'>): CompatibilityReport['overall'] {
    const checks = [
      report.edgeRuntime.compatible,
      report.wasm.compatible,
      report.workers.compatible,
      report.hydrogenOxygen.compatible
    ];

    const compatibleCount = checks.filter(Boolean).length;
    const score = (compatibleCount / checks.length) * 100;

    let status: CompatibilityReport['overall']['status'];
    if (score >= 90) status = 'excellent';
    else if (score >= 70) status = 'good';
    else if (score >= 40) status = 'needs-work';
    else status = 'incompatible';

    return { score, status };
  }

  /**
   * Run complete compatibility check
   */
  async run(): Promise<CompatibilityReport> {
    console.log('🔍 Running Future Runtime Compatibility Check...\n');

    const edgeRuntime = this.checkEdgeRuntime();
    const wasm = this.checkWASM();
    const workers = this.checkWorkers();
    const hydrogenOxygen = this.checkHydrogenOxygen();

    const report: CompatibilityReport = {
      edgeRuntime,
      wasm,
      workers,
      hydrogenOxygen,
      overall: this.calculateScore({ edgeRuntime, wasm, workers, hydrogenOxygen })
    };

    this.printReport(report);
    return report;
  }

  /**
   * Print compatibility report
   */
  private printReport(report: CompatibilityReport): void {
    console.log('📊 Future Runtime Compatibility Report\n');
    console.log(`Overall Score: ${report.overall.score.toFixed(1)}% (${report.overall.status.toUpperCase()})\n`);

    // Edge Runtime
    console.log('🌐 Edge Runtime:');
    console.log(`  Status: ${report.edgeRuntime.compatible ? '✅ Compatible' : '❌ Issues Found'}`);
    if (report.edgeRuntime.issues.length > 0) {
      console.log('  Issues:');
      report.edgeRuntime.issues.forEach(issue => console.log(`    - ${issue}`));
    }
    if (report.edgeRuntime.recommendations.length > 0) {
      console.log('  Recommendations:');
      report.edgeRuntime.recommendations.forEach(rec => console.log(`    - ${rec}`));
    }
    console.log('');

    // WASM
    console.log('🦀 WASM:');
    console.log(`  Status: ${report.wasm.compatible ? '✅ Compatible' : '❌ Issues Found'}`);
    if (report.wasm.issues.length > 0) {
      console.log('  Issues:');
      report.wasm.issues.forEach(issue => console.log(`    - ${issue}`));
    }
    if (report.wasm.recommendations.length > 0) {
      console.log('  Recommendations:');
      report.wasm.recommendations.forEach(rec => console.log(`    - ${rec}`));
    }
    console.log('');

    // Workers
    console.log('👷 Workers:');
    console.log(`  Status: ${report.workers.compatible ? '✅ Compatible' : '❌ Issues Found'}`);
    if (report.workers.issues.length > 0) {
      console.log('  Issues:');
      report.workers.issues.forEach(issue => console.log(`    - ${issue}`));
    }
    if (report.workers.recommendations.length > 0) {
      console.log('  Recommendations:');
      report.workers.recommendations.forEach(rec => console.log(`    - ${rec}`));
    }
    console.log('');

    // Hydrogen/Oxygen
    console.log('🛍️ Hydrogen/Oxygen:');
    console.log(`  Status: ${report.hydrogenOxygen.compatible ? '✅ Compatible' : '❌ Issues Found'}`);
    if (report.hydrogenOxygen.issues.length > 0) {
      console.log('  Issues:');
      report.hydrogenOxygen.issues.forEach(issue => console.log(`    - ${issue}`));
    }
    if (report.hydrogenOxygen.recommendations.length > 0) {
      console.log('  Recommendations:');
      report.hydrogenOxygen.recommendations.forEach(rec => console.log(`    - ${rec}`));
    }
    console.log('');

    // Summary
    console.log('📋 Summary:');
    console.log(`  Edge Runtime: ${report.edgeRuntime.compatible ? '✅' : '❌'}`);
    console.log(`  WASM: ${report.wasm.compatible ? '✅' : '❌'}`);
    console.log(`  Workers: ${report.workers.compatible ? '✅' : '❌'}`);
    console.log(`  Hydrogen/Oxygen: ${report.hydrogenOxygen.compatible ? '✅' : '❌'}`);
  }
}

// Export for use in other modules
export { FutureCheck, type CompatibilityReport };

// CLI execution
if (require.main === module) {
  const checker = new FutureCheck();
  checker.run().catch(console.error);
}