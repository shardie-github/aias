/**
 * Trust Badge System
 * Comprehensive security and compliance indicators
 */

import React, { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle, Award, Globe, Eye, FileText, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TrustBadge {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'verified' | 'pending' | 'expired';
  verificationDate: string;
  issuer: string;
  category: 'security' | 'compliance' | 'privacy' | 'performance';
  level: 'basic' | 'standard' | 'premium' | 'enterprise';
}

interface TrustMetrics {
  uptime: number;
  securityScore: number;
  complianceScore: number;
  dataProtectionLevel: string;
  lastAudit: string;
  certifications: number;
}

export const TrustBadges: React.FC = () => {
  const [badges, setBadges] = useState<TrustBadge[]>([]);
  const [metrics, setMetrics] = useState<TrustMetrics | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadTrustBadges();
    loadTrustMetrics();
  }, []);

  const loadTrustBadges = () => {
    const trustBadges: TrustBadge[] = [
      {
        id: 'soc2-type2',
        title: 'SOC 2 Type II',
        description: 'Audited security controls for availability, confidentiality, and processing integrity',
        icon: Shield,
        status: 'verified',
        verificationDate: '2024-01-15',
        issuer: 'AICPA',
        category: 'compliance',
        level: 'enterprise'
      },
      {
        id: 'iso27001',
        title: 'ISO 27001',
        description: 'International standard for information security management systems',
        icon: Lock,
        status: 'verified',
        verificationDate: '2024-02-01',
        issuer: 'ISO',
        category: 'security',
        level: 'enterprise'
      },
      {
        id: 'gdpr-compliant',
        title: 'GDPR Compliant',
        description: 'Full compliance with EU General Data Protection Regulation',
        icon: FileText,
        status: 'verified',
        verificationDate: '2024-01-01',
        issuer: 'EU Commission',
        category: 'privacy',
        level: 'premium'
      },
      {
        id: 'ccpa-compliant',
        title: 'CCPA Compliant',
        description: 'California Consumer Privacy Act compliance verified',
        icon: Eye,
        status: 'verified',
        verificationDate: '2024-01-01',
        issuer: 'California AG',
        category: 'privacy',
        level: 'premium'
      },
      {
        id: 'pci-dss',
        title: 'PCI DSS Level 1',
        description: 'Payment Card Industry Data Security Standard compliance',
        icon: CreditCard,
        status: 'verified',
        verificationDate: '2024-03-01',
        issuer: 'PCI Security Standards Council',
        category: 'security',
        level: 'enterprise'
      },
      {
        id: 'hipaa-ready',
        title: 'HIPAA Ready',
        description: 'Health Insurance Portability and Accountability Act compliance',
        icon: Heart,
        status: 'verified',
        verificationDate: '2024-02-15',
        issuer: 'HHS',
        category: 'compliance',
        level: 'enterprise'
      },
      {
        id: 'ssl-certificate',
        title: 'SSL/TLS Encryption',
        description: 'A+ rated SSL certificate with perfect forward secrecy',
        icon: Lock,
        status: 'verified',
        verificationDate: '2024-01-01',
        issuer: 'DigiCert',
        category: 'security',
        level: 'standard'
      },
      {
        id: 'uptime-sla',
        title: '99.9% Uptime SLA',
        description: 'Guaranteed service availability with financial backing',
        icon: Zap,
        status: 'verified',
        verificationDate: '2024-01-01',
        issuer: 'Internal SLA',
        category: 'performance',
        level: 'premium'
      },
      {
        id: 'penetration-test',
        title: 'Penetration Tested',
        description: 'Regular third-party security assessments and vulnerability testing',
        icon: Shield,
        status: 'verified',
        verificationDate: '2024-01-10',
        issuer: 'Security Firm',
        category: 'security',
        level: 'standard'
      },
      {
        id: 'data-residency',
        title: 'Data Residency Controls',
        description: 'Geographic data storage and processing controls',
        icon: Globe,
        status: 'verified',
        verificationDate: '2024-01-01',
        issuer: 'Internal Controls',
        category: 'privacy',
        level: 'premium'
      }
    ];

    setBadges(trustBadges);
  };

  const loadTrustMetrics = () => {
    setMetrics({
      uptime: 99.97,
      securityScore: 98,
      complianceScore: 96,
      dataProtectionLevel: 'Enterprise',
      lastAudit: '2024-01-15',
      certifications: 10
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'standard': return 'bg-green-100 text-green-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All', count: badges.length },
    { id: 'security', label: 'Security', count: badges.filter(b => b.category === 'security').length },
    { id: 'compliance', label: 'Compliance', count: badges.filter(b => b.category === 'compliance').length },
    { id: 'privacy', label: 'Privacy', count: badges.filter(b => b.category === 'privacy').length },
    { id: 'performance', label: 'Performance', count: badges.filter(b => b.category === 'performance').length }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Trust Metrics Overview */}
      {metrics && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Award className="h-8 w-8 text-blue-600" />
              Trust & Security Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{metrics.uptime}%</div>
                <div className="text-sm text-gray-600">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{metrics.securityScore}/100</div>
                <div className="text-sm text-gray-600">Security Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{metrics.complianceScore}/100</div>
                <div className="text-sm text-gray-600">Compliance Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{metrics.certifications}</div>
                <div className="text-sm text-gray-600">Certifications</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              Last Security Audit: {metrics.lastAudit} | Data Protection Level: {metrics.dataProtectionLevel}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.label}
            <Badge variant="secondary" className="ml-1">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Trust Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map(badge => {
          const IconComponent = badge.icon;
          return (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{badge.title}</CardTitle>
                            <p className="text-sm text-gray-600">{badge.issuer}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(badge.status)}>
                            {badge.status}
                          </Badge>
                          <Badge variant="outline" className={getLevelColor(badge.level)}>
                            {badge.level}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-4">{badge.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Verified: {badge.verificationDate}</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-2">
                    <div className="font-semibold">{badge.title}</div>
                    <div className="text-sm">{badge.description}</div>
                    <div className="text-xs text-gray-500">
                      Issued by: {badge.issuer}
                    </div>
                    <div className="text-xs text-gray-500">
                      Verified: {badge.verificationDate}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Security Statement */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Enterprise-Grade Security & Compliance
            </h3>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Our platform is built with security and compliance as foundational principles. 
              We maintain the highest standards of data protection, privacy, and security 
              through continuous monitoring, regular audits, and industry-leading certifications.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                End-to-End Encryption
              </span>
              <span className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                Zero-Trust Architecture
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Privacy by Design
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Global Compliance
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Additional icons for missing ones
const CreditCard = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const Heart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default TrustBadges;