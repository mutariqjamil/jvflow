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
            title: 'Total Investment',
            value: formatCurrency(mockProjectData.totalInvested),
            icon: DollarSign,
            trend: '+12%',
            trendColor: 'text-green-600'
          },
          {
            title: 'Current Cash Balance',
            value: formatCurrency(mockProjectData.cashBalance),
            icon: TrendingUp,
            trend: '+5%',
            trendColor: 'text-green-600'
          },
          {
            title: 'Total Expenses',
            value: formatCurrency(mockProjectData.totalExpenses),
            icon: DollarSign,
            trend: '+8%',
            trendColor: 'text-orange-600'
          },
          {
            title: 'Project Revenue',
            value: formatCurrency(mockProjectData.totalRevenue),
            icon: TrendingUp,
            trend: '+15%',
            trendColor: 'text-green-600'
          }
        ]
      
      case 'builder':
        return [
          {
            title: 'Budget Remaining',
            value: formatCurrency(mockProjectData.totalBudget - mockProjectData.totalExpenses),
            icon: DollarSign,
            trend: `${budgetUtilization.toFixed(1)}% used`,
            trendColor: budgetUtilization > 80 ? 'text-red-600' : 'text-green-600'
          },
          {
            title: 'Monthly Expenses',
            value: formatCurrency(mockProjectData.monthlyExpenses),
            icon: TrendingUp,
            trend: '-5%',
            trendColor: 'text-green-600'
          },
          {
            title: 'Pending Approvals',
            value: mockProjectData.pendingApprovals.toString(),
            icon: AlertTriangle,
            trend: '3 waiting',
            trendColor: 'text-orange-600'
          },
          {
            title: 'Cash Available',
            value: formatCurrency(mockProjectData.cashBalance),
            icon: CheckCircle,
            trend: 'Available',
            trendColor: 'text-green-600'
          }
        ]
      
      case 'marketing':
        return [
          {
            title: 'Units Booked',
            value: `${mockProjectData.unitsBooked}/${mockProjectData.unitsTotal}`,
            icon: Building2,
            trend: `${salesProgress.toFixed(1)}%`,
            trendColor: 'text-green-600'
          },
          {
            title: 'Monthly Sales',
            value: formatCurrency(mockProjectData.monthlyRevenue),
            icon: TrendingUp,
            trend: '+22%',
            trendColor: 'text-green-600'
          },
          {
            title: 'Commission Earned',
            value: formatCurrency(mockProjectData.totalRevenue * 0.05),
            icon: DollarSign,
            trend: '+18%',
            trendColor: 'text-green-600'
          },
          {
            title: 'Active Customers',
            value: (mockProjectData.unitsBooked + 8).toString(),
            icon: Users,
            trend: '+3 this week',
            trendColor: 'text-green-600'
          }
        ]
      
      default: // admin
        return [
          {
            title: 'Total Budget',
            value: formatCurrency(mockProjectData.totalBudget),
            icon: DollarSign,
            trend: 'Allocated',
            trendColor: 'text-blue-600'
          },
          {
            title: 'Cash Balance',
            value: formatCurrency(mockProjectData.cashBalance),
            icon: TrendingUp,
            trend: '+5%',
            trendColor: 'text-green-600'
          },
          {
            title: 'Units Booked',
            value: `${mockProjectData.unitsBooked}/${mockProjectData.unitsTotal}`,
            icon: Building2,
            trend: `${salesProgress.toFixed(1)}%`,
            trendColor: 'text-green-600'
          },
          {
            title: 'Net Revenue',
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
          Welcome back, {user?.name}. Here's what's happening with your projects.
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
            <CardTitle>Budget Utilization</CardTitle>
            <CardDescription>
              {formatCurrency(mockProjectData.totalExpenses)} of {formatCurrency(mockProjectData.totalBudget)} used
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
            <CardTitle>Sales Progress</CardTitle>
            <CardDescription>
              {mockProjectData.unitsBooked} of {mockProjectData.unitsTotal} units booked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={salesProgress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>0 units</span>
              <span className="text-green-600">
                {mockProjectData.unitsBooked} units
              </span>
              <span>{mockProjectData.unitsTotal} units</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: 'New unit booking',
                details: 'Unit B-205 booked by John Smith',
                time: '2 hours ago',
                status: 'success'
              },
              {
                action: 'Expense approval pending',
                details: 'Construction materials - $15,000',
                time: '4 hours ago',
                status: 'warning'
              },
              {
                action: 'Payment received',
                details: 'Installment payment from Sarah Johnson',
                time: '6 hours ago',
                status: 'success'
              },
              {
                action: 'Budget milestone reached',
                details: '75% of construction budget utilized',
                time: '1 day ago',
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