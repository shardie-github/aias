import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Star,
  Download,
  Upload,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  CreditCard,
  Award,
  Target,
  Zap
} from 'lucide-react';

export interface MarketplaceItem {
  id: string;
  name: string;
  type: 'template' | 'app' | 'agent' | 'integration';
  category: string;
  price: number;
  creator: string;
  creatorId: string;
  sales: number;
  revenue: number;
  commission: number;
  rating: number;
  status: 'active' | 'pending' | 'rejected' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface CommissionTier {
  id: string;
  name: string;
  minSales: number;
  maxSales: number;
  commissionRate: number;
  benefits: string[];
  color: string;
}

export interface Payout {
  id: string;
  creatorId: string;
  creatorName: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  period: string;
  items: number;
  createdAt: string;
  processedAt?: string;
}

const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: 'item-001',
    name: 'Lead Scoring Workflow',
    type: 'template',
    category: 'Sales Automation',
    price: 49.99,
    creator: 'John Smith',
    creatorId: 'creator-001',
    sales: 127,
    revenue: 6348.73,
    commission: 1904.62,
    rating: 4.8,
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z'
  },
  {
    id: 'item-002',
    name: 'Customer Service AI Agent',
    type: 'agent',
    category: 'AI Agents',
    price: 199.99,
    creator: 'Sarah Johnson',
    creatorId: 'creator-002',
    sales: 45,
    revenue: 8999.55,
    commission: 2699.87,
    rating: 4.9,
    status: 'active',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: 'item-003',
    name: 'Email Marketing Automation',
    type: 'app',
    category: 'Marketing',
    price: 79.99,
    creator: 'Mike Chen',
    creatorId: 'creator-003',
    sales: 89,
    revenue: 7119.11,
    commission: 2135.73,
    rating: 4.6,
    status: 'active',
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-01-19T13:30:00Z'
  },
  {
    id: 'item-004',
    name: 'CRM Integration Package',
    type: 'integration',
    category: 'Integrations',
    price: 149.99,
    creator: 'Emily Davis',
    creatorId: 'creator-004',
    sales: 23,
    revenue: 3449.77,
    commission: 1034.93,
    rating: 4.7,
    status: 'active',
    createdAt: '2024-01-08T14:45:00Z',
    updatedAt: '2024-01-17T10:15:00Z'
  }
];

const commissionTiers: CommissionTier[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    minSales: 0,
    maxSales: 9,
    commissionRate: 30,
    benefits: ['30% commission', 'Basic analytics', 'Email support'],
    color: 'bg-amber-500'
  },
  {
    id: 'silver',
    name: 'Silver',
    minSales: 10,
    maxSales: 49,
    commissionRate: 35,
    benefits: ['35% commission', 'Advanced analytics', 'Priority support', 'Featured listing'],
    color: 'bg-gray-400'
  },
  {
    id: 'gold',
    name: 'Gold',
    minSales: 50,
    maxSales: 99,
    commissionRate: 40,
    benefits: ['40% commission', 'Premium analytics', 'Dedicated support', 'Marketing tools'],
    color: 'bg-yellow-500'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minSales: 100,
    maxSales: 999,
    commissionRate: 45,
    benefits: ['45% commission', 'Custom analytics', 'Account manager', 'Co-marketing opportunities'],
    color: 'bg-purple-500'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    minSales: 1000,
    maxSales: -1,
    commissionRate: 50,
    benefits: ['50% commission', 'White-label options', 'Revenue sharing', 'Partnership opportunities'],
    color: 'bg-blue-500'
  }
];

const mockPayouts: Payout[] = [
  {
    id: 'payout-001',
    creatorId: 'creator-001',
    creatorName: 'John Smith',
    amount: 1904.62,
    status: 'completed',
    period: '2024-01',
    items: 127,
    createdAt: '2024-01-31T23:59:59Z',
    processedAt: '2024-02-01T09:30:00Z'
  },
  {
    id: 'payout-002',
    creatorId: 'creator-002',
    creatorName: 'Sarah Johnson',
    amount: 2699.87,
    status: 'processing',
    period: '2024-01',
    items: 45,
    createdAt: '2024-01-31T23:59:59Z'
  },
  {
    id: 'payout-003',
    creatorId: 'creator-003',
    creatorName: 'Mike Chen',
    amount: 2135.73,
    status: 'pending',
    period: '2024-01',
    items: 89,
    createdAt: '2024-01-31T23:59:59Z'
  }
];

