import { ReactNode } from 'react'
import { useBreakpoint } from './ui/use-breakpoint'
import { DashboardLayout } from './DashboardLayout'
import { MobileDashboard } from './mobile/MobileDashboard'
import { useInternationalization } from './providers/InternationalizationProvider'

interface ResponsiveWrapperProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: ReactNode
}

export function ResponsiveWrapper({ activeTab, onTabChange, children }: ResponsiveWrapperProps) {
  const breakpoint = useBreakpoint()
  const { direction } = useInternationalization()

  // Mobile layout - use dedicated mobile dashboard
  if (breakpoint === 'mobile') {
    return (
      <div dir={direction}>
        <MobileDashboard activeTab={activeTab} onTabChange={onTabChange}>
          <div className="mobile-content">
            {children}
          </div>
        </MobileDashboard>
      </div>
    )
  }

  // Tablet and Desktop layout - use main dashboard layout
  // Tablet gets some responsive styling via CSS classes
  const containerClasses = breakpoint === 'tablet' 
    ? 'tablet-layout' // Add tablet-specific styling class
    : 'desktop-layout' // Add desktop-specific styling class

  return (
    <div dir={direction} className={containerClasses}>
      <DashboardLayout activeTab={activeTab} onTabChange={onTabChange}>
        <div className={breakpoint === 'tablet' ? 'tablet-content' : 'desktop-content'}>
          {children}
        </div>
      </DashboardLayout>
    </div>
  )
}
