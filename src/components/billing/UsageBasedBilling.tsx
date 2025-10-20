import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Calculator,
  Clock,
  Zap,
  Database,
  Users,
  Shield,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PieChart
} from 'lucide-react';

export interface BillingMetric {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  currentUsage: number;
  monthlyLimit: number;
  overagePrice: number;
  category: 'compute' | 'storage' | 'api' | 'ai' | 'users';
  icon: React.ReactNode;
}

export interface BillingPeriod {
  id: string;
  startDate: string;
  endDate: string;
  status: 'current' | 'previous' | 'upcoming';
  totalCost: number;
  baseCost: number;
  overageCost: number;
  metrics: BillingMetric[];
}

export interface BillingProjection {
  currentMonth: number;
  projectedMonth: number;
  projectedYear: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
}

const mockBillingMetrics: BillingMetric[] = [
  {
    id: 'workflow-executions',
    name: 'Workflow Executions',
    unit: 'execution',
    pricePerUnit: 0.01,
    currentUsage: 7500,
    monthlyLimit: 10000,
    overagePrice: 0.02,
    category: 'compute',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'api-calls',
    name: 'API Calls',
    unit: 'call',
    pricePerUnit: 0.001,
    currentUsage: 8500,
    monthlyLimit: 10000,
    overagePrice: 0.002,
    category: 'api',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'storage',
    name: 'Data Storage',
    unit: 'GB',
    pricePerUnit: 0.10,
    currentUsage: 6.2,
    monthlyLimit: 10,
    overagePrice: 0.15,
    category: 'storage',
    icon: <Database className="w-5 h-5" />
  },
  {
    id: 'ai-processing',
    name: 'AI Processing',
    unit: 'minute',
    pricePerUnit: 0.05,
    currentUsage: 120,
    monthlyLimit: 200,
    overagePrice: 0.08,
    category: 'ai',
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    id: 'team-members',
    name: 'Team Members',
    unit: 'user',
    pricePerUnit: 5.00,
    currentUsage: 8,
    monthlyLimit: 10,
    overagePrice: 8.00,
    category: 'users',
    icon: <Users className="w-5 h-5" />
  }
];

const mockBillingPeriods: BillingPeriod[] = [
  {
    id: '2024-01',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'current',
    totalCost: 127.50,
    baseCost: 99.00,
    overageCost: 28.50,
    metrics: mockBillingMetrics
  },
  {
    id: '2023-12',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    status: 'previous',
    totalCost: 115.20,
    baseCost: 99.00,
    overageCost: 16.20,
    metrics: mockBillingMetrics.map(m => ({ ...m, currentUsage: m.currentUsage * 0.8 }))
  },
  {
    id: '2023-11',
    startDate: '2023-11-01',
    endDate: '2023-11-30',
    status: 'previous',
    totalCost: 99.00,
    baseCost: 99.00,
    overageCost: 0.00,
    metrics: mockBillingMetrics.map(m => ({ ...m, currentUsage: m.monthlyLimit * 0.7 }))
  }
];

