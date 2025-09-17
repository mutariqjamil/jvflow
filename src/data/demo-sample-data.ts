// JV-Flow Demo Sample Data
// This file contains all static demo data for the application
// Use this data to populate the application for demonstration purposes

export const DEMO_ORGANIZATIONS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Prime Real Estate Ventures',
    description: 'Leading real estate development company specializing in luxury residential and commercial properties',
    industry: 'Real Estate',
    logo_url: '/assets/demo/logo-prime-real-estate.png',
    primary_color: '#030213',
    secondary_color: '#e9ebef',
    subscription_plan: 'professional',
    subscription_status: 'active',
    billing_email: 'billing@primerealestate.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Business District',
      city: 'Metro City',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    settings: {
      currency: 'USD',
      timezone: 'America/Los_Angeles',
      fiscal_year_start: 'January'
    }
  }
]

export const DEMO_USERS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'john.manager@primerealestate.com',
    first_name: 'John',
    last_name: 'Manager',
    phone: '+1-555-0124',
    avatar_url: '/assets/demo/avatar-john.jpg',
    role: 'project_manager',
    status: 'active',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    permissions: ['projects.manage', 'expenses.approve', 'users.view']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'sarah.sales@primerealestate.com',
    first_name: 'Sarah',
    last_name: 'Wilson',
    phone: '+1-555-0125',
    avatar_url: '/assets/demo/avatar-sarah.jpg',
    role: 'sales_executive',
    status: 'active',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    permissions: ['bookings.manage', 'customers.manage', 'commissions.view']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'mike.finance@primerealestate.com',
    first_name: 'Mike',
    last_name: 'Chen',
    phone: '+1-555-0126',
    avatar_url: '/assets/demo/avatar-mike.jpg',
    role: 'finance_manager',
    status: 'active',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    permissions: ['expenses.manage', 'invoices.manage', 'reports.view']
  }
]

export const DEMO_PROJECTS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Sunset Heights Residency',
    description: 'Luxury 50-unit residential complex with modern amenities',
    project_type: 'Residential',
    status: 'active',
    start_date: '2024-01-15',
    end_date: '2025-12-31',
    budget: 15000000.00,
    actual_cost: 8500000.00,
    location: {
      address: '456 Sunset Boulevard',
      city: 'Metro City',
      state: 'CA',
      zipCode: '90211',
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    project_manager_id: '550e8400-e29b-41d4-a716-446655440001',
    settings: {
      phases: 4,
      units: 50,
      completion_percentage: 65
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Metro Business Center',
    description: 'Grade-A commercial office complex with retail spaces',
    project_type: 'Commercial',
    status: 'planning',
    start_date: '2024-06-01',
    end_date: '2026-08-31',
    budget: 25000000.00,
    actual_cost: 2100000.00,
    location: {
      address: '789 Business Avenue',
      city: 'Metro City',
      state: 'CA',
      zipCode: '90212',
      coordinates: { lat: 34.0622, lng: -118.2537 }
    },
    project_manager_id: '550e8400-e29b-41d4-a716-446655440001',
    settings: {
      phases: 3,
      floors: 12,
      completion_percentage: 15
    }
  }
]

