// Test Data Generator for JV-Flow
// Creates realistic seed data for development and testing

import { logger, testLog } from '../logger';
import { formatCurrency, getCurrentCurrency } from '../currency/market-config';

// Data Types
export interface TestUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'super_admin' | 'admin' | 'project_manager' | 'investor' | 'builder' | 'marketing';
  phone?: string;
  registration_type: 'email' | 'phone';
  organizations: string[];
  created_at: string;
  avatar_url?: string;
}

export interface TestOrganization {
  id: string;
  name: string;
  description: string;
  industry: string;
  owner_id: string;
  subscription_status: 'trial' | 'active' | 'expired';
  trial_end_date: string;
  settings: {
    currency: string;
    timezone: string;
    language: 'en' | 'ar';
  };
  created_at: string;
}

export interface TestProject {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  location: string;
  total_budget: number;
  cash_balance: number;
  total_invested: number;
  total_expenses: number;
  total_revenue: number;
  status: 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  start_date: string;
  expected_completion: string;
  project_manager_id: string;
  created_at: string;
}

export interface TestExpense {
  id: string;
  project_id: string;
  organization_id: string;
  category: string;
  subcategory: string;
  amount: number;
  description: string;
  vendor_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  created_by: string;
  approved_by?: string;
  receipt_url?: string;
  due_date: string;
  created_at: string;
}

export interface TestVendor {
  id: string;
  organization_id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  payment_terms: string;
  tax_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface TestMaterial {
  id: string;
  organization_id: string;
  name: string;
  category: string;
  unit: string;
  unit_price: number;
  supplier_id: string;
  min_stock_level: number;
  current_stock: number;
  description?: string;
  created_at: string;
}

export interface TestBooking {
  id: string;
  project_id: string;
  unit_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  down_payment: number;
  booking_date: string;
  status: 'reserved' | 'booked' | 'completed' | 'cancelled';
  agent_id: string;
  commission_rate: number;
  created_at: string;
}

export class TestDataGenerator {
  private static instance: TestDataGenerator;

  // Sample data arrays
  private readonly firstNames = [
    'Ahmed', 'Mohammed', 'Fatima', 'Aisha', 'Omar', 'Zainab', 'Ali', 'Mariam',
    'Khalid', 'Sarah', 'Hassan', 'Noor', 'Youssef', 'Layla', 'Amjad', 'Hind',
    'John', 'Emma', 'Michael', 'Sophia', 'David', 'Olivia', 'James', 'Isabella'
  ];

  private readonly lastNames = [
    'Al-Rashid', 'Al-Maktoum', 'Al-Nahyan', 'Al-Sabah', 'Al-Thani', 'Al-Khalifa',
    'Al-Mansouri', 'Al-Zaabi', 'Al-Shamsi', 'Al-Mazrouei', 'Al-Kaabi', 'Al-Ali',
    'Smith', 'Johnson', 'Brown', 'Wilson', 'Davis', 'Miller', 'Taylor', 'Anderson'
  ];

  private readonly companyNames = [
    'Emirates Real Estate', 'Dubai Properties Group', 'Abu Dhabi Development',
    'Gulf Construction Co.', 'Al-Maktoum Holdings', 'Desert Rose Properties',
    'Oasis Development', 'Pearl Real Estate', 'Golden Sands Properties',
    'Royal Palace Development', 'Burj Holdings', 'Marina Properties',
    'Skyline Development', 'Heritage Properties', 'Modern Living Co.'
  ];

  private readonly projectNames = [
    'Marina Pearl Towers', 'Desert Oasis Villas', 'Golden Gate Residences',
    'Crystal Bay Development', 'Palm Grove Apartments', 'Sunset Boulevard',
    'Royal Gardens Estate', 'Blue Horizon Towers', 'Green Valley Homes',
    'Diamond Heights', 'Silver Lake Villas', 'Paradise Bay Resort',
    'Heritage Park Residences', 'Modern City Center', 'Luxury Waterfront'
  ];

