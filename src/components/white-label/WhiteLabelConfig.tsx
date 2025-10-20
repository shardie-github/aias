import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Palette, 
  Settings, 
  Globe, 
  Upload,
  Download,
  Eye,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Image,
  Type,
  Layout,
  Zap,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';

export interface WhiteLabelConfig {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'pending';
  branding: {
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    customCss: string;
  };
  content: {
    companyName: string;
    tagline: string;
    description: string;
    contactEmail: string;
    supportEmail: string;
    privacyPolicy: string;
    termsOfService: string;
  };
  features: {
    customDomain: boolean;
    customEmail: boolean;
    customAnalytics: boolean;
    customIntegrations: boolean;
    removeBranding: boolean;
    customWorkflows: boolean;
    apiAccess: boolean;
    whiteLabelSupport: boolean;
  };
  deployment: {
    subdomain: string;
    customDomain?: string;
    sslEnabled: boolean;
    cdnEnabled: boolean;
    region: string;
    lastDeployed: string;
  };
  analytics: {
    googleAnalytics?: string;
    customTracking?: string;
    heatmaps: boolean;
    userBehavior: boolean;
  };
}

const mockWhiteLabelConfigs: WhiteLabelConfig[] = [
  {
    id: 'wl-001',
    name: 'TechCorp Automation Platform',
    domain: 'automation.techcorp.com',
    status: 'active',
    branding: {
      logo: '/logos/techcorp-logo.png',
      favicon: '/favicons/techcorp-favicon.ico',
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#3b82f6',
      fontFamily: 'Inter',
      customCss: '.custom-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }'
    },
    content: {
      companyName: 'TechCorp',
      tagline: 'Enterprise Automation Solutions',
      description: 'Transform your business with our cutting-edge automation platform',
      contactEmail: 'contact@techcorp.com',
      supportEmail: 'support@techcorp.com',
      privacyPolicy: 'https://techcorp.com/privacy',
      termsOfService: 'https://techcorp.com/terms'
    },
    features: {
      customDomain: true,
      customEmail: true,
      customAnalytics: true,
      customIntegrations: true,
      removeBranding: true,
      customWorkflows: true,
      apiAccess: true,
      whiteLabelSupport: true
    },
    deployment: {
      subdomain: 'techcorp',
      customDomain: 'automation.techcorp.com',
      sslEnabled: true,
      cdnEnabled: true,
      region: 'us-east-1',
      lastDeployed: '2024-01-23T10:30:00Z'
    },
    analytics: {
      googleAnalytics: 'GA-123456789',
      customTracking: 'techcorp-tracking.js',
      heatmaps: true,
      userBehavior: true
    }
  },
  {
    id: 'wl-002',
    name: 'StartupFlow Platform',
    domain: 'platform.startupflow.io',
    status: 'pending',
    branding: {
      logo: '/logos/startupflow-logo.png',
      favicon: '/favicons/startupflow-favicon.ico',
      primaryColor: '#7c3aed',
      secondaryColor: '#5b21b6',
      accentColor: '#8b5cf6',
      fontFamily: 'Poppins',
      customCss: '.startup-theme { --primary: #7c3aed; --secondary: #5b21b6; }'
    },
    content: {
      companyName: 'StartupFlow',
      tagline: 'Scale Your Startup',
      description: 'The all-in-one platform for growing startups',
      contactEmail: 'hello@startupflow.io',
      supportEmail: 'help@startupflow.io',
      privacyPolicy: 'https://startupflow.io/privacy',
      termsOfService: 'https://startupflow.io/terms'
    },
    features: {
      customDomain: true,
      customEmail: false,
      customAnalytics: true,
      customIntegrations: false,
      removeBranding: true,
      customWorkflows: false,
      apiAccess: true,
      whiteLabelSupport: false
    },
    deployment: {
      subdomain: 'startupflow',
      customDomain: 'platform.startupflow.io',
      sslEnabled: true,
      cdnEnabled: false,
      region: 'us-west-2',
      lastDeployed: '2024-01-20T15:45:00Z'
    },
    analytics: {
      googleAnalytics: 'GA-987654321',
      heatmaps: false,
      userBehavior: true
    }
  }
];