export const MarketplaceCommission: React.FC = () => {
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(mockMarketplaceItems);
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [platformRevenue, setPlatformRevenue] = useState(0);

  useEffect(() => {
    const revenue = marketplaceItems.reduce((sum, item) => sum + item.revenue, 0);
    const commissions = marketplaceItems.reduce((sum, item) => sum + item.commission, 0);
    const platform = revenue - commissions;
    
    setTotalRevenue(revenue);
    setTotalCommissions(commissions);
    setPlatformRevenue(platform);
  }, [marketplaceItems]);

  const getCreatorTier = (sales: number) => {
    return commissionTiers.find(tier => 
      sales >= tier.minSales && (tier.maxSales === -1 || sales <= tier.maxSales)
    ) || commissionTiers[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'template': return <Zap className="w-4 h-4" />;
      case 'app': return <ShoppingCart className="w-4 h-4" />;
      case 'agent': return <Users className="w-4 h-4" />;
      case 'integration': return <Settings className="w-4 h-4" />;
      default: return <ShoppingCart className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            Marketplace Commission System
          </h1>
          <p className="text-gray-600 mt-1">Manage marketplace items, commissions, and creator payouts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Commission Settings
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5% this month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Creator Commissions</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalCommissions)}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                {((totalCommissions / totalRevenue) * 100).toFixed(1)}% of revenue
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(platformRevenue)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                {((platformRevenue / totalRevenue) * 100).toFixed(1)}% of revenue
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Items</p>
                <p className="text-2xl font-bold text-orange-600">{marketplaceItems.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                {marketplaceItems.filter(item => item.status === 'active').length} active
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="items">Marketplace Items</TabsTrigger>
          <TabsTrigger value="commissions">Commission Tiers</TabsTrigger>
          <TabsTrigger value="payouts">Creator Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Marketplace Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketplaceItems.map((item) => {
                  const tier = getCreatorTier(item.sales);
                  const commissionRate = tier.commissionRate;
                  
                  return (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getTypeIcon(item.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                              <Badge variant="outline" className={tier.color}>
                                {tier.name}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              by {item.creator} • {item.category} • {item.type}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {item.rating}
                              </span>
                              <span>{item.sales} sales</span>
                              <span>{formatCurrency(item.price)} each</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(item.revenue)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Commission: {formatCurrency(item.commission)} ({commissionRate}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Commission Tiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissionTiers.map((tier) => (
                  <div key={tier.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${tier.color} rounded-lg flex items-center justify-center text-white`}>
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{tier.name}</h4>
                          <p className="text-sm text-gray-600">
                            {tier.minSales === 0 ? '0' : tier.minSales}+ sales
                            {tier.maxSales !== -1 && ` - ${tier.maxSales} sales`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {tier.commissionRate}%
                        </div>
                        <div className="text-sm text-gray-600">commission rate</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Benefits:</h5>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Target className="w-3 h-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Creator Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div key={payout.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{payout.creatorName}</h4>
                          <p className="text-sm text-gray-600">
                            Period: {payout.period} • {payout.items} items
                          </p>
                          <p className="text-xs text-gray-500">
                            Created: {formatDate(payout.createdAt)}
                            {payout.processedAt && ` • Processed: ${formatDate(payout.processedAt)}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(payout.amount)}
                        </div>
                        <Badge className={getStatusColor(payout.status)}>
                          {payout.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Creator Commissions</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(totalCommissions / totalRevenue) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {formatCurrency(totalCommissions)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Platform Revenue</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(platformRevenue / totalRevenue) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {formatCurrency(platformRevenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketplaceItems
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">#{index + 1}</span>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.revenue)}
                        </span>
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