  private readonly locations = [
    'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Dubai Hills',
    'Business Bay', 'JLT - Jumeirah Lake Towers', 'Dubai Investment Park',
    'Motor City', 'Arabian Ranches', 'The Gardens', 'Emirates Hills',
    'Dubai South', 'Al Barsha', 'Jumeirah Village Circle', 'Dubai Creek'
  ];

  private readonly expenseCategories = [
    { category: 'Construction', subcategories: ['Materials', 'Labor', 'Equipment', 'Permits'] },
    { category: 'Marketing', subcategories: ['Advertising', 'Brochures', 'Website', 'Events'] },
    { category: 'Legal', subcategories: ['Contracts', 'Registration', 'Compliance', 'Consultation'] },
    { category: 'Utilities', subcategories: ['Electricity', 'Water', 'Internet', 'Phone'] },
    { category: 'Professional Services', subcategories: ['Accounting', 'Engineering', 'Architecture', 'Consulting'] }
  ];

  private readonly vendorCategories = [
    'Construction Company', 'Material Supplier', 'Legal Firm', 'Marketing Agency',
    'Engineering Firm', 'Architecture Studio', 'Equipment Rental', 'Security Services',
    'Cleaning Services', 'IT Services', 'Financial Services', 'Insurance Company'
  ];

  private readonly materialCategories = [
    { category: 'Concrete', items: ['Cement', 'Sand', 'Gravel', 'Ready Mix'] },
    { category: 'Steel', items: ['Rebar', 'Structural Steel', 'Mesh', 'Plates'] },
    { category: 'Electrical', items: ['Cables', 'Switches', 'Panels', 'Conduits'] },
    { category: 'Plumbing', items: ['Pipes', 'Fittings', 'Valves', 'Fixtures'] },
    { category: 'Finishing', items: ['Paint', 'Tiles', 'Flooring', 'Doors'] }
  ];

  private constructor() {
    testLog('info', 'TestDataGenerator initialized');
  }

  public static getInstance(): TestDataGenerator {
    if (!TestDataGenerator.instance) {
      TestDataGenerator.instance = new TestDataGenerator();
    }
    return TestDataGenerator.instance;
  }

  // Utility methods
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomAmount(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }

