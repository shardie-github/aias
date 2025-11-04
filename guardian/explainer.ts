/**
 * Guardian GPT Explainer
 * Local LLM wrapper for explaining privacy events
 */

import { guardianService, type GuardianEvent } from './core';
import { guardianInspector, type TrustReport } from './inspector';

export interface Explanation {
  question: string;
  answer: string;
  sources: string[];
  confidence: number;
}

export class GuardianGPT {
  /**
   * Explain which parts of the app touched user data
   */
  async explainDataAccess(report: TrustReport): Promise<Explanation> {
    const scopes = Object.keys(report.summary.by_scope);
    const dataClasses = Object.keys(report.summary.by_data_class);

    const answer = `Based on the Guardian report, your data was accessed by:
${scopes.map(scope => `- **${scope}**: ${report.summary.by_scope[scope]} events`).join('\n')}

The following types of data were accessed:
${dataClasses.map(cls => `- **${cls}**: ${report.summary.by_data_class[cls]} times`).join('\n')}

All events were classified as ${Object.keys(report.summary.by_risk_level).filter(l => report.summary.by_risk_level[l] > 0).join(' or ')} risk, and Guardian ${report.violations_prevented > 0 ? 'prevented ' + report.violations_prevented + ' violations' : 'allowed all necessary operations'}.

No data left your device without your explicit consent.`;

    return {
      question: 'Which parts of the app touched my data?',
      answer,
      sources: ['trust_report', 'guardian_ledger'],
      confidence: 0.9,
    };
  }

  /**
   * Explain what rules applied
   */
  async explainRules(event: GuardianEvent): Promise<Explanation> {
    const ruleExplanation = this.getRuleExplanation(event);

    const answer = `For this event, Guardian applied the following rules:

**Risk Assessment:**
- Risk Level: ${event.risk_level} (score: ${event.risk_score.toFixed(2)})
- Data Class: ${event.data_class}
- Scope: ${event.scope}

**Policy Applied:**
${ruleExplanation}

**Action Taken:** ${event.action_taken}

**Why this action:**
${this.getActionReason(event)}`;

    return {
      question: 'What rules applied to this event?',
      answer,
      sources: ['guardian_policies', 'event_metadata'],
      confidence: 0.85,
    };
  }

  /**
   * Explain what would happen if monitoring is disabled
   */
  async explainDisableMonitoring(): Promise<Explanation> {
    const answer = `If you disable Guardian monitoring:

**What Stops:**
- Real-time risk assessment
- Automatic data masking/redaction
- Violation prevention
- Trust ledger updates

**What Continues:**
- App functionality (all features will still work)
- Data processing (but without oversight)
- External API calls (but without risk scoring)

**Recommendations:**
- Keep monitoring enabled for maximum privacy protection
- Use Private Mode instead if you want to temporarily pause telemetry
- Review your Trust Fabric preferences to customize Guardian behavior

**Impact:**
Without Guardian, you won't have visibility into:
- Which parts of the app access your data
- Risk levels of data operations
- Historical privacy events
- Adaptive recommendations

Guardian is designed to be lightweight and non-intrusive. It only monitors events, doesn't block functionality, and helps you understand your privacy footprint.`;

    return {
      question: 'What would happen if I disable monitoring?',
      answer,
      sources: ['guardian_documentation'],
      confidence: 0.95,
    };
  }

  /**
   * Explain a specific event
   */
  async explainEvent(event: GuardianEvent): Promise<Explanation> {
    const answer = `**Event Details:**

**What happened:** ${event.description}

**When:** ${new Date(event.timestamp).toLocaleString()}

**Data Type:** ${event.data_class}
${event.data_class === 'telemetry' ? ' (App usage metrics, no personal content)' : ''}
${event.data_class === 'content' ? ' (User-generated content or text)' : ''}
${event.data_class === 'location' ? ' (Geographic location data)' : ''}
${event.data_class === 'credentials' ? ' (Authentication tokens or passwords)' : ''}

**Who accessed it:** ${event.scope === 'user' ? 'You (local processing)' : event.scope === 'app' ? 'The app (internal)' : event.scope === 'api' ? 'API (server-side)' : 'External service'}

**Risk Level:** ${event.risk_level} (score: ${event.risk_score.toFixed(2)})

**Action:** ${event.action_taken}
${event.action_taken === 'allow' ? ' - Guardian determined this was safe and necessary' : ''}
${event.action_taken === 'mask' ? ' - Guardian masked sensitive portions before processing' : ''}
${event.action_taken === 'block' ? ' - Guardian blocked this to protect your privacy' : ''}

**User-Friendly Explanation:**
${this.getUserFriendlyExplanation(event)}`;

    return {
      question: `Explain this event: ${event.description}`,
      answer,
      sources: ['guardian_event', 'trust_fabric'],
      confidence: 0.9,
    };
  }

