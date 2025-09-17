-- JV-Flow Schema Version 2.0.0 Upgrade
-- Super Admin and Enhanced Multi-tenancy Features
-- Applied: September 17, 2025

-- Schema versioning system
CREATE TABLE IF NOT EXISTS schema_versions (
    version VARCHAR(20) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(255)
);

-- Record schema versions
INSERT INTO schema_versions (version, description, applied_by) VALUES 
('1.0.0', 'Initial Schema - Basic Real Estate Management', 'system'),
('2.0.0', 'Super Admin and Enhanced Multi-tenancy', 'system')
ON CONFLICT (version) DO NOTHING;

-- Super Admin and User Type Enhancement
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'tenant_user';
-- Values: 'super_admin', 'tenant_admin', 'tenant_user', 'demo_user'

COMMENT ON COLUMN users.user_type IS 'User classification: super_admin (platform admin), tenant_admin (org admin), tenant_user (org member), demo_user (trial user)';

-- Update existing users to have proper user types
UPDATE users SET user_type = 'demo_user' WHERE email = 'demo@jvflow.com';

-- Platform-level settings table
CREATE TABLE IF NOT EXISTS platform_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB,
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    updated_by UUID REFERENCES users(id),
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
('email_verification_required', 'true', 'Require email verification for new users', 'auth')
ON CONFLICT (key) DO NOTHING;

-- Enhanced Organization Management
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS restrictions JSONB DEFAULT '{}';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 50;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS max_projects INTEGER DEFAULT 10;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS suspended_reason TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES users(id);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- User invitation system
CREATE TABLE IF NOT EXISTS user_invitations (
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

COMMENT ON TABLE user_invitations IS 'User invitation system for organizations';

-- Enhanced session management
CREATE TABLE IF NOT EXISTS user_sessions (
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

COMMENT ON TABLE user_sessions IS 'User session tracking and management';

-- Detailed subscription tracking
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL,
    plan_type VARCHAR(50) DEFAULT 'subscription', -- 'trial', 'subscription', 'enterprise'
    status VARCHAR(50) DEFAULT 'active',
    current_period_start DATE,
    current_period_end DATE,
    trial_start_date DATE,
    trial_end_date DATE,
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly'
    amount DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    discount_percent DECIMAL(5,2) DEFAULT 0,
    payment_method JSONB,
    features JSONB DEFAULT '{}',
    limits JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE subscriptions IS 'Subscription and billing management';

-- Payment history tracking
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    payment_intent_id VARCHAR(255), -- Stripe/PayPal payment intent ID
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed', 'refunded'
    payment_date DATE,
    payment_method VARCHAR(100),
    provider VARCHAR(50), -- 'stripe', 'paypal', 'manual'
    transaction_id VARCHAR(255),
    failure_reason TEXT,
    invoice_url TEXT,
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refunded_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE payments IS 'Payment history and transaction tracking';

-- Enhanced user profiles
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP WITH TIME ZONE;

-- Platform usage analytics
CREATE TABLE IF NOT EXISTS platform_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    dimensions JSONB DEFAULT '{}',
    recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE platform_analytics IS 'Platform usage metrics and analytics';

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_user_invitations_organization_id ON user_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_invitations_email ON user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_user_invitations_status ON user_invitations(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_organization_id ON payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_metric_name ON platform_analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_recorded_at ON platform_analytics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_is_email_verified ON users(is_email_verified);

-- Updated triggers for new tables
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON platform_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enhanced RLS policies for super admin
-- Super admins can access all data across organizations
CREATE POLICY "Super admins can view all organizations" ON organizations FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

CREATE POLICY "Super admins can manage all users" ON users FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Platform settings access (super admin only)
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only super admins can manage platform settings" ON platform_settings FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- User invitations policies
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization invitations" ON user_invitations FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()) 
           OR invited_by = auth.uid());

-- User sessions policies  
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own sessions" ON user_sessions FOR SELECT 
    USING (user_id = auth.uid());
CREATE POLICY "Super admins can view all sessions" ON user_sessions FOR SELECT 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Subscription policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization subscriptions" ON subscriptions FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can manage all subscriptions" ON subscriptions FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Payment policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organization payments" ON payments FOR SELECT 
    USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Super admins can view all payments" ON payments FOR SELECT 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

-- Analytics policies (super admin only)
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins can access analytics" ON platform_analytics FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'super_admin'));

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
        NULL, -- Super admins don't belong to any organization
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

-- Comments for new schema elements
COMMENT ON COLUMN users.user_type IS 'User classification: super_admin, tenant_admin, tenant_user, demo_user';
COMMENT ON COLUMN organizations.restrictions IS 'JSON object containing organization-specific restrictions and limits';
COMMENT ON COLUMN organizations.is_suspended IS 'Flag indicating if organization is suspended by super admin';
COMMENT ON FUNCTION create_super_admin IS 'Creates a new super admin user with platform-wide access';
COMMENT ON FUNCTION get_platform_stats IS 'Returns comprehensive platform statistics for super admin dashboard';

-- Create default super admin (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_type = 'super_admin') THEN
        PERFORM create_super_admin('superadmin@jvflow.com', 'Super', 'Admin');
        RAISE NOTICE 'Default super admin created with email: superadmin@jvflow.com';
    END IF;
END $$;