  private randomDate(startDays: number, endDays: number): string {
    const start = new Date();
    start.setDate(start.getDate() + startDays);
    const end = new Date();
    end.setDate(end.getDate() + endDays);
    
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString();
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private generateEmail(firstName: string, lastName: string): string {
    const domains = ['jvflow.com', 'gmail.com', 'outlook.com', 'company.ae'];
    const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
    return `${cleanFirst}.${cleanLast}@${this.randomChoice(domains)}`;
  }

  private generatePhone(): string {
    const prefixes = ['+971-50', '+971-55', '+971-56', '+966-50', '+965-9'];
    const prefix = this.randomChoice(prefixes);
    const number = Math.floor(Math.random() * 9000000) + 1000000;
    return `${prefix}-${number}`;
  }

  // Data generators
  public generateUsers(count: number = 25): TestUser[] {
    const users: TestUser[] = [];
    
    // Always include the super admin
    users.push({
      id: 'super-admin-001',
      email: 'tj.analyst@gmail.com',
      password: 'Asdf123@',
      name: 'Muhammad TJ (Super Admin)',
      role: 'super_admin',
      phone: '+971-50-1234567',
      registration_type: 'email',
      organizations: ['platform-admin', 'demo-org-001'],
      created_at: new Date('2024-01-01').toISOString(),
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin'
    });

    // Generate additional test users
    const roles: TestUser['role'][] = ['admin', 'project_manager', 'investor', 'builder', 'marketing'];
    
    for (let i = 0; i < count - 1; i++) {
      const firstName = this.randomChoice(this.firstNames);
      const lastName = this.randomChoice(this.lastNames);
      const email = this.generateEmail(firstName, lastName);
      
      users.push({
        id: this.generateId('user'),
        email,
        password: 'test123',
        name: `${firstName} ${lastName}`,
        role: this.randomChoice(roles),
        phone: this.generatePhone(),
        registration_type: Math.random() > 0.8 ? 'phone' : 'email',
        organizations: [`demo-org-${String(Math.floor(i / 5) + 1).padStart(3, '0')}`],
        created_at: this.randomDate(-90, -1),
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });
    }

    testLog('info', `Generated ${users.length} test users`);
    return users;
  }

  public generateOrganizations(count: number = 5): TestOrganization[] {
    const organizations: TestOrganization[] = [];
    
    // Platform admin organization
    organizations.push({
      id: 'platform-admin',
      name: 'JV-Flow Platform Administration',
      description: 'Super admin organization for platform management',
      industry: 'Platform Management',
      owner_id: 'super-admin-001',
      subscription_status: 'active',
      trial_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      settings: {
        currency: 'USD',
        timezone: 'UTC',
        language: 'en'
      },
      created_at: new Date('2024-01-01').toISOString()
    });

    // Generate demo organizations
    for (let i = 0; i < count - 1; i++) {
      const orgId = `demo-org-${String(i + 1).padStart(3, '0')}`;
      const companyName = this.randomChoice(this.companyNames);
      
      organizations.push({
        id: orgId,
        name: companyName,
        description: `${companyName} is a leading real estate development company in the UAE specializing in luxury residential and commercial projects.`,
        industry: 'Real Estate Development',
        owner_id: i === 0 ? 'super-admin-001' : this.generateId('user'),
        subscription_status: Math.random() > 0.7 ? 'trial' : 'active',
        trial_end_date: this.randomDate(1, 31),
        settings: {
          currency: 'AED',
          timezone: 'Asia/Dubai',
          language: Math.random() > 0.5 ? 'en' : 'ar'
        },
        created_at: this.randomDate(-60, -1)
      });
    }

    testLog('info', `Generated ${organizations.length} test organizations`);
    return organizations;
  }

  public generateProjects(organizationIds: string[], count: number = 15): TestProject[] {
    const projects: TestProject[] = [];
    
    for (let i = 0; i < count; i++) {
      const orgId = this.randomChoice(organizationIds.filter(id => id !== 'platform-admin'));
      const projectName = this.randomChoice(this.projectNames);
      const location = this.randomChoice(this.locations);
      const budget = this.randomAmount(5000000, 50000000); // 5M to 50M AED
      const invested = this.randomAmount(budget * 0.1, budget * 0.8);
      const expenses = this.randomAmount(invested * 0.1, invested * 0.9);
      const revenue = this.randomAmount(0, budget * 0.3);
      
      projects.push({
        id: this.generateId('project'),
        organization_id: orgId,
        name: `${projectName} - ${location}`,
        description: `Premium ${projectName.toLowerCase()} development located in ${location}. This project features modern architecture, world-class amenities, and strategic location.`,
        location,
        total_budget: budget,
        cash_balance: invested - expenses,
        total_invested: invested,
        total_expenses: expenses,
        total_revenue: revenue,
        status: this.randomChoice(['planning', 'active', 'completed', 'on_hold']),
        start_date: this.randomDate(-180, -30),
        expected_completion: this.randomDate(30, 730), // 30 days to 2 years
        project_manager_id: this.generateId('user'),
        created_at: this.randomDate(-180, -1)
      });
    }

    testLog('info', `Generated ${projects.length} test projects`);
    return projects;
  }

  public generateVendors(organizationIds: string[], count: number = 30): TestVendor[] {
    const vendors: TestVendor[] = [];
    
    for (let i = 0; i < count; i++) {
      const orgId = this.randomChoice(organizationIds.filter(id => id !== 'platform-admin'));
      const firstName = this.randomChoice(this.firstNames);
      const lastName = this.randomChoice(this.lastNames);
      const companyName = this.randomChoice(this.companyNames);
      
      vendors.push({
        id: this.generateId('vendor'),
        organization_id: orgId,
        name: companyName,
        contact_person: `${firstName} ${lastName}`,
        email: this.generateEmail(firstName, lastName),
        phone: this.generatePhone(),
        address: `${this.randomChoice(this.locations)}, Dubai, UAE`,
        category: this.randomChoice(this.vendorCategories),
        payment_terms: this.randomChoice(['Net 30', 'Net 45', 'Net 60', 'COD', 'Advance']),
        tax_id: `TRN${this.randomNumber(100000000, 999999999)}`,
        is_active: Math.random() > 0.1, // 90% active
        created_at: this.randomDate(-120, -1)
      });
    }

    testLog('info', `Generated ${vendors.length} test vendors`);
    return vendors;
  }

  public generateExpenses(projectIds: string[], vendorIds: string[], count: number = 100): TestExpense[] {
    const expenses: TestExpense[] = [];
    
    for (let i = 0; i < count; i++) {
      const categoryData = this.randomChoice(this.expenseCategories);
      const subcategory = this.randomChoice(categoryData.subcategories);
      const amount = this.randomAmount(5000, 500000); // 5K to 500K AED
      
      expenses.push({
        id: this.generateId('expense'),
        project_id: this.randomChoice(projectIds),
        organization_id: 'demo-org-001', // For simplicity, assign to first demo org
        category: categoryData.category,
        subcategory,
        amount,
        description: `${subcategory} expense for project development - ${this.randomChoice(['Materials procurement', 'Service contract', 'Equipment rental', 'Professional services', 'Permit fees'])}`,
        vendor_id: this.randomChoice(vendorIds),
        status: this.randomChoice(['pending', 'approved', 'rejected', 'paid']),
        created_by: this.generateId('user'),
        approved_by: Math.random() > 0.5 ? this.generateId('user') : undefined,
        receipt_url: Math.random() > 0.7 ? `https://storage.example.com/receipts/receipt_${i}.pdf` : undefined,
        due_date: this.randomDate(7, 30),
        created_at: this.randomDate(-60, -1)
      });
    }

    testLog('info', `Generated ${expenses.length} test expenses`);
    return expenses;
  }

  public generateMaterials(organizationIds: string[], vendorIds: string[], count: number = 50): TestMaterial[] {
    const materials: TestMaterial[] = [];
    
    for (let i = 0; i < count; i++) {
      const categoryData = this.randomChoice(this.materialCategories);
      const item = this.randomChoice(categoryData.items);
      const unitPrice = this.randomAmount(10, 1000);
      const minStock = this.randomNumber(10, 100);
      const currentStock = this.randomNumber(0, minStock * 2);
      
      materials.push({
        id: this.generateId('material'),
        organization_id: this.randomChoice(organizationIds.filter(id => id !== 'platform-admin')),
        name: item,
        category: categoryData.category,
        unit: this.randomChoice(['pcs', 'kg', 'm', 'm2', 'm3', 'liter', 'ton']),
        unit_price: unitPrice,
        supplier_id: this.randomChoice(vendorIds),
        min_stock_level: minStock,
        current_stock: currentStock,
        description: `High quality ${item.toLowerCase()} for construction projects`,
        created_at: this.randomDate(-90, -1)
      });
    }

    testLog('info', `Generated ${materials.length} test materials`);
    return materials;
  }

  public generateBookings(projectIds: string[], count: number = 40): TestBooking[] {
    const bookings: TestBooking[] = [];
    
    for (let i = 0; i < count; i++) {
      const firstName = this.randomChoice(this.firstNames);
      const lastName = this.randomChoice(this.lastNames);
      const totalAmount = this.randomAmount(800000, 3000000); // 800K to 3M AED
      const downPayment = this.randomAmount(totalAmount * 0.1, totalAmount * 0.3);
      
      bookings.push({
        id: this.generateId('booking'),
        project_id: this.randomChoice(projectIds),
        unit_number: `${this.randomChoice(['A', 'B', 'C', 'D'])}-${this.randomNumber(101, 2505)}`,
        customer_name: `${firstName} ${lastName}`,
        customer_email: this.generateEmail(firstName, lastName),
        customer_phone: this.generatePhone(),
        total_amount: totalAmount,
        down_payment: downPayment,
        booking_date: this.randomDate(-30, 30),
        status: this.randomChoice(['reserved', 'booked', 'completed', 'cancelled']),
        agent_id: this.generateId('user'),
        commission_rate: this.randomAmount(1, 5), // 1-5% commission
        created_at: this.randomDate(-60, -1)
      });
    }

    testLog('info', `Generated ${bookings.length} test bookings`);
    return bookings;
  }

  // Generate complete test dataset
  public generateCompleteDataset(): {
    users: TestUser[];
    organizations: TestOrganization[];
    projects: TestProject[];
    vendors: TestVendor[];
    expenses: TestExpense[];
    materials: TestMaterial[];
    bookings: TestBooking[];
    summary: {
      totalRecords: number;
      generatedAt: string;
      currency: string;
    };
  } {
    logger.startTimer('test-data-generation');
    testLog('info', 'Starting complete dataset generation');

    const users = this.generateUsers(25);
    const organizations = this.generateOrganizations(5);
    const projects = this.generateProjects(organizations.map(o => o.id), 15);
    const vendors = this.generateVendors(organizations.map(o => o.id), 30);
    const expenses = this.generateExpenses(projects.map(p => p.id), vendors.map(v => v.id), 100);
    const materials = this.generateMaterials(organizations.map(o => o.id), vendors.map(v => v.id), 50);
    const bookings = this.generateBookings(projects.map(p => p.id), 40);

    const totalRecords = users.length + organizations.length + projects.length + 
                        vendors.length + expenses.length + materials.length + bookings.length;

    const dataset = {
      users,
      organizations,
      projects,
      vendors,
      expenses,
      materials,
      bookings,
      summary: {
        totalRecords,
        generatedAt: new Date().toISOString(),
        currency: getCurrentCurrency()
      }
    };

    logger.endTimer('test-data-generation');
    testLog('info', 'Complete dataset generated', {
      totalRecords,
      users: users.length,
      organizations: organizations.length,
      projects: projects.length,
      vendors: vendors.length,
      expenses: expenses.length,
      materials: materials.length,
      bookings: bookings.length
    });

    return dataset;
  }

  // Export data to localStorage for demo mode
  public exportToLocalStorage(key: string = 'jvflow_test_data'): void {
    try {
      const dataset = this.generateCompleteDataset();
      localStorage.setItem(key, JSON.stringify(dataset));
      testLog('info', 'Test data exported to localStorage', { key, totalRecords: dataset.summary.totalRecords });
    } catch (error) {
      testLog('error', 'Failed to export test data to localStorage', { error });
      throw error;
    }
  }

  // Import data from localStorage
  public importFromLocalStorage(key: string = 'jvflow_test_data'): any {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        testLog('warn', 'No test data found in localStorage', { key });
        return null;
      }
      
      const dataset = JSON.parse(data);
      testLog('info', 'Test data imported from localStorage', { 
        key, 
        totalRecords: dataset.summary?.totalRecords || 'unknown' 
      });
      
      return dataset;
    } catch (error) {
      testLog('error', 'Failed to import test data from localStorage', { error });
      return null;
    }
  }

