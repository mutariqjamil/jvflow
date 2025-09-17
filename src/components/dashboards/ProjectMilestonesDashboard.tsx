import { useState } from 'react'
import { Plus, Search, MoreHorizontal, Calendar, Clock, CheckCircle, AlertTriangle, Target, TrendingUp, Package, Users, Edit, Trash2, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Progress } from '../ui/progress'
import { Alert, AlertDescription } from '../ui/alert'

interface Milestone {
  id: string
  name: string
  description: string
  project: string
  phase: string
  start_date: string
  end_date: string
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'on-hold'
  progress: number
  dependencies: string[]
  assigned_team: string[]
  budget_allocated: number
  budget_spent: number
  material_requirements: MaterialRequirement[]
  notes?: string
}

interface MaterialRequirement {
  id: string
  milestone_id: string
  material_name: string
  specification: string
  quantity_required: number
  unit: string
  estimated_cost: number
  required_date: string
  procurement_status: 'not-started' | 'requested' | 'ordered' | 'delivered' | 'consumed'
  supplier?: string
  notes?: string
}

const mockMilestones: Milestone[] = [
  {
    id: '1',
    name: 'Foundation Completion',
    description: 'Complete excavation, foundation laying, and basement structure',
    project: 'Metro Heights Tower A',
    phase: 'Foundation',
    start_date: '2024-11-01',
    end_date: '2024-12-15',
    status: 'completed',
    progress: 100,
    dependencies: [],
    assigned_team: ['Construction Team A', 'Foundation Specialists'],
    budget_allocated: 500000,
    budget_spent: 485000,
    material_requirements: [
      {
        id: '1',
        milestone_id: '1',
        material_name: 'Steel Rebar Grade 60',
        specification: '12mm diameter, 12m length',
        quantity_required: 50,
        unit: 'tons',
        estimated_cost: 42500,
        required_date: '2024-11-15',
        procurement_status: 'consumed',
        supplier: 'Superior Steel Works'
      },
      {
        id: '2',
        milestone_id: '1',
        material_name: 'Concrete Ready Mix',
        specification: 'M25 grade concrete',
        quantity_required: 800,
        unit: 'cubic meters',
        estimated_cost: 80000,
        required_date: '2024-11-20',
        procurement_status: 'consumed',
        supplier: 'Prime Concrete Solutions'
      }
    ]
  },
  {
    id: '2',
    name: 'Ground Floor Structure',
    description: 'Complete ground floor slab, columns, and beam structure',
    project: 'Metro Heights Tower A',
    phase: 'Structure',
    start_date: '2024-12-16',
    end_date: '2025-01-30',
    status: 'in-progress',
    progress: 35,
    dependencies: ['1'],
    assigned_team: ['Construction Team A', 'Structural Engineers'],
    budget_allocated: 350000,
    budget_spent: 125000,
    material_requirements: [
      {
        id: '3',
        milestone_id: '2',
        material_name: 'Structural Steel Beams',
        specification: 'H-beam 300x150x6.5x9',
        quantity_required: 25,
        unit: 'pieces',
        estimated_cost: 45000,
        required_date: '2024-12-20',
        procurement_status: 'delivered',
        supplier: 'Superior Steel Works'
      },
      {
        id: '4',
        milestone_id: '2',
        material_name: 'Shuttering Plywood',
        specification: '18mm marine grade',
        quantity_required: 200,
        unit: 'sheets',
        estimated_cost: 19000,
        required_date: '2024-12-25',
        procurement_status: 'ordered',
        supplier: 'Premium Timber Co'
      }
    ]
  },
  {
    id: '3',
    name: 'Electrical Infrastructure Phase 1',
    description: 'Install main electrical panels, conduits, and primary wiring',
    project: 'Metro Heights Tower A',
    phase: 'MEP',
    start_date: '2025-01-15',
    end_date: '2025-02-28',
    status: 'not-started',
    progress: 0,
    dependencies: ['2'],
    assigned_team: ['Electrical Team', 'MEP Coordinators'],
    budget_allocated: 280000,
    budget_spent: 0,
    material_requirements: [
      {
        id: '5',
        milestone_id: '3',
        material_name: 'Copper Wire 12 AWG',
        specification: 'THWN insulated, 600V rated',
        quantity_required: 2000,
        unit: 'meters',
        estimated_cost: 5700,
        required_date: '2025-01-10',
        procurement_status: 'requested',
        supplier: 'Elite Electrical Services'
      },
      {
        id: '6',
        milestone_id: '3',
        material_name: 'Electrical Panels',
        specification: '200A main breaker panel',
        quantity_required: 8,
        unit: 'pieces',
        estimated_cost: 3600,
        required_date: '2025-01-12',
        procurement_status: 'not-started'
      }
    ]
  },
  {
    id: '4',
    name: 'Exterior Finishing',
    description: 'Complete building facade, cladding, and external finishes',
    project: 'Garden View Residences',
    phase: 'Finishing',
    start_date: '2025-02-01',
    end_date: '2025-04-15',
    status: 'not-started',
    progress: 0,
    dependencies: [],
    assigned_team: ['Finishing Team', 'Facade Specialists'],
    budget_allocated: 180000,
    budget_spent: 0,
    material_requirements: [
      {
        id: '7',
        milestone_id: '4',
        material_name: 'Aluminum Cladding Panels',
        specification: '3mm thickness, powder coated',
        quantity_required: 500,
        unit: 'square meters',
        estimated_cost: 75000,
        required_date: '2025-01-25',
        procurement_status: 'not-started'
      }
    ]
  }
]

