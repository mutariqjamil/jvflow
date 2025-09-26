import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { Progress } from '../ui/progress'
import { AlertCircle, Building2, MapPin, Users, DollarSign, Calendar, Upload, X, Plus, Trash2, Home, Car, Plane } from 'lucide-react'
import { Alert, AlertDescription } from '../ui/alert'
import { toast } from 'sonner@2.0.3'

interface Owner {
  id: string
  name: string
  email: string
  ownership_percentage: number
  role: 'primary_developer' | 'investor' | 'land_partner' | 'financial_partner'
  investment_amount: number
}

interface UnitType {
  id: string
  name: string
  type: 'flat' | 'bungalow' | 'parking' | 'commercial' | 'amenity'
  total_units: number
  area_sqft: number
  rooms?: number
  bathrooms?: number
  servant_room: boolean
  balcony: boolean
  parking_slots?: number
  amenities: string[]
  floor_range?: { min: number; max: number }
  basic_rate_per_sqft: number
  pre_launch_rate_per_sqft: number
  booking_rate_per_sqft: number
  discount_levels: {
    level: string
    max_discount_percent: number
    applicable_roles: string[]
  }[]
}

interface InstallmentPlan {
  id: string
  name: string
  down_payment_percent: number
  total_installments: number
  installment_frequency: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly'
  construction_linked: boolean
  terms: {
    milestone: string
    percentage: number
    due_months: number
  }[]
  booking_amount_percent: number
  registration_amount_percent: number
  possession_amount_percent: number
}

interface ProjectData {
  // Basic Information
  project_name: string
  project_type: string
  project_description: string
  project_status: string
  
  // Location & Property Details
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  total_area: number
  covered_area: number
  open_area: number
  floors: number
  total_units: number
  
  // Financial Information
  project_budget: number
  land_cost: number
  construction_cost: number
  marketing_cost: number
  expected_revenue: number
  
  // Timeline
  start_date: string
  expected_completion: string
  
  // Geofencing (coordinates for property boundaries)
  geo_coordinates: Array<{ lat: number; lng: number }>
  
  // Ownership Structure
  owners: Owner[]
  
  // Unit Configuration
  unit_types: UnitType[]
  
  // Installment Plans
  installment_plans: InstallmentPlan[]
  
  // General Terms
  booking_terms: string
  cancellation_policy: string
  possession_terms: string
  
  // Amenities & Features
  project_amenities: string[]
  
  // Documents and Legal
  documents: string[]
  legal_clearances: boolean
  environmental_clearances: boolean
  construction_permits: boolean
}

