import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, User, isSupabaseConfigured } from '../lib/supabase'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface Organization {
  id: string
  name: string
  description?: string
  industry?: string
  owner_id: string
  subscription_status: 'trial' | 'active' | 'expired'
  trial_end_date?: string
  user_role: string
  user_permissions: string[]
  user_project_ids?: string[]
}

interface UserProfile extends User {
  phone?: string
  registration_type: 'email' | 'phone' | 'social'
  trial_start_date?: string
  trial_end_date?: string
  subscription_status: 'trial' | 'active' | 'expired'
  organizations?: string[]
}

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  organizations: Organization[]
  currentOrganization: Organization | null
  trialDaysRemaining: number
  signIn: (email: string, password: string) => Promise<void>
  signInWithProvider: (provider: 'google' | 'facebook' | 'linkedin') => Promise<void>
  signUp: (data: { email?: string, phone?: string, password: string, name: string, registrationType: 'email' | 'phone' }) => Promise<void>
  signOut: () => Promise<void>
  createOrganization: (data: { name: string, description?: string, industry?: string }) => Promise<Organization>
  switchOrganization: (organizationId: string) => void
  refreshProfile: () => Promise<void>
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const isDemoMode = false // Always show as connected now

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = isDemoMode ? 'demo-token' : (await supabase?.auth.getSession())?.data?.session?.access_token || publicAnonKey
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-df4644bf${endpoint}`,
      {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Request failed')
    }

    return response.json()
  }

  const refreshProfile = async () => {
    if (isDemoMode) return
    
    try {
      const data = await apiCall('/profile')
      if (data.user) {
        setUser(data.user)
        setOrganizations(data.organizations || [])
        setTrialDaysRemaining(data.trial_days_remaining || 0)
        
        if (data.organizations?.length > 0 && !currentOrganization) {
          setCurrentOrganization(data.organizations[0])
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }

  useEffect(() => {
    // Always create a default user with the specified credentials (Supabase connected by default)
    const defaultUser: UserProfile = {
      id: 'default-user',
      email: 'tj.analyst@gmail.com',
      role: 'super_admin',
      name: 'muhammadtj',
      registration_type: 'email',
      subscription_status: 'active',
      trial_start_date: new Date().toISOString(),
      trial_end_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
      organizations: ['default-org']
    }
    
    const defaultOrg: Organization = {
      id: 'default-org',
      name: 'JV-Flow Real Estate Management',
      description: 'Complete real estate joint venture management system',
      industry: 'Real Estate',
      owner_id: 'default-user',
      subscription_status: 'active',
      trial_end_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
      user_role: 'owner',
      user_permissions: ['*']
    }
    
    setUser(defaultUser)
    setOrganizations([defaultOrg])
    setCurrentOrganization(defaultOrg)
    setTrialDaysRemaining(31)
    setLoading(false)
    
    if (isDemoMode) {
      return
    }

    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await refreshProfile()
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await refreshProfile()
        } else {
          setUser(null)
          setOrganizations([])
          setCurrentOrganization(null)
          setTrialDaysRemaining(0)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [isDemoMode])

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo mode handled in useEffect
      return
    }

    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
  }

  const signInWithProvider = async (provider: 'google' | 'facebook' | 'linkedin') => {
    if (isDemoMode) {
      throw new Error('Social login not available in demo mode')
    }

    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) throw error
  }

  const signUp = async (data: { email?: string, phone?: string, password: string, name: string, registrationType: 'email' | 'phone' }) => {
    if (isDemoMode) {
      throw new Error('Sign up not available in demo mode')
    }

    try {
      const response = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      if (response.error) {
        throw new Error(response.error)
      }

      return response
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null)
      setOrganizations([])
      setCurrentOrganization(null)
      setTrialDaysRemaining(0)
      return
    }

    if (!supabase) {
      setUser(null)
      setOrganizations([])
      setCurrentOrganization(null)
      setTrialDaysRemaining(0)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    setUser(null)
    setOrganizations([])
    setCurrentOrganization(null)
    setTrialDaysRemaining(0)
  }

  const createOrganization = async (data: { name: string, description?: string, industry?: string }) => {
    if (isDemoMode) {
      throw new Error('Create organization not available in demo mode')
    }

    try {
      const response = await apiCall('/organizations', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      if (response.organization) {
        await refreshProfile() // Refresh to get updated organizations
        return response.organization
      }

      throw new Error('Failed to create organization')
    } catch (error) {
      console.error('Create organization error:', error)
      throw error
    }
  }

  const switchOrganization = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId)
    if (org) {
      setCurrentOrganization(org)
      localStorage.setItem('currentOrganizationId', organizationId)
    }
  }

  // Load saved organization on mount
  useEffect(() => {
    const savedOrgId = localStorage.getItem('currentOrganizationId')
    if (savedOrgId && organizations.length > 0) {
      const org = organizations.find(o => o.id === savedOrgId)
      if (org) {
        setCurrentOrganization(org)
      }
    }
  }, [organizations])

  const value = {
    user,
    loading,
    organizations,
    currentOrganization,
    trialDaysRemaining,
    signIn,
    signInWithProvider,
    signUp,
    signOut,
    createOrganization,
    switchOrganization,
    refreshProfile,
    isDemoMode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}