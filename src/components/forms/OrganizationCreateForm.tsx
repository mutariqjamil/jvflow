import { useState } from 'react'
import { useAuth } from '../AuthProvider'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  Building2, 
  ArrowRight, 
  AlertCircle,
  Check,
  Clock
} from 'lucide-react'
import { Badge } from '../ui/badge'
import { toast } from 'sonner@2.0.3'

interface OrganizationCreateFormProps {
  isOpen: boolean
  onClose: () => void
}

export function OrganizationCreateForm({ isOpen, onClose }: OrganizationCreateFormProps) {
  const { createOrganization } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [organizationData, setOrganizationData] = useState({
    name: '',
    description: '',
    industry: 'real_estate'
  })

  const industries = [
    { value: 'real_estate', label: 'Real Estate Development' },
    { value: 'residential', label: 'Residential Construction' },
    { value: 'commercial', label: 'Commercial Development' },
    { value: 'infrastructure', label: 'Infrastructure Projects' },
    { value: 'renovation', label: 'Renovation & Remodeling' },
    { value: 'other', label: 'Other' }
  ]

  const handleCreateOrganization = async () => {
    if (!organizationData.name.trim()) {
      setError('Organization name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createOrganization(organizationData)
      toast.success("Organization created successfully!")
      onClose()
      // Reset form
      setOrganizationData({
        name: '',
        description: '',
        industry: 'real_estate'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>
                Set up a new organization for your real estate projects
              </DialogDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Clock className="w-3 h-3 mr-1" />
              31-Day Free Trial
            </Badge>
            <Badge variant="outline">
              No Credit Card Required
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name *</Label>
            <Input
              id="org-name"
              placeholder="e.g., Sunset Real Estate Co."
              value={organizationData.name}
              onChange={(e) => setOrganizationData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select 
              value={organizationData.industry} 
              onValueChange={(value) => setOrganizationData(prev => ({ ...prev, industry: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-description">Description (Optional)</Label>
            <Textarea
              id="org-description"
              placeholder="Brief description of your organization..."
              value={organizationData.description}
              onChange={(e) => setOrganizationData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrganization}
              disabled={loading || !organizationData.name.trim()}
            >
              {loading ? 'Creating Organization...' : 'Create Organization'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              You'll be the organization owner and can invite team members later
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}