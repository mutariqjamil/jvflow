import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Separator } from './ui/separator'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User, 
  Mail, 
  Phone, 
  Key,
  Shield,
  Globe,
  Zap,
  Settings,
  Database,
  Chrome,
  Facebook,
  Linkedin
} from 'lucide-react'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning' | 'pending'
  message: string
  details?: string
}

export function AuthTestPanel() {
  const { user, signIn, signUp, signInWithProvider, resetPassword, isDemoMode } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  
  // Test form states
  const [testEmail, setTestEmail] = useState('tj.analyst@gmail.com')
  const [testPassword, setTestPassword] = useState('Asdf123@')
  const [signupEmail, setSignupEmail] = useState('test@example.com')
  const [signupPassword, setSignupPassword] = useState('Test123!')
  const [signupName, setSignupName] = useState('Test User')
  const [resetEmail, setResetEmail] = useState('test@example.com')

  useEffect(() => {
    runSystemHealthCheck()
  }, [])

  const runSystemHealthCheck = async () => {
    const results: TestResult[] = []
    
    // 1. Supabase Configuration Check
    if (isSupabaseConfigured) {
      results.push({
        name: 'Supabase Configuration',
        status: 'success',
        message: 'Supabase client is properly configured',
        details: 'Project ID and anon key are present'
      })
    } else {
      results.push({
        name: 'Supabase Configuration',
        status: 'error',
        message: 'Supabase configuration missing',
        details: 'Check environment variables'
      })
    }

    // 2. Authentication Service Check
    try {
      const session = await supabase?.auth.getSession()
      results.push({
        name: 'Authentication Service',
        status: 'success',
        message: 'Auth service is accessible',
        details: `Session status: ${session?.data?.session ? 'Active' : 'None'}`
      })
    } catch (error) {
      results.push({
        name: 'Authentication Service',
        status: 'error',
        message: 'Auth service check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // 3. Super Admin Account Check
    if (user?.role === 'super_admin') {
      results.push({
        name: 'Super Admin Account',
        status: 'success',
        message: 'Super admin account is active',
        details: `Email: ${user.email}, Name: ${user.name}`
      })
    } else {
      results.push({
        name: 'Super Admin Account',
        status: 'warning',
        message: 'No super admin detected',
        details: 'Current user role: ' + (user?.role || 'None')
      })
    }

    // 4. Demo Mode Check
    results.push({
      name: 'Demo Mode Status',
      status: isDemoMode ? 'warning' : 'success',
      message: isDemoMode ? 'Running in demo mode' : 'Production mode active',
      details: isDemoMode ? 'Limited functionality available' : 'Full functionality available'
    })

    setTestResults(results)
  }

  const testLogin = async () => {
    setLoading(true)
    const results = [...testResults]
    
    try {
      await signIn(testEmail, testPassword)
      results.push({
        name: 'Login Test',
        status: 'success',
        message: 'Email/password login successful',
        details: `Logged in as: ${testEmail}`
      })
    } catch (error) {
      results.push({
        name: 'Login Test',
        status: 'error',
        message: 'Login test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    setTestResults(results)
    setLoading(false)
  }

  const testSignup = async () => {
    setLoading(true)
    const results = [...testResults]
    
    try {
      await signUp({
        email: signupEmail,
        password: signupPassword,
        name: signupName,
        registrationType: 'email'
      })
      results.push({
        name: 'Signup Test',
        status: 'success',
        message: 'User registration successful',
        details: `Account created for: ${signupEmail}`
      })
    } catch (error) {
      results.push({
        name: 'Signup Test',
        status: 'error',
        message: 'Signup test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    setTestResults(results)
    setLoading(false)
  }

  const testPasswordReset = async () => {
    setLoading(true)
    const results = [...testResults]
    
    try {
      await resetPassword(resetEmail)
      results.push({
        name: 'Password Reset Test',
        status: 'success',
        message: 'Password reset email sent',
        details: `Reset link sent to: ${resetEmail}`
      })
    } catch (error) {
      results.push({
        name: 'Password Reset Test',
        status: 'error',
        message: 'Password reset test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    setTestResults(results)
    setLoading(false)
  }

  const testOAuthProvider = async (provider: 'google' | 'facebook' | 'linkedin') => {
    setLoading(true)
    const results = [...testResults]
    
    try {
      await signInWithProvider(provider)
      results.push({
        name: `${provider} OAuth Test`,
        status: 'success',
        message: `${provider} OAuth initiated successfully`,
        details: `Provider: ${provider}`
      })
    } catch (error) {
      results.push({
        name: `${provider} OAuth Test`,
        status: 'error',
        message: `${provider} OAuth test failed`,
        details: error instanceof Error ? error.message : 'OAuth not configured'
      })
    }
    
    setTestResults(results)
    setLoading(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800">Pass</Badge>
      case 'error': return <Badge className="bg-red-100 text-red-800">Fail</Badge>
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
    }
  }

  if (!user || user.role !== 'super_admin') {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>Authentication System Test Panel</CardTitle>
          </div>
          <CardDescription>
            Comprehensive testing panel for authentication features (Super Admin Only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* System Health Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>System Health Check</span>
            </h3>
            
            <div className="space-y-2">
              {testResults.filter(r => ['Supabase Configuration', 'Authentication Service', 'Super Admin Account', 'Demo Mode Status'].includes(r.name)).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>
            
            <Button 
              onClick={runSystemHealthCheck} 
              variant="outline" 
              disabled={loading}
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              Refresh Health Check
            </Button>
          </div>

          <Separator />

          {/* Current User Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Current User Status</span>
            </h3>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Status:</strong> {user.subscription_status}</p>
                  <p><strong>Organizations:</strong> {user.organizations?.length || 0}</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          <Separator />

          {/* Login Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Login Test</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Test Email</Label>
                <Input
                  id="test-email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-password">Test Password</Label>
                <Input
                  id="test-password"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            </div>
            
            <Button onClick={testLogin} disabled={loading} className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Test Email/Password Login
            </Button>
          </div>

          <Separator />

          {/* Signup Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Signup Test</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
            </div>
            
            <Button onClick={testSignup} disabled={loading} className="w-full">
              <User className="h-4 w-4 mr-2" />
              Test User Registration
            </Button>
          </div>

          <Separator />

          {/* Password Reset Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Password Reset Test</h3>
            
            <div className="space-y-2">
              <Label htmlFor="reset-email">Reset Email</Label>
              <Input
                id="reset-email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Email for password reset"
              />
            </div>
            
            <Button onClick={testPasswordReset} disabled={loading} className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Test Password Reset
            </Button>
          </div>

          <Separator />

          {/* OAuth Providers Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>OAuth Providers Test</span>
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <Button 
                onClick={() => testOAuthProvider('google')} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Chrome className="h-4 w-4 mr-2" />
                Test Google
              </Button>
              <Button 
                onClick={() => testOAuthProvider('facebook')} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Test Facebook
              </Button>
              <Button 
                onClick={() => testOAuthProvider('linkedin')} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                Test LinkedIn
              </Button>
            </div>
          </div>

          <Separator />

          {/* Test Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Test Results</span>
            </h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.filter(r => !['Supabase Configuration', 'Authentication Service', 'Super Admin Account', 'Demo Mode Status'].includes(r.name)).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}