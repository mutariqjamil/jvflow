import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface InstallmentPlan {
  id: string
  name: string
  description: string
  total_installments: number
  booking_percentage: number
  registration_percentage: number
  construction_linked_percentage: number
  possession_percentage: number
  created_by: string
  created_date: string
  is_active: boolean
}

interface Installment {
  id: string
  booking_id: string
  installment_plan_id: string
  customer_name: string
  unit_name: string
  milestone: string
  amount: number
  due_date: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  invoice_generated: boolean
  invoice_id?: string
  payment_realized_status?: 'pending' | 'realized' | 'settled'
}

interface Invoice {
  id: string
  installment_id: string
  invoice_number: string
  customer_name: string
  unit_name: string
  amount: number
  tax_amount: number
  total_amount: number
  issue_date: string
  due_date: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  payment_terms: string
}

interface Payment {
  id: string
  installment_id: string
  invoice_id: string
  amount: number
  payment_date: string
  payment_method: string
  reference_number: string
  received_by: string
  status: 'in_transit' | 'realized' | 'settled'
  bank_deposit_date?: string
  reconciliation_date?: string
}

export function InstallmentsInvoicingDashboard() {
  const [activeTab, setActiveTab] = useState('installments')
  const [showCreatePlan, setShowCreatePlan] = useState(false)
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    unit: 'all',
    customer: '',
    dateRange: 'all',
    amountRange: ''
  })

  // Mock data
  const mockInstallmentPlans: InstallmentPlan[] = [
    {
      id: '1',
      name: 'Standard Plan - 24 Months',
      description: 'Standard payment plan with construction linked payments',
      total_installments: 8,
      booking_percentage: 10,
      registration_percentage: 5,
      construction_linked_percentage: 80,
      possession_percentage: 5,
      created_by: 'Admin',
      created_date: '2024-01-01',
      is_active: true
    },
    {
      id: '2',
      name: 'Quick Payment - 12 Months',
      description: 'Accelerated payment plan with higher initial payments',
      total_installments: 6,
      booking_percentage: 15,
      registration_percentage: 10,
      construction_linked_percentage: 70,
      possession_percentage: 5,
      created_by: 'Admin',
      created_date: '2024-01-01',
      is_active: true
    }
  ]

  const mockInstallments: Installment[] = [
    {
      id: '1',
      booking_id: 'BK001',
      installment_plan_id: '1',
      customer_name: 'Rajesh Kumar',
      unit_name: '2BHK Premium - A101',
      milestone: 'Booking Amount',
      amount: 550000,
      due_date: '2024-01-15',
      status: 'paid',
      invoice_generated: true,
      invoice_id: 'INV-001',
      payment_realized_status: 'realized'
    },
    {
      id: '2',
      booking_id: 'BK001',
      installment_plan_id: '1',
      customer_name: 'Rajesh Kumar',
      unit_name: '2BHK Premium - A101',
      milestone: 'Registration',
      amount: 275000,
      due_date: '2024-02-15',
      status: 'pending',
      invoice_generated: true,
      invoice_id: 'INV-002',
      payment_realized_status: 'pending'
    },
    {
      id: '3',
      booking_id: 'BK002',
      installment_plan_id: '2',
      customer_name: 'Anita Verma',
      unit_name: '3BHK Deluxe - B205',
      milestone: 'Foundation Complete',
      amount: 1080000,
      due_date: '2024-01-25',
      status: 'overdue',
      invoice_generated: true,
      invoice_id: 'INV-003',
      payment_realized_status: 'pending'
    }
  ]

  const mockInvoices: Invoice[] = [
    {
      id: '1',
      installment_id: '1',
      invoice_number: 'INV-001',
      customer_name: 'Rajesh Kumar',
      unit_name: '2BHK Premium - A101',
      amount: 550000,
      tax_amount: 99000,
      total_amount: 649000,
      issue_date: '2024-01-01',
      due_date: '2024-01-15',
      status: 'paid',
      payment_terms: 'Net 15 days'
    },
    {
      id: '2',
      installment_id: '2',
      invoice_number: 'INV-002',
      customer_name: 'Rajesh Kumar',
      unit_name: '2BHK Premium - A101',
      amount: 275000,
      tax_amount: 49500,
      total_amount: 324500,
      issue_date: '2024-02-01',
      due_date: '2024-02-15',
      status: 'sent',
      payment_terms: 'Net 15 days'
    },
    {
      id: '3',
      installment_id: '3',
      invoice_number: 'INV-003',
      customer_name: 'Anita Verma',
      unit_name: '3BHK Deluxe - B205',
      amount: 1080000,
      tax_amount: 194400,
      total_amount: 1274400,
      issue_date: '2024-01-10',
      due_date: '2024-01-25',
      status: 'overdue',
      payment_terms: 'Net 15 days'
    }
  ]

  const mockPayments: Payment[] = [
    {
      id: '1',
      installment_id: '1',
      invoice_id: '1',
      amount: 649000,
      payment_date: '2024-01-15',
      payment_method: 'bank_transfer',
      reference_number: 'TXN123456789',
      received_by: 'Priya Sharma',
      status: 'realized',
      bank_deposit_date: '2024-01-16',
      reconciliation_date: '2024-01-17'
    }
  ]

  const CreateInstallmentPlanDialog = () => (
    <Dialog open={showCreatePlan} onOpenChange={setShowCreatePlan}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Installment Plan</DialogTitle>
          <DialogDescription>
            Define a new payment plan with milestone-based installments
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plan Name *</Label>
              <Input placeholder="e.g., Premium Plan - 18 Months" />
            </div>
            <div className="space-y-2">
              <Label>Total Installments</Label>
              <Input type="number" placeholder="8" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Input placeholder="Brief description of the payment plan" />
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Payment Structure (%)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Booking Amount</Label>
                <Input type="number" placeholder="10" />
              </div>
              <div className="space-y-2">
                <Label>Registration</Label>
                <Input type="number" placeholder="5" />
              </div>
              <div className="space-y-2">
                <Label>Construction Linked</Label>
                <Input type="number" placeholder="80" />
              </div>
              <div className="space-y-2">
                <Label>Possession</Label>
                <Input type="number" placeholder="5" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Milestone Details</h4>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((milestone) => (
                <div key={milestone} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Milestone {milestone}</Label>
                    <Input placeholder="e.g., Foundation Complete" />
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage</Label>
                    <Input type="number" placeholder="20" />
                  </div>
                  <div className="space-y-2">
                    <Label>Due After (days)</Label>
                    <Input type="number" placeholder="30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreatePlan(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("Installment plan created successfully!")
              setShowCreatePlan(false)
            }}>
              Create Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const InvoiceDetailsDialog = () => (
    <Dialog open={showInvoiceDetails} onOpenChange={setShowInvoiceDetails}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice Details - {selectedInvoice?.invoice_number}</DialogTitle>
          <DialogDescription>
            Complete invoice information and payment status
          </DialogDescription>
        </DialogHeader>
        
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Customer</Label>
                <p className="font-medium">{selectedInvoice.customer_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Unit</Label>
                <p className="font-medium">{selectedInvoice.unit_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Issue Date</Label>
                <p>{selectedInvoice.issue_date}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
                <p>{selectedInvoice.due_date}</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Amount Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Amount:</span>
                  <span>₹{selectedInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST):</span>
                  <span>₹{selectedInvoice.tax_amount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>₹{selectedInvoice.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Badge className={
                selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                selectedInvoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                selectedInvoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }>
                {selectedInvoice.status.toUpperCase()}
              </Badge>
              
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  Send Reminder
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

  const FilterDialog = () => (
    <Dialog open={showFilters} onOpenChange={setShowFilters}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Filter installments and invoices by various criteria
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Unit</Label>
            <Select value={filters.unit} onValueChange={(value) => setFilters(prev => ({ ...prev, unit: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Units</SelectItem>
                <SelectItem value="A101">2BHK Premium - A101</SelectItem>
                <SelectItem value="B205">3BHK Deluxe - B205</SelectItem>
                <SelectItem value="C301">4BHK Luxury - C301</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Customer</Label>
            <Input 
              placeholder="Search by customer name" 
              value={filters.customer}
              onChange={(e) => setFilters(prev => ({ ...prev, customer: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="current">Current Month</SelectItem>
                <SelectItem value="pending">Pending This Month</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="next30">Next 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setFilters({ status: 'all', unit: 'all', customer: '', dateRange: 'all', amountRange: '' })}>
              Clear Filters
            </Button>
            <Button onClick={() => {
              toast.success("Filters applied successfully!")
              setShowFilters(false)
            }}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const filteredInstallments = mockInstallments.filter(installment => {
    if (filters.status !== 'all' && installment.status !== filters.status) return false
    if (filters.unit !== 'all' && !installment.unit_name.includes(filters.unit)) return false
    if (filters.customer && !installment.customer_name.toLowerCase().includes(filters.customer.toLowerCase())) return false
    return true
  })

  const filteredInvoices = mockInvoices.filter(invoice => {
    if (filters.status !== 'all' && invoice.status !== filters.status) return false
    if (filters.unit !== 'all' && !invoice.unit_name.includes(filters.unit)) return false
    if (filters.customer && !invoice.customer_name.toLowerCase().includes(filters.customer.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Installments & Invoicing</h1>
          <p className="text-muted-foreground">
            Manage payment plans, installments, invoices, and payment tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={() => setShowCreatePlan(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Installments</p>
                <p className="text-2xl font-bold">₹3.24L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">₹12.74L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Realized</p>
                <p className="text-2xl font-bold">₹6.49L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">₹0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="installments">Installment Schedule</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
          <TabsTrigger value="plans">Payment Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="installments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Installment Schedule</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search installments..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer & Unit</TableHead>
                    <TableHead>Milestone</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstallments.map((installment) => (
                    <TableRow key={installment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{installment.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{installment.unit_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{installment.milestone}</TableCell>
                      <TableCell className="font-medium">₹{installment.amount.toLocaleString()}</TableCell>
                      <TableCell>{installment.due_date}</TableCell>
                      <TableCell>
                        <Badge className={
                          installment.status === 'paid' ? 'bg-green-100 text-green-800' :
                          installment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {installment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {installment.payment_realized_status && (
                          <Badge variant="outline" className={
                            installment.payment_realized_status === 'realized' ? 'border-green-200 text-green-700' :
                            installment.payment_realized_status === 'settled' ? 'border-blue-200 text-blue-700' :
                            'border-yellow-200 text-yellow-700'
                          }>
                            {installment.payment_realized_status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {installment.invoice_generated ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const invoice = mockInvoices.find(inv => inv.installment_id === installment.id)
                                if (invoice) {
                                  setSelectedInvoice(invoice)
                                  setShowInvoiceDetails(true)
                                }
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {installment.invoice_id}
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.success("Invoice generated successfully!")}
                            >
                              Generate Invoice
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.success("Payment recorded successfully!")}
                          >
                            Record Payment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer & Unit</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{invoice.unit_name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">₹{invoice.total_amount.toLocaleString()}</TableCell>
                      <TableCell>{invoice.issue_date}</TableCell>
                      <TableCell>{invoice.due_date}</TableCell>
                      <TableCell>
                        <Badge className={
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(invoice)
                              setShowInvoiceDetails(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.success("Invoice downloaded!")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => {
                    const invoice = mockInvoices.find(inv => inv.id === payment.invoice_id)
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{invoice?.invoice_number}</TableCell>
                        <TableCell>{invoice?.customer_name}</TableCell>
                        <TableCell className="font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.payment_date}</TableCell>
                        <TableCell>{payment.payment_method.replace('_', ' ')}</TableCell>
                        <TableCell>
                          <Badge className={
                            payment.status === 'realized' ? 'bg-green-100 text-green-800' :
                            payment.status === 'settled' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {payment.status === 'in_transit' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.success("Payment marked as realized!")}
                              >
                                Mark Realized
                              </Button>
                            )}
                            {payment.status === 'realized' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.success("Payment marked as settled!")}
                              >
                                Mark Settled
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Installment Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Total Installments</TableHead>
                    <TableHead>Booking %</TableHead>
                    <TableHead>Construction %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInstallmentPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell className="text-sm">{plan.description}</TableCell>
                      <TableCell>{plan.total_installments}</TableCell>
                      <TableCell>{plan.booking_percentage}%</TableCell>
                      <TableCell>{plan.construction_linked_percentage}%</TableCell>
                      <TableCell>
                        <Badge className={plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {plan.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toast.success(plan.is_active ? "Plan deactivated!" : "Plan activated!")}
                          >
                            {plan.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateInstallmentPlanDialog />
      <InvoiceDetailsDialog />
      <FilterDialog />
    </div>
  )
}