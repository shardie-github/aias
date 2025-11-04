/**
 * Trust Fabric AI Layer
 * Adaptive recommendations based on user behavior
 */

import { guardianService, type GuardianEvent } from './core';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface TrustFabricModel {
  user_id?: string;
  comfort_zones: {
    privacy_mode_toggles: number;
    signals_disabled: string[];
    average_trust_responses: Record<string, 'allow' | 'block' | 'mask'>;
    risk_tolerance: 'low' | 'medium' | 'high';
  };
  learned_preferences: {
    always_allows: string[];
    always_blocks: string[];
    context_rules: Array<{
      context: string;
      action: 'allow' | 'block' | 'mask';
      confidence: number;
    }>;
  };
  adaptive_weights: Record<string, number>;
  last_updated: string;
}

export class TrustFabricAI {
  private model: TrustFabricModel;
  private modelPath: string;

  constructor(userId?: string) {
    this.modelPath = join(process.cwd(), 'guardian', 'trust_fabric.json');
    this.model = this.loadModel(userId);
  }

  /**
   * Load or initialize trust fabric model
   */
  private loadModel(userId?: string): TrustFabricModel {
    if (existsSync(this.modelPath)) {
      try {
        const data = JSON.parse(readFileSync(this.modelPath, 'utf-8'));
        return data as TrustFabricModel;
      } catch (error) {
        console.warn('[TRUST FABRIC] Failed to load model, creating new one');
      }
    }

    return this.initializeModel(userId);
  }

  /**
   * Initialize new trust fabric model
   */
  private initializeModel(userId?: string): TrustFabricModel {
    return {
      user_id: userId,
      comfort_zones: {
        privacy_mode_toggles: 0,
        signals_disabled: [],
        average_trust_responses: {},
        risk_tolerance: 'medium',
      },
      learned_preferences: {
        always_allows: [],
        always_blocks: [],
        context_rules: [],
      },
      adaptive_weights: {},
      last_updated: new Date().toISOString(),
    };
  }

  /**
   * Learn from user behavior
   */
  learnFromEvent(event: GuardianEvent, userDecision?: 'allowed' | 'blocked' | 'pending'): void {
    // Update comfort zones
    if (event.type === 'guardian' && event.description.includes('Private Mode')) {
      this.model.comfort_zones.privacy_mode_toggles++;
    }

    // Learn from user decisions
    if (userDecision) {
      const key = `${event.scope}:${event.data_class}`;
      const current = this.model.comfort_zones.average_trust_responses[key] || 'allow';
      
      // Update preference based on pattern
      if (userDecision === 'blocked') {
        if (!this.model.learned_preferences.always_blocks.includes(key)) {
          this.model.learned_preferences.always_blocks.push(key);
        }
        // Remove from allows if it was there
        const allowIndex = this.model.learned_preferences.always_allows.indexOf(key);
        if (allowIndex > -1) {
          this.model.learned_preferences.always_allows.splice(allowIndex, 1);
        }
      } else if (userDecision === 'allowed') {
        if (!this.model.learned_preferences.always_allows.includes(key)) {
          this.model.learned_preferences.always_allows.push(key);
        }
        // Remove from blocks if it was there
        const blockIndex = this.model.learned_preferences.always_blocks.indexOf(key);
        if (blockIndex > -1) {
          this.model.learned_preferences.always_blocks.splice(blockIndex, 1);
        }
      }
    }

    // Learn context rules
    const context = this.extractContext(event);
    if (context) {
      const existingRule = this.model.learned_preferences.context_rules.find(
        r => r.context === context
      );
      
      if (existingRule) {
        // Update confidence
        existingRule.confidence = Math.min(1.0, existingRule.confidence + 0.1);
      } else {
        // Add new rule
        this.model.learned_preferences.context_rules.push({
          context,
          action: userDecision === 'blocked' ? 'block' : 'allow',
          confidence: 0.5,
        });
      }
    }

    this.model.last_updated = new Date().toISOString();
    this.saveModel();
  }

