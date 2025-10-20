import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Clock, Star, Play, Users, Shield, Zap, ShoppingCart } from 'lucide-react';
import { InteractiveTutorial, Tutorial } from './InteractiveTutorial';

const tutorialLibrary: Tutorial[] = [
  {
    id: 'getting-started-1',
    title: 'Welcome to AIAS Platform',
    description: 'Learn the basics of our AI automation platform',
    category: 'getting-started',
    difficulty: 'beginner',
    estimatedTime: 10,
    tags: ['basics', 'onboarding', 'platform'],
    steps: [
      {
        id: 'welcome',
        title: 'Welcome!',
        description: 'Let\'s get you started with the platform',
        type: 'demo',
        content: {
          text: 'Welcome to the AIAS platform! This interactive tutorial will guide you through the key features and help you get started with AI automation.'
        }
      },
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        description: 'Explore the main dashboard',
        type: 'interactive',
        content: {
          text: 'The dashboard is your central hub for managing automations, viewing analytics, and accessing all platform features. Click around to explore!'
        },
        hints: [
          'Look for the navigation menu on the left',
          'Check out the analytics widgets in the center',
          'Notice the notification center in the top right'
        ]
      },
      {
        id: 'first-automation',
        title: 'Create Your First Automation',
        description: 'Build a simple automation workflow',
        type: 'demo',
        content: {
          text: 'Let\'s create a simple email automation that sends a welcome message to new leads.'
        }
      }
    ]
  },
  {
    id: 'automation-basics',
    title: 'Automation Fundamentals',
    description: 'Master the core concepts of workflow automation',
    category: 'automation',
    difficulty: 'intermediate',
    estimatedTime: 25,
    tags: ['workflows', 'triggers', 'actions'],
    steps: [
      {
        id: 'workflow-concepts',
        title: 'Understanding Workflows',
        description: 'Learn what workflows are and how they work',
        type: 'demo',
        content: {
          text: 'Workflows are sequences of automated actions triggered by specific events. Think of them as digital assembly lines for your business processes.'
        }
      },
      {
        id: 'triggers-quiz',
        title: 'Types of Triggers',
        description: 'Test your knowledge of workflow triggers',
        type: 'quiz',
        content: {
          quiz: {
            question: 'Which of the following is NOT a common workflow trigger?',
            options: [
              'Email received',
              'Form submission',
              'Scheduled time',
              'User login',
              'Database query'
            ],
            correct: 4,
            explanation: 'Database queries are typically actions, not triggers. Triggers are events that start a workflow.'
          }
        }
      },
      {
        id: 'build-workflow',
        title: 'Build a Lead Scoring Workflow',
        description: 'Create an automated lead scoring system',
        type: 'interactive',
        content: {
          text: 'Now let\'s build a real workflow that scores leads based on their behavior and demographics.'
        },
        hints: [
          'Start with a form submission trigger',
          'Add conditions to check lead quality',
          'Set up different actions for different score ranges'
        ]
      }
    ]
  },
  {
    id: 'ai-agents-intro',
    title: 'AI Agents Deep Dive',
    description: 'Learn to create and deploy AI agents',
    category: 'ai-agents',
    difficulty: 'advanced',
    estimatedTime: 45,
    tags: ['ai', 'agents', 'deployment'],
    steps: [
      {
        id: 'agent-concepts',
        title: 'What are AI Agents?',
        description: 'Understanding AI agent capabilities',
        type: 'demo',
        content: {
          text: 'AI agents are intelligent assistants that can understand context, make decisions, and take actions on your behalf.'
        }
      },
      {
        id: 'agent-code',
        title: 'Agent Configuration Code',
        description: 'Learn the code structure for AI agents',
        type: 'code',
        content: {
          code: `// AI Agent Configuration
const customerServiceAgent = {
  name: "Customer Service Bot",
  capabilities: ["answer_questions", "create_tickets", "escalate_issues"],
  personality: {
    tone: "friendly",
    expertise: ["product_support", "billing", "technical_issues"]
  },
  triggers: ["chat_message", "email_received"],
  actions: ["respond_to_customer", "create_support_ticket"]
};`
        },
        hints: [
          'The agent has a name and defined capabilities',
          'Personality settings control how the agent responds',
          'Triggers determine when the agent activates',
          'Actions define what the agent can do'
        ]
      },
      {
        id: 'deploy-agent',
        title: 'Deploy Your Agent',
        description: 'Deploy an AI agent to production',
        type: 'interactive',
        content: {
          text: 'Now let\'s deploy your AI agent and test it in a real environment.'
        }
      }
    ]
  },
  {
    id: 'security-compliance',
    title: 'Security & Compliance',
    description: 'Learn about platform security features',
    category: 'security',
    difficulty: 'intermediate',
    estimatedTime: 20,
    tags: ['security', 'compliance', 'privacy'],
    steps: [
      {
        id: 'security-overview',
        title: 'Security Features',
        description: 'Overview of security measures',
        type: 'demo',
        content: {
          text: 'Our platform includes enterprise-grade security features including encryption, audit logging, and threat detection.'
        }
      },
      {
        id: 'privacy-settings',
        title: 'Privacy Controls',
        description: 'Configure privacy and compliance settings',
        type: 'interactive',
        content: {
          text: 'Learn how to configure privacy settings and ensure GDPR/CCPA compliance for your organization.'
        }
      }
    ]
  }
];

export const TutorialLibrary: React.FC = () => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredTutorials = useMemo(() => {
    return tutorialLibrary.filter(tutorial => {
      const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return <Play className="w-4 h-4" />;
      case 'automation': return <Zap className="w-4 h-4" />;
      case 'ai-agents': return <Users className="w-4 h-4" />;
      case 'marketplace': return <ShoppingCart className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedTutorial) {
    return (
      <div className="space-y-4">
        <Button
          onClick={() => setSelectedTutorial(null)}
          variant="outline"
          className="mb-4"
        >
          ← Back to Library
        </Button>
        <InteractiveTutorial
          tutorial={selectedTutorial}
          onComplete={(tutorialId, score) => {
            console.log(`Tutorial ${tutorialId} completed with score: ${score}%`);
            setSelectedTutorial(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Interactive Tutorial Library</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn the platform through hands-on tutorials, interactive demos, and guided experiences.
          Master AI automation at your own pace.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="getting-started">Getting Started</SelectItem>
            <SelectItem value="automation">Automation</SelectItem>
            <SelectItem value="ai-agents">AI Agents</SelectItem>
            <SelectItem value="marketplace">Marketplace</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Tutorials</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTutorials.map((tutorial) => (
              <Card key={tutorial.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(tutorial.category)}
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    </div>
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{tutorial.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {tutorial.estimatedTime} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {tutorial.steps.length} steps
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {tutorial.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => setSelectedTutorial(tutorial)}
                    className="w-full"
                  >
                    Start Tutorial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="featured" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTutorials
              .filter(tutorial => tutorial.tags.includes('featured'))
              .map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(tutorial.category)}
                        <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{tutorial.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tutorial.estimatedTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {tutorial.steps.length} steps
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setSelectedTutorial(tutorial)}
                      className="w-full"
                    >
                      Start Tutorial
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};