import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts'
import { 
  Download, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Building2,
  Receipt,
  CreditCard,
  Wallet,
  ArrowUpDown,
  Filter,
  Eye,
  Mail,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useState } from 'react'

// Mock data for charts
const monthlyExpenses = [
  { month: 'Jan', construction: 180000, materials: 45000, marketing: 15000, total: 240000 },
  { month: 'Feb', construction: 220000, materials: 60000, marketing: 20000, total: 300000 },
  { month: 'Mar', construction: 190000, materials: 38000, marketing: 12000, total: 240000 },
  { month: 'Apr', construction: 280000, materials: 75000, marketing: 25000, total: 380000 },
  { month: 'May', construction: 320000, materials: 80000, marketing: 30000, total: 430000 },
  { month: 'Jun', construction: 250000, materials: 55000, marketing: 18000, total: 323000 },
  { month: 'Jul', construction: 310000, materials: 70000, marketing: 22000, total: 402000 },
  { month: 'Aug', construction: 180000, materials: 42000, marketing: 16000, total: 238000 }
]

const expenseByCategory = [
  { name: 'Construction', value: 1930000, color: '#8884d8' },
  { name: 'Materials', value: 465000, color: '#82ca9d' },
  { name: 'Marketing', value: 158000, color: '#ffc658' },
  { name: 'Legal', value: 95000, color: '#ff7300' },
  { name: 'Utilities', value: 68000, color: '#0088fe' }
]

const salesTrend = [
  { month: 'Jan', units: 2, revenue: 950000 },
  { month: 'Feb', units: 3, revenue: 1420000 },
  { month: 'Mar', units: 1, revenue: 480000 },
  { month: 'Apr', units: 4, revenue: 1890000 },
  { month: 'May', units: 3, revenue: 1350000 },
  { month: 'Jun', units: 2, revenue: 920000 },
  { month: 'Jul', units: 1, revenue: 520000 },
  { month: 'Aug', units: 2, revenue: 970000 }
]

// Cash Flow Data
const cashFlowData = [
  { 
    month: 'Jan',
    cashInflow: 950000,
    cashOutflow: 240000,
    netCashFlow: 710000,
    operatingCashFlow: 850000,
    investmentCashFlow: -150000,
    financingCashFlow: 50000
  },
  { 
    month: 'Feb',
    cashInflow: 1420000,
    cashOutflow: 300000,
    netCashFlow: 1120000,
    operatingCashFlow: 1320000,
    investmentCashFlow: -200000,
    financingCashFlow: 0
  },
  { 
    month: 'Mar',
    cashInflow: 480000,
    cashOutflow: 240000,
    netCashFlow: 240000,
    operatingCashFlow: 380000,
    investmentCashFlow: -100000,
    financingCashFlow: -40000
  },
  { 
    month: 'Apr',
    cashInflow: 1890000,
    cashOutflow: 380000,
    netCashFlow: 1510000,
    operatingCashFlow: 1690000,
    investmentCashFlow: -180000,
    financingCashFlow: 0
  },
  { 
    month: 'May',
    cashInflow: 1350000,
    cashOutflow: 430000,
    netCashFlow: 920000,
    operatingCashFlow: 1150000,
    investmentCashFlow: -230000,
    financingCashFlow: 0
  },
  { 
    month: 'Jun',
    cashInflow: 920000,
    cashOutflow: 323000,
    netCashFlow: 597000,
    operatingCashFlow: 720000,
    investmentCashFlow: -123000,
    financingCashFlow: 0
  },
  { 
    month: 'Jul',
    cashInflow: 520000,
    cashOutflow: 402000,
    netCashFlow: 118000,
    operatingCashFlow: 420000,
    investmentCashFlow: -302000,
    financingCashFlow: 0
  },
  { 
    month: 'Aug',
    cashInflow: 970000,
    cashOutflow: 238000,
    netCashFlow: 732000,
    operatingCashFlow: 870000,
    investmentCashFlow: -138000,
    financingCashFlow: 0
  }
]

