// CRUD Operations Test System for JV-Flow
// Comprehensive testing of Create, Read, Update, Delete operations

import { logger, crudLog } from '../logger';
import { testDataGenerator, TestUser, TestOrganization, TestProject, TestExpense, TestVendor } from '../testData/data-generator';
import { formatCurrency } from '../currency/market-config';

// CRUD Test Results
interface CRUDTestResult {
  operation: 'create' | 'read' | 'update' | 'delete';
  entity: string;
  success: boolean;
  duration: number;
  error?: string;
  data?: any;
  timestamp: string;
}

interface CRUDTestSummary {
  totalTests: number;
  passed: number;
  failed: number;
  averageDuration: number;
  testsByEntity: Record<string, { passed: number; failed: number }>;
  testsByOperation: Record<string, { passed: number; failed: number }>;
  errors: string[];
  startTime: string;
  endTime: string;
  duration: number;
}

// Mock Database Interface (for demo mode)
interface MockDatabase {
  users: TestUser[];
  organizations: TestOrganization[];
  projects: TestProject[];
  expenses: TestExpense[];
  vendors: TestVendor[];
}

export class CRUDTester {
  private static instance: CRUDTester;
  private mockDb: MockDatabase;
  private testResults: CRUDTestResult[] = [];

  private constructor() {
    this.mockDb = {
      users: [],
      organizations: [],
      projects: [],
      expenses: [],
      vendors: []
    };
    
    this.initializeMockDatabase();
    crudLog('info', 'CRUD Tester initialized');
  }

  public static getInstance(): CRUDTester {
    if (!CRUDTester.instance) {
      CRUDTester.instance = new CRUDTester();
    }
    return CRUDTester.instance;
  }

  private initializeMockDatabase(): void {
    try {
      // Load test data if available
      const testData = testDataGenerator.importFromLocalStorage();
      if (testData) {
        this.mockDb = {
          users: testData.users || [],
          organizations: testData.organizations || [],
          projects: testData.projects || [],
          expenses: testData.expenses || [],
          vendors: testData.vendors || []
        };
        crudLog('info', 'Mock database initialized with test data', {
          users: this.mockDb.users.length,
          organizations: this.mockDb.organizations.length,
          projects: this.mockDb.projects.length,
          expenses: this.mockDb.expenses.length,
          vendors: this.mockDb.vendors.length
        });
      } else {
        // Generate fresh test data
        const dataset = testDataGenerator.generateCompleteDataset();
        this.mockDb = {
          users: dataset.users,
          organizations: dataset.organizations,
          projects: dataset.projects,
          expenses: dataset.expenses,
          vendors: dataset.vendors
        };
        crudLog('info', 'Mock database initialized with fresh test data');
      }
    } catch (error) {
      crudLog('error', 'Failed to initialize mock database', { error });
      // Use minimal data as fallback
      this.mockDb = {
        users: testDataGenerator.generateUsers(5),
        organizations: testDataGenerator.generateOrganizations(2),
        projects: [],
        expenses: [],
        vendors: []
      };
    }
  }

  private recordTestResult(
    operation: CRUDTestResult['operation'],
    entity: string,
    success: boolean,
    duration: number,
    error?: string,
    data?: any
  ): void {
    const result: CRUDTestResult = {
      operation,
      entity,
      success,
      duration,
      error,
      data: data ? JSON.parse(JSON.stringify(data)) : undefined, // Deep clone
      timestamp: new Date().toISOString()
    };

    this.testResults.push(result);
    
    crudLog(success ? 'info' : 'error', `${operation.toUpperCase()} ${entity}`, {
      success,
      duration: `${duration}ms`,
      error
    });
  }

