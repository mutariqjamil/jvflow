import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { ScrollArea } from '../ui/scroll-area'
import { Input } from '../ui/input'
import { 
  Menu, 
  Search, 
  Bell, 
  Settings,
  Home,
  Building,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  BarChart3,
  ShoppingCart,
  Package,
  Truck,
  Star,
  Plus,
  ChevronRight,
  Activity
} from 'lucide-react'
import { useAuth } from '../AuthProvider'
import { useInternationalization } from '../providers/InternationalizationProvider'
import { LanguageSelector } from '../ui/LanguageSelector'

interface TabletDashboardProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

const navigationItems = [
  { id: 'overview', label: 'overview', icon: Home },
  { id: 'projects', label: 'projects', icon: Building },
  { id: 'bookings', label: 'bookings', icon: Calendar },
  { id: 'expenses', label: 'expenses', icon: DollarSign },
  { id: 'commissions', label: 'commissions', icon: TrendingUp },
  { id: 'sales', label: 'sales', icon: BarChart3 },
  { id: 'users', label: 'userManagement', icon: Users },
  { id: 'materials', label: 'materialManagement', icon: Package },
  { id: 'procurement', label: 'procurement', icon: ShoppingCart },
  { id: 'vendors', label: 'vendorManagement', icon: Truck },
  { id: 'reports', label: 'reports', icon: FileText },
  { id: 'settings', label: 'settings', icon: Settings }
]

const quickActions = [
  { id: 'new-booking', label: 'newBooking', icon: Plus, color: 'bg-blue-100 text-blue-700' },
  { id: 'add-expense', label: 'addExpense', icon: DollarSign, color: 'bg-green-100 text-green-700' },
  { id: 'new-project', label: 'newProject', icon: Building, color: 'bg-purple-100 text-purple-700' },
  { id: 'add-user', label: 'addUser', icon: Users, color: 'bg-orange-100 text-orange-700' }
]

function TabletSidebar({ activeTab, onTabChange, isOpen, onClose }: {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}) {
  const { t } = useInternationalization()
  const { currentUser, currentOrganization } = useAuth()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">JV-Flow</h2>
            <p className="text-sm text-gray-600 truncate">{currentOrganization?.name}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start h-11 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  onTabChange(item.id)
                  onClose()
                }}
              >
                <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-sm">{t(item.label)}</span>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {currentUser?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</p>
            <p className="text-xs text-gray-600 truncate">{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TabletDashboard({ activeTab, onTabChange, children }: TabletDashboardProps) {
  const { t } = useInternationalization()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const currentTab = navigationItems.find(item => item.id === activeTab)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for larger tablets */}
      <div className="hidden md:block">
        <TabletSidebar 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
          isOpen={false}
          onClose={() => {}}
        />
      </div>

      {/* Mobile sidebar sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 md:hidden">
          <TabletSidebar 
            activeTab={activeTab} 
            onTabChange={onTabChange} 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              {currentTab?.icon && (
                <currentTab.icon className="w-5 h-5 text-gray-600" />
              )}
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {currentTab ? t(currentTab.label) : t('dashboard')}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 h-9"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setSearchOpen(false)
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => {
                      setSearchQuery('')
                      setSearchOpen(false)
                    }}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>

            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </div>
            </Button>

            <LanguageSelector />
          </div>
        </header>

        {/* Quick Actions Bar - Tablet specific */}
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap mr-2">
              {t('quickActions')}:
            </span>
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className={`h-8 whitespace-nowrap ${action.color} border-0`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  <span className="text-xs">{t(action.label)}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}