export const UsageBasedBilling: React.FC = () => {
  const [currentPeriod, setCurrentPeriod] = useState<BillingPeriod>(mockBillingPeriods[0]);
  const [billingProjection, setBillingProjection] = useState<BillingProjection>({
    currentMonth: 127.50,
    projectedMonth: 145.30,
    projectedYear: 1680.00,
    trend: 'increasing',
    confidence: 85
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateMetricCost = (metric: BillingMetric) => {
    const baseUsage = Math.min(metric.currentUsage, metric.monthlyLimit);
    const overageUsage = Math.max(0, metric.currentUsage - metric.monthlyLimit);
    
    const baseCost = baseUsage * metric.pricePerUnit;
    const overageCost = overageUsage * metric.overagePrice;
    
    return {
      baseCost,
      overageCost,
      totalCost: baseCost + overageCost
    };
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 90) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing': return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="w-8 h-8" />
            Usage-Based Billing
          </h1>
          <p className="text-gray-600 mt-1">Track usage, monitor costs, and optimize spending</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Current Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Month</p>
                <p className="text-2xl font-bold">{formatCurrency(currentPeriod.totalCost)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                Base: {formatCurrency(currentPeriod.baseCost)} | 
                Overage: {formatCurrency(currentPeriod.overageCost)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projected Month</p>
                <p className="text-2xl font-bold">{formatCurrency(billingProjection.projectedMonth)}</p>
              </div>
              <Calculator className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-gray-600">
                {getTrendIcon(billingProjection.trend)}
                <span className="ml-1">
                  {billingProjection.trend === 'increasing' ? '+' : '-'}
                  {formatCurrency(Math.abs(billingProjection.projectedMonth - billingProjection.currentMonth))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projected Year</p>
                <p className="text-2xl font-bold">{formatCurrency(billingProjection.projectedYear)}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                Confidence: {billingProjection.confidence}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overage Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {((currentPeriod.overageCost / currentPeriod.totalCost) * 100).toFixed(1)}%
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                {formatCurrency(currentPeriod.overageCost)} overage
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Usage</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Current Month Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentPeriod.metrics.map((metric) => {
                  const costs = calculateMetricCost(metric);
                  const usagePercentage = getUsagePercentage(metric.currentUsage, metric.monthlyLimit);
                  const isOverLimit = metric.currentUsage > metric.monthlyLimit;
                  
                  return (
                    <div key={metric.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {metric.icon}
                          <div>
                            <h4 className="font-semibold">{metric.name}</h4>
                            <p className="text-sm text-gray-600">
                              {metric.currentUsage.toLocaleString()} {metric.unit}s used
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatCurrency(costs.totalCost)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatCurrency(metric.pricePerUnit)}/{metric.unit}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Usage</span>
                          <span className={getUsageColor(usagePercentage)}>
                            {metric.currentUsage.toLocaleString()}/{metric.monthlyLimit.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={usagePercentage} className="h-2" />
                        
                        {isOverLimit && (
                          <div className="flex justify-between text-sm text-red-600">
                            <span>Overage</span>
                            <span>{formatCurrency(costs.overageCost)}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Base Cost:</span>
                          <span className="ml-2 font-medium">{formatCurrency(costs.baseCost)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Overage Cost:</span>
                          <span className="ml-2 font-medium text-red-600">{formatCurrency(costs.overageCost)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBillingPeriods.map((period) => (
                  <div key={period.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {formatDate(period.startDate)} - {formatDate(period.endDate)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Base: {formatCurrency(period.baseCost)} | 
                          Overage: {formatCurrency(period.overageCost)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{formatCurrency(period.totalCost)}</div>
                        <Badge 
                          variant={period.status === 'current' ? 'default' : 'outline'}
                          className="mt-1"
                        >
                          {period.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Usage Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {billingProjection.trend === 'increasing' ? '+' : '-'}
                      {Math.abs(((billingProjection.projectedMonth - billingProjection.currentMonth) / billingProjection.currentMonth) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Month-over-month change</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Month:</span>
                      <span className="font-medium">{formatCurrency(billingProjection.currentMonth)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Projected Month:</span>
                      <span className="font-medium">{formatCurrency(billingProjection.projectedMonth)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Projected Year:</span>
                      <span className="font-medium">{formatCurrency(billingProjection.projectedYear)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentPeriod.metrics.map((metric) => {
                    const costs = calculateMetricCost(metric);
                    const percentage = (costs.totalCost / currentPeriod.totalCost) * 100;
                    
                    return (
                      <div key={metric.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {metric.icon}
                          <span className="text-sm">{metric.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-16 text-right">
                            {formatCurrency(costs.totalCost)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Cost Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">High API Usage</h4>
                    <p className="text-sm text-yellow-700">
                      Consider implementing caching to reduce API calls by up to 30%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Storage Optimization</h4>
                    <p className="text-sm text-blue-700">
                      Archive old data to reduce storage costs by $15/month
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Workflow Efficiency</h4>
                    <p className="text-sm text-green-700">
                      Optimize workflow schedules to reduce execution costs
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};