export const DEMO_PROJECT_MILESTONES = [
  {
    id: '550e8400-e29b-41d4-a716-446655440020',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Foundation & Structure',
    description: 'Complete foundation work and structural framework',
    status: 'completed',
    due_date: '2024-06-30',
    completion_date: '2024-06-28',
    budget: 3500000.00,
    actual_cost: 3450000.00,
    materials_required: [
      { material_id: 'concrete', quantity: 2500, unit: 'cubic_yards' },
      { material_id: 'steel_rebar', quantity: 150, unit: 'tons' }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440021',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Interior & Finishing',
    description: 'Interior work, fixtures, and final finishes',
    status: 'in_progress',
    due_date: '2025-03-31',
    budget: 2800000.00,
    actual_cost: 1200000.00,
    materials_required: [
      { material_id: 'flooring', quantity: 15000, unit: 'sq_ft' },
      { material_id: 'fixtures', quantity: 200, unit: 'units' }
    ]
  }
]

export const DEMO_EXPENSES = [
  {
    id: '550e8400-e29b-41d4-a716-446655440030',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    category: 'Materials',
    description: 'Concrete delivery for foundation work',
    amount: 85000.00,
    currency: 'USD',
    date: '2024-03-15',
    status: 'approved',
    submitted_by: '550e8400-e29b-41d4-a716-446655440001',
    approved_by: '550e8400-e29b-41d4-a716-446655440003',
    tags: ['foundation', 'materials', 'phase1']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440031',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    category: 'Labor',
    description: 'Construction crew wages - Week 12',
    amount: 45000.00,
    currency: 'USD',
    date: '2024-04-08',
    status: 'pending',
    submitted_by: '550e8400-e29b-41d4-a716-446655440001',
    tags: ['labor', 'wages', 'weekly']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440032',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    category: 'Equipment',
    description: 'Crane rental - Monthly',
    amount: 12000.00,
    currency: 'USD',
    date: '2024-04-01',
    status: 'approved',
    submitted_by: '550e8400-e29b-41d4-a716-446655440001',
    approved_by: '550e8400-e29b-41d4-a716-446655440003',
    tags: ['equipment', 'rental', 'monthly']
  }
]

export const DEMO_VENDORS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440040',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Superior Concrete Supply',
    contact_person: 'Robert Martinez',
    email: 'orders@superiorconcrete.com',
    phone: '+1-555-0200',
    address: {
      street: '789 Industrial Drive',
      city: 'Metro City',
      state: 'CA',
      zipCode: '90213'
    },
    vendor_type: 'Materials Supplier',
    rating: 4.8,
    status: 'active',
    payment_terms: 'Net 30'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440041',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Elite Construction Services',
    contact_person: 'Jennifer Thompson',
    email: 'contact@eliteconstruction.com',
    phone: '+1-555-0201',
    address: {
      street: '456 Construction Way',
      city: 'Metro City',
      state: 'CA',
      zipCode: '90214'
    },
    vendor_type: 'Contractor',
    rating: 4.9,
    status: 'active',
    payment_terms: 'Net 15'
  }
]

export const DEMO_MATERIALS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440050',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'High-Grade Concrete Mix',
    description: 'Premium concrete mix for structural applications',
    category: 'Concrete & Masonry',
    unit: 'cubic_yard',
    unit_price: 120.00,
    currency: 'USD',
    supplier_id: '550e8400-e29b-41d4-a716-446655440040',
    stock_quantity: 500.0,
    minimum_stock: 100.0,
    specifications: {
      psi: 4000,
      slump: '3-5 inches',
      aggregate_size: '3/4 inch'
    },
    status: 'active'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440051',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Steel Reinforcement Bars',
    description: 'Grade 60 steel rebar for concrete reinforcement',
    category: 'Steel & Metal',
    unit: 'ton',
    unit_price: 850.00,
    currency: 'USD',
    supplier_id: '550e8400-e29b-41d4-a716-446655440041',
    stock_quantity: 75.0,
    minimum_stock: 25.0,
    specifications: {
      grade: 'Grade 60',
      sizes: '4, 5, 6, 8 rebar',
      length: '20 feet standard'
    },
    status: 'active'
  }
]

export const DEMO_BOOKINGS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440060',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    customer_name: 'David & Emily Rodriguez',
    customer_email: 'david.rodriguez@email.com',
    customer_phone: '+1-555-0301',
    unit_number: 'A-301',
    unit_type: '3BHK Premium',
    booking_amount: 150000.00,
    total_amount: 750000.00,
    booking_date: '2024-02-15',
    status: 'confirmed',
    sales_person_id: '550e8400-e29b-41d4-a716-446655440002',
    commission_rate: 2.5,
    commission_amount: 18750.00,
    notes: 'Premium unit with city view. Customer requested custom finishes.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440061',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    customer_name: 'Alex Johnson',
    customer_email: 'alex.johnson@email.com',
    customer_phone: '+1-555-0302',
    unit_number: 'B-205',
    unit_type: '2BHK Standard',
    booking_amount: 100000.00,
    total_amount: 550000.00,
    booking_date: '2024-03-10',
    status: 'confirmed',
    sales_person_id: '550e8400-e29b-41d4-a716-446655440002',
    commission_rate: 2.0,
    commission_amount: 11000.00,
    notes: 'Ready to move unit. Fast approval process.'
  }
]