  // Generate specific entity samples for testing
  public generateSampleProject(): TestProject {
    return {
      id: this.generateId('project'),
      organization_id: 'demo-org-001',
      name: 'Marina Pearl Towers - Dubai Marina',
      description: 'Luxury residential towers with stunning marina views and world-class amenities.',
      location: 'Dubai Marina',
      total_budget: 25000000,
      cash_balance: 5000000,
      total_invested: 15000000,
      total_expenses: 10000000,
      total_revenue: 2000000,
      status: 'active',
      start_date: new Date('2024-01-15').toISOString(),
      expected_completion: new Date('2025-12-31').toISOString(),
      project_manager_id: 'user_sample_001',
      created_at: new Date('2024-01-01').toISOString()
    };
  }

  public generateSampleExpense(): TestExpense {
    return {
      id: this.generateId('expense'),
      project_id: 'project_sample_001',
      organization_id: 'demo-org-001',
      category: 'Construction',
      subcategory: 'Materials',
      amount: 150000,
      description: 'Steel reinforcement bars for foundation work',
      vendor_id: 'vendor_sample_001',
      status: 'approved',
      created_by: 'user_sample_002',
      approved_by: 'user_sample_001',
      receipt_url: 'https://storage.example.com/receipts/steel_order.pdf',
      due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const testDataGenerator = TestDataGenerator.getInstance();
export default testDataGenerator;