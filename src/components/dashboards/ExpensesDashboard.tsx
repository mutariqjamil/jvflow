import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { ExpenseApprovalDialog } from '../ExpenseApprovalDialog'
import { 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Download,
  Search
} from 'lucide-react'
import { useAuth } from '../AuthProvider'
import { useNotifications } from '../NotificationProvider'
import { useInternationalization } from '../providers/InternationalizationProvider'

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  vendor: string
  status: 'pending' | 'approved' | 'rejected'
  created_by: string
  approved_by?: string
  created_at: string
  invoice_number?: string
  receipt_url?: string
  rejection_reason?: string
}

// Enhanced mock expense data
const mockExpenses: Expense[] = [
  {
    id: '1',
    category: 'Construction',
    amount: 25000,
    description: 'Foundation work - Phase 1 including excavation and concrete pouring',
    vendor: 'ABC Construction Co.',
    status: 'approved',
    created_by: 'John Builder',
    approved_by: 'Admin User',
    created_at: '2025-08-20T10:00:00Z',
    invoice_number: 'INV-2025-001',
    receipt_url: null
  },
  {
    id: '2',
    category: 'Materials',
    amount: 15000,
    description: 'Steel reinforcement bars and cement delivery for foundation work',
    vendor: 'Steel Supply Inc.',
    status: 'pending',
    created_by: 'John Builder',
    approved_by: null,
    created_at: '2025-08-22T14:30:00Z',
    invoice_number: 'INV-2025-002',
    receipt_url: null
  },
  {
    id: '3',
    category: 'Marketing',
    amount: 5000,
    description: 'Digital advertising campaign for Q3 2025 including social media and Google Ads',
    vendor: 'Digital Marketing Pro',
    status: 'approved',
    created_by: 'Marketing Team',
    approved_by: 'Admin User',
    created_at: '2025-08-18T09:15:00Z',
    invoice_number: 'INV-2025-003',
    receipt_url: null
  },
  {
    id: '4',
    category: 'Legal',
    amount: 8000,
    description: 'Property documentation and legal compliance fees',
    vendor: 'Legal Associates LLC',
    status: 'rejected',
    created_by: 'Admin User',
    approved_by: 'Admin User',
    created_at: '2025-08-15T16:45:00Z',
    invoice_number: 'INV-2025-004',
    rejection_reason: 'Incomplete documentation provided',
    receipt_url: null
  },
  {
    id: '5',
    category: 'Utilities',
    amount: 3500,
    description: 'Temporary electrical connection and water supply setup',
    vendor: 'City Utilities Department',
    status: 'pending',
    created_by: 'John Builder',
    approved_by: null,
    created_at: '2025-08-25T11:20:00Z',
    invoice_number: 'INV-2025-005',
    receipt_url: null
  }
]

