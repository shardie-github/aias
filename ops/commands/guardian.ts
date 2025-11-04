/**
 * Guardian CLI Commands
 * ops guardian:verify, ops guardian:audit, etc.
 */

import { guardianService } from '../../guardian/core';
import { guardianInspector } from '../../guardian/inspector';
import { trustFabricAI } from '../../guardian/recommendations';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function verify(options: { verbose?: boolean }): Promise<number> {
  console.log('🔍 Verifying Guardian ledger integrity...\n');

  const result = guardianService.verifyLedgerIntegrity();

  if (result.valid) {
    console.log('✅ Ledger integrity verified - all hashes are valid');
    return 0;
  } else {
    console.error('❌ Ledger integrity check failed:');
    result.errors.forEach(error => {
      console.error(`   - ${error}`);
    });
    return 1;
  }
}

export async function audit(options: { 
  fix?: boolean;
  report?: boolean;
  verbose?: boolean;
}): Promise<number> {
  console.log('🔍 Running Guardian audit...\n');

  const issues: string[] = [];

  // Check ledger integrity
  const integrityCheck = guardianService.verifyLedgerIntegrity();
  if (!integrityCheck.valid) {
    issues.push('Ledger integrity check failed');
    integrityCheck.errors.forEach(e => issues.push(`  - ${e}`));
  }

  // Check for unclassified events
  const ledgerEvents = guardianService.getLedgerEvents(1000);
  const unclassified = ledgerEvents.filter(e => !e.type || !e.scope);
  if (unclassified.length > 0) {
    issues.push(`Found ${unclassified.length} unclassified events`);
  }

  // Check policy files
  const policyPath = join(process.cwd(), 'guardian', 'policies', 'default.yaml');
  if (!existsSync(policyPath)) {
    issues.push('Default policy file not found');
  }

  // Check RLS policies (would need Supabase connection)
  // For now, just warn
  if (options.verbose) {
    console.log('⚠️  RLS policy check skipped (requires Supabase connection)');
  }

  // Generate report if requested
  if (options.report) {
    const report = await guardianInspector.analyzeLogs();
    const reportPath = join(process.cwd(), 'guardian', 'reports', `audit_${new Date().toISOString().split('T')[0]}.json`);
    require('fs').writeFileSync(
      reportPath,
      JSON.stringify({
        audit_date: new Date().toISOString(),
        issues,
        report,
      }, null, 2),
      'utf-8'
    );
    console.log(`\n📄 Audit report saved to: ${reportPath}`);
  }

  if (issues.length === 0) {
    console.log('✅ Audit passed - no issues found');
    return 0;
  } else {
    console.error(`\n❌ Audit failed with ${issues.length} issue(s):`);
    issues.forEach(issue => console.error(`   - ${issue}`));
    return 1;
  }
}

export async function report(options: {
  weekly?: boolean;
  format?: 'json' | 'markdown';
}): Promise<number> {
  console.log('📊 Generating Guardian report...\n');

  if (options.weekly) {
    const markdown = await guardianInspector.generateWeeklyReport();
    console.log(markdown);
  } else {
    const report = await guardianInspector.analyzeLogs();
    if (options.format === 'markdown') {
      // Convert to markdown
      const md = `# Guardian Trust Report

Generated: ${report.generated_at}

## Summary
- Total Events: ${report.summary.total_events}
- Confidence Score: ${(report.guardian_confidence_score * 100).toFixed(1)}%
- Violations Prevented: ${report.violations_prevented}

## Risk Distribution
${Object.entries(report.summary.by_risk_level).map(([level, count]) => `- ${level}: ${count}`).join('\n')}

## Data Classes
${Object.entries(report.summary.by_data_class).map(([cls, count]) => `- ${cls}: ${count}`).join('\n')}

## Recommendations
${report.recommendations.map(r => `- ${r.type}: ${r.reason}`).join('\n')}
`;
      console.log(md);
    } else {
      console.log(JSON.stringify(report, null, 2));
    }
  }

  return 0;
}

export async function exportFabric(options: {
  output?: string;
}): Promise<number> {
  console.log('📦 Exporting Trust Fabric model...\n');

  const model = trustFabricAI.exportModel();
  const outputPath = options.output || join(process.cwd(), 'guardian', 'trust_fabric_export.json');

  require('fs').writeFileSync(
    outputPath,
    JSON.stringify(model, null, 2),
    'utf-8'
  );

  console.log(`✅ Trust Fabric model exported to: ${outputPath}`);
  return 0;
}

export async function importFabric(options: {
  file: string;
}): Promise<number> {
  console.log('📥 Importing Trust Fabric model...\n');

  if (!existsSync(options.file)) {
    console.error(`❌ File not found: ${options.file}`);
    return 1;
  }

  try {
    const model = JSON.parse(readFileSync(options.file, 'utf-8'));
    trustFabricAI.importModel(model);
    console.log('✅ Trust Fabric model imported successfully');
    return 0;
  } catch (error) {
    console.error(`❌ Failed to import model: ${error}`);
    return 1;
  }
}

export async function status(): Promise<number> {
  console.log('📊 Guardian Status\n');

  const ledgerEvents = guardianService.getLedgerEvents(10);
  const privateMode = guardianService.isPrivateMode();

  console.log(`Private Mode: ${privateMode ? '🔒 Enabled' : '🔓 Disabled'}`);
  console.log(`Recent Events: ${ledgerEvents.length}`);
  console.log(`\nLast 5 Events:`);
  ledgerEvents.slice(0, 5).forEach(event => {
    console.log(`  - [${event.timestamp}] ${event.type} (${event.scope}) - ${event.guardian_action}`);
  });

  const integrity = guardianService.verifyLedgerIntegrity();
  console.log(`\nLedger Integrity: ${integrity.valid ? '✅ Valid' : '❌ Invalid'}`);

  return 0;
}
