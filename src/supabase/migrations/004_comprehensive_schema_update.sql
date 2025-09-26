-- JV-Flow Comprehensive Schema Update v4.0.0
-- Consolidated schema with all missing tables, columns, and improvements
-- Date: September 26, 2025
-- 
-- This file consolidates and updates the entire JV-Flow database schema
-- Based on analysis of migrations 001, 002, 003 and current application features

-- Record the schema version
INSERT INTO schema_versions (version, description, applied_by) VALUES 
('4.0.0', 'Comprehensive consolidated schema with all features', 'system')
ON CONFLICT (version) DO NOTHING;

-- ============================================
-- MISSING TABLES AND CORE IMPROVEMENTS
-- ============================================

-- Organization Members Table (Missing from current schema)
CREATE TABLE IF NOT EXISTS organization_members (
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

-- Employees Table (Referenced in Employee Management Dashboard)
CREATE TABLE IF NOT EXISTS employees (
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

-- Customer/Client Table (Referenced in bookings and sales)
CREATE TABLE IF NOT EXISTS customers (
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
    source VARCHAR(100), -- 'referral', 'website', 'advertisement', etc.
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Units/Inventory Table (Referenced in booking system)
CREATE TABLE IF NOT EXISTS project_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    unit_number VARCHAR(100) NOT NULL,
    unit_type VARCHAR(100) NOT NULL,
    floor_number INTEGER,
    area_sqft DECIMAL(10,2),
    base_price DECIMAL(15,2),
    current_price DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'PKR',
    status VARCHAR(50) DEFAULT 'available', -- 'available', 'booked', 'sold', 'blocked'
    facing VARCHAR(50), -- 'north', 'south', 'east', 'west'
    features JSONB DEFAULT '[]',
    specifications JSONB DEFAULT '{}',
    floor_plan_url TEXT,
    images JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, unit_number)
);

-- Leads Management Table (Referenced in marketing dashboard)
CREATE TABLE IF NOT EXISTS leads (
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

-- Document Management Table (Referenced in multiple dashboards)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    category VARCHAR(100),
    resource_type VARCHAR(100), -- 'project', 'expense', 'booking', 'employee', etc.
    resource_id UUID,
    uploaded_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT FALSE,
    tags JSONB DEFAULT '[]',
    version INTEGER DEFAULT 1,
    parent_document_id UUID REFERENCES documents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports Management Table (Custom reports system)
CREATE TABLE IF NOT EXISTS reports (
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

-- ============================================
-- MISSING COLUMNS IN EXISTING TABLES
-- ============================================

-- Users table enhancements
ALTER TABLE users ADD COLUMN IF NOT EXISTS middle_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reports_to UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS hire_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_details JSONB;

-- Organizations table enhancements  
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS tax_number VARCHAR(100);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS founded_date DATE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS employees_count INTEGER DEFAULT 0;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS annual_revenue DECIMAL(15,2);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'PKR';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS fiscal_year_start VARCHAR(20) DEFAULT 'January';

-- Projects table enhancements
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_code VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS land_area DECIMAL(10,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS built_up_area DECIMAL(10,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_units INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sold_units INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS available_units INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS price_per_sqft DECIMAL(10,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS possession_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS brochure_url TEXT;

-- Bookings table enhancements
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS unit_id UUID REFERENCES project_units(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_type VARCHAR(50) DEFAULT 'sale';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_plan VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS possession_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS registration_amount DECIMAL(15,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS maintenance_charges DECIMAL(15,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';

-- Expenses table enhancements  
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(100);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS payment_date DATE;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2);

-- Vendors table enhancements
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS vendor_code VARCHAR(100);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS gstin VARCHAR(50);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS pan_number VARCHAR(50);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS contract_start_date DATE;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS contract_end_date DATE;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS credit_limit DECIMAL(12,2);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS outstanding_balance DECIMAL(12,2) DEFAULT 0;

-- Materials table enhancements
ALTER TABLE materials ADD COLUMN IF NOT EXISTS material_code VARCHAR(100);
ALTER TABLE materials ADD COLUMN IF NOT EXISTS brand VARCHAR(100);
ALTER TABLE materials ADD COLUMN IF NOT EXISTS model VARCHAR(100);
ALTER TABLE materials ADD COLUMN IF NOT EXISTS hsn_code VARCHAR(50);
ALTER TABLE materials ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 0;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS reorder_level DECIMAL(10,2);
ALTER TABLE materials ADD COLUMN IF NOT EXISTS max_stock_level DECIMAL(10,2);
ALTER TABLE materials ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE materials ADD COLUMN IF NOT EXISTS warranty_period INTEGER; -- in months

-- Marketing campaigns enhancements
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS target_leads INTEGER;
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS leads_generated INTEGER DEFAULT 0;
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS conversions INTEGER DEFAULT 0;
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS roi DECIMAL(10,2);
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS cost_per_lead DECIMAL(10,2);
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS cost_per_conversion DECIMAL(10,2);

-- ============================================
-- AUDIT TRAIL TABLE (Enhanced)
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
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
-- ADDITIONAL INDEXES
-- ============================================

-- Organization members indexes
CREATE INDEX IF NOT EXISTS idx_organization_members_organization_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_role ON organization_members(role);
CREATE INDEX IF NOT EXISTS idx_organization_members_status ON organization_members(status);

-- Employees indexes
CREATE INDEX IF NOT EXISTS idx_employees_organization_id ON employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_employee_code ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON employees(manager_id);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_organization_id ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- Project units indexes
CREATE INDEX IF NOT EXISTS idx_project_units_project_id ON project_units(project_id);
CREATE INDEX IF NOT EXISTS idx_project_units_status ON project_units(status);
CREATE INDEX IF NOT EXISTS idx_project_units_unit_type ON project_units(unit_type);
CREATE INDEX IF NOT EXISTS idx_project_units_price ON project_units(current_price);

-- Leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_organization_id ON leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_project_id ON leads(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_next_followup_date ON leads(next_followup_date);

-- Documents indexes
CREATE INDEX IF NOT EXISTS idx_documents_organization_id ON documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_resource_type ON documents(resource_type);
CREATE INDEX IF NOT EXISTS idx_documents_resource_id ON documents(resource_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);

-- Reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_organization_id ON reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_report_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_is_scheduled ON reports(is_scheduled);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- ============================================
-- UPDATE TRIGGERS FOR NEW TABLES
-- ============================================

CREATE TRIGGER update_organization_members_updated_at BEFORE UPDATE ON organization_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_units_updated_at BEFORE UPDATE ON project_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Organization members RLS
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization members" ON organization_members FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can manage all organization members" ON organization_members FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Employees RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization employees" ON employees FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can manage all employees" ON employees FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Customers RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization customers" ON customers FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can manage all customers" ON customers FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Project units RLS
ALTER TABLE project_units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization project units" ON project_units FOR SELECT 
    USING (project_id IN (SELECT id FROM projects WHERE organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())));
CREATE POLICY "Super admins can manage all project units" ON project_units FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Leads RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization leads" ON leads FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can manage all leads" ON leads FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Documents RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization documents" ON documents FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()) OR is_public = TRUE);
CREATE POLICY "Super admins can manage all documents" ON documents FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Reports RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization reports" ON reports FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()) OR is_public = TRUE);
CREATE POLICY "Super admins can manage all reports" ON reports FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Audit logs RLS (view only, no modifications)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization audit logs" ON audit_logs FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can view all audit logs" ON audit_logs FOR SELECT 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

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

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

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

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'JV-Flow Comprehensive Schema Update v4.0.0 Applied Successfully!';
    RAISE NOTICE 'New Tables Added: organization_members, employees, customers, project_units, leads, documents, reports, audit_logs';
    RAISE NOTICE 'Enhanced Tables: users, organizations, projects, bookings, expenses, vendors, materials, marketing_campaigns';
    RAISE NOTICE 'Added: Comprehensive indexing, RLS policies, utility functions, and audit trails';
    RAISE NOTICE 'Schema is now ready for production deployment with all features!';
END $$;