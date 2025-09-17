import { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Package, AlertTriangle, TrendingDown, TrendingUp, BarChart3, Archive, Edit, Trash2, Eye, Download, Upload } from 'lucide-react'
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

interface Material {
  id: string
  name: string
  category: string
  sku: string
  description: string
  unit: string
  unit_price: number
  current_stock: number
  min_stock_level: number
  max_stock_level: number
  location: string
  supplier: string
  last_ordered: string
  last_received: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued'
  specifications?: Record<string, string>
}

const mockMaterials: Material[] = [
  {
    id: '1',
    name: 'Steel Rebar Grade 60',
    category: 'Steel & Metal',
    sku: 'STL-RB-60-12',
    description: '12mm Grade 60 deformed steel reinforcement bars',
    unit: 'tons',
    unit_price: 850,
    current_stock: 15.5,
    min_stock_level: 5,
    max_stock_level: 50,
    location: 'Warehouse A-1',
    supplier: 'Superior Steel Works',
    last_ordered: '2024-12-15',
    last_received: '2024-12-20',
    status: 'in-stock',
    specifications: {
      'Grade': '60',
      'Diameter': '12mm',
      'Length': '12m',
      'Standard': 'ASTM A615'
    }
  },
  {
    id: '2',
    name: 'Portland Cement Type I',
    category: 'Concrete & Cement',
    sku: 'CEM-PRT-T1-50',
    description: 'Type I Portland cement for general construction',
    unit: 'bags',
    unit_price: 12.50,
    current_stock: 850,
    min_stock_level: 200,
    max_stock_level: 2000,
    location: 'Warehouse B-2',
    supplier: 'Prime Concrete Solutions',
    last_ordered: '2024-12-18',
    last_received: '2024-12-22',
    status: 'in-stock',
    specifications: {
      'Type': 'Type I',
      'Weight': '50kg',
      'Standard': 'ASTM C150',
      'Compressive Strength': '42.5 MPa'
    }
  },
  {
    id: '3',
    name: 'Copper Wire 12 AWG',
    category: 'Electrical',
    sku: 'ELC-CU-12AWG',
    description: '12 AWG solid copper electrical wire',
    unit: 'meters',
    unit_price: 2.85,
    current_stock: 125,
    min_stock_level: 500,
    max_stock_level: 2000,
    location: 'Electrical Storage',
    supplier: 'Elite Electrical Services',
    last_ordered: '2024-12-10',
    last_received: '2024-12-14',
    status: 'low-stock',
    specifications: {
      'Gauge': '12 AWG',
      'Material': 'Solid Copper',
      'Insulation': 'THWN',
      'Voltage': '600V'
    }
  },
  {
    id: '4',
    name: 'Plywood 18mm Marine Grade',
    category: 'Wood & Timber',
    sku: 'WD-PLY-18MG',
    description: '18mm marine grade plywood sheets',
    unit: 'sheets',
    unit_price: 95,
    current_stock: 0,
    min_stock_level: 20,
    max_stock_level: 100,
    location: 'Timber Yard',
    supplier: 'Premium Timber Co',
    last_ordered: '2024-12-05',
    last_received: '2024-12-08',
    status: 'out-of-stock',
    specifications: {
      'Thickness': '18mm',
      'Size': '4x8 ft',
      'Grade': 'Marine Grade',
      'Core': 'Hardwood'
    }
  }
]

