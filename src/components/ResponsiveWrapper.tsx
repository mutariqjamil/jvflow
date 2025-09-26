import { ReactNode } from 'react'
import { useBreakpoint } from './ui/use-breakpoint'
import { DashboardLayout } from './DashboardLayout'
import { MobileDashboard } from './mobile/MobileDashboard'
import { TabletDashboard } from './mobile/TabletDashboard'
import { useInternationalization } from './providers/InternationalizationProvider'

interface ResponsiveWrapperProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: ReactNode
}

export function ResponsiveWrapper({ activeTab, onTabChange, children }: ResponsiveWrapperProps) {
  const breakpoint = useBreakpoint()
  const { direction } = useInternationalization()

  switch (breakpoint) {
    case 'mobile':
      return (
        <div dir={direction}>
          <MobileDashboard activeTab={activeTab} onTabChange={onTabChange}>
            <div className="mobile-content">
              {children}
            </div>
          </MobileDashboard>
        </div>
      )
    
    case 'tablet':
      return (
        <div dir={direction}>
          <TabletDashboard activeTab={activeTab} onTabChange={onTabChange}>
            <div className="tablet-content">
              {children}
            </div>
          </TabletDashboard>
        </div>
      )
    
    default:
      return (
        <div dir={direction}>
          <DashboardLayout activeTab={activeTab} onTabChange={onTabChange}>
            {children}
          </DashboardLayout>
        </div>
      )
  }
}