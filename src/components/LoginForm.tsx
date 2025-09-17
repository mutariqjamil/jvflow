import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { AlertCircle, Building2, TrendingUp, Users, Shield, Mail, Phone, Chrome, Facebook, Linkedin } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { useAuth } from './AuthProvider'
import { useInternationalization } from './providers/InternationalizationProvider'

export function LoginForm() {
  const { signIn, signInWithProvider, signUp, isDemoMode } = useAuth()
  const { t, direction } = useInternationalization()
  const [activeTab, setActiveTab] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    registrationType: 'email' as 'email' | 'phone'
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signInEmail || !signInPassword) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      await signIn(signInEmail, signInPassword)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!signUpData.name || !signUpData.password) {
      setError('Please fill in all required fields')
      return
    }

    if (signUpData.registrationType === 'email' && !signUpData.email) {
      setError('Please enter your email address')
      return
    }

    if (signUpData.registrationType === 'phone' && !signUpData.phone) {
      setError('Please enter your phone number')
      return
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await signUp({
        email: signUpData.registrationType === 'email' ? signUpData.email : undefined,
        phone: signUpData.registrationType === 'phone' ? signUpData.phone : undefined,
        password: signUpData.password,
        name: signUpData.name,
        registrationType: signUpData.registrationType
      })
      setSuccess('Account created successfully! You can now sign in with your credentials.')
      setActiveTab('signin')
      setSignInEmail(signUpData.registrationType === 'email' ? signUpData.email : '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'linkedin') => {
    setLoading(true)
    setError('')

    try {
      await signInWithProvider(provider)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Social sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setSignInEmail('demo@jvflow.com')
    setSignInPassword('demo123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir={direction}>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">JV-Flow</h1>
                <p className="text-gray-600">Real Estate Joint Venture Management</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg text-gray-700">
                Streamline your real estate development projects with comprehensive tracking, 
                transparent reporting, and efficient collaboration tools.
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  31-Day Free Trial
                </Badge>
                <Badge variant="outline">
                  No Credit Card Required
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Financial Transparency</h3>
                <p className="text-gray-600">Real-time expense tracking with maker-checker approval workflows</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Multi-stakeholder Management</h3>
                <p className="text-gray-600">Role-based dashboards for investors, builders, and marketing agencies</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Complete Audit Trail</h3>
                <p className="text-gray-600">Enterprise-grade security with comprehensive transaction logging</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">
                {activeTab === 'signin' ? 'Welcome Back' : 'Join JV-Flow'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'signin' 
                  ? 'Sign in to your account to continue' 
                  : 'Start your 31-day free trial today'
                }
              </CardDescription>
              {isDemoMode && (
                <Alert className="text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Demo Mode:</strong> Use any credentials to sign in or create account
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  {/* Social Sign In Buttons */}
                  {!isDemoMode && (
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialSignIn('google')}
                        disabled={loading}
                      >
                        <Chrome className="w-4 h-4 mr-2" />
                        Continue with Google
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialSignIn('facebook')}
                        disabled={loading}
                      >
                        <Facebook className="w-4 h-4 mr-2" />
                        Continue with Facebook
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialSignIn('linkedin')}
                        disabled={loading}
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        Continue with LinkedIn
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with email
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>

                  {/* Demo Login Button */}
                  {isDemoMode && (
                    <div className="pt-4 border-t">
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleDemoLogin}
                      >
                        Use Demo Credentials
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Registration Method</Label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant={signUpData.registrationType === 'email' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSignUpData(prev => ({ ...prev, registrationType: 'email' }))}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                        <Button
                          type="button"
                          variant={signUpData.registrationType === 'phone' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSignUpData(prev => ({ ...prev, registrationType: 'phone' }))}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Phone
                        </Button>
                      </div>
                    </div>

                    {signUpData.registrationType === 'email' ? (
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email Address</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Phone Number</Label>
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={signUpData.phone}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password (min 6 characters)"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Start Free Trial'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {activeTab === 'signup' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                  <p className="font-medium">🎉 Free Trial Benefits:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• 31 days completely free</li>
                    <li>• Full access to all features</li>
                    <li>• No credit card required</li>
                    <li>• Cancel anytime</li>
                  </ul>
                </div>
              )}

              {!isDemoMode && activeTab === 'signin' && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Forgot your password?{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Reset it here
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}