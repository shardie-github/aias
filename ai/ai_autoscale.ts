/**
 * AI Auto-Scaling System
 * Reads usage metrics and predicts cost trajectory
 * Opens GitHub Discussion on budget deviation
 */

import { createClient } from '@supabase/supabase-js';
import { Octokit } from '@octokit/rest';

interface UsageMetrics {
  timestamp: string;
  requests_per_minute: number;
  memory_usage: number;
  cpu_usage: number;
  response_time_avg: number;
  error_rate: number;
  cost_current: number;
  cost_projected: number;
}

interface CostPrediction {
  current_monthly: number;
  projected_monthly: number;
  deviation_percent: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
}

interface ScalingRecommendation {
  action: 'scale_up' | 'scale_down' | 'maintain';
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_cost_impact: number;
}

class AIAutoScale {
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
   * Collect usage metrics from various sources
   */
  async collectUsageMetrics(): Promise<UsageMetrics[]> {
    try {
      // Get metrics from Supabase
      const { data: supabaseMetrics, error: supabaseError } = await this.supabase
        .from('ai_health_metrics')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (supabaseError) throw supabaseError;

      // Get Vercel metrics if available
      const vercelMetrics = await this.getVercelMetrics();

      // Combine and process metrics
      const combinedMetrics = this.processMetrics(supabaseMetrics || [], vercelMetrics);

      return combinedMetrics;
    } catch (error) {
      console.error('Error collecting usage metrics:', error);
      return [];
    }
  }

  /**
   * Get Vercel metrics (placeholder implementation)
   */
  private async getVercelMetrics(): Promise<any[]> {
    // This would integrate with Vercel API
    // For now, return empty array
    return [];
  }

  /**
   * Process and normalize metrics
   */
  private processMetrics(supabaseMetrics: any[], vercelMetrics: any[]): UsageMetrics[] {
    const processed: UsageMetrics[] = [];

    // Process Supabase metrics
    supabaseMetrics.forEach(metric => {
      processed.push({
        timestamp: metric.timestamp,
        requests_per_minute: metric.metrics.throughput || 0,
        memory_usage: metric.metrics.memory_usage || 0,
        cpu_usage: metric.metrics.cpu_usage || 0,
        response_time_avg: metric.metrics.response_time_avg || 0,
        error_rate: metric.metrics.error_rate || 0,
        cost_current: this.calculateCurrentCost(metric),
        cost_projected: this.calculateProjectedCost(metric)
      });
    });

    return processed;
  }

  /**
   * Calculate current cost based on metrics
   */
  private calculateCurrentCost(metric: any): number {
    // Simplified cost calculation
    const baseCost = 10; // Base monthly cost
    const requestCost = (metric.metrics.throughput || 0) * 0.001; // $0.001 per request
    const memoryCost = (metric.metrics.memory_usage || 0) * 0.01; // $0.01 per GB
    const cpuCost = (metric.metrics.cpu_usage || 0) * 0.005; // $0.005 per CPU%

    return baseCost + requestCost + memoryCost + cpuCost;
  }

  /**
   * Calculate projected cost
   */
  private calculateProjectedCost(metric: any): number {
    const currentCost = this.calculateCurrentCost(metric);
    const growthRate = this.calculateGrowthRate(metric);
    
    return currentCost * (1 + growthRate);
  }

  /**
   * Calculate growth rate based on trends
   */
  private calculateGrowthRate(metric: any): number {
    // Simple linear growth calculation
    const throughput = metric.metrics.throughput || 0;
    const memoryUsage = metric.metrics.memory_usage || 0;
    
    // Assume 5% monthly growth if usage is high
    if (throughput > 1000 || memoryUsage > 70) {
      return 0.05;
    }
    
    return 0.02; // 2% default growth
  }

