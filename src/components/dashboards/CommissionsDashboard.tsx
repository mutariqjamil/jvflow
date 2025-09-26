import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Progress } from '../ui/progress'
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Calendar,
  User
} from 'lucide-react'
import { useInternationalization } from '../providers/InternationalizationProvider'

// Mock commission data
const mockCommissions = [
  {
    id: '1',
    agent_name: 'Sarah Wilson',
    sale_date: '2025-08-15',
    unit_number: 'A-101',
    customer_name: 'John Smith',
    sale_amount: 450000,
    commission_rate: 5,
    commission_amount: 4500, // 5% of down payment (90k)
    status: 'paid',
    paid_date: '2025-08-20'
  },
  {
    id: '2',
    agent_name: 'Mike Chen',
    sale_date: '2025-08-18',
    unit_number: 'B-205',
    customer_name: 'Emily Johnson',
    sale_amount: 520000,
    commission_rate: 5,
    commission_amount: 5200,
    status: 'paid',
    paid_date: '2025-08-22'
  },
  {
    id: '3',
    agent_name: 'Sarah Wilson',
    sale_date: '2025-08-22',
    unit_number: 'C-310',
    customer_name: 'Robert Davis',
    sale_amount: 380000,
    commission_rate: 5,
    commission_amount: 1900, // Pending - down payment not yet received
    status: 'pending',
    paid_date: null
  },
  {
    id: '4',
    agent_name: 'Lisa Rodriguez',
    sale_date: '2025-08-10',
    unit_number: 'A-205',
    customer_name: 'Michael Brown',
    sale_amount: 480000,
    commission_rate: 5,
    commission_amount: 2400,
    status: 'paid',
    paid_date: '2025-08-15'
  }
]

const agentSummary = [
  {
    agent: 'Sarah Wilson',
    units_sold: 3,
    total_commission: 8800,
    pending_commission: 1900,
    this_month: 6900
  },
  {
    agent: 'Mike Chen',
    units_sold: 2,
    total_commission: 7200,
    pending_commission: 0,
    this_month: 5200
  },
  {
    agent: 'Lisa Rodriguez',
    units_sold: 1,
    total_commission: 2400,
    pending_commission: 0,
    this_month: 2400
  }
]

export function CommissionsDashboard() {
  const { t, formatCurrency } = useInternationalization()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const totalCommissionsPaid = mockCommissions
    .filter(commission => commission.status === 'paid')
    .reduce((sum, commission) => sum + commission.commission_amount, 0)

  const totalCommissionsPending = mockCommissions
    .filter(commission => commission.status === 'pending')
    .reduce((sum, commission) => sum + commission.commission_amount, 0)

  const thisMonthCommissions = mockCommissions
    .filter(commission => {
      const saleDate = new Date(commission.sale_date)
      const currentMonth = new Date().getMonth()
      return saleDate.getMonth() === currentMonth && commission.status === 'paid'
    })
    .reduce((sum, commission) => sum + commission.commission_amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('commissions.title')}</h2>
        <p className="text-muted-foreground">
          {t('commissions.description')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('commissions.totalPaid')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommissionsPaid)}</div>
            <p className="text-xs text-green-600">
              {mockCommissions.filter(c => c.status === 'paid').length} {t('commissions.payments')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('commissions.pending')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommissionsPending)}</div>
            <p className="text-xs text-orange-600">
              {mockCommissions.filter(c => c.status === 'pending').length} {t('commissions.awaitingPayment')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('commissions.thisMonth')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(thisMonthCommissions)}</div>
            <p className="text-xs text-green-600">
              {t('commissions.monthlyGrowthPercent')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('commissions.averageRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.0%</div>
            <p className="text-xs text-muted-foreground">
              {t('commissions.standardRate')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle>{t('commissions.agentPerformance')}</CardTitle>
          <CardDescription>
            {t('commissions.agentPerformanceDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentSummary.map((agent, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{agent.agent}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">{t('commissions.unitsSold')}</div>
                      <div className="font-medium">{agent.units_sold}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t('commissions.totalCommission')}</div>
                      <div className="font-medium">{formatCurrency(agent.total_commission)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t('commissions.pending')}</div>
                      <div className="font-medium text-orange-600">{formatCurrency(agent.pending_commission)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t('commissions.thisMonth')}</div>
                      <div className="font-medium text-green-600">{formatCurrency(agent.this_month)}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{t('commissions.performance')}</div>
                  <Progress value={(agent.units_sold / 5) * 100} className="w-20 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission Records */}
      <Card>
        <CardHeader>
          <CardTitle>{t('commissions.commissionRecords')}</CardTitle>
          <CardDescription>{t('commissions.commissionRecordsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('commissions.agent')}</TableHead>
                <TableHead>{t('commissions.saleDate')}</TableHead>
                <TableHead>{t('bookings.unit')}</TableHead>
                <TableHead>{t('commissions.customer')}</TableHead>
                <TableHead>{t('commissions.saleAmount')}</TableHead>
                <TableHead>{t('commissions.commission')}</TableHead>
                <TableHead>{t('bookings.status')}</TableHead>
                <TableHead>{t('commissions.paidDate')}</TableHead>
                <TableHead>{t('bookings.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCommissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {commission.agent_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {commission.sale_date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{commission.unit_number}</Badge>
                  </TableCell>
                  <TableCell>{commission.customer_name}</TableCell>
                  <TableCell>{formatCurrency(commission.sale_amount)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatCurrency(commission.commission_amount)}</div>
                      <div className="text-xs text-muted-foreground">{commission.commission_rate}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(commission.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(commission.status)}
                        {t(`bookings.${commission.status}`)}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {commission.paid_date ? (
                      <div className="text-sm text-muted-foreground">
                        {commission.paid_date}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {commission.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        {t('commissions.processPayment')}
                      </Button>
                    )}
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