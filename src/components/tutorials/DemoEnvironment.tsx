import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Settings, Code, Eye, Download } from 'lucide-react';

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  category: 'automation' | 'ai-agent' | 'integration' | 'security';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  steps: DemoStep[];
  codeExample?: string;
  liveData?: Record<string, any>;
}

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: 'trigger' | 'process' | 'output' | 'decision';
  duration: number; // in seconds
  visual: {
    type: 'workflow' | 'dashboard' | 'code' | 'data';
    content: any;
  };
  explanation: string;
}

const demoScenarios: DemoScenario[] = [
  {
    id: 'lead-scoring-demo',
    title: 'AI-Powered Lead Scoring',
    description: 'Watch how AI automatically scores and prioritizes leads in real-time',
    category: 'automation',
    difficulty: 'intermediate',
    estimatedTime: 5,
    codeExample: `// Lead Scoring Automation
const leadScoringWorkflow = {
  trigger: 'new_lead_received',
  steps: [
    {
      action: 'enrich_lead_data',
      sources: ['email', 'company_database', 'social_media']
    },
    {
      action: 'ai_score_lead',
      model: 'lead_scoring_v2',
      factors: ['demographics', 'behavior', 'engagement']
    },
    {
      action: 'route_lead',
      conditions: {
        'high_score': 'assign_to_senior_sales',
        'medium_score': 'add_to_nurture_campaign',
        'low_score': 'add_to_general_list'
      }
    }
  ]
};`,
    liveData: {
      currentLeads: 47,
      highScoreLeads: 12,
      mediumScoreLeads: 23,
      lowScoreLeads: 12,
      avgScore: 72.5
    },
    steps: [
      {
        id: 'lead-arrival',
        title: 'New Lead Arrives',
        description: 'A new lead submits a contact form',
        action: 'trigger',
        duration: 2,
        visual: {
          type: 'data',
          content: {
            name: 'Sarah Johnson',
            email: 'sarah.j@techcorp.com',
            company: 'TechCorp Inc',
            source: 'Website Form'
          }
        },
        explanation: 'The system detects a new lead and begins the scoring process'
      },
      {
        id: 'data-enrichment',
        title: 'Data Enrichment',
        description: 'AI gathers additional information about the lead',
        action: 'process',
        duration: 3,
        visual: {
          type: 'workflow',
          content: {
            steps: ['Email validation', 'Company lookup', 'Social media analysis', 'Behavior tracking']
          }
        },
        explanation: 'Our AI enriches the lead data with information from multiple sources'
      },
      {
        id: 'ai-scoring',
        title: 'AI Scoring Analysis',
        description: 'Machine learning model calculates lead score',
        action: 'process',
        duration: 4,
        visual: {
          type: 'dashboard',
          content: {
            score: 87,
            factors: {
              'Company Size': 25,
              'Job Title': 20,
              'Engagement': 18,
              'Demographics': 15,
              'Behavior': 9
            }
          }
        },
        explanation: 'The AI model analyzes multiple factors to generate a comprehensive lead score'
      },
      {
        id: 'routing-decision',
        title: 'Smart Routing',
        description: 'Lead is automatically routed based on score',
        action: 'decision',
        duration: 2,
        visual: {
          type: 'workflow',
          content: {
            decision: 'High Score Lead',
            action: 'Assign to Senior Sales Rep',
            nextSteps: ['Schedule call', 'Send personalized email', 'Add to CRM']
          }
        },
        explanation: 'High-scoring leads are automatically assigned to senior sales representatives'
      }
    ]
  },
  {
    id: 'customer-service-bot',
    title: 'Intelligent Customer Service Bot',
    description: 'Experience how AI handles customer inquiries with human-like understanding',
    category: 'ai-agent',
    difficulty: 'beginner',
    estimatedTime: 4,
    codeExample: `// Customer Service AI Agent
const customerServiceAgent = {
  name: "SupportBot Pro",
  capabilities: [
    "understand_intent",
    "access_knowledge_base",
    "escalate_complex_issues",
    "create_support_tickets"
  ],
  personality: {
    tone: "friendly_professional",
    empathy_level: "high",
    expertise: ["billing", "technical_support", "product_questions"]
  }
};`,
    liveData: {
      activeChats: 23,
      resolvedToday: 156,
      avgResponseTime: '2.3s',
      satisfactionScore: 4.7
    },
    steps: [
      {
        id: 'customer-message',
        title: 'Customer Inquiry',
        description: 'Customer sends a support message',
        action: 'trigger',
        duration: 2,
        visual: {
          type: 'data',
          content: {
            message: "Hi, I'm having trouble with my billing. Can you help?",
            customer: "John Smith",
            priority: "Medium"
          }
        },
        explanation: 'Customer initiates a support conversation'
      },
      {
        id: 'intent-analysis',
        title: 'Intent Recognition',
        description: 'AI analyzes the customer\'s intent and context',
        action: 'process',
        duration: 3,
        visual: {
          type: 'workflow',
          content: {
            intent: 'billing_issue',
            confidence: 0.94,
            entities: ['billing', 'help'],
            sentiment: 'neutral'
          }
        },
        explanation: 'AI understands the customer needs help with billing'
      },
      {
        id: 'knowledge-search',
        title: 'Knowledge Base Search',
        description: 'AI searches for relevant solutions',
        action: 'process',
        duration: 2,
        visual: {
          type: 'dashboard',
          content: {
            searchResults: [
              'Billing FAQ - Payment Issues',
              'Account Settings Guide',
              'Payment Method Update'
            ],
            bestMatch: 'Billing FAQ - Payment Issues'
          }
        },
        explanation: 'AI finds the most relevant information to help the customer'
      },
      {
        id: 'response-generation',
        title: 'Response Generation',
        description: 'AI generates a helpful, personalized response',
        action: 'output',
        duration: 2,
        visual: {
          type: 'data',
          content: {
            response: "Hi John! I'd be happy to help with your billing issue. Let me look up your account details and see what's going on. Can you tell me what specific billing problem you're experiencing?",
            tone: "friendly",
            includesSolution: true
          }
        },
        explanation: 'AI generates a helpful, personalized response'
      }
    ]
  },
  {
    id: 'security-monitoring',
    title: 'Real-time Security Monitoring',
    description: 'See how our platform detects and responds to security threats',
    category: 'security',
    difficulty: 'advanced',
    estimatedTime: 6,
    codeExample: `// Security Monitoring System
const securityMonitor = {
  realTimeDetection: true,
  threatTypes: [
    'brute_force_attacks',
    'suspicious_login_patterns',
    'data_exfiltration',
    'privilege_escalation'
  ],
  responseActions: [
    'block_ip_address',
    'require_additional_authentication',
    'alert_security_team',
    'quarantine_account'
  ]
};`,
    liveData: {
      threatsBlocked: 47,
      activeThreats: 3,
      securityScore: 98,
      lastIncident: '2 hours ago'
    },
    steps: [
      {
        id: 'threat-detection',
        title: 'Threat Detection',
        description: 'System detects suspicious activity',
        action: 'trigger',
        duration: 2,
        visual: {
          type: 'dashboard',
          content: {
            alert: 'Suspicious login attempts detected',
            ipAddress: '192.168.1.100',
            attempts: 15,
            timeWindow: '5 minutes'
          }
        },
        explanation: 'AI detects multiple failed login attempts from the same IP'
      },
      {
        id: 'threat-analysis',
        title: 'Threat Analysis',
        description: 'AI analyzes the threat and determines risk level',
        action: 'process',
        duration: 3,
        visual: {
          type: 'workflow',
          content: {
            riskScore: 85,
            threatType: 'brute_force_attack',
            confidence: 0.92,
            patterns: ['rapid_failed_logins', 'unusual_geolocation']
          }
        },
        explanation: 'AI analyzes the threat patterns and determines it\'s a brute force attack'
      },
      {
        id: 'automated-response',
        title: 'Automated Response',
        description: 'System automatically responds to the threat',
        action: 'process',
        duration: 2,
        visual: {
          type: 'workflow',
          content: {
            actions: [
              'Block IP address',
              'Require CAPTCHA',
              'Alert security team',
              'Log incident'
            ],
            status: 'Threat neutralized'
          }
        },
        explanation: 'System automatically blocks the IP and implements additional security measures'
      },
      {
        id: 'incident-reporting',
        title: 'Incident Reporting',
        description: 'Detailed incident report is generated',
        action: 'output',
        duration: 2,
        visual: {
          type: 'data',
          content: {
            incidentId: 'SEC-2024-001',
            severity: 'High',
            resolution: 'IP blocked, account secured',
            recommendations: ['Review login patterns', 'Consider 2FA']
          }
        },
        explanation: 'Comprehensive incident report is generated for security team review'
      }
    ]
  }
];

