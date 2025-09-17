#BismiALLAH
# JV-Flow - Real Estate Joint Venture Management System

![JV-Flow](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.0-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-2.39.0-green.svg)

A comprehensive real estate Joint Venture management system with role-based dashboards, expense tracking with maker-checker workflows, sales management, automated commission calculations, and complete audit trails. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

### Core Functionality
- **Multi-Role RBAC/ABAC System** - Role-based access control with attribute-based permissions
- **Real-time Dashboards** - Role-specific dashboards for investors, builders, marketing, and admins
- **Expense Management** - Maker-checker workflows with approval processes
- **Sales Management** - Booking management with automated commission calculations
- **Project Management** - Complete project lifecycle management with milestones
- **Vendor Management** - Comprehensive vendor and supplier management
- **Material Management** - Inventory tracking and procurement workflows
- **Purchase Orders** - Full purchase order management with approval workflows

### Internationalization & Accessibility
- **Multi-Language Support** - English, Arabic, and Urdu
- **RTL Support** - Complete Right-to-Left layout support for Arabic and Urdu
- **Currency Localization** - Support for multiple currencies (PKR, EGP, SAR, BHD, OMR, AED, ZAR)
- **Responsive Design** - Mobile-first approach with tablet and desktop optimization

### Technical Features
- **SSO Authentication** - Secure single sign-on with Supabase Auth
- **Real-time Updates** - Live data synchronization across all users
- **Audit Trails** - Complete activity logging and audit capabilities
- **Subscription Management** - Organization-level subscription plans
- **Progressive Web App** - PWA capabilities for mobile installation
- **Free Tier Optimized** - Designed to run efficiently on free hosting tiers

## 🚀 Quick Start

### Prerequisites

