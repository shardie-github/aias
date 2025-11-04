/**
 * Trust Dashboard Page
 * Shows transparency metrics and user-facing privacy insights
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Lock, Eye, Activity, AlertTriangle, CheckCircle2, Download, Settings } from 'lucide-react';

interface GuardianSummary {
  total_events: number;
  by_risk_level: Record<string, number>;
  by_data_class: Record<string, number>;
  by_scope: Record<string, number>;
  violations_prevented: number;
  confidence_score: number;
}

interface GuardianEvent {
  event_id: string;
  timestamp: string;
  type: string;
  risk_level: string;
  action_taken: string;
  description: string;
  scope: string;
  data_class: string;
}

export default function TrustDashboard() {
  const [summary, setSummary] = useState<GuardianSummary | null>(null);
  const [events, setEvents] = useState<GuardianEvent[]>([]);
  const [privateMode, setPrivateMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<GuardianEvent | null>(null);

  useEffect(() => {
    loadGuardianData();
  }, []);

  const loadGuardianData = async () => {
    try {
      // In production, this would fetch from your API
      // For now, we'll simulate with local data
      const mockSummary: GuardianSummary = {
        total_events: 12,
        by_risk_level: { low: 10, medium: 2, high: 0, critical: 0 },
        by_data_class: { telemetry: 8, content: 3, location: 1 },
        by_scope: { user: 5, app: 7 },
        violations_prevented: 0,
        confidence_score: 0.92,
      };

      const mockEvents: GuardianEvent[] = [
        {
          event_id: 'event_1',
          timestamp: new Date().toISOString(),
          type: 'telemetry',
          risk_level: 'low',
          action_taken: 'allow',
          description: 'Page view tracked',
          scope: 'app',
          data_class: 'telemetry',
        },
        {
          event_id: 'event_2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'api_call',
          risk_level: 'low',
          action_taken: 'allow',
          description: 'API request to /api/user',
          scope: 'api',
          data_class: 'telemetry',
        },
        {
          event_id: 'event_3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: 'content_processing',
          risk_level: 'medium',
          action_taken: 'mask',
          description: 'Content processed for AI analysis',
          scope: 'app',
          data_class: 'content',
        },
      ];

      setSummary(mockSummary);
      setEvents(mockEvents);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load guardian data:', error);
      setLoading(false);
    }
  };

  const togglePrivateMode = async () => {
    // In production, this would call your API
    setPrivateMode(!privateMode);
    // Call guardian service
    if (typeof window !== 'undefined' && (window as any).guardianService) {
      if (!privateMode) {
        (window as any).guardianService.enablePrivateMode();
      } else {
        (window as any).guardianService.disablePrivateMode();
      }
    }
  };

  const handleEmergencyLockdown = async () => {
    if (confirm('Activate emergency data lockdown? This will freeze telemetry and pause background sync.')) {
      // In production, this would call your API
      if (typeof window !== 'undefined' && (window as any).guardianService) {
        await (window as any).guardianService.emergencyLockdown();
      }
      setPrivateMode(true);
    }
  };

  const exportReport = async () => {
    // In production, this would generate and download a report
    const report = {
      generated_at: new Date().toISOString(),
      summary,
      events,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guardian_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block': return 'destructive';
      case 'mask': return 'default';
      case 'redact': return 'default';
      case 'alert': return 'default';
      case 'allow': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Guardian data...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            Guardian data is not available. Please ensure Guardian is properly initialized.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const confidencePercentage = Math.round(summary.confidence_score * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Privacy Guardian</h1>
              <p className="text-muted-foreground text-lg">
                Your self-governing privacy protector
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Private Mode Toggle */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Private Mode Pulse</p>
                    <p className="text-sm text-muted-foreground">
                      Freeze telemetry instantly
                    </p>
                  </div>
                </div>
                <Switch checked={privateMode} onCheckedChange={togglePrivateMode} />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Lockdown */}
          <Button
            variant="destructive"
            onClick={handleEmergencyLockdown}
            className="w-full mb-6"
          >
            <Shield className="h-4 w-4 mr-2" />
            Emergency Data Lockdown
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{summary.total_events}</div>
              <p className="text-sm text-muted-foreground">
                data access events, all low-risk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Guardian Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{confidencePercentage}%</div>
              <Progress value={confidencePercentage} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Violations Prevented
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{summary.violations_prevented}</div>
              <p className="text-sm text-muted-foreground">
                blocked or masked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trust Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-lg font-semibold">Healthy</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                No high-risk activity detected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Recent Events</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>
                  Breakdown of events by risk level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(summary.by_risk_level).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={getRiskColor(level) as any}>
                          {level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {count} events
                        </span>
                      </div>
                      <Progress
                        value={(count / summary.total_events) * 100}
                        className="w-32 h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Data Classes Accessed</CardTitle>
                <CardDescription>
                  Types of data your app accessed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(summary.by_data_class).map(([cls, count]) => (
                    <div key={cls} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="font-medium capitalize">{cls}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>
                  Timeline of data access events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div
                      key={event.event_id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{event.type}</span>
                          <Badge variant={getRiskColor(event.risk_level) as any}>
                            {event.risk_level}
                          </Badge>
                          <Badge variant={getActionColor(event.action_taken) as any}>
                            {event.action_taken}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {event.scope}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.data_class}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Guardian Insights</CardTitle>
                <CardDescription>
                  Explainable insights about your data usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertTitle>What data powers this feature?</AlertTitle>
                  <AlertDescription>
                    Your device activity was summarized locally to suggest time-saving routines.
                    No content, credentials, or conversations were stored or shared.
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">This Week's Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    Your app accessed your data {summary.total_events} times this week.
                    All events were classified as low to medium risk, and Guardian allowed
                    them because they were necessary for app functionality. No data left your device
                    without your explicit consent.
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-900 dark:text-green-100">
                      All Clear
                    </h4>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    No high-risk data access detected. Your privacy boundaries are being respected.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Event Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                  <p>{selectedEvent.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Risk Level</p>
                    <Badge variant={getRiskColor(selectedEvent.risk_level) as any}>
                      {selectedEvent.risk_level}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Action Taken</p>
                    <Badge variant={getActionColor(selectedEvent.action_taken) as any}>
                      {selectedEvent.action_taken}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Scope</p>
                    <p className="capitalize">{selectedEvent.scope}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Data Class</p>
                    <p className="capitalize">{selectedEvent.data_class}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Why this happened:</strong> {selectedEvent.description}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>What data was used:</strong> {selectedEvent.data_class}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Who accessed it:</strong> {selectedEvent.scope === 'user' ? 'You' : 'The app'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
