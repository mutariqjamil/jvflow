import { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, ShoppingCart, Clock, CheckCircle, XCircle, FileText, Edit, Eye, User, Calendar, DollarSign } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface ProcurementRequest {
  id: string
  request_number: string
  title: string
  description: string
  requested_by: string
  requested_by_name: string
  department: string
  project: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'completed'
  estimated_cost: number
  actual_cost?: number
  requested_date: string
  required_date: string
  approved_by?: string
  approved_date?: string
  items: ProcurementItem[]
}

interface ProcurementItem {
  id: string
  material_name: string
  specification: string
  quantity: number
  unit: string
  estimated_price: number
  preferred_vendor?: string
  notes?: string
}

const mockProcurementRequests: ProcurementRequest[] = [
  {
    id: '1',
    request_number: 'PR-2024-001',
    title: 'Steel Materials for Foundation Phase',
    description: 'Required steel reinforcement bars and structural steel for project foundation phase',
    requested_by: 'user1',
    requested_by_name: 'John Smith',
    department: 'Construction',
    project: 'Metro Heights Tower A',
    priority: 'high',
    status: 'approved',
    estimated_cost: 125000,
    actual_cost: 122500,
    requested_date: '2024-12-20',
    required_date: '2024-12-30',
    approved_by: 'manager1',
    approved_date: '2024-12-21',
    items: [
      {
        id: '1',
        material_name: 'Steel Rebar Grade 60',
        specification: '12mm diameter, 12m length',
        quantity: 50,
        unit: 'tons',
        estimated_price: 850,
        preferred_vendor: 'Superior Steel Works',
        notes: 'ASTM A615 certified'
      },
      {
        id: '2',
        material_name: 'Structural Steel Beams',
        specification: 'H-beam 300x150x6.5x9',
        quantity: 25,
        unit: 'pieces',
        estimated_price: 1800,
        preferred_vendor: 'Superior Steel Works'
      }
    ]
  },
  {
    id: '2',
    request_number: 'PR-2024-002',
    title: 'Electrical Components Phase 1',
    description: 'Electrical wiring, outlets, and panels for first floor installation',
    requested_by: 'user2',
    requested_by_name: 'Sarah Johnson',
    department: 'Electrical',
    project: 'Metro Heights Tower A',
    priority: 'medium',
    status: 'under-review',
    estimated_cost: 35000,
    requested_date: '2024-12-22',
    required_date: '2025-01-05',
    items: [
      {
        id: '3',
        material_name: 'Copper Wire 12 AWG',
        specification: 'THWN insulated, 600V rated',
        quantity: 2000,
        unit: 'meters',
        estimated_price: 2.85,
        preferred_vendor: 'Elite Electrical Services'
      },
      {
        id: '4',
        material_name: 'Electrical Panels',
        specification: '200A main breaker panel',
        quantity: 8,
        unit: 'pieces',
        estimated_price: 450,
        preferred_vendor: 'Elite Electrical Services'
      }
    ]
  },
  {
    id: '3',
    request_number: 'PR-2024-003',
    title: 'Plumbing Fixtures and Fittings',
    description: 'Bathroom fixtures, pipes, and fittings for residential units',
    requested_by: 'user3',
    requested_by_name: 'Mike Chen',
    department: 'Plumbing',
    project: 'Garden View Residences',
    priority: 'medium',
    status: 'submitted',
    estimated_cost: 28000,
    requested_date: '2024-12-23',
    required_date: '2025-01-10',
    items: [
      {
        id: '5',
        material_name: 'PVC Pipes',
        specification: '4 inch diameter, Schedule 40',
        quantity: 500,
        unit: 'meters',
        estimated_price: 12,
        preferred_vendor: 'Plumbing Pro Supply'
      }
    ]
  }
]

