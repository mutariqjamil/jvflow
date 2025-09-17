-- JV-Flow Demo Data Population Script
-- This script populates the database with sample data for demonstration purposes
-- Run this after the initial schema setup to get a working demo environment

-- Insert demo organization
INSERT INTO organizations (
    id,
    name,
    description,
    industry,
    primary_color,
    secondary_color,
    subscription_plan,
    subscription_status,
    billing_email,
    phone,
    address,
    settings
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Prime Real Estate Ventures',
    'Leading real estate development company specializing in luxury residential and commercial properties',
    'Real Estate',
    '#030213',
    '#e9ebef',
    'professional',
    'active',
    'billing@primerealestate.com',
    '+1-555-0123',
    '{"street": "123 Business District", "city": "Metro City", "state": "CA", "zipCode": "90210", "country": "USA"}',
    '{"currency": "USD", "timezone": "America/Los_Angeles", "fiscal_year_start": "January"}'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo users
INSERT INTO users (
    id,
    email,
    first_name,
    last_name,
    phone,
    role,
    status,
    organization_id,
    permissions
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'john.manager@primerealestate.com',
    'John',
    'Manager',
    '+1-555-0124',
    'project_manager',
    'active',
    '550e8400-e29b-41d4-a716-446655440000',
    '["projects.manage", "expenses.approve", "users.view"]'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'sarah.sales@primerealestate.com',
    'Sarah',
    'Wilson',
    '+1-555-0125',
    'sales_executive',
    'active',
    '550e8400-e29b-41d4-a716-446655440000',
    '["bookings.manage", "customers.manage", "commissions.view"]'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'mike.finance@primerealestate.com',
    'Mike',
    'Chen',
    '+1-555-0126',
    'finance_manager',
    'active',
    '550e8400-e29b-41d4-a716-446655440000',
    '["expenses.manage", "invoices.manage", "reports.view"]'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo projects
INSERT INTO projects (
    id,
    organization_id,
    name,
    description,
    project_type,
    status,
    start_date,
    end_date,
    budget,
    actual_cost,
    location,
    project_manager_id,
    settings
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440000',
    'Sunset Heights Residency',
    'Luxury 50-unit residential complex with modern amenities',
    'Residential',
    'active',
    '2024-01-15',
    '2025-12-31',
    15000000.00,
    8500000.00,
    '{"address": "456 Sunset Boulevard", "city": "Metro City", "state": "CA", "zipCode": "90211", "coordinates": {"lat": 34.0522, "lng": -118.2437}}',
    '550e8400-e29b-41d4-a716-446655440001',
    '{"phases": 4, "units": 50, "completion_percentage": 65}'
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440000',
    'Metro Business Center',
    'Grade-A commercial office complex with retail spaces',
    'Commercial',
    'planning',
    '2024-06-01',
    '2026-08-31',
    25000000.00,
    2100000.00,
    '{"address": "789 Business Avenue", "city": "Metro City", "state": "CA", "zipCode": "90212", "coordinates": {"lat": 34.0622, "lng": -118.2537}}',
    '550e8400-e29b-41d4-a716-446655440001',
    '{"phases": 3, "floors": 12, "completion_percentage": 15}'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo project milestones
INSERT INTO project_milestones (
    id,
    project_id,
    name,
    description,
    status,
    due_date,
    completion_date,
    budget,
    actual_cost,
    materials_required
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440010',
    'Foundation & Structure',
    'Complete foundation work and structural framework',
    'completed',
    '2024-06-30',
    '2024-06-28',
    3500000.00,
    3450000.00,
    '[{"material_id": "concrete", "quantity": 2500, "unit": "cubic_yards"}, {"material_id": "steel_rebar", "quantity": 150, "unit": "tons"}]'
),
(
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440010',
    'Interior & Finishing',
    'Interior work, fixtures, and final finishes',
    'in_progress',
    '2025-03-31',
    NULL,
    2800000.00,
    1200000.00,
    '[{"material_id": "flooring", "quantity": 15000, "unit": "sq_ft"}, {"material_id": "fixtures", "quantity": 200, "unit": "units"}]'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo vendors
INSERT INTO vendors (
    id,
    organization_id,
    name,
    contact_person,
    email,
    phone,
    address,
    vendor_type,
    rating,
    status,
    payment_terms
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440040',
    '550e8400-e29b-41d4-a716-446655440000',
    'Superior Concrete Supply',
    'Robert Martinez',
    'orders@superiorconcrete.com',
    '+1-555-0200',
    '{"street": "789 Industrial Drive", "city": "Metro City", "state": "CA", "zipCode": "90213"}',
    'Materials Supplier',
    4.8,
    'active',
    'Net 30'
),
(
    '550e8400-e29b-41d4-a716-446655440041',
    '550e8400-e29b-41d4-a716-446655440000',
    'Elite Construction Services',
    'Jennifer Thompson',
    'contact@eliteconstruction.com',
    '+1-555-0201',
    '{"street": "456 Construction Way", "city": "Metro City", "state": "CA", "zipCode": "90214"}',
    'Contractor',
    4.9,
    'active',
    'Net 15'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo materials
INSERT INTO materials (
    id,
    organization_id,
    name,
    description,
    category,
    unit,
    unit_price,
    currency,
    supplier_id,
    stock_quantity,
    minimum_stock,
    specifications,
    status
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440050',
    '550e8400-e29b-41d4-a716-446655440000',
    'High-Grade Concrete Mix',
    'Premium concrete mix for structural applications',
    'Concrete & Masonry',
    'cubic_yard',
    120.00,
    'USD',
    '550e8400-e29b-41d4-a716-446655440040',
    500.0,
    100.0,
    '{"psi": 4000, "slump": "3-5 inches", "aggregate_size": "3/4 inch"}',
    'active'
),
(
    '550e8400-e29b-41d4-a716-446655440051',
    '550e8400-e29b-41d4-a716-446655440000',
    'Steel Reinforcement Bars',
    'Grade 60 steel rebar for concrete reinforcement',
    'Steel & Metal',
    'ton',
    850.00,
    'USD',
    '550e8400-e29b-41d4-a716-446655440041',
    75.0,
    25.0,
    '{"grade": "Grade 60", "sizes": "4, 5, 6, 8 rebar", "length": "20 feet standard"}',
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo expenses
INSERT INTO expenses (
    id,
    organization_id,
    project_id,
    category,
    description,
    amount,
    currency,
    date,
    status,
    submitted_by,
    approved_by,
    approved_at,
    tags
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440010',
    'Materials',
    'Concrete delivery for foundation work',
    85000.00,
    'USD',
    '2024-03-15',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440003',
    '2024-03-16 10:30:00+00',
    '["foundation", "materials", "phase1"]'
),
(
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440010',
    'Labor',
    'Construction crew wages - Week 12',
    45000.00,
    'USD',
    '2024-04-08',
    'pending',
    '550e8400-e29b-41d4-a716-446655440001',
    NULL,
    NULL,
    '["labor", "wages", "weekly"]'
),
(
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440010',
    'Equipment',
    'Crane rental - Monthly',
    12000.00,
    'USD',
    '2024-04-01',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440003',
    '2024-04-02 14:15:00+00',
    '["equipment", "rental", "monthly"]'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo bookings
INSERT INTO bookings (
    id,
    organization_id,
    project_id,
    customer_name,
    customer_email,
    customer_phone,
    unit_number,
    unit_type,
    booking_amount,
    total_amount,
    booking_date,
    status,
    sales_person_id,
    commission_rate,
    commission_amount,
    notes
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440060',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440010',
    'David & Emily Rodriguez',
    'david.rodriguez@email.com',
    '+1-555-0301',
    'A-301',
    '3BHK Premium',
    150000.00,
    750000.00,
    '2024-02-15',
    'confirmed',
    '550e8400-e29b-41d4-a716-446655440002',
    2.5,
    18750.00,
    'Premium unit with city view. Customer requested custom finishes.'
),
(
    '550e8400-e29b-41d4-a716-446655440061',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440010',
    'Alex Johnson',
    'alex.johnson@email.com',
    '+1-555-0302',
    'B-205',
    '2BHK Standard',
    100000.00,
    550000.00,
    '2024-03-10',
    'confirmed',
    '550e8400-e29b-41d4-a716-446655440002',
    2.0,
    11000.00,
    'Ready to move unit. Fast approval process.'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo purchase orders
INSERT INTO purchase_orders (
    id,
    organization_id,
    project_id,
    vendor_id,
    po_number,
    status,
    order_date,
    expected_delivery,
    actual_delivery,
    total_amount,
    currency,
    terms,
    notes,
    created_by,
    approved_by
) VALUES (
    '550e8400-e29b-41d4-a716-446655440070',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440040',
    'PO-2024-001',
    'approved',
    '2024-03-01',
    '2024-03-15',
    '2024-03-14',
    300000.00,
    'USD',
    '{"payment_terms": "Net 30", "delivery_terms": "FOB Destination", "warranty": "1 Year"}',
    'Urgent delivery required for foundation work',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440003'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo purchase order items
INSERT INTO purchase_order_items (
    id,
    po_id,
    material_id,
    description,
    quantity,
    unit_price,
    total_price,
    received_quantity
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440075',
    '550e8400-e29b-41d4-a716-446655440070',
    '550e8400-e29b-41d4-a716-446655440050',
    'High-Grade Concrete Mix',
    2500.00,
    120.00,
    300000.00,
    2500.00
) ON CONFLICT (id) DO NOTHING;

-- Insert demo invoices
INSERT INTO invoices (
    id,
    organization_id,
    invoice_number,
    customer_name,
    customer_email,
    invoice_date,
    due_date,
    amount,
    tax_amount,
    total_amount,
    status,
    booking_id
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440080',
    '550e8400-e29b-41d4-a716-446655440000',
    'INV-2024-001',
    'David & Emily Rodriguez',
    'david.rodriguez@email.com',
    '2024-02-15',
    '2024-03-15',
    150000.00,
    12000.00,
    162000.00,
    'paid',
    '550e8400-e29b-41d4-a716-446655440060'
),
(
    '550e8400-e29b-41d4-a716-446655440081',
    '550e8400-e29b-41d4-a716-446655440000',
    'INV-2024-002',
    'Alex Johnson',
    'alex.johnson@email.com',
    '2024-03-10',
    '2024-04-10',
    100000.00,
    8000.00,
    108000.00,
    'pending',
    '550e8400-e29b-41d4-a716-446655440061'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo installments
INSERT INTO installments (
    id,
    booking_id,
    installment_number,
    amount,
    due_date,
    paid_date,
    status,
    payment_method,
    transaction_id
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440085',
    '550e8400-e29b-41d4-a716-446655440060',
    1,
    150000.00,
    '2024-02-15',
    '2024-02-15',
    'paid',
    'Bank Transfer',
    'TXN-2024-001'
),
(
    '550e8400-e29b-41d4-a716-446655440086',
    '550e8400-e29b-41d4-a716-446655440060',
    2,
    200000.00,
    '2024-08-15',
    NULL,
    'pending',
    NULL,
    NULL
),
(
    '550e8400-e29b-41d4-a716-446655440087',
    '550e8400-e29b-41d4-a716-446655440061',
    1,
    100000.00,
    '2024-03-10',
    '2024-03-10',
    'paid',
    'Check',
    'CHK-2024-001'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo commissions
INSERT INTO commissions (
    id,
    organization_id,
    user_id,
    booking_id,
    commission_type,
    base_amount,
    commission_rate,
    commission_amount,
    status,
    paid_date,
    payment_reference
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440090',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440060',
    'Sales Commission',
    750000.00,
    2.5,
    18750.00,
    'paid',
    '2024-03-01',
    'PAY-2024-COM-001'
),
(
    '550e8400-e29b-41d4-a716-446655440091',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440061',
    'Sales Commission',
    550000.00,
    2.0,
    11000.00,
    'pending',
    NULL,
    NULL
) ON CONFLICT (id) DO NOTHING;

-- Insert demo marketing campaigns
INSERT INTO marketing_campaigns (
    id,
    organization_id,
    project_id,
    name,
    description,
    campaign_type,
    status,
    start_date,
    end_date,
    budget,
    actual_spend,
    target_audience,
    channels,
    metrics,
    created_by
) VALUES (
    '550e8400-e29b-41d4-a716-446655440100',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440010',
    'Sunset Heights Launch Campaign',
    'Grand launch campaign for Sunset Heights Residency',
    'Product Launch',
    'active',
    '2024-01-01',
    '2024-06-30',
    250000.00,
    180000.00,
    '{"age_range": "28-45", "income_level": "Upper Middle Class", "location": "Metro City & Suburbs"}',
    '["Digital Marketing", "Print Media", "Radio", "Events"]',
    '{"leads_generated": 1250, "conversions": 48, "cost_per_lead": 144.00, "roi": 3.2}',
    '550e8400-e29b-41d4-a716-446655440001'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo notifications
INSERT INTO notifications (
    id,
    organization_id,
    user_id,
    title,
    message,
    type,
    priority,
    action_url
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440110',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'New Expense Approval Required',
    'Construction crew wages expense of $45,000 requires your approval',
    'expense_approval',
    'high',
    '/expenses/pending'
),
(
    '550e8400-e29b-41d4-a716-446655440111',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    'New Lead Assigned',
    'New potential buyer interested in 2BHK units at Sunset Heights',
    'lead_assignment',
    'medium',
    '/sales/leads'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo activity logs
INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    resource_type,
    resource_id,
    details
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'CREATE',
    'expense',
    '550e8400-e29b-41d4-a716-446655440030',
    '{"amount": 85000.00, "category": "Materials", "project": "Sunset Heights Residency"}'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440003',
    'APPROVE',
    'expense',
    '550e8400-e29b-41d4-a716-446655440030',
    '{"approved_amount": 85000.00, "approval_notes": "Approved for foundation work"}'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    'CREATE',
    'booking',
    '550e8400-e29b-41d4-a716-446655440060',
    '{"customer": "David & Emily Rodriguez", "unit": "A-301", "amount": 750000.00}'
);

-- Create indexes for demo data performance
CREATE INDEX IF NOT EXISTS idx_demo_expenses_project_date ON expenses(project_id, date) WHERE organization_id = '550e8400-e29b-41d4-a716-446655440000';
CREATE INDEX IF NOT EXISTS idx_demo_bookings_project_status ON bookings(project_id, status) WHERE organization_id = '550e8400-e29b-41d4-a716-446655440000';
CREATE INDEX IF NOT EXISTS idx_demo_materials_category ON materials(category) WHERE organization_id = '550e8400-e29b-41d4-a716-446655440000';

-- Update demo statistics (for dashboard display)
-- These could be materialized views in a real application
-- For demo purposes, we'll create a simple view

CREATE OR REPLACE VIEW demo_dashboard_stats AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    (SELECT COUNT(*) FROM projects WHERE organization_id = o.id) as total_projects,
    (SELECT COUNT(*) FROM projects WHERE organization_id = o.id AND status = 'active') as active_projects,
    (SELECT COALESCE(SUM(budget), 0) FROM projects WHERE organization_id = o.id) as total_budget,
    (SELECT COALESCE(SUM(actual_cost), 0) FROM projects WHERE organization_id = o.id) as total_spent,
    (SELECT COUNT(*) FROM bookings WHERE organization_id = o.id AND status = 'confirmed') as confirmed_bookings,
    (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE organization_id = o.id AND status = 'confirmed') as total_sales,
    (SELECT COUNT(*) FROM expenses WHERE organization_id = o.id AND status = 'pending') as pending_expenses,
    (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE organization_id = o.id AND status = 'pending') as pending_expense_amount
FROM organizations o
WHERE o.id = '550e8400-e29b-41d4-a716-446655440000';

-- Grant permissions for demo data
GRANT SELECT ON demo_dashboard_stats TO authenticated;

-- Add comments for demo data
COMMENT ON TABLE demo_dashboard_stats IS 'Demo dashboard statistics view for quick overview metrics';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Demo data successfully populated for JV-Flow!';
    RAISE NOTICE 'Organization: Prime Real Estate Ventures';
    RAISE NOTICE 'Demo users: john.manager@primerealestate.com, sarah.sales@primerealestate.com, mike.finance@primerealestate.com';
    RAISE NOTICE 'Projects: 2 demo projects with sample data';
    RAISE NOTICE 'Run SELECT * FROM demo_dashboard_stats; to see overview statistics';
END $$;