import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Users, 
  Building2, 
  AlertCircle,
  Send,
  Check
} from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface UserInvitationDialogProps {
  trigger?: React.ReactNode
  onInvitationSent?: () => void
}

export function UserInvitationDialog({ trigger, onInvitationSent }: UserInvitationDialogProps) {
  const { currentOrganization, isDemoMode } = useAuth()
  const [open, setOpen] = useState(false)
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
      permissions: ['*']
    },
    { 
      value: 'admin', 
      label: 'Administrator', 
      description: 'Manage users, projects, and most settings',
      permissions: ['users', 'projects', 'expenses', 'reports', 'settings']
    },
    { 
      value: 'billing_manager', 
      label: 'Billing Manager', 
      description: 'Manage expenses, invoices, and financial data',
      permissions: ['expenses', 'invoices', 'statements', 'reports']
    },
    { 
      value: 'marketing_manager', 
      label: 'Marketing Manager', 
      description: 'Manage sales, bookings, and marketing campaigns',
      permissions: ['bookings', 'sales', 'marketing', 'commissions', 'customers']
    },
    { 
      value: 'accounts_manager', 
      label: 'Accounts Manager', 
      description: 'Review and approve expenses and statements',
      permissions: ['expenses', 'statements', 'reports']
    },
    { 
      value: 'project_manager', 
      label: 'Project Manager', 
      description: 'Manage specific projects and their resources',
      permissions: ['projects', 'expenses', 'employees', 'inventory']
    },
    { 
      value: 'investor', 
      label: 'Investor', 
      description: 'View financial reports and approve major expenses',
      permissions: ['reports', 'expenses:view', 'statements']
    },
    { 
      value: 'builder', 
      label: 'Builder/Contractor', 
      description: 'Manage construction activities and workforce',
      permissions: ['projects', 'expenses', 'employees', 'inventory']
    },
    { 
      value: 'marketing', 
      label: 'Marketing Team', 
      description: 'Handle sales activities and customer relations',
      permissions: ['bookings', 'sales', 'marketing', 'customers']
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
        // Simulate invitation in demo mode
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

      onInvitationSent?.()
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false)
        setSuccess('')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  const selectedRole = roles.find(r => r.value === invitationData.role)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Invite Team Member</span>
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Organization Info */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">{currentOrganization?.name}</span>
            </div>
          </div>

          {/* Invitation Type */}
          <div className="space-y-2">
            <Label>Invitation Method</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={invitationType === 'email' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInvitationType('email')}
              >
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
              <Button
                type="button"
                variant={invitationType === 'phone' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInvitationType('phone')}
              >
                <Phone className="w-4 h-4 mr-1" />
                Phone
              </Button>
            </div>
          </div>

          {/* Contact Information */}
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

          {/* Role Selection */}
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

          {/* Role Preview */}
          {selectedRole && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{selectedRole.label} Permissions</span>
                <Badge variant="outline" className="text-xs">
                  {selectedRole.permissions.includes('*') ? 'Full Access' : `${selectedRole.permissions.length} permissions`}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedRole.permissions.includes('*') ? (
                  <Badge variant="secondary" className="text-xs">
                    All Features
                  </Badge>
                ) : (
                  selectedRole.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
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

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">How invitations work:</p>
            <ul className="space-y-1">
              <li>• Invitees will receive a link to join your organization</li>
              <li>• They can create an account or sign in with existing credentials</li>
              <li>• Invitations expire after 7 days</li>
              <li>• You can resend or cancel invitations anytime</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}