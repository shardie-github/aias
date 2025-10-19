/**
 * Privacy Compliance Component
 * Comprehensive cookie management and privacy controls
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Cookie, 
  Eye, 
  Settings, 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { privacyManager, PrivacySettings } from '@/lib/privacy';

interface CookieCategory {
  id: keyof PrivacySettings;
  name: string;
  description: string;
  required: boolean;
  cookies: string[];
  purpose: string;
  retention: string;
}

export const PrivacyCompliance: React.FC = () => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    analytics: false,
    marketing: false,
    functional: false,
    necessary: true, // Always true
    preferences: false,
    performance: false,
    social: false
  });
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [jurisdiction, setJurisdiction] = useState('EU');
  const [consentVersion, setConsentVersion] = useState('2.1');

  const cookieCategories: CookieCategory[] = [
    {
      id: 'necessary',
      name: 'Strictly Necessary',
      description: 'Essential cookies required for basic website functionality',
      required: true,
      cookies: ['session_id', 'csrf_token', 'auth_token'],
      purpose: 'Authentication, security, and basic functionality',
      retention: 'Session'
    },
    {
      id: 'functional',
      name: 'Functional',
      description: 'Cookies that enhance user experience and remember preferences',
      required: false,
      cookies: ['language_preference', 'theme_setting', 'user_preferences'],
      purpose: 'User experience customization and preference storage',
      retention: '1 year'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Cookies that help us understand how visitors interact with our website',
      required: false,
      cookies: ['_ga', '_gid', '_gat', 'analytics_id'],
      purpose: 'Website performance analysis and user behavior insights',
      retention: '2 years'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Cookies used to deliver relevant advertisements and track campaign performance',
      required: false,
      cookies: ['_fbp', 'ads_id', 'conversion_tracking', 'remarketing'],
      purpose: 'Targeted advertising and marketing campaign optimization',
      retention: '3 years'
    },
    {
      id: 'performance',
      name: 'Performance',
      description: 'Cookies that help us optimize website performance and loading times',
      required: false,
      cookies: ['performance_metrics', 'cache_preferences', 'cdn_settings'],
      purpose: 'Website optimization and performance monitoring',
      retention: '1 year'
    },
    {
      id: 'social',
      name: 'Social Media',
      description: 'Cookies from social media platforms for sharing and integration',
      required: false,
      cookies: ['social_sharing', 'social_login', 'social_widgets'],
      purpose: 'Social media integration and sharing functionality',
      retention: '5 years'
    },
    {
      id: 'preferences',
      name: 'Preferences',
      description: 'Cookies that store user preferences and settings',
      required: false,
      cookies: ['user_settings', 'display_preferences', 'notification_settings'],
      purpose: 'Personalized user experience and settings storage',
      retention: '1 year'
    }
  ];

  useEffect(() => {
    // Check if user has existing consent
    const existingConsent = localStorage.getItem('privacy_consent');
    if (!existingConsent) {
      setShowConsentBanner(true);
    } else {
      const consent = JSON.parse(existingConsent);
      setPrivacySettings(consent.settings);
      setJurisdiction(consent.jurisdiction);
    }
  }, []);

  const handleConsentChange = (category: keyof PrivacySettings, enabled: boolean) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    
    setPrivacySettings(prev => ({
      ...prev,
      [category]: enabled
    }));
  };

  const saveConsent = async () => {
    const consentData = await privacyManager.recordConsent(
      'current_user', // In real app, get from auth context
      privacySettings,
      {
        ipAddress: '127.0.0.1', // In real app, get actual IP
        userAgent: navigator.userAgent,
        jurisdiction
      }
    );

    localStorage.setItem('privacy_consent', JSON.stringify({
      settings: privacySettings,
      jurisdiction,
      consentId: consentData.id,
      timestamp: consentData.timestamp
    }));

    setShowConsentBanner(false);
  };

  const acceptAll = () => {
    setPrivacySettings({
      analytics: true,
      marketing: true,
      functional: true,
      necessary: true,
      preferences: true,
      performance: true,
      social: true
    });
    saveConsent();
  };

  const rejectAll = () => {
    setPrivacySettings({
      analytics: false,
      marketing: false,
      functional: false,
      necessary: true,
      preferences: false,
      performance: false,
      social: false
    });
    saveConsent();
  };

  const { toast } = useToast();

  const handleDataSubjectRequest = async (requestType: 'access' | 'portability' | 'erasure') => {
    try {
      const result = await privacyManager.handleDataSubjectRequest('current_user', requestType);
      toast({
        title: "Data Subject Request Processed",
        description: `Your ${requestType} request has been processed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error Processing Request",
        description: `Failed to process your ${requestType} request. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const getConsentStatus = () => {
    const enabledCount = Object.values(privacySettings).filter(Boolean).length;
    const totalCount = Object.keys(privacySettings).length;
    return { enabled: enabledCount, total: totalCount };
  };

  const consentStatus = getConsentStatus();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Consent Banner */}
      {showConsentBanner && (
        <Card className="fixed bottom-4 left-4 right-4 z-50 bg-white shadow-2xl border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Privacy & Cookie Consent
                </h3>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your experience, 
                  analyze site traffic, and personalize content. Your privacy is important to us.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={acceptAll} className="bg-blue-600 hover:bg-blue-700">
                    Accept All
                  </Button>
                  <Button onClick={rejectAll} variant="outline">
                    Reject All
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Customize
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Privacy & Cookie Settings</DialogTitle>
                      </DialogHeader>
                      <PrivacySettingsPanel 
                        settings={privacySettings}
                        onSettingsChange={setPrivacySettings}
                        onSave={saveConsent}
                        cookieCategories={cookieCategories}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Dashboard */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Privacy & Compliance</h2>
          <Badge variant="outline" className="text-sm">
            {consentStatus.enabled}/{consentStatus.total} Categories Enabled
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cookies">Cookie Settings</TabsTrigger>
            <TabsTrigger value="rights">Your Rights</TabsTrigger>
            <TabsTrigger value="policy">Privacy Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                    Data Protection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Encryption</span>
                      <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Data Residency</span>
                      <Badge className="bg-blue-100 text-blue-800">EU</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Retention</span>
                      <Badge className="bg-purple-100 text-purple-800">2 Years</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Cookie className="h-5 w-5 text-orange-600" />
                    Cookie Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cookieCategories.map(category => (
                      <div key={category.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{category.name}</span>
                        <div className="flex items-center gap-2">
                          {privacySettings[category.id] ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                          )}
                          {category.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Your Rights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleDataSubjectRequest('access')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Access My Data
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleDataSubjectRequest('portability')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Data
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={() => handleDataSubjectRequest('erasure')}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete My Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cookies" className="space-y-6">
            <PrivacySettingsPanel 
              settings={privacySettings}
              onSettingsChange={setPrivacySettings}
              onSave={saveConsent}
              cookieCategories={cookieCategories}
            />
          </TabsContent>

          <TabsContent value="rights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Data Protection Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Right to Access</h4>
                    <p className="text-sm text-gray-600">
                      You have the right to request copies of your personal data.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Right to Rectification</h4>
                    <p className="text-sm text-gray-600">
                      You have the right to request correction of inaccurate personal data.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Right to Erasure</h4>
                    <p className="text-sm text-gray-600">
                      You have the right to request deletion of your personal data.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Right to Portability</h4>
                    <p className="text-sm text-gray-600">
                      You have the right to request transfer of your data to another service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700">
                    {privacyManager.getPrivacyPolicy(jurisdiction)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface PrivacySettingsPanelProps {
  settings: PrivacySettings;
  onSettingsChange: (settings: PrivacySettings) => void;
  onSave: () => void;
  cookieCategories: CookieCategory[];
}

const PrivacySettingsPanel: React.FC<PrivacySettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onSave,
  cookieCategories
}) => {
  const handleConsentChange = (category: keyof PrivacySettings, enabled: boolean) => {
    if (category === 'necessary') return;
    onSettingsChange({
      ...settings,
      [category]: enabled
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {cookieCategories.map(category => (
          <Card key={category.id} className={category.required ? 'border-blue-200 bg-blue-50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    {category.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div><strong>Purpose:</strong> {category.purpose}</div>
                    <div><strong>Retention:</strong> {category.retention}</div>
                    <div><strong>Cookies:</strong> {category.cookies.join(', ')}</div>
                  </div>
                </div>
                <div className="ml-4">
                  <Switch
                    checked={settings[category.id]}
                    onCheckedChange={(enabled) => handleConsentChange(category.id, enabled)}
                    disabled={category.required}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default PrivacyCompliance;