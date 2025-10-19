/**
 * Main Platform Page
 * Entry point for the next-dimension AIAS platform
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantDashboard } from '@/components/platform/TenantDashboard';
import { WorkflowBuilder } from '@/components/platform/WorkflowBuilder';
import { Marketplace } from '@/components/platform/Marketplace';
import { AIAgentBuilder } from '@/components/platform/AIAgentBuilder';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Workflow, 
  Bot, 
  Store, 
  BarChart3, 
  Users, 
  Zap, 
  Globe,
  TrendingUp,
  Activity,
  CheckCircle,
  Star,
  Crown,
  Rocket
} from 'lucide-react';

const Platform: React.FC = () => {
  const [currentTenant, setCurrentTenant] = useState<string>('demo-tenant');
  const [platformStats, setPlatformStats] = useState({
    totalTenants: 1250,
    activeWorkflows: 8500,
    aiAgents: 3200,
    marketplaceItems: 450,
    totalRevenue: 125000,
    monthlyGrowth: 15.2
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <BrowserRouter>
        <Routes>
          {/* Platform Dashboard */}
          <Route path="/" element={<PlatformDashboard stats={platformStats} />} />
          
          {/* Tenant Management */}
          <Route path="/tenant/:tenantId" element={<TenantDashboard tenantId={currentTenant} />} />
          
          {/* Workflow Builder */}
          <Route path="/workflows" element={<WorkflowBuilder />} />
          <Route path="/workflows/:workflowId" element={<WorkflowBuilder />} />
          
          {/* AI Agent Builder */}
          <Route path="/agents" element={<AIAgentBuilder />} />
          <Route path="/agents/:agentId" element={<AIAgentBuilder />} />
          
          {/* Marketplace */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:category" element={<Marketplace />} />
          
          {/* Redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      
      <Footer />
    </div>
  );
};

interface PlatformDashboardProps {
  stats: {
    totalTenants: number;
    activeWorkflows: number;
    aiAgents: number;
    marketplaceItems: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
}

const PlatformDashboard: React.FC<PlatformDashboardProps> = ({ stats }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AIAS Platform</h1>
            <p className="text-gray-600">Next-dimension automation and AI platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Crown className="h-4 w-4" />
            Enterprise
          </Badge>
          <Button>
            <Globe className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTenants.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +{stats.monthlyGrowth}% this month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeWorkflows.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Across all tenants</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Workflow className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Agents</p>
                <p className="text-3xl font-bold text-gray-900">{stats.aiAgents.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Deployed and running</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Marketplace Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.marketplaceItems}</p>
                <p className="text-sm text-gray-500">Templates and integrations</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Store className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Platform Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New tenant "TechCorp" onboarded</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Workflow className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Workflow "Lead Scoring" published to marketplace</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI Agent "Customer Support Bot" deployed</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Store className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New integration "Slack" added to marketplace</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ${stats.totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Platform Revenue</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SaaS Subscriptions</span>
                      <span className="font-medium">$85,000 (68%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Marketplace Sales</span>
                      <span className="font-medium">$25,000 (20%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Usage</span>
                      <span className="font-medium">$15,000 (12%)</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Monthly Growth:</span>
                      <span className="font-medium text-green-600">+{stats.monthlyGrowth}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
                  <Workflow className="h-6 w-6" />
                  <span>Create Workflow</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
                  <Bot className="h-6 w-6" />
                  <span>Build AI Agent</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
                  <Store className="h-6 w-6" />
                  <span>Browse Marketplace</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
                  <Globe className="h-6 w-6" />
                  <span>Add Integration</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="text-center py-8">
            <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Management</h3>
            <p className="text-gray-600 mb-4">Create, manage, and deploy automation workflows</p>
            <Button>
              <Workflow className="h-4 w-4 mr-2" />
              Go to Workflow Builder
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Agent Management</h3>
            <p className="text-gray-600 mb-4">Build, train, and deploy intelligent AI agents</p>
            <Button>
              <Bot className="h-4 w-4 mr-2" />
              Go to Agent Builder
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="text-center py-8">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketplace</h3>
            <p className="text-gray-600 mb-4">Discover and deploy automation solutions</p>
            <Button>
              <Store className="h-4 w-4 mr-2" />
              Browse Marketplace
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-4">Comprehensive platform analytics and insights</p>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Platform;