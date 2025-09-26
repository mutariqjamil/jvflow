# JV-Flow Supabase Setup Guide

## Overview

JV-Flow supports both **Demo Mode** (with mock data) and **Live Mode** (with Supabase integration). This guide will help you set up Supabase for production use.

## Quick Start

### Option 1: Keep Using Demo Mode (Recommended for Testing)
- No setup required
- Uses mock data for all operations
- Perfect for testing and demonstrations
- Access via Super Admin Settings → Database & Integration → Demo Mode toggle

### Option 2: Set Up Supabase (For Production)
Follow the steps below to configure your own Supabase instance.

## Setting Up Supabase

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or sign in to your account
3. Click "New Project"
4. Choose your organization (or create one)
5. Fill in project details:
   - **Name**: `jv-flow-production` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
   - **Pricing Plan**: Start with Free tier for testing

### Step 2: Get Your Project Credentials

1. From your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJ...` (long JWT token)

### Step 3: Configure JV-Flow

1. Open JV-Flow application
2. Login as Super Admin (tj.analyst@gmail.com)
3. Navigate to **Super Admin** → **Settings** tab
4. In the "Database & Integration" section:
   - Paste your **Project URL**
   - Paste your **anon/public key**
   - Click **Test Connection** to verify
   - Toggle **Demo Mode** OFF to enable live mode

### Step 4: Set Up Database Schema

Run the following SQL scripts in your Supabase SQL Editor:

#### 1. Enable Required Extensions
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security helpers
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

#### 2. Create Core Tables
```sql
-- Organizations table
CREATE TABLE organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  owner_id UUID REFERENCES auth.users(id),
  subscription_status TEXT DEFAULT 'trial',
  trial_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user',
  registration_type TEXT DEFAULT 'email',
  trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_end_date TIMESTAMP WITH TIME ZONE,
  subscription_status TEXT DEFAULT 'trial',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization members table
CREATE TABLE organization_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  budget DECIMAL(15,2),
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  project_id UUID REFERENCES projects(id),
  category TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  receipt_url TEXT,
  submitted_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Set Up Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Organization policies
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- User profile policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR ALL USING (id = auth.uid());

-- Organization members policies
CREATE POLICY "Users can view organization members" ON organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Projects policies
CREATE POLICY "Users can view organization projects" ON projects
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Expenses policies
CREATE POLICY "Users can view organization expenses" ON expenses
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );
```

#### 4. Create Functions and Triggers
```sql
-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, registration_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    CASE 
      WHEN NEW.phone IS NOT NULL THEN 'phone'
      ELSE 'email'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Step 5: Configure Authentication (Optional)

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your preferred authentication methods:
   - **Email/Password**: Enable if you want email-based auth
   - **Social Providers**: Configure Google, Facebook, etc.
   - **Magic Links**: Enable for passwordless authentication

### Step 6: Set Up Storage (Optional)

If you need file uploads (receipts, documents):

1. Go to **Storage** in Supabase dashboard
2. Create buckets for different file types:
   - `receipts` - for expense receipts
   - `documents` - for organization documents
   - `avatars` - for user profile pictures

### Step 7: Test the Integration

1. In JV-Flow, go to **Super Admin** → **Settings**
2. Ensure **Demo Mode** is OFF
3. Click **Test Connection** - should show "Connected"
4. Try creating a test organization or user
5. Check your Supabase dashboard to see the data

## Environment Variables (Alternative Setup)

For advanced users, you can also configure Supabase using environment variables:

1. Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Update `src/utils/supabase/info.ts`:
```typescript
export const projectId = import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'demo-project-id'
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key'
```

## Troubleshooting

### Common Issues

1. **Connection Test Fails**
   - Verify your Project URL format: `https://xxx.supabase.co`
   - Check that your anon key is copied correctly
   - Ensure your Supabase project is not paused

2. **RLS Policies Too Restrictive**
   - Check that your policies allow the operations you need
   - Test with RLS temporarily disabled for debugging

3. **Missing Tables**
   - Ensure you've run all the SQL scripts above
   - Check the Supabase SQL editor for any errors

4. **Authentication Issues**
   - Verify your auth settings in Supabase dashboard
   - Check that email/password auth is enabled if using that method

### Getting Help

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Visit the [JV-Flow GitHub Issues](https://github.com/your-repo/issues)
3. Join our community Discord (link in README)

## Production Considerations

### Security
- Use environment variables for credentials in production
- Enable RLS on all tables
- Regularly rotate your service keys
- Set up proper CORS origins

### Performance
- Add database indexes for frequently queried columns
- Consider upgrading to a paid Supabase plan for better performance
- Monitor your database usage in Supabase dashboard

### Backup
- Supabase automatically backs up your database
- Consider setting up additional backup strategies for critical data
- Test your backup restoration process

### Monitoring
- Set up alerts for database performance
- Monitor your API usage limits
- Track user growth and plan upgrades accordingly

---

## Quick Summary

1. ✅ **Demo Mode**: Works out of the box, no setup needed
2. ✅ **Live Mode**: Requires Supabase project setup
3. ✅ **Toggle**: Switch between modes in Super Admin Settings
4. ✅ **Testing**: Use the built-in connection tester
5. ✅ **Support**: Full documentation and troubleshooting guide

**Recommended**: Start with Demo Mode, then switch to Live Mode when you're ready for production!