export const DEMO_PURCHASE_ORDERS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440070',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    vendor_id: '550e8400-e29b-41d4-a716-446655440040',
    po_number: 'PO-2024-001',
    status: 'approved',
    order_date: '2024-03-01',
    expected_delivery: '2024-03-15',
    actual_delivery: '2024-03-14',
    total_amount: 300000.00,
    currency: 'USD',
    terms: {
      payment_terms: 'Net 30',
      delivery_terms: 'FOB Destination',
      warranty: '1 Year'
    },
    notes: 'Urgent delivery required for foundation work',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    approved_by: '550e8400-e29b-41d4-a716-446655440003'
  }
]

export const DEMO_INVOICES = [
  {
    id: '550e8400-e29b-41d4-a716-446655440080',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    invoice_number: 'INV-2024-001',
    customer_name: 'David & Emily Rodriguez',
    customer_email: 'david.rodriguez@email.com',
    invoice_date: '2024-02-15',
    due_date: '2024-03-15',
    amount: 150000.00,
    tax_amount: 12000.00,
    total_amount: 162000.00,
    status: 'paid',
    booking_id: '550e8400-e29b-41d4-a716-446655440060'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440081',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    invoice_number: 'INV-2024-002',
    customer_name: 'Alex Johnson',
    customer_email: 'alex.johnson@email.com',
    invoice_date: '2024-03-10',
    due_date: '2024-04-10',
    amount: 100000.00,
    tax_amount: 8000.00,
    total_amount: 108000.00,
    status: 'pending',
    booking_id: '550e8400-e29b-41d4-a716-446655440061'
  }
]

export const DEMO_COMMISSIONS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440090',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    booking_id: '550e8400-e29b-41d4-a716-446655440060',
    commission_type: 'Sales Commission',
    base_amount: 750000.00,
    commission_rate: 2.5,
    commission_amount: 18750.00,
    status: 'paid',
    paid_date: '2024-03-01',
    payment_reference: 'PAY-2024-COM-001'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440091',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    booking_id: '550e8400-e29b-41d4-a716-446655440061',
    commission_type: 'Sales Commission',
    base_amount: 550000.00,
    commission_rate: 2.0,
    commission_amount: 11000.00,
    status: 'pending'
  }
]

export const DEMO_MARKETING_CAMPAIGNS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440100',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Sunset Heights Launch Campaign',
    description: 'Grand launch campaign for Sunset Heights Residency',
    campaign_type: 'Product Launch',
    status: 'active',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    budget: 250000.00,
    actual_spend: 180000.00,
    target_audience: {
      age_range: '28-45',
      income_level: 'Upper Middle Class',
      location: 'Metro City & Suburbs'
    },
    channels: ['Digital Marketing', 'Print Media', 'Radio', 'Events'],
    metrics: {
      leads_generated: 1250,
      conversions: 48,
      cost_per_lead: 144.00,
      roi: 3.2
    },
    created_by: '550e8400-e29b-41d4-a716-446655440001'
  }
]

// Chart data for dashboards
export const DEMO_CHART_DATA = {
  revenue: [
    { month: 'Jan', amount: 850000, target: 800000 },
    { month: 'Feb', amount: 920000, target: 850000 },
    { month: 'Mar', amount: 1100000, target: 950000 },
    { month: 'Apr', amount: 980000, target: 1000000 },
    { month: 'May', amount: 1250000, target: 1100000 },
    { month: 'Jun', amount: 1180000, target: 1200000 }
  ],
  expenses: [
    { category: 'Materials', amount: 450000, percentage: 45 },
    { category: 'Labor', amount: 300000, percentage: 30 },
    { category: 'Equipment', amount: 150000, percentage: 15 },
    { category: 'Overhead', amount: 100000, percentage: 10 }
  ],
  sales: [
    { month: 'Jan', units: 5, revenue: 2750000 },
    { month: 'Feb', units: 8, revenue: 4400000 },
    { month: 'Mar', units: 12, revenue: 6600000 },
    { month: 'Apr', units: 6, revenue: 3300000 },
    { month: 'May', units: 15, revenue: 8250000 },
    { month: 'Jun', units: 10, revenue: 5500000 }
  ],
  projectProgress: [
    { project: 'Sunset Heights', progress: 65, budget: 15000000, spent: 8500000 },
    { project: 'Metro Business Center', progress: 15, budget: 25000000, spent: 2100000 },
    { project: 'Green Valley Homes', progress: 90, budget: 8000000, spent: 7200000 }
  ]
}

