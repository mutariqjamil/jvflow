# JV-Flow Data Directory

This directory contains all data-related files for the JV-Flow application, including demo data, metadata, and configuration.

## Files Overview

### demo-sample-data.ts
**Purpose**: Complete demo dataset for development and testing
**Usage**: Import demo data to populate the application with realistic sample data

**Contains:**
- Demo organization (Prime Real Estate Ventures)
- Sample users with different roles
- Projects with realistic data
- Expenses, vendors, materials, bookings
- Charts data for dashboard visualization
- Application constants and feature flags

**Usage Example:**
```typescript
import { DEMO_DATA } from './data/demo-sample-data'

// Use specific demo data
const demoProjects = DEMO_DATA.projects
const demoUsers = DEMO_DATA.users

// Use constants
const expenseCategories = DEMO_DATA.constants.EXPENSE_CATEGORIES
```

### metadata.ts
**Purpose**: Application metadata, configuration, and system information
**Usage**: Access application settings, version info, and system configuration

**Contains:**
- Application information (name, version, description)
- Technical specifications and build info
- Security features and compliance information
- Performance targets and optimization details
- Subscription plans and feature limits
- Environment configurations

**Usage Example:**
```typescript
import { METADATA } from './data/metadata'

// Get application info
const appName = METADATA.application.name
const version = METADATA.application.version

// Get configuration
const limits = METADATA.configuration.limits
const features = METADATA.configuration.features
```

## Demo Data Structure

### Organizations
- **Prime Real Estate Ventures**: Complete demo organization with realistic settings
- Includes address, contact info, branding, and subscription details

### Users & Roles
1. **John Manager** (project_manager): Project and expense management permissions
2. **Sarah Wilson** (sales_executive): Sales, bookings, and customer management
3. **Mike Chen** (finance_manager): Financial operations and reporting access

### Projects
1. **Sunset Heights Residency**: 50-unit residential complex (65% complete)
2. **Metro Business Center**: Commercial office complex (15% complete)

### Sample Transactions
- Expenses across different categories (Materials, Labor, Equipment)
- Vendor relationships and purchase orders
- Customer bookings with payment tracking
- Commission calculations and payments
- Marketing campaigns with metrics

### Chart Data
Ready-to-use data for dashboard visualizations:
- Revenue trends over time
- Expense breakdown by category
- Sales performance metrics
- Project progress tracking

## Application Constants

### User Roles
- Administrator, Project Manager, Finance Manager, Sales Executive, User
- Each role has specific permissions defined

### Categories & Types
- Expense categories (Materials, Labor, Equipment, etc.)
- Project types (Residential, Commercial, Mixed Use, etc.)
- Vendor types (Materials Supplier, Contractor, etc.)
- Material categories (Concrete, Steel, Electrical, etc.)

### Status Values
- Project statuses (planning, active, on_hold, completed, cancelled)
- Booking statuses (inquiry, booked, confirmed, cancelled, completed)
- Payment statuses (pending, paid, overdue, cancelled, refunded)

## Feature Flags

Demo feature flags control which features are enabled:
- `enableAdvancedReporting`: Advanced analytics and reporting
- `enableMobileOptimization`: Mobile-specific features
- `enableRealTimeNotifications`: Live notification system
- `enableAutomatedInvoicing`: Automatic invoice generation
- `enableVendorPortal`: Vendor self-service portal (coming soon)
- `enableCustomerPortal`: Customer access portal (coming soon)

## Using Demo Data

### Development Environment
The demo data is automatically used in development mode to provide a rich testing environment.

### Production Deployment
**Important**: Demo data should NOT be used in production environments. Use the demo data only for:
- Development and testing
- Demonstrations and presentations
- Training new users
- Feature development and validation

### Customizing Demo Data

To customize the demo data for your needs:

1. **Modify demo-sample-data.ts**: Update the demo objects with your preferred data
2. **Update constants**: Adjust categories, types, and status values
3. **Customize feature flags**: Enable/disable features as needed
4. **Rebuild application**: Run `npm run build` after changes

### Database Integration

The demo data corresponds to the database schema defined in `/supabase/migrations/002_demo_data.sql`. When populating the database:

1. The SQL migration creates the demo data in the database
2. The TypeScript files provide the same data for frontend use
3. Both should be kept in sync for consistency

## Best Practices

### For Developers
1. **Use TypeScript constants**: Leverage the typed constants instead of hardcoded values
2. **Feature flags**: Check feature flags before implementing conditional features
3. **Data validation**: Ensure demo data matches your database schema
4. **Updates**: Keep demo data current with application features

### For Demonstrations
1. **Realistic data**: Use the provided realistic business scenarios
2. **Multiple roles**: Demonstrate different user perspectives
3. **Complete workflows**: Show end-to-end business processes
4. **Performance**: Demo data is optimized for smooth demonstrations

### For Testing
1. **Edge cases**: Demo data includes various scenarios for testing
2. **Relationships**: All data relationships are properly maintained
3. **States**: Different status values for comprehensive testing
4. **Volume**: Sufficient data volume for performance testing

## File Maintenance

These files should be updated when:
- Adding new features that require demo data
- Changing application constants or configurations
- Updating user roles or permissions
- Modifying database schema that affects demo data
- Adding new categories, types, or status values

## Integration Points

The data files integrate with:
- Database migrations (`/supabase/migrations/`)
- Application components (all dashboard and form components)
- Authentication and authorization systems
- Reporting and analytics features
- Configuration and settings management

---

For more information about using this data in your development workflow, see the main project documentation.