// Account Receivables Data
const accountReceivables = [
  {
    id: 'INV-001',
    customer: 'Horizon Properties LLC',
    invoiceNumber: 'HZN-2025-001',
    issueDate: '2025-01-15',
    dueDate: '2025-02-14',
    amount: 475000,
    status: 'overdue',
    daysPastDue: 15,
    contact: 'john@horizonprops.com',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 'INV-002',
    customer: 'Metro Development Group',
    invoiceNumber: 'MDG-2025-002',
    issueDate: '2025-02-01',
    dueDate: '2025-03-03',
    amount: 890000,
    status: 'pending',
    daysPastDue: 0,
    contact: 'sarah@metrodev.com',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 'INV-003',
    customer: 'Coastal Investments Inc',
    invoiceNumber: 'CST-2025-003',
    issueDate: '2025-02-15',
    dueDate: '2025-03-17',
    amount: 650000,
    status: 'paid',
    daysPastDue: 0,
    contact: 'mike@coastal.com',
    phone: '+1 (555) 345-6789'
  },
  {
    id: 'INV-004',
    customer: 'Urban Heights Partners',
    invoiceNumber: 'UHP-2025-004',
    issueDate: '2025-03-01',
    dueDate: '2025-04-01',
    amount: 725000,
    status: 'pending',
    daysPastDue: 0,
    contact: 'emily@urbanheights.com',
    phone: '+1 (555) 456-7890'
  },
  {
    id: 'INV-005',
    customer: 'Skyline Developers',
    invoiceNumber: 'SKY-2025-005',
    issueDate: '2025-03-15',
    dueDate: '2025-04-15',
    amount: 450000,
    status: 'overdue',
    daysPastDue: 8,
    contact: 'david@skylinedev.com',
    phone: '+1 (555) 567-8901'
  }
]

// Account Payables Data
const accountPayables = [
  {
    id: 'BILL-001',
    vendor: 'Premier Construction Co.',
    billNumber: 'PC-2025-001',
    issueDate: '2025-01-20',
    dueDate: '2025-02-19',
    amount: 285000,
    status: 'overdue',
    daysPastDue: 10,
    category: 'Construction',
    contact: 'billing@premierconstruction.com',
    phone: '+1 (555) 678-9012'
  },
  {
    id: 'BILL-002',
    vendor: 'BuildMart Supplies',
    billNumber: 'BMS-2025-002',
    issueDate: '2025-02-05',
    dueDate: '2025-03-07',
    amount: 45000,
    status: 'pending',
    daysPastDue: 0,
    category: 'Materials',
    contact: 'accounts@buildmart.com',
    phone: '+1 (555) 789-0123'
  },
  {
    id: 'BILL-003',
    vendor: 'Legal Associates LLC',
    billNumber: 'LA-2025-003',
    issueDate: '2025-02-10',
    dueDate: '2025-03-12',
    amount: 15000,
    status: 'paid',
    daysPastDue: 0,
    category: 'Legal',
    contact: 'billing@legalassociates.com',
    phone: '+1 (555) 890-1234'
  },
  {
    id: 'BILL-004',
    vendor: 'Marketing Pro Agency',
    billNumber: 'MPA-2025-004',
    issueDate: '2025-03-01',
    dueDate: '2025-04-01',
    amount: 22000,
    status: 'pending',
    daysPastDue: 0,
    category: 'Marketing',
    contact: 'invoices@marketingpro.com',
    phone: '+1 (555) 901-2345'
  },
  {
    id: 'BILL-005',
    vendor: 'Steel Solutions Inc',
    billNumber: 'SSI-2025-005',
    issueDate: '2025-03-10',
    dueDate: '2025-04-10',
    amount: 125000,
    status: 'approved',
    daysPastDue: 0,
    category: 'Materials',
    contact: 'payment@steelsolutions.com',
    phone: '+1 (555) 012-3456'
  }
]