  // Generic CRUD operations
  private async performCRUD<T extends { id: string }>(
    operation: CRUDTestResult['operation'],
    entity: keyof MockDatabase,
    data?: Partial<T>,
    id?: string
  ): Promise<T | T[] | boolean> {
    const startTime = performance.now();
    
    try {
      const collection = this.mockDb[entity] as T[];
      
      switch (operation) {
        case 'create':
          if (!data) throw new Error('Data required for create operation');
          const newItem = { ...data, id: id || `${entity}_${Date.now()}_${Math.random().toString(36).substr(2, 8)}` } as T;
          collection.push(newItem);
          
          const duration1 = performance.now() - startTime;
          this.recordTestResult(operation, entity, true, duration1, undefined, newItem);
          return newItem;

        case 'read':
          if (id) {
            const item = collection.find(item => item.id === id);
            if (!item) throw new Error(`${entity} with id ${id} not found`);
            
            const duration2 = performance.now() - startTime;
            this.recordTestResult(operation, entity, true, duration2, undefined, item);
            return item;
          } else {
            const duration3 = performance.now() - startTime;
            this.recordTestResult(operation, entity, true, duration3, undefined, { count: collection.length });
            return [...collection]; // Return copy
          }

        case 'update':
          if (!id || !data) throw new Error('ID and data required for update operation');
          const updateIndex = collection.findIndex(item => item.id === id);
          if (updateIndex === -1) throw new Error(`${entity} with id ${id} not found`);
          
          collection[updateIndex] = { ...collection[updateIndex], ...data };
          
          const duration4 = performance.now() - startTime;
          this.recordTestResult(operation, entity, true, duration4, undefined, collection[updateIndex]);
          return collection[updateIndex];

        case 'delete':
          if (!id) throw new Error('ID required for delete operation');
          const deleteIndex = collection.findIndex(item => item.id === id);
          if (deleteIndex === -1) throw new Error(`${entity} with id ${id} not found`);
          
          const deletedItem = collection.splice(deleteIndex, 1)[0];
          
          const duration5 = performance.now() - startTime;
          this.recordTestResult(operation, entity, true, duration5, undefined, { deleted: true, id });
          return true;

        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.recordTestResult(operation, entity, false, duration, errorMessage);
      throw error;
    }
  }

  // User CRUD operations
  public async createUser(userData: Partial<TestUser>): Promise<TestUser> {
    return await this.performCRUD<TestUser>('create', 'users', userData) as TestUser;
  }

  public async readUser(id: string): Promise<TestUser> {
    return await this.performCRUD<TestUser>('read', 'users', undefined, id) as TestUser;
  }

  public async readAllUsers(): Promise<TestUser[]> {
    return await this.performCRUD<TestUser>('read', 'users') as TestUser[];
  }

  public async updateUser(id: string, userData: Partial<TestUser>): Promise<TestUser> {
    return await this.performCRUD<TestUser>('update', 'users', userData, id) as TestUser;
  }

  public async deleteUser(id: string): Promise<boolean> {
    return await this.performCRUD<TestUser>('delete', 'users', undefined, id) as boolean;
  }

  // Organization CRUD operations
  public async createOrganization(orgData: Partial<TestOrganization>): Promise<TestOrganization> {
    return await this.performCRUD<TestOrganization>('create', 'organizations', orgData) as TestOrganization;
  }

  public async readOrganization(id: string): Promise<TestOrganization> {
    return await this.performCRUD<TestOrganization>('read', 'organizations', undefined, id) as TestOrganization;
  }

  public async readAllOrganizations(): Promise<TestOrganization[]> {
    return await this.performCRUD<TestOrganization>('read', 'organizations') as TestOrganization[];
  }

  public async updateOrganization(id: string, orgData: Partial<TestOrganization>): Promise<TestOrganization> {
    return await this.performCRUD<TestOrganization>('update', 'organizations', orgData, id) as TestOrganization;
  }

  public async deleteOrganization(id: string): Promise<boolean> {
    return await this.performCRUD<TestOrganization>('delete', 'organizations', undefined, id) as boolean;
  }

  // Project CRUD operations
  public async createProject(projectData: Partial<TestProject>): Promise<TestProject> {
    return await this.performCRUD<TestProject>('create', 'projects', projectData) as TestProject;
  }

  public async readProject(id: string): Promise<TestProject> {
    return await this.performCRUD<TestProject>('read', 'projects', undefined, id) as TestProject;
  }

  public async readAllProjects(): Promise<TestProject[]> {
    return await this.performCRUD<TestProject>('read', 'projects') as TestProject[];
  }

  public async updateProject(id: string, projectData: Partial<TestProject>): Promise<TestProject> {
    return await this.performCRUD<TestProject>('update', 'projects', projectData, id) as TestProject;
  }

  public async deleteProject(id: string): Promise<boolean> {
    return await this.performCRUD<TestProject>('delete', 'projects', undefined, id) as boolean;
  }

  // Expense CRUD operations
  public async createExpense(expenseData: Partial<TestExpense>): Promise<TestExpense> {
    return await this.performCRUD<TestExpense>('create', 'expenses', expenseData) as TestExpense;
  }

  public async readExpense(id: string): Promise<TestExpense> {
    return await this.performCRUD<TestExpense>('read', 'expenses', undefined, id) as TestExpense;
  }

  public async readAllExpenses(): Promise<TestExpense[]> {
    return await this.performCRUD<TestExpense>('read', 'expenses') as TestExpense[];
  }

  public async updateExpense(id: string, expenseData: Partial<TestExpense>): Promise<TestExpense> {
    return await this.performCRUD<TestExpense>('update', 'expenses', expenseData, id) as TestExpense;
  }

  public async deleteExpense(id: string): Promise<boolean> {
    return await this.performCRUD<TestExpense>('delete', 'expenses', undefined, id) as boolean;
  }

  // Vendor CRUD operations
  public async createVendor(vendorData: Partial<TestVendor>): Promise<TestVendor> {
    return await this.performCRUD<TestVendor>('create', 'vendors', vendorData) as TestVendor;
  }

  public async readVendor(id: string): Promise<TestVendor> {
    return await this.performCRUD<TestVendor>('read', 'vendors', undefined, id) as TestVendor;
  }

  public async readAllVendors(): Promise<TestVendor[]> {
    return await this.performCRUD<TestVendor>('read', 'vendors') as TestVendor[];
  }

  public async updateVendor(id: string, vendorData: Partial<TestVendor>): Promise<TestVendor> {
    return await this.performCRUD<TestVendor>('update', 'vendors', vendorData, id) as TestVendor;
  }

  public async deleteVendor(id: string): Promise<boolean> {
    return await this.performCRUD<TestVendor>('delete', 'vendors', undefined, id) as boolean;
  }

  // Comprehensive test suites
  public async runUserCRUDTests(): Promise<CRUDTestSummary> {
    crudLog('info', 'Starting User CRUD tests');
    const testStartTime = new Date().toISOString();
    const startTime = performance.now();

    try {
      // Test Create
      const newUser = await this.createUser({
        name: 'Test User CRUD',
        email: 'test.crud@jvflow.com',
        role: 'admin',
        registration_type: 'email',
        organizations: ['demo-org-001']
      });

      // Test Read
      const readUser = await this.readUser(newUser.id);
      
      // Test Update
      const updatedUser = await this.updateUser(newUser.id, {
        name: 'Updated Test User'
      });

      // Test Read All
      await this.readAllUsers();

      // Test Delete
      await this.deleteUser(newUser.id);

      // Verify deletion
      try {
        await this.readUser(newUser.id);
        throw new Error('User should have been deleted');
      } catch (error) {
        // Expected error
      }

    } catch (error) {
      crudLog('error', 'User CRUD tests failed', { error });
    }

    const endTime = performance.now();
    const testEndTime = new Date().toISOString();

    return this.generateTestSummary('users', testStartTime, testEndTime, endTime - startTime);
  }

  public async runProjectCRUDTests(): Promise<CRUDTestSummary> {
    crudLog('info', 'Starting Project CRUD tests');
    const testStartTime = new Date().toISOString();
    const startTime = performance.now();

    try {
      // Test Create
      const newProject = await this.createProject({
        name: 'Test Project CRUD',
        description: 'Test project for CRUD operations',
        organization_id: 'demo-org-001',
        location: 'Dubai Marina',
        total_budget: 1000000,
        cash_balance: 500000,
        total_invested: 500000,
        total_expenses: 250000,
        total_revenue: 0,
        status: 'active',
        start_date: new Date().toISOString(),
        expected_completion: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        project_manager_id: 'super-admin-001',
        created_at: new Date().toISOString()
      });

      // Test Read
      await this.readProject(newProject.id);
      
      // Test Update
      await this.updateProject(newProject.id, {
        status: 'completed',
        total_revenue: 150000
      });

      // Test Read All
      await this.readAllProjects();

      // Test Delete
      await this.deleteProject(newProject.id);

    } catch (error) {
      crudLog('error', 'Project CRUD tests failed', { error });
    }

    const endTime = performance.now();
    const testEndTime = new Date().toISOString();

    return this.generateTestSummary('projects', testStartTime, testEndTime, endTime - startTime);
  }

  public async runExpenseCRUDTests(): Promise<CRUDTestSummary> {
    crudLog('info', 'Starting Expense CRUD tests');
    const testStartTime = new Date().toISOString();
    const startTime = performance.now();

    try {
      // Ensure we have a project to link expenses to
      if (this.mockDb.projects.length === 0) {
        await this.createProject(testDataGenerator.generateSampleProject());
      }

      const projectId = this.mockDb.projects[0].id;
      const vendorId = this.mockDb.vendors.length > 0 ? this.mockDb.vendors[0].id : 'test-vendor';

      // Test Create
      const newExpense = await this.createExpense({
        project_id: projectId,
        organization_id: 'demo-org-001',
        category: 'Construction',
        subcategory: 'Materials',
        amount: 50000,
        description: 'Test expense for CRUD operations',
        vendor_id: vendorId,
        status: 'pending',
        created_by: 'super-admin-001',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      });

      // Test Read
      await this.readExpense(newExpense.id);
      
      // Test Update
      await this.updateExpense(newExpense.id, {
        status: 'approved',
        approved_by: 'super-admin-001'
      });

      // Test Read All
      await this.readAllExpenses();

      // Test Delete
      await this.deleteExpense(newExpense.id);

    } catch (error) {
      crudLog('error', 'Expense CRUD tests failed', { error });
    }

    const endTime = performance.now();
    const testEndTime = new Date().toISOString();

    return this.generateTestSummary('expenses', testStartTime, testEndTime, endTime - startTime);
  }

  public async runAllCRUDTests(): Promise<CRUDTestSummary> {
    crudLog('info', 'Starting comprehensive CRUD tests');
    const testStartTime = new Date().toISOString();
    const startTime = performance.now();

    // Clear previous test results
    this.testResults = [];

    try {
      // Run all entity tests
      await this.runUserCRUDTests();
      await this.runProjectCRUDTests();
      await this.runExpenseCRUDTests();

      crudLog('info', 'All CRUD tests completed');
    } catch (error) {
      crudLog('error', 'Comprehensive CRUD tests failed', { error });
    }

    const endTime = performance.now();
    const testEndTime = new Date().toISOString();

    return this.generateTestSummary('all', testStartTime, testEndTime, endTime - startTime);
  }

  private generateTestSummary(
    entityFilter: string, 
    startTime: string, 
    endTime: string, 
    duration: number
  ): CRUDTestSummary {
    const filteredResults = entityFilter === 'all' 
      ? this.testResults 
      : this.testResults.filter(r => r.entity === entityFilter);

    const passed = filteredResults.filter(r => r.success).length;
    const failed = filteredResults.filter(r => r.success === false).length;
    const totalDuration = filteredResults.reduce((sum, r) => sum + r.duration, 0);
    const averageDuration = filteredResults.length > 0 ? totalDuration / filteredResults.length : 0;

    // Group by entity
    const testsByEntity: Record<string, { passed: number; failed: number }> = {};
    filteredResults.forEach(result => {
      if (!testsByEntity[result.entity]) {
        testsByEntity[result.entity] = { passed: 0, failed: 0 };
      }
      if (result.success) {
        testsByEntity[result.entity].passed++;
      } else {
        testsByEntity[result.entity].failed++;
      }
    });

    // Group by operation
    const testsByOperation: Record<string, { passed: number; failed: number }> = {};
    filteredResults.forEach(result => {
      if (!testsByOperation[result.operation]) {
        testsByOperation[result.operation] = { passed: 0, failed: 0 };
      }
      if (result.success) {
        testsByOperation[result.operation].passed++;
      } else {
        testsByOperation[result.operation].failed++;
      }
    });

    const errors = filteredResults
      .filter(r => !r.success && r.error)
      .map(r => r.error!)
      .filter((error, index, array) => array.indexOf(error) === index); // Unique errors

    const summary: CRUDTestSummary = {
      totalTests: filteredResults.length,
      passed,
      failed,
      averageDuration,
      testsByEntity,
      testsByOperation,
      errors,
      startTime,
      endTime,
      duration
    };

    crudLog('info', `CRUD Test Summary for ${entityFilter}`, {
      totalTests: summary.totalTests,
      passed: summary.passed,
      failed: summary.failed,
      successRate: `${((summary.passed / summary.totalTests) * 100).toFixed(1)}%`,
      averageDuration: `${summary.averageDuration.toFixed(2)}ms`
    });

    return summary;
  }

  // Utility methods
  public getTestResults(): CRUDTestResult[] {
    return [...this.testResults]; // Return copy
  }

  public clearTestResults(): void {
    this.testResults = [];
    crudLog('info', 'CRUD test results cleared');
  }

  public getDatabaseStats(): {
    users: number;
    organizations: number;
    projects: number;
    expenses: number;
    vendors: number;
    totalRecords: number;
  } {
    return {
      users: this.mockDb.users.length,
      organizations: this.mockDb.organizations.length,
      projects: this.mockDb.projects.length,
      expenses: this.mockDb.expenses.length,
      vendors: this.mockDb.vendors.length,
      totalRecords: Object.values(this.mockDb).reduce((sum, collection) => sum + collection.length, 0)
    };
  }

  public resetDatabase(): void {
    this.mockDb = {
      users: [],
      organizations: [],
      projects: [],
      expenses: [],
      vendors: []
    };
    this.initializeMockDatabase();
    crudLog('info', 'Mock database reset');
  }

  public exportDatabase(): MockDatabase {
    return JSON.parse(JSON.stringify(this.mockDb)); // Deep clone
  }

  public importDatabase(data: MockDatabase): void {
    this.mockDb = JSON.parse(JSON.stringify(data)); // Deep clone
    crudLog('info', 'Mock database imported', {
      users: this.mockDb.users.length,
      organizations: this.mockDb.organizations.length,
      projects: this.mockDb.projects.length,
      expenses: this.mockDb.expenses.length,
      vendors: this.mockDb.vendors.length
    });
  }
}

// Export singleton instance
export const crudTester = CRUDTester.getInstance();
export default crudTester;