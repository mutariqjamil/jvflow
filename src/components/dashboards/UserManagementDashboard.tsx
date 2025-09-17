import { useState } from 'react'
import { useAuth } from '../AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Alert, AlertDescription } from '../ui/alert'
import { UserInvitationDialog } from '../UserInvitationDialog'
import { BillingSetupDialog } from '../BillingSetupDialog'
import { 
  Plus, 
  Users, 
  UserCheck, 
  UserX,
  Settings,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  Edit,
  Trash2,
  UserPlus,
  Clock,
  CreditCard,
  AlertCircle,
  Crown,
  Building2
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'billing_manager' | 'marketing_manager' | 'accounts_manager' | 'project_manager' | 'investor' | 'builder' | 'marketing'
  status: 'active' | 'inactive' | 'pending'
  phone?: string
  company?: string
  created_at: string
  last_login?: string
  projects_assigned: number
  invitation_status?: 'sent' | 'accepted' | 'expired'
}

interface PendingInvitation {
  id: string
  email?: string
  phone?: string
  role: string
  status: 'pending' | 'accepted' | 'expired'
  sent_by: string
  created_at: string
  expires_at: string
}

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@jvflow.com',
    role: 'owner',
    status: 'active',
    phone: '+1 (555) 123-4567',
    company: 'JV-Flow Inc.',
    created_at: '2025-01-15T10:00:00Z',
    last_login: '2025-08-27T09:00:00Z',
    projects_assigned: 5
  },
  {
    id: '2',
    name: 'Sarah Investor',
    email: 'sarah.investor@example.com',
    role: 'investor',
    status: 'active',
    phone: '+1 (555) 234-5678',
    company: 'Capital Ventures LLC',
    created_at: '2025-02-01T14:30:00Z',
    last_login: '2025-08-27T08:15:00Z',
    projects_assigned: 3
  },
  {
    id: '3',
    name: 'Mike Builder',
    email: 'mike.builder@construction.com',
    role: 'builder',
    status: 'active',
    phone: '+1 (555) 345-6789',
    company: 'ABC Construction Co.',
    created_at: '2025-02-10T11:00:00Z',
    last_login: '2025-08-26T16:30:00Z',
    projects_assigned: 2
  },
  {
    id: '4',
    name: 'Lisa Marketing',
    email: 'lisa@marketingpro.com',
    role: 'marketing_manager',
    status: 'active',
    phone: '+1 (555) 456-7890',
    company: 'Marketing Pro Agency',
    created_at: '2025-02-20T09:15:00Z',
    last_login: '2025-08-27T07:45:00Z',
    projects_assigned: 4
  },
  {
    id: '5',
    name: 'Robert Accounts',
    email: 'robert@accounts.com',
    role: 'accounts_manager',
    status: 'active',
    phone: '+1 (555) 567-8901',
    company: 'Financial Services Inc.',
    created_at: '2025-08-20T16:00:00Z',
    last_login: '2025-08-26T14:30:00Z',
    projects_assigned: 3
  }
]

const mockInvitations: PendingInvitation[] = [
  {
    id: 'inv-1',
    email: 'new.user@example.com',
    role: 'project_manager',
    status: 'pending',
    sent_by: 'John Admin',
    created_at: '2025-08-25T16:00:00Z',
    expires_at: '2025-09-01T16:00:00Z'
  },
  {
    id: 'inv-2',
    phone: '+1 (555) 999-8888',
    role: 'billing_manager',
    status: 'pending',
    sent_by: 'John Admin',
    created_at: '2025-08-26T10:00:00Z',
    expires_at: '2025-09-02T10:00:00Z'
  }
]

export function UserManagementDashboard() {
  const { currentOrganization, trialDaysRemaining, isDemoMode } = useAuth()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [invitations, setInvitations] = useState<PendingInvitation[]>(mockInvitations)
  const [showAddUser, setShowAddUser] = useState(false)
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    company: ''
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-red-100 text-red-800 border-red-200'
      case 'admin': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'billing_manager': return 'bg-green-100 text-green-800 border-green-200'
      case 'marketing_manager': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'accounts_manager': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'project_manager': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'investor': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'builder': return 'bg-green-100 text-green-800 border-green-200'
      case 'marketing': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never'
    const now = new Date()
    const loginDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return formatDate(dateString)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.company?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesStatus && matchesSearch
  })

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    byRole: {
      admin: users.filter(u => u.role === 'admin').length,
      investor: users.filter(u => u.role === 'investor').length,
      builder: users.filter(u => u.role === 'builder').length,
      marketing: users.filter(u => u.role === 'marketing').length,
    }
  }

  const handleAddUser = () => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      status: 'pending',
      phone: newUser.phone,
      company: newUser.company,
      created_at: new Date().toISOString(),
      projects_assigned: 0
    }
    
    setUsers(prev => [user, ...prev])
    setNewUser({ name: '', email: '', role: '', phone: '', company: '' })
    setShowAddUser(false)
  }

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  return (
    <div className="space-y-6">
      {/* Header with trial status */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage organization users and role-based access control
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Trial Status Warning */}
          {currentOrganization?.subscription_status === 'trial' && trialDaysRemaining <= 7 && (
            <Alert className="w-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Trial ends in {trialDaysRemaining} days. 
                <BillingSetupDialog 
                  trigger={
                    <Button variant="link" className="p-0 h-auto text-sm underline ml-1">
                      Setup billing
                    </Button>
                  }
                />
              </AlertDescription>
            </Alert>
          )}
          
          {/* Action Buttons */}
          <UserInvitationDialog 
            trigger={
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            }
            onInvitationSent={() => {
              // Refresh invitations list
              console.log('Invitation sent - refreshing list')
            }}
          />
          
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account and assign appropriate roles
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => 
                      setNewUser(prev => ({ ...prev, role: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="billing_manager">Billing Manager</SelectItem>
                        <SelectItem value="marketing_manager">Marketing Manager</SelectItem>
                        <SelectItem value="accounts_manager">Accounts Manager</SelectItem>
                        <SelectItem value="project_manager">Project Manager</SelectItem>
                        <SelectItem value="investor">Investor</SelectItem>
                        <SelectItem value="builder">Builder</SelectItem>
                        <SelectItem value="marketing">Marketing Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={newUser.phone}
                      onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Company name"
                    value={newUser.company}
                    onChange={(e) => setNewUser(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email || !newUser.role}>
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.active} active, {userStats.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
            <p className="text-xs text-muted-foreground">
              {((userStats.active / userStats.total) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{userStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Require activation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Distribution</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Admin: {userStats.byRole.admin}</span>
                <span>Investor: {userStats.byRole.investor}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Builder: {userStats.byRole.builder}</span>
                <span>Marketing: {userStats.byRole.marketing}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Pending Invitations</span>
              <Badge variant="outline">{invitations.filter(i => i.status === 'pending').length}</Badge>
            </CardTitle>
            <CardDescription>Track sent invitations and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {invitation.email ? (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">
                        {invitation.email || invitation.phone}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {invitation.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-muted-foreground">
                      Sent by {invitation.sent_by}
                    </div>
                    <Badge 
                      variant={invitation.status === 'pending' ? 'default' : 'secondary'}
                      className={invitation.status === 'pending' ? 'bg-orange-100 text-orange-800' : ''}
                    >
                      {invitation.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Resend
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organization Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Organization Details</span>
          </CardTitle>
          <CardDescription>Current organization information and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Organization</Label>
              <p className="font-medium">{currentOrganization?.name}</p>
              <p className="text-sm text-muted-foreground">{currentOrganization?.description}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Subscription</Label>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={
                    currentOrganization?.subscription_status === 'trial' 
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      : 'bg-green-100 text-green-800 border-green-200'
                  }
                >
                  {currentOrganization?.subscription_status === 'trial' && (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {currentOrganization?.subscription_status === 'active' && (
                    <CreditCard className="h-3 w-3 mr-1" />
                  )}
                  {currentOrganization?.subscription_status === 'trial' ? `Trial (${trialDaysRemaining}d)` : 'Active'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Your Role</Label>
              <Badge variant="outline" className="w-fit">
                <Crown className="h-3 w-3 mr-1" />
                {currentOrganization?.user_role?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>Manage all system users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="builder">Builder</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/avatars/${user.name.toLowerCase().replace(' ', '-')}.jpg`} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)} variant="outline">
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Building className="h-3 w-3 mr-1 text-muted-foreground" />
                      {user.company || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>{user.projects_assigned}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatLastLogin(user.last_login)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      {user.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                          onClick={() => handleStatusChange(user.id, 'active')}
                        >
                          <UserCheck className="h-3 w-3" />
                        </Button>
                      )}
                      {user.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                          onClick={() => handleStatusChange(user.id, 'inactive')}
                        >
                          <UserX className="h-3 w-3" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}