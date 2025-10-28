/**
 * AI Self-Diagnosis System
 * Monitors CI logs, error frequency, cold starts, and latency p95
 * Emits JSON summaries to Supabase table ai_health_metrics
 */

import { createClient } from '@supabase/supabase-js';
import { Octokit } from '@octokit/rest';
import { performance } from 'perf_hooks';

interface HealthMetrics {
  id?: string;
  timestamp: string;
  deployment_id: string;
  environment: 'staging' | 'production' | 'development';
  metrics: {
    error_rate: number;
    latency_p95: number;
    cold_starts: number;
    memory_usage: number;
    cpu_usage: number;
    response_time_avg: number;
    throughput: number;
  };
  patterns: {
    error_spike: boolean;
    performance_degradation: boolean;
    memory_leak_suspected: boolean;
    cold_start_spike: boolean;
  };
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at?: string;
}

interface GitHubIssue {
  title: string;
  body: string;
  labels: string[];
}

class AISelfDiagnose {
  private supabase: any;
  private octokit: Octokit;
  private projectRef: string;

  constructor() {
    this.projectRef = process.env.SUPABASE_PROJECT_REF || 'ghqyxhbyyirveptgwoqm';
    this.supabase = createClient(
      process.env.SUPABASE_URL || `https://${this.projectRef}.supabase.co`,
      process.env.SUPABASE_ANON_KEY || ''
    );
    
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  /**
   * Collect metrics from various sources
   */
  async collectMetrics(): Promise<Partial<HealthMetrics>> {
    const startTime = performance.now();
    
    try {
      // Collect metrics from different sources
      const [errorMetrics, performanceMetrics, resourceMetrics] = await Promise.all([
        this.collectErrorMetrics(),
        this.collectPerformanceMetrics(),
        this.collectResourceMetrics()
      ]);

      const latency_p95 = performanceMetrics.latency_p95;
      const error_rate = errorMetrics.error_rate;
      const cold_starts = performanceMetrics.cold_starts;
      const memory_usage = resourceMetrics.memory_usage;
      const cpu_usage = resourceMetrics.cpu_usage;

      // Detect patterns
      const patterns = this.detectPatterns({
        error_rate,
        latency_p95,
        cold_starts,
        memory_usage,
        cpu_usage
      });

      // Generate recommendations
      const recommendations = this.generateRecommendations(patterns, {
        error_rate,
        latency_p95,
        cold_starts,
        memory_usage,
        cpu_usage
      });

      // Determine severity
      const severity = this.calculateSeverity(patterns, error_rate, latency_p95);

      const metrics: Partial<HealthMetrics> = {
        timestamp: new Date().toISOString(),
        deployment_id: process.env.VERCEL_DEPLOYMENT_ID || 'local',
        environment: (process.env.NODE_ENV as any) || 'development',
        metrics: {
          error_rate,
          latency_p95,
          cold_starts,
          memory_usage,
          cpu_usage,
          response_time_avg: performanceMetrics.response_time_avg,
          throughput: performanceMetrics.throughput
        },
        patterns,
        recommendations,
        severity
      };

      const endTime = performance.now();
      console.log(`Metrics collection completed in ${endTime - startTime}ms`);

      return metrics;
    } catch (error) {
      console.error('Error collecting metrics:', error);
      throw error;
    }
  }

  /**
   * Collect error-related metrics
   */
  private async collectErrorMetrics(): Promise<{ error_rate: number }> {
    try {
      // Query Supabase for recent errors
      const { data: errorData, error } = await this.supabase
        .from('logs')
        .select('*')
        .eq('level', 'error')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Query total requests for error rate calculation
      const { data: totalData, error: totalError } = await this.supabase
        .from('logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (totalError) throw totalError;

      const errorCount = errorData?.length || 0;
      const totalCount = totalData?.length || 1;
      const error_rate = (errorCount / totalCount) * 100;

      return { error_rate };
    } catch (error) {
      console.warn('Could not collect error metrics:', error);
      return { error_rate: 0 };
    }
  }

  /**
   * Collect performance metrics
   */
  private async collectPerformanceMetrics(): Promise<{
    latency_p95: number;
    cold_starts: number;
    response_time_avg: number;
    throughput: number;
  }> {
    try {
      // Query performance logs
      const { data: perfData, error } = await this.supabase
        .from('performance_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!perfData || perfData.length === 0) {
        return {
          latency_p95: 0,
          cold_starts: 0,
          response_time_avg: 0,
          throughput: 0
        };
      }

      const responseTimes = perfData.map((log: any) => log.response_time).filter(Boolean);
      const coldStarts = perfData.filter((log: any) => log.cold_start).length;

      // Calculate P95 latency
      const sortedTimes = responseTimes.sort((a: number, b: number) => a - b);
      const p95Index = Math.ceil(sortedTimes.length * 0.95) - 1;
      const latency_p95 = sortedTimes[p95Index] || 0;

      // Calculate average response time
      const response_time_avg = responseTimes.reduce((sum: number, time: number) => sum + time, 0) / responseTimes.length;

      // Calculate throughput (requests per minute)
      const throughput = perfData.length / (24 * 60); // requests per minute

      return {
        latency_p95,
        cold_starts: coldStarts,
        response_time_avg,
        throughput
      };
    } catch (error) {
      console.warn('Could not collect performance metrics:', error);
      return {
        latency_p95: 0,
        cold_starts: 0,
        response_time_avg: 0,
        throughput: 0
      };
    }
  }

  /**
   * Collect resource usage metrics
   */
  private async collectResourceMetrics(): Promise<{
    memory_usage: number;
    cpu_usage: number;
  }> {
    try {
      // Get current memory usage
      const memoryUsage = process.memoryUsage();
      const memory_usage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

      // For CPU usage, we'd need to implement a more sophisticated approach
      // For now, return a placeholder
      const cpu_usage = 0; // This would need actual CPU monitoring

      return {
        memory_usage,
        cpu_usage
      };
    } catch (error) {
      console.warn('Could not collect resource metrics:', error);
      return {
        memory_usage: 0,
        cpu_usage: 0
      };
    }
  }

  /**
   * Detect patterns in metrics
   */
  private detectPatterns(metrics: {
    error_rate: number;
    latency_p95: number;
    cold_starts: number;
    memory_usage: number;
    cpu_usage: number;
  }): HealthMetrics['patterns'] {
    return {
      error_spike: metrics.error_rate > 5, // More than 5% error rate
      performance_degradation: metrics.latency_p95 > 2000, // P95 > 2 seconds
      memory_leak_suspected: metrics.memory_usage > 80, // Memory usage > 80%
      cold_start_spike: metrics.cold_starts > 10 // More than 10 cold starts
    };
  }

  /**
   * Generate recommendations based on patterns
   */
  private generateRecommendations(
    patterns: HealthMetrics['patterns'],
    metrics: {
      error_rate: number;
      latency_p95: number;
      cold_starts: number;
      memory_usage: number;
      cpu_usage: number;
    }
  ): string[] {
    const recommendations: string[] = [];

    if (patterns.error_spike) {
      recommendations.push('Investigate error spike - check recent deployments and error logs');
      recommendations.push('Consider implementing circuit breakers for external API calls');
    }

    if (patterns.performance_degradation) {
      recommendations.push('Optimize database queries and add proper indexing');
      recommendations.push('Consider implementing caching strategies (Redis, CDN)');
      recommendations.push('Review and optimize API response payloads');
    }

    if (patterns.memory_leak_suspected) {
      recommendations.push('Investigate potential memory leaks in application code');
      recommendations.push('Consider implementing memory monitoring and alerting');
      recommendations.push('Review object lifecycle and garbage collection patterns');
    }

    if (patterns.cold_start_spike) {
      recommendations.push('Optimize cold start performance with connection pooling');
      recommendations.push('Consider implementing keep-warm strategies');
      recommendations.push('Review function initialization and dependencies');
    }

    if (metrics.cpu_usage > 70) {
      recommendations.push('High CPU usage detected - consider horizontal scaling');
    }

    if (recommendations.length === 0) {
      recommendations.push('System health appears normal - continue monitoring');
    }

    return recommendations;
  }

  /**
   * Calculate severity based on patterns and metrics
   */
  private calculateSeverity(
    patterns: HealthMetrics['patterns'],
    error_rate: number,
    latency_p95: number
  ): HealthMetrics['severity'] {
    if (error_rate > 20 || latency_p95 > 5000) {
      return 'critical';
    }
    
    if (error_rate > 10 || latency_p95 > 3000 || patterns.memory_leak_suspected) {
      return 'high';
    }
    
    if (error_rate > 5 || latency_p95 > 2000 || patterns.cold_start_spike) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Store metrics in Supabase
   */
  async storeMetrics(metrics: HealthMetrics): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('ai_health_metrics')
        .insert([metrics]);

      if (error) throw error;
      
      console.log('Health metrics stored successfully');
    } catch (error) {
      console.error('Error storing metrics:', error);
      throw error;
    }
  }

  /**
   * Check if GitHub issue should be created
   */
  private shouldCreateIssue(metrics: HealthMetrics): boolean {
    return (
      metrics.severity === 'critical' ||
      metrics.severity === 'high' ||
      (metrics.patterns.error_spike && metrics.metrics.error_rate > 10) ||
      (metrics.patterns.performance_degradation && metrics.metrics.latency_p95 > 3000)
    );
  }

  /**
   * Create GitHub issue for critical problems
   */
  async createGitHubIssue(metrics: HealthMetrics): Promise<void> {
    if (!this.shouldCreateIssue(metrics)) {
      return;
    }

    try {
      const issue: GitHubIssue = {
        title: `🚨 AI Health Alert: ${metrics.severity.toUpperCase()} - ${metrics.environment}`,
        body: this.generateIssueBody(metrics),
        labels: ['ai-health', 'automated', metrics.severity, metrics.environment]
      };

      const { data, status } = await this.octokit.rest.issues.create({
        owner: process.env.GITHUB_OWNER || 'your-org',
        repo: process.env.GITHUB_REPO || 'aias-platform',
        title: issue.title,
        body: issue.body,
        labels: issue.labels
      });

      if (status === 201) {
        console.log(`GitHub issue created: ${data.html_url}`);
      }
    } catch (error) {
      console.error('Error creating GitHub issue:', error);
    }
  }

  /**
   * Generate GitHub issue body
   */
  private generateIssueBody(metrics: HealthMetrics): string {
    return `
## AI Health Metrics Alert

**Deployment ID:** ${metrics.deployment_id}  
**Environment:** ${metrics.environment}  
**Severity:** ${metrics.severity.toUpperCase()}  
**Timestamp:** ${metrics.timestamp}

### Metrics Summary
- **Error Rate:** ${metrics.metrics.error_rate.toFixed(2)}%
- **P95 Latency:** ${metrics.metrics.latency_p95}ms
- **Cold Starts:** ${metrics.metrics.cold_starts}
- **Memory Usage:** ${metrics.metrics.memory_usage.toFixed(2)}%
- **CPU Usage:** ${metrics.metrics.cpu_usage.toFixed(2)}%

### Detected Patterns
${Object.entries(metrics.patterns)
  .map(([pattern, detected]) => `- **${pattern.replace('_', ' ').toUpperCase()}:** ${detected ? '🚨 YES' : '✅ No'}`)
  .join('\n')}

### AI Recommendations
${metrics.recommendations.map(rec => `- ${rec}`).join('\n')}

### Next Steps
1. Review the metrics and patterns above
2. Investigate the root cause
3. Implement recommended optimizations
4. Monitor for improvements

---
*This issue was automatically generated by the AI Self-Diagnosis system.*
    `.trim();
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    try {
      console.log('Starting AI self-diagnosis...');
      
      const metrics = await this.collectMetrics();
      const fullMetrics = metrics as HealthMetrics;
      
      await this.storeMetrics(fullMetrics);
      
      if (this.shouldCreateIssue(fullMetrics)) {
        await this.createGitHubIssue(fullMetrics);
      }
      
      console.log('AI self-diagnosis completed successfully');
    } catch (error) {
      console.error('AI self-diagnosis failed:', error);
      throw error;
    }
  }
}

// Export for use in other modules
export { AISelfDiagnose, type HealthMetrics };

// CLI execution
if (require.main === module) {
  const diagnoser = new AISelfDiagnose();
  diagnoser.run().catch(console.error);
}