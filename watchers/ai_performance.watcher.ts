/**
 * AI Performance Watcher
 * Tracks token usage, latency, and accuracy per model
 */

import { createClient } from '@supabase/supabase-js';
import { Octokit } from '@octokit/rest';

interface AIPerformanceMetrics {
  model: string;
  timestamp: string;
  tokens_used: number;
  tokens_input: number;
  tokens_output: number;
  latency_ms: number;
  cost_usd: number;
  accuracy_score?: number;
  error_rate: number;
  requests_count: number;
}

interface PerformanceAnomaly {
  type: 'high_latency' | 'high_cost' | 'low_accuracy' | 'high_error_rate' | 'token_spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  model: string;
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: string;
}

interface PerformanceReport {
  timestamp: string;
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  average_latency: number;
  anomalies: PerformanceAnomaly[];
  model_performance: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
    latency: number;
    accuracy: number;
    error_rate: number;
  }>;
  overall_status: 'healthy' | 'degraded' | 'critical';
}

class AIPerformanceWatcher {
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
   * Run AI performance analysis
   */
  async runPerformanceAnalysis(): Promise<PerformanceReport> {
    console.log('🔍 Running AI performance analysis...');

    try {
      // Collect performance metrics
      const metrics = await this.collectPerformanceMetrics();
      
      // Detect anomalies
      const anomalies = await this.detectAnomalies(metrics);
      
      // Generate performance report
      const report = this.generateReport(metrics, anomalies);
      
      // Store report
      await this.storeReport(report);
      
      return report;
    } catch (error) {
      console.error('Error running performance analysis:', error);
      throw error;
    }
  }

  /**
   * Collect performance metrics from database
   */
  private async collectPerformanceMetrics(): Promise<AIPerformanceMetrics[]> {
    try {
      const { data: metrics, error } = await this.supabase
        .from('ai_performance_logs')
        .select('*')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return metrics || [];
    } catch (error) {
      console.warn('Could not collect performance metrics:', error);
      return [];
    }
  }

  /**
   * Detect performance anomalies
   */
  private async detectAnomalies(metrics: AIPerformanceMetrics[]): Promise<PerformanceAnomaly[]> {
    const anomalies: PerformanceAnomaly[] = [];

    if (metrics.length === 0) return anomalies;

    // Group metrics by model
    const modelMetrics = this.groupMetricsByModel(metrics);

    for (const [model, modelData] of Object.entries(modelMetrics)) {
      // Check for high latency
      const avgLatency = this.calculateAverage(modelData.map(m => m.latency_ms));
      if (avgLatency > 5000) { // 5 seconds threshold
        anomalies.push({
          type: 'high_latency',
          severity: avgLatency > 10000 ? 'critical' : 'high',
          model,
          metric: 'latency_ms',
          value: avgLatency,
          threshold: 5000,
          message: `High latency detected: ${avgLatency.toFixed(2)}ms`,
          timestamp: new Date().toISOString()
        });
      }

      // Check for high cost
      const totalCost = modelData.reduce((sum, m) => sum + m.cost_usd, 0);
      const costPerRequest = totalCost / modelData.length;
      if (costPerRequest > 0.01) { // $0.01 per request threshold
        anomalies.push({
          type: 'high_cost',
          severity: costPerRequest > 0.05 ? 'critical' : 'high',
          model,
          metric: 'cost_per_request',
          value: costPerRequest,
          threshold: 0.01,
          message: `High cost per request: $${costPerRequest.toFixed(4)}`,
          timestamp: new Date().toISOString()
        });
      }

      // Check for low accuracy
      const accuracyScores = modelData.filter(m => m.accuracy_score !== undefined).map(m => m.accuracy_score!);
      if (accuracyScores.length > 0) {
        const avgAccuracy = this.calculateAverage(accuracyScores);
        if (avgAccuracy < 0.8) { // 80% accuracy threshold
          anomalies.push({
            type: 'low_accuracy',
            severity: avgAccuracy < 0.6 ? 'critical' : 'high',
            model,
            metric: 'accuracy_score',
            value: avgAccuracy,
            threshold: 0.8,
            message: `Low accuracy detected: ${(avgAccuracy * 100).toFixed(2)}%`,
            timestamp: new Date().toISOString()
          });
        }
      }

      // Check for high error rate
      const avgErrorRate = this.calculateAverage(modelData.map(m => m.error_rate));
      if (avgErrorRate > 0.05) { // 5% error rate threshold
        anomalies.push({
          type: 'high_error_rate',
          severity: avgErrorRate > 0.1 ? 'critical' : 'high',
          model,
          metric: 'error_rate',
          value: avgErrorRate,
          threshold: 0.05,
          message: `High error rate detected: ${(avgErrorRate * 100).toFixed(2)}%`,
          timestamp: new Date().toISOString()
        });
      }

      // Check for token usage spikes
      const tokenUsage = modelData.map(m => m.tokens_used);
      const avgTokens = this.calculateAverage(tokenUsage);
      const maxTokens = Math.max(...tokenUsage);
      if (maxTokens > avgTokens * 3) { // 3x average threshold
        anomalies.push({
          type: 'token_spike',
          severity: 'medium',
          model,
          metric: 'tokens_used',
          value: maxTokens,
          threshold: avgTokens * 3,
          message: `Token usage spike detected: ${maxTokens} tokens (avg: ${avgTokens.toFixed(2)})`,
          timestamp: new Date().toISOString()
        });
      }
    }

    return anomalies;
  }

