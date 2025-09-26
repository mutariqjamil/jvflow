import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { useInternationalization } from './providers/InternationalizationProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { toast } from 'sonner@2.0.3'
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Eye,
  User,
  Settings,
  FileText,
  DollarSign,
  Building,
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  RotateCcw
} from 'lucide-react'

interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  userEmail: string
  organizationId: string
  organizationName: string
  projectId?: string
  projectName?: string
  action: string
  resource: string
  resourceId: string
  description: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  location?: string
  device: string
  success: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
  metadata?: Record<string, any>
}

interface AuditFilters {
  dateRange: string
  userId: string
  action: string
  resource: string
  severity: string
  success: string
  search: string
}

export function AuditTrail() {
  const { user, currentOrganization } = useAuth()
  const { t } = useInternationalization()
  
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null)
  const [filters, setFilters] = useState<AuditFilters>({
    dateRange: '7',
    userId: 'all',
    action: 'all',
    resource: 'all',
    severity: 'all',
    success: 'all',
    search: ''
  })

  const isSuperAdmin = user?.role === 'super_admin'
  const isOrgAdmin = user?.role === 'organization_owner' || user?.role === 'admin'

  useEffect(() => {
    loadAuditLogs()
  }, [currentOrganization, user])

  useEffect(() => {
    applyFilters()
  }, [auditLogs, filters])

  const loadAuditLogs = async () => {
    try {
      setLoading(true)
      // Simulate API call with tenant isolation
      const mockLogs = generateMockAuditLogs()
      
      // Filter based on user permissions
      let filteredByPermission = mockLogs
      
      if (!isSuperAdmin) {
        // Non-super admins can only see logs from their organization
        filteredByPermission = mockLogs.filter(log => 
          log.organizationId === currentOrganization?.id
        )
      }
      
      setAuditLogs(filteredByPermission)
    } catch (error) {
      toast.error('Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  const generateMockAuditLogs = (): AuditLogEntry[] => {
    const actions = [
      'login', 'logout', 'create', 'update', 'delete', 'view', 'approve', 'reject',
      'invite', 'assign_role', 'remove_role', 'export', 'import', 'backup', 'restore'
    ]
    
    const resources = [
      'user', 'project', 'expense', 'invoice', 'vendor', 'customer', 'commission',
      'report', 'setting', 'role', 'organization', 'booking', 'property'
    ]

    const categories = [
      'Authentication', 'User Management', 'Project Management', 'Financial Management',
      'System Administration', 'Data Management', 'Security', 'Compliance'
    ]

    const organizations = [
      { id: 'org1', name: 'Prime Real Estate LLC' },
      { id: 'org2', name: 'Karachi Properties' },
      { id: 'org3', name: 'Cairo Development Co' }
    ]

    const users = [
      { id: 'user1', name: 'Ahmed Al-Mansouri', email: 'ahmed@primerealestate.com' },
      { id: 'user2', name: 'Sarah Johnson', email: 'sarah@primerealestate.com' },
      { id: 'user3', name: 'Muhammad Hassan', email: 'hassan@karachiproperties.pk' },
      { id: 'user4', name: 'Lisa Chen', email: 'lisa@primerealestate.com' },
      { id: 'user5', name: 'Omar El-Rashid', email: 'omar@cairodevelopment.eg' }
    ]

    const mockLogs: AuditLogEntry[] = []

    for (let i = 0; i < 100; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomOrg = organizations[Math.floor(Math.random() * organizations.length)]
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      const randomResource = resources[Math.floor(Math.random() * resources.length)]
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      
      const timestamp = new Date()
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30))
      timestamp.setHours(Math.floor(Math.random() * 24))
      timestamp.setMinutes(Math.floor(Math.random() * 60))

      const success = Math.random() > 0.05 // 95% success rate
      const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical']
      const severity = severities[Math.floor(Math.random() * severities.length)]

      const log: AuditLogEntry = {
        id: `audit_${i + 1}`,
        timestamp: timestamp.toISOString(),
        userId: randomUser.id,
        userName: randomUser.name,
        userEmail: randomUser.email,
        organizationId: randomOrg.id,
        organizationName: randomOrg.name,
        projectId: Math.random() > 0.7 ? `project_${Math.floor(Math.random() * 10)}` : undefined,
        projectName: Math.random() > 0.7 ? `Project ${Math.floor(Math.random() * 10)}` : undefined,
        action: randomAction,
        resource: randomResource,
        resourceId: `${randomResource}_${Math.floor(Math.random() * 1000)}`,
        description: generateActionDescription(randomAction, randomResource, randomUser.name),
        details: generateActionDetails(randomAction, randomResource),
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: getRandomUserAgent(),
        location: getRandomLocation(),
        device: getRandomDevice(),
        success,
        severity,
        category: randomCategory,
        metadata: {
          sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
          requestId: `req_${Math.random().toString(36).substr(2, 9)}`
        }
      }

      mockLogs.push(log)
    }

    return mockLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const generateActionDescription = (action: string, resource: string, userName: string): string => {
    const descriptions = {
      login: `${userName} logged into the system`,
      logout: `${userName} logged out of the system`,
      create: `${userName} created a new ${resource}`,
      update: `${userName} updated ${resource} information`,
      delete: `${userName} deleted a ${resource}`,
      view: `${userName} viewed ${resource} details`,
      approve: `${userName} approved a ${resource}`,
      reject: `${userName} rejected a ${resource}`,
      invite: `${userName} invited a new user`,
      assign_role: `${userName} assigned a role to user`,
      remove_role: `${userName} removed role from user`,
      export: `${userName} exported ${resource} data`,
      import: `${userName} imported ${resource} data`,
      backup: `${userName} created system backup`,
      restore: `${userName} restored system data`
    }
    return descriptions[action as keyof typeof descriptions] || `${userName} performed ${action} on ${resource}`
  }

  const generateActionDetails = (action: string, resource: string): Record<string, any> => {
    const baseDetails = {
      timestamp: new Date().toISOString(),
      action,
      resource
    }

    switch (action) {
      case 'create':
        return {
          ...baseDetails,
          fields_created: ['name', 'description', 'status'],
          initial_values: { status: 'active' }
        }
      case 'update':
        return {
          ...baseDetails,
          fields_updated: ['status', 'amount', 'description'],
          old_values: { status: 'pending', amount: 1000 },
          new_values: { status: 'approved', amount: 1200 }
        }
      case 'delete':
        return {
          ...baseDetails,
          reason: 'No longer needed',
          confirmation: true
        }
      case 'login':
        return {
          ...baseDetails,
          login_method: 'email_password',
          two_factor: false,
          remember_me: true
        }
      default:
        return baseDetails
    }
  }

  const getRandomUserAgent = (): string => {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (Android 11; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0'
    ]
    return userAgents[Math.floor(Math.random() * userAgents.length)]
  }

  const getRandomLocation = (): string => {
    const locations = [
      'Dubai, UAE', 'Karachi, Pakistan', 'Cairo, Egypt', 'Riyadh, Saudi Arabia',
      'Muscat, Oman', 'Manama, Bahrain', 'Cape Town, South Africa'
    ]
    return locations[Math.floor(Math.random() * locations.length)]
  }

  const getRandomDevice = (): string => {
    const devices = ['Desktop', 'Mobile', 'Tablet', 'Laptop']
    return devices[Math.floor(Math.random() * devices.length)]
  }

  const applyFilters = () => {
    let filtered = [...auditLogs]

    // Date range filter
    if (filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      filtered = filtered.filter(log => new Date(log.timestamp) >= cutoffDate)
    }

    // User filter
    if (filters.userId !== 'all') {
      filtered = filtered.filter(log => log.userId === filters.userId)
    }

    // Action filter
    if (filters.action !== 'all') {
      filtered = filtered.filter(log => log.action === filters.action)
    }

    // Resource filter
    if (filters.resource !== 'all') {
      filtered = filtered.filter(log => log.resource === filters.resource)
    }

    // Severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(log => log.severity === filters.severity)
    }

    // Success filter
    if (filters.success !== 'all') {
      const successValue = filters.success === 'true'
      filtered = filtered.filter(log => log.success === successValue)
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(log =>
        log.description.toLowerCase().includes(searchLower) ||
        log.userName.toLowerCase().includes(searchLower) ||
        log.userEmail.toLowerCase().includes(searchLower) ||
        log.resource.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower)
      )
    }

    setFilteredLogs(filtered)
  }

  const handleFilterChange = (key: keyof AuditFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const exportAuditLogs = async () => {
    try {
      // Simulate export
      toast.success('Audit logs exported successfully')
    } catch (error) {
      toast.error('Failed to export audit logs')
    }
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={variants[severity as keyof typeof variants]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    )
  }

  const getSuccessIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    )
  }

  const getActionIcon = (action: string) => {
    const icons = {
      login: User,
      logout: User,
      create: Plus,
      update: Edit,
      delete: Trash2,
      view: Eye,
      approve: CheckCircle,
      reject: XCircle,
      invite: Users,
      assign_role: Shield,
      remove_role: Shield,
      export: Download,
      import: Upload,
      backup: Save,
      restore: RotateCcw
    }
    const IconComponent = icons[action as keyof typeof icons] || Activity
    return <IconComponent className="h-4 w-4" />
  }

  // Get unique values for filter dropdowns
  const uniqueUsers = [...new Set(auditLogs.map(log => ({ id: log.userId, name: log.userName })))]
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))]
  const uniqueResources = [...new Set(auditLogs.map(log => log.resource))]

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-8 w-8" />
              {t('audit.title')}
            </h1>
            <p className="text-muted-foreground">
              {isSuperAdmin 
                ? t('audit.description_super_admin')
                : t('audit.description_organization')
              }
            </p>
          </div>
          <Button onClick={exportAuditLogs} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t('audit.export')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('audit.total_events')}</p>
                  <p className="text-2xl font-bold">{filteredLogs.length}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('audit.successful_events')}</p>
                  <p className="text-2xl font-bold">
                    {filteredLogs.filter(log => log.success).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('audit.failed_events')}</p>
                  <p className="text-2xl font-bold">
                    {filteredLogs.filter(log => !log.success).length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('audit.unique_users')}</p>
                  <p className="text-2xl font-bold">{uniqueUsers.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t('audit.filters')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label>{t('audit.date_range')}</Label>
                <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t('audit.last_24_hours')}</SelectItem>
                    <SelectItem value="7">{t('audit.last_7_days')}</SelectItem>
                    <SelectItem value="30">{t('audit.last_30_days')}</SelectItem>
                    <SelectItem value="90">{t('audit.last_90_days')}</SelectItem>
                    <SelectItem value="all">{t('audit.all_time')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('audit.user')}</Label>
                <Select value={filters.userId} onValueChange={(value) => handleFilterChange('userId', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('audit.all_users')}</SelectItem>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('audit.action')}</Label>
                <Select value={filters.action} onValueChange={(value) => handleFilterChange('action', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('audit.all_actions')}</SelectItem>
                    {uniqueActions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('audit.resource')}</Label>
                <Select value={filters.resource} onValueChange={(value) => handleFilterChange('resource', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('audit.all_resources')}</SelectItem>
                    {uniqueResources.map((resource) => (
                      <SelectItem key={resource} value={resource}>
                        {resource.charAt(0).toUpperCase() + resource.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('audit.severity')}</Label>
                <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('audit.all_severities')}</SelectItem>
                    <SelectItem value="low">{t('audit.low')}</SelectItem>
                    <SelectItem value="medium">{t('audit.medium')}</SelectItem>
                    <SelectItem value="high">{t('audit.high')}</SelectItem>
                    <SelectItem value="critical">{t('audit.critical')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('audit.status')}</Label>
                <Select value={filters.success} onValueChange={(value) => handleFilterChange('success', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('audit.all_statuses')}</SelectItem>
                    <SelectItem value="true">{t('audit.successful')}</SelectItem>
                    <SelectItem value="false">{t('audit.failed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('audit.search')}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('audit.search_placeholder')}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('audit.audit_logs')}</CardTitle>
            <CardDescription>
              {t('audit.showing_results', { count: filteredLogs.length })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('audit.timestamp')}</TableHead>
                    <TableHead>{t('audit.user')}</TableHead>
                    <TableHead>{t('audit.action')}</TableHead>
                    <TableHead>{t('audit.resource')}</TableHead>
                    <TableHead>{t('audit.severity')}</TableHead>
                    <TableHead>{t('audit.status')}</TableHead>
                    <TableHead>{t('audit.details')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.slice(0, 50).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {log.userName.split(' ').map(n => n.charAt(0)).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{log.userName}</p>
                            <p className="text-xs text-muted-foreground">{log.userEmail}</p>
                            {!isSuperAdmin || (
                              <p className="text-xs text-muted-foreground">{log.organizationName}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="capitalize">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {log.resource}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getSeverityBadge(log.severity)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSuccessIcon(log.success)}
                          <span className="text-sm">
                            {log.success ? t('audit.success') : t('audit.failed')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedEntry(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredLogs.length > 50 && (
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  {t('audit.showing_limited_results')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Entry Details Dialog */}
        {selectedEntry && (
          <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t('audit.entry_details')}
                </DialogTitle>
                <DialogDescription>
                  {selectedEntry.description}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('audit.timestamp')}</Label>
                      <p className="text-sm">
                        {new Date(selectedEntry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label>{t('audit.user')}</Label>
                      <p className="text-sm">{selectedEntry.userName}</p>
                      <p className="text-xs text-muted-foreground">{selectedEntry.userEmail}</p>
                    </div>
                    <div>
                      <Label>{t('audit.action')}</Label>
                      <div className="flex items-center gap-2">
                        {getActionIcon(selectedEntry.action)}
                        <span className="text-sm capitalize">{selectedEntry.action}</span>
                      </div>
                    </div>
                    <div>
                      <Label>{t('audit.resource')}</Label>
                      <Badge variant="outline" className="capitalize">
                        {selectedEntry.resource}
                      </Badge>
                    </div>
                    <div>
                      <Label>{t('audit.severity')}</Label>
                      {getSeverityBadge(selectedEntry.severity)}
                    </div>
                    <div>
                      <Label>{t('audit.status')}</Label>
                      <div className="flex items-center gap-2">
                        {getSuccessIcon(selectedEntry.success)}
                        <span className="text-sm">
                          {selectedEntry.success ? t('audit.success') : t('audit.failed')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Technical Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('audit.technical_details')}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <Label>{t('audit.ip_address')}</Label>
                          <p className="text-sm">{selectedEntry.ipAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <Label>{t('audit.location')}</Label>
                          <p className="text-sm">{selectedEntry.location || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedEntry.device === 'Mobile' ? (
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <Label>{t('audit.device')}</Label>
                          <p className="text-sm">{selectedEntry.device}</p>
                        </div>
                      </div>
                      <div>
                        <Label>{t('audit.user_agent')}</Label>
                        <p className="text-xs text-muted-foreground break-all">
                          {selectedEntry.userAgent}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('audit.action_details')}</h3>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(selectedEntry.details, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Organization and Project Info */}
                  {(selectedEntry.organizationName || selectedEntry.projectName) && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{t('audit.context_information')}</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedEntry.organizationName && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <Label>{t('audit.organization')}</Label>
                                <p className="text-sm">{selectedEntry.organizationName}</p>
                              </div>
                            </div>
                          )}
                          {selectedEntry.projectName && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <Label>{t('audit.project')}</Label>
                                <p className="text-sm">{selectedEntry.projectName}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Metadata */}
                  {selectedEntry.metadata && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{t('audit.metadata')}</h3>
                        <div className="bg-muted rounded-lg p-4">
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(selectedEntry.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}