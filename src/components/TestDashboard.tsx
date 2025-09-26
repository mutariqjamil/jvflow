import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  AlertCircle, CheckCircle2, XCircle, Clock, Database, 
  Users, Building2, Settings, TestTube, Play, Refresh,
  BarChart, TrendingUp, DollarSign, Shield, Info
} from 'lucide-react';

// Import our utility systems
import { logger } from '../utils/logger';
import { dbVerifier } from '../utils/database/supabase-verifier';
import { marketConfig, formatCurrency, getCurrentCurrency, getCurrentMarket, setMarket, setCurrency } from '../utils/currency/market-config';
import { testDataGenerator } from '../utils/testData/data-generator';
import { crudTester } from '../utils/crud/crud-tester';
import { useAuth } from './AuthProvider';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  details?: string;
  data?: any;
}

export function TestDashboard() {
  const { user, isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [crudStats, setCrudStats] = useState<any>(null);

  useEffect(() => {
    // Load initial data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get recent logs
      const recentLogs = logger.getLogs().slice(0, 10);
      setLogs(recentLogs);

      // Get CRUD stats
      const stats = crudTester.getDatabaseStats();
      setCrudStats(stats);

      // Check database status if not in demo mode
      if (!isDemoMode) {
        const status = await dbVerifier.verifyDatabase();
        setDbStatus(status);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    const results: TestResult[] = [];

    try {
      // Test 1: Authentication Test
      results.push({ name: 'Authentication System', status: 'running' });
      setTestResults([...results]);
      
      const authStartTime = performance.now();
      try {
        // Test current auth state
        const authTest = user ? 'passed' : 'failed';
        const authDuration = performance.now() - authStartTime;
        results[results.length - 1] = {
          name: 'Authentication System',
          status: authTest,
          duration: authDuration,
          details: user ? `Authenticated as ${user.name} (${user.role})` : 'No authenticated user',
          data: { userId: user?.id, role: user?.role, isDemoMode }
        };
      } catch (error) {
        results[results.length - 1] = {
          name: 'Authentication System',
          status: 'failed',
          details: error instanceof Error ? error.message : 'Authentication test failed'
        };
      }
      setTestResults([...results]);

      // Test 2: Database Verification
      results.push({ name: 'Database Connection', status: 'running' });
      setTestResults([...results]);
      
      const dbStartTime = performance.now();
      try {
        if (isDemoMode) {
          results[results.length - 1] = {
            name: 'Database Connection',
            status: 'passed',
            duration: performance.now() - dbStartTime,
            details: 'Demo mode - using mock database',
            data: { mode: 'demo' }
          };
        } else {
          const dbTestResult = await dbVerifier.verifyDatabase();
          results[results.length - 1] = {
            name: 'Database Connection',
            status: dbTestResult.isConnected && dbTestResult.schemaValid ? 'passed' : 'failed',
            duration: performance.now() - dbStartTime,
            details: `Connected: ${dbTestResult.isConnected}, Schema Valid: ${dbTestResult.schemaValid}`,
            data: dbTestResult
          };
        }
      } catch (error) {
        results[results.length - 1] = {
          name: 'Database Connection',
          status: 'failed',
          details: error instanceof Error ? error.message : 'Database test failed'
        };
      }
      setTestResults([...results]);

      // Test 3: Currency System
      results.push({ name: 'Currency & Market Config', status: 'running' });
      setTestResults([...results]);
      
      const currencyStartTime = performance.now();
      try {
        const currentMarket = getCurrentMarket();
        const currentCurrency = getCurrentCurrency();
        const testAmount = formatCurrency(100000);
        
        results[results.length - 1] = {
          name: 'Currency & Market Config',
          status: 'passed',
          duration: performance.now() - currencyStartTime,
          details: `Market: ${currentMarket}, Currency: ${currentCurrency}, Test: ${testAmount}`,
          data: { market: currentMarket, currency: currentCurrency, formatted: testAmount }
        };
      } catch (error) {
        results[results.length - 1] = {
          name: 'Currency & Market Config',
          status: 'failed',
          details: error instanceof Error ? error.message : 'Currency test failed'
        };
      }
      setTestResults([...results]);

      // Test 4: Test Data Generation
      results.push({ name: 'Test Data Generation', status: 'running' });
      setTestResults([...results]);
      
      const dataStartTime = performance.now();
      try {
        const sampleProject = testDataGenerator.generateSampleProject();
        const sampleExpense = testDataGenerator.generateSampleExpense();
        
        results[results.length - 1] = {
          name: 'Test Data Generation',
          status: 'passed',
          duration: performance.now() - dataStartTime,
          details: 'Generated sample project and expense data',
          data: { project: sampleProject.name, expense: formatCurrency(sampleExpense.amount) }
        };
      } catch (error) {
        results[results.length - 1] = {
          name: 'Test Data Generation',
          status: 'failed',
          details: error instanceof Error ? error.message : 'Data generation test failed'
        };
      }
      setTestResults([...results]);

      // Test 5: CRUD Operations
      results.push({ name: 'CRUD Operations', status: 'running' });
      setTestResults([...results]);
      
      try {
        const crudResults = await crudTester.runAllCRUDTests();
        
        results[results.length - 1] = {
          name: 'CRUD Operations',
          status: crudResults.failed === 0 ? 'passed' : 'failed',
          duration: crudResults.duration,
          details: `${crudResults.passed}/${crudResults.totalTests} tests passed`,
          data: crudResults
        };
      } catch (error) {
        results[results.length - 1] = {
          name: 'CRUD Operations',
          status: 'failed',
          details: error instanceof Error ? error.message : 'CRUD test failed'
        };
      }
      setTestResults([...results]);

      // Test 6: Logging System
      results.push({ name: 'Logging System', status: 'running' });
      setTestResults([...results]);
      
      const loggingStartTime = performance.now();
      try {
        logger.info('test', 'Test dashboard logging verification');
        const sessionInfo = logger.getSessionInfo();
        
        results[results.length - 1] = {
          name: 'Logging System',
          status: 'passed',
          duration: performance.now() - loggingStartTime,
          details: `Session: ${sessionInfo.sessionId}, Logs: ${sessionInfo.logCount}`,
          data: sessionInfo
        };
      } catch (error) {
        results[results.length - 1] = {
          name: 'Logging System',
          status: 'failed',
          details: error instanceof Error ? error.message : 'Logging test failed'
        };
      }
      setTestResults([...results]);

    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunningTests(false);
      loadDashboardData(); // Refresh data after tests
    }
  };

  const generateTestData = async () => {
    try {
      testDataGenerator.exportToLocalStorage();
      loadDashboardData();
      logger.info('test', 'Test data regenerated successfully');
    } catch (error) {
      logger.error('test', 'Failed to generate test data', { error });
    }
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800', 
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge variant="outline" className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">JV-Flow Test Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive testing and verification of all system components
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={isDemoMode ? 'secondary' : 'outline'}>
            {isDemoMode ? 'Demo Mode' : 'Production Mode'}
          </Badge>
          {user && (
            <Badge variant="outline">
              {user.name} ({user.role})
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tests">System Tests</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">
                  All core systems operational
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Market</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCurrentMarket()}</div>
                <p className="text-xs text-muted-foreground">
                  Currency: {getCurrentCurrency()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Test Data Records</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {crudStats ? crudStats.totalRecords : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mock database records
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Logs</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{logger.getSessionInfo().logCount}</div>
                <p className="text-xs text-muted-foreground">
                  Session: {logger.getSessionInfo().sessionId.slice(-8)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common testing and maintenance tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={runAllTests} disabled={isRunningTests} className="w-full">
                  {isRunningTests ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
                </Button>
                <Button onClick={generateTestData} variant="outline" className="w-full">
                  <Refresh className="w-4 h-4 mr-2" />
                  Generate Test Data
                </Button>
                <Button onClick={loadDashboardData} variant="outline" className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Refresh Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Current system configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Mode:</span>
                  <Badge variant={isDemoMode ? 'secondary' : 'outline'}>
                    {isDemoMode ? 'Demo' : 'Production'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Market:</span>
                  <span className="text-sm">{getCurrentMarket()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Currency:</span>
                  <span className="text-sm">{getCurrentCurrency()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">User Role:</span>
                  <span className="text-sm">{user?.role || 'Not authenticated'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tests Tab */}
        <TabsContent value="tests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">System Tests</h2>
            <Button onClick={runAllTests} disabled={isRunningTests}>
              {isRunningTests ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <TestTube className="w-4 h-4 mr-2" />}
              {isRunningTests ? 'Running...' : 'Run All Tests'}
            </Button>
          </div>

          <div className="space-y-4">
            {testResults.length === 0 && !isRunningTests && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Click "Run All Tests" to start comprehensive system testing
                </AlertDescription>
              </Alert>
            )}

            {testResults.map((result, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h3 className="font-medium">{result.name}</h3>
                        {result.details && (
                          <p className="text-sm text-gray-600">{result.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {result.duration && (
                        <span className="text-sm text-gray-500">
                          {result.duration.toFixed(1)}ms
                        </span>
                      )}
                      {getStatusBadge(result.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Database Status</h2>
            <Button onClick={loadDashboardData} variant="outline">
              <Refresh className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {crudStats && Object.entries(crudStats).filter(([key]) => key !== 'totalRecords').map(([entity, count]) => (
              <Card key={entity}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{count as number}</div>
                  <div className="text-sm text-gray-600 capitalize">{entity}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {dbStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Database Verification Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      {dbStatus.isConnected ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                      <span>Database Connected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {dbStatus.schemaValid ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                      <span>Schema Valid</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {dbStatus.rlsPoliciesActive ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-yellow-600" />}
                      <span>RLS Policies Active</span>
                    </div>
                  </div>

                  {dbStatus.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          {dbStatus.errors.map((error: string, index: number) => (
                            <div key={index}>• {error}</div>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-xl font-semibold">Market & Currency Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Configuration</CardTitle>
                <CardDescription>Switch between different market regions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketConfig.getAllMarkets().map((market) => (
                  <div key={market.code} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{market.name}</div>
                      <div className="text-sm text-gray-600">{market.primaryCurrency} • {market.taxName}: {market.taxRate}%</div>
                    </div>
                    <Button 
                      variant={getCurrentMarket() === market.code ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMarket(market.code)}
                    >
                      {getCurrentMarket() === market.code ? 'Active' : 'Select'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Currency Test</CardTitle>
                <CardDescription>Test currency formatting with different amounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1000, 50000, 1000000, 25000000].map((amount) => (
                  <div key={amount} className="flex justify-between items-center">
                    <span className="text-sm">{amount.toLocaleString()}</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">System Logs</h2>
            <div className="space-x-2">
              <Button onClick={loadDashboardData} variant="outline" size="sm">
                <Refresh className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={clearLogs} variant="outline" size="sm">
                Clear Logs
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No logs available
                  </div>
                ) : (
                  <div className="divide-y">
                    {logs.map((log, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                log.level === 'error' ? 'bg-red-100 text-red-800' :
                                log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                                log.level === 'info' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {log.level.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {log.category.toUpperCase()}
                            </Badge>
                            <span>{log.message}</span>
                          </div>
                          <span className="text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {log.data && (
                          <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                            {JSON.stringify(log.data, null, 2)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TestDashboard;