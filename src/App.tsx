import { useState } from 'react'
import { AuthProvider, useAuth } from './components/AuthProvider'
import { NotificationProvider } from './components/NotificationProvider'
import { InternationalizationProvider } from './components/providers/InternationalizationProvider'
import { AppNavigationProvider } from './components/providers/AppNavigationProvider'
import { LoginForm } from './components/LoginForm'
import { OrganizationSetup } from './components/OrganizationSetup'
import { ResponsiveWrapper } from './components/ResponsiveWrapper'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { ContentRenderer } from './components/utils/ContentRenderer'
import { useIsMobile } from './components/ui/use-mobile'
import { Toaster } from './components/ui/sonner'
import { DEFAULT_TAB } from './components/constants/dashboardRoutes'

function AppContent() {
  const { user, currentOrganization, loading } = useAuth()
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB)
  const [showOrgSetup, setShowOrgSetup] = useState(false)
  const [currentForm, setCurrentForm] = useState<string | null>(null)
  const isMobile = useIsMobile()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <LoginForm />
  }

  // Show organization setup if user has no organization
  if (!currentOrganization && !showOrgSetup) {
    setShowOrgSetup(true)
  }

  if (showOrgSetup) {
    return <OrganizationSetup onComplete={() => setShowOrgSetup(false)} />
  }

  const content = (
    <AppNavigationProvider
      setCurrentForm={setCurrentForm}
      setActiveTab={setActiveTab}
      activeTab={activeTab}
      currentForm={currentForm}
    >
      <ContentRenderer
        activeTab={activeTab}
        currentForm={currentForm}
        isMobile={isMobile}
        onFormComplete={() => setCurrentForm(null)}
        onFormCancel={() => setCurrentForm(null)}
      />
    </AppNavigationProvider>
  )

  // If showing a form, render it fullscreen without dashboard wrapper
  if (currentForm) {
    return (
      <div className="min-h-screen bg-background">
        {content}
        <Toaster 
          position="top-right"
          expand={true}
          richColors
          closeButton
        />
      </div>
    )
  }

  return (
    <ResponsiveWrapper activeTab={activeTab} onTabChange={setActiveTab}>
      {content}
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </ResponsiveWrapper>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <InternationalizationProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </InternationalizationProvider>
    </div>
  )
}