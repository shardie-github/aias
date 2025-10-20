import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Zap,
  Eye,
  Lock,
  Globe,
  Clock,
  Settings,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Database,
  FileText
} from 'lucide-react';

export interface ThreatPattern {
  id: string;
  name: string;
  description: string;
  type: 'behavioral' | 'network' | 'data' | 'access' | 'malware';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  frequency: number;
  lastDetected: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  indicators: string[];
  mitigation: string[];
}

export interface ThreatEvent {
  id: string;
  timestamp: string;
  threatType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  source: string;
  target: string;
  description: string;
  status: 'detected' | 'analyzing' | 'confirmed' | 'mitigated' | 'false_positive';
  riskScore: number;
  automatedResponse: boolean;
  actions: string[];
  details: Record<string, any>;
}

export interface AIAnalysis {
  threatId: string;
  analysisType: 'pattern_recognition' | 'anomaly_detection' | 'behavioral_analysis' | 'network_analysis';
  confidence: number;
  findings: string[];
  recommendations: string[];
  falsePositiveProbability: number;
  riskAssessment: {
    immediate: number;
    shortTerm: number;
    longTerm: number;
  };
  nextSteps: string[];
}

const mockThreatPatterns: ThreatPattern[] = [
  {
    id: 'pattern-001',
    name: 'Brute Force Attack Pattern',
    description: 'Multiple failed login attempts from single IP',
    type: 'access',
    severity: 'high',
    confidence: 95,
    frequency: 12,
    lastDetected: '2024-01-23T10:30:00Z',
    status: 'active',
    indicators: ['rapid_failed_logins', 'single_ip_source', 'common_passwords'],
    mitigation: ['block_ip', 'rate_limiting', 'captcha_requirement']
  },
  {
    id: 'pattern-002',
    name: 'Data Exfiltration Pattern',
    description: 'Unusual large data downloads by user',
    type: 'data',
    severity: 'critical',
    confidence: 88,
    frequency: 3,
    lastDetected: '2024-01-23T09:15:00Z',
    status: 'investigating',
    indicators: ['large_data_volume', 'unusual_time', 'bulk_download'],
    mitigation: ['quarantine_user', 'review_access', 'alert_admin']
  },
  {
    id: 'pattern-003',
    name: 'Privilege Escalation Attempt',
    description: 'User attempting to access admin functions',
    type: 'access',
    severity: 'high',
    confidence: 92,
    frequency: 5,
    lastDetected: '2024-01-23T08:45:00Z',
    status: 'resolved',
    indicators: ['admin_endpoint_access', 'permission_requests', 'role_changes'],
    mitigation: ['deny_access', 'require_approval', 'log_attempt']
  }
];

const mockThreatEvents: ThreatEvent[] = [
  {
    id: 'event-001',
    timestamp: '2024-01-23T10:30:00Z',
    threatType: 'Brute Force Attack',
    severity: 'high',
    confidence: 95,
    source: '192.168.1.100',
    target: 'Authentication System',
    description: '15 failed login attempts in 5 minutes',
    status: 'confirmed',
    riskScore: 85,
    automatedResponse: true,
    actions: ['IP blocked', 'Rate limiting applied', 'Admin notified'],
    details: {
      attempts: 15,
      timeWindow: '5 minutes',
      usernames: ['admin', 'root', 'user'],
      blocked: true
    }
  },
  {
    id: 'event-002',
    timestamp: '2024-01-23T09:15:00Z',
    threatType: 'Data Exfiltration',
    severity: 'critical',
    confidence: 88,
    source: 'user-456',
    target: 'Customer Database',
    description: 'Large data export detected',
    status: 'analyzing',
    riskScore: 92,
    automatedResponse: false,
    actions: ['User quarantined', 'Data access suspended'],
    details: {
      dataVolume: '2.5GB',
      recordCount: 50000,
      exportType: 'CSV',
      timeOfDay: 'off_hours'
    }
  }
];

