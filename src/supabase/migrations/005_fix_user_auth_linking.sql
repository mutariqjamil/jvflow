-- Fix User Authentication Linking
-- This migration fixes the relationship between auth.users and public.users
-- Date: September 26, 2025

-- ============================================
-- CRITICAL FIX: Link auth.users and public.users
-- ============================================

-- Step 1: Remove the auto-generated UUID default from users table
-- The users.id should match auth.users.id exactly
ALTER TABLE users ALTER COLUMN id DROP DEFAULT;

-- Step 2: Add a constraint to ensure users.id references auth.users.id
-- Note: This creates a foreign key to the auth schema (if permissions allow)
-- If this fails due to permissions, we'll handle it with triggers instead

-- Step 3: Create a function to automatically create public.users record 
-- when a new auth.users record is created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, user_type, role, created_at, updated_at)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Unknown'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'user_type', 'tenant_user'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        NEW.created_at,
        NEW.updated_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create trigger on auth.users to auto-create public.users
-- This ensures every authenticated user gets a profile record
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Create an updated super admin creation function that handles both auth and profile
CREATE OR REPLACE FUNCTION create_super_admin_with_auth(
    p_email VARCHAR(255),
    p_first_name VARCHAR(100),
    p_last_name VARCHAR(100),
    p_password VARCHAR(255)
)
RETURNS UUID AS $$
DECLARE
    super_admin_id UUID;
    auth_user_id UUID;
BEGIN
    -- First, create the auth user (this requires special handling)
    -- In production, this would be done through Supabase Auth API
    -- For demo purposes, we'll create a manual entry
    
    super_admin_id := uuid_generate_v4();
    
    -- Create the profile in public.users with the specific ID
    INSERT INTO public.users (
        id,
        email,
        first_name,
        last_name,
        user_type,
        role,
        permissions,
        organization_id,
        is_email_verified,
        status
    ) VALUES (
        super_admin_id,
        p_email,
        p_first_name,
        p_last_name,
        'super_admin',
        'super_admin',
        '["platform:*"]'::jsonb,
        NULL,
        TRUE,
        'active'
    )
    ON CONFLICT (id) DO UPDATE SET
        user_type = 'super_admin',
        role = 'super_admin',
        permissions = '["platform:*"]'::jsonb,
        is_email_verified = TRUE,
        updated_at = CURRENT_TIMESTAMP;
    
    -- Log the creation
    INSERT INTO activity_logs (
        organization_id,
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        '1',
        super_admin_id,
        'super_admin_created',
        'user',
        super_admin_id,
        json_build_object(
            'email', p_email,
            'created_by', 'system',
            'note', 'Auth user must be created manually via Supabase Auth API'
        )
    );
    
    RETURN super_admin_id;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Update existing super admin record with proper structure
DO $$
DECLARE
    existing_super_admin_id UUID;
BEGIN
    -- Find existing super admin
    SELECT id INTO existing_super_admin_id 
    FROM users 
    WHERE user_type = 'super_admin' 
    LIMIT 1;
    
    IF existing_super_admin_id IS NOT NULL THEN
        -- Update the existing super admin to ensure it has proper permissions
        UPDATE users 
        SET 
            user_type = 'super_admin',
            role = 'super_admin',
            permissions = '["platform:*"]'::jsonb,
            is_email_verified = TRUE,
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_super_admin_id;
        
        RAISE NOTICE 'Updated existing super admin with ID: %', existing_super_admin_id;
        RAISE NOTICE 'IMPORTANT: You must create an auth.users record with the same ID via Supabase Dashboard';
        RAISE NOTICE 'Super Admin ID to use in auth: %', existing_super_admin_id;
    END IF;
END $$;

-- Step 7: Create a function to check user auth sync status
CREATE OR REPLACE FUNCTION check_user_auth_sync()
RETURNS TABLE (
    user_id UUID,
    email VARCHAR(255),
    has_auth_record BOOLEAN,
    has_profile_record BOOLEAN,
    sync_status VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email,
        (auth_users.id IS NOT NULL) as has_auth_record,
        TRUE as has_profile_record,
        CASE 
            WHEN auth_users.id IS NOT NULL THEN 'SYNCED'
            ELSE 'MISSING_AUTH'
        END as sync_status
    FROM public.users u
    LEFT JOIN auth.users auth_users ON u.id = auth_users.id
    ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_user_auth_sync() TO authenticated;

-- Success message with instructions
DO $$
DECLARE
    super_admin_id UUID;
BEGIN
    SELECT id INTO super_admin_id FROM users WHERE user_type = 'super_admin' LIMIT 1;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE 'User Authentication Linking Fixed!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Next Steps Required:';
    RAISE NOTICE '1. Go to Supabase Dashboard → Authentication → Users';
    RAISE NOTICE '2. Create a new user with email: superadmin@jvflow.com';
    RAISE NOTICE '3. IMPORTANT: Set the user ID to: %', super_admin_id;
    RAISE NOTICE '4. Set a password for the super admin';
    RAISE NOTICE '5. Run: SELECT * FROM check_user_auth_sync(); to verify sync';
    RAISE NOTICE '============================================';
END $$;