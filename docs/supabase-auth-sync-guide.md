# Supabase Auth Synchronization Guide for JV-Flow

## Understanding the User Architecture

JV-Flow uses a dual user system architecture:

1. **Supabase Auth (`auth.users`)**: Handles authentication (login/password/sessions)
2. **Application Users (`public.users`)**: Contains business data and permissions

This guide explains how these systems work together and how to set up super admin access properly.

## The Critical Relationship

The most important thing to understand is that the IDs in both tables **must match exactly**:

- `auth.users.id` must be identical to `public.users.id` for the same user
- This creates a 1:1 relationship between auth accounts and user profiles

## Current Problem

The system currently has a mismatch:
- Your `public.users` table contains 4 users (including the super admin) 
- Your `auth.users` table has only 1 user (which you created separately)
- The super admin in `public.users` has no corresponding auth record

## Solution: Running the New Migration

We've created a migration script that fixes this architecture issue:

1. **Run the SQL migration:**
   ```bash
   psql -U postgres -d jvflow -f src/supabase/migrations/005_fix_user_auth_linking.sql
   ```
   or run it through the Supabase Dashboard SQL Editor.

2. **Get the super admin ID:**
   After running the migration, it will display an important message with the super admin's UUID. Save this UUID for the next step.

3. **Create matching auth record:**
   Go to Supabase Dashboard → Authentication → Users → New User
   - Email: `superadmin@jvflow.com`
   - Password: (set a strong password)
   - **CRITICAL**: Set User UUID to match the super admin ID from step 2
   
4. **Verify sync status:**
   Run this SQL query to check if users are properly synced:
   ```sql
   SELECT * FROM check_user_auth_sync();
   ```

## How It Works Now

With the fix applied:

1. **New auth users** automatically get a profile record in `public.users`
2. **User management** is handled through the Supabase Auth system
3. **Application permissions** are handled through the `public.users` table

## Updating Existing Users

For existing users in your `public.users` table, you need to create matching `auth.users` records:

1. Get the ID, email, and role for each user:
   ```sql
   SELECT id, email, role FROM public.users;
   ```

2. For each user, create a matching auth record with the exact same ID through the Supabase Dashboard.

## Super Admin Management

The Super Admin user is special:

1. It must have `user_type` and `role` set to `super_admin` in the `public.users` table
2. It must have a matching auth record with the same ID
3. Only this user can access platform-wide administration features

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security (RLS) Policies](https://supabase.com/docs/guides/auth/row-level-security)

## Troubleshooting

If you encounter issues with super admin access:

1. Verify IDs match between tables:
   ```sql
   SELECT * FROM check_user_auth_sync();
   ```

2. Verify super admin permissions:
   ```sql
   SELECT * FROM public.users WHERE user_type = 'super_admin';
   ```

3. Check RLS policies are correctly applied:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'users';
   ```