export function MaterialManagementDashboard() {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('materials')

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || material.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 border-green-200'
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200'
      case 'discontinued': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStockStatus = (material: Material) => {
    if (material.current_stock === 0) return 'out-of-stock'
    if (material.current_stock <= material.min_stock_level) return 'low-stock'
    return 'in-stock'
  }

  const categories = [...new Set(materials.map(m => m.category))]

  const MaterialForm = ({ material, onSave, onClose }: { material?: Material, onSave: (material: Material) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: material?.name || '',
      category: material?.category || '',
      sku: material?.sku || '',
      description: material?.description || '',
      unit: material?.unit || '',
      unit_price: material?.unit_price || 0,
      current_stock: material?.current_stock || 0,
      min_stock_level: material?.min_stock_level || 0,
      max_stock_level: material?.max_stock_level || 0,
      location: material?.location || '',
      supplier: material?.supplier || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newMaterial: Material = {
        id: material?.id || Date.now().toString(),
        ...formData,
        status: getStockStatus({...formData} as Material) as any,
        last_ordered: material?.last_ordered || '',
        last_received: material?.last_received || '',
        specifications: material?.specifications || {}
      }
      onSave(newMaterial)
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Material Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter material name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              placeholder="Material SKU"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Material description"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Steel & Metal">Steel & Metal</SelectItem>
                <SelectItem value="Concrete & Cement">Concrete & Cement</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Wood & Timber">Wood & Timber</SelectItem>
                <SelectItem value="Hardware">Hardware</SelectItem>
                <SelectItem value="Tools">Tools</SelectItem>
                <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pieces">Pieces</SelectItem>
                <SelectItem value="meters">Meters</SelectItem>
                <SelectItem value="tons">Tons</SelectItem>
                <SelectItem value="bags">Bags</SelectItem>
                <SelectItem value="sheets">Sheets</SelectItem>
                <SelectItem value="rolls">Rolls</SelectItem>
                <SelectItem value="gallons">Gallons</SelectItem>
                <SelectItem value="boxes">Boxes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit_price">Unit Price ($)</Label>
            <Input
              id="unit_price"
              type="number"
              step="0.01"
              value={formData.unit_price}
              onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value) || 0})}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_stock">Current Stock</Label>
            <Input
              id="current_stock"
              type="number"
              step="0.01"
              value={formData.current_stock}
              onChange={(e) => setFormData({...formData, current_stock: parseFloat(e.target.value) || 0})}
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min_stock_level">Min Stock Level</Label>
            <Input
              id="min_stock_level"
              type="number"
              step="0.01"
              value={formData.min_stock_level}
              onChange={(e) => setFormData({...formData, min_stock_level: parseFloat(e.target.value) || 0})}
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_stock_level">Max Stock Level</Label>
            <Input
              id="max_stock_level"
              type="number"
              step="0.01"
              value={formData.max_stock_level}
              onChange={(e) => setFormData({...formData, max_stock_level: parseFloat(e.target.value) || 0})}
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Storage Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Warehouse location"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplier">Preferred Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({...formData, supplier: e.target.value})}
              placeholder="Supplier name"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {material ? 'Update Material' : 'Add Material'}
          </Button>
        </div>
      </form>
    )
  }

  const MaterialDetails = ({ material }: { material: Material }) => (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{material.name}</h3>
          <p className="text-sm text-muted-foreground">SKU: {material.sku}</p>
        </div>
        <Badge className={getStatusColor(getStockStatus(material))} variant="outline">
          {getStockStatus(material).replace('-', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Basic Information</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Category:</dt>
              <dd>{material.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Unit:</dt>
              <dd>{material.unit}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Unit Price:</dt>
              <dd>${material.unit_price.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Supplier:</dt>
              <dd>{material.supplier}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Location:</dt>
              <dd>{material.location}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="font-medium mb-3">Stock Information</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Current Stock</span>
                <span>{material.current_stock} {material.unit}</span>
              </div>
              <Progress 
                value={(material.current_stock / material.max_stock_level) * 100} 
                className="h-2" 
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Min: {material.min_stock_level}</span>
                <span>Max: {material.max_stock_level}</span>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock Value:</span>
                <span>${(material.current_stock * material.unit_price).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Ordered:</span>
                <span>{material.last_ordered || 'Never'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Received:</span>
                <span>{material.last_received || 'Never'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {material.specifications && Object.keys(material.specifications).length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Specifications</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(material.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-medium">Description</h4>
        <p className="text-sm text-muted-foreground">{material.description}</p>
      </div>
    </div>
  )

  const lowStockItems = materials.filter(m => getStockStatus(m) === 'low-stock')
  const outOfStockItems = materials.filter(m => getStockStatus(m) === 'out-of-stock')
  const totalValue = materials.reduce((sum, m) => sum + (m.current_stock * m.unit_price), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Material Management</h1>
          <p className="text-muted-foreground">
            Track inventory, specifications, and material requirements
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Materials
          </Button>
          <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Material</DialogTitle>
                <DialogDescription>
                  Enter material information to add it to your inventory
                </DialogDescription>
              </DialogHeader>
              <MaterialForm 
                onSave={(material) => {
                  setMaterials([...materials, material])
                }}
                onClose={() => setIsAddMaterialOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alert for low/out of stock items */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {outOfStockItems.length > 0 && (
              <span className="text-red-600 font-medium">
                {outOfStockItems.length} items out of stock. 
              </span>
            )}
            {lowStockItems.length > 0 && (
              <span className="text-yellow-600 font-medium ml-2">
                {lowStockItems.length} items below minimum stock level.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Catalog</CardTitle>
              <CardDescription>
                Browse and manage your material inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search materials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => {
                    const status = getStockStatus(material)
                    return (
                      <TableRow key={material.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{material.name}</div>
                            <div className="text-sm text-muted-foreground">SKU: {material.sku}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {material.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {material.current_stock} {material.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Min: {material.min_stock_level}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(status)} variant="outline">
                            {status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            ${material.unit_price.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            ${(material.current_stock * material.unit_price).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{material.location}</div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedMaterial(material)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Material
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Package className="mr-2 h-4 w-4" />
                                Adjust Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Export Data
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )}
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materials.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active materials
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <TrendingDown className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
                <p className="text-xs text-muted-foreground">
                  Need reordering
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
                <p className="text-xs text-muted-foreground">
                  Immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Inventory value
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>
                  Materials below minimum stock level
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">All materials are adequately stocked.</p>
                ) : (
                  <div className="space-y-3">
                    {lowStockItems.map((material) => (
                      <div key={material.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{material.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {material.current_stock} / {material.min_stock_level} {material.unit}
                          </div>
                        </div>
                        <Badge className={getStatusColor('low-stock')} variant="outline">
                          Low Stock
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Out of Stock</CardTitle>
                <CardDescription>
                  Materials requiring immediate procurement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {outOfStockItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No materials are out of stock.</p>
                ) : (
                  <div className="space-y-3">
                    {outOfStockItems.map((material) => (
                      <div key={material.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{material.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Supplier: {material.supplier}
                          </div>
                        </div>
                        <Badge className={getStatusColor('out-of-stock')} variant="outline">
                          Out of Stock
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
              <CardDescription>
                Insights into material usage and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                Advanced analytics and reporting features will be available here.
                This includes material consumption trends, cost analysis, and optimization recommendations.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Material Details Dialog */}
      <Dialog open={!!selectedMaterial} onOpenChange={() => setSelectedMaterial(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Material Details</DialogTitle>
            <DialogDescription>
              Complete material information and specifications
            </DialogDescription>
          </DialogHeader>
          {selectedMaterial && <MaterialDetails material={selectedMaterial} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}