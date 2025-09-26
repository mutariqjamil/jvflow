import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { supabase } from '../lib/supabase'

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isDemoMode } = useAuth()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validSession, setValidSession] = useState(false)
  
  // Get the access_token and refresh_token from URL parameters
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')
  const type = searchParams.get('type')

  useEffect(() => {
    const validateSession = async () => {
      if (isDemoMode) {
        setError('Password reset is not available in demo mode')
        return
      }

      // Debug: Log all URL parameters to understand the structure
      console.log('URL Parameters:', {
        access_token: accessToken?.substring(0, 10) + '...',
        refresh_token: refreshToken?.substring(0, 10) + '...',
        type,
        allParams: Object.fromEntries(searchParams)
      })

      // Check for different URL parameter structures
      // Supabase might use different parameter names in different versions
      const token = accessToken || searchParams.get('token')
      const refreshTkn = refreshToken || searchParams.get('refresh_token')
      const resetType = type || searchParams.get('type')
      
      // Allow both 'recovery' and 'reset' types
      if (resetType && !['recovery', 'reset', 'password_recovery'].includes(resetType)) {
        setError(`Invalid reset type: ${resetType}. Please request a new password reset.`)
        return
      }

      // If we have at least an access token, try to proceed
      if (!token) {
        setError('No access token found. Please request a new password reset.')
        return
      }

      try {
        // Try to set the session with available tokens
        const sessionData: any = { access_token: token }
        if (refreshTkn) {
          sessionData.refresh_token = refreshTkn
        }

        console.log('Attempting to set session with:', {
          hasAccessToken: !!token,
          hasRefreshToken: !!refreshTkn
        })

        const { data, error } = await supabase.auth.setSession(sessionData)

        if (error) {
          console.error('Session error:', error)
          setError(`Session error: ${error.message}. The reset link may be invalid or expired.`)
          return
        }

        if (data.session) {
          console.log('Session validated successfully')
          setValidSession(true)
          setError('') // Clear any previous errors
        } else {
          setError('No session created. The reset link may be invalid or expired.')
        }
      } catch (err) {
        console.error('Validation error:', err)
        setError(`Failed to validate reset link: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    validateSession()
  }, [searchParams, isDemoMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validSession) {
      setError('Invalid session. Please request a new password reset.')
      return
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message || 'Failed to update password')
        return
      }

      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/')
      }, 3000)

    } catch (err) {
      setError('Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/')
  }

  if (isDemoMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Password Reset</CardTitle>
            <CardDescription>Demo Mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Password reset is not available in demo mode.
              </AlertDescription>
            </Alert>
            <Button onClick={handleBackToLogin} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-600">Password Updated!</CardTitle>
            <CardDescription>Your password has been successfully updated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your password has been successfully updated. You will be redirected to the login page shortly.
              </AlertDescription>
            </Alert>
            <Button onClick={handleBackToLogin} className="w-full">
              Go to Login Now
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12"
                  disabled={!validSession || loading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 pr-12"
                  disabled={!validSession || loading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12" 
              disabled={!validSession || loading}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                {!validSession && (
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setValidSession(true)
                        setError('')
                      }}
                      className="text-xs"
                    >
                      Try Anyway
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={handleBackToLogin}
              className="text-sm"
            >
              Back to Login
            </Button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-medium">Password Requirements:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• At least 6 characters long</li>
              <li>• Must match confirmation password</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}