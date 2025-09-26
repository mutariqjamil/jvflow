import React from 'react'
import { Badge } from './badge'
import { Zap } from 'lucide-react'
import { useAuth } from '../AuthProvider'

export function DemoModeIndicator() {
  const { isDemoMode, user, currentOrganization } = useAuth()

  if (!isDemoMode) return null

  return (
    <div className="fixed top-2 right-2 z-50" id="demo-mode-indicator">
      <Badge 
        variant="outline" 
        className="bg-orange-50 border-orange-200 text-orange-800 text-xs shadow-sm demo-mode-badge"
      >
        <Zap className="h-3 w-3 mr-1 demo-mode-icon" />
        DEMO MODE
      </Badge>
    </div>
  )
}