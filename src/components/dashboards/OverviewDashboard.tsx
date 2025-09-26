import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Users, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../AuthProvider'
import { useInternationalization } from '../providers/InternationalizationProvider'

// Mock data - in real app, this would come from Supabase
const mockProjectData = {
  totalBudget: 5000000,
  cashBalance: 1250000,
  totalInvested: 2500000,
  totalExpenses: 1250000,
  totalRevenue: 800000,
  unitsTotal: 50,
  unitsBooked: 18,
  unitsSold: 5,
  pendingApprovals: 3,
  monthlyRevenue: 250000,
  monthlyExpenses: 180000
}

export function OverviewDashboard() {
  const { user } = useAuth()
  const { t, formatCurrency } = useInternationalization()
  
  // Keep the local formatter for consistency while transitioning
  const formatLocalCurrency = (amount: number) => {
    return formatCurrency(amount)
  }

  const budgetUtilization = (mockProjectData.totalExpenses / mockProjectData.totalBudget) * 100
  const salesProgress = (mockProjectData.unitsBooked / mockProjectData.unitsTotal) * 100

  const getKPIs = () => {
    switch (user?.role) {
      case 'investor':
        return [
          {
            title: t('overview.totalInvestment'),
            value: formatCurrency(mockProjectData.totalInvested),
            icon: DollarSign,
            trend: '+12%',
            trendColor: 'text-green-600'
          },
          {
            title: t('overview.currentCashBalance'),
            value: formatCurrency(mockProjectData.cashBalance),
            icon: TrendingUp,
            trend: '+5%',
            trendColor: 'text-green-600'
          },
          {
            title: t('overview.totalExpenses'),
            value: formatCurrency(mockProjectData.totalExpenses),
            icon: DollarSign,
            trend: '+8%',
            trendColor: 'text-orange-600'
          },
          {
            title: t('overview.projectRevenue'),
            value: formatCurrency(mockProjectData.totalRevenue),
            icon: TrendingUp,
            trend: '+15%',
            trendColor: 'text-green-600'
          }
        ]
      
      case 'builder':
        return [
          {
            title: t('overview.budgetRemaining'),
            value: formatCurrency(mockProjectData.totalBudget - mockProjectData.totalExpenses),
            icon: DollarSign,
            trend: `${budgetUtilization.toFixed(1)}% used`,
            trendColor: budgetUtilization > 80 ? 'text-red-600' : 'text-green-600'
          },
          {
            title: t('overview.monthlyExpenses'),
            value: formatCurrency(mockProjectData.monthlyExpenses),
            icon: TrendingUp,
            trend: '-5%',
            trendColor: 'text-green-600'
          },
          {
            title: t('overview.pendingApprovals'),
            value: mockProjectData.pendingApprovals.toString(),
            icon: AlertTriangle,
            trend: t('overview.waiting', { count: 3 }),
            trendColor: 'text-orange-600'
          },
          {
            title: t('overview.cashAvailable'),
            value: formatCurrency(mockProjectData.cashBalance),
            icon: CheckCircle,
            trend: t('overview.available'),
            trendColor: 'text-green-600'
          }
        ]
      
      case 'marketing':
        return [
          {
            title: t('overview.unitsBooked'),
            value: `${mockProjectData.unitsBooked}/${mockProjectData.unitsTotal}`,
            icon: Building2,
            trend: `${salesProgress.toFixed(1)}%`,
            trendColor: 'text-green-600'
          },
          {
            title: t('overview.monthlySales'),
            value: formatCurrency(mockProjectData.monthlyRevenue),
            icon: TrendingUp,
            trend: '+22%',
            trendColor: 'text-green-600'
          },
          {
            title: t('overview.commissionEarned'),
            value: formatCurrency(mockProjectData.totalRevenue * 0.05),
            icon: DollarSign,
            trend: '+18%',
            trendColor: 'text-green-600'
          },
          {
            title: t('overview.activeCustomers'),
            value: (mockProjectData.unitsBooked + 8).toString(),
            icon: Users,
            trend: t('overview.thisWeek', { count: 3 }),
            trendColor: 'text-green-600'
          }
        ]
      
      default: // admin
        return [
          {
            title: t('overview.totalBudget'),
            value: formatCurrency(mockProjectData.totalBudget),
            icon: DollarSign,
            trend: t('overview.allocated'),
            trendColor: 'text-blue-600'
          },
          {
            title: t('overview.cashBalance'),
            value: formatCurrency(mockProjectData.cashBalance),
            icon: TrendingUp,
            trend: '+5%',
            trendColor: 'text-green-600'
          },
          {
            title: t('overview.unitsBooked'),
            value: `${mockProjectData.unitsBooked}/${mockProjectData.unitsTotal}`,
            icon: Building2,
            trend: `${salesProgress.toFixed(1)}%`,
            trendColor: 'text-green-600'
          },
          {
            title: t('overview.netRevenue'),
            value: formatCurrency(mockProjectData.totalRevenue - mockProjectData.totalExpenses),
            icon: TrendingUp,
            trend: '+12%',
            trendColor: 'text-green-600'
          }
        ]
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('overview.title')}</h2>
        <p className="text-muted-foreground">
          {t('overview.welcomeBack', { name: user?.name })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {getKPIs().map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs ${kpi.trendColor}`}>
                  {kpi.trend}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Progress Indicators */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('overview.budgetUtilization')}</CardTitle>
            <CardDescription>
              {t('overview.budgetUsed', { 
                used: formatCurrency(mockProjectData.totalExpenses), 
                total: formatCurrency(mockProjectData.totalBudget) 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={budgetUtilization} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>0%</span>
              <span className={budgetUtilization > 80 ? 'text-red-600' : 'text-green-600'}>
                {budgetUtilization.toFixed(1)}%
              </span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('overview.salesProgress')}</CardTitle>
            <CardDescription>
              {t('overview.unitsBookedOf', { 
                booked: mockProjectData.unitsBooked, 
                total: mockProjectData.unitsTotal 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={salesProgress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>0 {t('overview.units')}</span>
              <span className="text-green-600">
                {mockProjectData.unitsBooked} {t('overview.units')}
              </span>
              <span>{mockProjectData.unitsTotal} {t('overview.units')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('overview.recentActivity')}</CardTitle>
          <CardDescription>{t('overview.recentActivityDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: t('overview.newUnitBooking'),
                details: t('overview.unitBookedBy', { unit: 'B-205', customer: 'John Smith' }),
                time: t('overview.hoursAgo', { hours: 2 }),
                status: 'success'
              },
              {
                action: t('overview.expenseApprovalPending'),
                details: t('overview.constructionMaterials', { amount: formatCurrency(15000) }),
                time: t('overview.hoursAgo', { hours: 4 }),
                status: 'warning'
              },
              {
                action: t('overview.paymentReceived'),
                details: t('overview.installmentPayment', { customer: 'Sarah Johnson' }),
                time: t('overview.hoursAgo', { hours: 6 }),
                status: 'success'
              },
              {
                action: t('overview.budgetMilestone'),
                details: t('overview.budgetUtilized', { percent: 75 }),
                time: t('overview.dayAgo', { days: 1 }),
                status: 'info'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-orange-500' :
                  activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}