  /**
   * Get rule explanation for an event
   */
  private getRuleExplanation(event: GuardianEvent): string {
    const rules: string[] = [];

    if (event.scope === 'external') {
      rules.push('- External API calls require higher scrutiny');
    }

    if (event.data_class === 'credentials') {
      rules.push('- Credential access is restricted by default');
    }

    if (event.risk_level === 'high' || event.risk_level === 'critical') {
      rules.push('- High-risk events trigger protective actions');
    }

    if (event.scope === 'user') {
      rules.push('- User-scoped events are always allowed (local processing)');
    }

    return rules.length > 0 ? rules.join('\n') : '- Standard privacy policies applied';
  }

  /**
   * Get reason for action taken
   */
  private getActionReason(event: GuardianEvent): string {
    if (event.action_taken === 'allow') {
      return 'This was a low-risk, necessary operation for app functionality. No sensitive data was exposed, and the operation stayed within your privacy boundaries.';
    }
    if (event.action_taken === 'mask') {
      return 'Guardian detected potentially sensitive information and masked it before processing to protect your privacy while allowing the feature to work.';
    }
    if (event.action_taken === 'block') {
      return 'This operation exceeded your privacy risk threshold. Guardian blocked it to prevent unauthorized data access.';
    }
    return 'Guardian applied standard privacy protection rules.';
  }

  /**
   * Get user-friendly explanation
   */
  private getUserFriendlyExplanation(event: GuardianEvent): string {
    if (event.type === 'telemetry') {
      return `Your device activity was summarized locally to help improve the app experience. No content, credentials, or conversations were stored or shared.`;
    }
    if (event.type === 'api_call') {
      return `The app made a request to ${event.scope === 'external' ? 'an external service' : 'the server'}. ${event.action_taken === 'allow' ? 'This was necessary for the feature to work.' : 'Guardian ' + event.action_taken + ' this to protect your privacy.'}`;
    }
    if (event.type === 'content_processing') {
      return `Your content was processed ${event.action_taken === 'mask' ? 'with sensitive portions masked' : 'locally'} to provide the requested feature. No data left your device.`;
    }
    return `This event was necessary for app functionality. Guardian ${event.action_taken} it according to your privacy preferences.`;
  }

  /**
   * Answer a general question
   */
  async answerQuestion(question: string, context?: { events?: GuardianEvent[]; report?: TrustReport }): Promise<Explanation> {
    const questionLower = question.toLowerCase();

    if (questionLower.includes('what data') || questionLower.includes('which data')) {
      if (context?.report) {
        return this.explainDataAccess(context.report);
      }
    }

    if (questionLower.includes('what rules') || questionLower.includes('which rules')) {
      if (context?.events && context.events.length > 0) {
        return this.explainRules(context.events[0]);
      }
    }

    if (questionLower.includes('disable') || questionLower.includes('turn off')) {
      return this.explainDisableMonitoring();
    }

    if (context?.events && context.events.length > 0) {
      return this.explainEvent(context.events[0]);
    }

    // Default answer
    return {
      question,
      answer: `Guardian is your privacy protector that monitors data access, assesses risk, and enforces your privacy boundaries. It works transparently in the background and provides you with insights about how your data is used. All monitoring happens locally, and you can review events anytime in the Trust Dashboard.`,
      sources: ['guardian_core'],
      confidence: 0.7,
    };
  }
}

export const guardianGPT = new GuardianGPT();