export function ProjectSetupDashboard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [projectData, setProjectData] = useState<ProjectData>({
    project_name: '',
    project_type: '',
    project_description: '',
    project_status: 'planning',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Pakistan',
    total_area: 0,
    covered_area: 0,
    open_area: 0,
    floors: 0,
    total_units: 0,
    project_budget: 0,
    land_cost: 0,
    construction_cost: 0,
    marketing_cost: 0,
    expected_revenue: 0,
    start_date: '',
    expected_completion: '',
    geo_coordinates: [],
    owners: [{
      id: '1',
      name: '',
      email: '',
      ownership_percentage: 100,
      role: 'primary_developer',
      investment_amount: 0
    }],
    unit_types: [],
    installment_plans: [{
      id: '1',
      name: 'Standard Plan',
      down_payment_percent: 20,
      total_installments: 24,
      installment_frequency: 'monthly',
      construction_linked: true,
      booking_amount_percent: 10,
      registration_amount_percent: 5,
      possession_amount_percent: 5,
      terms: [
        { milestone: 'Booking', percentage: 10, due_months: 0 },
        { milestone: 'Registration', percentage: 5, due_months: 1 },
        { milestone: 'Foundation', percentage: 15, due_months: 6 },
        { milestone: 'Structure Complete', percentage: 25, due_months: 12 },
        { milestone: 'Possession', percentage: 45, due_months: 24 }
      ]
    }],
    booking_terms: '',
    cancellation_policy: '',
    possession_terms: '',
    project_amenities: [],
    documents: [],
    legal_clearances: false,
    environmental_clearances: false,
    construction_permits: false
  })

  const steps = [
    { id: 0, title: 'Basic Information', icon: Building2 },
    { id: 1, title: 'Location & Property', icon: MapPin },
    { id: 2, title: 'Financial Planning', icon: DollarSign },
    { id: 3, title: 'Ownership Structure', icon: Users },
    { id: 4, title: 'Unit Configuration', icon: Home },
    { id: 5, title: 'Pricing & Rates', icon: DollarSign },
    { id: 6, title: 'Installment Plans', icon: Calendar },
    { id: 7, title: 'Terms & Documents', icon: Calendar },
  ]

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100
  }

  const addOwner = () => {
    const newOwner: Owner = {
      id: Date.now().toString(),
      name: '',
      email: '',
      ownership_percentage: 0,
      role: 'investor',
      investment_amount: 0
    }
    setProjectData(prev => ({
      ...prev,
      owners: [...prev.owners, newOwner]
    }))
  }

  const removeOwner = (id: string) => {
    setProjectData(prev => ({
      ...prev,
      owners: prev.owners.filter(owner => owner.id !== id)
    }))
  }

  const updateOwner = (id: string, field: keyof Owner, value: any) => {
    setProjectData(prev => ({
      ...prev,
      owners: prev.owners.map(owner => 
        owner.id === id ? { ...owner, [field]: value } : owner
      )
    }))
  }

  const addUnitType = () => {
    const newUnitType: UnitType = {
      id: Date.now().toString(),
      name: '',
      type: 'flat',
      total_units: 0,
      area_sqft: 0,
      rooms: 2,
      bathrooms: 2,
      servant_room: false,
      balcony: true,
      parking_slots: 1,
      amenities: [],
      basic_rate_per_sqft: 0,
      pre_launch_rate_per_sqft: 0,
      booking_rate_per_sqft: 0,
      discount_levels: [
        { level: 'Team Leader', max_discount_percent: 2, applicable_roles: ['marketing'] },
        { level: 'Manager', max_discount_percent: 5, applicable_roles: ['marketing'] },
        { level: 'Admin', max_discount_percent: 10, applicable_roles: ['admin'] }
      ]
    }
    setProjectData(prev => ({
      ...prev,
      unit_types: [...prev.unit_types, newUnitType]
    }))
  }

  const removeUnitType = (id: string) => {
    setProjectData(prev => ({
      ...prev,
      unit_types: prev.unit_types.filter(unit => unit.id !== id)
    }))
  }

  const updateUnitType = (id: string, field: keyof UnitType, value: any) => {
    setProjectData(prev => ({
      ...prev,
      unit_types: prev.unit_types.map(unit => 
        unit.id === id ? { ...unit, [field]: value } : unit
      )
    }))
  }

  const addInstallmentPlan = () => {
    const newPlan: InstallmentPlan = {
      id: Date.now().toString(),
      name: '',
      down_payment_percent: 20,
      total_installments: 12,
      installment_frequency: 'monthly',
      construction_linked: false,
      booking_amount_percent: 10,
      registration_amount_percent: 5,
      possession_amount_percent: 5,
      terms: [
        { milestone: 'Booking', percentage: 10, due_months: 0 },
        { milestone: 'Registration', percentage: 10, due_months: 1 },
        { milestone: 'Possession', percentage: 80, due_months: 12 }
      ]
    }
    setProjectData(prev => ({
      ...prev,
      installment_plans: [...prev.installment_plans, newPlan]
    }))
  }

  const removeInstallmentPlan = (id: string) => {
    setProjectData(prev => ({
      ...prev,
      installment_plans: prev.installment_plans.filter(plan => plan.id !== id)
    }))
  }

  const updateInstallmentPlan = (id: string, field: keyof InstallmentPlan, value: any) => {
    setProjectData(prev => ({
      ...prev,
      installment_plans: prev.installment_plans.map(plan => 
        plan.id === id ? { ...plan, [field]: value } : plan
      )
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Validate ownership percentages
      const totalOwnership = projectData.owners.reduce((sum, owner) => sum + owner.ownership_percentage, 0)
      if (Math.abs(totalOwnership - 100) > 0.01) {
        toast.error("Validation Error", {
          description: "Total ownership percentage must equal 100%"
        })
        setIsSubmitting(false)
        return
      }

      // Here you would typically save to Supabase
      console.log('Project Data:', projectData)
      
      toast.success("Project Created Successfully!", {
        description: "Your project setup has been saved and is ready for use."
      })

      // Reset form or redirect
      setTimeout(() => {
        setIsSubmitting(false)
        // You might want to redirect or reset the form here
      }, 2000)
      
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error("Error", {
        description: "Failed to create project. Please try again."
      })
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name *</Label>
                <Input
                  id="project_name"
                  placeholder="e.g., Sunset Gardens Phase 1"
                  value={projectData.project_name}
                  onChange={(e) => setProjectData(prev => ({ ...prev, project_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type *</Label>
                <Select value={projectData.project_type} onValueChange={(value) => setProjectData(prev => ({ ...prev, project_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="mixed_use">Mixed Use</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project_description">Project Description</Label>
              <Textarea
                id="project_description"
                placeholder="Provide a detailed description of the project..."
                className="min-h-[100px]"
                value={projectData.project_description}
                onChange={(e) => setProjectData(prev => ({ ...prev, project_description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_status">Current Status</Label>
              <Select value={projectData.project_status} onValueChange={(value) => setProjectData(prev => ({ ...prev, project_status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning Phase</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="construction">Under Construction</SelectItem>
                  <SelectItem value="marketing">Marketing Phase</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Project Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Swimming Pool', 'Gym', 'Clubhouse', 'Children Play Area', 'Garden', 'Security', 'Parking', 'Elevator', 'Power Backup', 'Water Supply', 'Masjid', 'Community Hall'].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={projectData.project_amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setProjectData(prev => ({
                            ...prev,
                            project_amenities: [...prev.project_amenities, amenity]
                          }))
                        } else {
                          setProjectData(prev => ({
                            ...prev,
                            project_amenities: prev.project_amenities.filter(a => a !== amenity)
                          }))
                        }
                      }}
                    />
                    <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 1: // Location & Property
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Property Address *</Label>
                <Input
                  id="address"
                  placeholder="Street address, area, landmark"
                  value={projectData.address}
                  onChange={(e) => setProjectData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={projectData.city}
                  onChange={(e) => setProjectData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={projectData.state}
                  onChange={(e) => setProjectData(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={projectData.postal_code}
                  onChange={(e) => setProjectData(prev => ({ ...prev, postal_code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={projectData.country} onValueChange={(value) => setProjectData(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="total_area">Total Area (sq ft) *</Label>
                <Input
                  id="total_area"
                  type="number"
                  value={projectData.total_area || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, total_area: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="covered_area">Covered Area (sq ft)</Label>
                <Input
                  id="covered_area"
                  type="number"
                  value={projectData.covered_area || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, covered_area: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="open_area">Open Area (sq ft)</Label>
                <Input
                  id="open_area"
                  type="number"
                  value={projectData.open_area || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, open_area: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="floors">Number of Floors</Label>
                <Input
                  id="floors"
                  type="number"
                  value={projectData.floors || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, floors: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_units">Total Units/Plots</Label>
                <Input
                  id="total_units"
                  type="number"
                  value={projectData.total_units || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, total_units: Number(e.target.value) }))}
                />
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Geo-fencing coordinates can be set up later through the mapping interface. This will help define the exact property boundaries for location tracking.
              </AlertDescription>
            </Alert>
          </div>
        )

      case 2: // Financial Planning
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project_budget">Total Project Budget (₨) *</Label>
                <Input
                  id="project_budget"
                  type="number"
                  placeholder="10000000"
                  value={projectData.project_budget || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, project_budget: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_revenue">Expected Revenue (₨)</Label>
                <Input
                  id="expected_revenue"
                  type="number"
                  value={projectData.expected_revenue || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, expected_revenue: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="land_cost">Land Acquisition Cost (₨)</Label>
                <Input
                  id="land_cost"
                  type="number"
                  value={projectData.land_cost || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, land_cost: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="construction_cost">Construction Cost (₨)</Label>
                <Input
                  id="construction_cost"
                  type="number"
                  value={projectData.construction_cost || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, construction_cost: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketing_cost">Marketing & Sales Cost (₨)</Label>
                <Input
                  id="marketing_cost"
                  type="number"
                  value={projectData.marketing_cost || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, marketing_cost: Number(e.target.value) }))}
                />
              </div>
            </div>

            {(projectData.land_cost > 0 || projectData.construction_cost > 0 || projectData.marketing_cost > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectData.land_cost > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Land Acquisition</span>
                        <Badge variant="secondary">
                          ₨{projectData.land_cost.toLocaleString()}
                        </Badge>
                      </div>
                    )}
                    {projectData.construction_cost > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Construction</span>
                        <Badge variant="secondary">
                          ₨{projectData.construction_cost.toLocaleString()}
                        </Badge>
                      </div>
                    )}
                    {projectData.marketing_cost > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Marketing & Sales</span>
                        <Badge variant="secondary">
                          ₨{projectData.marketing_cost.toLocaleString()}
                        </Badge>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center font-medium">
                        <span>Total Allocated</span>
                        <Badge>
                          ₨{(projectData.land_cost + projectData.construction_cost + projectData.marketing_cost).toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 3: // Ownership Structure
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Project Ownership Structure</h3>
                <p className="text-sm text-muted-foreground">
                  Define all stakeholders and their ownership percentages
                </p>
              </div>
              <Button onClick={addOwner} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Owner
              </Button>
            </div>

            <div className="space-y-4">
              {projectData.owners.map((owner, index) => (
                <Card key={owner.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Owner {index + 1}</Badge>
                        <Select
                          value={owner.role}
                          onValueChange={(value: any) => updateOwner(owner.id, 'role', value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary_developer">Primary Developer</SelectItem>
                            <SelectItem value="investor">Investor</SelectItem>
                            <SelectItem value="land_partner">Land Partner</SelectItem>
                            <SelectItem value="financial_partner">Financial Partner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {projectData.owners.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOwner(owner.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                          placeholder="Full name"
                          value={owner.name}
                          onChange={(e) => updateOwner(owner.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          placeholder="email@domain.com"
                          value={owner.email}
                          onChange={(e) => updateOwner(owner.id, 'email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ownership %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={owner.ownership_percentage || ''}
                          onChange={(e) => updateOwner(owner.id, 'ownership_percentage', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Investment Amount (₨)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={owner.investment_amount || ''}
                          onChange={(e) => updateOwner(owner.id, 'investment_amount', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Ownership Percentage</span>
                  <Badge className={
                    Math.abs(projectData.owners.reduce((sum, owner) => sum + owner.ownership_percentage, 0) - 100) < 0.01
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }>
                    {projectData.owners.reduce((sum, owner) => sum + owner.ownership_percentage, 0).toFixed(2)}%
                  </Badge>
                </div>
                {Math.abs(projectData.owners.reduce((sum, owner) => sum + owner.ownership_percentage, 0) - 100) > 0.01 && (
                  <p className="text-sm text-red-600 mt-2">
                    Total ownership must equal 100%
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 4: // Unit Configuration
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Unit Types & Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Define different types of units in your project
                </p>
              </div>
              <Button onClick={addUnitType} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Unit Type
              </Button>
            </div>

            <div className="space-y-4">
              {projectData.unit_types.map((unit, index) => (
                <Card key={unit.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Unit Type {index + 1}</Badge>
                        <Select
                          value={unit.type}
                          onValueChange={(value: any) => updateUnitType(unit.id, 'type', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flat">Flat</SelectItem>
                            <SelectItem value="bungalow">Bungalow</SelectItem>
                            <SelectItem value="parking">Parking</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="amenity">Amenity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUnitType(unit.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Unit Name *</Label>
                        <Input
                          placeholder="e.g., 2BHK Premium"
                          value={unit.name}
                          onChange={(e) => updateUnitType(unit.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Units</Label>
                        <Input
                          type="number"
                          value={unit.total_units || ''}
                          onChange={(e) => updateUnitType(unit.id, 'total_units', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Area (sq ft)</Label>
                        <Input
                          type="number"
                          value={unit.area_sqft || ''}
                          onChange={(e) => updateUnitType(unit.id, 'area_sqft', Number(e.target.value))}
                        />
                      </div>

                      {(unit.type === 'flat' || unit.type === 'bungalow') && (
                        <>
                          <div className="space-y-2">
                            <Label>Bedrooms</Label>
                            <Input
                              type="number"
                              value={unit.rooms || ''}
                              onChange={(e) => updateUnitType(unit.id, 'rooms', Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Bathrooms</Label>
                            <Input
                              type="number"
                              value={unit.bathrooms || ''}
                              onChange={(e) => updateUnitType(unit.id, 'bathrooms', Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Parking Slots</Label>
                            <Input
                              type="number"
                              value={unit.parking_slots || ''}
                              onChange={(e) => updateUnitType(unit.id, 'parking_slots', Number(e.target.value))}
                            />
                          </div>
                        </>
                      )}

                      {unit.type === 'flat' && (
                        <div className="space-y-2">
                          <Label>Floor Range</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={unit.floor_range?.min || ''}
                              onChange={(e) => updateUnitType(unit.id, 'floor_range', {
                                ...unit.floor_range,
                                min: Number(e.target.value)
                              })}
                            />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={unit.floor_range?.max || ''}
                              onChange={(e) => updateUnitType(unit.id, 'floor_range', {
                                ...unit.floor_range,
                                max: Number(e.target.value)
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {(unit.type === 'flat' || unit.type === 'bungalow') && (
                      <div className="mt-4 space-y-3">
                        <Label>Features</Label>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={unit.servant_room}
                              onCheckedChange={(checked) => updateUnitType(unit.id, 'servant_room', checked)}
                            />
                            <Label className="text-sm">Servant Room</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={unit.balcony}
                              onCheckedChange={(checked) => updateUnitType(unit.id, 'balcony', checked)}
                            />
                            <Label className="text-sm">Balcony</Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {projectData.unit_types.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Add unit types to define the different types of properties available in your project.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 5: // Pricing & Rates
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Pricing Structure</h3>
              <p className="text-sm text-muted-foreground">
                Set pricing for each unit type and configure discount levels
              </p>
            </div>

            <div className="space-y-6">
              {projectData.unit_types.map((unit, index) => (
                <Card key={unit.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Home className="h-5 w-5" />
                      <span>{unit.name || `Unit Type ${index + 1}`}</span>
                      <Badge variant="secondary">{unit.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label>Basic Rate (₨/sq ft)</Label>
                        <Input
                          type="number"
                          value={unit.basic_rate_per_sqft || ''}
                          onChange={(e) => updateUnitType(unit.id, 'basic_rate_per_sqft', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pre-Launch Rate (₨/sq ft)</Label>
                        <Input
                          type="number"
                          value={unit.pre_launch_rate_per_sqft || ''}
                          onChange={(e) => updateUnitType(unit.id, 'pre_launch_rate_per_sqft', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Booking Rate (₨/sq ft)</Label>
                        <Input
                          type="number"
                          value={unit.booking_rate_per_sqft || ''}
                          onChange={(e) => updateUnitType(unit.id, 'booking_rate_per_sqft', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    {unit.area_sqft > 0 && unit.basic_rate_per_sqft > 0 && (
                      <div className="mb-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Price Calculation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Basic Price:</span>
                            <p className="font-medium">₨{(unit.area_sqft * unit.basic_rate_per_sqft).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Pre-Launch Price:</span>
                            <p className="font-medium">₨{(unit.area_sqft * unit.pre_launch_rate_per_sqft).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Booking Price:</span>
                            <p className="font-medium">₨{(unit.area_sqft * unit.booking_rate_per_sqft).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label>Discount Levels</Label>
                      {unit.discount_levels.map((level, levelIndex) => (
                        <div key={levelIndex} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <Badge variant="outline">{level.level}</Badge>
                          <span className="text-sm">Max Discount: {level.max_discount_percent}%</span>
                          <Badge variant="secondary" className="text-xs">
                            {level.applicable_roles.join(', ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {projectData.unit_types.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please add unit types in the previous step before configuring pricing.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 6: // Installment Plans
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Installment Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Configure flexible payment plans for customers
                </p>
              </div>
              <Button onClick={addInstallmentPlan} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </div>

            <div className="space-y-4">
              {projectData.installment_plans.map((plan, index) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>{plan.name || `Plan ${index + 1}`}</span>
                      </CardTitle>
                      {projectData.installment_plans.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInstallmentPlan(plan.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label>Plan Name *</Label>
                        <Input
                          placeholder="e.g., Standard Payment Plan"
                          value={plan.name}
                          onChange={(e) => updateInstallmentPlan(plan.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Down Payment %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={plan.down_payment_percent || ''}
                          onChange={(e) => updateInstallmentPlan(plan.id, 'down_payment_percent', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Installments</Label>
                        <Input
                          type="number"
                          value={plan.total_installments || ''}
                          onChange={(e) => updateInstallmentPlan(plan.id, 'total_installments', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select 
                          value={plan.installment_frequency} 
                          onValueChange={(value: any) => updateInstallmentPlan(plan.id, 'installment_frequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="half_yearly">Half Yearly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Booking Amount %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={plan.booking_amount_percent || ''}
                          onChange={(e) => updateInstallmentPlan(plan.id, 'booking_amount_percent', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Registration %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={plan.registration_amount_percent || ''}
                          onChange={(e) => updateInstallmentPlan(plan.id, 'registration_amount_percent', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        checked={plan.construction_linked}
                        onCheckedChange={(checked) => updateInstallmentPlan(plan.id, 'construction_linked', checked)}
                      />
                      <Label>Construction Linked Payment Plan</Label>
                    </div>

                    <div className="space-y-3">
                      <Label>Payment Milestones</Label>
                      {plan.terms.map((term, termIndex) => (
                        <div key={termIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg">
                          <div className="space-y-1">
                            <Label className="text-xs">Milestone</Label>
                            <Input
                              placeholder="e.g., Foundation"
                              value={term.milestone}
                              onChange={(e) => {
                                const newTerms = [...plan.terms]
                                newTerms[termIndex] = { ...term, milestone: e.target.value }
                                updateInstallmentPlan(plan.id, 'terms', newTerms)
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Percentage %</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={term.percentage || ''}
                              onChange={(e) => {
                                const newTerms = [...plan.terms]
                                newTerms[termIndex] = { ...term, percentage: Number(e.target.value) }
                                updateInstallmentPlan(plan.id, 'terms', newTerms)
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Due Months</Label>
                            <Input
                              type="number"
                              min="0"
                              value={term.due_months || ''}
                              onChange={(e) => {
                                const newTerms = [...plan.terms]
                                newTerms[termIndex] = { ...term, due_months: Number(e.target.value) }
                                updateInstallmentPlan(plan.id, 'terms', newTerms)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-medium">Total Percentage:</span>
                        <Badge className={
                          plan.terms.reduce((sum, term) => sum + term.percentage, 0) === 100
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }>
                          {plan.terms.reduce((sum, term) => sum + term.percentage, 0)}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 7: // Terms & Documents
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start_date">Project Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={projectData.start_date}
                  onChange={(e) => setProjectData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_completion">Expected Completion</Label>
                <Input
                  id="expected_completion"
                  type="date"
                  value={projectData.expected_completion}
                  onChange={(e) => setProjectData(prev => ({ ...prev, expected_completion: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="booking_terms">Booking Terms & Conditions</Label>
                <Textarea
                  id="booking_terms"
                  placeholder="Enter general booking terms..."
                  className="min-h-[100px]"
                  value={projectData.booking_terms}
                  onChange={(e) => setProjectData(prev => ({ ...prev, booking_terms: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                <Textarea
                  id="cancellation_policy"
                  placeholder="Enter cancellation policy..."
                  className="min-h-[80px]"
                  value={projectData.cancellation_policy}
                  onChange={(e) => setProjectData(prev => ({ ...prev, cancellation_policy: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="possession_terms">Possession Terms</Label>
                <Textarea
                  id="possession_terms"
                  placeholder="Enter possession terms..."
                  className="min-h-[80px]"
                  value={projectData.possession_terms}
                  onChange={(e) => setProjectData(prev => ({ ...prev, possession_terms: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Legal Clearances & Permits</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="legal_clearances"
                    checked={projectData.legal_clearances}
                    onCheckedChange={(checked) => 
                      setProjectData(prev => ({ ...prev, legal_clearances: checked as boolean }))
                    }
                  />
                  <Label htmlFor="legal_clearances">Legal clearances obtained</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="environmental_clearances"
                    checked={projectData.environmental_clearances}
                    onCheckedChange={(checked) => 
                      setProjectData(prev => ({ ...prev, environmental_clearances: checked as boolean }))
                    }
                  />
                  <Label htmlFor="environmental_clearances">Environmental clearances obtained</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="construction_permits"
                    checked={projectData.construction_permits}
                    onCheckedChange={(checked) => 
                      setProjectData(prev => ({ ...prev, construction_permits: checked as boolean }))
                    }
                  />
                  <Label htmlFor="construction_permits">Construction permits obtained</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Project Documents</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files).map(file => file.name)
                      setProjectData(prev => ({
                        ...prev,
                        documents: [...prev.documents, ...newFiles]
                      }))
                    }
                  }}
                />
              </div>
              
              {projectData.documents.length > 0 && (
                <div className="space-y-2">
                  {projectData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span className="text-sm">{doc}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setProjectData(prev => ({
                            ...prev,
                            documents: prev.documents.filter((_, i) => i !== index)
                          }))
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Review all information carefully before submitting. Once created, some project details may require admin approval to modify.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Setup</h1>
          <p className="text-muted-foreground">
            Create and configure a new real estate project
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          Step {currentStep + 1} of {steps.length}
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Setup Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(calculateProgress())}% Complete
            </span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
          <div className="flex justify-between mt-4 space-x-2 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center space-y-2 cursor-pointer transition-colors min-w-0 ${
                    index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-muted-foreground/30'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-center max-w-20">{step.title}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {steps[currentStep] && (
              <>
                {(() => {
                  const Icon = steps[currentStep].icon
                  return <Icon className="h-5 w-5" />
                })()}
                <span>{steps[currentStep].title}</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button onClick={() => setCurrentStep(prev => prev + 1)}>
            Next Step
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Creating Project...' : 'Create Project'}
          </Button>
        )}
      </div>
    </div>
  )
}