/**
 * Real-time Notification Center
 * Live notification components with WebSocket integration
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  BellRing, 
  Settings, 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Archive,
  MarkAsRead,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Notification, CommunicationChannel } from '@/types/platform';

interface NotificationCenterProps {
  userId: string;
  tenantId?: string;
  onNotificationAction?: (notificationId: string, action: string) => void;
}

interface NotificationSettings {
  desktop: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
  webhook: boolean;
  sound: boolean;
  frequency: 'instant' | 'hourly' | 'daily';
  categories: string[];
}

interface WebSocketConnection {
  connected: boolean;
  reconnecting: boolean;
  lastPing: Date | null;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userId,
  tenantId,
  onNotificationAction
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [channels, setChannels] = useState<CommunicationChannel[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    desktop: true,
    email: true,
    push: false,
    sms: false,
    webhook: false,
    sound: true,
    frequency: 'instant',
    categories: ['general', 'alerts', 'workflows', 'billing']
  });
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wsConnection, setWsConnection] = useState<WebSocketConnection>({
    connected: false,
    reconnecting: false,
    lastPing: null
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      // Get WebSocket URL from environment variables dynamically
      const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 
                       process.env.REACT_APP_WS_URL || 
                       (typeof window !== 'undefined' ? 
                         (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host : 
                         'ws://localhost:8080');
      const wsUrl = `${wsBaseUrl}/notifications?userId=${userId}&tenantId=${tenantId || ''}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setWsConnection(prev => ({ ...prev, connected: true, reconnecting: false }));
        
        // Start ping interval
        pingIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
            setWsConnection(prev => ({ ...prev, lastPing: new Date() }));
          }
        }, 30000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnection(prev => ({ ...prev, connected: false }));
        
        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Attempt to reconnect
        if (!wsConnection.reconnecting) {
          setWsConnection(prev => ({ ...prev, reconnecting: true }));
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 5000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsConnection(prev => ({ ...prev, connected: false }));
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, [userId, tenantId, wsConnection.reconnecting]);

  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'notification':
        setNotifications(prev => [data.notification, ...prev]);
        showDesktopNotification(data.notification);
        break;
      case 'notification_update':
        setNotifications(prev => 
          prev.map(n => n.id === data.notification.id ? data.notification : n)
        );
        break;
      case 'notification_delete':
        setNotifications(prev => prev.filter(n => n.id !== data.notificationId));
        break;
      case 'pong':
        setWsConnection(prev => ({ ...prev, lastPing: new Date() }));
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }, []);

  const showDesktopNotification = useCallback((notification: Notification) => {
    if (!settings.desktop || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      const notif = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
        if (notification.action) {
          onNotificationAction?.(notification.id, notification.action.method || 'click');
        }
      };

      // Auto-close after 5 seconds unless urgent
      if (notification.priority !== 'urgent') {
        setTimeout(() => notif.close(), 5000);
      }
    }
  }, [settings.desktop, onNotificationAction]);

  // Load initial data
  useEffect(() => {
    loadNotifications();
    loadChannels();
    requestNotificationPermission();
  }, [userId, tenantId]);

  // WebSocket connection
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [connectWebSocket]);

  const loadNotifications = async () => {
    try {
      // Mock data - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId,
          tenantId,
          type: 'success',
          title: 'Workflow Completed',
          message: 'Lead qualification workflow completed successfully',
          action: {
            label: 'View Details',
            url: '/workflows/123',
            method: 'GET'
          },
          read: false,
          priority: 'medium',
          channels: ['email', 'in_app'],
          createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
        },
        {
          id: '2',
          userId,
          tenantId,
          type: 'warning',
          title: 'Usage Limit Warning',
          message: 'You\'ve used 80% of your monthly API calls',
          action: {
            label: 'View Usage',
            url: '/billing/usage',
            method: 'GET'
          },
          read: false,
          priority: 'high',
          channels: ['email', 'in_app', 'push'],
          createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        },
        {
          id: '3',
          userId,
          tenantId,
          type: 'info',
          title: 'New Feature Available',
          message: 'AI-powered workflow suggestions are now available',
          action: {
            label: 'Learn More',
            url: '/features/ai-suggestions',
            method: 'GET'
          },
          read: true,
          priority: 'low',
          channels: ['email', 'in_app'],
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
          id: '4',
          userId,
          tenantId,
          type: 'error',
          title: 'Integration Failed',
          message: 'Slack integration encountered an error',
          action: {
            label: 'Fix Integration',
            url: '/integrations/slack',
            method: 'GET'
          },
          read: true,
          priority: 'high',
          channels: ['email', 'in_app', 'webhook'],
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadChannels = async () => {
    try {
      // Mock data - replace with actual API call
      const mockChannels: CommunicationChannel[] = [
        {
          id: '1',
          name: 'General Notifications',
          type: 'email',
          configuration: { email: 'notifications@company.com' },
          active: true,
          tenantId: tenantId || '',
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Slack Alerts',
          type: 'slack',
          configuration: { webhook: 'https://hooks.slack.com/...' },
          active: true,
          tenantId: tenantId || '',
          createdAt: new Date()
        }
      ];

      setChannels(mockChannels);
    } catch (error) {
      console.error('Failed to load channels:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // API call to mark as read
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // API call to mark all as read
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // API call to delete notification
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      setSettings(prev => ({ ...prev, ...newSettings }));
      // API call to save settings
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `h-5 w-5 ${
      priority === 'urgent' ? 'text-red-600' :
      priority === 'high' ? 'text-orange-600' :
      priority === 'medium' ? 'text-blue-600' :
      'text-gray-600'
    }`;

    switch (type) {
      case 'success': return <CheckCircle className={iconClass} />;
      case 'warning': return <AlertTriangle className={iconClass} />;
      case 'error': return <AlertCircle className={iconClass} />;
      case 'info': return <Info className={iconClass} />;
      default: return <Bell className={iconClass} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' && !notification.read) ||
      (activeTab === 'urgent' && notification.priority === 'urgent') ||
      (activeTab === 'workflows' && notification.title.toLowerCase().includes('workflow')) ||
      (activeTab === 'billing' && notification.title.toLowerCase().includes('billing'));
    
    const matchesSearch = !searchQuery || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-8 w-8 text-blue-600" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Stay updated with real-time alerts</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            {wsConnection.connected ? (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span>Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <WifiOff className="h-4 w-4" />
                <span>{wsConnection.reconnecting ? 'Reconnecting...' : 'Disconnected'}</span>
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <MarkAsRead className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">
            All {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="urgent">
            Urgent {urgentCount > 0 && `(${urgentCount})`}
          </TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Notifications List */}
        <TabsContent value={activeTab} className="space-y-4">
          {activeTab !== 'settings' && (
            <>
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Notifications */}
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No notifications found</p>
                    </div>
                  ) : (
                    filteredNotifications.map(notification => (
                      <Card 
                        key={notification.id} 
                        className={`transition-all hover:shadow-md ${
                          !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type, notification.priority)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900">
                                      {notification.title}
                                    </h3>
                                    <Badge 
                                      variant="outline" 
                                      className={getPriorityColor(notification.priority)}
                                    >
                                      {notification.priority}
                                    </Badge>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm mb-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>
                                      {new Date(notification.createdAt).toLocaleString()}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {notification.channels.map(channel => (
                                        <Badge key={channel} variant="secondary" className="text-xs">
                                          {channel}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  {notification.action && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => onNotificationAction?.(notification.id, notification.action!.method || 'click')}
                                    >
                                      {notification.action.label}
                                    </Button>
                                  )}
                                  
                                  {!notification.read && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => markAsRead(notification.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteNotification(notification.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Delivery Methods */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Delivery Methods</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>Desktop Notifications</span>
                        </div>
                        <Switch
                          checked={settings.desktop}
                          onCheckedChange={(checked) => updateSettings({ desktop: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          <span>Sound</span>
                        </div>
                        <Switch
                          checked={settings.sound}
                          onCheckedChange={(checked) => updateSettings({ sound: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>Email</span>
                        </div>
                        <Switch
                          checked={settings.email}
                          onCheckedChange={(checked) => updateSettings({ email: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>Push Notifications</span>
                        </div>
                        <Switch
                          checked={settings.push}
                          onCheckedChange={(checked) => updateSettings({ push: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notification Frequency</h3>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">How often should we send notifications?</Label>
                      <Select
                        value={settings.frequency}
                        onValueChange={(value) => updateSettings({ frequency: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instant">Instant</SelectItem>
                          <SelectItem value="hourly">Hourly Digest</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notification Categories</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['general', 'alerts', 'workflows', 'billing', 'integrations', 'security'].map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={settings.categories.includes(category)}
                            onCheckedChange={(checked) => {
                              const newCategories = checked
                                ? [...settings.categories, category]
                                : settings.categories.filter(c => c !== category);
                              updateSettings({ categories: newCategories });
                            }}
                          />
                          <Label htmlFor={category} className="capitalize">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Communication Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Communication Channels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {channels.map(channel => (
                      <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{channel.name}</h4>
                          <p className="text-sm text-gray-600">
                            {channel.type} • {channel.active ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={channel.active}
                            onCheckedChange={(checked) => {
                              // Update channel status
                              setChannels(prev => 
                                prev.map(c => c.id === channel.id ? { ...c, active: checked } : c)
                              );
                            }}
                          />
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full">
                      <Bell className="h-4 w-4 mr-2" />
                      Add New Channel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;