export function ProjectMilestonesDashboard() {
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones)
  const [searchTerm, setSearchTerm] = useState('')
  const [projectFilter, setProjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [isMilestoneFormOpen, setIsMilestoneFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('milestones')

  const filteredMilestones = milestones.filter(milestone => {
    const matchesSearch = milestone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.phase.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProject = projectFilter === 'all' || milestone.project === projectFilter
    const matchesStatus = statusFilter === 'all' || milestone.status === statusFilter
    return matchesSearch && matchesProject && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200'
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProcurementStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'requested': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ordered': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'consumed': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const projects = [...new Set(milestones.map(m => m.project))]

  const isOverdue = (milestone: Milestone) => {
    const today = new Date()
    const endDate = new Date(milestone.end_date)
    return milestone.status !== 'completed' && endDate < today
  }

  const getDaysRemaining = (milestone: Milestone) => {
    const today = new Date()
    const endDate = new Date(milestone.end_date)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const MilestoneForm = ({ milestone, onSave, onClose }: { milestone?: Milestone, onSave: (milestone: Milestone) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: milestone?.name || '',
      description: milestone?.description || '',
      project: milestone?.project || '',
      phase: milestone?.phase || '',
      start_date: milestone?.start_date || '',
      end_date: milestone?.end_date || '',
      budget_allocated: milestone?.budget_allocated || 0,
      assigned_team: milestone?.assigned_team || [],
      notes: milestone?.notes || ''
    })

    const [materials, setMaterials] = useState<MaterialRequirement[]>(milestone?.material_requirements || [])

    const addMaterial = () => {
      const newMaterial: MaterialRequirement = {
        id: Date.now().toString(),
        milestone_id: milestone?.id || '',
        material_name: '',
        specification: '',
        quantity_required: 0,
        unit: '',
        estimated_cost: 0,
        required_date: '',
        procurement_status: 'not-started'
      }
      setMaterials([...materials, newMaterial])
    }

    const updateMaterial = (index: number, field: keyof MaterialRequirement, value: any) => {
      const updatedMaterials = [...materials]
      updatedMaterials[index] = { ...updatedMaterials[index], [field]: value }
      setMaterials(updatedMaterials)
    }

    const removeMaterial = (index: number) => {
      setMaterials(materials.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newMilestone: Milestone = {
        id: milestone?.id || Date.now().toString(),
        ...formData,
        status: milestone?.status || 'not-started',
        progress: milestone?.progress || 0,
        dependencies: milestone?.dependencies || [],
        budget_spent: milestone?.budget_spent || 0,
        material_requirements: materials.map(m => ({ ...m, milestone_id: milestone?.id || Date.now().toString() }))
      }
      onSave(newMilestone)
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Milestone Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Milestone name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phase">Phase</Label>
            <Select value={formData.phase} onValueChange={(value) => setFormData({...formData, phase: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="Foundation">Foundation</SelectItem>
                <SelectItem value="Structure">Structure</SelectItem>
                <SelectItem value="MEP">MEP</SelectItem>
                <SelectItem value="Finishing">Finishing</SelectItem>
                <SelectItem value="Completion">Completion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Detailed description of the milestone"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select value={formData.project} onValueChange={(value) => setFormData({...formData, project: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Metro Heights Tower A">Metro Heights Tower A</SelectItem>
                <SelectItem value="Garden View Residences">Garden View Residences</SelectItem>
                <SelectItem value="Corporate Plaza">Corporate Plaza</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget_allocated">Budget Allocated</Label>
            <Input
              id="budget_allocated"
              type="number"
              value={formData.budget_allocated}
              onChange={(e) => setFormData({...formData, budget_allocated: parseFloat(e.target.value) || 0})}
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Material Requirements</h4>
            <Button type="button" size="sm" onClick={addMaterial}>
              <Plus className="mr-2 h-4 w-4" />
              Add Material
            </Button>
          </div>

          {materials.map((material, index) => (
            <div key={material.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Material {index + 1}</h5>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="destructive"
                  onClick={() => removeMaterial(index)}
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Material Name</Label>
                  <Input
                    value={material.material_name}
                    onChange={(e) => updateMaterial(index, 'material_name', e.target.value)}
                    placeholder="Material name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specification</Label>
                  <Input
                    value={material.specification}
                    onChange={(e) => updateMaterial(index, 'specification', e.target.value)}
                    placeholder="Technical specifications"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={material.quantity_required}
                    onChange={(e) => updateMaterial(index, 'quantity_required', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={material.unit} onValueChange={(value) => updateMaterial(index, 'unit', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pieces">Pieces</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="cubic meters">Cubic Meters</SelectItem>
                      <SelectItem value="square meters">Square Meters</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Est. Cost</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={material.estimated_cost}
                    onChange={(e) => updateMaterial(index, 'estimated_cost', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Required Date</Label>
                  <Input
                    type="date"
                    value={material.required_date}
                    onChange={(e) => updateMaterial(index, 'required_date', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Supplier (Optional)</Label>
                <Input
                  value={material.supplier || ''}
                  onChange={(e) => updateMaterial(index, 'supplier', e.target.value)}
                  placeholder="Supplier name"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Additional notes or requirements"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {milestone ? 'Update Milestone' : 'Create Milestone'}
          </Button>
        </div>
      </form>
    )
  }

  const overdueMilestones = milestones.filter(m => isOverdue(m))
  const upcomingMilestones = milestones.filter(m => {
    const daysRemaining = getDaysRemaining(m)
    return daysRemaining <= 7 && daysRemaining > 0 && m.status !== 'completed'
  })

  const allMaterialRequirements = milestones.flatMap(m => m.material_requirements)
  const pendingMaterials = allMaterialRequirements.filter(mr => mr.procurement_status === 'not-started' || mr.procurement_status === 'requested')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Project Milestones</h1>
          <p className="text-muted-foreground">
            Manage project timelines and material requirements planning
          </p>
        </div>
        <Dialog open={isMilestoneFormOpen} onOpenChange={setIsMilestoneFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Project Milestone</DialogTitle>
              <DialogDescription>
                Define milestone timeline and material requirements
              </DialogDescription>
            </DialogHeader>
            <MilestoneForm 
              onSave={(milestone) => {
                setMilestones([...milestones, milestone])
              }}
              onClose={() => setIsMilestoneFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts for overdue and upcoming milestones */}
      {(overdueMilestones.length > 0 || upcomingMilestones.length > 0) && (
        <div className="space-y-2">
          {overdueMilestones.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <span className="text-red-600 font-medium">
                  {overdueMilestones.length} milestones are overdue
                </span> and require immediate attention.
              </AlertDescription>
            </Alert>
          )}
          {upcomingMilestones.length > 0 && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <span className="text-yellow-600 font-medium">
                  {upcomingMilestones.length} milestones
                </span> are due within the next 7 days.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="materials">Material Requirements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
              <CardDescription>
                Track progress and manage project milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search milestones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project} value={project}>{project}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Milestone</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Materials</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMilestones.map((milestone) => {
                    const daysRemaining = getDaysRemaining(milestone)
                    const isDelayed = isOverdue(milestone)
                    
                    return (
                      <TableRow key={milestone.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{milestone.name}</div>
                            <div className="text-sm text-muted-foreground">{milestone.phase}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{milestone.project}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(milestone.start_date).toLocaleDateString()} - {new Date(milestone.end_date).toLocaleDateString()}</div>
                            <div className={`text-xs ${isDelayed ? 'text-red-600' : daysRemaining <= 7 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                              {isDelayed ? `${Math.abs(daysRemaining)} days overdue` : 
                               daysRemaining <= 0 ? 'Due today' :
                               `${daysRemaining} days remaining`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(milestone.status)} variant="outline">
                            {milestone.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-20">
                            <Progress value={milestone.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground mt-1">
                              {milestone.progress}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>${milestone.budget_spent.toLocaleString()} / ${milestone.budget_allocated.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {((milestone.budget_spent / milestone.budget_allocated) * 100).toFixed(1)}% used
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{milestone.material_requirements.length} items</div>
                            <div className="text-xs text-muted-foreground">
                              {milestone.material_requirements.filter(mr => mr.procurement_status === 'not-started').length} pending
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedMilestone(milestone)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Milestone
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Package className="mr-2 h-4 w-4" />
                                Manage Materials
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Milestones</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{milestones.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across all projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {milestones.filter(m => m.status === 'in-progress').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active milestones
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {overdueMilestones.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Need attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {milestones.filter(m => m.status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully finished
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Timeline Overview</CardTitle>
              <CardDescription>
                Visual timeline of project milestones and dependencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                Interactive timeline visualization would be displayed here,
                showing milestone dependencies, critical path, and progress tracking.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Requirements Planning</CardTitle>
              <CardDescription>
                Track material needs across all project milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Milestone</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead>Required Date</TableHead>
                    <TableHead>Procurement Status</TableHead>
                    <TableHead>Supplier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allMaterialRequirements.map((material) => {
                    const milestone = milestones.find(m => m.id === material.milestone_id)
                    return (
                      <TableRow key={material.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{material.material_name}</div>
                            <div className="text-xs text-muted-foreground">{material.specification}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{milestone?.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {material.quantity_required} {material.unit}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            ${material.estimated_cost.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(material.required_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getProcurementStatusColor(material.procurement_status)} variant="outline">
                            {material.procurement_status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{material.supplier || '-'}</div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Milestone Analytics</CardTitle>
              <CardDescription>
                Performance insights and milestone completion trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                Advanced analytics including milestone completion rates, 
                budget variance analysis, and resource optimization recommendations.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Milestone Details Dialog */}
      <Dialog open={!!selectedMilestone} onOpenChange={() => setSelectedMilestone(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Milestone Details</DialogTitle>
            <DialogDescription>
              Complete information about the project milestone
            </DialogDescription>
          </DialogHeader>
          {selectedMilestone && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedMilestone.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMilestone.project} - {selectedMilestone.phase}</p>
                </div>
                <Badge className={getStatusColor(selectedMilestone.status)} variant="outline">
                  {selectedMilestone.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Milestone Information</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Start Date:</dt>
                      <dd>{new Date(selectedMilestone.start_date).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">End Date:</dt>
                      <dd>{new Date(selectedMilestone.end_date).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Progress:</dt>
                      <dd>{selectedMilestone.progress}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Assigned Teams:</dt>
                      <dd>{selectedMilestone.assigned_team.join(', ')}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Budget Information</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Allocated:</dt>
                      <dd>${selectedMilestone.budget_allocated.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Spent:</dt>
                      <dd>${selectedMilestone.budget_spent.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Remaining:</dt>
                      <dd>${(selectedMilestone.budget_allocated - selectedMilestone.budget_spent).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedMilestone.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-3">Material Requirements</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Required Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedMilestone.material_requirements.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{material.material_name}</div>
                            <div className="text-xs text-muted-foreground">{material.specification}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {material.quantity_required} {material.unit}
                        </TableCell>
                        <TableCell className="text-sm">
                          ${material.estimated_cost.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(material.required_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getProcurementStatusColor(material.procurement_status)} variant="outline">
                            {material.procurement_status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedMilestone.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedMilestone.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}