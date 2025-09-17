import { useState } from 'react'
import { useAuth } from '../AuthProvider'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { Separator } from '../ui/separator'
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Users, 
  Building2, 
  AlertCircle,
  Send,
  Check,
  Shield,
  ArrowLeft,
  Info
} from 'lucide-react'
import { projectId, publicAnonKey } from '../../utils/supabase/info'

interface UserInvitationFormProps {
  onComplete?: () => void
  onCancel?: () => void
}

export function UserInvitationForm({ onComplete, onCancel }: UserInvitationFormProps) {
  const { currentOrganization, isDemoMode } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [invitationType, setInvitationType] = useState<'email' | 'phone'>('email')

  const [invitationData, setInvitationData] = useState({
    email: '',
    phone: '',
    role: 'project_manager',
    permissions: [] as string[],
    project_ids: [] as string[]
  })

  const roles = [
    { 
      value: 'owner', 
      label: 'Owner', 
      description: 'Full access to all organization features',
      permissions: ['*'],
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    { 
      value: 'admin', 
      label: 'Administrator', 
      description: 'Manage users, projects, and most settings',
      permissions: ['users', 'projects', 'expenses', 'reports', 'settings'],
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    { 
      value: 'billing_manager', 
      label: 'Billing Manager', 
      description: 'Manage expenses, invoices, and financial data',
      permissions: ['expenses', 'invoices', 'statements', 'reports'],
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    { 
      value: 'marketing_manager', 
      label: 'Marketing Manager', 
      description: 'Manage sales, bookings, and marketing campaigns',
      permissions: ['bookings', 'sales', 'marketing', 'commissions', 'customers'],
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    { 
      value: 'accounts_manager', 
      label: 'Accounts Manager', 
      description: 'Review and approve expenses and statements',
      permissions: ['expenses', 'statements', 'reports'],
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    { 
      value: 'project_manager', 
      label: 'Project Manager', 
      description: 'Manage specific projects and their resources',
      permissions: ['projects', 'expenses', 'employees', 'inventory'],
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    { 
      value: 'investor', 
      label: 'Investor', 
      description: 'View financial reports and approve major expenses',
      permissions: ['reports', 'expenses:view', 'statements'],
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    { 
      value: 'builder', 
      label: 'Builder/Contractor', 
      description: 'Manage construction activities and workforce',
      permissions: ['projects', 'expenses', 'employees', 'inventory'],
      color: 'bg-orange-100 text-orange-800 border-orange-200'
    },
    { 
      value: 'marketing', 
      label: 'Marketing Team', 
      description: 'Handle sales activities and customer relations',
      permissions: ['bookings', 'sales', 'marketing', 'customers'],
      color: 'bg-pink-100 text-pink-800 border-pink-200'
    }
  ]

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = isDemoMode ? 'demo-token' : publicAnonKey
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-df4644bf${endpoint}`,
      {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Request failed')
    }

    return response.json()
  }

  const handleSendInvitation = async () => {
    if (invitationType === 'email' && !invitationData.email) {
      setError('Email address is required')
      return
    }

    if (invitationType === 'phone' && !invitationData.phone) {
      setError('Phone number is required')
      return
    }

    if (!invitationData.role) {
      setError('Please select a role')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSuccess(`Demo invitation sent to ${invitationType === 'email' ? invitationData.email : invitationData.phone}`)
      } else {
        const selectedRole = roles.find(r => r.value === invitationData.role)
        
        await apiCall('/invitations', {
          method: 'POST',
          body: JSON.stringify({
            organization_id: currentOrganization?.id,
            email: invitationType === 'email' ? invitationData.email : undefined,
            phone: invitationType === 'phone' ? invitationData.phone : undefined,
            role: invitationData.role,
            permissions: selectedRole?.permissions || [],
            project_ids: invitationData.project_ids
          })
        })

        setSuccess(`Invitation sent successfully to ${invitationType === 'email' ? invitationData.email : invitationData.phone}`)
      }

      // Reset form
      setInvitationData({
        email: '',
        phone: '',
        role: 'project_manager',
        permissions: [],
        project_ids: []
      })

      setTimeout(() => {
        onComplete?.()
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  const selectedRole = roles.find(r => r.value === invitationData.role)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <UserPlus className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Invite Team Member</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Send an invitation to join your organization and collaborate on projects
        </p>
      </div>

      {/* Organization Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Inviting to: {currentOrganization?.name}</p>
              <p className="text-sm text-blue-800">New members will have access based on their assigned role</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Invitation Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Contact Information</span>
              </CardTitle>
              <CardDescription>How should we send the invitation?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Invitation Type Selector */}
              <div className="space-y-3">
                <Label>Invitation Method</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={invitationType === 'email' ? 'default' : 'outline'}
                    onClick={() => setInvitationType('email')}
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={invitationType === 'phone' ? 'default' : 'outline'}
                    onClick={() => setInvitationType('phone')}
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </Button>
                </div>
              </div>

              {/* Contact Input */}
              {invitationType === 'email' ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={invitationData.email}
                    onChange={(e) => setInvitationData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={invitationData.phone}
                    onChange={(e) => setInvitationData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Role Assignment</span>
              </CardTitle>
              <CardDescription>What role should this team member have?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={invitationData.role}
                  onValueChange={(value) => setInvitationData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.label}</span>
                          <span className="text-xs text-muted-foreground">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 mb-4">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-3">
                {onCancel && (
                  <Button variant="outline" onClick={onCancel} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
                <Button 
                  onClick={handleSendInvitation} 
                  disabled={loading || success !== ''}
                  className="flex-1"
                >
                  {loading ? (
                    'Sending...'
                  ) : success ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Sent
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Preview */}
        <div className="space-y-6">
          {selectedRole && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Role Preview</span>
                </CardTitle>
                <CardDescription>
                  What {selectedRole.label} can do in your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{selectedRole.label}</h3>
                  <Badge className={selectedRole.color}>
                    {selectedRole.permissions.includes('*') ? 'Full Access' : `${selectedRole.permissions.length} permissions`}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">Permissions Included:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.permissions.includes('*') ? (
                      <Badge variant="secondary" className="text-xs">
                        All Features & Permissions
                      </Badge>
                    ) : (
                      selectedRole.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace('_', ' ').replace(':', ' ')}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-900">
                <Info className="w-5 h-5" />
                <span>How Invitations Work</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-amber-800 space-y-2">
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Invitees receive a secure link to join your organization</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>They can create an account or sign in with existing credentials</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Invitations are valid for 7 days</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>You can manage invitations in User Management</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Secure & Encrypted</p>
                  <p className="text-sm text-blue-800">All invitations are sent through secure channels</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}