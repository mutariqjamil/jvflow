import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Building2, 
  Users, 
  CreditCard, 
  Check, 
  ArrowRight, 
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react'

interface OrganizationSetupProps {
  onComplete: () => void
}

export function OrganizationSetup({ onComplete }: OrganizationSetupProps) {
  const { createOrganization, currentOrganization, trialDaysRemaining, isDemoMode } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [organizationData, setOrganizationData] = useState({
    name: '',
    description: '',
    industry: 'real_estate'
  })

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    location: '',
    budget: '',
    payment_plan: 'monthly'
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
    if (!organizationData.name) {
      setError('Organization name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createOrganization(organizationData)
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteSetup = () => {
    // In a real implementation, you might create the first project here
    onComplete()
  }

  if (currentOrganization && step === 1) {
    setStep(3) // Skip to completion if organization already exists
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Create Your Organization</CardTitle>
                  <CardDescription>
                    Set up your real estate organization to get started
                  </CardDescription>
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
            </CardHeader>
            <CardContent className="space-y-4">
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

              <Button 
                onClick={handleCreateOrganization}
                className="w-full"
                disabled={loading || !organizationData.name}
              >
                {loading ? 'Creating Organization...' : 'Create Organization'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  You'll be the organization owner and can invite team members later
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle>Organization Created!</CardTitle>
                  <CardDescription>
                    Welcome to your JV-Flow workspace
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{currentOrganization?.name}</p>
                      <p className="text-sm text-green-700">Organization Owner</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Active
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Trial Status</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      <Clock className="w-3 h-3 mr-1" />
                      {trialDaysRemaining} days remaining
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Trial Progress</span>
                      <span>{Math.max(0, 31 - trialDaysRemaining)}/31 days</span>
                    </div>
                    <Progress 
                      value={Math.min(100, ((31 - trialDaysRemaining) / 31) * 100)} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">What's Next?</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Set up your first project</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Invite team members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Configure project settings</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCompleteSetup}
                className="w-full"
              >
                Continue to Dashboard
                <Zap className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  You can always change these settings later in your organization preferences
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle>Welcome to JV-Flow!</CardTitle>
              <CardDescription>
                Your organization is ready to go
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">🎉 Trial Benefits Active</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Full access to all features</li>
                    <li>• Unlimited projects and users</li>
                    <li>• {trialDaysRemaining} days remaining</li>
                    <li>• No credit card required</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 text-gray-600 mb-2" />
                    <p className="font-medium">Team Ready</p>
                    <p className="text-xs text-muted-foreground">Invite members anytime</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Building2 className="w-6 h-6 text-gray-600 mb-2" />
                    <p className="font-medium">Projects</p>
                    <p className="text-xs text-muted-foreground">Create & manage</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCompleteSetup}
                className="w-full"
                size="lg"
              >
                Start Using JV-Flow
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-8 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          {renderStep()}
        </div>

        {/* Skip for demo mode */}
        {isDemoMode && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={onComplete}>
              Skip Setup (Demo Mode)
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}