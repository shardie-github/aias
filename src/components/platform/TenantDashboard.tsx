/**
 * Multi-Tenant SaaS Dashboard Component
 * Central hub for tenant management and platform overview
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Users, 
  Zap, 
  BarChart3, 
  Settings,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Shield,
  Bot,
  Workflow,
  Store,
  Activity
} from 'lucide-react';
import { Tenant, SubscriptionPlan, UsageMetrics, PlatformAnalytics } from '@/types/platform';

interface TenantDashboardProps {
  tenantId: string;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({ tenantId }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [usage, setUsage] = useState<UsageMetrics | null>(null);
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenantData();
  }, [tenantId]);

  const loadTenantData = async () => {
    // Mock data - replace with actual API calls
    const mockTenant: Tenant = {
      id: tenantId,
      name: 'Acme Corporation',
      subdomain: 'acme',
      plan: {
        id: 'pro-plan',
        name: 'Professional',
        description: 'Advanced automation for growing teams',
        priceMonthly: 99,
        priceYearly: 990,
        features: [
          '25 Workflows',
          '10,000 Executions/month',
          '10GB Storage',
          'Unlimited Users',
          'Priority Support',
          'Advanced Analytics'
        ],
        limits: {
          workflows: 25,
          executions: 10000,
          storage: 10,
          users: -1, // unlimited
          apiCalls: 50000,
          aiProcessing: 1000,
          customAgents: 5,
          integrations: 20
        },
        active: true,
        tier: 'professional'
      },
      features: ['workflows', 'ai_agents', 'integrations', 'analytics'],
      limits: {
        workflows: 25,
        executions: 10000,
        storage: 10,
        users: -1,
        apiCalls: 50000,
        aiProcessing: 1000,
        customAgents: 5,
        integrations: 20
      },
      billing: {
        status: 'active',
        nextBilling: new Date('2024-02-15'),
        amount: 99,
        currency: 'USD',
        paymentMethod: '**** 4242'
      },
      settings: {
        timezone: 'America/New_York',
        language: 'en',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sms: false,
          webhook: true,
          channels: ['general', 'alerts']
        },
        security: {
          twoFactorRequired: true,
          sessionTimeout: 480,
          ipWhitelist: [],
          allowedDomains: ['acme.com'],
          auditLogging: true
        },
        integrations: {
          allowedOrigins: ['https://acme.com'],
          webhookSecret: 'whsec_***',
          apiKeys: []
        }
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    };

    const mockUsage: UsageMetrics = {
      tenantId,
      period: '2024-01',
      workflows: 18,
      executions: 7500,
      apiCalls: 35000,
      aiProcessing: 450,
      storage: 6.2,
      users: 12,
      cost: 89.50,
      revenue: 99.00
    };

    const mockAnalytics: PlatformAnalytics = {
      totalTenants: 1250,
      activeTenants: 1180,
      totalRevenue: 125000,
      monthlyRecurringRevenue: 125000,
      averageRevenuePerUser: 105.93,
      churnRate: 2.1,
      customerAcquisitionCost: 185,
      lifetimeValue: 2840,
      netPromoterScore: 72
    };

    setTenant(mockTenant);
    setUsage(mockUsage);
    setAnalytics(mockAnalytics);
    setLoading(false);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tenant Not Found</h3>
        <p className="text-gray-600">The requested tenant could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
            <p className="text-gray-600">Professional Plan • {tenant.subdomain}.aias.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(tenant.billing.status)}>
            {tenant.billing.status === 'active' ? <CheckCircle className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
            {tenant.billing.status}
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-3xl font-bold text-gray-900">{usage?.workflows || 0}</p>
                <p className="text-sm text-gray-500">
                  of {tenant.limits.workflows === -1 ? '∞' : tenant.limits.workflows} limit
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Workflow className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            {tenant.limits.workflows !== -1 && (
              <div className="mt-3">
                <Progress 
                  value={getUsagePercentage(usage?.workflows || 0, tenant.limits.workflows)} 
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month's Executions</p>
                <p className="text-3xl font-bold text-gray-900">{(usage?.executions || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  of {tenant.limits.executions.toLocaleString()} limit
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3">
              <Progress 
                value={getUsagePercentage(usage?.executions || 0, tenant.limits.executions)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-gray-900">{usage?.users || 0}</p>
                <p className="text-sm text-gray-500">
                  {tenant.limits.users === -1 ? 'Unlimited' : `of ${tenant.limits.users} limit`}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-3xl font-bold text-gray-900">{usage?.storage?.toFixed(1) || 0} GB</p>
                <p className="text-sm text-gray-500">
                  of {tenant.limits.storage} GB limit
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-3">
              <Progress 
                value={getUsagePercentage(usage?.storage || 0, tenant.limits.storage)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Workflow "Lead Qualification" completed successfully</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New AI agent "Customer Support Bot" deployed</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Workflow className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Workflow "Email Automation" triggered 15 times</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{tenant.plan.name}</h3>
                      <p className="text-sm text-gray-600">{tenant.plan.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${tenant.plan.priceMonthly}</p>
                      <p className="text-sm text-gray-500">per month</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Plan Features:</h4>
                    <ul className="space-y-1">
                      {tenant.plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Next billing date:</span>
                      <span className="font-medium">{tenant.billing.nextBilling.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span>Payment method:</span>
                      <span className="font-medium">{tenant.billing.paymentMethod}</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Usage Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {((usage?.executions || 0) / tenant.limits.executions * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Execution Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {((usage?.apiCalls || 0) / tenant.limits.apiCalls * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">API Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {((usage?.aiProcessing || 0) / tenant.limits.aiProcessing * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">AI Processing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Workflows</h2>
            <Button>
              <Workflow className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </div>
          <div className="text-center py-8 text-gray-500">
            Workflow management interface coming soon...
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">AI Agents</h2>
            <Button>
              <Bot className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </div>
          <div className="text-center py-8 text-gray-500">
            AI agent management interface coming soon...
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Integrations</h2>
            <Button>
              <Globe className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>
          <div className="text-center py-8 text-gray-500">
            Integration marketplace coming soon...
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Billing & Usage</h2>
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Billing
            </Button>
          </div>
          <div className="text-center py-8 text-gray-500">
            Billing management interface coming soon...
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
          <div className="text-center py-8 text-gray-500">
            Settings management interface coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantDashboard;