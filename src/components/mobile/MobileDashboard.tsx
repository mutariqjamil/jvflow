import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { 
  Home, 
  Building2, 
  DollarSign, 
  ShoppingCart, 
  FileText,
  Users,
  Settings,
  Bell,
  Menu,
  Plus,
  TrendingUp,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  Package,
  Truck,
  Target,
  Clock,
  Zap,
  BarChart3,
  UserCog,
  Shield,
  Activity,
  Mail,
  Percent,
  Crown
} from 'lucide-react'
import { useAuth } from '../AuthProvider'
import { useInternationalization } from '../providers/InternationalizationProvider'

interface MobileDashboardProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export function MobileDashboard({ activeTab, onTabChange, children }: MobileDashboardProps) {
  const { user, currentOrganization } = useAuth()
  const { t } = useInternationalization()
  const [searchOpen, setSearchOpen] = useState(false)

  const getNavigationModules = () => {
    const userRole = currentOrganization?.user_role || user?.role
    
    const modules = {
      core: {
        title: 'Core',
        items: [
          { id: 'overview', label: t('nav.overview'), icon: TrendingUp, color: 'text-blue-600' },
        ]
      },
      projects: {
        title: 'Projects',
        items: [
          { id: 'projects', label: 'Project Setup', icon: Building2, color: 'text-purple-600', badge: 3 },
          { id: 'milestones', label: t('nav.projectMilestones'), icon: Target, color: 'text-indigo-600' },
        ]
      },
      sales: {
        title: 'Sales',
        items: [
          { id: 'bookings', label: t('nav.bookings'), icon: Calendar, color: 'text-green-600' },
          { id: 'sales', label: t('nav.sales'), icon: TrendingUp, color: 'text-orange-600' },
          { id: 'marketing', label: 'Marketing', icon: Mail, color: 'text-pink-600' },
          { id: 'commissions', label: t('nav.commissions'), icon: Percent, color: 'text-yellow-600' },
        ]
      },
      financial: {
        title: 'Financial',
        items: [
          { id: 'installments', label: 'Installments', icon: Clock, color: 'text-blue-600' },
          { id: 'expenses', label: t('nav.expenses'), icon: DollarSign, color: 'text-green-600', badge: 5 },
          { id: 'invoices', label: 'Auto Invoices', icon: Zap, color: 'text-yellow-600' },
          { id: 'statements', label: 'Statements', icon: BarChart3, color: 'text-purple-600' },
        ]
      },
      operations: {
        title: 'Operations',
        items: [
          { id: 'vendors', label: t('nav.vendorManagement'), icon: Truck, color: 'text-gray-600' },
          { id: 'materials', label: t('nav.materialManagement'), icon: Package, color: 'text-blue-600' },
          { id: 'procurement', label: t('nav.procurement'), icon: ShoppingCart, color: 'text-orange-600' },
          { id: 'purchase-orders', label: t('nav.purchaseOrders'), icon: FileText, color: 'text-indigo-600' },
        ]
      },
      management: {
        title: 'Management',
        items: [
          { id: 'employees', label: 'Employees', icon: UserCog, color: 'text-pink-600' },
          { id: 'users', label: t('nav.userManagement'), icon: Users, color: 'text-pink-600' },
          { id: 'user-roles', label: 'Roles & Access', icon: Shield, color: 'text-red-600' },
        ]
      },
      system: {
        title: 'System',
        items: [
          { id: 'audit-trail', label: 'Audit Trail', icon: Activity, color: 'text-gray-600' },
          { id: 'reports', label: t('nav.reports'), icon: FileText, color: 'text-indigo-600' },
          { id: 'settings', label: t('nav.settings'), icon: Settings, color: 'text-gray-500' },
          ...(user?.role === 'super_admin' ? [{ id: 'super-admin', label: 'Super Admin', icon: Crown, color: 'text-yellow-600' }] : []),
        ]
      }
    }

    // Role-based access control
    switch (userRole) {
      case 'owner':
      case 'admin':
        return modules
      case 'billing_manager':
        return {
          core: modules.core,
          financial: modules.financial,
          system: { ...modules.system, items: modules.system.items.filter(item => item.id === 'reports') }
        }
      case 'marketing_manager':
        return {
          core: modules.core,
          sales: modules.sales
        }
      case 'accounts_manager':
        return {
          core: modules.core,
          financial: { ...modules.financial, items: modules.financial.items.filter(item => ['expenses', 'statements'].includes(item.id)) }
        }
      case 'project_manager':
        return {
          core: modules.core,
          projects: modules.projects,
          financial: { ...modules.financial, items: modules.financial.items.filter(item => item.id === 'expenses') },
          operations: modules.operations
        }
      default:
        return {
          core: modules.core,
          projects: modules.projects
        }
    }
  }

