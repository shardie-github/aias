import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Activity,
  Shield,
  Database,
  Settings,
  Eye,
  Clock,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceType: 'user' | 'data' | 'system' | 'security' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure' | 'pending';
  ipAddress: string;
  userAgent: string;
  location: string;
  details: Record<string, any>;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  tags: string[];
}

export interface AuditFilter {
  dateRange: {
    start: string;
    end: string;
  };
  userId?: string;
  action?: string;
  resourceType?: string;
  severity?: string;
  status?: string;
  searchQuery?: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-001',
    timestamp: '2024-01-23T10:30:00Z',
    userId: 'user-123',
    userName: 'John Doe',
    action: 'login',
    resource: 'authentication',
    resourceType: 'security',
    severity: 'low',
    status: 'success',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    location: 'New York, US',
    details: {
      method: 'password',
      twoFactor: true,
      sessionId: 'sess_abc123'
    },
    tags: ['authentication', 'login']
  },
  {
    id: 'audit-002',
    timestamp: '2024-01-23T10:25:00Z',
    userId: 'user-456',
    userName: 'Jane Smith',
    action: 'data_access',
    resource: 'customer_data',
    resourceType: 'data',
    severity: 'medium',
    status: 'success',
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    location: 'San Francisco, CA',
    details: {
      dataType: 'personal_information',
      recordCount: 150,
      purpose: 'customer_support'
    },
    changes: [
      {
        field: 'last_accessed',
        oldValue: '2024-01-20T15:30:00Z',
        newValue: '2024-01-23T10:25:00Z'
      }
    ],
    tags: ['data_access', 'customer_data']
  },
  {
    id: 'audit-003',
    timestamp: '2024-01-23T10:20:00Z',
    userId: 'system',
    userName: 'System',
    action: 'security_scan',
    resource: 'vulnerability_assessment',
    resourceType: 'security',
    severity: 'high',
    status: 'success',
    ipAddress: '127.0.0.1',
    userAgent: 'Security Scanner v2.1',
    location: 'Internal',
    details: {
      scanType: 'vulnerability',
      vulnerabilitiesFound: 2,
      criticalIssues: 0,
      highIssues: 1,
      mediumIssues: 1
    },
    tags: ['security', 'scan', 'vulnerability']
  },
  {
    id: 'audit-004',
    timestamp: '2024-01-23T10:15:00Z',
    userId: 'user-789',
    userName: 'Admin User',
    action: 'permission_change',
    resource: 'user_permissions',
    resourceType: 'user',
    severity: 'high',
    status: 'success',
    ipAddress: '192.168.1.200',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    location: 'Chicago, IL',
    details: {
      targetUser: 'user-123',
      permissionType: 'admin_access',
      granted: true
    },
    changes: [
      {
        field: 'role',
        oldValue: 'user',
        newValue: 'admin'
      },
      {
        field: 'permissions',
        oldValue: ['read', 'write'],
        newValue: ['read', 'write', 'admin', 'delete']
      }
    ],
    tags: ['permissions', 'admin', 'user_management']
  },
  {
    id: 'audit-005',
    timestamp: '2024-01-23T10:10:00Z',
    userId: 'user-321',
    userName: 'Data Analyst',
    action: 'data_export',
    resource: 'analytics_data',
    resourceType: 'data',
    severity: 'medium',
    status: 'success',
    ipAddress: '203.0.113.1',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    location: 'London, UK',
    details: {
      exportType: 'csv',
      recordCount: 5000,
      dataRange: '2024-01-01 to 2024-01-23',
      purpose: 'monthly_report'
    },
    tags: ['data_export', 'analytics', 'reporting']
  }
];

export const AuditLoggingDashboard: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [filters, setFilters] = useState<AuditFilter>({
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    }
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity' | 'action'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      const dateMatch = logDate >= startDate && logDate <= endDate;
      const userMatch = !filters.userId || log.userId === filters.userId;
      const actionMatch = !filters.action || log.action.toLowerCase().includes(filters.action.toLowerCase());
      const resourceMatch = !filters.resourceType || log.resourceType === filters.resourceType;
      const severityMatch = !filters.severity || log.severity === filters.severity;
      const statusMatch = !filters.status || log.status === filters.status;
      const searchMatch = !filters.searchQuery || 
        log.action.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        log.userName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        log.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));

      return dateMatch && userMatch && actionMatch && resourceMatch && severityMatch && statusMatch && searchMatch;
    });

    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = severityOrder[a.severity as keyof typeof severityOrder];
          bValue = severityOrder[b.severity as keyof typeof severityOrder];
          break;
        case 'action':
          aValue = a.action.toLowerCase();
          bValue = b.action.toLowerCase();
          break;
        default:
          aValue = a.timestamp;
          bValue = b.timestamp;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [auditLogs, filters, sortBy, sortOrder]);

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
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failure': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'compliance': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Type', 'Severity', 'Status', 'IP Address', 'Location'],
      ...filteredAndSortedLogs.map(log => [
        log.timestamp,
        log.userName,
        log.action,
        log.resource,
        log.resourceType,
        log.severity,
        log.status,
        log.ipAddress,
        log.location
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Audit Logging Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive audit trail and compliance monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                />
                <Input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Resource Type</label>
              <Select
                value={filters.resourceType || ''}
                onValueChange={(value) => setFilters(prev => ({ ...prev, resourceType: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Severity</label>
              <Select
                value={filters.severity || ''}
                onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timestamp">Timestamp</SelectItem>
                    <SelectItem value="severity">Severity</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedLogs.length} of {auditLogs.length} logs
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getResourceTypeIcon(log.resourceType)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold capitalize">{log.action}</h4>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(log.status)}
                          <span className="text-sm text-gray-600 capitalize">{log.status}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>{log.userName}</strong> performed <strong>{log.action}</strong> on <strong>{log.resource}</strong>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(log.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {log.ipAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.location}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {log.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLogExpansion(log.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {expandedLogs.has(log.id) ? 'Hide' : 'Show'} Details
                    </Button>
                  </div>
                </div>

                {expandedLogs.has(log.id) && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Details</h5>
                        <div className="space-y-1 text-sm">
                          {Object.entries(log.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="font-medium">{JSON.stringify(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {log.changes && log.changes.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-sm mb-2">Changes</h5>
                          <div className="space-y-2">
                            {log.changes.map((change, index) => (
                              <div key={index} className="text-sm border rounded p-2">
                                <div className="font-medium">{change.field}</div>
                                <div className="text-gray-600">
                                  <span className="text-red-600">- {JSON.stringify(change.oldValue)}</span>
                                  <br />
                                  <span className="text-green-600">+ {JSON.stringify(change.newValue)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};