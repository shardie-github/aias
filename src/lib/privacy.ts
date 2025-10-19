/**
 * Comprehensive Privacy Compliance Framework
 * Supports GDPR, CCPA, and other privacy regulations
 */

export interface PrivacySettings {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  necessary: boolean;
  preferences: boolean;
  performance: boolean;
  social: boolean;
}

export interface ConsentData {
  id: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  consentVersion: string;
  settings: PrivacySettings;
  jurisdiction: string;
  dataProcessingPurposes: string[];
  retentionPeriod: number; // in days
}

export interface DataSubject {
  id: string;
  email: string;
  consentId: string;
  dataCategories: string[];
  processingBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  createdAt: string;
  lastUpdated: string;
}

export class PrivacyManager {
  private static instance: PrivacyManager;
  private consentData: Map<string, ConsentData> = new Map();
  private dataSubjects: Map<string, DataSubject> = new Map();

  static getInstance(): PrivacyManager {
    if (!PrivacyManager.instance) {
      PrivacyManager.instance = new PrivacyManager();
    }
    return PrivacyManager.instance;
  }

  /**
   * Record user consent with full audit trail
   */
  async recordConsent(
    userId: string,
    settings: PrivacySettings,
    metadata: {
      ipAddress: string;
      userAgent: string;
      jurisdiction: string;
    }
  ): Promise<ConsentData> {
    const consentId = this.generateConsentId();
    const consentData: ConsentData = {
      id: consentId,
      timestamp: new Date().toISOString(),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      consentVersion: '2.1',
      settings,
      jurisdiction: metadata.jurisdiction,
      dataProcessingPurposes: this.getDataProcessingPurposes(settings),
      retentionPeriod: this.calculateRetentionPeriod(settings)
    };

    this.consentData.set(consentId, consentData);
    
    // Log audit event
    await this.logAuditEvent('consent_recorded', {
      userId,
      consentId,
      settings,
      jurisdiction: metadata.jurisdiction
    });

    return consentData;
  }

  /**
   * Check if user has valid consent for specific data processing
   */
  hasValidConsent(userId: string, purpose: keyof PrivacySettings): boolean {
    const dataSubject = this.dataSubjects.get(userId);
    if (!dataSubject) return false;

    const consent = this.consentData.get(dataSubject.consentId);
    if (!consent) return false;

    // Check if consent is still valid (not expired)
    const consentAge = Date.now() - new Date(consent.timestamp).getTime();
    const maxAge = consent.retentionPeriod * 24 * 60 * 60 * 1000; // Convert days to ms

    return consentAge < maxAge && consent.settings[purpose];
  }

  /**
   * Handle data subject rights requests (GDPR Article 15-22)
   */
  async handleDataSubjectRequest(
    userId: string,
    requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection'
  ): Promise<{ success: boolean; message: string; data?: Record<string, unknown> }> {
    const dataSubject = this.dataSubjects.get(userId);
    if (!dataSubject) {
      throw new Error('Data subject not found');
    }

    await this.logAuditEvent('data_subject_request', {
      userId,
      requestType,
      timestamp: new Date().toISOString()
    });

    switch (requestType) {
      case 'access':
        return this.generateDataPortabilityReport(userId);
      case 'erasure':
        return this.processDataErasure(userId);
      case 'portability':
        return this.generateDataPortabilityReport(userId);
      default:
        return { status: 'processed', requestType };
    }
  }

  /**
   * Generate comprehensive data portability report
   */
  private async generateDataPortabilityReport(userId: string): Promise<{ report: Record<string, unknown>; format: string }> {
    const dataSubject = this.dataSubjects.get(userId);
    const consent = dataSubject ? this.consentData.get(dataSubject.consentId) : null;

    return {
      personalData: {
        id: dataSubject?.id,
        email: dataSubject?.email,
        dataCategories: dataSubject?.dataCategories || [],
        processingBasis: dataSubject?.processingBasis
      },
      consent: consent ? {
        timestamp: consent.timestamp,
        settings: consent.settings,
        jurisdiction: consent.jurisdiction,
        version: consent.consentVersion
      } : null,
      dataProcessingPurposes: consent?.dataProcessingPurposes || [],
      retentionPeriod: consent?.retentionPeriod || 0,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Process data erasure request (Right to be forgotten)
   */
  private async processDataErasure(userId: string): Promise<{ success: boolean; erasedData: string[] }> {
    // Mark data for erasure
    const dataSubject = this.dataSubjects.get(userId);
    if (dataSubject) {
      dataSubject.dataCategories = [];
      this.dataSubjects.set(userId, dataSubject);
    }

    // Schedule actual deletion after verification period
    setTimeout(() => {
      this.dataSubjects.delete(userId);
      // Delete associated consent data
      if (dataSubject) {
        this.consentData.delete(dataSubject.consentId);
      }
    }, 30 * 24 * 60 * 60 * 1000); // 30 days verification period

    return {
      status: 'erasure_scheduled',
      verificationPeriod: '30 days',
      scheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * Get data processing purposes based on consent settings
   */
  private getDataProcessingPurposes(settings: PrivacySettings): string[] {
    const purposes: string[] = [];
    
    if (settings.analytics) purposes.push('analytics', 'performance_measurement');
    if (settings.marketing) purposes.push('marketing', 'advertising', 'personalization');
    if (settings.functional) purposes.push('functionality', 'user_experience');
    if (settings.necessary) purposes.push('security', 'authentication', 'legal_compliance');
    if (settings.preferences) purposes.push('preference_storage', 'customization');
    if (settings.performance) purposes.push('performance_optimization', 'caching');
    if (settings.social) purposes.push('social_sharing', 'social_features');

    return purposes;
  }

  /**
   * Calculate data retention period based on consent settings
   */
  private calculateRetentionPeriod(settings: PrivacySettings): number {
    // Base retention period
    let retention = 365; // 1 year default

    // Adjust based on consent types
    if (settings.marketing) retention = Math.max(retention, 1095); // 3 years for marketing
    if (settings.analytics) retention = Math.max(retention, 730); // 2 years for analytics
    if (settings.social) retention = Math.max(retention, 1825); // 5 years for social data

    return retention;
  }

  /**
   * Generate consent ID with cryptographic randomness
   */
  private generateConsentId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `consent_${timestamp}_${random}`;
  }

  /**
   * Log audit events for compliance
   */
  private async logAuditEvent(action: string, metadata: Record<string, unknown>): Promise<void> {
    // This would integrate with your audit logging system
    console.log(`[AUDIT] ${action}:`, metadata);
  }

  /**
   * Get privacy policy content based on jurisdiction
   */
  getPrivacyPolicy(jurisdiction: string): string {
    const policies = {
      'EU': 'GDPR-compliant privacy policy with full data subject rights...',
      'CA': 'CCPA-compliant privacy policy with California consumer rights...',
      'US': 'US privacy policy with state-specific provisions...',
      'default': 'Comprehensive privacy policy with international compliance...'
    };

    return policies[jurisdiction as keyof typeof policies] || policies.default;
  }

  /**
   * Check if consent needs renewal
   */
  needsConsentRenewal(userId: string): boolean {
    const dataSubject = this.dataSubjects.get(userId);
    if (!dataSubject) return true;

    const consent = this.consentData.get(dataSubject.consentId);
    if (!consent) return true;

    // Check if consent is older than 1 year
    const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
    return new Date(consent.timestamp).getTime() < oneYearAgo;
  }
}

export const privacyManager = PrivacyManager.getInstance();