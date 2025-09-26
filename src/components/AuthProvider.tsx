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
  const [isSignedOut, setIsSignedOut] = useState(false) // Track if user manually signed out
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
    if (isDemoMode) {
      authLog('debug', 'Skipping profile refresh in demo mode')
      return
    }
    
    if (!supabase) {
      authLog('error', 'Supabase not available for profile refresh')
      return
    }

    try {
      authLog('debug', 'Starting profile refresh')
      
      // Get current user from Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        authLog('error', 'Failed to get current user', { error: userError?.message })
        return
      }

      // Create a user profile from Supabase user data with metadata
      // Check if this is the super admin email
      const isSuperAdmin = user.email === 'tj.analyst@gmail.com'
      
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email!,
        role: isSuperAdmin ? 'super_admin' : 'admin', // Set super admin role for tj.analyst@gmail.com
        name: user.user_metadata?.name || (isSuperAdmin ? 'Muhammad Tariq (Super Admin)' : user.email!.split('@')[0]),
        registration_type: user.user_metadata?.registration_type || 'email',
        subscription_status: user.user_metadata?.subscription_status || (isSuperAdmin ? 'active' : 'trial'),
        trial_start_date: user.user_metadata?.trial_start_date || new Date().toISOString(),
        trial_end_date: user.user_metadata?.trial_end_date || new Date(Date.now() + (isSuperAdmin ? 365 : 31) * 24 * 60 * 60 * 1000).toISOString(),
        phone: user.user_metadata?.phone
      }

      // Create organization(s) based on user role
      let organizations: Organization[]
      let currentOrg: Organization
      
      if (isSuperAdmin) {
        // Super admin gets both platform admin and demo org access
        const platformAdminOrg: Organization = {
          id: 'platform-admin',
          name: 'JV-Flow Platform Administration',
          description: 'Super admin organization for platform management',
          industry: 'Platform Management',
          owner_id: user.id,
          subscription_status: 'active',
          trial_end_date: userProfile.trial_end_date,
          user_role: 'super_admin',
          user_permissions: ['*', 'platform.*', 'super_admin.*']
        }
        
        const demoOrg: Organization = {
          id: 'default-org',
          name: 'Demo Real Estate Company',
          description: 'Demo organization for testing JV-Flow features',
          industry: 'Real Estate',
          owner_id: user.id,
          subscription_status: 'active',
          trial_end_date: userProfile.trial_end_date,
          user_role: 'admin',
          user_permissions: ['*']
        }
        
        organizations = [platformAdminOrg, demoOrg]
        currentOrg = platformAdminOrg // Start with platform admin
      } else {
        // Regular users get a single organization
        const defaultOrg: Organization = {
          id: `org-${user.id}`,
          name: `${userProfile.name.replace(' (Super Admin)', '')}'s Organization`,
          description: 'Personal organization for project management',
          industry: 'Real Estate',
          owner_id: user.id,
          subscription_status: userProfile.subscription_status as 'trial' | 'active' | 'expired',
          trial_end_date: userProfile.trial_end_date,
          user_role: 'admin',
          user_permissions: ['*']
        }
        
        organizations = [defaultOrg]
        currentOrg = defaultOrg
      }

      // Calculate trial days remaining
      const trialEndDate = new Date(userProfile.trial_end_date || '')
      const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      
      setUser(userProfile)
      setOrganizations(organizations)
      setCurrentOrganization(currentOrg)
      setTrialDaysRemaining(daysRemaining)
      
      authLog('info', 'Profile refresh completed successfully', { userId: user.id, email: user.email, daysRemaining })
      
      // Try to fetch additional profile data from API (non-blocking)
      authLog('debug', 'Starting API profile fetch (non-blocking)')
      setTimeout(async () => {
        try {
          authLog('debug', 'Attempting API call to /profile')
          const data = await apiCall('/profile')
          if (data.user) {
            authLog('debug', 'Enhanced profile data loaded from API')
            setUser({ ...userProfile, ...data.user })
            if (data.organizations?.length > 0) {
              setOrganizations(data.organizations)
              setCurrentOrganization(data.organizations[0])
            }
            setTrialDaysRemaining(data.trial_days_remaining || daysRemaining)
          }
        } catch (apiError) {
          authLog('warn', 'API profile fetch failed, using basic profile', { error: apiError instanceof Error ? apiError.message : 'Unknown error' })
          // Continue with basic profile - don't block the user
        }
      }, 100) // Delay API call to ensure UI updates first
      
    } catch (error) {
      authLog('error', 'Profile refresh failed', { error: error instanceof Error ? error.message : 'Unknown error' })
      // Don't throw - allow user to continue with whatever state we have
    }
  }

  useEffect(() => {
    // Check if user has manually signed out
    const hasSignedOut = localStorage.getItem('userSignedOut') === 'true'
    if (hasSignedOut) {
      setIsSignedOut(true)
      setLoading(false)
      return
    }

    // Check for stored demo auth state
    if (isDemoMode) {
      const demoAuthState = localStorage.getItem('demo_auth_state')
      if (demoAuthState) {
        try {
          const { user: storedUser, timestamp } = JSON.parse(demoAuthState)
          // Check if the stored auth is not too old (24 hours)
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            authLog('info', 'Restoring demo auth state from localStorage')
            
            // Use CONSISTENT demo organizations
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
            
            setUser(storedUser)
            setOrganizations([platformAdminOrg, defaultOrg])
            setCurrentOrganization(platformAdminOrg) // Start with platform admin
            setTrialDaysRemaining(365)
            setLoading(false)
            return
          } else {
            // Remove expired auth state
            localStorage.removeItem('demo_auth_state')
          }
        } catch (error) {
          authLog('warn', 'Failed to restore demo auth state', { error })
          localStorage.removeItem('demo_auth_state')
        }
      }
    }

    // Only create default demo user in demo mode if not signed out
    if (!isSignedOut && isDemoMode) {
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
    }
    
    if (isDemoMode) {
      return
    }

    if (!supabase) {
      setLoading(false)
      return
    }

    // Set a timeout to ensure loading doesn't hang indefinitely
    const loadingTimeout = setTimeout(() => {
      authLog('warn', 'Auth initialization timeout, setting loading to false')
      setLoading(false)
    }, 5000) // 5 second timeout

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      clearTimeout(loadingTimeout)
      
      if (error) {
        authLog('error', 'Failed to get initial session', { error: error.message })
        setLoading(false)
        return
      }
      
      if (session?.user) {
        authLog('debug', 'Initial session found, refreshing profile')
        await refreshProfile()
      } else {
        authLog('debug', 'No initial session found')
      }
      setLoading(false)
    }).catch((error) => {
      clearTimeout(loadingTimeout)
      authLog('error', 'Error getting initial session', { error: error.message })
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        authLog('info', 'Auth state change detected', { event, hasSession: !!session, userId: session?.user?.id })
        
        if (session?.user) {
          authLog('info', 'User session found, starting profile refresh')
          try {
            await refreshProfile()
            authLog('info', 'Profile refresh completed, setting loading to false')
          } catch (error) {
            authLog('error', 'Profile refresh failed in auth state change', { error: error instanceof Error ? error.message : 'Unknown error' })
          }
        } else {
          authLog('info', 'No user session, clearing user data')
          setUser(null)
          setOrganizations([])
          setCurrentOrganization(null)
          setTrialDaysRemaining(0)
        }
        setLoading(false)
        authLog('info', 'Auth state change processing completed')
      }
    )

    return () => {
      clearTimeout(loadingTimeout)
      subscription.unsubscribe()
    }
  }, [isDemoMode])

  const signIn = async (email: string, password: string) => {
    logger.startTimer('signin-process')
    authLog('info', 'Sign in attempt started', { email: email.substring(0, 3) + '***' })
    
    try {
      if (isDemoMode) {
        authLog('info', 'Demo mode authentication', { email })
        
        // Enhanced demo credentials with role-based users
        const demoUsers = {
          'tj.analyst@gmail.com': ['Asdf123@', '123456'], // Super Admin
          'rizwan@chawla.co': ['123456', 'admin123'], // Regular Admin
          'demo@jvflow.com': 'demo123',
          'admin@jvflow.com': 'admin123',
          'test@jvflow.com': 'test123'
        }
        
        const validPasswords = demoUsers[email as keyof typeof demoUsers]
        const isValidLogin = Array.isArray(validPasswords) 
          ? validPasswords.includes(password)
          : validPasswords === password
        
        if (isValidLogin) {
          authLog('info', 'Demo authentication successful', { email })
          
          // Clear signed out state when user signs back in
          setIsSignedOut(false)
          localStorage.removeItem('userSignedOut')
          
          // Create user profile based on email
          let userProfile: UserProfile
          let organizations: Organization[]
          let currentOrg: Organization
          
          if (email === 'tj.analyst@gmail.com') {
            // Super Admin User
            userProfile = {
              id: 'super-admin-001',
              email: 'tj.analyst@gmail.com',
              role: 'super_admin',
              name: 'Muhammad Tariq',
              registration_type: 'email',
              subscription_status: 'active',
              trial_start_date: new Date().toISOString(),
              trial_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              organizations: ['platform-admin', 'default-org']
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
            
            organizations = [platformAdminOrg, defaultOrg]
            currentOrg = platformAdminOrg // Start with platform admin
            
          } else if (email === 'rizwan@chawla.co') {
            // Regular Admin User
            userProfile = {
              id: 'demo-user-001',
              email: 'rizwan@chawla.co',
              role: 'admin',
              name: 'Rizwan Chawla',
              registration_type: 'email',
              subscription_status: 'trial',
              trial_start_date: new Date().toISOString(),
              trial_end_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
              organizations: ['demo-org']
            }
            
            const demoOrg: Organization = {
              id: 'demo-org',
              name: 'Chawla Real Estate Solutions',
              description: 'Demo organization for regular admin testing',
              industry: 'Real Estate',
              owner_id: 'demo-user-001',
              subscription_status: 'trial',
              trial_end_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
              user_role: 'admin',
              user_permissions: ['*']
            }
            
            organizations = [demoOrg]
            currentOrg = demoOrg
            
          } else {
            // Default user for other emails
            userProfile = {
              id: 'demo-user-generic',
              email: email,
              role: 'admin',
              name: email.split('@')[0],
              registration_type: 'email',
              subscription_status: 'trial',
              trial_start_date: new Date().toISOString(),
              trial_end_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
              organizations: ['demo-org']
            }
            
            const demoOrg: Organization = {
              id: 'demo-org',
              name: 'Demo Organization',
              description: 'Demo organization for testing',
              industry: 'Real Estate',
              owner_id: 'demo-user-generic',
              subscription_status: 'trial',
              trial_end_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
              user_role: 'admin',
              user_permissions: ['*']
            }
            
            organizations = [demoOrg]
            currentOrg = demoOrg
          }
          
          // Calculate trial days based on user type
          const trialDays = userProfile.role === 'super_admin' ? 365 : 31
          
          // Set user state immediately
          setUser(userProfile)
          setOrganizations(organizations)
          setCurrentOrganization(currentOrg)
          setTrialDaysRemaining(trialDays)
          setLoading(false)
          
          // Store auth state for persistence
          const authState = { user: userProfile, timestamp: Date.now() }
          localStorage.setItem('demo_auth_state', JSON.stringify(authState))
          
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
    try {
      if (isDemoMode) {
        authLog('info', 'Demo mode signup attempt', { 
          email: data.email?.substring(0, 3) + '***',
          registrationType: data.registrationType 
        })
        
        // Simulate successful signup in demo mode
        const demoResponse = {
          message: 'Demo account created successfully! You can now sign in with your credentials.',
          user: {
            id: `demo-user-${Date.now()}`,
            email: data.email,
            phone: data.phone,
            name: data.name,
            registration_type: data.registrationType
          }
        }
        
        authLog('info', 'Demo signup successful', { 
          userId: demoResponse.user.id,
          email: data.email?.substring(0, 3) + '***'
        })
        
        return demoResponse
      }

      // Live mode signup with Supabase
      if (!supabase) {
        throw new Error('Authentication service not available')
      }

      const signupData: any = {
        password: data.password,
        options: {
          data: {
            name: data.name,
            registration_type: data.registrationType
          }
        }
      }

      if (data.registrationType === 'email' && data.email) {
        signupData.email = data.email
      } else if (data.registrationType === 'phone' && data.phone) {
        signupData.phone = data.phone
      } else {
        throw new Error('Invalid registration data')
      }

      const { data: authData, error } = await supabase.auth.signUp(signupData)

      if (error) {
        authLog('error', 'Supabase signup failed', { 
          error: error.message,
          email: data.email?.substring(0, 3) + '***'
        })
        throw new Error(error.message || 'Signup failed')
      }

      authLog('info', 'Supabase signup successful', { 
        userId: authData.user?.id,
        email: data.email?.substring(0, 3) + '***'
      })

      return {
        message: authData.user?.email_confirmed_at 
          ? 'Account created successfully! You can now sign in.' 
          : 'Account created! Please check your email to confirm your account.',
        user: authData.user
      }
    } catch (error) {
      authLog('error', 'Signup process failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        email: data.email?.substring(0, 3) + '***'
      })
      throw error
    }
  }

  const signOut = async () => {
    // Set signed out state and persist to localStorage
    setIsSignedOut(true)
    localStorage.setItem('userSignedOut', 'true')
    
    // Clear demo auth state
    localStorage.removeItem('demo_auth_state')
    
    // Clear all user data
    setUser(null)
    setOrganizations([])
    setCurrentOrganization(null)
    setTrialDaysRemaining(0)

    if (isDemoMode) {
      return
    }

    if (!supabase) {
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
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