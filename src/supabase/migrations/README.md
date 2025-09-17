# JV-Flow Database Migrations

This directory contains all database migrations for the JV-Flow application.

## Migration Files

### 001_initial_schema.sql
- **Purpose**: Creates the complete database schema for JV-Flow
- **Description**: Sets up all tables, indexes, triggers, and Row Level Security (RLS) policies
- **Run Order**: First (required before any other migrations)

**Tables Created:**
- `organizations` - Real estate companies and organizations
- `users` - System users with role-based access
- `projects` - Real estate development projects
- `project_milestones` - Project phases with material requirements
- `expenses` - Expense tracking with approval workflows
- `vendors` - Supplier and contractor management
- `materials` - Construction materials and inventory
- `purchase_orders` - Purchase order management
- `purchase_order_items` - Individual items in purchase orders
- `bookings` - Property sales and bookings
- `installments` - Payment installments for bookings
- `invoices` - Auto-generated invoices
- `commissions` - Sales commission tracking
- `marketing_campaigns` - Marketing campaign management
- `activity_logs` - Complete audit trail
- `notifications` - User notification system

### 002_demo_data.sql
- **Purpose**: Populates the database with comprehensive demo data
- **Description**: Creates sample organization, users, projects, and transactions
- **Run Order**: Second (after initial schema)

**Demo Data Includes:**
- 1 sample organization (Prime Real Estate Ventures)
- 3 demo users with different roles
- 2 projects with various completion stages
- Sample expenses, bookings, vendors, materials
- Purchase orders and invoices
- Marketing campaigns and notifications
- Activity logs for audit trail demonstration

## Running Migrations

### Using Supabase CLI (Recommended)

```bash
# Reset database and run all migrations
supabase db reset

# Or run migrations individually
supabase db reset --db-url "your-database-url"
```

### Manual Execution

1. **Initial Schema Setup:**
   ```sql
   -- Connect to your PostgreSQL database and run:
   \i supabase/migrations/001_initial_schema.sql
   ```

2. **Demo Data Population:**
   ```sql
   -- After schema is created, run:
   \i supabase/migrations/002_demo_data.sql
   ```

### Using Database Management Tools

You can also run these migrations using tools like:
- pgAdmin
- DataGrip
- Supabase Dashboard SQL Editor
- Any PostgreSQL client

## Migration Best Practices

### Before Running Migrations

1. **Backup your database** (if running on existing data)
2. **Review the migration files** to understand what will be created
3. **Ensure you have proper permissions** to create tables and indexes
4. **Check disk space** requirements for large datasets

### After Running Migrations

1. **Verify all tables were created** successfully
2. **Check RLS policies** are active and working
3. **Test demo data** by running sample queries
4. **Verify user permissions** and role-based access

## Database Schema Overview

```
Organizations (1) ──── (N) Users
     │                     │
     │                     │
     ├─── (N) Projects ────┤
     │         │           │
     │         ├─── (N) Milestones
     │         ├─── (N) Bookings ──── (N) Installments
     │         └─── (N) Expenses     │
     │                               ├─── (N) Invoices
     ├─── (N) Vendors               │
     │         │                     │
     ├─── (N) Materials             │
     │         │                     │
     ├─── (N) Purchase Orders ──────┤
     │         │                     │
     │         └─── (N) PO Items    │
     │                               │
     ├─── (N) Marketing Campaigns   │
     ├─── (N) Commissions ──────────┤
     ├─── (N) Activity Logs         │
     └─── (N) Notifications ────────┤
```

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring:
- Users can only access data from their organization
- Role-based permissions are enforced
- Audit logs maintain data integrity

### Authentication
- JWT-based authentication via Supabase Auth
- Password policies and session management
- Support for social login providers

### Data Protection
- All sensitive data is encrypted at rest
- TLS encryption for data in transit
- Audit logging for all critical operations

## Performance Considerations

### Indexes Created
- Primary keys on all tables
- Foreign key indexes for relationships
- Performance indexes on frequently queried columns
- Composite indexes for complex queries

### Optimization Features
- Materialized views for dashboard statistics
- Query optimization for reporting
- Efficient data types for storage optimization

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Ensure you have CREATEDB privileges
   - Check if extensions can be installed
   - Verify RLS policies allow your operations

2. **Foreign Key Constraint Errors**
   - Run migrations in the correct order
   - Ensure demo data references exist
   - Check for data type mismatches

3. **Performance Issues**
   - Monitor index usage with EXPLAIN
   - Check for missing indexes on large tables
   - Consider partitioning for very large datasets

### Getting Help

1. Check the main project documentation
2. Review Supabase documentation for specific issues
3. Contact the development team for custom migration needs

## Migration Rollback

### Rolling Back Schema Changes
```sql
-- Drop all tables (WARNING: This will delete all data)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

### Rolling Back Demo Data
```sql
-- Remove demo data only
DELETE FROM activity_logs WHERE organization_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM notifications WHERE organization_id = '550e8400-e29b-41d4-a716-446655440000';
-- ... continue for all demo data
```

## Custom Migrations

To add your own migrations:

1. Create a new file with incremental numbering: `003_your_feature.sql`
2. Follow the existing patterns for table creation
3. Include proper indexes and RLS policies
4. Update this README with documentation
5. Test thoroughly before deploying

## Production Considerations

When deploying to production:

1. **Skip demo data migration** (002_demo_data.sql)
2. **Review and customize RLS policies** for your security requirements
3. **Set up proper backup schedules**
4. **Monitor performance** and add indexes as needed
5. **Configure alerts** for database health monitoring

---

For more information about the JV-Flow database architecture, see the main project documentation.