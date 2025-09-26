import { useAuth } from './AuthProvider'
import { NotificationCenter } from './NotificationCenter'
import { useInternationalization } from './providers/InternationalizationProvider'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { ScrollArea } from './ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
import { 
  Building2, 
  LogOut, 
  Settings, 
  User,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Package,
  Percent,
  Menu,
  Calendar,
  Zap,
  BarChart3,
  UserCog,
  Mail,
  Plus,
  Clock,
  CreditCard,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShoppingCart,
  Target,
  Palette,
  Wrench,
  Shield,
  Activity,
  Crown
} from 'lucide-react'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { LanguageSelector } from './ui/LanguageSelector'
import { OrganizationCreateForm } from './forms/OrganizationCreateForm'
import { useState } from 'react'
import { cn } from '../lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const { 
    user, 
    organizations, 
    currentOrganization, 
    trialDaysRemaining, 
    switchOrganization, 
    signOut, 
    isDemoMode 
  } = useAuth()
  const { t } = useInternationalization()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showCreateOrg, setShowCreateOrg] = useState(false)

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-red-100 text-red-800 border-red-200'
      case 'admin': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'billing_manager': return 'bg-green-100 text-green-800 border-green-200'
      case 'marketing_manager': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'accounts_manager': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'project_manager': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'investor': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'builder': return 'bg-green-100 text-green-800 border-green-200'
      case 'marketing': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'trial': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getNavigationItems = () => {
    const userRole = currentOrganization?.user_role || user?.role
    const userPermissions = currentOrganization?.user_permissions || []
    const hasFullAccess = userPermissions.includes('*')
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Navigation Debug:', {
        userRole,
        globalUserRole: user?.role,
        orgRole: currentOrganization?.user_role,
        orgName: currentOrganization?.name,
        showSuperAdmin: user?.role === 'super_admin'
      })
    }

    // Define navigation modules with grouping
    const modules = {
      core: {
        title: '', // Remove 'Core' header
        items: [
          { id: 'overview', label: t('nav.overview'), icon: TrendingUp },
        ]
      },
      projects: {
        title: 'Project Management',
        items: [
          { id: 'projects', label: 'Project Setup', icon: Building2 },
          { id: 'milestones', label: t('nav.projectMilestones'), icon: Target },
        ]
      },
      sales: {
        title: 'Sales & Marketing',
        items: [
          { id: 'bookings', label: t('nav.bookings'), icon: Calendar },
          { id: 'sales', label: t('nav.sales'), icon: TrendingUp },
          { id: 'marketing', label: 'Marketing Communication', icon: Mail },
          { id: 'commissions', label: t('nav.commissions'), icon: Percent },
        ]
      },
      financial: {
        title: 'Financial Management',
        items: [
          { id: 'installments', label: 'Installments & Invoicing', icon: Clock },
          { id: 'expenses', label: t('nav.expenses'), icon: DollarSign },
          { id: 'invoices', label: 'Auto Invoices', icon: Zap },
          { id: 'statements', label: 'Account Statements', icon: BarChart3 },
        ]
      },
      operations: {
        title: 'Procurement Operations',
        items: [
          { id: 'vendors', label: t('nav.vendorManagement'), icon: Truck },
          { id: 'materials', label: t('nav.materialManagement'), icon: Package },
          { id: 'procurement', label: t('nav.procurement'), icon: ShoppingCart },
          { id: 'purchase-orders', label: t('nav.purchaseOrders'), icon: FileText },
        ]
      },
      management: {
        title: 'User Management',
        items: [
          { id: 'employees', label: 'Employee Management', icon: UserCog },
          { id: 'users', label: t('nav.userManagement'), icon: Users },
          { id: 'user-roles', label: 'User Roles & Access', icon: Shield },
        ]
      },
      system: {
        title: 'MIS and Settings',
        items: [
          { id: 'audit-trail', label: 'Audit Trail', icon: Activity },
          { id: 'reports', label: t('nav.reports'), icon: BarChart3 },
          { id: 'settings', label: t('nav.settings'), icon: Settings },
          // Super Admin always based on global user role, not organization role
          ...(user?.role === 'super_admin' ? [{ id: 'super-admin', label: 'Super Admin', icon: Crown }] : []),
        ]
      }
    }

    // Role-based navigation with RBAC/ABAC
    switch (userRole) {
      case 'owner':
      case 'admin':
      case 'super_admin': // Super admin gets full access
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
          financial: { ...modules.financial, items: modules.financial.items.filter(item => ['expenses', 'statements'].includes(item.id)) },
          system: { ...modules.system, items: modules.system.items.filter(item => item.id === 'reports') }
        }
      case 'project_manager':
        return {
          core: modules.core,
          projects: modules.projects,
          financial: { ...modules.financial, items: modules.financial.items.filter(item => item.id === 'expenses') },
          operations: modules.operations,
          management: { ...modules.management, items: modules.management.items.filter(item => item.id === 'employees') },
          system: { ...modules.system, items: modules.system.items.filter(item => item.id === 'reports') }
        }
      case 'investor':
        return {
          core: modules.core,
          financial: { ...modules.financial, items: modules.financial.items.filter(item => ['expenses', 'statements'].includes(item.id)) },
          system: { ...modules.system, items: modules.system.items.filter(item => item.id === 'reports') }
        }
      case 'builder':
        return {
          core: modules.core,
          projects: modules.projects,
          financial: { ...modules.financial, items: modules.financial.items.filter(item => item.id === 'expenses') },
          operations: modules.operations,
          management: { ...modules.management, items: modules.management.items.filter(item => item.id === 'employees') },
          system: { ...modules.system, items: modules.system.items.filter(item => item.id === 'reports') }
        }
      case 'marketing':
        return {
          core: modules.core,
          sales: modules.sales
        }
      default:
        return {
          core: modules.core,
          ...(hasFullAccess || userPermissions.includes('projects') ? { projects: modules.projects } : {})
        }
    }
  }

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setSidebarOpen(false) // Close sidebar on mobile when navigating
  }

  const CollapsedSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b flex-shrink-0">
        <div className="flex justify-center">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          <div className="space-y-2">
            {Object.entries(getNavigationItems()).map(([moduleKey, module]) => (
              <div key={moduleKey} className="space-y-1">
                {module.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={`w-full h-10 p-0 justify-center transition-all ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleTabChange(item.id)}
                      title={item.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  )
                })}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Organization Selector - Fixed at top */}
      <div className="flex-shrink-0 p-4 border-b">
        <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Organization
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setShowCreateOrg(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          
          {currentOrganization && (
            <div className="space-y-2">
              <Select
                value={currentOrganization.id}
                onValueChange={switchOrganization}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm truncate">{currentOrganization.name}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-sm">{org.name}</span>
                          <span className="text-xs text-muted-foreground">{org.user_role}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Subscription Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getSubscriptionStatusColor(currentOrganization.subscription_status)}`}
                  >
                    {currentOrganization.subscription_status === 'trial' && (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {currentOrganization.subscription_status === 'active' && (
                      <CreditCard className="h-3 w-3 mr-1" />
                    )}
                    {currentOrganization.subscription_status === 'trial' ? `Trial (${trialDaysRemaining}d)` : 
                     currentOrganization.subscription_status === 'active' ? 'Active' : 'Expired'}
                  </Badge>
                </div>
                
                {currentOrganization.subscription_status === 'trial' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Trial Progress</span>
                      <span>{Math.max(0, 31 - trialDaysRemaining)}/31 days</span>
                    </div>
                    <Progress 
                      value={Math.min(100, ((31 - trialDaysRemaining) / 31) * 100)} 
                      className="h-1"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          <div className="space-y-4 overflow-y-auto h-full pr-2 scrollbar-thin">
            {Object.entries(getNavigationItems()).map(([moduleKey, module]) => (
              <div key={moduleKey} className="space-y-2">
                {module.title && (
                  <div className="px-2 py-1">
                    <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wide">
                      {module.title}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  {module.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? 'default' : 'ghost'}
                        size="sm"
                        className={`w-full justify-start transition-all text-xs ${
                          isActive 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleTabChange(item.id)}
                      >
                        <Icon className="mr-2 h-3.5 w-3.5" />
                        <span className="font-medium">{item.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
      
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          {/* Mobile menu button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden mr-3">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex flex-col h-full">
                <div className="flex items-center px-4 py-3 border-b flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                      <Building2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-lg font-bold tracking-tight">JV-Flow</h1>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <SidebarContent />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight">JV-Flow</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex text-xs px-2 py-0.5">
                Real Estate Management
              </Badge>
            </div>
            <Badge 
              variant="outline" 
              className={`hidden sm:inline-flex ml-2 text-xs ${
                isDemoMode 
                  ? 'border-orange-200 text-orange-700 bg-orange-50' 
                  : 'border-green-200 text-green-700 bg-green-50'
              }`}
            >
              {isDemoMode ? 'Demo Mode' : 'Live Mode'}
            </Badge>
          </div>
          
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            {/* Trial Status */}
            {currentOrganization?.subscription_status === 'trial' && (
              <div className="hidden lg:flex items-center space-x-2 text-sm">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <Clock className="h-3 w-3 mr-1" />
                  {trialDaysRemaining} days left
                </Badge>
              </div>
            )}

            <NotificationCenter />
            
            <LanguageSelector />
            
            <Badge className={`hidden sm:inline-flex ${getRoleColor(currentOrganization?.user_role || user?.role || '')}`} variant="outline">
              {(currentOrganization?.user_role || user?.role || '').replace('_', ' ').toUpperCase()}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-border transition-all">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback className="bg-muted">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <Badge className={getRoleColor(user?.role || '')} variant="outline" size="sm">
                      {user?.role?.toUpperCase()} USER
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => handleTabChange('profile-settings')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => handleTabChange('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Account Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={cn(
          "hidden md:block border-r bg-card/50 h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-64"
        )}>
          <div className="relative h-full flex flex-col">
            
            {/* Sidebar Content */}
            <div className="flex-1 overflow-hidden">
              {sidebarCollapsed ? <CollapsedSidebarContent /> : <SidebarContent />}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 h-[calc(100vh-4rem)] overflow-auto bg-background relative">
          {/* Sidebar Toggle Button - Fixed position, always visible */}
          <Button
            variant="outline"
            size="sm"
            className="fixed top-20 left-4 h-10 w-10 p-0 z-50 rounded-lg bg-white border-2 shadow-lg hover:shadow-xl transition-all duration-200 md:flex hidden hover:scale-105"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <div className="flex flex-col items-center justify-center space-y-0.5">
              <div className={`w-4 h-0.5 bg-gray-600 transform transition-transform duration-200 ${
                sidebarCollapsed ? 'rotate-45 translate-y-0.5' : ''
              }`} />
              <div className={`w-4 h-0.5 bg-gray-600 transform transition-transform duration-200 ${
                sidebarCollapsed ? '-rotate-45 -translate-y-0.5' : ''
              }`} />
            </div>
          </Button>
          
          <div className="max-w-7xl mx-auto pt-12 md:pt-0">
            {children}
          </div>
        </main>
      </div>
      
      <OrganizationCreateForm 
        isOpen={showCreateOrg} 
        onClose={() => setShowCreateOrg(false)} 
      />
    </div>
  )
}