export function ReportsDashboard() {
  const [reportType, setReportType] = useState('monthly')
  const [selectedPeriod, setSelectedPeriod] = useState('2025')
  const [activeTab, setActiveTab] = useState('overview')
  const [receivablesFilter, setReceivablesFilter] = useState('all')
  const [payablesFilter, setPayablesFilter] = useState('all')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleExportReport = (type: string) => {
    // In real app, this would generate and download the report
    console.log('Exporting report:', type)
  }

  const getStatusBadge = (status: string, daysPastDue?: number) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>
      case 'overdue':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Overdue ({daysPastDue} days)</Badge>
      case 'pending':
        return <Badge variant="outline" className="text-blue-600 border-blue-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Filter functions
  const filteredReceivables = accountReceivables.filter(item => {
    if (receivablesFilter === 'all') return true
    return item.status === receivablesFilter
  })

  const filteredPayables = accountPayables.filter(item => {
    if (payablesFilter === 'all') return true
    return item.status === payablesFilter
  })

  // Summary calculations
  const receivablesSummary = {
    total: accountReceivables.reduce((sum, item) => sum + item.amount, 0),
    overdue: accountReceivables.filter(item => item.status === 'overdue').reduce((sum, item) => sum + item.amount, 0),
    pending: accountReceivables.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0),
    paid: accountReceivables.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0)
  }

  const payablesSummary = {
    total: accountPayables.reduce((sum, item) => sum + item.amount, 0),
    overdue: accountPayables.filter(item => item.status === 'overdue').reduce((sum, item) => sum + item.amount, 0),
    pending: accountPayables.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0),
    paid: accountPayables.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0)
  }

  const cashFlowSummary = {
    totalInflow: cashFlowData.reduce((sum, item) => sum + item.cashInflow, 0),
    totalOutflow: cashFlowData.reduce((sum, item) => sum + item.cashOutflow, 0),
    netCashFlow: cashFlowData.reduce((sum, item) => sum + item.netCashFlow, 0),
    avgMonthlyFlow: cashFlowData.reduce((sum, item) => sum + item.netCashFlow, 0) / cashFlowData.length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Accounting Reports</h2>
          <p className="text-muted-foreground">
            Comprehensive financial reports and accounting insights
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="q4-2024">Q4 2024</SelectItem>
              <SelectItem value="q3-2024">Q3 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="receivables">Receivables</TabsTrigger>
          <TabsTrigger value="payables">Payables</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Project Value</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$5.0M</div>
                <p className="text-xs text-muted-foreground">Budget allocated</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(cashFlowSummary.netCashFlow)}</div>
                <p className="text-xs text-green-600">Positive flow trend</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Receivables</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(receivablesSummary.pending + receivablesSummary.overdue)}</div>
                <p className="text-xs text-orange-600">{formatCurrency(receivablesSummary.overdue)} overdue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Payables</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(payablesSummary.pending + payablesSummary.overdue)}</div>
                <p className="text-xs text-red-600">{formatCurrency(payablesSummary.overdue)} overdue</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses Breakdown</CardTitle>
                <CardDescription>
                  Expense trends by category over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyExpenses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value/1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="construction" stackId="a" fill="#8884d8" />
                    <Bar dataKey="materials" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="marketing" stackId="a" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accounting Summary</CardTitle>
                <CardDescription>
                  Key accounting metrics overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-800">Total Receivables</p>
                      <p className="text-lg font-bold text-green-900">{formatCurrency(receivablesSummary.total)}</p>
                    </div>
                    <Receipt className="h-8 w-8 text-green-600" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-red-800">Total Payables</p>
                      <p className="text-lg font-bold text-red-900">{formatCurrency(payablesSummary.total)}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-red-600" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Net Working Capital</p>
                      <p className="text-lg font-bold text-blue-900">{formatCurrency(receivablesSummary.total - payablesSummary.total)}</p>
                    </div>
                    <Wallet className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>
                Unit sales and revenue trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value/1000000}M`} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value as number) : value,
                      name === 'revenue' ? 'Revenue' : 'Units Sold'
                    ]}
                  />
                  <Bar yAxisId="left" dataKey="units" fill="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Report Generation */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Cash Flow Report
                </CardTitle>
                <CardDescription>
                  Detailed cash inflows and outflows analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last generated:</span>
                    <span className="text-muted-foreground">Aug 25, 2025</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleExportReport('cashflow')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Receivables Report
                </CardTitle>
                <CardDescription>
                  Outstanding invoices and collection status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last generated:</span>
                    <span className="text-muted-foreground">Aug 24, 2025</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleExportReport('receivables')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payables Report
                </CardTitle>
                <CardDescription>
                  Outstanding bills and payment schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last generated:</span>
                    <span className="text-muted-foreground">Aug 22, 2025</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleExportReport('payables')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Key Accounting Indicators</CardTitle>
              <CardDescription>Critical financial metrics and ratios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Days Sales Outstanding</div>
                  <div className="text-2xl font-bold">32 days</div>
                  <Badge variant="outline" className="text-green-600">Excellent</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Days Payable Outstanding</div>
                  <div className="text-2xl font-bold">28 days</div>
                  <Badge variant="outline" className="text-blue-600">Good</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Current Ratio</div>
                  <div className="text-2xl font-bold">2.1x</div>
                  <Badge variant="outline" className="text-green-600">Healthy</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Working Capital</div>
                  <div className="text-2xl font-bold">{formatCurrency((receivablesSummary.total - payablesSummary.total)/1000000)}M</div>
                  <Badge variant="outline" className="text-green-600">Strong</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          {/* Cash Flow Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cash Inflow</CardTitle>
                <ArrowUpDown className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(cashFlowSummary.totalInflow)}</div>
                <p className="text-xs text-muted-foreground">8 months YTD</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cash Outflow</CardTitle>
                <ArrowUpDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(cashFlowSummary.totalOutflow)}</div>
                <p className="text-xs text-muted-foreground">8 months YTD</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                <Wallet className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(cashFlowSummary.netCashFlow)}</div>
                <p className="text-xs text-green-600">Positive trend</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Monthly Flow</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(cashFlowSummary.avgMonthlyFlow)}</div>
                <p className="text-xs text-muted-foreground">Monthly average</p>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>Monthly cash inflows vs outflows with net position</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value/1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="cashInflow" fill="#10b981" name="Cash Inflow" />
                  <Bar dataKey="cashOutflow" fill="#ef4444" name="Cash Outflow" />
                  <Line type="monotone" dataKey="netCashFlow" stroke="#3b82f6" strokeWidth={3} name="Net Cash Flow" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cash Flow Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Categories</CardTitle>
              <CardDescription>Breakdown by operating, investing, and financing activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value/1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Area type="monotone" dataKey="operatingCashFlow" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="investmentCashFlow" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="financingCashFlow" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receivables" className="space-y-6">
          {/* Receivables Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Receivables</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(receivablesSummary.total)}</div>
                <p className="text-xs text-muted-foreground">{accountReceivables.length} invoices</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(receivablesSummary.overdue)}</div>
                <p className="text-xs text-red-600">{accountReceivables.filter(r => r.status === 'overdue').length} overdue invoices</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Collection</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(receivablesSummary.pending)}</div>
                <p className="text-xs text-orange-600">{accountReceivables.filter(r => r.status === 'pending').length} pending invoices</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collected Amount</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(receivablesSummary.paid)}</div>
                <p className="text-xs text-green-600">{accountReceivables.filter(r => r.status === 'paid').length} paid invoices</p>
              </CardContent>
            </Card>
          </div>

          {/* Receivables Filter and Actions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Account Receivables</CardTitle>
                  <CardDescription>Outstanding customer invoices and payment status</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select value={receivablesFilter} onValueChange={setReceivablesFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceivables.map((receivable) => (
                    <TableRow key={receivable.id}>
                      <TableCell className="font-medium">{receivable.customer}</TableCell>
                      <TableCell>{receivable.invoiceNumber}</TableCell>
                      <TableCell>{formatDate(receivable.issueDate)}</TableCell>
                      <TableCell>{formatDate(receivable.dueDate)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(receivable.amount)}</TableCell>
                      <TableCell>{getStatusBadge(receivable.status, receivable.daysPastDue)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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

        <TabsContent value="payables" className="space-y-6">
          {/* Payables Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payables</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(payablesSummary.total)}</div>
                <p className="text-xs text-muted-foreground">{accountPayables.length} bills</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(payablesSummary.overdue)}</div>
                <p className="text-xs text-red-600">{accountPayables.filter(p => p.status === 'overdue').length} overdue bills</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(payablesSummary.pending)}</div>
                <p className="text-xs text-orange-600">{accountPayables.filter(p => p.status === 'pending').length} pending bills</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(payablesSummary.paid)}</div>
                <p className="text-xs text-green-600">{accountPayables.filter(p => p.status === 'paid').length} paid bills</p>
              </CardContent>
            </Card>
          </div>

          {/* Payables Filter and Actions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Account Payables</CardTitle>
                  <CardDescription>Outstanding vendor bills and payment schedules</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select value={payablesFilter} onValueChange={setPayablesFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Bill #</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayables.map((payable) => (
                    <TableRow key={payable.id}>
                      <TableCell className="font-medium">{payable.vendor}</TableCell>
                      <TableCell>{payable.billNumber}</TableCell>
                      <TableCell>{formatDate(payable.issueDate)}</TableCell>
                      <TableCell>{formatDate(payable.dueDate)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(payable.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{payable.category}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(payable.status, payable.daysPastDue)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
      </Tabs>
    </div>
  )
}