  /**
   * Group metrics by model
   */
  private groupMetricsByModel(metrics: AIPerformanceMetrics[]): Record<string, AIPerformanceMetrics[]> {
    return metrics.reduce((groups, metric) => {
      if (!groups[metric.model]) {
        groups[metric.model] = [];
      }
      groups[metric.model].push(metric);
      return groups;
    }, {} as Record<string, AIPerformanceMetrics[]>);
  }

  /**
   * Calculate average of array
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Generate performance report
   */
  private generateReport(metrics: AIPerformanceMetrics[], anomalies: PerformanceAnomaly[]): PerformanceReport {
    const totalRequests = metrics.reduce((sum, m) => sum + m.requests_count, 0);
    const totalTokens = metrics.reduce((sum, m) => sum + m.tokens_used, 0);
    const totalCost = metrics.reduce((sum, m) => sum + m.cost_usd, 0);
    const averageLatency = this.calculateAverage(metrics.map(m => m.latency_ms));

    const modelPerformance: Record<string, any> = {};
    const modelGroups = this.groupMetricsByModel(metrics);

    for (const [model, modelData] of Object.entries(modelGroups)) {
      modelPerformance[model] = {
        requests: modelData.reduce((sum, m) => sum + m.requests_count, 0),
        tokens: modelData.reduce((sum, m) => sum + m.tokens_used, 0),
        cost: modelData.reduce((sum, m) => sum + m.cost_usd, 0),
        latency: this.calculateAverage(modelData.map(m => m.latency_ms)),
        accuracy: this.calculateAverage(modelData.filter(m => m.accuracy_score !== undefined).map(m => m.accuracy_score!)),
        error_rate: this.calculateAverage(modelData.map(m => m.error_rate))
      };
    }

    let overallStatus: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    if (anomalies.some(a => a.severity === 'critical')) {
      overallStatus = 'critical';
    } else if (anomalies.some(a => a.severity === 'high')) {
      overallStatus = 'degraded';
    }

    return {
      timestamp: new Date().toISOString(),
      total_requests: totalRequests,
      total_tokens: totalTokens,
      total_cost: totalCost,
      average_latency: averageLatency,
      anomalies,
      model_performance: modelPerformance,
      overall_status: overallStatus
    };
  }

