import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { FileText, Download, Filter, Calendar as CalendarIcon, TrendingUp, TrendingDown, DollarSign, Users, Building2, User } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface AccountStatement {
  id: string
  date: string
  description: string
  reference: string
  debit: number
  credit: number
  balance: number
  type: 'booking' | 'payment' | 'commission' | 'expense' | 'investment' | 'dividend'
}

interface EntitySummary {
  entity_type: 'unit' | 'customer' | 'agent' | 'investor'
  entity_name: string
  entity_id: string
  total_transactions: number
  total_debit: number
  total_credit: number
  current_balance: number
  last_transaction_date: string
}

export function AccountStatementsDashboard() {
  const [activeTab, setActiveTab] = useState('units')
  const [selectedEntity, setSelectedEntity] = useState<string>('')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  
  // Mock data for different entity types
  const mockUnitStatements: AccountStatement[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Booking Amount - A101',
      reference: 'BK-001',
      debit: 0,
      credit: 550000,
      balance: 550000,
      type: 'booking'
    },
    {
      id: '2',
      date: '2024-02-15',
      description: 'Registration Payment - A101',
      reference: 'RG-001',
      debit: 0,
      credit: 269500,
      balance: 819500,
      type: 'payment'
    },
    {
      id: '3',
      date: '2024-02-20',
      description: 'Sales Commission - A101',
      reference: 'CM-001',
      debit: 27500,
      credit: 0,
      balance: 792000,
      type: 'commission'
    }
  ]

  const mockCustomerStatements: AccountStatement[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Booking Payment Made',
      reference: 'PAY-001',
      debit: 550000,
      credit: 0,
      balance: -550000,
      type: 'payment'
    },
    {
      id: '2',
      date: '2024-02-15',
      description: 'Registration Payment Made',
      reference: 'PAY-002',
      debit: 269500,
      credit: 0,
      balance: -819500,
      type: 'payment'
    }
  ]

  const mockAgentStatements: AccountStatement[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Commission - A101 Booking',
      reference: 'CM-001',
      debit: 0,
      credit: 27500,
      balance: 27500,
      type: 'commission'
    },
    {
      id: '2',
      date: '2024-02-15',
      description: 'Commission - B205 Booking',
      reference: 'CM-002',
      debit: 0,
      credit: 35500,
      balance: 63000,
      type: 'commission'
    }
  ]

  const mockInvestorStatements: AccountStatement[] = [
    {
      id: '1',
      date: '2024-01-01',
      description: 'Initial Investment',
      reference: 'INV-001',
      debit: 10000000,
      credit: 0,
      balance: -10000000,
      type: 'investment'
    },
    {
      id: '2',
      date: '2024-01-31',
      description: 'Monthly Dividend',
      reference: 'DIV-001',
      debit: 0,
      credit: 83333,
      balance: -9916667,
      type: 'dividend'
    }
  ]

  const mockEntitySummaries: EntitySummary[] = [
    {
      entity_type: 'unit',
      entity_name: '2BHK Premium - A101',
      entity_id: 'A101',
      total_transactions: 15,
      total_debit: 125000,
      total_credit: 2750000,
      current_balance: 2625000,
      last_transaction_date: '2024-01-20'
    },
    {
      entity_type: 'customer',
      entity_name: 'Rajesh Kumar',
      entity_id: 'CUST-001',
      total_transactions: 8,
      total_debit: 2750000,
      total_credit: 0,
      current_balance: -2750000,
      last_transaction_date: '2024-01-20'
    },
    {
      entity_type: 'agent',
      entity_name: 'Priya Sharma',
      entity_id: 'AGT-001',
      total_transactions: 12,
      total_debit: 0,
      total_credit: 137500,
      current_balance: 137500,
      last_transaction_date: '2024-01-20'
    },
    {
      entity_type: 'investor',
      entity_name: 'Amit Investments Ltd.',
      entity_id: 'INV-001',
      total_transactions: 24,
      total_debit: 10000000,
      total_credit: 250000,
      current_balance: -9750000,
      last_transaction_date: '2024-01-20'
    }
  ]

  const getStatementsForTab = () => {
    switch (activeTab) {
      case 'units':
        return mockUnitStatements
      case 'customers':
        return mockCustomerStatements
      case 'agents':
        return mockAgentStatements
      case 'investors':
        return mockInvestorStatements
      default:
        return mockUnitStatements
    }
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'units':
        return Building2
      case 'customers':
        return Users
      case 'agents':
        return User
      case 'investors':
        return DollarSign
      default:
        return FileText
    }
  }

  const generateStatement = (entityType: string, entityId: string) => {
    toast.success("Statement generated successfully!", {
      description: `${entityType} statement has been generated and downloaded.`
    })
  }

  const StatementTable = ({ statements }: { statements: AccountStatement[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Debit</TableHead>
          <TableHead>Credit</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {statements.map((statement) => (
          <TableRow key={statement.id}>
            <TableCell>{statement.date}</TableCell>
            <TableCell>{statement.description}</TableCell>
            <TableCell className="font-medium">{statement.reference}</TableCell>
            <TableCell className={statement.debit > 0 ? 'text-red-600 font-medium' : ''}>
              {statement.debit > 0 ? `₨${statement.debit.toLocaleString()}` : '-'}
            </TableCell>
            <TableCell className={statement.credit > 0 ? 'text-green-600 font-medium' : ''}>
              {statement.credit > 0 ? `₨${statement.credit.toLocaleString()}` : '-'}
            </TableCell>
            <TableCell className={`font-medium ${statement.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₨{Math.abs(statement.balance).toLocaleString()}
              {statement.balance < 0 ? ' (Dr)' : ' (Cr)'}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {statement.type}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Statements & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive financial statements for all entities
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {mockEntitySummaries.map((summary) => {
          const Icon = getEntityIcon(summary.entity_type)
          return (
            <Card key={summary.entity_id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="h-8 w-8 text-primary" />
                  <Badge variant="secondary" className="text-xs">
                    {summary.entity_type}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-sm">{summary.entity_name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{summary.entity_id}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Transactions:</span>
                      <span className="font-medium">{summary.total_transactions}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Balance:</span>
                      <span className={`font-medium ${summary.current_balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₨{Math.abs(summary.current_balance).toLocaleString()}
                        {summary.current_balance < 0 ? ' (Dr)' : ' (Cr)'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="units">Units</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="agents">Sales Agents</SelectItem>
                  <SelectItem value="investors">Investors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Specific Entity</Label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {activeTab === 'units' && (
                    <>
                      <SelectItem value="A101">2BHK Premium - A101</SelectItem>
                      <SelectItem value="B205">3BHK Deluxe - B205</SelectItem>
                    </>
                  )}
                  {activeTab === 'customers' && (
                    <>
                      <SelectItem value="CUST-001">Rajesh Kumar</SelectItem>
                      <SelectItem value="CUST-002">Anita Verma</SelectItem>
                    </>
                  )}
                  {activeTab === 'agents' && (
                    <>
                      <SelectItem value="AGT-001">Priya Sharma</SelectItem>
                      <SelectItem value="AGT-002">Rohit Patel</SelectItem>
                    </>
                  )}
                  {activeTab === 'investors' && (
                    <>
                      <SelectItem value="INV-001">Amit Investments Ltd.</SelectItem>
                      <SelectItem value="INV-002">Shah Properties</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input 
                type="date" 
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input 
                type="date" 
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statements */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="units">
            <Building2 className="h-4 w-4 mr-2" />
            Units
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="h-4 w-4 mr-2" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="agents">
            <User className="h-4 w-4 mr-2" />
            Sales Agents
          </TabsTrigger>
          <TabsTrigger value="investors">
            <DollarSign className="h-4 w-4 mr-2" />
            Investors
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="capitalize">{activeTab} Account Statements</CardTitle>
                <Button onClick={() => generateStatement(activeTab, selectedEntity || 'all')}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Statement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <StatementTable statements={getStatementsForTab()} />
            </CardContent>
          </Card>

          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₨{getStatementsForTab().reduce((sum, s) => sum + s.credit, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Debits</p>
                    <p className="text-2xl font-bold text-red-600">
                      ₨{getStatementsForTab().reduce((sum, s) => sum + s.debit, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Balance</p>
                    <p className={`text-2xl font-bold ${
                      getStatementsForTab().length > 0 && 
                      getStatementsForTab()[getStatementsForTab().length - 1].balance < 0 
                        ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ₨{getStatementsForTab().length > 0
                        ? Math.abs(getStatementsForTab()[getStatementsForTab().length - 1].balance).toLocaleString()
                        : '0'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}