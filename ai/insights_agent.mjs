/**
 * AI Insights Agent
 * Parses logs with GPT-5 reasoning and recommends optimizations
 * Posts results as PR comment "AI Post-Deploy Analysis"
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { Octokit } from '@octokit/rest';

class AIInsightsAgent {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.supabase = createClient(
      process.env.SUPABASE_URL || `https://${process.env.SUPABASE_PROJECT_REF || 'ghqyxhbyyirveptgwoqm'}.supabase.co`,
      process.env.SUPABASE_ANON_KEY || ''
    );
    
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  /**
   * Analyze deployment logs and generate insights
   */
  async analyzeDeployment(deploymentId, environment = 'production') {
    try {
      console.log(`Analyzing deployment ${deploymentId} in ${environment}...`);
      
      // Collect logs from the last 24 hours
      const logs = await this.collectLogs(deploymentId, environment);
      
      // Get performance metrics
      const metrics = await this.collectPerformanceMetrics(deploymentId);
      
      // Get error patterns
      const errorPatterns = await this.analyzeErrorPatterns(logs);
      
      // Generate AI insights using GPT-5
      const insights = await this.generateInsights(logs, metrics, errorPatterns);
      
      // Post insights as PR comment if this is a PR deployment
      if (process.env.VERCEL_GIT_PULL_REQUEST_NUMBER) {
        await this.postPRComment(insights, deploymentId);
      }
      
      // Store insights in database
      await this.storeInsights(insights, deploymentId, environment);
      
      return insights;
    } catch (error) {
      console.error('Error analyzing deployment:', error);
      throw error;
    }
  }

  /**
   * Collect logs from Supabase
   */
  async collectLogs(deploymentId, environment) {
    const { data: logs, error } = await this.supabase
      .from('logs')
      .select('*')
      .eq('deployment_id', deploymentId)
      .eq('environment', environment)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) throw error;
    return logs || [];
  }

  /**
   * Collect performance metrics
   */
  async collectPerformanceMetrics(deploymentId) {
    const { data: metrics, error } = await this.supabase
      .from('ai_health_metrics')
      .select('*')
      .eq('deployment_id', deploymentId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return metrics || [];
  }

  /**
   * Analyze error patterns in logs
   */
  async analyzeErrorPatterns(logs) {
    const errorLogs = logs.filter(log => log.level === 'error');
    const errorCounts = {};
    const errorMessages = [];

    errorLogs.forEach(log => {
      const errorType = this.categorizeError(log.message);
      errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
      errorMessages.push(log.message);
    });

    return {
      totalErrors: errorLogs.length,
      errorTypes: errorCounts,
      errorMessages: errorMessages.slice(0, 50), // Limit for AI processing
      errorRate: (errorLogs.length / logs.length) * 100
    };
  }

  /**
   * Categorize error types
   */
  categorizeError(message) {
    if (message.includes('timeout')) return 'timeout';
    if (message.includes('connection')) return 'connection';
    if (message.includes('authentication') || message.includes('unauthorized')) return 'auth';
    if (message.includes('validation')) return 'validation';
    if (message.includes('database') || message.includes('SQL')) return 'database';
    if (message.includes('memory') || message.includes('heap')) return 'memory';
    if (message.includes('rate limit')) return 'rate_limit';
    return 'other';
  }

  /**
   * Generate AI insights using GPT-5
   */
  async generateInsights(logs, metrics, errorPatterns) {
    const systemPrompt = `You are an expert DevOps engineer and performance analyst. Analyze the provided deployment logs, metrics, and error patterns to provide actionable insights and recommendations.

Focus on:
1. Performance bottlenecks and optimization opportunities
2. Error patterns and root cause analysis
3. Caching strategies
4. Database optimization
5. API improvements
6. Security considerations
7. Scalability recommendations

Provide specific, actionable recommendations with priority levels (High, Medium, Low).`;

    const userPrompt = `
Deployment Analysis Request:

## Logs Summary
- Total logs: ${logs.length}
- Error rate: ${errorPatterns.errorRate.toFixed(2)}%
- Error types: ${JSON.stringify(errorPatterns.errorTypes, null, 2)}

## Recent Metrics
${metrics.map(m => `
- Error rate: ${m.metrics.error_rate}%
- P95 latency: ${m.metrics.latency_p95}ms
- Cold starts: ${m.metrics.cold_starts}
- Memory usage: ${m.metrics.memory_usage}%
- Severity: ${m.severity}
`).join('\n')}

## Error Messages (Sample)
${errorPatterns.errorMessages.slice(0, 20).map(msg => `- ${msg}`).join('\n')}

## Log Sample
${logs.slice(0, 10).map(log => `${log.level}: ${log.message}`).join('\n')}

Please provide a comprehensive analysis with specific recommendations.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview', // Using GPT-4 as GPT-5 is not yet available
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const analysis = completion.choices[0].message.content;
      
      // Parse the analysis into structured format
      return this.parseAnalysis(analysis, errorPatterns, metrics);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return this.generateFallbackInsights(errorPatterns, metrics);
    }
  }

  /**
   * Parse AI analysis into structured format
   */
  parseAnalysis(analysis, errorPatterns, metrics) {
    const insights = {
      summary: '',
      recommendations: [],
      performance: {},
      errors: {},
      caching: [],
      database: [],
      security: [],
      scalability: [],
      priority: 'medium',
      confidence: 0.8
    };

    // Extract summary
    const summaryMatch = analysis.match(/## Summary[\s\S]*?(?=##|$)/);
    if (summaryMatch) {
      insights.summary = summaryMatch[0].replace(/## Summary\s*/, '').trim();
    }

    // Extract recommendations
    const recMatches = analysis.match(/- \[(High|Medium|Low)\].*?(?=\n-|$)/g);
    if (recMatches) {
      insights.recommendations = recMatches.map(rec => ({
        text: rec.replace(/^- \[(High|Medium|Low)\] /, ''),
        priority: rec.match(/\[(High|Medium|Low)\]/)[1].toLowerCase()
      }));
    }

    // Determine overall priority
    const highPriorityCount = insights.recommendations.filter(r => r.priority === 'high').length;
    if (highPriorityCount > 2) insights.priority = 'high';
    else if (highPriorityCount > 0) insights.priority = 'medium';
    else insights.priority = 'low';

    return insights;
  }

  /**
   * Generate fallback insights if AI fails
   */
  generateFallbackInsights(errorPatterns, metrics) {
    const recommendations = [];
    
    if (errorPatterns.errorRate > 5) {
      recommendations.push({
        text: 'High error rate detected - investigate error logs and implement proper error handling',
        priority: 'high'
      });
    }
    
    if (metrics.length > 0 && metrics[0].metrics.latency_p95 > 2000) {
      recommendations.push({
        text: 'High latency detected - optimize database queries and implement caching',
        priority: 'high'
      });
    }
    
    if (metrics.length > 0 && metrics[0].metrics.memory_usage > 80) {
      recommendations.push({
        text: 'High memory usage - investigate potential memory leaks',
        priority: 'medium'
      });
    }

    return {
      summary: 'Automated analysis completed with basic recommendations',
      recommendations,
      performance: { errorRate: errorPatterns.errorRate },
      errors: errorPatterns.errorTypes,
      caching: ['Consider implementing Redis caching for frequently accessed data'],
      database: ['Review database query performance and indexing'],
      security: ['Ensure all API endpoints have proper authentication'],
      scalability: ['Monitor resource usage and plan for horizontal scaling'],
      priority: recommendations.some(r => r.priority === 'high') ? 'high' : 'medium',
      confidence: 0.6
    };
  }

  /**
   * Post insights as PR comment
   */
  async postPRComment(insights, deploymentId) {
    const prNumber = process.env.VERCEL_GIT_PULL_REQUEST_NUMBER;
    if (!prNumber) return;

    const comment = this.formatPRComment(insights, deploymentId);

    try {
      await this.octokit.rest.issues.createComment({
        owner: process.env.GITHUB_OWNER || 'your-org',
        repo: process.env.GITHUB_REPO || 'aias-platform',
        issue_number: prNumber,
        body: comment
      });
      
      console.log(`Posted AI analysis comment to PR #${prNumber}`);
    } catch (error) {
      console.error('Error posting PR comment:', error);
    }
  }

  /**
   * Format PR comment
   */
  formatPRComment(insights, deploymentId) {
    const priorityEmoji = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };

    return `
## 🤖 AI Post-Deploy Analysis

**Deployment ID:** ${deploymentId}  
**Priority:** ${priorityEmoji[insights.priority]} ${insights.priority.toUpperCase()}  
**Confidence:** ${(insights.confidence * 100).toFixed(0)}%

### 📊 Summary
${insights.summary || 'Analysis completed with automated recommendations.'}

### 🎯 Recommendations
${insights.recommendations.map(rec => 
  `- **${rec.priority.toUpperCase()}:** ${rec.text}`
).join('\n')}

### 📈 Performance Insights
- **Error Rate:** ${insights.performance.errorRate?.toFixed(2) || 'N/A'}%
- **Error Types:** ${Object.keys(insights.errors).join(', ') || 'None detected'}

### 💾 Caching Opportunities
${insights.caching.map(rec => `- ${rec}`).join('\n') || '- No specific caching recommendations'}

### 🗄️ Database Optimizations
${insights.database.map(rec => `- ${rec}`).join('\n') || '- No specific database recommendations'}

### 🔒 Security Considerations
${insights.security.map(rec => `- ${rec}`).join('\n') || '- No specific security recommendations'}

### 📈 Scalability Notes
${insights.scalability.map(rec => `- ${rec}`).join('\n') || '- No specific scalability recommendations'}

---
*This analysis was generated by the AI Insights Agent using GPT-4 reasoning.*
    `.trim();
  }

  /**
   * Store insights in database
   */
  async storeInsights(insights, deploymentId, environment) {
    try {
      const { error } = await this.supabase
        .from('ai_insights')
        .insert([{
          deployment_id: deploymentId,
          environment,
          insights: insights,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      console.log('Insights stored successfully');
    } catch (error) {
      console.error('Error storing insights:', error);
    }
  }
}

// Export for use in other modules
export { AIInsightsAgent };

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new AIInsightsAgent();
  const deploymentId = process.argv[2] || process.env.VERCEL_DEPLOYMENT_ID;
  const environment = process.argv[3] || process.env.NODE_ENV || 'production';
  
  agent.analyzeDeployment(deploymentId, environment)
    .then(insights => {
      console.log('Analysis completed:', JSON.stringify(insights, null, 2));
    })
    .catch(console.error);
}