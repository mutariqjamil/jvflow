import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, User, isSupabaseConfigured } from '../lib/supabase'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { logger, authLog } from '../utils/logger'

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
  signInWithProvider: (provider: 'google' | 'facebook' | 'linkedin' | 'reset_password') => Promise<void>
  resetPassword: (email: string) => Promise<void>
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
  const isDemoMode = !isSupabaseConfigured // Use demo mode only if Supabase is not configured
  
  // Log initialization
  authLog('info', 'AuthProvider initialized', { 
    isDemoMode, 
    isSupabaseConfigured, 
    projectId: isDemoMode ? 'demo-mode' : projectId?.substring(0, 8) + '...' 
  })

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (isDemoMode) {
      // In demo mode, don't make real API calls
      throw new Error('API calls not available in demo mode')
    }
    
    const token = (await supabase?.auth.getSession())?.data?.session?.access_token || publicAnonKey
    
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
    // Always create a default super admin user
    const defaultUser: UserProfile = {
      id: 'super-admin-001',
      email: 'tj.analyst@gmail.com',
      role: 'super_admin',
      name: 'Muhammad TJ (Super Admin)',
      registration_type: 'email',
      subscription_status: 'active',
      trial_start_date: new Date().toISOString(),
      trial_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      organizations: ['default-org', 'platform-admin']
    }
    
    const platformAdminOrg: Organization = {
      id: 'platform-admin',
      name: 'JV-Flow Platform Administration',
      description: 'Super admin organization for platform management',
      industry: 'Platform Management',
      owner_id: 'super-admin-001',
      subscription_status: 'active',
      trial_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      user_role: 'super_admin',
      user_permissions: ['*', 'platform.*', 'super_admin.*']
    }
    
    const defaultOrg: Organization = {
      id: 'default-org',
      name: 'Demo Real Estate Company',
      description: 'Demo organization for testing JV-Flow features',
      industry: 'Real Estate',
      owner_id: 'super-admin-001',
      subscription_status: 'active',
      trial_end_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
      user_role: 'admin',
      user_permissions: ['*']
    }
    
    setUser(defaultUser)
    setOrganizations([platformAdminOrg, defaultOrg])
    setCurrentOrganization(platformAdminOrg) // Start with platform admin
    setTrialDaysRemaining(365)
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
    logger.startTimer('signin-process')
    authLog('info', 'Sign in attempt started', { email: email.substring(0, 3) + '***' })
    
    try {
      if (isDemoMode) {
        authLog('info', 'Demo mode authentication', { email })
        
        // Enhanced demo credentials with multiple test users
        const demoUsers = {
          'tj.analyst@gmail.com': 'Asdf123@',
          'demo@jvflow.com': 'demo123',
          'admin@jvflow.com': 'admin123',
          'test@jvflow.com': 'test123'
        }
        
        if (demoUsers[email as keyof typeof demoUsers] === password) {
          authLog('info', 'Demo authentication successful', { email })
          
          // Store auth state for logging
          const authState = { user: { id: user?.id, email }, timestamp: Date.now() }
          localStorage.setItem('auth_state', JSON.stringify(authState))
          
          logger.endTimer('signin-process')
          return
        } else {
          const validEmails = Object.keys(demoUsers).join(', ')
          authLog('error', 'Invalid demo credentials provided', { email, validEmails })
          throw new Error(`Invalid demo credentials. Valid emails: ${validEmails}`)
        }
      }

      if (!supabase) {
        authLog('error', 'Supabase client not initialized')
        throw new Error('Authentication service not available')
      }

      authLog('debug', 'Calling Supabase signInWithPassword')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        authLog('error', 'Supabase authentication failed', { 
          error: error.message, 
          email: email.substring(0, 3) + '***' 
        })
        throw new Error(error.message || 'Authentication failed')
      }
      
      authLog('info', 'Supabase authentication successful', { 
        userId: data.user?.id,
        email: email.substring(0, 3) + '***'
      })
      
      logger.endTimer('signin-process')
    } catch (error) {
      logger.endTimer('signin-process')
      authLog('error', 'Sign in process failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        email: email.substring(0, 3) + '***'
      })
      throw error
    }
  }

  const signInWithProvider = async (provider: 'google' | 'facebook' | 'linkedin' | 'reset_password') => {
    if (provider === 'reset_password') {
      throw new Error('Use resetPassword function for password reset')
    }

    if (isDemoMode) {
      throw new Error('Social login not available in demo mode')
    }

    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    })
    if (error) {
      // Provide more specific error messages
      if (error.message.includes('not enabled')) {
        throw new Error(`${provider} login is not enabled. Please contact administrator.`)
      }
      throw new Error(`${provider} login failed: ${error.message}`)
    }
  }

  const resetPassword = async (email: string) => {
    if (isDemoMode) {
      throw new Error('Password reset not available in demo mode')
    }

    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
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
    resetPassword,
    isDemoMode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}