  /**
   * Store report in database
   */
  private async storeReport(report: PerformanceReport): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('ai_performance_reports')
        .insert([report]);

      if (error) throw error;
      
      console.log('Performance report stored successfully');
    } catch (error) {
      console.error('Error storing performance report:', error);
    }
  }

  /**
   * Create GitHub issue for critical anomalies
   */
  async createCriticalIssue(report: PerformanceReport): Promise<void> {
    const criticalAnomalies = report.anomalies.filter(a => a.severity === 'critical');
    
    if (criticalAnomalies.length === 0) return;

    try {
      const issue = {
        title: `🚨 AI Performance: ${criticalAnomalies.length} Critical Anomalies Found`,
        body: this.generateIssueBody(report, criticalAnomalies),
        labels: ['ai', 'performance', 'critical', 'automated']
      };

      const { data, status } = await this.octokit.rest.issues.create({
        owner: process.env.GITHUB_OWNER || 'your-org',
        repo: process.env.GITHUB_REPO || 'aias-platform',
        title: issue.title,
        body: issue.body,
        labels: issue.labels
      });

      if (status === 201) {
        console.log(`Critical performance issue created: ${data.html_url}`);
      }
    } catch (error) {
      console.error('Error creating critical issue:', error);
    }
  }

  /**
   * Generate GitHub issue body
   */
  private generateIssueBody(report: PerformanceReport, criticalAnomalies: PerformanceAnomaly[]): string {
    return `
## 🚨 AI Performance Critical Anomalies

**Report Time:** ${report.timestamp}  
**Overall Status:** ${report.overall_status.toUpperCase()}  
**Critical Anomalies:** ${criticalAnomalies.length}

### 📊 Performance Summary
- **Total Requests:** ${report.total_requests}
- **Total Tokens:** ${report.total_tokens.toLocaleString()}
- **Total Cost:** $${report.total_cost.toFixed(4)}
- **Average Latency:** ${report.average_latency.toFixed(2)}ms

### 🔥 Critical Anomalies
${criticalAnomalies.map(anomaly => `
**Model:** \`${anomaly.model}\`  
**Type:** \`${anomaly.type}\`  
**Metric:** \`${anomaly.metric}\`  
**Value:** ${anomaly.value} (threshold: ${anomaly.threshold})  
**Message:** ${anomaly.message}
`).join('\n')}

### 📈 Model Performance
${Object.entries(report.model_performance).map(([model, perf]) => `
**${model}:**
- Requests: ${perf.requests}
- Tokens: ${perf.tokens.toLocaleString()}
- Cost: $${perf.cost.toFixed(4)}
- Latency: ${perf.latency.toFixed(2)}ms
- Accuracy: ${(perf.accuracy * 100).toFixed(2)}%
- Error Rate: ${(perf.error_rate * 100).toFixed(2)}%
`).join('\n')}

### 🔧 Recommended Actions
1. Review the critical anomalies above
2. Investigate performance bottlenecks
3. Consider model optimization or switching
4. Implement performance monitoring alerts

---
*This issue was automatically generated by the AI Performance Watcher.*
    `.trim();
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    try {
      console.log('Starting AI performance watcher...');
      
      const report = await this.runPerformanceAnalysis();
      
      console.log(`Performance analysis completed: ${report.overall_status}`);
      console.log(`Anomalies: ${report.anomalies.length}, Critical: ${report.anomalies.filter(a => a.severity === 'critical').length}`);
      
      if (report.overall_status === 'critical') {
        await this.createCriticalIssue(report);
      }
      
      console.log('AI performance watcher completed');
    } catch (error) {
      console.error('AI performance watcher failed:', error);
      throw error;
    }
  }
}

// Export for use in other modules
export { AIPerformanceWatcher, type PerformanceAnomaly, type PerformanceReport };

// CLI execution
if (require.main === module) {
  const watcher = new AIPerformanceWatcher();
  watcher.run().catch(console.error);
}