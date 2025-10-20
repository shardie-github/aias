/**
 * Billing Dashboard Component
 * Comprehensive billing management with usage tracking, payment processing, and subscription management
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Settings,
  Shield,
  Calendar,
  BarChart3,
  PieChart,
  Receipt,
  Wallet,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface BillingDashboardProps {
  tenantId: string;
}

interface BillingData {
  currentPlan: {
    id: string;
    name: string;
    tier: 'starter' | 'professional' | 'enterprise';
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly';
    nextBilling: Date;
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  };
  usage: {
    period: string;
    workflows: { used: number; limit: number };
    executions: { used: number; limit: number };
    storage: { used: number; limit: number };
    apiCalls: { used: number; limit: number };
    aiProcessing: { used: number; limit: number };
    users: { used: number; limit: number };
  };
  billing: {
    currentBalance: number;
    nextInvoice: {
      amount: number;
      date: Date;
      items: Array<{
        description: string;
        amount: number;
        quantity: number;
      }>;
    };
    paymentMethod: {
      type: 'card' | 'bank' | 'paypal';
      last4: string;
      brand: string;
      expiryMonth: number;
      expiryYear: number;
    };
    billingAddress: {
      name: string;
      company: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  invoices: Array<{
    id: string;
    number: string;
    date: Date;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    downloadUrl: string;
  }>;
  revenue: {
    currentMonth: number;
    lastMonth: number;
    growth: number;
    breakdown: Array<{
      source: string;
      amount: number;
      percentage: number;
    }>;
  };
}

const BillingDashboard: React.FC<BillingDashboardProps> = ({ tenantId }) => {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBillingData();
  }, [tenantId]);

  const loadBillingData = async () => {
    // Mock data - replace with actual API calls
    const mockData: BillingData = {
      currentPlan: {
        id: 'pro-plan',
        name: 'Professional',
        tier: 'professional',
        price: 99,
        currency: 'USD',
        billingCycle: 'monthly',
        nextBilling: new Date('2024-02-15'),
        status: 'active'
      },
      usage: {
        period: '2024-01',
        workflows: { used: 18, limit: 25 },
        executions: { used: 7500, limit: 10000 },
        storage: { used: 6.2, limit: 10 },
        apiCalls: { used: 32000, limit: 50000 },
        aiProcessing: { used: 650, limit: 1000 },
        users: { used: 12, limit: -1 }
      },
      billing: {
        currentBalance: 0,
        nextInvoice: {
          amount: 99,
          date: new Date('2024-02-15'),
          items: [
            { description: 'Professional Plan - Monthly', amount: 99, quantity: 1 },
            { description: 'Overage - API Calls', amount: 0, quantity: 0 },
            { description: 'Overage - AI Processing', amount: 0, quantity: 0 }
          ]
        },
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025
        },
        billingAddress: {
          name: 'John Doe',
          company: 'Acme Corporation',
          address: '123 Business St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'US'
        }
      },
      invoices: [
        {
          id: 'inv-001',
          number: 'INV-2024-001',
          date: new Date('2024-01-15'),
          amount: 99,
          status: 'paid',
          downloadUrl: '/invoices/inv-001.pdf'
        },
        {
          id: 'inv-002',
          number: 'INV-2023-012',
          date: new Date('2023-12-15'),
          amount: 99,
          status: 'paid',
          downloadUrl: '/invoices/inv-002.pdf'
        },
        {
          id: 'inv-003',
          number: 'INV-2023-011',
          date: new Date('2023-11-15'),
          amount: 99,
          status: 'paid',
          downloadUrl: '/invoices/inv-003.pdf'
        }
      ],
      revenue: {
        currentMonth: 12500,
        lastMonth: 11800,
        growth: 5.9,
        breakdown: [
          { source: 'SaaS Subscriptions', amount: 8500, percentage: 68 },
          { source: 'Marketplace Sales', amount: 2500, percentage: 20 },
          { source: 'API Usage', amount: 1000, percentage: 8 },
          { source: 'Professional Services', amount: 500, percentage: 4 }
        ]
      }
    };

    setTimeout(() => {
      setBillingData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Billing Data Not Found</h3>
        <p className="text-gray-600">Unable to load billing information.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
            <p className="text-gray-600">Manage your subscription and billing information</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(billingData.currentPlan.status)}>
            {billingData.currentPlan.status.charAt(0).toUpperCase() + billingData.currentPlan.status.slice(1)}
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Billing Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Plan</p>
                <p className="text-2xl font-bold text-gray-900">{billingData.currentPlan.name}</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(billingData.currentPlan.price)} / {billingData.currentPlan.billingCycle}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Invoice</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(billingData.billing.nextInvoice.amount)}
                </p>
                <p className="text-sm text-gray-500">
                  Due {billingData.billing.nextInvoice.date.toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(billingData.revenue.currentMonth)}
                </p>
                <div className="flex items-center text-sm">
                  {billingData.revenue.growth > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={billingData.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(billingData.revenue.growth)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(billingData.billing.currentBalance)}
                </p>
                <p className="text-sm text-gray-500">Available credit</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Wallet className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Workflows</span>
                    <span className="text-sm text-gray-600">
                      {billingData.usage.workflows.used} / {billingData.usage.workflows.limit === -1 ? '∞' : billingData.usage.workflows.limit}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(billingData.usage.workflows.used, billingData.usage.workflows.limit)} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Executions</span>
                    <span className="text-sm text-gray-600">
                      {billingData.usage.executions.used.toLocaleString()} / {billingData.usage.executions.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(billingData.usage.executions.used, billingData.usage.executions.limit)} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-sm text-gray-600">
                      {billingData.usage.storage}GB / {billingData.usage.storage}GB
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(billingData.usage.storage, billingData.usage.storage)} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">API Calls</span>
                    <span className="text-sm text-gray-600">
                      {billingData.usage.apiCalls.used.toLocaleString()} / {billingData.usage.apiCalls.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(billingData.usage.apiCalls.used, billingData.usage.apiCalls.limit)} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Plan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {formatCurrency(billingData.currentPlan.price)}
                      <span className="text-lg text-gray-600">/{billingData.currentPlan.billingCycle}</span>
                    </div>
                    <div className="text-sm text-gray-600">{billingData.currentPlan.name} Plan</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Next billing date:</span>
                      <span className="font-medium">
                        {billingData.currentPlan.nextBilling.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Payment method:</span>
                      <span className="font-medium">
                        {billingData.billing.paymentMethod.brand} •••• {billingData.billing.paymentMethod.last4}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Status:</span>
                      <Badge className={getStatusColor(billingData.currentPlan.status)}>
                        {billingData.currentPlan.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      Change Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detailed Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(billingData.usage).map(([key, value]) => {
                  if (key === 'period') return null;
                  
                  const limit = value.limit;
                  const used = value.used;
                  const percentage = getUsagePercentage(used, limit);
                  
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-gray-600">
                          {used.toLocaleString()} / {limit === -1 ? '∞' : limit.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      {percentage > 80 && (
                        <p className="text-xs text-yellow-600 mt-1">
                          <AlertTriangle className="h-3 w-3 inline mr-1" />
                          Approaching limit
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Usage Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Analytics</h3>
                  <p className="text-gray-600 mb-4">Detailed usage analytics and trends</p>
                  <Button>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Next Invoice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Next Invoice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {formatCurrency(billingData.billing.nextInvoice.amount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Due {billingData.billing.nextInvoice.date.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {billingData.billing.nextInvoice.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{item.description}</span>
                        <span className="font-medium">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(billingData.billing.nextInvoice.amount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="font-medium">{billingData.billing.billingAddress.name}</div>
                  <div>{billingData.billing.billingAddress.company}</div>
                  <div>{billingData.billing.billingAddress.address}</div>
                  <div>
                    {billingData.billing.billingAddress.city}, {billingData.billing.billingAddress.state} {billingData.billing.billingAddress.zip}
                  </div>
                  <div>{billingData.billing.billingAddress.country}</div>
                </div>
                
                <div className="pt-4 border-t mt-4">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Invoice History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingData.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded">
                        <Receipt className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{invoice.number}</div>
                        <div className="text-sm text-gray-600">
                          {invoice.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {billingData.billing.paymentMethod.brand} •••• {billingData.billing.paymentMethod.last4}
                      </div>
                      <div className="text-sm text-gray-600">
                        Expires {billingData.billing.paymentMethod.expiryMonth}/{billingData.billing.paymentMethod.expiryYear}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Update Payment Method
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billingData.invoices.slice(0, 3).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{invoice.number}</div>
                        <div className="text-xs text-gray-600">
                          {invoice.date.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(invoice.amount)}</div>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(invoice.status)}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {formatCurrency(billingData.revenue.currentMonth)}
                    </div>
                    <div className="text-sm text-gray-600">This Month</div>
                    <div className="flex items-center justify-center text-sm mt-2">
                      {billingData.revenue.growth > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={billingData.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                        {Math.abs(billingData.revenue.growth)}% from last month
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billingData.revenue.breakdown.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{item.source}</span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingDashboard;
