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
  Target
} from 'lucide-react'
import { useAuth } from '../AuthProvider'

interface MobileDashboardProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export function MobileDashboard({ activeTab, onTabChange, children }: MobileDashboardProps) {
  const { user, currentOrganization } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, color: 'text-blue-600' },
    { id: 'projects', label: 'Projects', icon: Building2, color: 'text-purple-600', badge: 3 },
    { id: 'milestones', label: 'Milestones', icon: Target, color: 'text-indigo-600' },
    { id: 'expenses', label: 'Expenses', icon: DollarSign, color: 'text-green-600', badge: 5 },
    { id: 'materials', label: 'Materials', icon: Package, color: 'text-blue-600' },
    { id: 'procurement', label: 'Procurement', icon: ShoppingCart, color: 'text-orange-600' },
    { id: 'vendors', label: 'Vendors', icon: Truck, color: 'text-gray-600' },
    { id: 'sales', label: 'Sales', icon: ShoppingCart, color: 'text-orange-600' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'text-indigo-600' },
    { id: 'users', label: 'Team', icon: Users, color: 'text-pink-600' },
  ]

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
      value: '$24.5K',
      change: '5 awaiting approval',
      trend: 'neutral',
      color: 'bg-orange-500'
    },
    {
      title: 'Monthly Revenue',
      value: '$156K',
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
      amount: '$3,240',
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
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
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
                  <div className="p-4 space-y-2">
                    {menuItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className="w-full justify-start h-12"
                        onClick={() => {
                          onTabChange(item.id)
                        }}
                      >
                        <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-white' : item.color}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start h-12" onClick={() => onTabChange('settings')}>
                      <Settings className="w-5 h-5 mr-3 text-gray-500" />
                      Settings
                    </Button>
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
          
          <div>
            <h1 className="font-semibold text-lg capitalize">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>
        </div>
      </header>

      {/* Search Bar (when expanded) */}
      {searchOpen && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, expenses, users..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
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