- **Node.js 18.0+** - [Download](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Git** - Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd jv-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application should load with the login screen

For detailed setup instructions, see [LOCAL_DEVELOPMENT_SETUP.md](./LOCAL_DEVELOPMENT_SETUP.md).

## 📁 Project Structure

```
jv-flow/
├── App.tsx                    # Main application component
├── components/                # React components
│   ├── dashboards/           # Role-specific dashboard components
│   ├── forms/                # Form components with validation
│   ├── ui/                   # Reusable UI components (shadcn/ui)
│   ├── mobile/               # Mobile-optimized components
│   ├── providers/            # React context providers
│   └── constants/            # Application constants and routes
├── styles/                   # Global styles and Tailwind CSS
│   └── globals.css          # Main stylesheet with RTL support
├── lib/                      # Utility libraries and configurations
├── data/                     # Sample data and type definitions
├── supabase/                 # Database migrations and functions
├── workflows/                # CI/CD and deployment configurations
└── scripts/                  # Setup and utility scripts
```

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - UI library with hooks and concurrent features
- **TypeScript 5.3** - Type-safe JavaScript with advanced features
- **Vite 5.0** - Fast build tool and development server
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Flowbite** - Additional UI components and design system
- **shadcn/ui** - High-quality accessible components
- **Lucide React** - Beautiful SVG icons
- **Motion** - Animation library for smooth interactions

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live data updates
- **Edge Functions** - Serverless functions for business logic

### Development & Deployment
- **ESLint** - Code linting and formatting
- **GitHub Actions** - CI/CD automation
- **Firebase Hosting** - Static site hosting
- **Vercel** - Alternative hosting option
- **Netlify** - Alternative hosting option

## 🌍 Internationalization

JV-Flow supports multiple languages and regions:

### Supported Languages
- **English** - Default language
- **Arabic** - Full RTL support
- **Urdu** - Full RTL support

### Supported Currencies
- **PKR** - Pakistani Rupee
- **EGP** - Egyptian Pound
- **SAR** - Saudi Riyal
- **BHD** - Bahraini Dinar
- **OMR** - Omani Rial
- **AED** - UAE Dirham
- **ZAR** - South African Rand

### Features
- **RTL Layout** - Complete right-to-left layout support
- **Currency Formatting** - Locale-specific number and currency formatting
- **Date Formatting** - Localized date and time formats
- **Dynamic Language Switching** - Change language without page reload

## 👥 User Roles & Permissions

### Admin
- Full system access and configuration
- User management and role assignment
- Organization and project setup
- System settings and integrations

### Investor
- Portfolio overview and performance metrics
- Investment tracking and ROI analysis
- Expense approval and budget monitoring
- Financial reports and statements

### Builder
- Project management and milestone tracking
- Expense submission and tracking
- Vendor and material management
- Construction progress monitoring

### Marketing
- Sales dashboard and lead management
- Booking management and customer tracking
- Commission tracking and reporting
- Marketing campaign management

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript types

# Database
npm run db:reset        # Reset Supabase database
npm run db:migrate      # Run database migrations

# Deployment
npm run deploy:firebase # Deploy to Firebase
npm run deploy:vercel   # Deploy to Vercel
npm run deploy:netlify  # Deploy to Netlify
```

### Adding New Features

1. **Create component** in appropriate directory
2. **Add routes** to dashboard or form routes
3. **Update translations** in InternationalizationProvider
4. **Add database schema** if needed
5. **Write tests** for new functionality
6. **Update documentation**

### Flowbite Integration

JV-Flow now includes Flowbite for additional UI components:

```tsx
import { Button, Card, Modal } from 'flowbite-react';

// Use Flowbite components alongside shadcn/ui
function MyComponent() {
  return (
    <Card>
      <Button color="blue">
        Flowbite Button
      </Button>
    </Card>
  );
}
```

## 🚀 Deployment

### Free Tier Deployment (Recommended)

Deploy for FREE using Firebase + Supabase:

1. **Setup Supabase** (Free - 500MB DB, 50k users)
2. **Setup Firebase Hosting** (Free - 10GB bandwidth)
3. **Configure environment variables**
4. **Deploy with GitHub Actions**

See [QUICK_START_FREE_TIER.md](./QUICK_START_FREE_TIER.md) for detailed instructions.

### Alternative Hosting Options

- **Vercel** - `npm run deploy:vercel`
- **Netlify** - `npm run deploy:netlify`
- **Docker** - `docker-compose up`

## 📊 Free Tier Limits

| Service | Storage | Bandwidth | Users | Cost |
|---------|---------|-----------|-------|------|
| Supabase | 500MB | 5GB | 50k | $0 |
| Firebase | 10GB | 10GB | ∞ | $0 |
| GitHub Actions | - | - | - | $0 |
| **Total** | **10.5GB** | **15GB** | **50k** | **$0** |

Perfect for MVPs and small to medium-sized organizations.

## 🔒 Security Features

- **Row Level Security** - Database-level access control
- **JWT Authentication** - Secure token-based authentication
- **Role-based Access** - Granular permission system
- **Audit Trails** - Complete activity logging
- **Data Encryption** - Encrypted data at rest and in transit
- **CORS Protection** - Cross-origin request protection

## 📈 Performance Optimizations

- **Code Splitting** - Lazy loading of dashboard components
- **Bundle Optimization** - Optimized builds for faster loading
- **Caching Strategy** - Efficient caching of static assets
- **Image Optimization** - Responsive images with fallbacks
- **Progressive Loading** - Skeleton screens and loading states

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain responsive design principles
- Write clean, readable code
- Add appropriate tests
- Update documentation
- Follow the existing code style

## 📝 Documentation

- [Local Development Setup](./LOCAL_DEVELOPMENT_SETUP.md)
- [Quick Start Guide](./QUICK_START_FREE_TIER.md)
- [Project Documentation](./PROJECT_DOCUMENTATION.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Changelog](./CHANGELOG.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

1. **Check Documentation** - Review the comprehensive documentation
2. **Search Issues** - Look for existing solutions in GitHub issues
3. **Development Environment** - Ensure your setup matches requirements
4. **Community Support** - Join our developer community

### Common Issues

- **Port conflicts** - Change port with `npm run dev -- --port 3001`
- **Environment variables** - Ensure all VITE_ prefixed variables are set
- **Build failures** - Clear node_modules and reinstall dependencies
- **Database issues** - Verify Supabase configuration and connection

### Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Flowbite Documentation](https://flowbite.com/docs/)

---

**Built with ❤️ for the real estate industry**

Transform your real estate joint ventures with modern technology and intuitive design.