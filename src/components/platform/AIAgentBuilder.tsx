/**
 * AI Agent Builder Component
 * Create and configure custom AI agents for the platform
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Bot, 
  Settings, 
  Play, 
  Save, 
  Download, 
  Upload,
  TestTube,
  MessageSquare,
  Brain,
  Zap,
  Globe,
  Shield,
  DollarSign,
  Users,
  BarChart3,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import { AIAgent, AgentPersonality, AgentPricing, AgentMetrics } from '@/types/platform';

interface AIAgentBuilderProps {
  agentId?: string;
  onSave?: (agent: AIAgent) => void;
  onDeploy?: (agent: AIAgent) => void;
  onTest?: (agent: AIAgent) => void;
}

export const AIAgentBuilder: React.FC<AIAgentBuilderProps> = ({ 
  agentId, 
  onSave, 
  onDeploy, 
  onTest 
}) => {
  const [agent, setAgent] = useState<AIAgent>({
    id: agentId || 'new',
    name: 'Untitled Agent',
    description: '',
    capabilities: [],
    model: 'gpt-4',
    trainingData: [],
    personality: {
      tone: 'professional',
      expertise: [],
      responseStyle: 'helpful and informative',
      language: 'en',
      culturalContext: 'global'
    },
    pricing: {
      type: 'per_use',
      amount: 0.10,
      currency: 'USD',
      freeTier: {
        requests: 100,
        period: 'month'
      }
    },
    status: 'draft',
    metrics: {
      totalInteractions: 0,
      successRate: 0,
      averageResponseTime: 0,
      userRating: 0,
      revenue: 0
    },
    tenantId: 'current-tenant',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const modelOptions = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model for complex tasks' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' },
    { id: 'claude-3', name: 'Claude 3', description: 'Anthropic\'s advanced model' },
    { id: 'custom', name: 'Custom Model', description: 'Your own trained model' }
  ];

  const toneOptions = [
    { id: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { id: 'casual', label: 'Casual', description: 'Friendly and relaxed' },
    { id: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { id: 'technical', label: 'Technical', description: 'Precise and detailed' },
    { id: 'creative', label: 'Creative', description: 'Imaginative and expressive' }
  ];

  const capabilityOptions = [
    'Text Generation',
    'Question Answering',
    'Code Generation',
    'Translation',
    'Summarization',
    'Sentiment Analysis',
    'Content Moderation',
    'Data Analysis',
    'Creative Writing',
    'Technical Support',
    'Customer Service',
    'Sales Assistance',
    'Research',
    'Planning',
    'Problem Solving'
  ];

  const expertiseOptions = [
    'Technology',
    'Business',
    'Marketing',
    'Sales',
    'Customer Service',
    'Finance',
    'Healthcare',
    'Education',
    'Legal',
    'Creative Arts',
    'Science',
    'Engineering',
    'Design',
    'Writing',
    'Research'
  ];

  const pricingTypes = [
    { id: 'per_use', label: 'Per Use', description: 'Pay for each interaction' },
    { id: 'subscription', label: 'Subscription', description: 'Monthly or yearly fee' },
    { id: 'one_time', label: 'One-time', description: 'Single purchase' },
    { id: 'free', label: 'Free', description: 'No cost to users' }
  ];

  const updateAgent = (updates: Partial<AIAgent>) => {
    setAgent(prev => ({ ...prev, ...updates }));
  };

  const updatePersonality = (updates: Partial<AgentPersonality>) => {
    setAgent(prev => ({
      ...prev,
      personality: { ...prev.personality, ...updates }
    }));
  };

  const updatePricing = (updates: Partial<AgentPricing>) => {
    setAgent(prev => ({
      ...prev,
      pricing: { ...prev.pricing, ...updates }
    }));
  };

  const addCapability = (capability: string) => {
    if (!agent.capabilities.includes(capability)) {
      updateAgent({
        capabilities: [...agent.capabilities, capability]
      });
    }
  };

  const removeCapability = (capability: string) => {
    updateAgent({
      capabilities: agent.capabilities.filter(c => c !== capability)
    });
  };

  const addExpertise = (expertise: string) => {
    if (!agent.personality.expertise.includes(expertise)) {
      updatePersonality({
        expertise: [...agent.personality.expertise, expertise]
      });
    }
  };

  const removeExpertise = (expertise: string) => {
    updatePersonality({
      expertise: agent.personality.expertise.filter(e => e !== expertise)
    });
  };

  const handleTest = async () => {
    setIsTesting(true);
    // Mock test response - replace with actual API call
    setTimeout(() => {
      setTestResponse(`This is a test response from ${agent.name}. The agent would process your message: "${testMessage}" and provide a helpful response based on its configuration.`);
      setIsTesting(false);
    }, 2000);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(agent);
    }
  };

  const handleDeploy = () => {
    if (onDeploy) {
      onDeploy(agent);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Bot className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Agent Builder</h1>
            <p className="text-gray-600">Create and configure intelligent AI agents</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleTest}>
            <TestTube className="h-4 w-4 mr-2" />
            Test Agent
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={handleDeploy}>
            <Zap className="h-4 w-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input
                      id="agent-name"
                      value={agent.name}
                      onChange={(e) => updateAgent({ name: e.target.value })}
                      placeholder="Enter agent name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="agent-description">Description</Label>
                    <Textarea
                      id="agent-description"
                      value={agent.description}
                      onChange={(e) => updateAgent({ description: e.target.value })}
                      placeholder="Describe what this agent does"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="agent-model">AI Model</Label>
                    <Select value={agent.model} onValueChange={(value) => updateAgent({ model: value as any })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelOptions.map(option => (
                          <SelectItem key={option.id} value={option.id}>
                            <div>
                              <div className="font-medium">{option.name}</div>
                              <div className="text-sm text-gray-500">{option.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="response-style">Response Style</Label>
                    <Textarea
                      id="response-style"
                      value={agent.personality.responseStyle}
                      onChange={(e) => updatePersonality({ responseStyle: e.target.value })}
                      placeholder="Describe how the agent should respond (e.g., 'helpful and informative', 'concise and direct')"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personality" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personality Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Communication Tone</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {toneOptions.map(option => (
                        <div
                          key={option.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            agent.personality.tone === option.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => updatePersonality({ tone: option.id as any })}
                        >
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Areas of Expertise</Label>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {agent.personality.expertise.map(expertise => (
                          <Badge key={expertise} variant="secondary" className="flex items-center gap-1">
                            {expertise}
                            <button
                              onClick={() => removeExpertise(expertise)}
                              className="ml-1 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Select onValueChange={addExpertise}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add expertise area" />
                        </SelectTrigger>
                        <SelectContent>
                          {expertiseOptions
                            .filter(e => !agent.personality.expertise.includes(e))
                            .map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={agent.personality.language} 
                        onValueChange={(value) => updatePersonality({ language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="cultural-context">Cultural Context</Label>
                      <Select 
                        value={agent.personality.culturalContext} 
                        onValueChange={(value) => updatePersonality({ culturalContext: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="eu">European Union</SelectItem>
                          <SelectItem value="asia">Asia</SelectItem>
                          <SelectItem value="latin-america">Latin America</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="capabilities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Capabilities</Label>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {agent.capabilities.map(capability => (
                          <Badge key={capability} variant="secondary" className="flex items-center gap-1">
                            {capability}
                            <button
                              onClick={() => removeCapability(capability)}
                              className="ml-1 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Select onValueChange={addCapability}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add capability" />
                        </SelectTrigger>
                        <SelectContent>
                          {capabilityOptions
                            .filter(c => !agent.capabilities.includes(c))
                            .map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="training-data">Training Data (Optional)</Label>
                    <Textarea
                      id="training-data"
                      value={agent.trainingData.join('\n')}
                      onChange={(e) => updateAgent({ 
                        trainingData: e.target.value.split('\n').filter(line => line.trim()) 
                      })}
                      placeholder="Enter training data or examples (one per line)"
                      rows={4}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Provide specific examples or data to improve the agent's performance
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Pricing Type</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {pricingTypes.map(option => (
                        <div
                          key={option.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            agent.pricing.type === option.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => updatePricing({ type: option.id as any })}
                        >
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {agent.pricing.type !== 'free' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pricing-amount">Price</Label>
                        <div className="flex gap-2">
                          <Input
                            id="pricing-amount"
                            type="number"
                            value={agent.pricing.amount}
                            onChange={(e) => updatePricing({ amount: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            step="0.01"
                          />
                          <Select 
                            value={agent.pricing.currency} 
                            onValueChange={(value) => updatePricing({ currency: value })}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {agent.pricing.type === 'per_use' && (
                        <div>
                          <Label>Free Tier (Optional)</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={agent.pricing.freeTier?.requests || 0}
                              onChange={(e) => updatePricing({
                                freeTier: {
                                  ...agent.pricing.freeTier,
                                  requests: parseInt(e.target.value) || 0,
                                  period: agent.pricing.freeTier?.period || 'month'
                                }
                              })}
                              placeholder="100"
                            />
                            <Select 
                              value={agent.pricing.freeTier?.period || 'month'} 
                              onValueChange={(value) => updatePricing({
                                freeTier: {
                                  ...agent.pricing.freeTier,
                                  requests: agent.pricing.freeTier?.requests || 0,
                                  period: value
                                }
                              })}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="day">per day</SelectItem>
                                <SelectItem value="week">per week</SelectItem>
                                <SelectItem value="month">per month</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Agent Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-gray-600">{agent.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Model:</span>
                    <Badge variant="outline">{agent.model}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Tone:</span>
                    <Badge variant="outline">{agent.personality.tone}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Capabilities:</span>
                    <span>{agent.capabilities.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Agent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Test Agent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-message">Test Message</Label>
                <Textarea
                  id="test-message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Type a message to test the agent..."
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleTest} 
                disabled={!testMessage.trim() || isTesting}
                className="w-full"
              >
                {isTesting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Agent
                  </>
                )}
              </Button>

              {testResponse && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium mb-2">Agent Response:</div>
                  <div className="text-sm text-gray-700">{testResponse}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agent Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Interactions:</span>
                  <span className="font-medium">{agent.metrics.totalInteractions.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Success Rate:</span>
                  <span className="font-medium">{agent.metrics.successRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Avg Response Time:</span>
                  <span className="font-medium">{agent.metrics.averageResponseTime.toFixed(1)}s</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>User Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{agent.metrics.userRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Revenue:</span>
                  <span className="font-medium">${agent.metrics.revenue.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAgentBuilder;