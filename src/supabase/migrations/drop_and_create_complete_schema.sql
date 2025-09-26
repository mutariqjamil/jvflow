-- JV-Flow Complete Database Schema DROP and CREATE Script
-- This script drops all existing objects and recreates the complete schema
-- Use with EXTREME CAUTION - This will delete all data!
-- Date: September 26, 2025

-- ============================================
-- WARNING: DATA DESTRUCTION
-- ============================================
-- This script will destroy all existing data!
-- Make sure you have a backup before running this script!

-- ============================================
-- DROP ALL EXISTING OBJECTS
-- ============================================

-- Drop all views first
DROP VIEW IF EXISTS demo_dashboard_stats CASCADE;

-- Drop all functions and triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS create_default_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS create_super_admin(VARCHAR, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_platform_stats() CASCADE;
DROP FUNCTION IF EXISTS update_project_statistics(UUID) CASCADE;
DROP FUNCTION IF EXISTS calculate_conversion_rate(UUID, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS get_organization_dashboard_stats(UUID) CASCADE;

-- Drop all tables in dependency order (children first, parents last)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS platform_analytics CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_invitations CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS project_units CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS marketing_campaigns CASCADE;
DROP TABLE IF EXISTS commissions CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS installments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;
DROP TABLE IF EXISTS schema_versions CASCADE;

-- Drop extensions (optional - comment out if you want to keep them)
-- DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
-- DROP EXTENSION IF EXISTS "pg_stat_statements" CASCADE;

-- ============================================
-- CREATE COMPLETE SCHEMA FROM SCRATCH
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Schema versioning system
CREATE TABLE schema_versions (
    version VARCHAR(20) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(255)
);

-- Insert schema version records
INSERT INTO schema_versions (version, description, applied_by) VALUES 
('1.0.0', 'Initial Schema - Basic Real Estate Management', 'system'),
('2.0.0', 'Super Admin and Enhanced Multi-tenancy', 'system'),
('4.0.0', 'Comprehensive consolidated schema with all features', 'system');

-- Platform-level settings table
CREATE TABLE platform_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB,
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    updated_by UUID, -- Will reference users(id) after users table is created
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default platform settings
INSERT INTO platform_settings (key, value, description, category) VALUES 
('platform_name', '"JV-Flow"', 'Platform display name', 'branding'),
('max_organizations_per_user', '5', 'Maximum organizations a user can belong to', 'limits'),
('default_trial_days', '31', 'Default trial period in days', 'billing'),
('maintenance_mode', 'false', 'Enable/disable maintenance mode', 'system'),
('registration_enabled', 'true', 'Allow new user registrations', 'system'),
('social_login_enabled', 'true', 'Enable social login providers', 'auth'),
('email_verification_required', 'true', 'Require email verification for new users', 'auth');

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100) DEFAULT 'Real Estate',
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#030213',
    secondary_color VARCHAR(7) DEFAULT '#e9ebef',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'active',
    billing_email VARCHAR(255),
    phone VARCHAR(20),
    address JSONB,
    settings JSONB DEFAULT '{}',
    website VARCHAR(255),
    registration_number VARCHAR(100),
    tax_number VARCHAR(100),
    founded_date DATE,
    employees_count INTEGER DEFAULT 0,
    annual_revenue DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'PKR',
    fiscal_year_start VARCHAR(20) DEFAULT 'January',
    restrictions JSONB DEFAULT '{}',
    max_users INTEGER DEFAULT 50,
    max_projects INTEGER DEFAULT 10,
    is_suspended BOOLEAN DEFAULT FALSE,
    suspended_reason TEXT,
    suspended_by UUID, -- Will reference users(id) after users table is created
    suspended_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    display_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '[]',
    last_login TIMESTAMP WITH TIME ZONE,
    user_type VARCHAR(50) DEFAULT 'tenant_user',
    profile JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_password_change TIMESTAMP WITH TIME ZONE,
    employee_id UUID, -- Will reference employees(id) after employees table is created
    department VARCHAR(100),
    reports_to UUID REFERENCES users(id),
    hire_date DATE,
    emergency_contact JSONB,
    bank_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Now add foreign key references that couldn't be created earlier
ALTER TABLE platform_settings ADD CONSTRAINT fk_platform_settings_updated_by FOREIGN KEY (updated_by) REFERENCES users(id);
ALTER TABLE organizations ADD CONSTRAINT fk_organizations_suspended_by FOREIGN KEY (suspended_by) REFERENCES users(id);

-- Organization Members table
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    permissions JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'active',
    invited_by UUID REFERENCES users(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, user_id)
);