export function ProcurementDashboard() {
  const [requests, setRequests] = useState<ProcurementRequest[]>(mockProcurementRequests)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<ProcurementRequest | null>(null)
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('requests')

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.request_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requested_by_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'under-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const ProcurementRequestForm = ({ request, onSave, onClose }: { request?: ProcurementRequest, onSave: (request: ProcurementRequest) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      title: request?.title || '',
      description: request?.description || '',
      department: request?.department || '',
      project: request?.project || '',
      priority: request?.priority || 'medium',
      estimated_cost: request?.estimated_cost || 0,
      required_date: request?.required_date || ''
    })

    const [items, setItems] = useState<ProcurementItem[]>(request?.items || [])

    const addItem = () => {
      const newItem: ProcurementItem = {
        id: Date.now().toString(),
        material_name: '',
        specification: '',
        quantity: 0,
        unit: '',
        estimated_price: 0
      }
      setItems([...items, newItem])
    }

    const updateItem = (index: number, field: keyof ProcurementItem, value: any) => {
      const updatedItems = [...items]
      updatedItems[index] = { ...updatedItems[index], [field]: value }
      setItems(updatedItems)
      
      // Recalculate estimated cost
      const totalCost = updatedItems.reduce((sum, item) => sum + (item.quantity * item.estimated_price), 0)
      setFormData({ ...formData, estimated_cost: totalCost })
    }

    const removeItem = (index: number) => {
      const updatedItems = items.filter((_, i) => i !== index)
      setItems(updatedItems)
      
      // Recalculate estimated cost
      const totalCost = updatedItems.reduce((sum, item) => sum + (item.quantity * item.estimated_price), 0)
      setFormData({ ...formData, estimated_cost: totalCost })
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newRequest: ProcurementRequest = {
        id: request?.id || Date.now().toString(),
        request_number: request?.request_number || `PR-${new Date().getFullYear()}-${(requests.length + 1).toString().padStart(3, '0')}`,
        ...formData,
        requested_by: request?.requested_by || 'current_user',
        requested_by_name: request?.requested_by_name || 'Current User',
        status: request?.status || 'draft',
        requested_date: request?.requested_date || new Date().toISOString().split('T')[0],
        items: items
      }
      onSave(newRequest)
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Request Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief description of request"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
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
            placeholder="Detailed description of procurement needs"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="HVAC">HVAC</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <Label htmlFor="required_date">Required Date</Label>
            <Input
              id="required_date"
              type="date"
              value={formData.required_date}
              onChange={(e) => setFormData({...formData, required_date: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Procurement Items</h4>
            <Button type="button" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Item {index + 1}</h5>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="destructive"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Material Name</Label>
                  <Input
                    value={item.material_name}
                    onChange={(e) => updateItem(index, 'material_name', e.target.value)}
                    placeholder="Material or service name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specification</Label>
                  <Input
                    value={item.specification}
                    onChange={(e) => updateItem(index, 'specification', e.target.value)}
                    placeholder="Technical specifications"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={item.unit} onValueChange={(value) => updateItem(index, 'unit', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pieces">Pieces</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="rolls">Rolls</SelectItem>
                      <SelectItem value="gallons">Gallons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Est. Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.estimated_price}
                    onChange={(e) => updateItem(index, 'estimated_price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input
                    value={`$${(item.quantity * item.estimated_price).toFixed(2)}`}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Vendor (Optional)</Label>
                <Input
                  value={item.preferred_vendor || ''}
                  onChange={(e) => updateItem(index, 'preferred_vendor', e.target.value)}
                  placeholder="Preferred supplier"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold">
            Total Estimated Cost: ${formData.estimated_cost.toLocaleString()}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {request ? 'Update Request' : 'Create Request'}
          </Button>
        </div>
      </form>
    )
  }

  const RequestDetails = ({ request }: { request: ProcurementRequest }) => (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{request.title}</h3>
          <p className="text-sm text-muted-foreground">{request.request_number}</p>
        </div>
        <div className="flex space-x-2">
          <Badge className={getStatusColor(request.status)} variant="outline">
            {request.status.replace('-', ' ').toUpperCase()}
          </Badge>
          <Badge className={getPriorityColor(request.priority)} variant="outline">
            {request.priority.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Request Information</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Requested by:</dt>
              <dd>{request.requested_by_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Department:</dt>
              <dd>{request.department}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Project:</dt>
              <dd>{request.project}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Requested Date:</dt>
              <dd>{new Date(request.requested_date).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Required Date:</dt>
              <dd>{new Date(request.required_date).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="font-medium mb-3">Cost Information</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estimated Cost:</dt>
              <dd>${request.estimated_cost.toLocaleString()}</dd>
            </div>
            {request.actual_cost && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Actual Cost:</dt>
                <dd>${request.actual_cost.toLocaleString()}</dd>
              </div>
            )}
            {request.approved_by && (
              <>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Approved by:</dt>
                  <dd>{request.approved_by}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Approved Date:</dt>
                  <dd>{request.approved_date ? new Date(request.approved_date).toLocaleDateString() : '-'}</dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Description</h4>
        <p className="text-sm text-muted-foreground">{request.description}</p>
      </div>

      <div>
        <h4 className="font-medium mb-3">Procurement Items</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead>Specification</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {request.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{item.material_name}</div>
                    {item.preferred_vendor && (
                      <div className="text-xs text-muted-foreground">
                        Preferred: {item.preferred_vendor}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{item.specification}</TableCell>
                <TableCell className="text-sm">
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell className="text-sm">
                  ${item.estimated_price.toFixed(2)}
                </TableCell>
                <TableCell className="text-sm">
                  ${(item.quantity * item.estimated_price).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  const approvalRequests = requests.filter(r => r.status === 'submitted' || r.status === 'under-review')
  const totalValue = requests.reduce((sum, r) => sum + r.estimated_cost, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Procurement Management</h1>
          <p className="text-muted-foreground">
            Manage procurement requests and approval workflows
          </p>
        </div>
        <Dialog open={isCreateRequestOpen} onOpenChange={setIsCreateRequestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Procurement Request</DialogTitle>
              <DialogDescription>
                Submit a new procurement request for materials or services
              </DialogDescription>
            </DialogHeader>
            <ProcurementRequestForm 
              onSave={(request) => {
                setRequests([...requests, request])
              }}
              onClose={() => setIsCreateRequestOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">All Requests</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Procurement Requests</CardTitle>
              <CardDescription>
                View and manage all procurement requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead>Required Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.title}</div>
                          <div className="text-sm text-muted-foreground">{request.request_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {request.requested_by_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm">{request.requested_by_name}</div>
                            <div className="text-xs text-muted-foreground">{request.department}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{request.project}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(request.priority)} variant="outline">
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)} variant="outline">
                          {request.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          ${request.estimated_cost.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(request.required_date).toLocaleDateString()}
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
                            <DropdownMenuItem onClick={() => setSelectedRequest(request)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Request
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Create PO
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Export PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvalRequests.length}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {requests.filter(r => r.status === 'approved').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ready for procurement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Request Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  All pending requests
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Requests Awaiting Approval</CardTitle>
              <CardDescription>
                Review and approve procurement requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approvalRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No requests pending approval.
                </p>
              ) : (
                <div className="space-y-4">
                  {approvalRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{request.title}</h4>
                            <Badge className={getPriorityColor(request.priority)} variant="outline">
                              {request.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {request.requested_by_name}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Required: {new Date(request.required_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ${request.estimated_cost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Procurement Analytics</CardTitle>
              <CardDescription>
                Insights into procurement patterns and spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                Advanced analytics including spending trends, approval times, vendor performance,
                and budget tracking will be available here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Procurement Request Details</DialogTitle>
            <DialogDescription>
              Complete information about the procurement request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && <RequestDetails request={selectedRequest} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}