"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UserSettings {
  id: string;
  user_id: string;
  email_notifications_enabled: boolean;
  push_notifications_enabled: boolean;
  sms_notifications_enabled: boolean;
  notification_types: Record<string, boolean>;
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  date_format: string;
  time_format: "12h" | "24h";
  profile_visibility: "public" | "private" | "friends";
  analytics_opt_in: boolean;
  data_sharing_enabled: boolean;
  beta_features_enabled: boolean;
  experimental_features_enabled: boolean;
  custom_settings: Record<string, unknown>;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Partial<UserSettings>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/settings", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load settings");
      }

      const data = await response.json();
      setSettings(data.settings || {});
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updates: Partial<UserSettings>) => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const data = await response.json();
      setSettings(data.settings || {});
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    const updates = { ...settings, [key]: value };
    setSettings(updates);
    saveSettings(updates);
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and notification settings
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email_notifications_enabled ?? true}
                  onCheckedChange={(checked) =>
                    updateSetting("email_notifications_enabled", checked)
                  }
                  disabled={saving}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.push_notifications_enabled ?? true}
                  onCheckedChange={(checked) =>
                    updateSetting("push_notifications_enabled", checked)
                  }
                  disabled={saving}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via SMS (requires phone number)
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.sms_notifications_enabled ?? false}
                  onCheckedChange={(checked) =>
                    updateSetting("sms_notifications_enabled", checked)
                  }
                  disabled={saving}
                />
              </div>

              <div className="pt-4 border-t">
                <Label className="mb-4 block">Notification Types</Label>
                <div className="space-y-4">
                  {Object.entries(settings.notification_types || {}).map(([type, enabled]) => (
                    <div key={type} className="flex items-center justify-between">
                      <Label htmlFor={`notification-${type}`} className="capitalize">
                        {type.replace(/_/g, " ")}
                      </Label>
                      <Switch
                        id={`notification-${type}`}
                        checked={enabled}
                        onCheckedChange={(checked) => {
                          updateSetting("notification_types", {
                            ...settings.notification_types,
                            [type]: checked,
                          });
                        }}
                        disabled={saving}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme || "system"}
                  onValueChange={(value) =>
                    updateSetting("theme", value as "light" | "dark" | "system")
                  }
                  disabled={saving}
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.language || "en"}
                  onValueChange={(value) => updateSetting("language", value)}
                  disabled={saving}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.timezone || "UTC"}
                  onValueChange={(value) => updateSetting("timezone", value)}
                  disabled={saving}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/Toronto">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Vancouver">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select
                  value={settings.time_format || "24h"}
                  onValueChange={(value) =>
                    updateSetting("time_format", value as "12h" | "24h")
                  }
                  disabled={saving}
                >
                  <SelectTrigger id="time-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <Select
                  value={settings.profile_visibility || "private"}
                  onValueChange={(value) =>
                    updateSetting("profile_visibility", value as "public" | "private" | "friends")
                  }
                  disabled={saving}
                >
                  <SelectTrigger id="profile-visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics-opt-in">Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us improve by sharing anonymous usage data
                  </p>
                </div>
                <Switch
                  id="analytics-opt-in"
                  checked={settings.analytics_opt_in ?? true}
                  onCheckedChange={(checked) =>
                    updateSetting("analytics_opt_in", checked)
                  }
                  disabled={saving}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-sharing">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow sharing of anonymized data with partners
                  </p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={settings.data_sharing_enabled ?? false}
                  onCheckedChange={(checked) =>
                    updateSetting("data_sharing_enabled", checked)
                  }
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Preferences</CardTitle>
              <CardDescription>
                Enable experimental and beta features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="beta-features">Beta Features</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable access to beta features
                  </p>
                </div>
                <Switch
                  id="beta-features"
                  checked={settings.beta_features_enabled ?? false}
                  onCheckedChange={(checked) =>
                    updateSetting("beta_features_enabled", checked)
                  }
                  disabled={saving}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="experimental-features">Experimental Features</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable experimental features (may be unstable)
                  </p>
                </div>
                <Switch
                  id="experimental-features"
                  checked={settings.experimental_features_enabled ?? false}
                  onCheckedChange={(checked) =>
                    updateSetting("experimental_features_enabled", checked)
                  }
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