-- Employees table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    position VARCHAR(100),
    department VARCHAR(100),
    hire_date DATE,
    termination_date DATE,
    salary DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'PKR',
    status VARCHAR(50) DEFAULT 'active',
    address JSONB,
    emergency_contact JSONB,
    documents JSONB DEFAULT '[]',
    manager_id UUID REFERENCES employees(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add employee_id foreign key constraint to users table
ALTER TABLE users ADD CONSTRAINT fk_users_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_code VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    address JSONB,
    preferences JSONB DEFAULT '{}',
    source VARCHAR(100),
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(100) DEFAULT 'Residential',
    status VARCHAR(50) DEFAULT 'planning',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2) DEFAULT 0,
    location JSONB,
    project_manager_id UUID REFERENCES users(id),
    settings JSONB DEFAULT '{}',
    project_code VARCHAR(100),
    land_area DECIMAL(10,2),
    built_up_area DECIMAL(10,2),
    total_units INTEGER,
    sold_units INTEGER DEFAULT 0,
    available_units INTEGER,
    price_per_sqft DECIMAL(10,2),
    amenities JSONB DEFAULT '[]',
    approval_status VARCHAR(50) DEFAULT 'pending',
    possession_date DATE,
    images JSONB DEFAULT '[]',
    brochure_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Units table
CREATE TABLE project_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    unit_number VARCHAR(100) NOT NULL,
    unit_type VARCHAR(100) NOT NULL,
    floor_number INTEGER,
    area_sqft DECIMAL(10,2),
    base_price DECIMAL(15,2),
    current_price DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'PKR',
    status VARCHAR(50) DEFAULT 'available',
    facing VARCHAR(50),
    features JSONB DEFAULT '[]',
    specifications JSONB DEFAULT '{}',
    floor_plan_url TEXT,
    images JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, unit_number)
);

