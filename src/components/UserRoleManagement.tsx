import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { useInternationalization } from './providers/InternationalizationProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Checkbox } from './ui/checkbox'
import { Separator } from './ui/separator'
import { toast } from 'sonner@2.0.3'
import { 
  Shield, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Lock, 
  Unlock,
  UserCheck,
  UserX,
  Copy,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface Permission {
  id: string
  name: string
  description: string
  category: string
  resource: string
  action: string
}

interface Role {
  id: string
  name: string
  description: string
  type: 'system' | 'custom'
  permissions: string[]
  userCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface UserRole {
  userId: string
  userName: string
  userEmail: string
  role: string
  roleId: string
  assignedAt: string
  assignedBy: string
  status: 'active' | 'inactive' | 'suspended'
  lastLogin?: string
}

interface PermissionCategory {
  name: string
  description: string
  permissions: Permission[]
}

export function UserRoleManagement() {
  const { user, currentOrganization } = useAuth()
  const { t } = useInternationalization()
  
  const [activeTab, setActiveTab] = useState('roles')
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<PermissionCategory[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        loadRoles(),
        loadPermissions(),
        loadUserRoles()
      ])
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    // Simulate API call
    const mockRoles: Role[] = [
      {
        id: '1',
        name: 'Organization Owner',
        description: 'Full access to all organization features and settings',
        type: 'system',
        permissions: ['*'],
        userCount: 1,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System'
      },
      {
        id: '2',
        name: 'Project Manager',
        description: 'Manage projects, expenses, and team members',
        type: 'system',
        permissions: ['projects.read', 'projects.write', 'expenses.read', 'expenses.write', 'users.read'],
        userCount: 5,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        createdBy: 'System'
      },
      {
        id: '3',
        name: 'Sales Manager',
        description: 'Access to sales, commissions, and customer management',
        type: 'system',
        permissions: ['sales.read', 'sales.write', 'commissions.read', 'customers.read', 'customers.write'],
        userCount: 3,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
        createdBy: 'System'
      },
      {
        id: '4',
        name: 'Finance Manager',
        description: 'Manage expenses, invoices, and financial reports',
        type: 'system',
        permissions: ['expenses.read', 'expenses.approve', 'invoices.read', 'invoices.write', 'reports.read'],
        userCount: 2,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-08T00:00:00Z',
        createdBy: 'System'
      },
      {
        id: '5',
        name: 'Employee',
        description: 'Basic access to submit expenses and view assigned projects',
        type: 'system',
        permissions: ['expenses.create', 'projects.read', 'profile.read', 'profile.write'],
        userCount: 15,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System'
      },
      {
        id: '6',
        name: 'Custom Accountant',
        description: 'Custom role with specific accounting permissions',
        type: 'custom',
        permissions: ['expenses.read', 'invoices.read', 'reports.read', 'vendors.read'],
        userCount: 1,
        isActive: true,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z',
        createdBy: user?.id || 'admin'
      }
    ]
    setRoles(mockRoles)
  }

  const loadPermissions = async () => {
    // Simulate API call
    const mockPermissions: PermissionCategory[] = [
      {
        name: 'Project Management',
        description: 'Permissions related to project operations',
        permissions: [
          { id: 'projects.read', name: 'View Projects', description: 'View project details and status', category: 'Project Management', resource: 'projects', action: 'read' },
          { id: 'projects.write', name: 'Manage Projects', description: 'Create, edit, and delete projects', category: 'Project Management', resource: 'projects', action: 'write' },
          { id: 'projects.delete', name: 'Delete Projects', description: 'Delete projects and related data', category: 'Project Management', resource: 'projects', action: 'delete' },
          { id: 'milestones.read', name: 'View Milestones', description: 'View project milestones', category: 'Project Management', resource: 'milestones', action: 'read' },
          { id: 'milestones.write', name: 'Manage Milestones', description: 'Create and edit milestones', category: 'Project Management', resource: 'milestones', action: 'write' }
        ]
      },
      {
        name: 'Financial Management',
        description: 'Permissions for financial operations',
        permissions: [
          { id: 'expenses.read', name: 'View Expenses', description: 'View expense reports and details', category: 'Financial Management', resource: 'expenses', action: 'read' },
          { id: 'expenses.create', name: 'Create Expenses', description: 'Submit new expense reports', category: 'Financial Management', resource: 'expenses', action: 'create' },
          { id: 'expenses.write', name: 'Manage Expenses', description: 'Edit and update expenses', category: 'Financial Management', resource: 'expenses', action: 'write' },
          { id: 'expenses.approve', name: 'Approve Expenses', description: 'Approve or reject expense reports', category: 'Financial Management', resource: 'expenses', action: 'approve' },
          { id: 'invoices.read', name: 'View Invoices', description: 'View invoice details', category: 'Financial Management', resource: 'invoices', action: 'read' },
          { id: 'invoices.write', name: 'Manage Invoices', description: 'Create and edit invoices', category: 'Financial Management', resource: 'invoices', action: 'write' }
        ]
      },
      {
        name: 'Sales & Commissions',
        description: 'Permissions for sales operations',
        permissions: [
          { id: 'sales.read', name: 'View Sales', description: 'View sales data and reports', category: 'Sales & Commissions', resource: 'sales', action: 'read' },
          { id: 'sales.write', name: 'Manage Sales', description: 'Create and edit sales records', category: 'Sales & Commissions', resource: 'sales', action: 'write' },
          { id: 'commissions.read', name: 'View Commissions', description: 'View commission calculations', category: 'Sales & Commissions', resource: 'commissions', action: 'read' },
          { id: 'commissions.write', name: 'Manage Commissions', description: 'Configure commission structures', category: 'Sales & Commissions', resource: 'commissions', action: 'write' },
          { id: 'customers.read', name: 'View Customers', description: 'View customer information', category: 'Sales & Commissions', resource: 'customers', action: 'read' },
          { id: 'customers.write', name: 'Manage Customers', description: 'Create and edit customer records', category: 'Sales & Commissions', resource: 'customers', action: 'write' }
        ]
      },
      {
        name: 'User Management',
        description: 'Permissions for user operations',
        permissions: [
          { id: 'users.read', name: 'View Users', description: 'View user profiles and information', category: 'User Management', resource: 'users', action: 'read' },
          { id: 'users.write', name: 'Manage Users', description: 'Create, edit, and manage users', category: 'User Management', resource: 'users', action: 'write' },
          { id: 'users.invite', name: 'Invite Users', description: 'Send user invitations', category: 'User Management', resource: 'users', action: 'invite' },
          { id: 'roles.read', name: 'View Roles', description: 'View role definitions', category: 'User Management', resource: 'roles', action: 'read' },
          { id: 'roles.write', name: 'Manage Roles', description: 'Create and edit roles', category: 'User Management', resource: 'roles', action: 'write' }
        ]
      },
      {
        name: 'System Administration',
        description: 'Permissions for system operations',
        permissions: [
          { id: 'settings.read', name: 'View Settings', description: 'View system and organization settings', category: 'System Administration', resource: 'settings', action: 'read' },
          { id: 'settings.write', name: 'Manage Settings', description: 'Configure system settings', category: 'System Administration', resource: 'settings', action: 'write' },
          { id: 'reports.read', name: 'View Reports', description: 'Access to reports and analytics', category: 'System Administration', resource: 'reports', action: 'read' },
          { id: 'audit.read', name: 'View Audit Logs', description: 'Access to audit trail logs', category: 'System Administration', resource: 'audit', action: 'read' },
          { id: 'vendors.read', name: 'View Vendors', description: 'View vendor information', category: 'System Administration', resource: 'vendors', action: 'read' },
          { id: 'vendors.write', name: 'Manage Vendors', description: 'Create and edit vendor records', category: 'System Administration', resource: 'vendors', action: 'write' }
        ]
      },
      {
        name: 'Profile Management',
        description: 'Permissions for profile operations',
        permissions: [
          { id: 'profile.read', name: 'View Profile', description: 'View own profile information', category: 'Profile Management', resource: 'profile', action: 'read' },
          { id: 'profile.write', name: 'Edit Profile', description: 'Edit own profile information', category: 'Profile Management', resource: 'profile', action: 'write' }
        ]
      }
    ]
    setPermissions(mockPermissions)
  }

  const loadUserRoles = async () => {
    // Simulate API call
    const mockUserRoles: UserRole[] = [
      {
        userId: '1',
        userName: 'Ahmed Al-Mansouri',
        userEmail: 'ahmed@primerealestate.com',
        role: 'Organization Owner',
        roleId: '1',
        assignedAt: '2024-01-01T00:00:00Z',
        assignedBy: 'System',
        status: 'active',
        lastLogin: '2024-01-20T10:30:00Z'
      },
      {
        userId: '2',
        userName: 'Sarah Johnson',
        userEmail: 'sarah@primerealestate.com',
        role: 'Project Manager',
        roleId: '2',
        assignedAt: '2024-01-05T00:00:00Z',
        assignedBy: 'Ahmed Al-Mansouri',
        status: 'active',
        lastLogin: '2024-01-19T14:20:00Z'
      },
      {
        userId: '3',
        userName: 'Muhammad Hassan',
        userEmail: 'hassan@primerealestate.com',
        role: 'Sales Manager',
        roleId: '3',
        assignedAt: '2024-01-08T00:00:00Z',
        assignedBy: 'Ahmed Al-Mansouri',
        status: 'active',
        lastLogin: '2024-01-18T09:15:00Z'
      },
      {
        userId: '4',
        userName: 'Lisa Chen',
        userEmail: 'lisa@primerealestate.com',
        role: 'Finance Manager',
        roleId: '4',
        assignedAt: '2024-01-10T00:00:00Z',
        assignedBy: 'Ahmed Al-Mansouri',
        status: 'active',
        lastLogin: '2024-01-17T11:45:00Z'
      },
      {
        userId: '5',
        userName: 'John Smith',
        userEmail: 'john@primerealestate.com',
        role: 'Employee',
        roleId: '5',
        assignedAt: '2024-01-15T00:00:00Z',
        assignedBy: 'Sarah Johnson',
        status: 'inactive'
      }
    ]
    setUserRoles(mockUserRoles)
  }

  const handleCreateRole = async () => {
    try {
      if (!newRole.name.trim()) {
        toast.error('Role name is required')
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const role: Role = {
        id: `role_${Date.now()}`,
        name: newRole.name,
        description: newRole.description,
        type: 'custom',
        permissions: newRole.permissions,
        userCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user?.id || 'admin'
      }

      setRoles(prev => [...prev, role])
      setNewRole({ name: '', description: '', permissions: [] })
      setIsCreateRoleOpen(false)
      toast.success('Role created successfully')
    } catch (error) {
      toast.error('Failed to create role')
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    try {
      const role = roles.find(r => r.id === roleId)
      if (role?.type === 'system') {
        toast.error('Cannot delete system roles')
        return
      }

      if (role?.userCount && role.userCount > 0) {
        toast.error('Cannot delete role with assigned users')
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setRoles(prev => prev.filter(r => r.id !== roleId))
      toast.success('Role deleted successfully')
    } catch (error) {
      toast.error('Failed to delete role')
    }
  }

  const handleToggleRoleStatus = async (roleId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setRoles(prev => prev.map(role => 
        role.id === roleId 
          ? { ...role, isActive: !role.isActive, updatedAt: new Date().toISOString() }
          : role
      ))
      toast.success('Role status updated')
    } catch (error) {
      toast.error('Failed to update role status')
    }
  }

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      setNewRole(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }))
    } else {
      setNewRole(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permissionId)
      }))
    }
  }

  const getRoleTypeBadge = (type: string) => {
    return type === 'system' 
      ? <Badge variant="secondary">System</Badge>
      : <Badge variant="outline">Custom</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    }

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredUserRoles = userRoles.filter(userRole =>
    userRole.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userRole.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userRole.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              {t('roles.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('roles.description')}
            </p>
          </div>
          <Button onClick={() => setIsCreateRoleOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('roles.create_role')}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roles">{t('roles.roles')}</TabsTrigger>
            <TabsTrigger value="permissions">{t('roles.permissions')}</TabsTrigger>
            <TabsTrigger value="assignments">{t('roles.user_assignments')}</TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('roles.role_management')}</CardTitle>
                <CardDescription>
                  {t('roles.role_management_description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('roles.search_roles')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Roles Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('roles.role_name')}</TableHead>
                        <TableHead>{t('roles.description')}</TableHead>
                        <TableHead>{t('roles.type')}</TableHead>
                        <TableHead>{t('roles.users')}</TableHead>
                        <TableHead>{t('roles.status')}</TableHead>
                        <TableHead>{t('roles.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{role.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {role.permissions.length === 1 && role.permissions[0] === '*' 
                                  ? 'All permissions' 
                                  : `${role.permissions.length} permissions`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{role.description}</p>
                          </TableCell>
                          <TableCell>
                            {getRoleTypeBadge(role.type)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{role.userCount}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {role.isActive ? (
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedRole(role)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleToggleRoleStatus(role.id)}
                              >
                                {role.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                              </Button>
                              {role.type === 'custom' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteRole(role.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('roles.permission_overview')}</CardTitle>
                <CardDescription>
                  {t('roles.permission_overview_description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {permissions.map((category) => (
                    <div key={category.name} className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.permissions.map((permission) => (
                          <Card key={permission.id} className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">{permission.name}</p>
                                <Badge variant="outline" className="text-xs">
                                  {permission.action}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Resource: {permission.resource}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('roles.user_role_assignments')}</CardTitle>
                <CardDescription>
                  {t('roles.user_assignments_description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('roles.search_users')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* User Assignments Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('roles.user')}</TableHead>
                        <TableHead>{t('roles.role')}</TableHead>
                        <TableHead>{t('roles.assigned_by')}</TableHead>
                        <TableHead>{t('roles.assigned_date')}</TableHead>
                        <TableHead>{t('roles.last_login')}</TableHead>
                        <TableHead>{t('roles.status')}</TableHead>
                        <TableHead>{t('roles.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUserRoles.map((userRole) => (
                        <TableRow key={userRole.userId}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {userRole.userName.split(' ').map(n => n.charAt(0)).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{userRole.userName}</p>
                                <p className="text-sm text-muted-foreground">{userRole.userEmail}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{userRole.role}</Badge>
                          </TableCell>
                          <TableCell>{userRole.assignedBy}</TableCell>
                          <TableCell>
                            {new Date(userRole.assignedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {userRole.lastLogin 
                              ? new Date(userRole.lastLogin).toLocaleDateString()
                              : 'Never'
                            }
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(userRole.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                {userRole.status === 'active' 
                                  ? <UserX className="h-4 w-4" />
                                  : <UserCheck className="h-4 w-4" />
                                }
                              </Button>
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
        </Tabs>

        {/* Create Role Dialog */}
        <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('roles.create_new_role')}</DialogTitle>
              <DialogDescription>
                {t('roles.create_role_description')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">{t('roles.role_name')}</Label>
                  <Input
                    id="roleName"
                    value={newRole.name}
                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('roles.enter_role_name')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDescription">{t('roles.description')}</Label>
                  <Textarea
                    id="roleDescription"
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('roles.enter_description')}
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('roles.select_permissions')}</h3>
                <div className="space-y-6">
                  {permissions.map((category) => (
                    <div key={category.name} className="space-y-3">
                      <h4 className="font-medium">{category.name}</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {category.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={newRole.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)}
                            />
                            <div className="flex-1">
                              <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                                {permission.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleCreateRole}>
                  {t('roles.create_role')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Role Details Dialog */}
        {selectedRole && (
          <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedRole.name}</DialogTitle>
                <DialogDescription>
                  {selectedRole.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('roles.type')}</Label>
                    <p className="text-sm">{getRoleTypebadge(selectedRole.type)}</p>
                  </div>
                  <div>
                    <Label>{t('roles.users_assigned')}</Label>
                    <p className="text-sm">{selectedRole.userCount}</p>
                  </div>
                  <div>
                    <Label>{t('roles.created_date')}</Label>
                    <p className="text-sm">{new Date(selectedRole.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>{t('roles.last_updated')}</Label>
                    <p className="text-sm">{new Date(selectedRole.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <Label>{t('roles.permissions')}</Label>
                  <div className="mt-2 space-y-4">
                    {selectedRole.permissions.includes('*') ? (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        All Permissions (Full Access)
                      </Badge>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {permissions.map(category => {
                          const rolePermissions = category.permissions.filter(p => 
                            selectedRole.permissions.includes(p.id)
                          )
                          
                          if (rolePermissions.length === 0) return null

                          return (
                            <div key={category.name} className="space-y-2">
                              <h4 className="font-medium text-sm">{category.name}</h4>
                              <div className="flex flex-wrap gap-1">
                                {rolePermissions.map(permission => (
                                  <Badge key={permission.id} variant="outline" className="text-xs">
                                    {permission.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}