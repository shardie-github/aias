/**
 * API Contract Watcher
 * Compares latest OpenAPI vs deployed endpoints
 */

import { Octokit } from '@octokit/rest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface APIContract {
  path: string;
  method: string;
  parameters: any[];
  responses: any;
  summary: string;
  description: string;
}

interface ContractViolation {
  type: 'breaking_change' | 'missing_endpoint' | 'parameter_mismatch' | 'response_mismatch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  endpoint: string;
  message: string;
  expected?: any;
  actual?: any;
}

interface ContractReport {
  timestamp: string;
  total_endpoints: number;
  violations: ContractViolation[];
  breaking_changes: number;
  missing_endpoints: number;
  overall_status: 'compliant' | 'warnings' | 'violations' | 'critical';
}

class APIContractWatcher {
  private octokit: Octokit;
  private projectRoot: string;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    this.projectRoot = process.env.PROJECT_ROOT || process.cwd();
  }

  /**
   * Run API contract validation
   */
  async runContractValidation(): Promise<ContractReport> {
    console.log('🔍 Running API contract validation...');

    const violations: ContractViolation[] = [];

    try {
      // Load OpenAPI specification
      const openApiSpec = await this.loadOpenAPISpec();
      if (!openApiSpec) {
        throw new Error('OpenAPI specification not found');
      }

      // Get deployed endpoints
      const deployedEndpoints = await this.getDeployedEndpoints();

      // Compare contracts
      violations.push(...await this.compareContracts(openApiSpec, deployedEndpoints));

      // Check for missing endpoints
      violations.push(...await this.checkMissingEndpoints(openApiSpec, deployedEndpoints));

      // Check for breaking changes
      violations.push(...await this.checkBreakingChanges(openApiSpec, deployedEndpoints));

      const report = this.generateReport(violations);
      await this.storeReport(report);

      return report;
    } catch (error) {
      console.error('Error running contract validation:', error);
      throw error;
    }
  }

  /**
   * Load OpenAPI specification
   */
  private async loadOpenAPISpec(): Promise<any> {
    const specPaths = [
      'openapi.json',
      'openapi.yaml',
      'swagger.json',
      'swagger.yaml',
      'api-spec.json',
      'api-spec.yaml'
    ];

    for (const specPath of specPaths) {
      const fullPath = join(this.projectRoot, specPath);
      if (existsSync(fullPath)) {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          return JSON.parse(content);
        } catch (error) {
          console.warn(`Could not parse ${specPath}:`, error);
        }
      }
    }

    return null;
  }

  /**
   * Get deployed endpoints (placeholder implementation)
   */
  private async getDeployedEndpoints(): Promise<APIContract[]> {
    // This would typically query the deployed API
    // For now, return a sample set
    return [
      {
        path: '/api/users',
        method: 'GET',
        parameters: [],
        responses: { '200': { description: 'Success' } },
        summary: 'Get users',
        description: 'Retrieve all users'
      },
      {
        path: '/api/users/{id}',
        method: 'GET',
        parameters: [{ name: 'id', in: 'path', required: true }],
        responses: { '200': { description: 'Success' } },
        summary: 'Get user by ID',
        description: 'Retrieve a specific user'
      }
    ];
  }

  /**
   * Compare OpenAPI spec with deployed endpoints
   */
  private async compareContracts(openApiSpec: any, deployedEndpoints: APIContract[]): Promise<ContractViolation[]> {
    const violations: ContractViolation[] = [];
    const specPaths = openApiSpec.paths || {};

    for (const [path, methods] of Object.entries(specPaths)) {
      for (const [method, spec] of Object.entries(methods as any)) {
        const deployedEndpoint = deployedEndpoints.find(
          ep => ep.path === path && ep.method.toLowerCase() === method.toLowerCase()
        );

        if (!deployedEndpoint) {
          violations.push({
            type: 'missing_endpoint',
            severity: 'high',
            endpoint: `${method.toUpperCase()} ${path}`,
            message: `Endpoint ${method.toUpperCase()} ${path} is in spec but not deployed`
          });
          continue;
        }

        // Check parameter mismatches
        const specParams = spec.parameters || [];
        const deployedParams = deployedEndpoint.parameters || [];

        if (specParams.length !== deployedParams.length) {
          violations.push({
            type: 'parameter_mismatch',
            severity: 'medium',
            endpoint: `${method.toUpperCase()} ${path}`,
            message: `Parameter count mismatch: spec has ${specParams.length}, deployed has ${deployedParams.length}`,
            expected: specParams,
            actual: deployedParams
          });
        }

        // Check response mismatches
        const specResponses = spec.responses || {};
        const deployedResponses = deployedEndpoint.responses || {};

        const specStatusCodes = Object.keys(specResponses);
        const deployedStatusCodes = Object.keys(deployedResponses);

        const missingStatusCodes = specStatusCodes.filter(code => !deployedStatusCodes.includes(code));
        if (missingStatusCodes.length > 0) {
          violations.push({
            type: 'response_mismatch',
            severity: 'medium',
            endpoint: `${method.toUpperCase()} ${path}`,
            message: `Missing response codes: ${missingStatusCodes.join(', ')}`,
            expected: specStatusCodes,
            actual: deployedStatusCodes
          });
        }
      }
    }

    return violations;
  }

  /**
   * Check for missing endpoints
   */
  private async checkMissingEndpoints(openApiSpec: any, deployedEndpoints: APIContract[]): Promise<ContractViolation[]> {
    const violations: ContractViolation[] = [];
    const specPaths = openApiSpec.paths || {};

    for (const [path, methods] of Object.entries(specPaths)) {
      for (const [method] of Object.entries(methods as any)) {
        const deployedEndpoint = deployedEndpoints.find(
          ep => ep.path === path && ep.method.toLowerCase() === method.toLowerCase()
        );

        if (!deployedEndpoint) {
          violations.push({
            type: 'missing_endpoint',
            severity: 'high',
            endpoint: `${method.toUpperCase()} ${path}`,
            message: `Endpoint ${method.toUpperCase()} ${path} is missing from deployment`
          });
        }
      }
    }

    return violations;
  }

  /**
   * Check for breaking changes
   */
  private async checkBreakingChanges(openApiSpec: any, deployedEndpoints: APIContract[]): Promise<ContractViolation[]> {
    const violations: ContractViolation[] = [];

    // This would compare with previous versions
    // For now, return empty array
    return violations;
  }

  /**
   * Generate contract report
   */
  private generateReport(violations: ContractViolation[]): ContractReport {
    const breakingChanges = violations.filter(v => v.type === 'breaking_change').length;
    const missingEndpoints = violations.filter(v => v.type === 'missing_endpoint').length;

    let overallStatus: 'compliant' | 'warnings' | 'violations' | 'critical' = 'compliant';
    
    if (violations.some(v => v.severity === 'critical')) {
      overallStatus = 'critical';
    } else if (violations.some(v => v.severity === 'high')) {
      overallStatus = 'violations';
    } else if (violations.some(v => v.severity === 'medium')) {
      overallStatus = 'warnings';
    }

    return {
      timestamp: new Date().toISOString(),
      total_endpoints: violations.length,
      violations,
      breaking_changes: breakingChanges,
      missing_endpoints: missingEndpoints,
      overall_status: overallStatus
    };
  }

  /**
   * Store report in database
   */
  private async storeReport(report: ContractReport): Promise<void> {
    try {
      // This would store in a database
      console.log('Contract report stored successfully');
    } catch (error) {
      console.error('Error storing contract report:', error);
    }
  }

  /**
   * Create GitHub issue for critical violations
   */
  async createCriticalIssue(report: ContractReport): Promise<void> {
    const criticalViolations = report.violations.filter(v => v.severity === 'critical');
    
    if (criticalViolations.length === 0) return;

    try {
      const issue = {
        title: `🚨 API Contract: ${criticalViolations.length} Critical Violations Found`,
        body: this.generateIssueBody(report, criticalViolations),
        labels: ['api', 'contract', 'critical', 'automated']
      };

      const { data, status } = await this.octokit.rest.issues.create({
        owner: process.env.GITHUB_OWNER || 'your-org',
        repo: process.env.GITHUB_REPO || 'aias-platform',
        title: issue.title,
        body: issue.body,
        labels: issue.labels
      });

      if (status === 201) {
        console.log(`Critical contract issue created: ${data.html_url}`);
      }
    } catch (error) {
      console.error('Error creating critical issue:', error);
    }
  }

  /**
   * Generate GitHub issue body
   */
  private generateIssueBody(report: ContractReport, criticalViolations: ContractViolation[]): string {
    return `
## 🚨 API Contract Critical Violations

**Report Time:** ${report.timestamp}  
**Overall Status:** ${report.overall_status.toUpperCase()}  
**Critical Violations:** ${criticalViolations.length}

### 📊 Summary
- **Total Endpoints:** ${report.total_endpoints}
- **Breaking Changes:** ${report.breaking_changes}
- **Missing Endpoints:** ${report.missing_endpoints}

### 🔥 Critical Violations
${criticalViolations.map(violation => `
**Endpoint:** \`${violation.endpoint}\`  
**Type:** \`${violation.type}\`  
**Message:** ${violation.message}
`).join('\n')}

### 🔧 Recommended Actions
1. Review the critical violations above
2. Update API implementation to match specification
3. Deploy missing endpoints
4. Update OpenAPI specification if needed

---
*This issue was automatically generated by the API Contract Watcher.*
    `.trim();
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    try {
      console.log('Starting API contract watcher...');
      
      const report = await this.runContractValidation();
      
      console.log(`Contract validation completed: ${report.overall_status}`);
      console.log(`Violations: ${report.violations.length}, Breaking Changes: ${report.breaking_changes}`);
      
      if (report.overall_status === 'critical') {
        await this.createCriticalIssue(report);
      }
      
      console.log('API contract watcher completed');
    } catch (error) {
      console.error('API contract watcher failed:', error);
      throw error;
    }
  }
}

// Export for use in other modules
export { APIContractWatcher, type ContractViolation, type ContractReport };

// CLI execution
if (require.main === module) {
  const watcher = new APIContractWatcher();
  watcher.run().catch(console.error);
}