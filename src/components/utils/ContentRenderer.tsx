import { DASHBOARD_COMPONENTS, type DashboardTab } from '../constants/dashboardRoutes'
import { FORM_COMPONENTS, type FormRoute } from '../constants/formRoutes'

interface ContentRendererProps {
  activeTab: string
  currentForm: string | null
  isMobile: boolean
  onFormComplete: () => void
  onFormCancel: () => void
}

export const ContentRenderer = ({
  activeTab,
  currentForm,
  isMobile,
  onFormComplete,
  onFormCancel
}: ContentRendererProps) => {
  // Handle dedicated form views
  if (currentForm && currentForm in FORM_COMPONENTS) {
    const FormComponent = FORM_COMPONENTS[currentForm as FormRoute]
    return (
      <FormComponent 
        onComplete={onFormComplete}
        onCancel={onFormCancel}
      />
    )
  }

  // Handle dashboard views - mobile optimized versions when on mobile
  const getDashboardComponent = (tab: string) => {
    // Special case for mobile expenses
    if (tab === 'expenses' && isMobile) {
      return DASHBOARD_COMPONENTS['expenses-mobile']
    }
    
    // Get component from mapping or default to overview
    return DASHBOARD_COMPONENTS[tab as DashboardTab] || DASHBOARD_COMPONENTS.overview
  }

  const DashboardComponent = getDashboardComponent(activeTab)
  return <DashboardComponent />
}