export const DemoEnvironment: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<DemoScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPlaying && selectedDemo) {
      const totalDuration = selectedDemo.steps.reduce((sum, step) => sum + step.duration, 0);
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (totalDuration * 10)); // Update every 100ms
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying, selectedDemo]);

  useEffect(() => {
    if (isPlaying && selectedDemo) {
      let stepIndex = 0;
      let stepProgress = 0;
      
      const interval = setInterval(() => {
        stepProgress += 100; // 100ms increments
        
        if (stepProgress >= selectedDemo.steps[stepIndex].duration * 1000) {
          stepIndex++;
          stepProgress = 0;
          
          if (stepIndex < selectedDemo.steps.length) {
            setCurrentStep(stepIndex);
          } else {
            setIsPlaying(false);
            setCurrentStep(0);
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying, selectedDemo]);

  const handlePlay = () => {
    if (!isPlaying) {
      setCurrentStep(0);
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
  };

  const renderStepVisual = (step: DemoStep) => {
    switch (step.visual.type) {
      case 'workflow':
        return (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Workflow Steps:</h4>
            <ul className="space-y-1">
              {step.visual.content.steps?.map((s: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'dashboard':
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Dashboard View:</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(step.visual.content).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{value}</div>
                  <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'data':
        return (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Data:</h4>
            <div className="space-y-2">
              {Object.entries(step.visual.content).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium text-green-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-green-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div>Visual content</div>;
    }
  };

  if (selectedDemo) {
    const currentStepData = selectedDemo.steps[currentStep];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setSelectedDemo(null)}
            variant="outline"
          >
            ← Back to Demos
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePlay}
              variant={isPlaying ? "destructive" : "default"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'} Demo
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setShowCode(!showCode)}
              variant="outline"
            >
              <Code className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedDemo.title}</CardTitle>
                <p className="text-gray-600">{selectedDemo.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedDemo.difficulty}</Badge>
                <Badge variant="outline">{selectedDemo.estimatedTime} min</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{currentStep + 1} of {selectedDemo.steps.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="demo" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="demo">
                  <Eye className="w-4 h-4 mr-2" />
                  Live Demo
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code className="w-4 h-4 mr-2" />
                  Code Example
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="demo" className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Step {currentStep + 1}: {currentStepData.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{currentStepData.description}</p>
                </div>

                <div className="min-h-[300px] flex items-center justify-center">
                  {renderStepVisual(currentStepData)}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">What's happening:</h4>
                  <p className="text-gray-700">{currentStepData.explanation}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="space-y-4">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{selectedDemo.codeExample}</code>
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Code
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Interactive Demo Environment</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience our platform capabilities through live, interactive demonstrations.
          See AI automation in action with real scenarios and code examples.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {demoScenarios.map((demo) => (
          <Card key={demo.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{demo.title}</CardTitle>
                <Badge variant="secondary">{demo.difficulty}</Badge>
              </div>
              <p className="text-gray-600 text-sm">{demo.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{demo.estimatedTime} min</span>
                <span>{demo.steps.length} steps</span>
                <Badge variant="outline" className="text-xs">
                  {demo.category}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Live Data:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(demo.liveData || {}).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={() => setSelectedDemo(demo)}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Demo
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};