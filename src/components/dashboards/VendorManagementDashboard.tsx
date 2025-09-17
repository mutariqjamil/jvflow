import { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Building2, Phone, Mail, MapPin, Star, TrendingUp, Calendar, FileText, Edit, Trash2, UserCheck, AlertTriangle, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Progress } from '../ui/progress'

interface Vendor {
  id: string
  name: string
  category: string
  contact_person: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  rating: number
  total_orders: number
  total_value: number
  contract_type: 'one-time' | 'ongoing' | 'preferred'
  payment_terms: string
  created_at: string
  last_order_date: string
  performance_score: number
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Superior Steel Works',
    category: 'Steel & Metal',
    contact_person: 'John Mitchell',
    email: 'john@superiorsteel.com',
    phone: '+1 (555) 123-4567',
    address: '123 Industrial Ave, Metro City',
    status: 'active',
    rating: 4.8,
    total_orders: 15,
    total_value: 2500000,
    contract_type: 'preferred',
    payment_terms: 'Net 30',
    created_at: '2024-01-15',
    last_order_date: '2024-12-20',
    performance_score: 95
  },
  {
    id: '2',
    name: 'Prime Concrete Solutions',
    category: 'Concrete & Cement',
    contact_person: 'Sarah Davis',
    email: 'sarah@primeconcrete.com',
    phone: '+1 (555) 987-6543',
    address: '456 Construction Blvd, Metro City',
    status: 'active',
    rating: 4.6,
    total_orders: 22,
    total_value: 1800000,
    contract_type: 'ongoing',
    payment_terms: 'Net 15',
    created_at: '2024-02-20',
    last_order_date: '2024-12-18',
    performance_score: 88
  },
  {
    id: '3',
    name: 'Elite Electrical Services',
    category: 'Electrical',
    contact_person: 'Mike Thompson',
    email: 'mike@eliteelectrical.com',
    phone: '+1 (555) 456-7890',
    address: '789 Electric Row, Metro City',
    status: 'pending',
    rating: 4.2,
    total_orders: 8,
    total_value: 680000,
    contract_type: 'one-time',
    payment_terms: 'Net 30',
    created_at: '2024-11-10',
    last_order_date: '2024-12-15',
    performance_score: 75
  }
]

export function VendorManagementDashboard() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('vendors')

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'preferred': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200'
      case 'one-time': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const categories = [...new Set(vendors.map(v => v.category))]

  const VendorForm = ({ vendor, onSave, onClose }: { vendor?: Vendor, onSave: (vendor: Vendor) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: vendor?.name || '',
      category: vendor?.category || '',
      contact_person: vendor?.contact_person || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      address: vendor?.address || '',
      status: vendor?.status || 'pending',
      contract_type: vendor?.contract_type || 'one-time',
      payment_terms: vendor?.payment_terms || 'Net 30'
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newVendor: Vendor = {
        id: vendor?.id || Date.now().toString(),
        ...formData,
        rating: vendor?.rating || 0,
        total_orders: vendor?.total_orders || 0,
        total_value: vendor?.total_value || 0,
        created_at: vendor?.created_at || new Date().toISOString().split('T')[0],
        last_order_date: vendor?.last_order_date || '',
        performance_score: vendor?.performance_score || 0
      } as Vendor
      onSave(newVendor)
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter company name"
              required
            />
          </div>
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
                <SelectItem value="HVAC">HVAC</SelectItem>
                <SelectItem value="Flooring">Flooring</SelectItem>
                <SelectItem value="Roofing">Roofing</SelectItem>
                <SelectItem value="General Labor">General Labor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_person">Contact Person</Label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
              placeholder="Primary contact name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="contact@company.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="Full business address"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contract_type">Contract Type</Label>
            <Select value={formData.contract_type} onValueChange={(value) => setFormData({...formData, contract_type: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="preferred">Preferred</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_terms">Payment Terms</Label>
            <Select value={formData.payment_terms} onValueChange={(value) => setFormData({...formData, payment_terms: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Net 15">Net 15</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 45">Net 45</SelectItem>
                <SelectItem value="Net 60">Net 60</SelectItem>
                <SelectItem value="COD">Cash on Delivery</SelectItem>
                <SelectItem value="Advance">Advance Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {vendor ? 'Update Vendor' : 'Add Vendor'}
          </Button>
        </div>
      </form>
    )
  }

  const VendorDetails = ({ vendor }: { vendor: Vendor }) => (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{vendor.name}</h3>
          <p className="text-sm text-muted-foreground">{vendor.category}</p>
        </div>
        <div className="flex space-x-2">
          <Badge className={getStatusColor(vendor.status)} variant="outline">
            {vendor.status.toUpperCase()}
          </Badge>
          <Badge className={getContractTypeColor(vendor.contract_type)} variant="outline">
            {vendor.contract_type.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Contact Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <span>{vendor.contact_person}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{vendor.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{vendor.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{vendor.address}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Performance Metrics</h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Performance Score</span>
                <span>{vendor.performance_score}%</span>
              </div>
              <Progress value={vendor.performance_score} className="h-2" />
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">{vendor.rating}/5.0 Rating</span>
            </div>
            <div className="text-sm">
              <div>Total Orders: {vendor.total_orders}</div>
              <div>Total Value: ${vendor.total_value.toLocaleString()}</div>
              <div>Payment Terms: {vendor.payment_terms}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vendor Management</h1>
          <p className="text-muted-foreground">
            Manage vendor relationships, contracts, and performance
          </p>
        </div>
        <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Enter vendor information to add them to your supplier network
              </DialogDescription>
            </DialogHeader>
            <VendorForm 
              onSave={(vendor) => {
                setVendors([...vendors, vendor])
              }}
              onClose={() => setIsAddVendorOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>
                Search and filter your vendor network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vendors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
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
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Since {new Date(vendor.created_at).getFullYear()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{vendor.contact_person}</div>
                          <div className="text-xs text-muted-foreground">{vendor.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {vendor.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vendor.status)} variant="outline">
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getContractTypeColor(vendor.contract_type)} variant="outline">
                          {vendor.contract_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm">{vendor.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          ${vendor.total_value.toLocaleString()}
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
                            <DropdownMenuItem onClick={() => setSelectedVendor(vendor)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Vendor
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Building2 className="mr-2 h-4 w-4" />
                              View Orders
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove Vendor
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

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vendors.filter(v => v.performance_score >= 90).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Vendors with 90%+ score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vendors.filter(v => v.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently active suppliers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vendors.filter(v => v.performance_score < 75).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Vendors below 75% score
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Rankings</CardTitle>
              <CardDescription>
                Performance scores based on delivery, quality, and compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors
                  .sort((a, b) => b.performance_score - a.performance_score)
                  .slice(0, 10)
                  .map((vendor, index) => (
                    <div key={vendor.id} className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{vendor.name}</span>
                          <span className="text-sm text-muted-foreground">{vendor.performance_score}%</span>
                        </div>
                        <Progress value={vendor.performance_score} className="h-2" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Preferred Vendors</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vendors.filter(v => v.contract_type === 'preferred').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Priority suppliers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ongoing Contracts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vendors.filter(v => v.contract_type === 'ongoing').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Long-term agreements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contract Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${vendors.reduce((sum, v) => sum + v.total_value, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all vendors
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Vendor Details Dialog */}
      <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>
              Complete information and performance metrics
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && <VendorDetails vendor={selectedVendor} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}