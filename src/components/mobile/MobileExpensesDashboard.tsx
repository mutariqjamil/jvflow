import { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { 
  DollarSign,
  Plus,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  MoreVertical,
  Calendar,
  Building,
  User
} from 'lucide-react'
import { MobileOptimizedCard, MobileStatsCard, MobileListCard } from './MobileOptimizedCard'

export function MobileExpensesDashboard() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    {
      title: 'Pending Approval',
      value: '₨737,400',
      change: '5 expenses',
      trend: 'neutral' as const,
      color: 'bg-orange-500'
    },
    {
      title: 'Approved This Month',
      value: '₨4,687,200',
      change: '+12% vs last month',
      trend: 'up' as const,
      color: 'bg-green-500'
    },
    {
      title: 'Total Spent YTD',
      value: '₨63M',
      change: '68% of budget',
      trend: 'neutral' as const,
      color: 'bg-blue-500'
    }
  ]

  const expenses = [
    {
      id: '1',
      title: 'Construction Materials',
      description: 'Steel and concrete for Phase 1',
      value: '₨97,200',
      status: { text: 'Pending', variant: 'outline' as const },
      icon: <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
        <Building className="w-5 h-5 text-orange-600" />
      </div>
    },
    {
      id: '2',
      title: 'Marketing Campaign',
      description: 'Digital ads for Q4 campaign',
      value: '₨55,500',
      status: { text: 'Approved', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      icon: <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <DollarSign className="w-5 h-5 text-blue-600" />
      </div>
    },
    {
      id: '3',
      title: 'Legal Consultation',
      description: 'Contract review services',
      value: '₨22,500',
      status: { text: 'Rejected', variant: 'destructive' as const },
      icon: <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
        <XCircle className="w-5 h-5 text-red-600" />
      </div>
    },
    {
      id: '4',
      title: 'Equipment Rental',
      description: 'Excavator rental for 2 weeks',
      value: '₨72,000',
      status: { text: 'Pending', variant: 'outline' as const },
      icon: <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
        <Building className="w-5 h-5 text-purple-600" />
      </div>
    },
    {
      id: '5',
      title: 'Office Supplies',
      description: 'Monthly office supplies order',
      value: '₨10,200',
      status: { text: 'Approved', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      icon: <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        <DollarSign className="w-5 h-5 text-gray-600" />
      </div>
    }
  ]

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  const filteredExpenses = expenses.filter(expense => {
    if (filter !== 'all') {
      const statusMatch = expense.status.text.toLowerCase() === filter
      if (!statusMatch) return false
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return expense.title.toLowerCase().includes(query) ||
             expense.description.toLowerCase().includes(query)
    }
    
    return true
  })

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Stats Grid */}
      <div className="grid gap-4">
        {stats.map((stat, index) => (
          <MobileStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            color={stat.color}
            icon={<DollarSign className="w-6 h-6" />}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="h-14 flex-col space-y-1">
          <Plus className="w-5 h-5" />
          <span className="text-xs">New Expense</span>
        </Button>
        <Button variant="outline" className="h-14 flex-col space-y-1">
          <Filter className="w-5 h-5" />
          <span className="text-xs">Filter & Sort</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:bg-white"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(option.value)}
                className="whitespace-nowrap flex-shrink-0"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Recent Expenses</h3>
          <Badge variant="secondary">
            {filteredExpenses.length} items
          </Badge>
        </div>

        <MobileListCard
          items={filteredExpenses}
          onItemTap={(id) => console.log('Expense tapped:', id)}
          onMoreOptions={(id) => console.log('More options for:', id)}
          emptyState={{
            title: 'No expenses found',
            description: 'Try adjusting your search or filter criteria',
            action: {
              label: 'Add New Expense',
              onClick: () => console.log('Add expense')
            }
          }}
        />
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent Activity</h3>
        
        <div className="space-y-3">
          <MobileOptimizedCard
            title="Expense Approved"
            description="Construction materials - ₨97,200"
            subtitle="2 hours ago"
            status={{ text: 'Approved', variant: 'default', color: 'bg-green-100 text-green-800' }}
            icon={<CheckCircle className="w-5 h-5 text-green-600" />}
            compact
          />
          
          <MobileOptimizedCard
            title="New Expense Submitted"
            description="Marketing campaign - ₨55,500"
            subtitle="4 hours ago"
            status={{ text: 'Pending', variant: 'outline' }}
            icon={<Clock className="w-5 h-5 text-orange-600" />}
            compact
          />
          
          <MobileOptimizedCard
            title="Expense Rejected"
            description="Legal consultation - ₨22,500"
            subtitle="1 day ago"
            status={{ text: 'Rejected', variant: 'destructive' }}
            icon={<XCircle className="w-5 h-5 text-red-600" />}
            compact
          />
        </div>
      </div>
    </div>
  )
}