import { ReactNode } from 'react'
import { useIsMobile } from './ui/use-mobile'
import { DashboardLayout } from './DashboardLayout'
import { MobileDashboard } from './mobile/MobileDashboard'
import { useInternationalization } from './providers/InternationalizationProvider'

interface ResponsiveWrapperProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: ReactNode
}

export function ResponsiveWrapper({ activeTab, onTabChange, children }: ResponsiveWrapperProps) {
  const isMobile = useIsMobile()
  const { direction } = useInternationalization()

  if (isMobile) {
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

  return (
    <div dir={direction}>
      <DashboardLayout activeTab={activeTab} onTabChange={onTabChange}>
        {children}
      </DashboardLayout>
    </div>
  )
}