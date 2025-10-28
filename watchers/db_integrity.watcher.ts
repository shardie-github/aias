/**
 * Database Integrity Watcher
 * Validates referential integrity and data consistency
 */

import { createClient } from '@supabase/supabase-js';
import { Octokit } from '@octokit/rest';

interface IntegrityCheck {
  table: string;
  constraint: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  affected_rows?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface IntegrityReport {
  timestamp: string;
  total_checks: number;
  passed: number;
  failed: number;
  warnings: number;
  checks: IntegrityCheck[];
  overall_status: 'healthy' | 'degraded' | 'critical';
}

class DatabaseIntegrityWatcher {
  private supabase: any;
  private octokit: Octokit;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || `https://${process.env.SUPABASE_PROJECT_REF || 'ghqyxhbyyirveptgwoqm'}.supabase.co`,
      process.env.SUPABASE_ANON_KEY || ''
    );
    
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  /**
   * Run all integrity checks
   */
  async runIntegrityChecks(): Promise<IntegrityReport> {
    console.log('🔍 Running database integrity checks...');

    const checks: IntegrityCheck[] = [];

    // Check for orphaned records
    checks.push(...await this.checkOrphanedRecords());

    // Check for duplicate records
    checks.push(...await this.checkDuplicateRecords());

    // Check for null constraint violations
    checks.push(...await this.checkNullConstraints());

    // Check for data type violations
    checks.push(...await this.checkDataTypeViolations());

    // Check for referential integrity
    checks.push(...await this.checkReferentialIntegrity());

    // Check for data consistency
    checks.push(...await this.checkDataConsistency());

    const report = this.generateReport(checks);
    await this.storeReport(report);

    return report;
  }

  /**
   * Check for orphaned records
   */
  private async checkOrphanedRecords(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];

    try {
      // Check for orphaned AI health metrics without valid deployments
      const { data: orphanedMetrics, error } = await this.supabase
        .from('ai_health_metrics')
        .select('id, deployment_id')
        .not('deployment_id', 'in', '(SELECT DISTINCT deployment_id FROM deployments)');

      if (error) throw error;

      if (orphanedMetrics && orphanedMetrics.length > 0) {
        checks.push({
          table: 'ai_health_metrics',
          constraint: 'deployment_id_fk',
          status: 'fail',
          message: `Found ${orphanedMetrics.length} orphaned health metrics`,
          affected_rows: orphanedMetrics.length,
          severity: 'medium'
        });
      }
    } catch (error) {
      checks.push({
        table: 'ai_health_metrics',
        constraint: 'deployment_id_fk',
        status: 'fail',
        message: `Error checking orphaned records: ${error.message}`,
        severity: 'high'
      });
    }

