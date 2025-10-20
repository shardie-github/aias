import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Shield, 
  Zap, 
  Users, 
  Database, 
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  Star,
  Building,
  Settings,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'starter' | 'professional' | 'enterprise' | 'custom';
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: {
    workflows: number;
    executions: number;
    storage: number; // in GB
    users: number;
    apiCalls: number;
    aiAgents: number;
  };
  restrictions: string[];
  color: string;
  icon: React.ReactNode;
}

export interface UsageMetrics {
  workflows: { used: number; limit: number };
  executions: { used: number; limit: number };
  storage: { used: number; limit: number };
  users: { used: number; limit: number };
  apiCalls: { used: number; limit: number };
  aiAgents: { used: number; limit: number };
}

export interface FeatureGate {
  feature: string;
  allowed: boolean;
  reason?: string;
  upgradeRequired?: string;
  usageLimit?: number;
  currentUsage?: number;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tier: 'starter',
    price: { monthly: 29, yearly: 290 },
    features: [
      '5 Workflows',
      '1,000 Executions/month',
      '1GB Storage',
      '3 Team Members',
      'Basic AI Agents',
      'Email Support'
    ],
    limits: {
      workflows: 5,
      executions: 1000,
      storage: 1,
      users: 3,
      apiCalls: 1000,
      aiAgents: 2
    },
    restrictions: ['No API access', 'Limited integrations', 'Basic analytics'],
    color: 'bg-blue-500',
    icon: <Star className="w-6 h-6" />
  },
  {
    id: 'professional',
    name: 'Professional',
    tier: 'professional',
    price: { monthly: 99, yearly: 990 },
    features: [
      '25 Workflows',
      '10,000 Executions/month',
      '10GB Storage',
      '10 Team Members',
      'Advanced AI Agents',
      'Priority Support',
      'API Access',
      'Advanced Analytics'
    ],
    limits: {
      workflows: 25,
      executions: 10000,
      storage: 10,
      users: 10,
      apiCalls: 10000,
      aiAgents: 10
    },
    restrictions: ['Limited white-labeling', 'Standard SLA'],
    color: 'bg-purple-500',
    icon: <Crown className="w-6 h-6" />
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    price: { monthly: 299, yearly: 2990 },
    features: [
      'Unlimited Workflows',
      '100,000 Executions/month',
      '100GB Storage',
      'Unlimited Team Members',
      'Custom AI Agents',
      '24/7 Support',
      'Full API Access',
      'Custom Integrations',
      'White-labeling',
      'SLA Guarantee'
    ],
    limits: {
      workflows: -1, // unlimited
      executions: 100000,
      storage: 100,
      users: -1, // unlimited
      apiCalls: 100000,
      aiAgents: -1 // unlimited
    },
    restrictions: [],
    color: 'bg-gold-500',
    icon: <Building className="w-6 h-6" />
  }
];