export const WhiteLabelConfig: React.FC = () => {
  const [configs, setConfigs] = useState<WhiteLabelConfig[]>(mockWhiteLabelConfigs);
  const [selectedConfig, setSelectedConfig] = useState<WhiteLabelConfig | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
  };

  const handleDeploy = async (configId: string) => {
    setIsDeploying(true);
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    setConfigs(prev => prev.map(config => 
      config.id === configId 
        ? { 
            ...config, 
            status: 'active',
            deployment: { ...config.deployment, lastDeployed: new Date().toISOString() }
          }
        : config
    ));
    setIsDeploying(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedConfig) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Palette className="w-8 h-8" />
              White-Label Configuration
            </h1>
            <p className="text-gray-600 mt-1">{selectedConfig.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSelectedConfig(null)}
              variant="outline"
            >
              ← Back to Configurations
            </Button>
            <Button
              onClick={() => handleDeploy(selectedConfig.id)}
              disabled={isDeploying || selectedConfig.status === 'active'}
            >
              {isDeploying ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {isDeploying ? 'Deploying...' : 'Deploy Changes'}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="branding" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Visual Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Logo</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">Upload your logo</p>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Favicon</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">Upload favicon (32x32px)</p>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={selectedConfig.branding.primaryColor}
                          className="w-16 h-10"
                        />
                        <Input
                          value={selectedConfig.branding.primaryColor}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Secondary Color</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={selectedConfig.branding.secondaryColor}
                          className="w-16 h-10"
                        />
                        <Input
                          value={selectedConfig.branding.secondaryColor}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={selectedConfig.branding.accentColor}
                          className="w-16 h-10"
                        />
                        <Input
                          value={selectedConfig.branding.accentColor}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Font Family</label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="Inter">Inter</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Custom CSS</label>
                  <Textarea
                    value={selectedConfig.branding.customCss}
                    placeholder="Enter custom CSS..."
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Content & Copy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company Name</label>
                    <Input value={selectedConfig.content.companyName} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tagline</label>
                    <Input value={selectedConfig.content.tagline} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={selectedConfig.content.description}
                    placeholder="Enter platform description..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contact Email</label>
                    <Input value={selectedConfig.content.contactEmail} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Support Email</label>
                    <Input value={selectedConfig.content.supportEmail} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Privacy Policy URL</label>
                    <Input value={selectedConfig.content.privacyPolicy} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Terms of Service URL</label>
                    <Input value={selectedConfig.content.termsOfService} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Feature Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(selectedConfig.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {getFeatureDescription(feature)}
                        </p>
                      </div>
                      <Switch checked={enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Deployment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subdomain</label>
                    <Input value={selectedConfig.deployment.subdomain} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Custom Domain</label>
                    <Input value={selectedConfig.deployment.customDomain || ''} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Region</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="us-east-1">US East (N. Virginia)</option>
                      <option value="us-west-2">US West (Oregon)</option>
                      <option value="eu-west-1">Europe (Ireland)</option>
                      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Deployed</label>
                    <Input 
                      value={formatDate(selectedConfig.deployment.lastDeployed)} 
                      disabled 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">SSL Certificate</h4>
                      <p className="text-sm text-gray-600">Enable HTTPS for secure connections</p>
                    </div>
                    <Switch checked={selectedConfig.deployment.sslEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">CDN</h4>
                      <p className="text-sm text-gray-600">Enable content delivery network for faster loading</p>
                    </div>
                    <Switch checked={selectedConfig.deployment.cdnEnabled} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Google Analytics ID</label>
                  <Input value={selectedConfig.analytics.googleAnalytics || ''} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Custom Tracking Code</label>
                  <Textarea
                    value={selectedConfig.analytics.customTracking || ''}
                    placeholder="Enter custom tracking JavaScript..."
                    className="min-h-[100px] font-mono text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Heatmaps</h4>
                      <p className="text-sm text-gray-600">Track user interactions and clicks</p>
                    </div>
                    <Switch checked={selectedConfig.analytics.heatmaps} />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">User Behavior Tracking</h4>
                      <p className="text-sm text-gray-600">Monitor user journeys and behavior patterns</p>
                    </div>
                    <Switch checked={selectedConfig.analytics.userBehavior} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="w-8 h-8" />
            White-Label Configurations
          </h1>
          <p className="text-gray-600 mt-1">Manage white-label deployments and custom branding</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            New Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.map((config) => (
          <Card key={config.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{config.name}</CardTitle>
                <Badge className={getStatusColor(config.status)}>
                  {config.status}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm">{config.domain}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4" />
                  {config.deployment.customDomain || `${config.deployment.subdomain}.aias.com`}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  {config.deployment.sslEnabled ? 'SSL Enabled' : 'SSL Disabled'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4" />
                  {config.analytics.googleAnalytics ? 'Analytics Enabled' : 'No Analytics'}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>Last Deployed</span>
                  <span>{formatDate(config.deployment.lastDeployed)}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedConfig(config)}
                    className="flex-1"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeploy(config.id)}
                    disabled={isDeploying || config.status === 'active'}
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const getFeatureDescription = (feature: string): string => {
  const descriptions: Record<string, string> = {
    customDomain: 'Use your own domain name for the platform',
    customEmail: 'Custom email addresses for notifications and support',
    customAnalytics: 'Integrate your own analytics and tracking',
    customIntegrations: 'Add custom third-party integrations',
    removeBranding: 'Remove all AIAS branding and references',
    customWorkflows: 'Create custom workflow templates',
    apiAccess: 'Full API access for custom integrations',
    whiteLabelSupport: 'Dedicated white-label support team'
  };
  return descriptions[feature] || 'Feature description not available';
};