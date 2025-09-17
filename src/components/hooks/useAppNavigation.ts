import { createContext, useContext } from 'react'

interface AppNavigationContextType {
  setCurrentForm: (form: string | null) => void
  setActiveTab: (tab: string) => void
  activeTab: string
  currentForm: string | null
}

export const AppNavigationContext = createContext<AppNavigationContextType | null>(null)

export const useAppNavigation = () => {
  const context = useContext(AppNavigationContext)
  if (!context) {
    throw new Error('useAppNavigation must be used within an AppNavigationProvider')
  }
  return context
}