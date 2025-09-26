import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { Separator } from './ui/separator'
import {
  Settings,
  Database,
  Key,
  Server,
  Globe,
  Shield,
  Check,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface SupabaseConfig {
  projectUrl: string
  anonKey: string
  isConfigured: boolean
  isConnected: boolean
}

interface AdminSettings {
  demoMode: boolean
  supabaseConfig: SupabaseConfig
  debugMode: boolean
  allowUserRegistration: boolean
  maintenanceMode: boolean
}

export function SuperAdminSettings() {
  const { user, isDemoMode } = useAuth()
  const [settings, setSettings] = useState<AdminSettings>({
    demoMode: isDemoMode,
    supabaseConfig: {
      projectUrl: '',
      anonKey: '',
      isConfigured: false,
      isConnected: false
    },
    debugMode: false,
    allowUserRegistration: true,
    maintenanceMode: false
  })
  
  const [showKeys, setShowKeys] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [configChanged, setConfigChanged] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('jvflow-admin-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error loading admin settings:', error)
      }
    }
  }, [])

  const saveSettings = () => {
    try {
      localStorage.setItem('jvflow-admin-settings', JSON.stringify(settings))
      toast.success('Settings saved successfully')
      setConfigChanged(false)
    } catch (error) {
      toast.error('Failed to save settings')
      console.error('Error saving settings:', error)
    }
  }

  const testSupabaseConnection = async () => {
    if (!settings.supabaseConfig.projectUrl || !settings.supabaseConfig.anonKey) {
      toast.error('Please provide both Project URL and Anon Key')
      return
    }

    setTestingConnection(true)
    
    try {
      // Extract project ID from URL
      const urlMatch = settings.supabaseConfig.projectUrl.match(/https:\/\/([^.]+)\.supabase\.co/)
      if (!urlMatch) {
        throw new Error('Invalid Supabase URL format')
      }
      
      const projectId = urlMatch[1]
      
      // Test connection by trying to fetch from Supabase REST API
      const response = await fetch(`${settings.supabaseConfig.projectUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': settings.supabaseConfig.anonKey,
          'Authorization': `Bearer ${settings.supabaseConfig.anonKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        setSettings(prev => ({
          ...prev,
          supabaseConfig: {
            ...prev.supabaseConfig,
            isConfigured: true,
            isConnected: true
          }
        }))
        toast.success('Supabase connection successful!')
      } else {
        throw new Error(`Connection failed: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      setSettings(prev => ({
        ...prev,
        supabaseConfig: {
          ...prev.supabaseConfig,
          isConfigured: false,
          isConnected: false
        }
      }))
      toast.error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTestingConnection(false)
    }
  }

  const toggleDemoMode = () => {
    const newDemoMode = !settings.demoMode
    setSettings(prev => ({ ...prev, demoMode: newDemoMode }))
    setConfigChanged(true)
    
    if (newDemoMode) {
      toast.info('Switched to Demo Mode - Using mock data')
    } else {
      toast.info('Switched to Live Mode - Using Supabase data')
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const resetToDefaults = () => {
    setSettings({
      demoMode: true,
      supabaseConfig: {
        projectUrl: '',
        anonKey: '',
        isConfigured: false,
        isConnected: false
      },
      debugMode: false,
      allowUserRegistration: true,
      maintenanceMode: false
    })
    setConfigChanged(true)
    toast.info('Settings reset to defaults')
  }

  if (user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. This area is restricted to Super Administrators only.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Super Admin Settings</h2>
          <p className="text-muted-foreground">
            Configure system-wide settings and Supabase integration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {configChanged && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Unsaved Changes
            </Badge>
          )}
          <Button onClick={saveSettings} disabled={!configChanged}>
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="database" className="space-y-4">
        <TabsList>
          <TabsTrigger value="database">Database & Integration</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="security">Security & Access</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Operation Mode</span>
              </CardTitle>
              <CardDescription>
                Choose between demo mode (mock data) and live mode (Supabase integration)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Label className="text-base font-medium">Demo Mode</Label>
                    <Badge variant={settings.demoMode ? "default" : "secondary"}>
                      {settings.demoMode ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {settings.demoMode 
                      ? "Using mock data for testing and demonstrations"
                      : "Using live Supabase database for production data"
                    }
                  </p>
                </div>
                <Switch
                  checked={settings.demoMode}
                  onCheckedChange={toggleDemoMode}
                />
              </div>

              {!settings.demoMode && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Live mode requires valid Supabase configuration. Please configure your database connection below.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>Supabase Configuration</span>
                {settings.supabaseConfig.isConnected && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
                {settings.supabaseConfig.isConfigured && !settings.supabaseConfig.isConnected && (
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Configured
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Configure your Supabase project connection for live data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-url">Project URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="project-url"
                      type="url"
                      placeholder="https://your-project.supabase.co"
                      value={settings.supabaseConfig.projectUrl}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          supabaseConfig: {
                            ...prev.supabaseConfig,
                            projectUrl: e.target.value,
                            isConnected: false
                          }
                        }))
                        setConfigChanged(true)
                      }}
                    />
                    {settings.supabaseConfig.projectUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(settings.supabaseConfig.projectUrl, 'Project URL')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anon-key">Anonymous Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="anon-key"
                      type={showKeys ? "text" : "password"}
                      placeholder="eyJ..."
                      value={settings.supabaseConfig.anonKey}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          supabaseConfig: {
                            ...prev.supabaseConfig,
                            anonKey: e.target.value,
                            isConnected: false
                          }
                        }))
                        setConfigChanged(true)
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKeys(!showKeys)}
                    >
                      {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    {settings.supabaseConfig.anonKey && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(settings.supabaseConfig.anonKey, 'Anon Key')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={testSupabaseConnection}
                  disabled={testingConnection || !settings.supabaseConfig.projectUrl || !settings.supabaseConfig.anonKey}
                >
                  {testingConnection ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Globe className="h-4 w-4 mr-2" />
                  )}
                  {testingConnection ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  <strong>How to get your Supabase credentials:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Supabase Dashboard</a></li>
                    <li>Select your project</li>
                    <li>Go to Settings → API</li>
                    <li>Copy the Project URL and anon/public key</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                General system settings and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed logging and error reporting
                  </p>
                </div>
                <Switch
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({ ...prev, debugMode: checked }))
                    setConfigChanged(true)
                  }}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable user access for maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({ ...prev, maintenanceMode: checked }))
                    setConfigChanged(true)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure access control and security features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register accounts
                  </p>
                </div>
                <Switch
                  checked={settings.allowUserRegistration}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({ ...prev, allowUserRegistration: checked }))
                    setConfigChanged(true)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <div className="text-sm text-muted-foreground">
          Last saved: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}