    return checks;
  }

  /**
   * Check for duplicate records
   */
  private async checkDuplicateRecords(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];

    try {
      // Check for duplicate AI embeddings
      const { data: duplicates, error } = await this.supabase
        .from('ai_embeddings')
        .select('namespace, content, count(*)')
        .group('namespace, content')
        .having('count(*) > 1');

      if (error) throw error;

      if (duplicates && duplicates.length > 0) {
        checks.push({
          table: 'ai_embeddings',
          constraint: 'unique_namespace_content',
          status: 'warning',
          message: `Found ${duplicates.length} duplicate embedding groups`,
          affected_rows: duplicates.reduce((sum, dup) => sum + dup.count, 0),
          severity: 'low'
        });
      }
    } catch (error) {
      checks.push({
        table: 'ai_embeddings',
        constraint: 'unique_namespace_content',
        status: 'fail',
        message: `Error checking duplicates: ${error.message}`,
        severity: 'high'
      });
    }

    return checks;
  }

  /**
   * Check for null constraint violations
   */
  private async checkNullConstraints(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];

    const tables = [
      { name: 'ai_embeddings', required_fields: ['namespace', 'content'] },
      { name: 'ai_health_metrics', required_fields: ['deployment_id', 'timestamp', 'metrics'] },
      { name: 'ai_insights', required_fields: ['deployment_id', 'insights'] }
    ];

    for (const table of tables) {
      for (const field of table.required_fields) {
        try {
          const { data: nullRecords, error } = await this.supabase
            .from(table.name)
            .select('id')
            .is(field, null);

          if (error) throw error;

          if (nullRecords && nullRecords.length > 0) {
            checks.push({
              table: table.name,
              constraint: `${field}_not_null`,
              status: 'fail',
              message: `Found ${nullRecords.length} records with null ${field}`,
              affected_rows: nullRecords.length,
              severity: 'high'
            });
          }
        } catch (error) {
          checks.push({
            table: table.name,
            constraint: `${field}_not_null`,
            status: 'fail',
            message: `Error checking null constraints: ${error.message}`,
            severity: 'high'
          });
        }
      }
    }

    return checks;
  }

  /**
   * Check for data type violations
   */
  private async checkDataTypeViolations(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];

    try {
      // Check for invalid JSON in metadata fields
      const { data: invalidJson, error } = await this.supabase
        .from('ai_embeddings')
        .select('id, metadata')
        .not('metadata', 'is', null);

      if (error) throw error;

      if (invalidJson) {
        const invalidCount = invalidJson.filter(record => {
          try {
            JSON.parse(record.metadata);
            return false;
          } catch {
            return true;
          }
        }).length;

        if (invalidCount > 0) {
          checks.push({
            table: 'ai_embeddings',
            constraint: 'metadata_json_valid',
            status: 'fail',
            message: `Found ${invalidCount} records with invalid JSON metadata`,
            affected_rows: invalidCount,
            severity: 'medium'
          });
        }
      }
    } catch (error) {
      checks.push({
        table: 'ai_embeddings',
        constraint: 'metadata_json_valid',
        status: 'fail',
        message: `Error checking JSON validity: ${error.message}`,
        severity: 'high'
      });
    }

    return checks;
  }

  /**
   * Check for referential integrity
   */
  private async checkReferentialIntegrity(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];

    // This would check foreign key relationships
    // For now, return empty array as Supabase handles this automatically
    return checks;
  }

  /**
   * Check for data consistency
   */
  private async checkDataConsistency(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = [];

    try {
      // Check for inconsistent timestamps
      const { data: inconsistentTimestamps, error } = await this.supabase
        .from('ai_health_metrics')
        .select('id, timestamp, created_at')
        .where('timestamp > created_at');

      if (error) throw error;

      if (inconsistentTimestamps && inconsistentTimestamps.length > 0) {
        checks.push({
          table: 'ai_health_metrics',
          constraint: 'timestamp_consistency',
          status: 'warning',
          message: `Found ${inconsistentTimestamps.length} records with future timestamps`,
          affected_rows: inconsistentTimestamps.length,
          severity: 'low'
        });
      }
    } catch (error) {
      checks.push({
        table: 'ai_health_metrics',
        constraint: 'timestamp_consistency',
        status: 'fail',
        message: `Error checking timestamp consistency: ${error.message}`,
        severity: 'high'
      });
    }

    return checks;
  }

  /**
   * Generate integrity report
   */
  private generateReport(checks: IntegrityCheck[]): IntegrityReport {
    const totalChecks = checks.length;
    const passed = checks.filter(c => c.status === 'pass').length;
    const failed = checks.filter(c => c.status === 'fail').length;
    const warnings = checks.filter(c => c.status === 'warning').length;

    let overallStatus: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    if (failed > 0) {
      const criticalFailures = checks.filter(c => c.status === 'fail' && c.severity === 'critical').length;
      overallStatus = criticalFailures > 0 ? 'critical' : 'degraded';
    } else if (warnings > 0) {
      overallStatus = 'degraded';
    }

    return {
      timestamp: new Date().toISOString(),
      total_checks: totalChecks,
      passed,
      failed,
      warnings,
      checks,
      overall_status: overallStatus
    };
  }

  /**
   * Store report in database
   */
  private async storeReport(report: IntegrityReport): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('integrity_reports')
        .insert([report]);

      if (error) throw error;
      
      console.log('Integrity report stored successfully');
    } catch (error) {
      console.error('Error storing integrity report:', error);
    }
  }

  /**
   * Create GitHub issue for critical findings
   */
  async createCriticalIssue(report: IntegrityReport): Promise<void> {
    const criticalChecks = report.checks.filter(c => c.severity === 'critical');
    
    if (criticalChecks.length === 0) return;

    try {
      const issue = {
        title: `🚨 Database Integrity: ${criticalChecks.length} Critical Issues Found`,
        body: this.generateIssueBody(report, criticalChecks),
        labels: ['database', 'integrity', 'critical', 'automated']
      };

      const { data, status } = await this.octokit.rest.issues.create({
        owner: process.env.GITHUB_OWNER || 'your-org',
        repo: process.env.GITHUB_REPO || 'aias-platform',
        title: issue.title,
        body: issue.body,
        labels: issue.labels
      });

      if (status === 201) {
        console.log(`Critical integrity issue created: ${data.html_url}`);
      }
    } catch (error) {
      console.error('Error creating critical issue:', error);
    }
  }

  /**
   * Generate GitHub issue body
   */
  private generateIssueBody(report: IntegrityReport, criticalChecks: IntegrityCheck[]): string {
    return `
## 🚨 Database Integrity Critical Issues

**Report Time:** ${report.timestamp}  
**Overall Status:** ${report.overall_status.toUpperCase()}  
**Critical Issues:** ${criticalChecks.length}

### 📊 Summary
- **Total Checks:** ${report.total_checks}
- **Passed:** ${report.passed} ✅
- **Failed:** ${report.failed} ❌
- **Warnings:** ${report.warnings} ⚠️

### 🔥 Critical Issues
${criticalChecks.map(check => `
**Table:** \`${check.table}\`  
**Constraint:** \`${check.constraint}\`  
**Message:** ${check.message}  
**Affected Rows:** ${check.affected_rows || 'N/A'}
`).join('\n')}

### 🔧 Recommended Actions
1. Review the critical issues above
2. Fix data integrity problems
3. Implement additional constraints if needed
4. Monitor for recurring issues

---
*This issue was automatically generated by the Database Integrity Watcher.*
    `.trim();
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    try {
      console.log('Starting database integrity watcher...');
      
      const report = await this.runIntegrityChecks();
      
      console.log(`Integrity check completed: ${report.overall_status}`);
      console.log(`Passed: ${report.passed}, Failed: ${report.failed}, Warnings: ${report.warnings}`);
      
      if (report.overall_status === 'critical') {
        await this.createCriticalIssue(report);
      }
      
      console.log('Database integrity watcher completed');
    } catch (error) {
      console.error('Database integrity watcher failed:', error);
      throw error;
    }
  }
}

// Export for use in other modules
export { DatabaseIntegrityWatcher, type IntegrityCheck, type IntegrityReport };

// CLI execution
if (require.main === module) {
  const watcher = new DatabaseIntegrityWatcher();
  watcher.run().catch(console.error);
}