import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ChevronRight, MoreVertical } from 'lucide-react'
import { cn } from '../ui/utils'

interface MobileOptimizedCardProps {
  title: string
  description?: string
  value?: string
  subtitle?: string
  status?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    color?: string
  }
  actions?: {
    primary?: {
      label: string
      onClick: () => void
    }
    secondary?: {
      label: string
      onClick: () => void
    }
  }
  icon?: React.ReactNode
  onTap?: () => void
  className?: string
  compact?: boolean
}

export function MobileOptimizedCard({
  title,
  description,
  value,
  subtitle,
  status,
  actions,
  icon,
  onTap,
  className,
  compact = false
}: MobileOptimizedCardProps) {
  const isClickable = !!onTap

  return (
    <Card 
      className={cn(
        "border-0 shadow-sm hover:shadow-md transition-shadow",
        isClickable && "cursor-pointer active:scale-[0.98] transition-transform",
        className
      )}
      onClick={onTap}
    >
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {icon && (
              <div className="flex-shrink-0">
                {icon}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  "font-medium truncate",
                  compact ? "text-sm" : "text-base"
                )}>
                  {title}
                </h3>
                
                {status && (
                  <Badge 
                    variant={status.variant || 'secondary'} 
                    className={cn(
                      "ml-2 flex-shrink-0",
                      compact ? "text-xs px-2 py-0.5" : "text-xs",
                      status.color
                    )}
                  >
                    {status.text}
                  </Badge>
                )}
              </div>
              
              {description && (
                <p className={cn(
                  "text-muted-foreground truncate mt-1",
                  compact ? "text-xs" : "text-sm"
                )}>
                  {description}
                </p>
              )}
              
              {value && (
                <p className={cn(
                  "font-semibold mt-1",
                  compact ? "text-lg" : "text-xl"
                )}>
                  {value}
                </p>
              )}
              
              {subtitle && (
                <p className={cn(
                  "text-muted-foreground mt-1",
                  compact ? "text-xs" : "text-sm"
                )}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {(actions || isClickable) && (
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              {actions?.primary && (
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation()
                    actions.primary!.onClick()
                  }}
                  className={compact ? "h-8 px-3 text-xs" : "h-9 px-4"}
                >
                  {actions.primary.label}
                </Button>
              )}
              
              {actions?.secondary && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    actions.secondary!.onClick()
                  }}
                  className={compact ? "h-8 px-3 text-xs" : "h-9 px-4"}
                >
                  {actions.secondary.label}
                </Button>
              )}
              
              {isClickable && !actions && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function MobileStatsCard({
  title,
  value,
  change,
  trend,
  icon,
  color = 'bg-primary'
}: {
  title: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  color?: string
}) {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground'
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold mb-1">{value}</p>
            {change && (
              <p className={cn(
                "text-xs",
                trend ? trendColor[trend] : 'text-muted-foreground'
              )}>
                {change}
              </p>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              color
            )}>
              <div className="text-white">
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function MobileListCard({
  items,
  onItemTap,
  onMoreOptions,
  emptyState
}: {
  items: Array<{
    id: string
    title: string
    description?: string
    value?: string
    status?: {
      text: string
      variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    }
    icon?: React.ReactNode
  }>
  onItemTap?: (id: string) => void
  onMoreOptions?: (id: string) => void
  emptyState?: {
    title: string
    description: string
    action?: {
      label: string
      onClick: () => void
    }
  }
}) {
  if (items.length === 0 && emptyState) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 text-center">
          <h3 className="font-medium text-lg mb-2">{emptyState.title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{emptyState.description}</p>
          {emptyState.action && (
            <Button onClick={emptyState.action.onClick}>
              {emptyState.action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-4 flex items-center space-x-3 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onItemTap?.(item.id)}
            >
              {item.icon && (
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  {item.status && (
                    <Badge variant={item.status.variant || 'secondary'} className="text-xs ml-2">
                      {item.status.text}
                    </Badge>
                  )}
                </div>
                
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {item.description}
                  </p>
                )}
                
                {item.value && (
                  <p className="text-sm font-semibold mt-1">
                    {item.value}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {onMoreOptions && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoreOptions(item.id)
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}