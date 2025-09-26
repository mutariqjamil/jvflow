// Supabase Database Verification System for JV-Flow
// Verifies database connectivity, schema, RLS policies, and data integrity

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { logger, dbLog } from '../logger';

interface DatabaseStatus {
  isConnected: boolean;
  schemaValid: boolean;
  rlsPoliciesActive: boolean;
  tablesExist: string[];
  missingTables: string[];
  errors: string[];
  warnings: string[];
  lastChecked: string;
}

interface TableInfo {
  table_name: string;
  column_count: number;
  has_rls: boolean;
  row_count?: number;
}

export class SupabaseDatabaseVerifier {
  private static instance: SupabaseDatabaseVerifier;
  
  // Expected tables in the JV-Flow schema
  private readonly expectedTables = [
    'users',
    'organizations', 
    'organization_members',
    'projects',
    'milestones',
    'expenses',
    'vendors',
    'materials',
    'purchase_orders',
    'bookings',
    'invoices',
    'commissions',
    'marketing_campaigns',
    'audit_logs'
  ];

  private constructor() {
    dbLog('info', 'SupabaseDatabaseVerifier initialized');
  }

  public static getInstance(): SupabaseDatabaseVerifier {
    if (!SupabaseDatabaseVerifier.instance) {
      SupabaseDatabaseVerifier.instance = new SupabaseDatabaseVerifier();
    }
    return SupabaseDatabaseVerifier.instance;
  }

