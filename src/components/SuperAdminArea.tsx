import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { useInternationalization } from './providers/InternationalizationProvider'
import { useAppNavigation } from './hooks/useAppNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { toast } from 'sonner@2.0.3'
import { 
  Building, 
  Users, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Settings, 
  Crown,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
  TestTube,
  Database
} from 'lucide-react'
import { SuperAdminSettings } from './SuperAdminSettings'

interface Organization {
  id: string
  name: string
  email: string
  phone: string
  address: string
  website: string
  industry: string
  size: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  plan: 'free' | 'basic' | 'premium' | 'enterprise'
  paymentType: 'prepaid' | 'postpaid'
  createdAt: string
  ownerId: string
  ownerName: string
  ownerEmail: string
  documentsSubmitted: boolean
  verificationStatus: 'pending' | 'verified' | 'rejected'
  monthlyRevenue?: number
  employeeCount?: number
  reason?: string
}

interface PendingUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  organizationId: string
  organizationName: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  invitedBy: string
  lastLogin?: string
}

interface SystemMetrics {
  totalOrganizations: number
  pendingApprovals: number
  totalUsers: number
  monthlyRevenue: number
  activeSubscriptions: number
  conversionRate: number
}

export function SuperAdminArea() {
  const { user } = useAuth()
  const { t } = useInternationalization()
  const { setCurrentForm } = useAppNavigation()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalOrganizations: 0,
    pendingApprovals: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    conversionRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)

  // Check if user is super admin
  const isSuperAdmin = user?.role === 'super_admin'

  useEffect(() => {
    if (isSuperAdmin) {
      loadData()
    }
  }, [isSuperAdmin])

  const loadData = async () => {
    try {
      setLoading(true)
      // Simulate API calls
      await Promise.all([
        loadOrganizations(),
        loadPendingUsers(),
        loadSystemMetrics()
      ])
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadOrganizations = async () => {
    // Simulate API call
    const mockOrganizations: Organization[] = [
      {
        id: '1',
        name: 'Prime Real Estate LLC',
        email: 'admin@primerealestate.com',
        phone: '+971-4-123-4567',
        address: 'Dubai Marina, Dubai, UAE',
        website: 'www.primerealestate.com',
        industry: 'Real Estate',
        size: '50-100',
        status: 'pending',
        plan: 'premium',
        paymentType: 'postpaid',
        createdAt: '2024-01-15T10:00:00Z',
        ownerId: 'owner1',
        ownerName: 'Ahmed Al-Mansouri',
        ownerEmail: 'ahmed@primerealestate.com',
        documentsSubmitted: true,
        verificationStatus: 'pending',
        monthlyRevenue: 150000,
        employeeCount: 75
      },
      {
        id: '2',
        name: 'Karachi Properties',
        email: 'info@karachiproperties.pk',
        phone: '+92-21-987-6543',
        address: 'Clifton, Karachi, Pakistan',
        website: 'www.karachiproperties.pk',
        industry: 'Real Estate',
        size: '20-50',
        status: 'approved',
        plan: 'basic',
        paymentType: 'prepaid',
        createdAt: '2024-01-10T08:00:00Z',
        ownerId: 'owner2',
        ownerName: 'Muhammad Hassan',
        ownerEmail: 'hassan@karachiproperties.pk',
        documentsSubmitted: true,
        verificationStatus: 'verified',
        monthlyRevenue: 85000,
        employeeCount: 35
      },
      {
        id: '3',
        name: 'Cairo Development Co',
        email: 'contact@cairodevelopment.eg',
        phone: '+20-2-555-1234',
        address: 'New Cairo, Cairo, Egypt',
        website: 'www.cairodevelopment.eg',
        industry: 'Property Development',
        size: '100+',
        status: 'rejected',
        plan: 'enterprise',
        paymentType: 'postpaid',
        createdAt: '2024-01-08T12:00:00Z',
        ownerId: 'owner3',
        ownerName: 'Omar El-Rashid',
        ownerEmail: 'omar@cairodevelopment.eg',
        documentsSubmitted: false,
        verificationStatus: 'rejected',
        reason: 'Incomplete documentation and verification failed'
      }
    ]
    setOrganizations(mockOrganizations)
  }

  const loadPendingUsers = async () => {
    // Simulate API call
    const mockUsers: PendingUser[] = [
      {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@primerealestate.com',
        role: 'project_manager',
        organizationId: '1',
        organizationName: 'Prime Real Estate LLC',
        status: 'pending',
        createdAt: '2024-01-16T10:00:00Z',
        invitedBy: 'Ahmed Al-Mansouri'
      },
      {
        id: '2',
        firstName: 'Ali',
        lastName: 'Rahman',
        email: 'ali@karachiproperties.pk',
        role: 'sales_manager',
        organizationId: '2',
        organizationName: 'Karachi Properties',
        status: 'pending',
        createdAt: '2024-01-17T14:00:00Z',
        invitedBy: 'Muhammad Hassan'
      }
    ]
    setPendingUsers(mockUsers)
  }

  const loadSystemMetrics = async () => {
    // Simulate API call
    const metrics: SystemMetrics = {
      totalOrganizations: 25,
      pendingApprovals: 8,
      totalUsers: 247,
      monthlyRevenue: 45000,
      activeSubscriptions: 22,
      conversionRate: 72.5
    }
    setSystemMetrics(metrics)
  }

  const handleOrganizationAction = async (orgId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setOrganizations(prev => prev.map(org => 
        org.id === orgId 
          ? { ...org, status: action === 'approve' ? 'approved' : 'rejected', reason }
          : org
      ))
      
      toast.success(`Organization ${action}d successfully`)
      
      if (action === 'approve') {
        // Send welcome email
        await sendWelcomeEmail(orgId)
      }
    } catch (error) {
      toast.error(`Failed to ${action} organization`)
    }
  }

  const handleUserAction = async (userId: string, action: 'approve' | 'reject') => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPendingUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: action === 'approve' ? 'approved' : 'rejected' }
          : user
      ))
      
      toast.success(`User ${action}d successfully`)
    } catch (error) {
      toast.error(`Failed to ${action} user`)
    }
  }

  const sendWelcomeEmail = async (orgId: string) => {
    // Simulate sending welcome email with setup instructions
    console.log(`Sending welcome email to organization ${orgId}`)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      approved: 'default',
      rejected: 'destructive',
      suspended: 'secondary'
    } as const

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    }

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the Super Admin area.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Crown className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage organizations, users, and system-wide settings
            </p>
          </div>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.totalOrganizations}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{systemMetrics.pendingApprovals}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +18% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${systemMetrics.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +25% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.activeSubscriptions}</div>
                  <p className="text-xs text-muted-foreground">
                    88% retention rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Organization Requests</CardTitle>
                <CardDescription>
                  Latest organization registration requests requiring approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organizations.filter(org => org.status === 'pending').slice(0, 3).map((org) => (
                    <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-muted-foreground">{org.industry} • {org.size} employees</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(org.status)}
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrganization(org)}>
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Management</CardTitle>
                <CardDescription>
                  Review and approve organization registration requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search organizations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                {/* Organizations Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrganizations.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{org.name}</p>
                                <p className="text-sm text-muted-foreground">{org.industry}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{org.ownerName}</p>
                              <p className="text-sm text-muted-foreground">{org.ownerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {org.plan}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(org.status)}
                          </TableCell>
                          <TableCell>
                            {new Date(org.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedOrganization(org)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {org.status === 'pending' && (
                                <>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Approve Organization</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to approve "{org.name}"? This will activate their account and send them welcome instructions.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleOrganizationAction(org.id, 'approve')}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          Approve
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="text-red-600">
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Reject Organization</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to reject "{org.name}"? Please provide a reason for rejection.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <div className="py-4">
                                        <Label htmlFor="rejection-reason">Reason for rejection</Label>
                                        <Textarea 
                                          id="rejection-reason"
                                          placeholder="Please explain why this organization is being rejected..."
                                          className="mt-2"
                                        />
                                      </div>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleOrganizationAction(org.id, 'reject', 'Reason provided by admin')}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Reject
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending User Approvals</CardTitle>
                <CardDescription>
                  Review and approve user account requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.role} at {user.organizationName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(user.status)}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600"
                          onClick={() => handleUserAction(user.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleUserAction(user.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Manage system-wide settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Payment Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Free Trial Period</Label>
                          <Select defaultValue="30">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="14">14 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="60">60 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Grace Period</Label>
                          <Select defaultValue="7">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 days</SelectItem>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="14">14 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Organization Limits</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Max Users (Basic)</Label>
                          <Input className="w-32" defaultValue="10" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Max Users (Premium)</Label>
                          <Input className="w-32" defaultValue="100" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Max Projects</Label>
                          <Input className="w-32" defaultValue="50" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button>Save System Settings</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Database & Infrastructure Testing
                </CardTitle>
                <CardDescription>
                  Test Supabase connectivity, database operations, and system health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Run comprehensive tests on database connectivity, authentication, CRUD operations, 
                    and verify all expected tables exist with proper permissions.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setCurrentForm('supabase-test')}
                      className="flex items-center gap-2"
                    >
                      <TestTube className="h-4 w-4" />
                      Supabase Test Suite
                    </Button>
                    <Button 
                      onClick={() => setCurrentForm('ui-test-suite')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <TestTube className="h-4 w-4" />
                      UI Test Suite
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SuperAdminSettings />
          </TabsContent>
        </Tabs>

        {/* Organization Details Dialog */}
        {selectedOrganization && (
          <Dialog open={!!selectedOrganization} onOpenChange={() => setSelectedOrganization(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Organization Details</DialogTitle>
                <DialogDescription>
                  Review complete organization information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Organization Name</Label>
                    <p className="text-sm font-medium">{selectedOrganization.name}</p>
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <p className="text-sm">{selectedOrganization.industry}</p>
                  </div>
                  <div>
                    <Label>Company Size</Label>
                    <p className="text-sm">{selectedOrganization.size} employees</p>
                  </div>
                  <div>
                    <Label>Website</Label>
                    <p className="text-sm">{selectedOrganization.website}</p>
                  </div>
                </div>
                
                <div>
                  <Label>Address</Label>
                  <p className="text-sm">{selectedOrganization.address}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Owner Name</Label>
                    <p className="text-sm font-medium">{selectedOrganization.ownerName}</p>
                  </div>
                  <div>
                    <Label>Owner Email</Label>
                    <p className="text-sm">{selectedOrganization.ownerEmail}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm">{selectedOrganization.phone}</p>
                  </div>
                  <div>
                    <Label>Registration Date</Label>
                    <p className="text-sm">{new Date(selectedOrganization.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Plan</Label>
                    <p className="text-sm capitalize">{selectedOrganization.plan}</p>
                  </div>
                  <div>
                    <Label>Payment Type</Label>
                    <p className="text-sm capitalize">{selectedOrganization.paymentType}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    {getStatusBadge(selectedOrganization.status)}
                  </div>
                </div>

                {selectedOrganization.reason && (
                  <div>
                    <Label>Rejection Reason</Label>
                    <p className="text-sm text-red-600">{selectedOrganization.reason}</p>
                  </div>
                )}

                {selectedOrganization.status === 'pending' && (
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => {
                        handleOrganizationAction(selectedOrganization.id, 'approve')
                        setSelectedOrganization(null)
                      }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        handleOrganizationAction(selectedOrganization.id, 'reject', 'Reviewed and rejected')
                        setSelectedOrganization(null)
                      }}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}