export const SubscriptionEnforcement: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(subscriptionPlans[1]); // Professional
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics>({
    workflows: { used: 18, limit: 25 },
    executions: { used: 7500, limit: 10000 },
    storage: { used: 6.2, limit: 10 },
    users: { used: 8, limit: 10 },
    apiCalls: { used: 8500, limit: 10000 },
    aiAgents: { used: 7, limit: 10 }
  });
  const [featureGates, setFeatureGates] = useState<FeatureGate[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    // Check feature access based on current plan and usage
    const gates: FeatureGate[] = [
      {
        feature: 'Advanced Analytics',
        allowed: currentPlan.tier === 'professional' || currentPlan.tier === 'enterprise',
        reason: currentPlan.tier === 'starter' ? 'Available in Professional plan and above' : undefined
      },
      {
        feature: 'API Access',
        allowed: currentPlan.tier === 'professional' || currentPlan.tier === 'enterprise',
        reason: currentPlan.tier === 'starter' ? 'Available in Professional plan and above' : undefined
      },
      {
        feature: 'White-labeling',
        allowed: currentPlan.tier === 'enterprise',
        reason: currentPlan.tier !== 'enterprise' ? 'Available in Enterprise plan only' : undefined
      },
      {
        feature: 'Custom AI Agents',
        allowed: currentPlan.tier === 'enterprise',
        reason: currentPlan.tier !== 'enterprise' ? 'Available in Enterprise plan only' : undefined
      },
      {
        feature: 'Create New Workflow',
        allowed: usageMetrics.workflows.used < usageMetrics.workflows.limit,
        reason: usageMetrics.workflows.used >= usageMetrics.workflows.limit ? 'Workflow limit reached' : undefined,
        usageLimit: usageMetrics.workflows.limit,
        currentUsage: usageMetrics.workflows.used
      },
      {
        feature: 'Add Team Member',
        allowed: usageMetrics.users.used < usageMetrics.users.limit,
        reason: usageMetrics.users.used >= usageMetrics.users.limit ? 'User limit reached' : undefined,
        usageLimit: usageMetrics.users.limit,
        currentUsage: usageMetrics.users.used
      }
    ];
    setFeatureGates(gates);
  }, [currentPlan, usageMetrics]);

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUsageStatus = (used: number, limit: number) => {
    if (limit === -1) return { status: 'unlimited', color: 'text-green-600' };
    const percentage = (used / limit) * 100;
    if (percentage >= 100) return { status: 'limit_reached', color: 'text-red-600' };
    if (percentage >= 90) return { status: 'near_limit', color: 'text-yellow-600' };
    return { status: 'normal', color: 'text-green-600' };
  };

  const handleUpgrade = (planId: string) => {
    setIsUpgrading(true);
    // Simulate upgrade process
    setTimeout(() => {
      const newPlan = subscriptionPlans.find(p => p.id === planId);
      if (newPlan) {
        setCurrentPlan(newPlan);
        // Update limits based on new plan
        setUsageMetrics(prev => ({
          ...prev,
          workflows: { ...prev.workflows, limit: newPlan.limits.workflows },
          executions: { ...prev.executions, limit: newPlan.limits.executions },
          storage: { ...prev.storage, limit: newPlan.limits.storage },
          users: { ...prev.users, limit: newPlan.limits.users },
          apiCalls: { ...prev.apiCalls, limit: newPlan.limits.apiCalls },
          aiAgents: { ...prev.aiAgents, limit: newPlan.limits.aiAgents }
        }));
      }
      setIsUpgrading(false);
    }, 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="w-8 h-8" />
            Subscription & Usage Management
          </h1>
          <p className="text-gray-600 mt-1">Monitor usage, manage limits, and control feature access</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Billing Settings
          </Button>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Current Plan: {currentPlan.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${currentPlan.color} rounded-lg flex items-center justify-center text-white`}>
                {currentPlan.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
                <p className="text-gray-600">
                  ${currentPlan.price.monthly}/month or ${currentPlan.price.yearly}/year
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">Active</div>
              <div className="text-sm text-gray-600">Next billing: Feb 23, 2024</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold">Workflows</h4>
              </div>
              <Badge className={getUsageStatus(usageMetrics.workflows.used, usageMetrics.workflows.limit).color}>
                {usageMetrics.workflows.used}/{usageMetrics.workflows.limit === -1 ? '∞' : usageMetrics.workflows.limit}
              </Badge>
            </div>
            <Progress 
              value={getUsagePercentage(usageMetrics.workflows.used, usageMetrics.workflows.limit)} 
              className="h-2 mb-2" 
            />
            <div className="text-sm text-gray-600">
              {usageMetrics.workflows.limit === -1 ? 'Unlimited' : `${usageMetrics.workflows.used} of ${usageMetrics.workflows.limit} used`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold">Executions</h4>
              </div>
              <Badge className={getUsageStatus(usageMetrics.executions.used, usageMetrics.executions.limit).color}>
                {usageMetrics.executions.used.toLocaleString()}/{usageMetrics.executions.limit.toLocaleString()}
              </Badge>
            </div>
            <Progress 
              value={getUsagePercentage(usageMetrics.executions.used, usageMetrics.executions.limit)} 
              className="h-2 mb-2" 
            />
            <div className="text-sm text-gray-600">
              {usageMetrics.executions.used.toLocaleString()} of {usageMetrics.executions.limit.toLocaleString()} this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-500" />
                <h4 className="font-semibold">Storage</h4>
              </div>
              <Badge className={getUsageStatus(usageMetrics.storage.used, usageMetrics.storage.limit).color}>
                {usageMetrics.storage.used}GB/{usageMetrics.storage.limit}GB
              </Badge>
            </div>
            <Progress 
              value={getUsagePercentage(usageMetrics.storage.used, usageMetrics.storage.limit)} 
              className="h-2 mb-2" 
            />
            <div className="text-sm text-gray-600">
              {usageMetrics.storage.used}GB of {usageMetrics.storage.limit}GB used
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold">Team Members</h4>
              </div>
              <Badge className={getUsageStatus(usageMetrics.users.used, usageMetrics.users.limit).color}>
                {usageMetrics.users.used}/{usageMetrics.users.limit === -1 ? '∞' : usageMetrics.users.limit}
              </Badge>
            </div>
            <Progress 
              value={getUsagePercentage(usageMetrics.users.used, usageMetrics.users.limit)} 
              className="h-2 mb-2" 
            />
            <div className="text-sm text-gray-600">
              {usageMetrics.users.limit === -1 ? 'Unlimited' : `${usageMetrics.users.used} of ${usageMetrics.users.limit} used`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                <h4 className="font-semibold">API Calls</h4>
              </div>
              <Badge className={getUsageStatus(usageMetrics.apiCalls.used, usageMetrics.apiCalls.limit).color}>
                {usageMetrics.apiCalls.used.toLocaleString()}/{usageMetrics.apiCalls.limit.toLocaleString()}
              </Badge>
            </div>
            <Progress 
              value={getUsagePercentage(usageMetrics.apiCalls.used, usageMetrics.apiCalls.limit)} 
              className="h-2 mb-2" 
            />
            <div className="text-sm text-gray-600">
              {usageMetrics.apiCalls.used.toLocaleString()} of {usageMetrics.apiCalls.limit.toLocaleString()} this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-500" />
                <h4 className="font-semibold">AI Agents</h4>
              </div>
              <Badge className={getUsageStatus(usageMetrics.aiAgents.used, usageMetrics.aiAgents.limit).color}>
                {usageMetrics.aiAgents.used}/{usageMetrics.aiAgents.limit === -1 ? '∞' : usageMetrics.aiAgents.limit}
              </Badge>
            </div>
            <Progress 
              value={getUsagePercentage(usageMetrics.aiAgents.used, usageMetrics.aiAgents.limit)} 
              className="h-2 mb-2" 
            />
            <div className="text-sm text-gray-600">
              {usageMetrics.aiAgents.limit === -1 ? 'Unlimited' : `${usageMetrics.aiAgents.used} of ${usageMetrics.aiAgents.limit} used`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Gates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Feature Access Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featureGates.map((gate, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {gate.allowed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <h4 className="font-semibold">{gate.feature}</h4>
                    {gate.reason && (
                      <p className="text-sm text-gray-600">{gate.reason}</p>
                    )}
                    {gate.currentUsage !== undefined && gate.usageLimit && (
                      <p className="text-sm text-gray-600">
                        Usage: {gate.currentUsage}/{gate.usageLimit}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!gate.allowed && (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpgrade('enterprise')}
                      disabled={isUpgrading}
                    >
                      {isUpgrading ? 'Upgrading...' : 'Upgrade'}
                    </Button>
                  )}
                  {gate.allowed && (
                    <Badge variant="outline" className="text-green-600">
                      Available
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`border rounded-lg p-6 ${
                  plan.id === currentPlan.id ? 'border-blue-500 bg-blue-50' : 'hover:shadow-lg'
                } transition-shadow`}
              >
                <div className="text-center mb-4">
                  <div className={`w-12 h-12 ${plan.color} rounded-lg flex items-center justify-center text-white mx-auto mb-3`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="text-3xl font-bold mt-2">
                    ${plan.price.monthly}
                    <span className="text-lg text-gray-600">/month</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full"
                  variant={plan.id === currentPlan.id ? "outline" : "default"}
                  disabled={plan.id === currentPlan.id || isUpgrading}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {plan.id === currentPlan.id ? 'Current Plan' : 
                   isUpgrading ? 'Upgrading...' : 'Upgrade to ' + plan.name}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Alerts */}
      {Object.entries(usageMetrics).some(([_, metric]) => 
        metric.limit !== -1 && (metric.used / metric.limit) >= 0.9
      ) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You're approaching usage limits on several features. Consider upgrading your plan to avoid service interruptions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};