export function ExpensesDashboard() {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const { t, formatCurrency } = useInternationalization()
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
    vendor: '',
    invoice_number: ''
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'construction': return '🏗️'
      case 'materials': return '🧱'
      case 'marketing': return '📢'
      case 'legal': return '⚖️'
      case 'utilities': return '⚡'
      case 'permits': return '📄'
      default: return '📋'
    }
  }

  const filteredExpenses = expenses.filter(expense => {
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus
    const matchesCategory = filterCategory === 'all' || expense.category.toLowerCase() === filterCategory
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  // Calculate statistics
  const totalExpenses = expenses
    .filter(expense => expense.status === 'approved')
    .reduce((sum, expense) => sum + expense.amount, 0)

  const pendingExpenses = expenses
    .filter(expense => expense.status === 'pending')
    .reduce((sum, expense) => sum + expense.amount, 0)

  const thisMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.created_at)
      const now = new Date()
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear() &&
             expense.status === 'approved'
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  const rejectedExpenses = expenses.filter(expense => expense.status === 'rejected').length

  const handleSubmitExpense = () => {
    const expense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      vendor: newExpense.vendor,
      status: 'pending',
      created_by: user?.name || 'User',
      created_at: new Date().toISOString(),
      invoice_number: newExpense.invoice_number
    }
    
    setExpenses(prev => [expense, ...prev])
    
    // Add notification for approvers
    if (user?.role === 'builder') {
      addNotification({
        title: 'New Expense Submitted',
        message: `${expense.description} for ${formatCurrency(expense.amount)} submitted for approval`,
        type: 'expense_approval',
        data: { expenseId: expense.id }
      })
    }
    
    setShowAddExpense(false)
    setNewExpense({ category: '', amount: '', description: '', vendor: '', invoice_number: '' })
  }

  const handleApproveExpense = (expenseId: string, note?: string) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === expenseId 
        ? { ...expense, status: 'approved' as const, approved_by: user?.name || 'User' }
        : expense
    ))
  }

  const handleRejectExpense = (expenseId: string, reason: string) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === expenseId 
        ? { 
            ...expense, 
            status: 'rejected' as const, 
            approved_by: user?.name || 'User',
            rejection_reason: reason
          }
        : expense
    ))
  }

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense)
    setShowApprovalDialog(true)
  }

  const canApprove = user?.role === 'admin' || user?.role === 'investor' || user?.role === 'super_admin'
  const canAdd = user?.role === 'builder' || user?.role === 'admin' || user?.role === 'super_admin'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('expenses.title')}</h2>
          <p className="text-muted-foreground mt-2">
            {t('expenses.description') || 'Track and approve project expenses with comprehensive maker-checker workflow'}
          </p>
        </div>
        {canAdd && (
          <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                {t('expenses.submitNewExpense') || 'Submit New Expense'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{t('expenses.submitNewExpense') || 'Submit New Expense'}</DialogTitle>
                <DialogDescription>
                  {t('expenses.submitDescription') || 'Submit a new expense for approval through the maker-checker workflow'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newExpense.category} onValueChange={(value) => 
                      setNewExpense(prev => ({ ...prev, category: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">🏗️ Construction</SelectItem>
                        <SelectItem value="materials">🧱 Materials</SelectItem>
                        <SelectItem value="marketing">📢 Marketing</SelectItem>
                        <SelectItem value="legal">⚖️ Legal</SelectItem>
                        <SelectItem value="utilities">⚡ Utilities</SelectItem>
                        <SelectItem value="permits">📄 Permits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor/Supplier *</Label>
                  <Input
                    id="vendor"
                    placeholder="Vendor company name"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, vendor: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <Input
                    id="invoice_number"
                    placeholder="INV-2025-XXX"
                    value={newExpense.invoice_number}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, invoice_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the expense..."
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddExpense(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitExpense}
                    disabled={!newExpense.category || !newExpense.amount || !newExpense.vendor || !newExpense.description}
                  >
                    Submit for Approval
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('expenses.totalApproved') || 'Total Approved'}</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {t('expenses.expensesApproved', { count: expenses.filter(e => e.status === 'approved').length }) || `${expenses.filter(e => e.status === 'approved').length} expenses approved`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('expenses.pendingApproval')}</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(pendingExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {t('expenses.awaitingReview', { count: expenses.filter(e => e.status === 'pending').length }) || `${expenses.filter(e => e.status === 'pending').length} awaiting review`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('expenses.thisMonth') || 'This Month'}</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(thisMonthExpenses)}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              {t('expenses.monthlyChange') || '5% vs last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('expenses.rejected')}</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedExpenses}</div>
            <p className="text-xs text-muted-foreground">
              {t('expenses.requireResubmission') || 'Require resubmission'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Expense Records</CardTitle>
              <CardDescription>Comprehensive expense tracking and approval workflow</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search expenses, vendors, invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="materials">Materials</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="permits">Permits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No expenses found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{formatDate(expense.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <span>{getCategoryIcon(expense.category)}</span>
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate" title={expense.description}>
                        {expense.description}
                      </p>
                      {expense.invoice_number && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {expense.invoice_number}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>{expense.vendor}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(expense.status)} variant="outline">
                        <span className="flex items-center gap-1">
                          {getStatusIcon(expense.status)}
                          {expense.status.toUpperCase()}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>{expense.created_by}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewExpense(expense)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {canApprove && expense.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => {
                                handleApproveExpense(expense.id)
                                addNotification({
                                  title: 'Expense Approved',
                                  message: `${expense.description} has been approved`,
                                  type: 'milestone'
                                })
                              }}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleViewExpense(expense)}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense Approval Dialog */}
      <ExpenseApprovalDialog
        expense={selectedExpense}
        isOpen={showApprovalDialog}
        onClose={() => {
          setShowApprovalDialog(false)
          setSelectedExpense(null)
        }}
        onApprove={handleApproveExpense}
        onReject={handleRejectExpense}
      />
    </div>
  )
}