// Notification templates
export const DEMO_NOTIFICATIONS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440110',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'New Expense Approval Required',
    message: 'Construction crew wages expense of $45,000 requires your approval',
    type: 'expense_approval',
    priority: 'high',
    action_url: '/expenses/pending'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440111',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'New Lead Assigned',
    message: 'New potential buyer interested in 2BHK units at Sunset Heights',
    type: 'lead_assignment',
    priority: 'medium',
    action_url: '/sales/leads'
  }
]

// Application constants
export const APP_CONSTANTS = {
  ROLES: [
    { value: 'admin', label: 'Administrator', permissions: ['all'] },
    { value: 'project_manager', label: 'Project Manager', permissions: ['projects.manage', 'expenses.approve', 'users.view'] },
    { value: 'finance_manager', label: 'Finance Manager', permissions: ['expenses.manage', 'invoices.manage', 'reports.view'] },
    { value: 'sales_executive', label: 'Sales Executive', permissions: ['bookings.manage', 'customers.manage', 'commissions.view'] },
    { value: 'user', label: 'User', permissions: ['expenses.submit', 'projects.view'] }
  ],
  
  EXPENSE_CATEGORIES: [
    'Materials', 'Labor', 'Equipment', 'Transportation', 'Utilities', 
    'Legal & Professional', 'Marketing', 'Office Supplies', 'Travel', 'Other'
  ],
  
  PROJECT_TYPES: [
    'Residential', 'Commercial', 'Mixed Use', 'Infrastructure', 'Renovation'
  ],
  
  PROJECT_STATUSES: [
    'planning', 'active', 'on_hold', 'completed', 'cancelled'
  ],
  
  BOOKING_STATUSES: [
    'inquiry', 'booked', 'confirmed', 'cancelled', 'completed'
  ],
  
  PAYMENT_STATUSES: [
    'pending', 'paid', 'overdue', 'cancelled', 'refunded'
  ],
  
  VENDOR_TYPES: [
    'Materials Supplier', 'Contractor', 'Service Provider', 
    'Equipment Rental', 'Professional Services', 'Consultant'
  ],
  
  MATERIAL_CATEGORIES: [
    'Concrete & Masonry', 'Steel & Metal', 'Lumber & Wood', 
    'Electrical', 'Plumbing', 'HVAC', 'Flooring', 'Roofing', 
    'Insulation', 'Paint & Finishes', 'Hardware', 'Other'
  ]
}

// Feature flags for demo
export const DEMO_FEATURE_FLAGS = {
  enableAdvancedReporting: true,
  enableMobileOptimization: true,
  enableRealTimeNotifications: true,
  enableAutomatedInvoicing: true,
  enableVendorPortal: false,
  enableCustomerPortal: false,
  enableAdvancedAnalytics: true,
  enableMultiCurrency: false,
  enableAPIIntegrations: false
}

// Export all demo data as a single object for easy import
export const DEMO_DATA = {
  organizations: DEMO_ORGANIZATIONS,
  users: DEMO_USERS,
  projects: DEMO_PROJECTS,
  milestones: DEMO_PROJECT_MILESTONES,
  expenses: DEMO_EXPENSES,
  vendors: DEMO_VENDORS,
  materials: DEMO_MATERIALS,
  bookings: DEMO_BOOKINGS,
  purchaseOrders: DEMO_PURCHASE_ORDERS,
  invoices: DEMO_INVOICES,
  commissions: DEMO_COMMISSIONS,
  campaigns: DEMO_MARKETING_CAMPAIGNS,
  notifications: DEMO_NOTIFICATIONS,
  chartData: DEMO_CHART_DATA,
  constants: APP_CONSTANTS,
  featureFlags: DEMO_FEATURE_FLAGS
}