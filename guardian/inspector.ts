/**
 * Guardian Inspector Agent
 * Analyzes logs hourly and generates trust reports
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { guardianService, type GuardianEvent, type TrustLedgerEntry } from './core';

export interface TrustReport {
  generated_at: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    total_events: number;
    by_risk_level: Record<string, number>;
    by_data_class: Record<string, number>;
    by_scope: Record<string, number>;
    policy_changes: number;
    anomalies: string[];
  };
  events: Array<{
    event_id: string;
    timestamp: string;
    type: string;
    risk_level: string;
    action_taken: string;
    description: string;
  }>;
  guardian_confidence_score: number;
  violations_prevented: number;
  recommendations: Array<{
    type: 'tighten' | 'loosen' | 'maintain';
    scope: string;
    reason: string;
    impact: string;
  }>;
}

export class GuardianInspector {
  private logsPath: string;
  private reportsPath: string;

  constructor() {
    const guardianDir = join(process.cwd(), 'guardian');
    this.logsPath = join(guardianDir, 'logs');
    this.reportsPath = join(guardianDir, 'reports');
    
    if (!existsSync(this.reportsPath)) {
      require('fs').mkdirSync(this.reportsPath, { recursive: true });
    }
  }

  /**
   * Analyze logs and generate trust report
   */
  async analyzeLogs(): Promise<TrustReport> {
    const events = this.loadEvents();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentEvents = events.filter(
      e => new Date(e.timestamp) >= oneWeekAgo
    );

    // Aggregate statistics
    const byRiskLevel: Record<string, number> = {};
    const byDataClass: Record<string, number> = {};
    const byScope: Record<string, number> = {};
    
    recentEvents.forEach(event => {
      byRiskLevel[event.risk_level] = (byRiskLevel[event.risk_level] || 0) + 1;
      byDataClass[event.data_class] = (byDataClass[event.data_class] || 0) + 1;
      byScope[event.scope] = (byScope[event.scope] || 0) + 1;
    });

    // Detect anomalies
    const anomalies = this.detectAnomalies(recentEvents);

    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(recentEvents);

    // Count violations prevented
    const violationsPrevented = recentEvents.filter(
      e => e.action_taken === 'block' || e.action_taken === 'mask'
    ).length;

    // Generate recommendations
    const recommendations = this.generateRecommendations(recentEvents);

    const report: TrustReport = {
      generated_at: now.toISOString(),
      period: {
        start: oneWeekAgo.toISOString(),
        end: now.toISOString(),
      },
      summary: {
        total_events: recentEvents.length,
        by_risk_level: byRiskLevel,
        by_data_class: byDataClass,
        by_scope: byScope,
        policy_changes: 0, // TODO: Track policy changes
        anomalies,
      },
      events: recentEvents.slice(0, 50).map(e => ({
        event_id: e.event_id,
        timestamp: e.timestamp,
        type: e.type,
        risk_level: e.risk_level,
        action_taken: e.action_taken,
        description: e.description,
      })),
      guardian_confidence_score: confidenceScore,
      violations_prevented: violationsPrevented,
      recommendations,
    };

    // Save report
    const reportPath = join(this.reportsPath, `trust_report_${now.toISOString().split('T')[0]}.json`);
    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

    return report;
  }

  /**
   * Load all events from log files
   */
  private loadEvents(): GuardianEvent[] {
    const events: GuardianEvent[] = [];
    
    if (!existsSync(this.logsPath)) return events;

    const files = readdirSync(this.logsPath).filter(f => f.endsWith('.jsonl'));
    
    files.forEach(file => {
      const filePath = join(this.logsPath, file);
      const lines = readFileSync(filePath, 'utf-8').trim().split('\n');
      
      lines.forEach(line => {
        if (line.trim()) {
          try {
            events.push(JSON.parse(line) as GuardianEvent);
          } catch (error) {
            console.warn(`Failed to parse event in ${file}:`, error);
          }
        }
      });
    });

    return events.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Detect anomalies in event patterns
   */
  private detectAnomalies(events: GuardianEvent[]): string[] {
    const anomalies: string[] = [];

    // Check for spike in high-risk events
    const highRiskEvents = events.filter(e => 
      e.risk_level === 'high' || e.risk_level === 'critical'
    );
    
    if (highRiskEvents.length > events.length * 0.2) {
      anomalies.push(`High concentration of high-risk events: ${highRiskEvents.length}/${events.length}`);
    }

    // Check for unusual external API calls
    const externalCalls = events.filter(e => 
      e.scope === 'external' && e.type === 'api_call'
    );
    
    if (externalCalls.length > 10) {
      anomalies.push(`Unusual number of external API calls: ${externalCalls.length}`);
    }

    // Check for credential access
    const credentialEvents = events.filter(e => e.data_class === 'credentials');
    if (credentialEvents.length > 0) {
      anomalies.push(`Credential access detected: ${credentialEvents.length} events`);
    }

    // Check for blocked events
    const blockedEvents = events.filter(e => e.action_taken === 'block');
    if (blockedEvents.length > 5) {
      anomalies.push(`Multiple blocked events: ${blockedEvents.length}`);
    }

    return anomalies;
  }

  /**
   * Calculate guardian confidence score
   */
  private calculateConfidenceScore(events: GuardianEvent[]): number {
    if (events.length === 0) return 1.0;

    let safeOperations = 0;
    
    events.forEach(event => {
      // Safe if low/medium risk and allowed
      if (
        (event.risk_level === 'low' || event.risk_level === 'medium') &&
        event.action_taken === 'allow'
      ) {
        safeOperations++;
      }
    });

    return safeOperations / events.length;
  }

  /**
   * Generate adaptive recommendations
   */
  private generateRecommendations(events: GuardianEvent[]): Array<{
    type: 'tighten' | 'loosen' | 'maintain';
    scope: string;
    reason: string;
    impact: string;
  }> {
    const recommendations: Array<{
      type: 'tighten' | 'loosen' | 'maintain';
      scope: string;
      reason: string;
      impact: string;
    }> = [];

    // Analyze blocking patterns
    const blockedEvents = events.filter(e => e.action_taken === 'block');
    if (blockedEvents.length > 5) {
      recommendations.push({
        type: 'tighten',
        scope: 'external',
        reason: `High number of blocked events (${blockedEvents.length})`,
        impact: 'May reduce false positives',
      });
    }

    // Analyze external API usage
    const externalEvents = events.filter(e => e.scope === 'external');
    if (externalEvents.length > events.length * 0.3) {
      recommendations.push({
        type: 'tighten',
        scope: 'external',
        reason: `High percentage of external data access (${Math.round(externalEvents.length / events.length * 100)}%)`,
        impact: 'Increased privacy protection',
      });
    }

    // Analyze all-low-risk patterns
    const allLowRisk = events.every(e => e.risk_level === 'low');
    if (allLowRisk && events.length > 20) {
      recommendations.push({
        type: 'maintain',
        scope: 'all',
        reason: 'Consistent low-risk pattern detected',
        impact: 'Current settings are appropriate',
      });
    }

    return recommendations;
  }

  /**
   * Generate weekly markdown report
   */
  async generateWeeklyReport(): Promise<string> {
    const report = await this.analyzeLogs();
    
    const markdown = `# Guardian Weekly Trust Report

Generated: ${report.generated_at}
Period: ${report.period.start} to ${report.period.end}

## Summary

- **Total Events**: ${report.summary.total_events}
- **Guardian Confidence Score**: ${(report.guardian_confidence_score * 100).toFixed(1)}%
- **Violations Prevented**: ${report.violations_prevented}

## Events by Risk Level

${Object.entries(report.summary.by_risk_level)
  .map(([level, count]) => `- **${level}**: ${count}`)
  .join('\n')}

## Events by Data Class

${Object.entries(report.summary.by_data_class)
  .map(([cls, count]) => `- **${cls}**: ${count}`)
  .join('\n')}

## Events by Scope

${Object.entries(report.summary.by_scope)
  .map(([scope, count]) => `- **${scope}**: ${count}`)
  .join('\n')}

## Anomalies Detected

${report.summary.anomalies.length > 0
  ? report.summary.anomalies.map(a => `- ${a}`).join('\n')
  : '- No anomalies detected'}

## Recommendations

${report.recommendations.length > 0
  ? report.recommendations.map(r => `### ${r.type.toUpperCase()}: ${r.scope}
  - **Reason**: ${r.reason}
  - **Impact**: ${r.impact}`).join('\n\n')
  : '- No recommendations at this time'}

## Recent Events

${report.events.slice(0, 10).map(e => `- **${e.timestamp}** [${e.risk_level}] ${e.type}: ${e.description} (${e.action_taken})`).join('\n')}

---

*This report is generated automatically by the Guardian system.*
`;

    const reportPath = join(this.reportsPath, `weekly_${report.generated_at.split('T')[0]}.md`);
    writeFileSync(reportPath, markdown, 'utf-8');

    return markdown;
  }

  /**
   * Run hourly analysis (call this from a scheduler)
   */
  async runHourlyAnalysis(): Promise<void> {
    console.log('[GUARDIAN INSPECTOR] Running hourly analysis...');
    const report = await this.analyzeLogs();
    console.log(`[GUARDIAN INSPECTOR] Analysis complete: ${report.summary.total_events} events, ${(report.guardian_confidence_score * 100).toFixed(1)}% confidence`);
  }
}

export const guardianInspector = new GuardianInspector();
