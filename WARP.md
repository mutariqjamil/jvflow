# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
```bash
npm run dev              # Start development server on port 3000
npm run build            # Build for production (outputs to dist/)
npm run preview          # Preview production build locally
npm run type-check       # Run TypeScript type checking without building
npm run lint             # Run ESLint with auto-fix
```

### Database & Backend
```bash
npm run db:reset         # Reset Supabase database (requires Supabase CLI)
npm run db:migrate       # Run database migrations
supabase start           # Start local Supabase instance
supabase functions serve # Start local edge functions server
```

### Deployment
```bash
npm run deploy:firebase  # Build and deploy to Firebase Hosting
npm run deploy:vercel    # Build and deploy to Vercel
npm run deploy:netlify   # Build and deploy to Netlify
npm run health-check     # Check if localhost:3000 is responding
```

### Development Setup
```bash
npm run setup:demo       # Run demo setup script (requires bash/sh)
npm run docs             # Display link to project documentation
```

## Architecture Overview

### Stack
- **Frontend**: React 18.2 + TypeScript 5.3 + Vite 5.0
- **Styling**: Tailwind CSS 4.0 + shadcn/ui components + Flowbite
- **Backend**: Supabase (PostgreSQL + Edge Functions with Hono)
- **Authentication**: Supabase Auth with SSO support
- **State Management**: React Context API + Local Storage

### Application Structure
```
App.tsx (Root)
├── InternationalizationProvider (I18n context)
├── AuthProvider (Auth + organization context)  
├── NotificationProvider (Toast notifications)
└── AppContent
    ├── LoginForm (if not authenticated)
    ├── OrganizationSetup (if no org)
    └── ResponsiveWrapper
        ├── DashboardLayout (desktop)
        └── MobileDashboard (mobile)
```

### Key Architectural Patterns

**Multi-Tenant Organization System**: The app is built around organizations where users can belong to multiple orgs and switch between them. Each org has its own subscription status and user roles.

**Role-Based Access Control**: Implements RBAC/ABAC with roles like admin, investor, builder, marketing. Permissions are stored in the organization context and enforced throughout the UI.

**Provider Pattern**: Extensive use of React Context providers for:
- `AuthProvider` - User auth, organizations, subscriptions
- `InternationalizationProvider` - Multi-language support (EN/AR/UR) with RTL
- `AppNavigationProvider` - Navigation state and form routing
- `NotificationProvider` - Toast notifications via Sonner

**Dashboard Component Architecture**: All major features are separate dashboard components imported dynamically via the `DASHBOARD_COMPONENTS` constant. Each dashboard is self-contained with its own state, forms, and data fetching.

**Mobile-First Responsive Design**: Uses `useIsMobile()` hook to switch between desktop (`DashboardLayout`) and mobile (`MobileDashboard`) layouts. Mobile components are in `/components/mobile/`.

**Demo Mode Support**: The app can run in demo mode without Supabase for development/testing, controlled by `isSupabaseConfigured` flag.

### Database Architecture
- **Key-Value Store**: Uses a flexible KV store table for configuration data
- **Edge Functions**: Server logic runs in Supabase Edge Functions using Hono framework
- **Real-time Subscriptions**: Live data updates across all connected clients

### Form and State Management
- **React Hook Form**: All forms use react-hook-form with Zod validation
- **Form Routing**: Forms can be rendered fullscreen or within dashboards via `currentForm` state
- **Optimistic Updates**: UI updates immediately with server sync in background

## Development Practices

### File Organization
- `/src/App.tsx` - Main application entry point
- `/src/components/dashboards/` - Feature-specific dashboard components  
- `/src/components/forms/` - Reusable form components
- `/src/components/ui/` - shadcn/ui and reusable UI components
- `/src/components/mobile/` - Mobile-optimized components
- `/src/components/providers/` - React context providers
- `/src/components/constants/` - Route definitions and constants

### Component Naming Conventions
- Dashboard components: `*Dashboard.tsx` (e.g., `ExpensesDashboard.tsx`)
- Form components: `*Form.tsx` (e.g., `ExpenseApprovalForm.tsx`)
- Provider components: `*Provider.tsx`
- Dialog/Modal components: `*Dialog.tsx`

### Key Constants and Configurations
- `DASHBOARD_COMPONENTS` in `/src/components/constants/dashboardRoutes.ts` - Maps route strings to dashboard components
- `DEFAULT_TAB = 'overview'` - Default dashboard view
- Port 3000 for development server
- Build output directory: `dist/`

### Internationalization
The app supports English, Arabic, and Urdu with complete RTL layout support. When working with text:
- Use the `t()` function from `useInternationalization()` hook for translatable strings
- Wrap new components in `dir={direction}` for RTL support
- Currency formatting supports PKR, EGP, SAR, BHD, OMR, AED, ZAR

### Authentication & Authorization
- Check `user` and `currentOrganization` from `useAuth()` hook
- Demo mode is available when Supabase is not configured
- Organization switching is handled via `switchOrganization()` method
- User roles and permissions are stored in the organization context

### Testing & Quality
- No test framework currently configured
- Use `npm run type-check` to verify TypeScript correctness
- ESLint is configured for code quality checking
- Use `npm run lint` to auto-fix common issues

### Environment Configuration
Required environment variables:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For server functions
```

### Deployment Targets
The project is optimized for free-tier deployment on:
- **Firebase Hosting** (10GB bandwidth, unlimited users)
- **Vercel** (100GB bandwidth, unlimited users) 
- **Netlify** (100GB bandwidth, unlimited users)
- **Supabase** (500MB DB, 5GB bandwidth, 50k users)

All deployment configurations are pre-configured with appropriate build settings and redirects for SPA routing.

### Performance Considerations
- Code splitting implemented at dashboard component level
- Lazy loading for dashboard components via dynamic imports
- Image optimization using `ImageWithFallback` component
- Mobile-specific optimizations in dedicated mobile components
- Bundle analysis available via `npm run analyze`

### Free-Tier Optimizations
The project includes extensive free-tier deployment guides and configurations to run efficiently within free hosting limits. See `/src/FREE_TIER_DEPLOYMENT.md` and `/src/QUICK_START_FREE_TIER.md` for detailed instructions.