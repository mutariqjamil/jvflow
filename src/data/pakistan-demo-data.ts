// Pakistan-specific demo data for JV-Flow
// This file contains demo data tailored for the Pakistani real estate market

export const PAKISTAN_DEMO_ORGANIZATIONS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Karachi Prime Properties',
    description: 'Leading real estate development company in Karachi specializing in residential and commercial projects',
    industry: 'Real Estate Development',
    logo_url: '/assets/demo/logo-karachi-prime.png',
    primary_color: '#0a5d3a', // Pakistan Green
    secondary_color: '#ffffff',
    subscription_plan: 'professional',
    subscription_status: 'active',
    billing_email: 'billing@karachiprimeproperties.pk',
    phone: '+92-21-35123456',
    address: {
      street: 'Plot 234, Clifton Block 5',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75600',
      country: 'Pakistan'
    },
    settings: {
      currency: 'PKR',
      timezone: 'Asia/Karachi',
      fiscal_year_start: 'July' // Pakistan's fiscal year
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440100',
    name: 'Lahore Elite Developers',
    description: 'Premium residential and commercial development company in Lahore',
    industry: 'Real Estate Development',
    logo_url: '/assets/demo/logo-lahore-elite.png',
    primary_color: '#8b0000',
    secondary_color: '#ffffff',
    subscription_plan: 'enterprise',
    subscription_status: 'active',
    billing_email: 'accounts@lahoreeelitedevelopers.pk',
    phone: '+92-42-37890123',
    address: {
      street: 'Plot 567, DHA Phase 5',
      city: 'Lahore',
      state: 'Punjab',
      zipCode: '54700',
      country: 'Pakistan'
    },
    settings: {
      currency: 'PKR',
      timezone: 'Asia/Karachi',
      fiscal_year_start: 'July'
    }
  }
]

export const PAKISTAN_PROJECTS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Sea View Towers',
    description: '40-story luxury residential towers with Arabian Sea view',
    project_type: 'Residential',
    status: 'active',
    start_date: '2024-01-15',
    end_date: '2026-12-31',
    budget: 800000000.00, // 800 million PKR
    actual_cost: 480000000.00, // 480 million PKR
    currency: 'PKR',
    location: {
      address: 'Marine Drive, Clifton',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75600',
      coordinates: { lat: 24.8030, lng: 67.0344 }
    },
    project_manager_id: '550e8400-e29b-41d4-a716-446655440001',
    settings: {
      phases: 4,
      units: 240,
      floors: 40,
      completion_percentage: 60
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Gulshan Commercial Plaza',
    description: 'Multi-use commercial complex with retail and office spaces',
    project_type: 'Commercial',
    status: 'planning',
    start_date: '2024-06-01',
    end_date: '2025-12-31',
    budget: 500000000.00, // 500 million PKR
    actual_cost: 75000000.00, // 75 million PKR
    currency: 'PKR',
    location: {
      address: 'Main Rashid Minhas Road, Gulshan-e-Iqbal',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75300',
      coordinates: { lat: 24.9341, lng: 67.1120 }
    },
    project_manager_id: '550e8400-e29b-41d4-a716-446655440001',
    settings: {
      phases: 3,
      floors: 15,
      completion_percentage: 15
    }
  }
]

export const PAKISTAN_USERS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'ahmed.manager@karachiprimeproperties.pk',
    first_name: 'Ahmed',
    last_name: 'Khan',
    phone: '+92-300-1234567',
    avatar_url: '/assets/demo/avatar-ahmed.jpg',
    role: 'project_manager',
    status: 'active',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    permissions: ['projects.manage', 'expenses.approve', 'users.view'],
    address: {
      city: 'Karachi',
      state: 'Sindh'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'fatima.sales@karachiprimeproperties.pk',
    first_name: 'Fatima',
    last_name: 'Malik',
    phone: '+92-301-2345678',
    avatar_url: '/assets/demo/avatar-fatima.jpg',
    role: 'sales_executive',
    status: 'active',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    permissions: ['bookings.manage', 'customers.manage', 'commissions.view'],
    address: {
      city: 'Karachi',
      state: 'Sindh'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'hassan.finance@karachiprimeproperties.pk',
    first_name: 'Hassan',
    last_name: 'Ali',
    phone: '+92-302-3456789',
    avatar_url: '/assets/demo/avatar-hassan.jpg',
    role: 'finance_manager',
    status: 'active',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    permissions: ['expenses.manage', 'invoices.manage', 'reports.view'],
    address: {
      city: 'Karachi',
      state: 'Sindh'
    }
  }
]

export const PAKISTAN_EXPENSES = [
  {
    id: '550e8400-e29b-41d4-a716-446655440030',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    category: 'Construction Materials',
    description: 'Imported steel for tower construction - Phase 1',
    amount: 12500000.00, // 12.5 million PKR
    currency: 'PKR',
    date: '2024-03-15',
    status: 'approved',
    submitted_by: '550e8400-e29b-41d4-a716-446655440001',
    approved_by: '550e8400-e29b-41d4-a716-446655440003',
    tags: ['steel', 'construction', 'phase1', 'imported'],
    vendor: 'National Steel Mills',
    receipt_url: '/receipts/expense-030.pdf'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440031',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    category: 'Labour',
    description: 'Construction crew salaries - March 2024',
    amount: 3500000.00, // 3.5 million PKR
    currency: 'PKR',
    date: '2024-03-31',
    status: 'pending',
    submitted_by: '550e8400-e29b-41d4-a716-446655440001',
    tags: ['labour', 'salaries', 'monthly'],
    vendor: 'Karachi Construction Workers Union'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440032',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    category: 'Equipment',
    description: 'Tower crane rental - Monthly charge',
    amount: 850000.00, // 850K PKR
    currency: 'PKR',
    date: '2024-04-01',
    status: 'approved',
    submitted_by: '550e8400-e29b-41d4-a716-446655440001',
    approved_by: '550e8400-e29b-41d4-a716-446655440003',
    tags: ['equipment', 'crane', 'rental'],
    vendor: 'Pakistan Heavy Equipment Rentals'
  }
]

export const PAKISTAN_BOOKINGS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440060',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    customer_name: 'Mr. & Mrs. Tariq Ahmed',
    customer_email: 'tariq.ahmed@email.com',
    customer_phone: '+92-321-7654321',
    customer_cnic: '42101-1234567-8',
    unit_number: 'Tower-A-1505',
    unit_type: '3 Bedroom Premium',
    unit_size: '1850 sq ft',
    booking_amount: 15000000.00, // 15 million PKR down payment
    total_amount: 75000000.00, // 75 million PKR total
    currency: 'PKR',
    booking_date: '2024-02-15',
    possession_date: '2025-12-31',
    status: 'confirmed',
    sales_person_id: '550e8400-e29b-41d4-a716-446655440002',
    commission_rate: 1.5,
    commission_amount: 1125000.00, // 1.125 million PKR
    installment_plan: 'quarterly',
    notes: 'Premium sea-view unit. Customer has opted for luxury interior package.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440061',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    project_id: '550e8400-e29b-41d4-a716-446655440010',
    customer_name: 'Ms. Sarah Malik',
    customer_email: 'sarah.malik@email.com',
    customer_phone: '+92-333-8765432',
    customer_cnic: '42101-9876543-2',
    unit_number: 'Tower-B-0803',
    unit_type: '2 Bedroom Standard',
    unit_size: '1200 sq ft',
    booking_amount: 8000000.00, // 8 million PKR down payment
    total_amount: 40000000.00, // 40 million PKR total
    currency: 'PKR',
    booking_date: '2024-03-10',
    possession_date: '2026-06-30',
    status: 'confirmed',
    sales_person_id: '550e8400-e29b-41d4-a716-446655440002',
    commission_rate: 1.5,
    commission_amount: 600000.00, // 600K PKR
    installment_plan: 'monthly',
    notes: 'Young professional buyer. Flexible payment schedule arranged.'
  }
]