  /**
   * Extract context from event
   */
  private extractContext(event: GuardianEvent): string | null {
    if (event.metadata.camera_active) return 'camera_active';
    if (event.metadata.microphone_active) return 'microphone_active';
    if (event.metadata.location_tracking) return 'location_tracking';
    if (event.data_class === 'biometrics') return 'biometric_auth';
    return null;
  }

  /**
   * Generate adaptive recommendations
   */
  generateRecommendations(): Array<{
    type: 'tighten' | 'loosen' | 'maintain';
    scope: string;
    reason: string;
    impact: string;
    confidence: number;
  }> {
    const recommendations: Array<{
      type: 'tighten' | 'loosen' | 'maintain';
      scope: string;
      reason: string;
      impact: string;
      confidence: number;
    }> = [];

    // Analyze privacy mode toggle frequency
    if (this.model.comfort_zones.privacy_mode_toggles > 5) {
      recommendations.push({
        type: 'tighten',
        scope: 'telemetry',
        reason: `User has toggled privacy mode ${this.model.comfort_zones.privacy_mode_toggles} times`,
        impact: 'Suggests user wants stricter defaults',
        confidence: 0.8,
      });
    }

    // Analyze learned preferences
    if (this.model.learned_preferences.always_blocks.length > 3) {
      recommendations.push({
        type: 'tighten',
        scope: 'all',
        reason: `User consistently blocks ${this.model.learned_preferences.always_blocks.length} types of access`,
        impact: 'Apply stricter defaults for these patterns',
        confidence: 0.9,
      });
    }

    // Analyze risk tolerance
    if (this.model.comfort_zones.risk_tolerance === 'low') {
      recommendations.push({
        type: 'tighten',
        scope: 'external',
        reason: 'User has low risk tolerance',
        impact: 'Stricter external API access controls',
        confidence: 0.7,
      });
    }

    // Suggest loosening if user always allows
    if (this.model.learned_preferences.always_allows.length > 5) {
      const alwaysAllowed = this.model.learned_preferences.always_allows.slice(0, 3);
      recommendations.push({
        type: 'loosen',
        scope: alwaysAllowed.join(', '),
        reason: `User consistently allows these: ${alwaysAllowed.join(', ')}`,
        impact: 'May reduce unnecessary prompts',
        confidence: 0.6,
      });
    }

    return recommendations;
  }

  /**
   * Adjust risk weights adaptively
   */
  adjustRiskWeights(): Record<string, number> {
    const weights: Record<string, number> = {};

    // Adjust based on learned preferences
    this.model.learned_preferences.always_blocks.forEach(blocked => {
      weights[blocked] = (weights[blocked] || 0.5) + 0.2;
    });

    this.model.learned_preferences.always_allows.forEach(allowed => {
      weights[allowed] = Math.max(0.1, (weights[allowed] || 0.5) - 0.1);
    });

    // Adjust based on privacy mode toggles
    if (this.model.comfort_zones.privacy_mode_toggles > 3) {
      weights['global'] = (weights['global'] || 0.5) + 0.1;
    }

    return weights;
  }

  /**
   * Get user's comfort zone
   */
  getComfortZone(): {
    risk_tolerance: string;
    privacy_mode_frequency: number;
    signals_disabled: string[];
  } {
    return {
      risk_tolerance: this.model.comfort_zones.risk_tolerance,
      privacy_mode_frequency: this.model.comfort_zones.privacy_mode_toggles,
      signals_disabled: this.model.comfort_zones.signals_disabled,
    };
  }

  /**
   * Export trust fabric model
   */
  exportModel(): TrustFabricModel {
    return { ...this.model };
  }

  /**
   * Import trust fabric model
   */
  importModel(model: TrustFabricModel): void {
    this.model = { ...model };
    this.saveModel();
  }

  /**
   * Save model to disk
   */
  private saveModel(): void {
    try {
      const fs = require('fs');
      const path = require('path');
      const dir = path.dirname(this.modelPath);
      if (!existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.modelPath, JSON.stringify(this.model, null, 2), 'utf-8');
    } catch (error) {
      console.error('[TRUST FABRIC] Failed to save model:', error);
    }
  }
}

export const trustFabricAI = new TrustFabricAI();
