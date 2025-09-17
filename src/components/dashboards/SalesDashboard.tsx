import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Progress } from '../ui/progress'
import { 
  Plus, 
  TrendingUp, 
  Building2, 
  Users, 
  DollarSign,
  Phone,
  Mail,
  Calendar
} from 'lucide-react'
import { useAuth } from '../AuthProvider'
import { useInternationalization } from '../providers/InternationalizationProvider'

// Mock sales data
const mockSales = [
  {
    id: '1',
    unit_number: 'A-101',
    customer_name: 'John Smith',
    customer_email: 'john.smith@email.com',
    customer_phone: '+1-555-0123',
    total_amount: 450000,
    down_payment: 90000,
    status: 'booked',
    agent_id: 'agent1',
    agent_name: 'Sarah Wilson',
    commission_rate: 5,
    created_at: '2025-08-15'
  },
  {
    id: '2',
    unit_number: 'B-205',
    customer_name: 'Emily Johnson',
    customer_email: 'emily.j@email.com',
    customer_phone: '+1-555-0124',
    total_amount: 520000,
    down_payment: 104000,
    status: 'booked',
    agent_id: 'agent2',
    agent_name: 'Mike Chen',
    commission_rate: 5,
    created_at: '2025-08-18'
  },
  {
    id: '3',
    unit_number: 'C-310',
    customer_name: 'Robert Davis',
    customer_email: 'r.davis@email.com',
    customer_phone: '+1-555-0125',
    total_amount: 380000,
    down_payment: 76000,
    status: 'pending',
    agent_id: 'agent1',
    agent_name: 'Sarah Wilson',
    commission_rate: 5,
    created_at: '2025-08-22'
  }
]

const mockInventory = {
  total_units: 50,
  available: 32,
  booked: 15,
  sold: 3
}

