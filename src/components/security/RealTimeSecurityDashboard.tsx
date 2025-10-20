import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Users, 
  Globe, 
  Lock,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  Download
} from 'lucide-react';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'threat_detected' | 'login_attempt' | 'data_access' | 'system_alert' | 'compliance_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
}

export interface ThreatMetrics {
  totalThreats: number;
  activeThreats: number;
  threatsBlocked: number;
  falsePositives: number;
  avgResponseTime: number;
  securityScore: number;
  complianceScore: number;
}

export interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
  actions: string[];
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 'sec-001',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: 'threat_detected',
    severity: 'high',
    source: 'Threat Detection System',
    description: 'Multiple failed login attempts detected from suspicious IP',
    status: 'investigating',
    details: {
      attempts: 15,
      timeWindow: '5 minutes',
      blocked: true
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    location: 'Unknown Location'
  },
  {
    id: 'sec-002',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: 'data_access',
    severity: 'medium',
    source: 'Access Control System',
    description: 'Unusual data access pattern detected for user account',
    status: 'active',
    details: {
      userId: 'user_123',
      dataTypes: ['customer_data', 'financial_records'],
      accessCount: 47
    },
    ipAddress: '10.0.0.50',
    location: 'New York, US'
  },
  {
    id: 'sec-003',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: 'system_alert',
    severity: 'low',
    source: 'System Monitor',
    description: 'High CPU usage detected on security monitoring server',
    status: 'resolved',
    details: {
      cpuUsage: 85,
      duration: '10 minutes',
      resolved: true
    }
  }
];

const mockAlerts: SecurityAlert[] = [
  {
    id: 'alert-001',
    title: 'Brute Force Attack Detected',
    description: 'Multiple failed login attempts from IP 192.168.1.100',
    severity: 'high',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    acknowledged: false,
    resolved: false,
    actions: ['Block IP', 'Require CAPTCHA', 'Alert Security Team']
  },
  {
    id: 'alert-002',
    title: 'Suspicious Data Access',
    description: 'Unusual data access pattern detected for user account',
    severity: 'medium',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    acknowledged: true,
    resolved: false,
    actions: ['Review Access Logs', 'Contact User', 'Implement Additional Monitoring']
  }
];

export const RealTimeSecurityDashboard: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(mockAlerts);
  const [metrics, setMetrics] = useState<ThreatMetrics>({
    totalThreats: 47,
    activeThreats: 3,
    threatsBlocked: 44,
    falsePositives: 2,
    avgResponseTime: 2.3,
    securityScore: 98,
    complianceScore: 95
  });
  const [isLive, setIsLive] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        setEvents(prev => {
          const newEvent: SecurityEvent = {
            id: `sec-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'login_attempt',
            severity: 'low',
            source: 'Authentication System',
            description: 'Successful login from new device',
            status: 'active',
            details: { device: 'Mobile App', location: 'San Francisco, CA' },
            ipAddress: '203.0.113.1',
            location: 'San Francisco, CA'
          };
          return [newEvent, ...prev.slice(0, 9)]; // Keep only last 10 events
        });
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isLive]);

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
      case 'active': return <Activity className="w-4 h-4 text-red-500" />;
      case 'investigating': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'false_positive': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true, acknowledged: true } : alert
    ));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Security Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time security monitoring and threat detection</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsLive(!isLive)}
            variant={isLive ? "destructive" : "default"}
            size="sm"
          >
            <Activity className="w-4 h-4 mr-2" />
            {isLive ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className="text-2xl font-bold text-green-600">{metrics.securityScore}%</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2% from last week
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Threats</p>
                <p className="text-2xl font-bold text-red-600">{metrics.activeThreats}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-red-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                -1 from yesterday
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Threats Blocked</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.threatsBlocked}</p>
              </div>
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-blue-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12 this week
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.avgResponseTime}s</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-purple-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                -0.5s improvement
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Real-time Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(event.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{event.description}</h4>
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{event.source}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(event.timestamp)}
                            </span>
                            {event.ipAddress && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {event.ipAddress}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {event.status === 'active' && (
                          <Button variant="destructive" size="sm">
                            Block
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Active Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.filter(alert => !alert.resolved).map((alert) => (
                  <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{alert.title}</h4>
                          <p className="text-sm mb-2">{alert.description}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span>{formatTimestamp(alert.timestamp)}</span>
                            <span>•</span>
                            <span>Severity: {alert.severity}</span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Recommended Actions:</p>
                            <div className="flex flex-wrap gap-1">
                              {alert.actions.map((action, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!alert.acknowledged && (
                            <Button
                              size="sm"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Threat Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Brute Force Attacks</span>
                    <Badge variant="destructive">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Data Exfiltration</span>
                    <Badge variant="destructive">3</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Privilege Escalation</span>
                    <Badge variant="destructive">1</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Malware Detection</span>
                    <Badge variant="destructive">0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>United States</span>
                    <Badge variant="outline">23</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>China</span>
                    <Badge variant="outline">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Russia</span>
                    <Badge variant="outline">5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Unknown</span>
                    <Badge variant="outline">11</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-sm text-gray-600">SOC 2 Compliance</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">GDPR Compliance</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">CCPA Compliance</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};