  // Get all items for finding active tab label
  const getAllItems = () => {
    const modules = getNavigationModules()
    return Object.values(modules).flatMap(module => module.items)
  }

  const quickStats = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+2 this month',
      trend: 'up',
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Expenses',
      value: 'PKR 2.45M',
      change: '5 awaiting approval',
      trend: 'neutral',
      color: 'bg-orange-500'
    },
    {
      title: 'Monthly Revenue',
      value: 'PKR 15.6M',
      change: '+12% vs last month',
      trend: 'up',
      color: 'bg-green-500'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'expense',
      title: 'Construction materials approved',
      amount: 'PKR 324K',
      time: '2h ago',
      status: 'approved'
    },
    {
      id: 2,
      type: 'project',
      title: 'New project created',
      subtitle: 'Sunset Heights Phase 2',
      time: '4h ago',
      status: 'new'
    },
    {
      id: 3,
      type: 'user',
      title: 'Team member invited',
      subtitle: 'john@example.com',
      time: '1d ago',
      status: 'pending'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between sticky top-0 z-50 h-14">
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 active:scale-95 transition-transform">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-left">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-base">JV-Flow</div>
                        <div className="text-xs text-muted-foreground">{currentOrganization?.name}</div>
                      </div>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="text-left">
                    Navigate through your real estate joint venture management platform
                  </SheetDescription>
                </SheetHeader>
                
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {Object.entries(getNavigationModules()).map(([moduleKey, module]) => (
                      <div key={moduleKey} className="space-y-2">
                        <div className="px-2 py-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {module.title}
                          </p>
                        </div>
                        <div className="space-y-1">
                          {module.items.map((item) => (
                            <Button
                              key={item.id}
                              variant={activeTab === item.id ? "default" : "ghost"}
                              className="w-full justify-start h-11"
                              onClick={() => {
                                onTabChange(item.id)
                              }}
                            >
                              <item.icon className={`w-4 h-4 mr-3 ${activeTab === item.id ? 'text-white' : item.color}`} />
                              <span className="flex-1 text-left text-sm">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Building2 className="w-3 h-3 text-white" />
            </div>
            <h1 className="font-semibold text-base capitalize truncate">
              {getAllItems().find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-10 w-10 p-0 active:scale-95 transition-transform" 
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-10 w-10 p-0 relative active:scale-95 transition-transform"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">3</span>
            </div>
          </Button>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects, expenses, users..."
                  className="w-full h-12 pl-10 pr-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:bg-white text-base"
                  style={{ fontSize: '16px' }}
                  autoFocus
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-12 px-3"
                onClick={() => setSearchOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
          
          {/* Search Results */}
          <div className="flex-1 p-4">
            <div className="text-center text-gray-500 mt-8">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Start typing to search...</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'overview' ? (
          <div className="p-4 space-y-6">
            {/* Quick Stats */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Overview</h2>
              <div className="grid gap-4">
                {quickStats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Recent Activity</h3>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <Card key={activity.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {activity.type === 'expense' && <DollarSign className="w-5 h-5 text-green-600" />}
                          {activity.type === 'project' && <Building2 className="w-5 h-5 text-purple-600" />}
                          {activity.type === 'user' && <Users className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          {activity.subtitle && (
                            <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                          )}
                          {activity.amount && (
                            <p className="text-xs font-medium text-green-600">{activity.amount}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-16 flex-col space-y-1" onClick={() => onTabChange('expenses')}>
                  <Plus className="w-5 h-5" />
                  <span className="text-xs">Add Expense</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-1" onClick={() => onTabChange('projects')}>
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs">New Project</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-1" onClick={() => onTabChange('users')}>
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Invite User</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-1" onClick={() => onTabChange('reports')}>
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">View Reports</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-full">
            {children}
          </div>
        )}
      </main>
    </div>
  )
}