  /**
   * Comprehensive database health check
   */
  public async verifyDatabase(): Promise<DatabaseStatus> {
    logger.startTimer('database-verification');
    dbLog('info', 'Starting comprehensive database verification');

    const status: DatabaseStatus = {
      isConnected: false,
      schemaValid: false,
      rlsPoliciesActive: false,
      tablesExist: [],
      missingTables: [],
      errors: [],
      warnings: [],
      lastChecked: new Date().toISOString()
    };

    try {
      // Step 1: Check if Supabase is configured
      if (!isSupabaseConfigured) {
        status.warnings.push('Supabase not configured - running in demo mode');
        dbLog('warn', 'Database verification skipped - demo mode active');
        return status;
      }

      if (!supabase) {
        status.errors.push('Supabase client not initialized');
        dbLog('error', 'Supabase client not available');
        return status;
      }

      // Step 2: Test basic connectivity
      status.isConnected = await this.testConnectivity();
      if (!status.isConnected) {
        status.errors.push('Failed to connect to Supabase');
        return status;
      }

      // Step 3: Verify schema and tables
      const tableInfo = await this.verifySchema();
      status.tablesExist = tableInfo.existing;
      status.missingTables = tableInfo.missing;
      status.schemaValid = tableInfo.missing.length === 0;

      // Step 4: Check RLS policies
      status.rlsPoliciesActive = await this.verifyRLSPolicies();

      // Step 5: Additional checks
      await this.performAdditionalChecks(status);

      dbLog('info', 'Database verification completed', {
        isConnected: status.isConnected,
        schemaValid: status.schemaValid,
        tablesCount: status.tablesExist.length,
        missingTablesCount: status.missingTables.length
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      status.errors.push(`Verification failed: ${errorMessage}`);
      dbLog('error', 'Database verification failed', { error: errorMessage });
    } finally {
      logger.endTimer('database-verification');
    }

    return status;
  }

  /**
   * Test basic connectivity to Supabase
   */
  private async testConnectivity(): Promise<boolean> {
    try {
      dbLog('debug', 'Testing Supabase connectivity');
      
      // Simple query to test connection
      const { data, error } = await supabase!
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);

      if (error) {
        dbLog('error', 'Connectivity test failed', { error: error.message });
        return false;
      }

      dbLog('info', 'Supabase connectivity confirmed');
      return true;
    } catch (error) {
      dbLog('error', 'Connectivity test exception', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return false;
    }
  }

  /**
   * Verify database schema and required tables
   */
  private async verifySchema(): Promise<{ existing: string[]; missing: string[] }> {
    try {
      dbLog('debug', 'Verifying database schema');

      // Query to get all tables in the public schema
      const { data: tables, error } = await supabase!
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE');

      if (error) {
        dbLog('error', 'Schema verification failed', { error: error.message });
        throw error;
      }

      const existingTables = tables?.map(t => t.table_name) || [];
      const missingTables = this.expectedTables.filter(
        table => !existingTables.includes(table)
      );

      dbLog('info', 'Schema verification completed', {
        totalTables: existingTables.length,
        expectedTables: this.expectedTables.length,
        missingTables: missingTables.length
      });

      if (missingTables.length > 0) {
        dbLog('warn', 'Missing required tables', { missingTables });
      }

      return {
        existing: existingTables.filter(table => this.expectedTables.includes(table)),
        missing: missingTables
      };
    } catch (error) {
      dbLog('error', 'Schema verification exception', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return { existing: [], missing: this.expectedTables };
    }
  }

  /**
   * Verify Row Level Security (RLS) policies are active
   */
  private async verifyRLSPolicies(): Promise<boolean> {
    try {
      dbLog('debug', 'Verifying RLS policies');

      // Query to check RLS status for our tables
      const { data: rlsInfo, error } = await supabase!
        .from('pg_class')
        .select('relname, relrowsecurity')
        .in('relname', this.expectedTables);

      if (error) {
        dbLog('warn', 'RLS verification failed', { error: error.message });
        return false;
      }

      const tablesWithRLS = rlsInfo?.filter(table => table.relrowsecurity) || [];
      const rlsPercentage = (tablesWithRLS.length / this.expectedTables.length) * 100;

      dbLog('info', 'RLS policies verification completed', {
        tablesWithRLS: tablesWithRLS.length,
        totalTables: this.expectedTables.length,
        rlsPercentage: `${rlsPercentage.toFixed(1)}%`
      });

      return rlsPercentage > 80; // Consider RLS active if 80%+ tables have it enabled
    } catch (error) {
      dbLog('error', 'RLS verification exception', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return false;
    }
  }

  /**
   * Perform additional database health checks
   */
  private async performAdditionalChecks(status: DatabaseStatus): Promise<void> {
    try {
      // Check for data in key tables
      await this.checkTableData(status);
      
      // Verify user authentication is working
      await this.checkAuthIntegration(status);
      
      // Check database performance
      await this.checkPerformance(status);
      
    } catch (error) {
      status.warnings.push(`Additional checks failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      dbLog('warn', 'Additional database checks failed', { error });
    }
  }

  /**
   * Check if key tables have data
   */
  private async checkTableData(status: DatabaseStatus): Promise<void> {
    const keyTables = ['users', 'organizations', 'projects'];
    
    for (const tableName of keyTables) {
      if (status.tablesExist.includes(tableName)) {
        try {
          const { count, error } = await supabase!
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (!error && count !== null) {
            dbLog('debug', `Table ${tableName} has ${count} records`);
            if (count === 0) {
              status.warnings.push(`Table ${tableName} is empty`);
            }
          }
        } catch (error) {
          dbLog('warn', `Failed to check data in ${tableName}`, { error });
        }
      }
    }
  }

  /**
   * Check authentication integration with database
   */
  private async checkAuthIntegration(status: DatabaseStatus): Promise<void> {
    try {
      // Test getting current user
      const { data: { user }, error } = await supabase!.auth.getUser();
      
      if (error) {
        status.warnings.push('Auth integration check failed');
        dbLog('warn', 'Auth integration verification failed', { error: error.message });
      } else if (user) {
        dbLog('info', 'Auth integration verified - user session active');
      } else {
        dbLog('debug', 'Auth integration verified - no active session');
      }
    } catch (error) {
      status.warnings.push('Auth integration check exception');
      dbLog('warn', 'Auth integration check exception', { error });
    }
  }

  /**
   * Check database performance metrics
   */
  private async checkPerformance(status: DatabaseStatus): Promise<void> {
    try {
      logger.startTimer('db-performance-check');
      
      // Simple performance test - query a table and measure time
      if (status.tablesExist.includes('users')) {
        const startTime = performance.now();
        
        const { data, error } = await supabase!
          .from('users')
          .select('id')
          .limit(1);
        
        const queryTime = performance.now() - startTime;
        
        if (!error) {
          dbLog('debug', 'Database performance check completed', { 
            queryTime: `${queryTime.toFixed(2)}ms` 
          });
          
          if (queryTime > 1000) { // More than 1 second
            status.warnings.push('Database queries are slow (>1s)');
          }
        }
      }
      
      logger.endTimer('db-performance-check');
    } catch (error) {
      dbLog('warn', 'Performance check failed', { error });
    }
  }

  /**
   * Get detailed table information
   */
  public async getTableInfo(): Promise<TableInfo[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const tableInfo: TableInfo[] = [];

    for (const tableName of this.expectedTables) {
      try {
        // Get column count
        const { data: columns, error: columnError } = await supabase
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_name', tableName)
          .eq('table_schema', 'public');

        // Get RLS status
        const { data: rlsData, error: rlsError } = await supabase
          .from('pg_class')
          .select('relrowsecurity')
          .eq('relname', tableName)
          .single();

        // Get approximate row count (for performance)
        const { count, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (!columnError) {
          tableInfo.push({
            table_name: tableName,
            column_count: columns?.length || 0,
            has_rls: !rlsError && rlsData?.relrowsecurity === true,
            row_count: !countError ? count || 0 : undefined
          });
        }
      } catch (error) {
        dbLog('warn', `Failed to get info for table ${tableName}`, { error });
      }
    }

    return tableInfo;
  }

  /**
   * Quick connection test (lightweight)
   */
  public async quickTest(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const dbVerifier = SupabaseDatabaseVerifier.getInstance();
export default dbVerifier;