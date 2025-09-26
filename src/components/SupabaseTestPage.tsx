import React, { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './AuthProvider'
import { useInternationalization } from './providers/InternationalizationProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Database, 
  Users, 
  Shield, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Activity,
  DollarSign,
  Globe,
  Settings
} from 'lucide-react'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning' | 'pending'
  message: string
  details?: any
}

interface TableTestResult {
  table: string
  exists: boolean
  canRead: boolean
  canWrite: boolean
  canUpdate: boolean
  canDelete: boolean
  recordCount: number
  error?: string
}

export function SupabaseTestPage() {
  const { user, isDemoMode } = useAuth()
  const { formatCurrency, currentCurrency, language } = useInternationalization()
  
  // Test results state
  const [connectionTest, setConnectionTest] = useState<TestResult>({ 
    name: 'Connection Test', 
    status: 'pending', 
    message: 'Not tested' 
  })
  const [authTests, setAuthTests] = useState<TestResult[]>([])
  const [tableTests, setTableTests] = useState<TableTestResult[]>([])
  const [crudTests, setCrudTests] = useState<TestResult[]>([])
  
  // Form state for testing
  const [testData, setTestData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpass123',
    amount: 100000,
    description: 'Test entry for database validation'
  })

  // Define expected database tables
  const expectedTables = [
    'users',
    'organizations', 
    'projects',
    'expenses',
    'sales',
    'bookings',
    'commissions',
    'materials',
    'vendors',
    'purchase_orders',
    'milestones',
    'user_invitations',
    'audit_logs'
  ]

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setConnectionTest({ name: 'Connection Test', status: 'pending', message: 'Testing...' })
    
    try {
      if (isDemoMode) {
        setConnectionTest({
          name: 'Connection Test',
          status: 'warning',
          message: 'Running in demo mode - using mock Supabase client',
          details: { mode: 'demo', configured: isSupabaseConfigured }
        })
        return
      }

      if (!isSupabaseConfigured) {
        setConnectionTest({
          name: 'Connection Test',
          status: 'error',
          message: 'Supabase not configured - missing credentials',
          details: { configured: false }
        })
        return
      }

      // Test basic connection
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (error) {
        setConnectionTest({
          name: 'Connection Test',
          status: 'error',
          message: `Connection failed: ${error.message}`,
          details: error
        })
      } else {
        setConnectionTest({
          name: 'Connection Test',
          status: 'success',
          message: 'Successfully connected to Supabase',
          details: { configured: true, response: data }
        })
      }
    } catch (error) {
      setConnectionTest({
        name: 'Connection Test',
        status: 'error',
        message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      })
    }
  }

  const testAuthentication = async () => {
    const tests: TestResult[] = []

    // Test 1: Check current session
    try {
      const { data: session, error } = await supabase.auth.getSession()
      tests.push({
        name: 'Session Check',
        status: error ? 'error' : 'success',
        message: error ? `Session error: ${error.message}` : `Session status: ${session.session ? 'Active' : 'No active session'}`,
        details: { session: session.session, error }
      })
    } catch (error) {
      tests.push({
        name: 'Session Check',
        status: 'error',
        message: `Session test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      })
    }

    // Test 2: Test sign up (if not in demo mode)
    if (!isDemoMode && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: `test+${Date.now()}@example.com`,
          password: 'testpass123'
        })
        tests.push({
          name: 'Sign Up Test',
          status: error ? 'error' : 'success',
          message: error ? `Sign up failed: ${error.message}` : 'Sign up successful',
          details: { data, error }
        })
      } catch (error) {
        tests.push({
          name: 'Sign Up Test',
          status: 'error',
          message: `Sign up test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error
        })
      }
    } else {
      tests.push({
        name: 'Sign Up Test',
        status: 'warning',
        message: 'Skipped - Demo mode or Supabase not configured',
        details: { isDemoMode, isSupabaseConfigured }
      })
    }

    // Test 3: Password reset
    if (!isDemoMode && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
          testData.email,
          { redirectTo: `${window.location.origin}/reset-password` }
        )
        tests.push({
          name: 'Password Reset Test',
          status: error ? 'error' : 'success',
          message: error ? `Password reset failed: ${error.message}` : 'Password reset email sent',
          details: { data, error }
        })
      } catch (error) {
        tests.push({
          name: 'Password Reset Test',
          status: 'error',
          message: `Password reset test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error
        })
      }
    }

    setAuthTests(tests)
  }

  const testTables = async () => {
    const results: TableTestResult[] = []

    for (const tableName of expectedTables) {
      const result: TableTestResult = {
        table: tableName,
        exists: false,
        canRead: false,
        canWrite: false,
        canUpdate: false,
        canDelete: false,
        recordCount: 0
      }

      try {
        // Test table existence and read permission
        const { data: readData, error: readError, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(1)

        if (!readError) {
          result.exists = true
          result.canRead = true
          result.recordCount = count || 0
        } else {
          result.error = readError.message
        }

        // Test write permission (insert a test record)
        if (result.exists && !isDemoMode) {
          const testRecord = generateTestRecord(tableName)
          const { data: insertData, error: insertError } = await supabase
            .from(tableName)
            .insert([testRecord])
            .select()

          if (!insertError && insertData && insertData.length > 0) {
            result.canWrite = true
            const insertedId = insertData[0].id

            // Test update permission
            const { error: updateError } = await supabase
              .from(tableName)
              .update({ updated_at: new Date().toISOString() })
              .eq('id', insertedId)

            if (!updateError) {
              result.canUpdate = true
            }

            // Test delete permission
            const { error: deleteError } = await supabase
              .from(tableName)
              .delete()
              .eq('id', insertedId)

            if (!deleteError) {
              result.canDelete = true
            }
          }
        } else if (isDemoMode) {
          result.canWrite = false
          result.canUpdate = false
          result.canDelete = false
          result.error = 'Demo mode - write operations disabled'
        }

      } catch (error) {
        result.error = error instanceof Error ? error.message : 'Unknown error'
      }

      results.push(result)
    }

    setTableTests(results)
  }

  const generateTestRecord = (tableName: string) => {
    const baseRecord = {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    switch (tableName) {
      case 'users':
        return {
          ...baseRecord,
          email: `test+${Date.now()}@example.com`,
          name: 'Test User',
          role: 'admin'
        }
      case 'organizations':
        return {
          ...baseRecord,
          name: 'Test Organization',
          description: 'Test organization for validation',
          industry: 'Real Estate'
        }
      case 'projects':
        return {
          ...baseRecord,
          name: 'Test Project',
          description: 'Test project for validation',
          total_budget: 1000000,
          currency: 'PKR',
          location: 'Karachi, Pakistan'
        }
      case 'expenses':
        return {
          ...baseRecord,
          amount: testData.amount,
          currency: 'PKR',
          description: testData.description,
          category: 'Testing',
          status: 'pending'
        }
      case 'sales':
        return {
          ...baseRecord,
          unit_number: `TEST-${Date.now()}`,
          customer_name: testData.name,
          customer_email: testData.email,
          total_amount: testData.amount,
          currency: 'PKR',
          status: 'pending'
        }
      default:
        return {
          ...baseRecord,
          name: `Test ${tableName}`,
          description: testData.description
        }
    }
  }

  const testCRUDOperations = async () => {
    const tests: TestResult[] = []

    if (isDemoMode) {
      tests.push({
        name: 'CRUD Operations',
        status: 'warning',
        message: 'CRUD operations disabled in demo mode',
        details: { mode: 'demo' }
      })
      setCrudTests(tests)
      return
    }

    // Test Create operation
    try {
      const testRecord = {
        name: testData.name,
        email: testData.email,
        amount: testData.amount,
        currency: 'PKR',
        description: testData.description,
        created_at: new Date().toISOString()
      }

      // We'll use a generic test table or the audit_logs table for testing
      const { data: createData, error: createError } = await supabase
        .from('audit_logs')
        .insert([{
          action: 'TEST_CREATE',
          table_name: 'test',
          record_id: `test_${Date.now()}`,
          changes: testRecord,
          created_at: new Date().toISOString()
        }])
        .select()

      tests.push({
        name: 'Create Operation',
        status: createError ? 'error' : 'success',
        message: createError ? `Create failed: ${createError.message}` : 'Record created successfully',
        details: { data: createData, error: createError }
      })

      // Test Read operation
      const { data: readData, error: readError } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'TEST_CREATE')
        .limit(5)

      tests.push({
        name: 'Read Operation',
        status: readError ? 'error' : 'success',
        message: readError ? `Read failed: ${readError.message}` : `Found ${readData?.length || 0} test records`,
        details: { data: readData, error: readError }
      })

    } catch (error) {
      tests.push({
        name: 'CRUD Operations',
        status: 'error',
        message: `CRUD test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      })
    }

    setCrudTests(tests)
  }

  const runAllTests = async () => {
    await testConnection()
    await testAuthentication()
    await testTables()
    await testCRUDOperations()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default: return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      error: 'destructive', 
      warning: 'secondary',
      pending: 'outline'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TestTube className="h-8 w-8 text-blue-600" />
              Supabase Test Suite
            </h1>
            <p className="text-muted-foreground">
              Comprehensive testing for database connectivity, authentication, and CRUD operations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={runAllTests} size="lg">
              Run All Tests
            </Button>
          </div>
        </div>

        {/* Configuration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Environment</Label>
                <div className="flex items-center gap-2">
                  {isDemoMode ? (
                    <Badge variant="secondary">Demo Mode</Badge>
                  ) : (
                    <Badge variant="default">Production</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Supabase Status</Label>
                <div className="flex items-center gap-2">
                  {isSupabaseConfigured ? (
                    <Badge variant="default">Configured</Badge>
                  ) : (
                    <Badge variant="destructive">Not Configured</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">{currentCurrency.code} - {currentCurrency.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">{language.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="connection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="crud">CRUD Operations</TabsTrigger>
          </TabsList>

          {/* Connection Tests */}
          <TabsContent value="connection">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Connection Test
                </CardTitle>
                <CardDescription>
                  Test basic connectivity to Supabase database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(connectionTest.status)}
                    <div>
                      <p className="font-medium">{connectionTest.name}</p>
                      <p className="text-sm text-muted-foreground">{connectionTest.message}</p>
                    </div>
                  </div>
                  {getStatusBadge(connectionTest.status)}
                </div>

                {connectionTest.details && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Connection Details</summary>
                    <pre className="mt-2 p-4 bg-muted rounded-lg text-sm overflow-auto">
                      {JSON.stringify(connectionTest.details, null, 2)}
                    </pre>
                  </details>
                )}

                <Button onClick={testConnection} variant="outline">
                  Retry Connection Test
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authentication Tests */}
          <TabsContent value="auth">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication Tests
                </CardTitle>
                <CardDescription>
                  Test user authentication and authorization features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {authTests.length === 0 ? (
                  <p className="text-muted-foreground">No authentication tests run yet</p>
                ) : (
                  <div className="space-y-3">
                    {authTests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-muted-foreground">{test.message}</p>
                          </div>
                        </div>
                        {getStatusBadge(test.status)}
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Test Data Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="testEmail">Test Email</Label>
                      <Input
                        id="testEmail"
                        type="email"
                        value={testData.email}
                        onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testPassword">Test Password</Label>
                      <Input
                        id="testPassword"
                        type="password"
                        value={testData.password}
                        onChange={(e) => setTestData(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={testAuthentication} className="w-full">
                  Run Authentication Tests
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tables Tests */}
          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Tables Test
                </CardTitle>
                <CardDescription>
                  Verify all expected tables exist and test permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tableTests.length === 0 ? (
                  <p className="text-muted-foreground">No table tests run yet</p>
                ) : (
                  <div className="space-y-3">
                    {tableTests.map((test, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{test.table}</h4>
                          <div className="flex gap-2">
                            {test.exists && <Badge variant="default">EXISTS</Badge>}
                            {test.canRead && <Badge variant="secondary">READ</Badge>}
                            {test.canWrite && <Badge variant="secondary">WRITE</Badge>}
                            {test.canUpdate && <Badge variant="secondary">UPDATE</Badge>}
                            {test.canDelete && <Badge variant="secondary">DELETE</Badge>}
                          </div>
                        </div>
                        
                        <div className="text-sm space-y-1">
                          <p>Records: <span className="font-medium">{test.recordCount}</span></p>
                          {test.error && (
                            <p className="text-red-500">Error: {test.error}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button onClick={testTables} className="w-full">
                  Test All Tables
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CRUD Tests */}
          <TabsContent value="crud">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  CRUD Operations Test
                </CardTitle>
                <CardDescription>
                  Test Create, Read, Update, Delete operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {crudTests.length === 0 ? (
                  <p className="text-muted-foreground">No CRUD tests run yet</p>
                ) : (
                  <div className="space-y-3">
                    {crudTests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-muted-foreground">{test.message}</p>
                          </div>
                        </div>
                        {getStatusBadge(test.status)}
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Test Data</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="testName">Name</Label>
                      <Input
                        id="testName"
                        value={testData.name}
                        onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testAmount">Amount ({currentCurrency.code})</Label>
                      <Input
                        id="testAmount"
                        type="number"
                        value={testData.amount}
                        onChange={(e) => setTestData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Formatted: {formatCurrency(testData.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testDescription">Description</Label>
                    <Textarea
                      id="testDescription"
                      value={testData.description}
                      onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={testCRUDOperations} className="w-full">
                  Run CRUD Tests
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {connectionTest.status === 'success' ? '1' : '0'}/1
                </div>
                <p className="text-sm text-muted-foreground">Connection</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {authTests.filter(t => t.status === 'success').length}/{authTests.length}
                </div>
                <p className="text-sm text-muted-foreground">Authentication</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">
                  {tableTests.filter(t => t.exists).length}/{expectedTables.length}
                </div>
                <p className="text-sm text-muted-foreground">Tables</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-600">
                  {crudTests.filter(t => t.status === 'success').length}/{crudTests.length}
                </div>
                <p className="text-sm text-muted-foreground">CRUD Ops</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SupabaseTestPage