export const PAKISTAN_VENDORS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440040',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Karachi Concrete Industries',
    contact_person: 'Engr. Rizwan Sheikh',
    email: 'orders@karachiconcrete.pk',
    phone: '+92-21-32567890',
    address: {
      street: 'Plot 456, SITE Area',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75700'
    },
    vendor_type: 'Concrete Supplier',
    rating: 4.7,
    status: 'active',
    payment_terms: 'Net 15',
    bank_details: {
      account_name: 'Karachi Concrete Industries',
      account_number: '0123456789',
      bank_name: 'HBL Bank',
      iban: 'PK36HABB0012345678901234'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440041',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Al-Badar Construction Services',
    contact_person: 'Rahim Butt',
    email: 'info@albadarconstructoin.pk',
    phone: '+92-21-34567891',
    address: {
      street: 'Block 789, North Nazimabad',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '74700'
    },
    vendor_type: 'Construction Contractor',
    rating: 4.9,
    status: 'active',
    payment_terms: 'Net 30',
    bank_details: {
      account_name: 'Al-Badar Construction Services',
      account_number: '9876543210',
      bank_name: 'UBL Bank',
      iban: 'PK73UNIL0012345678901234'
    }
  }
]

export const PAKISTAN_MATERIALS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440050',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Grade 40 Ready Mix Concrete',
    description: 'High-grade concrete mix suitable for high-rise construction',
    category: 'Concrete & Masonry',
    unit: 'cubic_meter',
    unit_price: 8500.00, // PKR per cubic meter
    currency: 'PKR',
    supplier_id: '550e8400-e29b-41d4-a716-446655440040',
    stock_quantity: 2000.0,
    minimum_stock: 500.0,
    specifications: {
      grade: 'Grade 40',
      slump: '75-100mm',
      max_aggregate_size: '20mm',
      cement_content: '380 kg/m³'
    },
    status: 'active',
    last_purchase_date: '2024-03-15',
    last_purchase_price: 8200.00
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440051',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Grade 60 Steel Rebar',
    description: 'High tensile strength steel reinforcement bars',
    category: 'Steel & Metal',
    unit: 'metric_ton',
    unit_price: 245000.00, // PKR per metric ton
    currency: 'PKR',
    supplier_id: '550e8400-e29b-41d4-a716-446655440041',
    stock_quantity: 150.0,
    minimum_stock: 50.0,
    specifications: {
      grade: 'Grade 60',
      standard: 'ASTM A615',
      sizes_available: '#4, #5, #6, #8, #10',
      length: '12 meter standard'
    },
    status: 'active',
    last_purchase_date: '2024-03-10',
    last_purchase_price: 238000.00
  }
]

// Export all Pakistan demo data as a single collection
export const PAKISTAN_DEMO_DATA = {
  organizations: PAKISTAN_DEMO_ORGANIZATIONS,
  projects: PAKISTAN_PROJECTS,
  users: PAKISTAN_USERS,
  expenses: PAKISTAN_EXPENSES,
  bookings: PAKISTAN_BOOKINGS,
  vendors: PAKISTAN_VENDORS,
  materials: PAKISTAN_MATERIALS
}

// Currency formatting utilities for Pakistan
export const formatPKR = (amount: number, showSymbol: boolean = true): string => {
  const formatter = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  
  if (showSymbol) {
    return formatter.format(amount)
  } else {
    return amount.toLocaleString('en-PK')
  }
}

// Pakistani number formatting (uses lakh/crore system)
export const formatPakistaniNumber = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore
    const crores = amount / 10000000
    return `${crores.toFixed(2)} Crore${crores !== 1 ? 's' : ''}`
  } else if (amount >= 100000) { // 1 lakh
    const lakhs = amount / 100000
    return `${lakhs.toFixed(2)} Lakh${lakhs !== 1 ? 's' : ''}`
  } else {
    return amount.toLocaleString('en-PK')
  }
}