const mockAIAnalyses: AIAnalysis[] = [
  {
    threatId: 'event-001',
    analysisType: 'pattern_recognition',
    confidence: 95,
    findings: [
      'Attack pattern matches known brute force signatures',
      'IP address has been flagged in threat intelligence feeds',
      'Attack timing suggests automated script usage'
    ],
    recommendations: [
      'Implement CAPTCHA for failed login attempts',
      'Consider IP reputation scoring',
      'Enable account lockout after 3 failed attempts'
    ],
    falsePositiveProbability: 5,
    riskAssessment: {
      immediate: 90,
      shortTerm: 75,
      longTerm: 40
    },
    nextSteps: [
      'Monitor for similar attacks from other IPs',
      'Review authentication logs for compromised accounts',
      'Update threat intelligence rules'
    ]
  }
];

export const ThreatDetectionSystem: React.FC = () => {
  const [threatPatterns, setThreatPatterns] = useState<ThreatPattern[]>(mockThreatPatterns);
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>(mockThreatEvents);
  const [aiAnalyses, setAiAnalyses] = useState<AIAnalysis[]>(mockAIAnalyses);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate real-time threat detection
        const newEvent: ThreatEvent = {
          id: `event-${Date.now()}`,
          timestamp: new Date().toISOString(),
          threatType: 'Suspicious Activity',
          severity: 'medium',
          confidence: Math.floor(Math.random() * 40) + 60,
          source: `192.168.1.${Math.floor(Math.random() * 255)}`,
          target: 'System Monitor',
          description: 'Unusual network activity detected',
          status: 'detected',
          riskScore: Math.floor(Math.random() * 30) + 50,
          automatedResponse: Math.random() > 0.5,
          actions: ['Monitoring', 'Logging'],
          details: {
            activity: 'unusual_network_traffic',
            volume: 'high',
            duration: '10 minutes'
          }
        };
        
        setThreatEvents(prev => [newEvent, ...prev.slice(0, 9)]);
        
        // Simulate AI analysis
        if (Math.random() > 0.7) {
          setAiProcessing(true);
          setTimeout(() => {
            const analysis: AIAnalysis = {
              threatId: newEvent.id,
              analysisType: 'anomaly_detection',
              confidence: Math.floor(Math.random() * 30) + 70,
              findings: [
                'Network traffic pattern deviates from baseline',
                'Unusual data transfer volume detected',
                'Connection from non-standard port'
              ],
              recommendations: [
                'Investigate source IP reputation',
                'Monitor for data exfiltration attempts',
                'Review network access controls'
              ],
              falsePositiveProbability: Math.floor(Math.random() * 20) + 10,
              riskAssessment: {
                immediate: Math.floor(Math.random() * 30) + 60,
                shortTerm: Math.floor(Math.random() * 40) + 40,
                longTerm: Math.floor(Math.random() * 50) + 20
              },
              nextSteps: [
                'Continue monitoring',
                'Update threat detection rules',
                'Alert security team if pattern continues'
              ]
            };
            setAiAnalyses(prev => [analysis, ...prev.slice(0, 4)]);
            setAiProcessing(false);
          }, 2000);
        }
      }, 15000); // Every 15 seconds

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'detected': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'analyzing': return <Brain className="w-4 h-4 text-blue-500" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-red-500" />;
      case 'mitigated': return <Shield className="w-4 h-4 text-green-500" />;
      case 'false_positive': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleThreatResponse = (eventId: string, action: string) => {
    setThreatEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            status: action === 'mitigate' ? 'mitigated' : 'false_positive',
            actions: [...event.actions, action]
          }
        : event
    ));
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: 'text-red-600' };
    if (score >= 60) return { level: 'High', color: 'text-orange-600' };
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8" />
            AI-Powered Threat Detection
          </h1>
          <p className="text-gray-600 mt-1">Advanced machine learning threat detection and automated response</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? "destructive" : "default"}
          >
            {isMonitoring ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure AI
          </Button>
        </div>
      </div>

      {/* AI Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Status</p>
                <p className="text-2xl font-bold text-green-600">
                  {isMonitoring ? 'Active' : 'Inactive'}
                </p>
              </div>
              <Brain className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="w-4 h-4 mr-1" />
                {aiProcessing ? 'Processing...' : 'Monitoring'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Threats Detected</p>
                <p className="text-2xl font-bold text-red-600">{threatEvents.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-red-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +3 this hour
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Accuracy</p>
                <p className="text-2xl font-bold text-blue-600">94.2%</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-blue-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.1% this week
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto Response</p>
                <p className="text-2xl font-bold text-purple-600">87%</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-purple-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5.3% this month
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Threat Events</TabsTrigger>
          <TabsTrigger value="patterns">Threat Patterns</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="response">Auto Response</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Real-time Threat Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(event.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{event.threatType}</h4>
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                            <Badge variant="outline">
                              {event.confidence}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(event.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {event.source}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {event.target}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Risk Score:</span>
                              <div className="flex items-center gap-2">
                                <Progress value={event.riskScore} className="w-20 h-2" />
                                <span className={`text-sm font-bold ${getRiskLevel(event.riskScore).color}`}>
                                  {event.riskScore}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedThreat(event)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                        {event.status === 'detected' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleThreatResponse(event.id, 'mitigate')}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Mitigate
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleThreatResponse(event.id, 'false_positive')}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              False Positive
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    {event.actions.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <h5 className="text-sm font-medium mb-2">Actions Taken:</h5>
                        <div className="flex flex-wrap gap-1">
                          {event.actions.map((action, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Learned Threat Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatPatterns.map((pattern) => (
                  <div key={pattern.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{pattern.name}</h4>
                          <Badge className={getSeverityColor(pattern.severity)}>
                            {pattern.severity}
                          </Badge>
                          <Badge variant="outline">
                            {pattern.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Indicators:</h5>
                            <div className="flex flex-wrap gap-1">
                              {pattern.indicators.map((indicator, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {indicator.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-2">Mitigation:</h5>
                            <div className="flex flex-wrap gap-1">
                              {pattern.mitigation.map((action, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {action.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 text-right text-sm text-gray-500">
                        <div>Frequency: {pattern.frequency}</div>
                        <div>Last: {formatTimestamp(pattern.lastDetected)}</div>
                        <Badge className={getSeverityColor(pattern.status)}>
                          {pattern.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiAnalyses.map((analysis, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold capitalize">
                          {analysis.analysisType.replace(/_/g, ' ')} Analysis
                        </h4>
                        <p className="text-sm text-gray-600">
                          Confidence: {analysis.confidence}% | 
                          False Positive Probability: {analysis.falsePositiveProbability}%
                        </p>
                      </div>
                      <Badge variant="outline">
                        {analysis.confidence}% confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Risk Assessment</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Immediate:</span>
                            <span className={getRiskLevel(analysis.riskAssessment.immediate).color}>
                              {analysis.riskAssessment.immediate}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Short-term:</span>
                            <span className={getRiskLevel(analysis.riskAssessment.shortTerm).color}>
                              {analysis.riskAssessment.shortTerm}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Long-term:</span>
                            <span className={getRiskLevel(analysis.riskAssessment.longTerm).color}>
                              {analysis.riskAssessment.longTerm}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-2">Key Findings</h5>
                        <ul className="space-y-1 text-sm">
                          {analysis.findings.map((finding, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-2">Recommendations</h5>
                        <ul className="space-y-1 text-sm">
                          {analysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <Target className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Next Steps</h5>
                      <div className="flex flex-wrap gap-1">
                        {analysis.nextSteps.map((step, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {step}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Automated Response System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Automated response system is currently active and monitoring for threats.
                    AI will automatically execute predefined responses based on threat severity and type.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Response Rules</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Brute Force Attack</span>
                        <Badge variant="outline">Block IP + Rate Limit</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Data Exfiltration</span>
                        <Badge variant="outline">Quarantine User</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Privilege Escalation</span>
                        <Badge variant="outline">Deny Access + Alert</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Response Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Responses:</span>
                        <span className="font-medium">47</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Successful Mitigations:</span>
                        <span className="font-medium text-green-600">42</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>False Positives:</span>
                        <span className="font-medium text-yellow-600">3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average Response Time:</span>
                        <span className="font-medium">2.3s</span>
                      </div>
                    </div>
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