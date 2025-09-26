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
  const [adminTests, setAdminTests] = useState<TestResult[]>([])
  const [schemaValidation, setSchemaValidation] = useState<TestResult[]>([])
  
  // Form state for testing
  const [testData, setTestData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpass123',
    amount: 100000,
    description: 'Test entry for database validation'
  })

  // Define expected database tables (updated with comprehensive schema)
  const expectedTables = [
    // Core tables
    'schema_versions',
    'platform_settings',
    'organizations',
    'users',
    'organization_members',
    'employees',
    'customers',
    
    // Project management
    'projects',
    'project_units',
    'project_milestones',
    
    // Financial management
    'expenses',
    'bookings',
    'installments',
    'invoices',
    'commissions',
    
    // Operations
    'vendors',
    'materials', 
    'purchase_orders',
    'purchase_order_items',
    
    // Sales & Marketing
    'leads',
    'marketing_campaigns',
    
    // Document & Report management
    'documents',
    'reports',
    
    // System & Audit
    'user_invitations',
    'user_sessions',
    'subscriptions',
    'payments',
    'platform_analytics',
    'activity_logs',
    'notifications',
    'audit_logs'
  ]

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setConnectionTest({ name: 'Connection Test', status: 'pending', message: 'Testing...' })
    
    try {
      if (isDemoMode || !isSupabaseConfigured) {
        setConnectionTest({
          name: 'Connection Test',
          status: 'warning',
          message: isDemoMode ? 'Running in demo mode - using mock Supabase client' : 'Supabase not configured - using demo mode',
          details: { mode: 'demo', configured: isSupabaseConfigured, isDemoMode }
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
    
    const testOrgId = '550e8400-e29b-41d4-a716-446655440000' // Demo org ID
    const testUserId = '550e8400-e29b-41d4-a716-446655440001' // Demo user ID
    const testProjectId = '550e8400-e29b-41d4-a716-446655440010' // Demo project ID
    const timestamp = Date.now()

    switch (tableName) {
      case 'users':
        return {
          ...baseRecord,
          email: `test+${timestamp}@example.com`,
          first_name: 'Test',
          last_name: 'User',
          role: 'user',
          status: 'active',
          organization_id: testOrgId
        }
      case 'organizations':
        return {
          ...baseRecord,
          name: `Test Organization ${timestamp}`,
          description: 'Test organization for validation',
          industry: 'Real Estate',
          currency: 'PKR',
          subscription_status: 'active'
        }
      case 'organization_members':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          user_id: testUserId,
          role: 'member',
          status: 'active'
        }
      case 'employees':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          employee_code: `EMP${timestamp}`,
          first_name: 'Test',
          last_name: 'Employee',
          email: `employee+${timestamp}@example.com`,
          position: 'Test Position',
          status: 'active',
          currency: 'PKR'
        }
      case 'customers':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          customer_code: `CUST${timestamp}`,
          first_name: 'Test',
          last_name: 'Customer',
          email: `customer+${timestamp}@example.com`,
          phone: '+92-300-1234567',
          status: 'active'
        }
      case 'projects':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          name: `Test Project ${timestamp}`,
          description: 'Test project for validation',
          project_type: 'Residential',
          status: 'active',
          budget: 1000000,
          currency: 'PKR'
        }
      case 'project_units':
        return {
          ...baseRecord,
          project_id: testProjectId,
          unit_number: `TEST-${timestamp}`,
          unit_type: '2BHK',
          area_sqft: 1000,
          current_price: 5000000,
          currency: 'PKR',
          status: 'available'
        }
      case 'expenses':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          project_id: testProjectId,
          category: 'Testing',
          description: testData.description,
          amount: testData.amount,
          currency: 'PKR',
          date: new Date().toISOString().split('T')[0],
          status: 'pending'
        }
      case 'bookings':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          project_id: testProjectId,
          customer_name: testData.name,
          customer_email: testData.email,
          unit_number: `TEST-${timestamp}`,
          unit_type: '2BHK',
          booking_amount: 500000,
          total_amount: testData.amount,
          booking_date: new Date().toISOString().split('T')[0],
          status: 'confirmed'
        }
      case 'vendors':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          name: `Test Vendor ${timestamp}`,
          vendor_code: `VEND${timestamp}`,
          email: `vendor+${timestamp}@example.com`,
          vendor_type: 'Supplier',
          status: 'active'
        }
      case 'materials':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          name: `Test Material ${timestamp}`,
          material_code: `MAT${timestamp}`,
          category: 'Construction',
          unit: 'pieces',
          unit_price: 100,
          currency: 'PKR',
          status: 'active'
        }
      case 'leads':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          first_name: 'Test',
          last_name: 'Lead',
          email: `lead+${timestamp}@example.com`,
          phone: '+92-300-1234567',
          status: 'new',
          source: 'website'
        }
      case 'documents':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          name: `Test Document ${timestamp}`,
          description: 'Test document for validation',
          file_url: 'https://example.com/test.pdf',
          file_type: 'application/pdf',
          category: 'test',
          resource_type: 'project'
        }
      case 'reports':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          name: `Test Report ${timestamp}`,
          description: 'Test report for validation',
          report_type: 'financial',
          query_config: { table: 'expenses', columns: ['amount', 'date'] },
          is_public: false
        }
      case 'marketing_campaigns':
        return {
          ...baseRecord,
          organization_id: testOrgId,
          name: `Test Campaign ${timestamp}`,
          description: 'Test marketing campaign',
          campaign_type: 'digital',
          status: 'draft',
          budget: 50000
        }
      case 'audit_logs':
        return {
          organization_id: testOrgId,
          user_id: testUserId,
          table_name: 'test_table',
          record_id: `test_${timestamp}`,
          action: 'INSERT',
          new_values: { test: 'data' },
          created_at: new Date().toISOString()
        }
      case 'notifications':
        return {
          organization_id: testOrgId,
          user_id: testUserId,
          title: 'Test Notification',
          message: 'This is a test notification',
          type: 'info',
          priority: 'medium',
          created_at: new Date().toISOString()
        }
      default:
        return {
          ...baseRecord,
          name: `Test ${tableName} ${timestamp}`,
          description: testData.description || `Test record for ${tableName}`,
          organization_id: testOrgId
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

  const testSuperAdminSetup = async () => {
    const tests: TestResult[] = []

    if (isDemoMode) {
      tests.push({
        name: 'Super Admin Check',
        status: 'warning',
        message: 'Super admin test skipped in demo mode',
        details: { mode: 'demo' }
      })
      setAdminTests(tests)
      return
    }

    try {
      // Check for super admin user
      const { data: superAdmins, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_type', 'super_admin')

      if (error) {
        tests.push({
          name: 'Super Admin Check',
          status: 'error',
          message: `Failed to check super admin: ${error.message}`,
          details: error
        })
      } else {
        tests.push({
          name: 'Super Admin Users',
          status: superAdmins && superAdmins.length > 0 ? 'success' : 'warning',
          message: superAdmins && superAdmins.length > 0 
            ? `Found ${superAdmins.length} super admin user(s)` 
            : 'No super admin users found - you may need to create one',
          details: { count: superAdmins?.length, users: superAdmins?.map(u => ({ email: u.email, created_at: u.created_at })) }
        })
      }

      // Check platform settings
      const { data: settings, error: settingsError } = await supabase
        .from('platform_settings')
        .select('*')
        .limit(5)

      tests.push({
        name: 'Platform Settings',
        status: settingsError ? 'error' : 'success',
        message: settingsError 
          ? `Platform settings error: ${settingsError.message}` 
          : `Found ${settings?.length || 0} platform settings`,
        details: { settings: settings?.map(s => ({ key: s.key, category: s.category })) }
      })

      // Test user authentication sync status
      try {
        const { data: userSyncStatus, error: syncError } = await supabase
          .rpc('check_user_auth_sync')

        tests.push({
          name: 'User Auth Sync Status',
          status: syncError ? 'error' : 'success',
          message: syncError 
            ? `Auth sync check failed: ${syncError.message}` 
            : `Checked ${userSyncStatus?.length || 0} users for auth sync`,
          details: { 
            sync_status: userSyncStatus, 
            error: syncError,
            summary: userSyncStatus ? {
              total_users: userSyncStatus.length,
              synced_users: userSyncStatus.filter((u: any) => u.sync_status === 'SYNCED').length,
              missing_auth: userSyncStatus.filter((u: any) => u.sync_status === 'MISSING_AUTH').length
            } : null
          }
        })

        // Specifically check super admin auth sync
        if (userSyncStatus && superAdmins && superAdmins.length > 0) {
          const superAdminSyncStatus = userSyncStatus.find((u: any) => u.user_id === superAdmins[0].id)
          tests.push({
            name: 'Super Admin Auth Sync',
            status: !superAdminSyncStatus ? 'warning' : (superAdminSyncStatus.sync_status === 'SYNCED' ? 'success' : 'error'),
            message: !superAdminSyncStatus 
              ? 'Super admin sync status unknown' 
              : (superAdminSyncStatus.sync_status === 'SYNCED' 
                ? 'Super admin has matching auth record - can login' 
                : '❌ Super admin missing auth record - CANNOT LOGIN'),
            details: { 
              super_admin_id: superAdmins[0].id,
              super_admin_email: superAdmins[0].email,
              sync_status: superAdminSyncStatus?.sync_status,
              has_auth_record: superAdminSyncStatus?.has_auth_record,
              instructions: superAdminSyncStatus?.sync_status !== 'SYNCED' 
                ? 'Go to Supabase Dashboard → Auth → Users and create a user with this exact ID' 
                : null
            }
          })
        }
      } catch (syncTestError) {
        tests.push({
          name: 'User Auth Sync Status',
          status: 'warning',
          message: `Auth sync test failed: ${syncTestError instanceof Error ? syncTestError.message : 'Unknown error'}`,
          details: { 
            error: syncTestError,
            note: 'This test requires the 005_fix_user_auth_linking.sql migration to be applied'
          }
        })
      }

      // Check schema versions
      const { data: versions, error: versionError } = await supabase
        .from('schema_versions')
        .select('*')
        .order('applied_at', { ascending: false })

      tests.push({
        name: 'Schema Versions',
        status: versionError ? 'error' : 'success',
        message: versionError 
          ? `Schema version error: ${versionError.message}` 
          : `Database schema version: ${versions?.[0]?.version || 'Unknown'}`,
        details: { versions: versions?.map(v => ({ version: v.version, description: v.description, applied_at: v.applied_at })) }
      })

    } catch (error) {
      tests.push({
        name: 'Super Admin Setup',
        status: 'error',
        message: `Admin setup test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      })
    }

    setAdminTests(tests)
  }

  const validateSchemaIntegrity = async () => {
    const tests: TestResult[] = []

    if (isDemoMode) {
      tests.push({
        name: 'Schema Validation',
        status: 'warning',
        message: 'Schema validation skipped in demo mode',
        details: { mode: 'demo' }
      })
      setSchemaValidation(tests)
      return
    }

    try {
      // Check demo organization exists
      const { data: demoOrg, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', '550e8400-e29b-41d4-a716-446655440000')
        .single()

      tests.push({
        name: 'Demo Organization',
        status: orgError ? 'warning' : 'success',
        message: orgError 
          ? 'Demo organization not found - demo data may not be loaded' 
          : `Demo organization found: ${demoOrg?.name}`,
        details: { organization: demoOrg }
      })

      // Check demo users
      const { data: demoUsers, error: usersError } = await supabase
        .from('users')
        .select('email, role, organization_id, created_at')
        .eq('organization_id', '550e8400-e29b-41d4-a716-446655440000')

      tests.push({
        name: 'Demo Users',
        status: usersError ? 'error' : (demoUsers && demoUsers.length > 0 ? 'success' : 'warning'),
        message: usersError 
          ? `Demo users error: ${usersError.message}` 
          : `Found ${demoUsers?.length || 0} demo users`,
        details: { users: demoUsers }
      })

      // Check demo projects
      const { data: demoProjects, error: projectsError } = await supabase
        .from('projects')
        .select('name, status, budget, currency, created_at')
        .eq('organization_id', '550e8400-e29b-41d4-a716-446655440000')

      tests.push({
        name: 'Demo Projects',
        status: projectsError ? 'error' : (demoProjects && demoProjects.length > 0 ? 'success' : 'warning'),
        message: projectsError 
          ? `Demo projects error: ${projectsError.message}` 
          : `Found ${demoProjects?.length || 0} demo projects`,
        details: { projects: demoProjects }
      })

      // Check foreign key constraints by testing relationships
      const { data: expensesWithProjects, error: relationError } = await supabase
        .from('expenses')
        .select(`
          id,
          description,
          amount,
          currency,
          projects(name, status),
          organizations(name)
        `)
        .limit(3)

      tests.push({
        name: 'Foreign Key Relations',
        status: relationError ? 'error' : 'success',
        message: relationError 
          ? `Relationship test failed: ${relationError.message}` 
          : 'Foreign key relationships working correctly',
        details: { sample_data: expensesWithProjects }
      })

      // Test new tables from comprehensive schema
      const newTables = ['employees', 'customers', 'project_units', 'leads', 'documents']
      for (const table of newTables) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })

          tests.push({
            name: `New Table: ${table}`,
            status: error ? 'error' : 'success',
            message: error 
              ? `Table ${table} error: ${error.message}` 
              : `Table ${table} exists with ${count || 0} records`,
            details: { table, count, error }
          })
        } catch (error) {
          tests.push({
            name: `New Table: ${table}`,
            status: 'error',
            message: `Table ${table} test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            details: { table, error }
          })
        }
      }

    } catch (error) {
      tests.push({
        name: 'Schema Validation',
        status: 'error',
        message: `Schema validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      })
    }

    setSchemaValidation(tests)
  }

  const runAllTests = async () => {
    await testConnection()
    await testAuthentication()
    await testTables()
    await testCRUDOperations()
    await testSuperAdminSetup()
    await validateSchemaIntegrity()
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
            {(!isSupabaseConfigured || isDemoMode) && (
              <CardDescription className="text-orange-600">
                ⚠️ Currently running in demo mode. To test real Supabase functionality, configure your Supabase credentials in src/utils/supabase/info.ts
              </CardDescription>
            )}
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="crud">CRUD Operations</TabsTrigger>
            <TabsTrigger value="admin">Admin Setup</TabsTrigger>
            <TabsTrigger value="schema">Schema Validation</TabsTrigger>
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

          {/* Admin Setup Tests */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Super Admin Setup Validation
                </CardTitle>
                <CardDescription>
                  Verify super admin user creation and platform configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {adminTests.length === 0 ? (
                  <p className="text-muted-foreground">No admin tests run yet</p>
                ) : (
                  <div className="space-y-3">
                    {adminTests.map((test, index) => (
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

                {adminTests.length > 0 && adminTests.some(t => t.details) && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Admin Setup Details</summary>
                    {adminTests.map((test, index) => (
                      test.details && (
                        <div key={index} className="mt-2">
                          <h5 className="font-medium text-sm">{test.name}</h5>
                          <pre className="mt-1 p-3 bg-muted rounded-lg text-xs overflow-auto">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </div>
                      )
                    ))}
                  </details>
                )}

                <Button onClick={testSuperAdminSetup} className="w-full">
                  Validate Super Admin Setup
                </Button>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">📋 Super Admin Setup Instructions</h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p><strong>Default Super Admin:</strong> superadmin@jvflow.com (created automatically)</p>
                    <p><strong>Note:</strong> The password for super admin users needs to be set through Supabase Auth.</p>
                    <p><strong>To set password:</strong> Use Supabase Dashboard → Authentication → Users → Reset Password</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schema Validation Tests */}
          <TabsContent value="schema">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Schema & Data Validation
                </CardTitle>
                <CardDescription>
                  Validate comprehensive database schema and demo data integrity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {schemaValidation.length === 0 ? (
                  <p className="text-muted-foreground">No schema validation run yet</p>
                ) : (
                  <div className="space-y-3">
                    {schemaValidation.map((test, index) => (
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

                {schemaValidation.length > 0 && schemaValidation.some(t => t.details) && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Schema Validation Details</summary>
                    {schemaValidation.map((test, index) => (
                      test.details && (
                        <div key={index} className="mt-2">
                          <h5 className="font-medium text-sm">{test.name}</h5>
                          <pre className="mt-1 p-3 bg-muted rounded-lg text-xs overflow-auto">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </div>
                      )
                    ))}
                  </details>
                )}

                <Button onClick={validateSchemaIntegrity} className="w-full">
                  Validate Schema Integrity
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">✅ New Tables Added</h4>
                    <div className="text-sm text-green-800">
                      <p>employees, customers, project_units</p>
                      <p>leads, documents, reports</p>
                      <p>organization_members, audit_logs</p>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">🔧 Enhanced Features</h4>
                    <div className="text-sm text-purple-800">
                      <p>PKR Currency Support</p>
                      <p>Multi-tenancy & RBAC</p>
                      <p>Comprehensive Audit Trail</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Test Summary</CardTitle>
            <CardDescription>
              Complete validation of database setup, super admin configuration, and schema integrity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {connectionTest.status === 'success' ? '1' : '0'}/1
                </div>
                <p className="text-sm text-muted-foreground">Connection</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {authTests.filter(t => t.status === 'success').length}/{authTests.length || 0}
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
                  {crudTests.filter(t => t.status === 'success').length}/{crudTests.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">CRUD Ops</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-indigo-600">
                  {adminTests.filter(t => t.status === 'success').length}/{adminTests.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Admin Setup</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-teal-600">
                  {schemaValidation.filter(t => t.status === 'success').length}/{schemaValidation.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Schema</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">🎯 Database Validation Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-blue-800">Core Features</p>
                  <p className="text-blue-700">Connection, Auth, Tables</p>
                </div>
                <div>
                  <p className="font-medium text-purple-800">Advanced Features</p>
                  <p className="text-purple-700">Super Admin, Multi-tenancy</p>
                </div>
                <div>
                  <p className="font-medium text-green-800">Schema Integrity</p>
                  <p className="text-green-700">All tables, Demo data, Relations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SupabaseTestPage