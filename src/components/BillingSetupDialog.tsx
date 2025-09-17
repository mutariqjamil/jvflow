import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  Check, 
  AlertCircle,
  Clock,
  Zap,
  Building2
} from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface BillingSetupDialogProps {
  trigger?: React.ReactNode
  onBillingSetup?: () => void
}

export function BillingSetupDialog({ trigger, onBillingSetup }: BillingSetupDialogProps) {
  const { currentOrganization, trialDaysRemaining, isDemoMode } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [step, setStep] = useState(1)

  const [billingData, setBillingData] = useState({
    payment_method: 'google_pay',
    plan_type: 'monthly',
    billing_details: {
      company_name: currentOrganization?.name || '',
      contact_email: '',
      phone: '',
      address: '',
      tax_id: ''
    }
  })

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '$49',
      period: 'per month',
      description: 'Perfect for small to medium projects',
      features: [
        'Up to 5 projects',
        'Unlimited users',
        'All core features',
        'Email support',
        'Monthly billing'
      ]
    },
    {
      id: 'yearly',
      name: 'Annual Plan',
      price: '$499',
      period: 'per year',
      description: 'Best value for established organizations',
      savings: 'Save $89/year',
      features: [
        'Unlimited projects',
        'Unlimited users',
        'All premium features',
        'Priority support',
        'Annual billing',
        'Advanced analytics'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations with complex needs',
      features: [
        'Unlimited everything',
        'Dedicated account manager',
        'Custom integrations',
        'On-premise deployment',
        'SLA guarantees',
        'Training & onboarding'
      ]
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

  const handleSetupBilling = async () => {
    if (!billingData.billing_details.contact_email) {
      setError('Contact email is required')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isDemoMode) {
        // Simulate billing setup in demo mode
        await new Promise(resolve => setTimeout(resolve, 2000))
        setSuccess('Demo billing setup completed!')
      } else {
        await apiCall('/billing/setup', {
          method: 'POST',
          body: JSON.stringify({
            organization_id: currentOrganization?.id,
            payment_method: billingData.payment_method,
            billing_details: billingData.billing_details
          })
        })

        setSuccess('Billing setup completed successfully!')
      }

      onBillingSetup?.()
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false)
        setSuccess('')
        setStep(1)
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup billing')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Choose Your Plan</h3>
              <p className="text-sm text-muted-foreground">
                Select the plan that best fits your organization's needs
              </p>
            </div>

            <div className="space-y-3">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    billingData.plan_type === plan.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setBillingData(prev => ({ ...prev, plan_type: plan.id }))}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{plan.price}</div>
                        <div className="text-xs text-muted-foreground">{plan.period}</div>
                        {plan.savings && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {plan.savings}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="text-sm space-y-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-muted-foreground text-xs">
                          +{plan.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              Continue with {plans.find(p => p.id === billingData.plan_type)?.name}
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Payment Method</h3>
              <p className="text-sm text-muted-foreground">
                Choose how you'd like to pay for your subscription
              </p>
            </div>

            <div className="space-y-3">
              <Card 
                className={`cursor-pointer transition-all ${
                  billingData.payment_method === 'google_pay' 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setBillingData(prev => ({ ...prev, payment_method: 'google_pay' }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium">Google Pay</p>
                      <p className="text-sm text-muted-foreground">Quick and secure mobile payments</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">Recommended</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all opacity-50 ${
                  billingData.payment_method === 'card' 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'hover:border-primary/50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">Coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Billing Information</h3>
              <p className="text-sm text-muted-foreground">
                Provide your billing details for invoicing
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={billingData.billing_details.company_name}
                    onChange={(e) => setBillingData(prev => ({
                      ...prev,
                      billing_details: { ...prev.billing_details, company_name: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={billingData.billing_details.contact_email}
                    onChange={(e) => setBillingData(prev => ({
                      ...prev,
                      billing_details: { ...prev.billing_details, contact_email: e.target.value }
                    }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={billingData.billing_details.phone}
                  onChange={(e) => setBillingData(prev => ({
                    ...prev,
                    billing_details: { ...prev.billing_details, phone: e.target.value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={billingData.billing_details.address}
                  onChange={(e) => setBillingData(prev => ({
                    ...prev,
                    billing_details: { ...prev.billing_details, address: e.target.value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID (Optional)</Label>
                <Input
                  id="tax-id"
                  value={billingData.billing_details.tax_id}
                  onChange={(e) => setBillingData(prev => ({
                    ...prev,
                    billing_details: { ...prev.billing_details, tax_id: e.target.value }
                  }))}
                />
              </div>
            </div>

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

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSetupBilling} 
                disabled={loading || success !== ''}
                className="flex-1"
              >
                {loading ? (
                  'Setting up...'
                ) : success ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Setup Billing
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Setup Billing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Setup Billing</span>
          </DialogTitle>
          <DialogDescription>
            Setup your billing information to continue after your trial ends
          </DialogDescription>
        </DialogHeader>

        {/* Trial Status */}
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Trial Active</span>
            </div>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              {trialDaysRemaining} days left
            </Badge>
          </div>
          <p className="text-sm text-yellow-800 mt-1">
            Setup billing now to ensure uninterrupted service
          </p>
        </div>

        {renderStep()}

        {/* Security Note */}
        <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Shield className="w-3 h-3" />
            <span className="font-medium">Secure & Encrypted</span>
          </div>
          <p>Your payment information is protected with bank-level security and encryption.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}