-- Project Milestones table
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    due_date DATE,
    completion_date DATE,
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2) DEFAULT 0,
    materials_required JSONB DEFAULT '[]',
    dependencies JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address JSONB,
    vendor_type VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    payment_terms VARCHAR(100),
    tax_id VARCHAR(50),
    bank_details JSONB,
    vendor_code VARCHAR(100),
    website VARCHAR(255),
    registration_number VARCHAR(100),
    gstin VARCHAR(50),
    pan_number VARCHAR(50),
    contract_start_date DATE,
    contract_end_date DATE,
    credit_limit DECIMAL(12,2),
    outstanding_balance DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Materials table
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit VARCHAR(50),
    unit_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'PKR',
    supplier_id UUID REFERENCES vendors(id),
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    minimum_stock DECIMAL(10,2) DEFAULT 0,
    specifications JSONB DEFAULT '{}',
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    material_code VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    hsn_code VARCHAR(50),
    tax_rate DECIMAL(5,2) DEFAULT 0,
    reorder_level DECIMAL(10,2),
    max_stock_level DECIMAL(10,2),
    location VARCHAR(255),
    warranty_period INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PKR',
    date DATE NOT NULL,
    receipt_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    submitted_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    vendor_id UUID REFERENCES vendors(id),
    invoice_number VARCHAR(100),
    due_date DATE,
    payment_date DATE,
    payment_method VARCHAR(100),
    payment_reference VARCHAR(255),
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders table
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    po_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    order_date DATE NOT NULL,
    expected_delivery DATE,
    actual_delivery DATE,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PKR',
    terms JSONB DEFAULT '{}',
    notes TEXT,
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Order Items table
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    description VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    received_quantity DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    unit_number VARCHAR(100),
    unit_type VARCHAR(100),
    booking_amount DECIMAL(15,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    booking_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'booked',
    sales_person_id UUID REFERENCES users(id),
    commission_rate DECIMAL(5,2) DEFAULT 0,
    commission_amount DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    customer_id UUID REFERENCES customers(id),
    unit_id UUID REFERENCES project_units(id),
    booking_type VARCHAR(50) DEFAULT 'sale',
    payment_plan VARCHAR(100),
    possession_date DATE,
    registration_amount DECIMAL(15,2) DEFAULT 0,
    maintenance_charges DECIMAL(15,2) DEFAULT 0,
    cancellation_date DATE,
    cancellation_reason TEXT,
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Installments table
CREATE TABLE installments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    transaction_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    booking_id UUID REFERENCES bookings(id),
    installment_id UUID REFERENCES installments(id),
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Commissions table
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    commission_type VARCHAR(100) NOT NULL,
    base_amount DECIMAL(15,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    paid_date DATE,
    payment_reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Marketing Campaigns table
CREATE TABLE marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    actual_spend DECIMAL(15,2) DEFAULT 0,
    target_audience JSONB DEFAULT '{}',
    channels JSONB DEFAULT '[]',
    metrics JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    target_leads INTEGER,
    leads_generated INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    roi DECIMAL(10,2),
    cost_per_lead DECIMAL(10,2),
    cost_per_conversion DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    budget_range_min DECIMAL(15,2),
    budget_range_max DECIMAL(15,2),
    preferred_unit_type VARCHAR(100),
    notes TEXT,
    assigned_to UUID REFERENCES users(id),
    last_contact_date DATE,
    next_followup_date DATE,
    conversion_date DATE,
    customer_id UUID REFERENCES customers(id),
    campaign_id UUID REFERENCES marketing_campaigns(id),
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    category VARCHAR(100),
    resource_type VARCHAR(100),
    resource_id UUID,
    uploaded_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT FALSE,
    tags JSONB DEFAULT '[]',
    version INTEGER DEFAULT 1,
    parent_document_id UUID REFERENCES documents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(100) NOT NULL,
    query_config JSONB NOT NULL,
    filters JSONB DEFAULT '{}',
    schedule_config JSONB,
    is_scheduled BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    last_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(100) DEFAULT 'info',
    priority VARCHAR(50) DEFAULT 'medium',
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Invitations table
CREATE TABLE user_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    permissions JSONB DEFAULT '[]',
    invited_by UUID REFERENCES users(id),
    invitation_token VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    accepted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL,
    plan_type VARCHAR(50) DEFAULT 'subscription',
    status VARCHAR(50) DEFAULT 'active',
    current_period_start DATE,
    current_period_end DATE,
    trial_start_date DATE,
    trial_end_date DATE,
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    amount DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'PKR',
    discount_percent DECIMAL(5,2) DEFAULT 0,
    payment_method JSONB,
    features JSONB DEFAULT '{}',
    limits JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    payment_intent_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PKR',
    status VARCHAR(50) DEFAULT 'pending',
    payment_date DATE,
    payment_method VARCHAR(100),
    provider VARCHAR(50),
    transaction_id VARCHAR(255),
    failure_reason TEXT,
    invoice_url TEXT,
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refunded_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Platform Analytics table
CREATE TABLE platform_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    dimensions JSONB DEFAULT '{}',
    recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs table (Enhanced)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COMPUTED COLUMNS AND GENERATED FIELDS
-- ============================================

-- Update total_amount in expenses based on amount + tax - discount
UPDATE expenses SET total_amount = COALESCE(amount, 0) + COALESCE(tax_amount, 0) - COALESCE(discount_amount, 0) 
WHERE total_amount IS NULL;

-- Update available_units in projects
UPDATE projects SET available_units = GREATEST(0, COALESCE(total_units, 0) - COALESCE(sold_units, 0))
WHERE available_units IS NULL;

-- ============================================
-- CREATE ALL INDEXES
-- ============================================

-- Basic indexes from original schema
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_expenses_organization_id ON expenses(organization_id);
CREATE INDEX idx_expenses_project_id ON expenses(project_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_vendors_organization_id ON vendors(organization_id);
CREATE INDEX idx_materials_organization_id ON materials(organization_id);
CREATE INDEX idx_purchase_orders_organization_id ON purchase_orders(organization_id);
CREATE INDEX idx_purchase_orders_vendor_id ON purchase_orders(vendor_id);
CREATE INDEX idx_bookings_organization_id ON bookings(organization_id);
CREATE INDEX idx_bookings_project_id ON bookings(project_id);
CREATE INDEX idx_installments_booking_id ON installments(booking_id);
CREATE INDEX idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX idx_commissions_organization_id ON commissions(organization_id);
CREATE INDEX idx_commissions_user_id ON commissions(user_id);
CREATE INDEX idx_activity_logs_organization_id ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

-- Additional indexes from v3 schema
CREATE INDEX idx_user_invitations_organization_id ON user_invitations(organization_id);
CREATE INDEX idx_user_invitations_email ON user_invitations(email);
CREATE INDEX idx_user_invitations_status ON user_invitations(status);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_organization_id ON payments(organization_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_platform_analytics_metric_name ON platform_analytics(metric_name);
CREATE INDEX idx_platform_analytics_recorded_at ON platform_analytics(recorded_at);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_is_email_verified ON users(is_email_verified);

-- New indexes from v4 schema
CREATE INDEX idx_organization_members_organization_id ON organization_members(organization_id);
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_organization_members_role ON organization_members(role);
CREATE INDEX idx_organization_members_status ON organization_members(status);
CREATE INDEX idx_employees_organization_id ON employees(organization_id);
CREATE INDEX idx_employees_employee_code ON employees(employee_code);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_manager_id ON employees(manager_id);
CREATE INDEX idx_customers_organization_id ON customers(organization_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_project_units_project_id ON project_units(project_id);
CREATE INDEX idx_project_units_status ON project_units(status);
CREATE INDEX idx_project_units_unit_type ON project_units(unit_type);
CREATE INDEX idx_project_units_price ON project_units(current_price);
CREATE INDEX idx_leads_organization_id ON leads(organization_id);
CREATE INDEX idx_leads_project_id ON leads(project_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_next_followup_date ON leads(next_followup_date);
CREATE INDEX idx_documents_organization_id ON documents(organization_id);
CREATE INDEX idx_documents_resource_type ON documents(resource_type);
CREATE INDEX idx_documents_resource_id ON documents(resource_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_reports_organization_id ON reports(organization_id);
CREATE INDEX idx_reports_report_type ON reports(report_type);
CREATE INDEX idx_reports_created_by ON reports(created_by);
CREATE INDEX idx_reports_is_scheduled ON reports(is_scheduled);
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================
-- CREATE FUNCTIONS AND TRIGGERS
-- ============================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables that have updated_at column
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_installments_updated_at BEFORE UPDATE ON installments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON platform_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_members_updated_at BEFORE UPDATE ON organization_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_units_updated_at BEFORE UPDATE ON project_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to update project statistics
CREATE OR REPLACE FUNCTION update_project_statistics(project_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE projects SET
        sold_units = (SELECT COUNT(*) FROM bookings WHERE project_id = $1 AND status IN ('confirmed', 'completed')),
        available_units = total_units - (SELECT COUNT(*) FROM bookings WHERE project_id = $1 AND status IN ('confirmed', 'completed')),
        actual_cost = (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE project_id = $1 AND status = 'approved')
    WHERE id = $1;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate lead conversion rate
CREATE OR REPLACE FUNCTION calculate_conversion_rate(org_id UUID, start_date DATE, end_date DATE)
RETURNS DECIMAL AS $$
DECLARE
    total_leads INTEGER;
    converted_leads INTEGER;
    conversion_rate DECIMAL;
BEGIN
    SELECT COUNT(*) INTO total_leads 
    FROM leads 
    WHERE organization_id = org_id 
    AND created_at::DATE BETWEEN start_date AND end_date;
    
    SELECT COUNT(*) INTO converted_leads 
    FROM leads 
    WHERE organization_id = org_id 
    AND conversion_date BETWEEN start_date AND end_date;
    
    IF total_leads > 0 THEN
        conversion_rate := (converted_leads::DECIMAL / total_leads::DECIMAL) * 100;
    ELSE
        conversion_rate := 0;
    END IF;
    
    RETURN conversion_rate;
END;
$$ LANGUAGE plpgsql;

-- Function to get organization dashboard stats (enhanced)
CREATE OR REPLACE FUNCTION get_organization_dashboard_stats(org_id UUID)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT json_build_object(
        'projects', json_build_object(
            'total', (SELECT COUNT(*) FROM projects WHERE organization_id = org_id),
            'active', (SELECT COUNT(*) FROM projects WHERE organization_id = org_id AND status = 'active'),
            'completed', (SELECT COUNT(*) FROM projects WHERE organization_id = org_id AND status = 'completed')
        ),
        'financials', json_build_object(
            'total_budget', (SELECT COALESCE(SUM(budget), 0) FROM projects WHERE organization_id = org_id),
            'total_spent', (SELECT COALESCE(SUM(actual_cost), 0) FROM projects WHERE organization_id = org_id),
            'pending_expenses', (SELECT COALESCE(SUM(total_amount), 0) FROM expenses WHERE organization_id = org_id AND status = 'pending')
        ),
        'sales', json_build_object(
            'total_bookings', (SELECT COUNT(*) FROM bookings WHERE organization_id = org_id),
            'confirmed_bookings', (SELECT COUNT(*) FROM bookings WHERE organization_id = org_id AND status = 'confirmed'),
            'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE organization_id = org_id AND status = 'confirmed')
        ),
        'inventory', json_build_object(
            'total_units', (SELECT COALESCE(SUM(total_units), 0) FROM projects WHERE organization_id = org_id),
            'sold_units', (SELECT COALESCE(SUM(sold_units), 0) FROM projects WHERE organization_id = org_id),
            'available_units', (SELECT COALESCE(SUM(available_units), 0) FROM projects WHERE organization_id = org_id)
        ),
        'leads', json_build_object(
            'total', (SELECT COUNT(*) FROM leads WHERE organization_id = org_id),
            'new', (SELECT COUNT(*) FROM leads WHERE organization_id = org_id AND status = 'new'),
            'converted', (SELECT COUNT(*) FROM leads WHERE organization_id = org_id AND conversion_date IS NOT NULL)
        ),
        'team', json_build_object(
            'total_employees', (SELECT COUNT(*) FROM employees WHERE organization_id = org_id AND status = 'active'),
            'total_users', (SELECT COUNT(*) FROM users WHERE organization_id = org_id AND status = 'active')
        )
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- Function to create super admin user
CREATE OR REPLACE FUNCTION create_super_admin(
    p_email VARCHAR(255),
    p_first_name VARCHAR(100),
    p_last_name VARCHAR(100),
    p_password VARCHAR(255) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    super_admin_id UUID;
BEGIN
    INSERT INTO users (
        email,
        first_name,
        last_name,
        user_type,
        role,
        permissions,
        organization_id,
        is_email_verified
    ) VALUES (
        p_email,
        p_first_name,
        p_last_name,
        'super_admin',
        'super_admin',
        '["platform:*"]',
        NULL,
        TRUE
    ) RETURNING id INTO super_admin_id;
    
    -- Log the creation
    INSERT INTO activity_logs (
        organization_id,
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        NULL,
        super_admin_id,
        'super_admin_created',
        'user',
        super_admin_id,
        json_build_object(
            'email', p_email,
            'created_by', 'system'
        )
    );
    
    RETURN super_admin_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get platform statistics
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT json_build_object(
        'total_organizations', (SELECT COUNT(*) FROM organizations WHERE NOT is_suspended),
        'suspended_organizations', (SELECT COUNT(*) FROM organizations WHERE is_suspended),
        'total_users', (SELECT COUNT(*) FROM users WHERE user_type != 'super_admin'),
        'active_users', (SELECT COUNT(*) FROM users WHERE status = 'active' AND user_type != 'super_admin'),
        'total_projects', (SELECT COUNT(*) FROM projects),
        'active_projects', (SELECT COUNT(*) FROM projects WHERE status = 'active'),
        'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'succeeded'),
        'monthly_revenue', (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'succeeded' AND payment_date >= CURRENT_DATE - INTERVAL '30 days'),
        'trial_organizations', (SELECT COUNT(*) FROM subscriptions WHERE plan_type = 'trial'),
        'paid_organizations', (SELECT COUNT(*) FROM subscriptions WHERE plan_type = 'subscription' AND status = 'active')
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- Create default admin user function (for testing)
CREATE OR REPLACE FUNCTION create_default_admin(org_id UUID)
RETURNS UUID AS $$
DECLARE
    admin_id UUID;
BEGIN
    INSERT INTO users (
        email,
        first_name,
        last_name,
        role,
        organization_id,
        permissions
    ) VALUES (
        'admin@jvflow.com',
        'System',
        'Admin',
        'admin',
        org_id,
        '["all"]'
    ) RETURNING id INTO admin_id;
    
    RETURN admin_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only access data from their organization)
CREATE POLICY "Users can view their organization data" ON organizations FOR SELECT USING (id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization users" ON users FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization projects" ON projects FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization expenses" ON expenses FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization vendors" ON vendors FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization materials" ON materials FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization purchase orders" ON purchase_orders FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization bookings" ON bookings FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization invoices" ON invoices FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization commissions" ON commissions FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization campaigns" ON marketing_campaigns FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view organization activity logs" ON activity_logs FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (user_id = auth.uid());

-- Enhanced RLS policies for super admin
CREATE POLICY "Super admins can view all organizations" ON organizations FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));
CREATE POLICY "Super admins can manage all users" ON users FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Platform settings access (super admin only)
CREATE POLICY "Only super admins can manage platform settings" ON platform_settings FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- User invitations policies
CREATE POLICY "Users can view organization invitations" ON user_invitations FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()) 
           OR invited_by = auth.uid());

-- User sessions policies  
CREATE POLICY "Users can view their own sessions" ON user_sessions FOR SELECT 
    USING (user_id = auth.uid());
CREATE POLICY "Super admins can view all sessions" ON user_sessions FOR SELECT 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Subscription policies
CREATE POLICY "Users can view organization subscriptions" ON subscriptions FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can manage all subscriptions" ON subscriptions FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Payment policies
CREATE POLICY "Users can view organization payments" ON payments FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can view all payments" ON payments FOR SELECT 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Analytics policies (super admin only)
CREATE POLICY "Super admins can access analytics" ON platform_analytics FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Organization members RLS
CREATE POLICY "Users can view organization members" ON organization_members FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can manage all organization members" ON organization_members FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Employees RLS
CREATE POLICY "Users can view organization employees" ON employees FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can manage all employees" ON employees FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Customers RLS
CREATE POLICY "Users can view organization customers" ON customers FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can manage all customers" ON customers FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Project units RLS
CREATE POLICY "Users can view organization project units" ON project_units FOR SELECT 
    USING (project_id IN (SELECT id FROM projects WHERE organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())));
CREATE POLICY "Super admins can manage all project units" ON project_units FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Leads RLS
CREATE POLICY "Users can view organization leads" ON leads FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can manage all leads" ON leads FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Documents RLS
CREATE POLICY "Users can view organization documents" ON documents FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()) OR is_public = TRUE);
CREATE POLICY "Super admins can manage all documents" ON documents FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Reports RLS
CREATE POLICY "Users can view organization reports" ON reports FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()) OR is_public = TRUE);
CREATE POLICY "Super admins can manage all reports" ON reports FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Audit logs RLS (view only, no modifications)
CREATE POLICY "Users can view organization audit logs" ON audit_logs FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can view all audit logs" ON audit_logs FOR SELECT 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- ============================================
-- CREATE VIEWS
-- ============================================

-- Demo dashboard stats view
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
FROM organizations o;

-- Grant permissions
GRANT SELECT ON demo_dashboard_stats TO authenticated;

-- ============================================
-- CREATE DEFAULT SUPER ADMIN
-- ============================================

-- Create default super admin (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_type = 'super_admin') THEN
        PERFORM create_super_admin('superadmin@jvflow.com', 'Super', 'Admin');
        RAISE NOTICE 'Default super admin created with email: superadmin@jvflow.com';
    END IF;
END $$;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE organizations IS 'Real estate companies and organizations using the JV-Flow system';
COMMENT ON TABLE users IS 'Users within organizations with role-based access control';
COMMENT ON TABLE projects IS 'Real estate development projects managed by organizations';
COMMENT ON TABLE project_milestones IS 'Project milestones with material requirements and dependencies';
COMMENT ON TABLE expenses IS 'Project and organizational expenses with approval workflows';
COMMENT ON TABLE vendors IS 'Vendors and suppliers for materials and services';
COMMENT ON TABLE materials IS 'Construction materials and inventory management';
COMMENT ON TABLE purchase_orders IS 'Purchase orders for materials and services';
COMMENT ON TABLE bookings IS 'Property bookings and sales management';
COMMENT ON TABLE installments IS 'Payment installments for property bookings';
COMMENT ON TABLE invoices IS 'Auto-generated invoices for bookings and installments';
COMMENT ON TABLE commissions IS 'Sales commissions and calculations';
COMMENT ON TABLE marketing_campaigns IS 'Marketing campaigns for projects';
COMMENT ON TABLE activity_logs IS 'Audit trail for all system activities';
COMMENT ON TABLE notifications IS 'User notifications and alerts';
COMMENT ON TABLE organization_members IS 'Manages user membership in organizations with roles and permissions';
COMMENT ON TABLE employees IS 'Employee management with HR details and organizational structure';
COMMENT ON TABLE customers IS 'Customer/client management for sales and marketing';
COMMENT ON TABLE project_units IS 'Individual units/inventory within projects for booking management';
COMMENT ON TABLE leads IS 'Lead management and tracking system for sales pipeline';
COMMENT ON TABLE documents IS 'Centralized document management system for all resources';
COMMENT ON TABLE reports IS 'Custom report builder and scheduler';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all database changes';

COMMENT ON FUNCTION update_project_statistics IS 'Updates calculated fields in projects table based on bookings and expenses';
COMMENT ON FUNCTION calculate_conversion_rate IS 'Calculates lead conversion rate for a given period';
COMMENT ON FUNCTION get_organization_dashboard_stats IS 'Returns comprehensive dashboard statistics for organization';
COMMENT ON FUNCTION create_super_admin IS 'Creates a new super admin user with platform-wide access';
COMMENT ON FUNCTION get_platform_stats IS 'Returns comprehensive platform statistics for super admin dashboard';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'JV-Flow Complete Database Schema Created Successfully!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Schema Version: 4.0.0 - Complete Consolidated Schema';
    RAISE NOTICE 'Tables Created: 25 core tables + supporting tables';
    RAISE NOTICE 'Features: Complete RBAC, RLS, Audit trails, Multi-tenancy';
    RAISE NOTICE 'Default Super Admin: superadmin@jvflow.com';
    RAISE NOTICE 'Database is ready for production deployment!';
    RAISE NOTICE '============================================';
END $$;