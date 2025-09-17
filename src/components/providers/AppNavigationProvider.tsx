import { ReactNode } from 'react'
import { AppNavigationContext } from '../hooks/useAppNavigation'

interface AppNavigationProviderProps {
  children: ReactNode
  setCurrentForm: (form: string | null) => void
  setActiveTab: (tab: string) => void
  activeTab: string
  currentForm: string | null
}

export const AppNavigationProvider = ({
  children,
  setCurrentForm,
  setActiveTab,
  activeTab,
  currentForm
}: AppNavigationProviderProps) => {
  return (
    <AppNavigationContext.Provider
      value={{
        setCurrentForm,
        setActiveTab,
        activeTab,
        currentForm
      }}
    >
      {children}
    </AppNavigationContext.Provider>
  )
}