export function SalesDashboard() {
  const { user } = useAuth()
  const { t, formatCurrency } = useInternationalization()
  const [showAddSale, setShowAddSale] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [newSale, setNewSale] = useState({
    unit_number: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    total_amount: '',
    down_payment: ''
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'booked': return t('sales.booked') || 'Booked'
      case 'pending': return t('sales.pending') || 'Pending'
      case 'completed': return t('sales.completed') || 'Completed'
      default: return status
    }
  }

  const filteredSales = filterStatus === 'all' 
    ? mockSales 
    : mockSales.filter(sale => sale.status === filterStatus)

  const totalRevenue = mockSales
    .filter(sale => sale.status === 'booked')
    .reduce((sum, sale) => sum + sale.down_payment, 0)

  const totalCommissions = mockSales
    .filter(sale => sale.status === 'booked')
    .reduce((sum, sale) => sum + (sale.down_payment * sale.commission_rate / 100), 0)

  const salesProgress = (mockInventory.booked / mockInventory.total_units) * 100

  const handleSubmitSale = () => {
    // In real app, this would submit to Supabase
    console.log('Submitting sale:', newSale)
    setShowAddSale(false)
    setNewSale({
      unit_number: '',
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      total_amount: '',
      down_payment: ''
    })
  }

  const canAdd = user?.role === 'marketing' || user?.role === 'admin'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('sales.title')}</h2>
          <p className="text-muted-foreground">
            {t('sales.description') || 'Track unit bookings, customer payments, and sales performance'}
          </p>
        </div>
        {canAdd && (
          <Dialog open={showAddSale} onOpenChange={setShowAddSale}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('sales.addBooking') || 'Add Booking'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('sales.newBooking') || 'New Unit Booking'}</DialogTitle>
                <DialogDescription>
                  {t('sales.newBookingDescription') || 'Record a new customer booking'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">{t('sales.unitNumber') || 'Unit Number'}</Label>
                  <Input
                    id="unit"
                    placeholder={t('sales.unitPlaceholder') || 'e.g., A-101'}
                    value={newSale.unit_number}
                    onChange={(e) => setNewSale(prev => ({ ...prev, unit_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">{t('sales.customerName') || 'Customer Name'}</Label>
                  <Input
                    id="customer"
                    placeholder={t('sales.customerPlaceholder') || 'Full name'}
                    value={newSale.customer_name}
                    onChange={(e) => setNewSale(prev => ({ ...prev, customer_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('sales.emailPlaceholder') || 'customer@email.com'}
                    value={newSale.customer_email}
                    onChange={(e) => setNewSale(prev => ({ ...prev, customer_email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('sales.phone') || 'Phone'}</Label>
                  <Input
                    id="phone"
                    placeholder={t('sales.phonePlaceholder') || '+1-555-0123'}
                    value={newSale.customer_phone}
                    onChange={(e) => setNewSale(prev => ({ ...prev, customer_phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">{t('sales.totalAmount') || 'Total Amount'}</Label>
                  <Input
                    id="total"
                    type="number"
                    placeholder="450000"
                    value={newSale.total_amount}
                    onChange={(e) => setNewSale(prev => ({ ...prev, total_amount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="down">{t('sales.downPayment') || 'Down Payment'}</Label>
                  <Input
                    id="down"
                    type="number"
                    placeholder="90000"
                    value={newSale.down_payment}
                    onChange={(e) => setNewSale(prev => ({ ...prev, down_payment: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddSale(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={handleSubmitSale}>
                    {t('sales.createBooking') || 'Create Booking'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('overview.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-green-600">
              {t('sales.monthlyGrowth') || '+15% from last month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('sales.unitsBooked') || 'Units Booked'}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockInventory.booked}</div>
            <p className="text-xs text-muted-foreground">
              {t('sales.ofTotalUnits', { booked: mockInventory.booked, total: mockInventory.total_units }) || `of ${mockInventory.total_units} total units`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('nav.commissions')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommissions)}</div>
            <p className="text-xs text-green-600">
              {t('sales.commissionRate') || '5% commission rate'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('sales.activeCustomers') || 'Active Customers'}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSales.length + 8}</div>
            <p className="text-xs text-green-600">
              {t('sales.weeklyGrowth') || '+3 this week'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Progress */}
      <Card>
        <CardHeader>
          <CardTitle>{t('sales.progress') || 'Sales Progress'}</CardTitle>
          <CardDescription>
            {t('sales.progressDescription') || 'Unit booking progress for current project'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{t('sales.unitsBooked') || 'Units Booked'}</span>
              <span>{mockInventory.booked} / {mockInventory.total_units}</span>
            </div>
            <Progress value={salesProgress} className="w-full" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{mockInventory.booked}</div>
                <div className="text-sm text-muted-foreground">{t('sales.booked') || 'Booked'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{mockInventory.sold}</div>
                <div className="text-sm text-muted-foreground">{t('sales.sold') || 'Sold'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{mockInventory.available}</div>
                <div className="text-sm text-muted-foreground">{t('sales.available') || 'Available'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t('sales.records') || 'Sales Records'}</CardTitle>
              <CardDescription>{t('sales.recordsDescription') || 'Customer bookings and payment status'}</CardDescription>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('sales.allStatus') || 'All Status'}</SelectItem>
                <SelectItem value="pending">{t('sales.pending') || 'Pending'}</SelectItem>
                <SelectItem value="booked">{t('sales.booked') || 'Booked'}</SelectItem>
                <SelectItem value="completed">{t('sales.completed') || 'Completed'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('sales.unit') || 'Unit'}</TableHead>
                <TableHead>{t('sales.customer') || 'Customer'}</TableHead>
                <TableHead>{t('sales.contact') || 'Contact'}</TableHead>
                <TableHead>{t('sales.totalAmount') || 'Total Amount'}</TableHead>
                <TableHead>{t('sales.downPayment') || 'Down Payment'}</TableHead>
                <TableHead>{t('sales.agent') || 'Agent'}</TableHead>
                <TableHead>{t('sales.status') || 'Status'}</TableHead>
                <TableHead>{t('sales.date') || 'Date'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <Badge variant="outline">{sale.unit_number}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.customer_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {sale.customer_email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {sale.customer_phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(sale.total_amount)}</TableCell>
                  <TableCell>{formatCurrency(sale.down_payment)}</TableCell>
                  <TableCell>{sale.agent_name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sale.status)}>
                      {getStatusLabel(sale.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {sale.created_at}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}