  /**
   * Predict cost trajectory using linear regression
   */
  async predictCostTrajectory(metrics: UsageMetrics[]): Promise<CostPrediction> {
    if (metrics.length < 2) {
      return {
        current_monthly: 0,
        projected_monthly: 0,
        deviation_percent: 0,
        trend: 'stable',
        confidence: 0
      };
    }

    // Simple linear regression
    const costs = metrics.map(m => m.cost_current);
    const timestamps = metrics.map((m, i) => i);
    
    const { slope, intercept, rSquared } = this.linearRegression(timestamps, costs);
    
    const currentCost = costs[costs.length - 1];
    const projectedCost = slope * (timestamps.length + 30) + intercept; // 30 days ahead
    
    const deviation = ((projectedCost - currentCost) / currentCost) * 100;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (slope > 0.1) trend = 'increasing';
    else if (slope < -0.1) trend = 'decreasing';

    return {
      current_monthly: currentCost,
      projected_monthly: Math.max(0, projectedCost),
      deviation_percent: deviation,
      trend,
      confidence: rSquared
    };
  }

  /**
   * Simple linear regression implementation
   */
  private linearRegression(x: number[], y: number[]): { slope: number; intercept: number; rSquared: number } {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared
    const yMean = sumY / n;
    const ssRes = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    return { slope, intercept, rSquared: Math.max(0, rSquared) };
  }

  /**
   * Generate scaling recommendations
   */
  generateScalingRecommendations(metrics: UsageMetrics[], prediction: CostPrediction): ScalingRecommendation[] {
    const recommendations: ScalingRecommendation[] = [];
    const latestMetrics = metrics[metrics.length - 1];

    if (!latestMetrics) return recommendations;

    // High error rate recommendation
    if (latestMetrics.error_rate > 5) {
      recommendations.push({
        action: 'scale_up',
        reason: `High error rate detected: ${latestMetrics.error_rate.toFixed(2)}%`,
        priority: 'high',
        estimated_cost_impact: 20
      });
    }

    // High memory usage recommendation
    if (latestMetrics.memory_usage > 80) {
      recommendations.push({
        action: 'scale_up',
        reason: `High memory usage: ${latestMetrics.memory_usage.toFixed(2)}%`,
        priority: 'medium',
        estimated_cost_impact: 15
      });
    }

    // High CPU usage recommendation
    if (latestMetrics.cpu_usage > 80) {
      recommendations.push({
        action: 'scale_up',
        reason: `High CPU usage: ${latestMetrics.cpu_usage.toFixed(2)}%`,
        priority: 'medium',
        estimated_cost_impact: 15
      });
    }

    // High response time recommendation
    if (latestMetrics.response_time_avg > 2000) {
      recommendations.push({
        action: 'scale_up',
        reason: `High response time: ${latestMetrics.response_time_avg.toFixed(2)}ms`,
        priority: 'medium',
        estimated_cost_impact: 10
      });
    }

    // Low utilization recommendation
    if (latestMetrics.memory_usage < 30 && latestMetrics.cpu_usage < 30) {
      recommendations.push({
        action: 'scale_down',
        reason: 'Low resource utilization detected',
        priority: 'low',
        estimated_cost_impact: -20
      });
    }

    // Cost optimization recommendation
    if (prediction.deviation_percent > 20) {
      recommendations.push({
        action: 'scale_down',
        reason: `High cost projection: ${prediction.deviation_percent.toFixed(2)}% increase`,
        priority: 'high',
        estimated_cost_impact: -30
      });
    }

    return recommendations;
  }

  /**
   * Check if GitHub discussion should be created
   */
  private shouldCreateDiscussion(prediction: CostPrediction, recommendations: ScalingRecommendation[]): boolean {
    return (
      prediction.deviation_percent > 20 ||
      recommendations.some(r => r.priority === 'high' || r.priority === 'critical')
    );
  }

