/**
 * Marketplace Component
 * Template, agent, and integration marketplace for the platform
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Heart,
  ShoppingCart,
  Eye,
  Share2,
  MoreHorizontal,
  Bot,
  Workflow,
  Globe,
  Zap,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Crown
} from 'lucide-react';
import { MarketplaceItem, WorkflowTemplate, AIAgent, Integration } from '@/types/platform';

interface MarketplaceProps {
  onItemSelect?: (item: MarketplaceItem) => void;
  onPurchase?: (item: MarketplaceItem) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onItemSelect, onPurchase }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Items', count: 0 },
    { id: 'templates', label: 'Templates', count: 0 },
    { id: 'agents', label: 'AI Agents', count: 0 },
    { id: 'integrations', label: 'Integrations', count: 0 },
    { id: 'apps', label: 'One-time Apps', count: 0 }
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'newest', label: 'Newest' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' }
  ];

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  const loadMarketplaceItems = async () => {
    // Mock data - replace with actual API calls
    const mockItems: MarketplaceItem[] = [
      // Workflow Templates
      {
        id: 'template-1',
        type: 'template',
        name: 'Lead Qualification Workflow',
        description: 'Automatically qualify leads using AI-powered scoring and routing',
        category: 'sales',
        price: 0,
        currency: 'USD',
        author: {
          id: 'aias-team',
          name: 'AIAS Team',
          avatar: '',
          verified: true
        },
        downloads: 1250,
        rating: 4.8,
        reviews: 89,
        tags: ['sales', 'lead-generation', 'ai', 'automation'],
        preview: '',
        documentation: 'https://docs.aias.com/templates/lead-qualification',
        requirements: ['AIAS Pro Plan', 'CRM Integration'],
        compatibility: ['Salesforce', 'HubSpot', 'Pipedrive'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'template-2',
        type: 'template',
        name: 'Customer Onboarding Automation',
        description: 'Complete customer onboarding workflow with email sequences and task assignments',
        category: 'customer-success',
        price: 49,
        currency: 'USD',
        author: {
          id: 'automation-expert',
          name: 'Sarah Chen',
          avatar: '',
          verified: true
        },
        downloads: 856,
        rating: 4.9,
        reviews: 67,
        tags: ['onboarding', 'email-automation', 'customer-success'],
        preview: '',
        documentation: 'https://docs.aias.com/templates/customer-onboarding',
        requirements: ['AIAS Pro Plan', 'Email Service'],
        compatibility: ['Mailchimp', 'SendGrid', 'Intercom'],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: 'template-3',
        type: 'template',
        name: 'Invoice Processing Workflow',
        description: 'Automated invoice processing with OCR, validation, and approval routing',
        category: 'finance',
        price: 199,
        currency: 'USD',
        author: {
          id: 'finance-automation',
          name: 'Finance Automation Co.',
          avatar: '',
          verified: true
        },
        downloads: 234,
        rating: 4.7,
        reviews: 23,
        tags: ['finance', 'ocr', 'invoice-processing', 'approval'],
        preview: '',
        documentation: 'https://docs.aias.com/templates/invoice-processing',
        requirements: ['AIAS Enterprise Plan', 'OCR Service'],
        compatibility: ['QuickBooks', 'Xero', 'Sage'],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-12')
      },

      // AI Agents
      {
        id: 'agent-1',
        type: 'agent',
        name: 'Customer Support Bot',
        description: 'Intelligent customer support agent with natural language understanding',
        category: 'customer-service',
        price: 0.10,
        currency: 'USD',
        author: {
          id: 'aias-team',
          name: 'AIAS Team',
          avatar: '',
          verified: true
        },
        downloads: 2100,
        rating: 4.6,
        reviews: 156,
        tags: ['customer-service', 'chatbot', 'nlp', 'support'],
        preview: '',
        documentation: 'https://docs.aias.com/agents/customer-support-bot',
        requirements: ['AIAS Pro Plan', 'Webhook Endpoint'],
        compatibility: ['Slack', 'Discord', 'Website', 'Mobile App'],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-19')
      },
      {
        id: 'agent-2',
        type: 'agent',
        name: 'Content Generation Assistant',
        description: 'AI-powered content creation for blogs, social media, and marketing materials',
        category: 'content',
        price: 0.25,
        currency: 'USD',
        author: {
          id: 'content-creator',
          name: 'Content Creator Pro',
          avatar: '',
          verified: true
        },
        downloads: 1876,
        rating: 4.9,
        reviews: 134,
        tags: ['content-creation', 'writing', 'marketing', 'ai'],
        preview: '',
        documentation: 'https://docs.aias.com/agents/content-generation',
        requirements: ['AIAS Pro Plan', 'Content Management System'],
        compatibility: ['WordPress', 'Notion', 'Google Docs', 'Markdown'],
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-16')
      },

      // Integrations
      {
        id: 'integration-1',
        type: 'integration',
        name: 'Salesforce CRM Integration',
        description: 'Seamless integration with Salesforce for lead management and automation',
        category: 'crm',
        price: 0,
        currency: 'USD',
        author: {
          id: 'aias-team',
          name: 'AIAS Team',
          avatar: '',
          verified: true
        },
        downloads: 3420,
        rating: 4.8,
        reviews: 234,
        tags: ['crm', 'salesforce', 'lead-management', 'automation'],
        preview: '',
        documentation: 'https://docs.aias.com/integrations/salesforce',
        requirements: ['AIAS Pro Plan', 'Salesforce Account'],
        compatibility: ['Salesforce', 'AIAS Platform'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'integration-2',
        type: 'integration',
        name: 'Slack Workflow Integration',
        description: 'Connect your workflows to Slack for notifications and team collaboration',
        category: 'communication',
        price: 0,
        currency: 'USD',
        author: {
          id: 'aias-team',
          name: 'AIAS Team',
          avatar: '',
          verified: true
        },
        downloads: 2890,
        rating: 4.7,
        reviews: 198,
        tags: ['slack', 'communication', 'notifications', 'collaboration'],
        preview: '',
        documentation: 'https://docs.aias.com/integrations/slack',
        requirements: ['AIAS Pro Plan', 'Slack Workspace'],
        compatibility: ['Slack', 'AIAS Platform'],
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-14')
      },

      // One-time Apps
      {
        id: 'app-1',
        type: 'app',
        name: 'Data Migration Tool',
        description: 'One-time data migration tool for moving data between systems',
        category: 'data',
        price: 149,
        currency: 'USD',
        author: {
          id: 'data-specialist',
          name: 'Data Migration Pro',
          avatar: '',
          verified: true
        },
        downloads: 456,
        rating: 4.5,
        reviews: 78,
        tags: ['data-migration', 'etl', 'one-time', 'data-processing'],
        preview: '',
        documentation: 'https://docs.aias.com/apps/data-migration',
        requirements: ['AIAS Pro Plan', 'Source and Target Systems'],
        compatibility: ['MySQL', 'PostgreSQL', 'MongoDB', 'CSV'],
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-13')
      },
      {
        id: 'app-2',
        type: 'app',
        name: 'Custom Report Generator',
        description: 'Generate custom reports and analytics dashboards',
        category: 'analytics',
        price: 299,
        currency: 'USD',
        author: {
          id: 'analytics-expert',
          name: 'Analytics Solutions',
          avatar: '',
          verified: true
        },
        downloads: 234,
        rating: 4.8,
        reviews: 45,
        tags: ['reporting', 'analytics', 'dashboard', 'custom'],
        preview: '',
        documentation: 'https://docs.aias.com/apps/report-generator',
        requirements: ['AIAS Enterprise Plan', 'Data Source'],
        compatibility: ['Google Analytics', 'Mixpanel', 'Amplitude', 'Custom APIs'],
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-11')
      }
    ];

    setItems(mockItems);
    setLoading(false);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'template': return Workflow;
      case 'agent': return Bot;
      case 'integration': return Globe;
      case 'app': return Zap;
      default: return Workflow;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'template': return 'bg-blue-500';
      case 'agent': return 'bg-purple-500';
      case 'integration': return 'bg-green-500';
      case 'app': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    if (price < 1) return `$${price.toFixed(2)} per use`;
    return `$${price} ${currency}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600">Discover and deploy automation solutions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            My Purchases
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates, agents, integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
              <Badge variant="secondary" className="ml-2">
                {items.filter(item => selectedCategory === 'all' || item.type === selectedCategory).length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          {/* Featured Items */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Featured Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedItems.slice(0, 3).map(item => {
                const Icon = getItemIcon(item.type);
                const colorClass = getItemColor(item.type);
                
                return (
                  <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(item.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {item.rating} ({item.reviews} reviews)
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold">
                            {formatPrice(item.price, item.currency)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              {item.price === 0 ? 'Get' : 'Buy'}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {item.downloads.toLocaleString()} downloads
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* All Items */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedItems.map(item => {
                const Icon = getItemIcon(item.type);
                const colorClass = getItemColor(item.type);
                
                return (
                  <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(item.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {item.rating} ({item.reviews})
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold">
                            {formatPrice(item.price, item.currency)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              {item.price === 0 ? 'Get' : 'Buy'}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {item.downloads.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;