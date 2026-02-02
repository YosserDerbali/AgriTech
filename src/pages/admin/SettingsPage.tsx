import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useAdminStore } from '@/stores/adminStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Settings, Bell, Image, Brain, RefreshCw, AlertTriangle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SettingsPage() {
  const { systemConfig, updateSystemConfig } = useAdminStore();
  const [localConfig, setLocalConfig] = useState(systemConfig);

  const handleSave = () => {
    updateSystemConfig(localConfig);
    toast.success('Settings saved successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">System Settings</h1>
              <p className="text-muted-foreground">Configure platform parameters</p>
            </div>
          </div>

          <div className="grid gap-6 max-w-3xl">
            {/* Maintenance Mode */}
            <Card className={localConfig.maintenanceMode ? 'border-destructive' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${localConfig.maintenanceMode ? 'text-destructive' : ''}`} />
                  Maintenance Mode
                </CardTitle>
                <CardDescription>
                  When enabled, only admins can access the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance">Enable Maintenance Mode</Label>
                  <Switch
                    id="maintenance"
                    checked={localConfig.maintenanceMode}
                    onCheckedChange={(checked) => 
                      setLocalConfig((prev) => ({ ...prev, maintenanceMode: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Image Upload Settings
                </CardTitle>
                <CardDescription>
                  Configure image upload limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxSize">Maximum Image Size (MB)</Label>
                  <Input
                    id="maxSize"
                    type="number"
                    value={localConfig.maxImageSizeMB}
                    onChange={(e) => 
                      setLocalConfig((prev) => ({ ...prev, maxImageSizeMB: Number(e.target.value) }))
                    }
                    min={1}
                    max={50}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Configuration
                </CardTitle>
                <CardDescription>
                  Configure AI model behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Confidence Threshold</Label>
                    <span className="text-sm font-medium">
                      {Math.round(localConfig.confidenceThreshold * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[localConfig.confidenceThreshold * 100]}
                    onValueChange={([value]) => 
                      setLocalConfig((prev) => ({ ...prev, confidenceThreshold: value / 100 }))
                    }
                    min={50}
                    max={95}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Predictions below this threshold will be flagged for priority review
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Send push notifications to users
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={localConfig.notificationsEnabled}
                    onCheckedChange={(checked) => 
                      setLocalConfig((prev) => ({ ...prev, notificationsEnabled: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* External Blog Sync */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  External Blog Sync
                </CardTitle>
                <CardDescription>
                  Configure external article ingestion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="blogSync">Enable External Sync</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically import articles from external sources
                    </p>
                  </div>
                  <Switch
                    id="blogSync"
                    checked={localConfig.externalBlogSyncEnabled}
                    onCheckedChange={(checked) => 
                      setLocalConfig((prev) => ({ ...prev, externalBlogSyncEnabled: checked }))
                    }
                  />
                </div>
                
                {localConfig.externalBlogSyncEnabled && (
                  <div>
                    <Label htmlFor="syncInterval">Sync Interval (hours)</Label>
                    <Input
                      id="syncInterval"
                      type="number"
                      value={localConfig.externalBlogSyncIntervalHours}
                      onChange={(e) => 
                        setLocalConfig((prev) => ({ 
                          ...prev, 
                          externalBlogSyncIntervalHours: Number(e.target.value) 
                        }))
                      }
                      min={1}
                      max={24}
                      className="mt-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button onClick={handleSave} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