  /**
   * Create GitHub discussion for cost alerts
   */
  async createCostAlertDiscussion(prediction: CostPrediction, recommendations: ScalingRecommendation[]): Promise<void> {
    if (!this.shouldCreateDiscussion(prediction, recommendations)) {
      return;
    }

    try {
      const discussion = {
        title: `💰 Cost Alert: ${prediction.deviation_percent.toFixed(1)}% Budget Deviation`,
        body: this.generateDiscussionBody(prediction, recommendations),
        category: 'general'
      };

      const { data, status } = await this.octokit.rest.discussions.create({
        owner: process.env.GITHUB_OWNER || 'your-org',
        repo: process.env.GITHUB_REPO || 'aias-platform',
        title: discussion.title,
        body: discussion.body,
        category: discussion.category
      });

      if (status === 201) {
        console.log(`GitHub discussion created: ${data.html_url}`);
      }
    } catch (error) {
      console.error('Error creating GitHub discussion:', error);
    }
  }

  /**
   * Generate discussion body
   */
  private generateDiscussionBody(prediction: CostPrediction, recommendations: ScalingRecommendation[]): string {
    const priorityEmoji = {
      low: '🟢',
      medium: '🟡',
      high: '🔴',
      critical: '🚨'
    };

    return `
## 💰 AI Auto-Scale Cost Alert

**Current Monthly Cost:** $${prediction.current_monthly.toFixed(2)}  
**Projected Monthly Cost:** $${prediction.projected_monthly.toFixed(2)}  
**Deviation:** ${prediction.deviation_percent.toFixed(2)}%  
**Trend:** ${prediction.trend.toUpperCase()}  
**Confidence:** ${(prediction.confidence * 100).toFixed(1)}%

### 📊 Cost Analysis
${prediction.deviation_percent > 0 
  ? `⚠️ **Cost is increasing** by ${prediction.deviation_percent.toFixed(2)}%`
  : `✅ **Cost is decreasing** by ${Math.abs(prediction.deviation_percent).toFixed(2)}%`
}

### 🎯 Scaling Recommendations
${recommendations.length > 0 
  ? recommendations.map(rec => 
      `- **${priorityEmoji[rec.priority]} ${rec.priority.toUpperCase()}:** ${rec.reason} (Cost impact: ${rec.estimated_cost_impact > 0 ? '+' : ''}$${rec.estimated_cost_impact})`
    ).join('\n')
  : '- No immediate scaling recommendations'
}

### 📈 Cost Projection Graph
\`\`\`
Current:  $${prediction.current_monthly.toFixed(2)}
Projected: $${prediction.projected_monthly.toFixed(2)}
          ${'█'.repeat(Math.min(20, Math.max(1, prediction.projected_monthly / 10)))}
\`\`\`

### 🔧 Next Steps
1. Review the recommendations above
2. Consider implementing auto-scaling policies
3. Monitor cost trends over the next few days
4. Update budget alerts if needed

---
*This discussion was automatically generated by the AI Auto-Scale system.*
    `.trim();
  }

  /**
   * Store scaling data in database
   */
  async storeScalingData(prediction: CostPrediction, recommendations: ScalingRecommendation[]): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('ai_scaling_data')
        .insert([{
          prediction,
          recommendations,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      console.log('Scaling data stored successfully');
    } catch (error) {
      console.error('Error storing scaling data:', error);
    }
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    try {
      console.log('Starting AI auto-scale analysis...');
      
      const metrics = await this.collectUsageMetrics();
      if (metrics.length === 0) {
        console.log('No metrics available for analysis');
        return;
      }

      const prediction = await this.predictCostTrajectory(metrics);
      const recommendations = this.generateScalingRecommendations(metrics, prediction);

      await this.storeScalingData(prediction, recommendations);

      if (this.shouldCreateDiscussion(prediction, recommendations)) {
        await this.createCostAlertDiscussion(prediction, recommendations);
      }

      console.log('AI auto-scale analysis completed');
      console.log(`Cost prediction: $${prediction.projected_monthly.toFixed(2)} (${prediction.deviation_percent.toFixed(2)}% deviation)`);
      console.log(`Recommendations: ${recommendations.length}`);
    } catch (error) {
      console.error('AI auto-scale analysis failed:', error);
      throw error;
    }
  }
}

// Export for use in other modules
export { AIAutoScale, type UsageMetrics, type CostPrediction, type ScalingRecommendation };

// CLI execution
if (require.main === module) {
  const autoScale = new AIAutoScale();
  autoScale.run().catch(console.error);
}