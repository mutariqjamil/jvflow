import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { 
  Users, 
  UserPlus, 
  Mail,
  Calendar,
  Shield,
  Edit,
  Trash2
} from 'lucide-react'
import { useInternationalization } from '../providers/InternationalizationProvider'

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'admin',
    status: 'active',
    lastActive: '2025-01-15',
    joinDate: '2024-06-01'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    role: 'marketing',
    status: 'active',
    lastActive: '2025-01-14',
    joinDate: '2024-08-15'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'builder',
    status: 'active',
    lastActive: '2025-01-13',
    joinDate: '2024-09-01'
  }
]

const mockInvitations = [
  {
    id: '1',
    email: 'new.user@company.com',
    role: 'investor',
    status: 'pending',
    sentDate: '2025-01-10',
    sentBy: 'John Smith'
  },
  {
    id: '2',
    email: 'another@company.com',
    role: 'marketing',
    status: 'pending',
    sentDate: '2025-01-12',
    sentBy: 'John Smith'
  }
]

export function UserManagementDashboard() {
  const { t, formatCurrency } = useInternationalization()
  const [activeUsers] = useState(mockUsers.filter(user => user.status === 'active').length)
  const [pendingInvitations] = useState(mockInvitations.filter(inv => inv.status === 'pending').length)
  const [totalUsers] = useState(mockUsers.length)
  const [newThisMonth] = useState(2)

  const getStatusBadge = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'pending': 'bg-orange-100 text-orange-800'
    }
    return colors[status as keyof typeof colors] || colors.active
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      'admin': 'bg-purple-100 text-purple-800',
      'marketing': 'bg-blue-100 text-blue-800',
      'builder': 'bg-green-100 text-green-800',
      'investor': 'bg-orange-100 text-orange-800'
    }
    return colors[role as keyof typeof colors] || colors.admin
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('userManagement.title')}</h1>
          <p className="text-muted-foreground">
            {t('userManagement.description')}
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          {t('userManagement.inviteUser')}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('userManagement.activeUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-green-600">
              {t('userManagement.userGrowth', { percent: 12 })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('userManagement.pendingInvitations')}</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvitations}</div>
            <p className="text-xs text-orange-600">
              {t('userManagement.invitationsSent', { count: pendingInvitations })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('userManagement.totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {t('nav.userManagement')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('userManagement.newThisMonth')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newThisMonth}</div>
            <p className="text-xs text-green-600">
              {t('overview.thisMonth')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Users */}
      <Card>
        <CardHeader>
          <CardTitle>{t('userManagement.userDetails')}</CardTitle>
          <CardDescription>
            {t('userManagement.activeUsers')} - {activeUsers} {t('userManagement.totalUsers').toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('bookings.name')}</TableHead>
                <TableHead>{t('bookings.email')}</TableHead>
                <TableHead>{t('userManagement.role')}</TableHead>
                <TableHead>{t('bookings.status')}</TableHead>
                <TableHead>{t('userManagement.lastActive')}</TableHead>
                <TableHead>{t('userManagement.joinDate')}</TableHead>
                <TableHead>{t('bookings.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(user.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastActive}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.joinDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        {t('userManagement.editUser')}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3 mr-1" />
                        {t('userManagement.deleteUser')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('userManagement.pendingInvitations')}</CardTitle>
          <CardDescription>
            {t('userManagement.invitationsSent', { count: pendingInvitations })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('bookings.email')}</TableHead>
                <TableHead>{t('userManagement.role')}</TableHead>
                <TableHead>{t('userManagement.invitationStatus')}</TableHead>
                <TableHead>{t('userManagement.sentDate')}</TableHead>
                <TableHead>{t('bookings.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {invitation.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(invitation.role)}>
                      {invitation.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(invitation.status)}>
                      {invitation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {invitation.sentDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        {t('userManagement.resendInvitation')}
                      </Button>
                      <Button size="sm" variant="outline">
                        {t('userManagement.cancelInvitation')}
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