// JV-Flow Application Metadata
// This file contains all metadata, configuration, and system information

export const APPLICATION_METADATA = {
  // Basic application information
  name: 'JV-Flow',
  fullName: 'Joint Venture Flow - Real Estate Management System',
  version: '1.0.0',
  description: 'Comprehensive real estate joint venture management system with role-based dashboards, expense tracking, sales management, and automated workflows',
  
  // Build and deployment information
  build: {
    buildDate: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    gitCommit: process.env.VITE_GIT_COMMIT || 'local',
    buildNumber: process.env.VITE_BUILD_NUMBER || '1'
  },
  
  // Author and organization information
  author: {
    name: 'JV-Flow Development Team',
    email: 'dev@jvflow.com',
    website: 'https://jvflow.com'
  },
  
  // License and legal information
  license: {
    type: 'MIT',
    url: 'https://opensource.org/licenses/MIT',
    copyright: `© ${new Date().getFullYear()} JV-Flow. All rights reserved.`
  },
  
  // Technical specifications
  technical: {
    framework: 'React 18',
    language: 'TypeScript',
    styling: 'Tailwind CSS v4',
    components: 'shadcn/ui',
    backend: 'Supabase',
    deployment: 'Firebase Hosting / Vercel / Netlify',
    buildTool: 'Vite',
    packageManager: 'npm'
  },
  
  // Browser and platform support
  support: {
    browsers: [
      'Chrome 90+',
      'Firefox 88+',
      'Safari 14+',
      'Edge 90+'
    ],
    platforms: [
      'Desktop (Windows, macOS, Linux)',
      'Mobile (iOS 14+, Android 10+)',
      'Tablet (iPad, Android tablets)'
    ],
    accessibility: 'WCAG 2.1 AA compliant'
  },
  
  // Feature capabilities
  features: {
    core: [
      'Role-based access control (RBAC/ABAC)',
      'Multi-organization support',
      'Project management',
      'Expense tracking with approval workflows',
      'Sales and booking management',
      'Automated commission calculations',
      'Invoice generation and management',
      'Vendor and material management',
      'Purchase order system',
      'Project milestones tracking',
      'Real-time notifications',
      'Comprehensive reporting',
      'Mobile-optimized interface'
    ],
    
    advanced: [
      'Automated invoice generation',
      'Material requirements planning',
      'Inventory tracking',
      'Marketing campaign management',
      'Activity audit trails',
      'Custom color themes',
      'Logo customization',
      'Multi-currency support (planned)',
      'API integrations (planned)',
      'Advanced analytics (planned)'
    ]
  },
  
  // Security features
  security: {
    authentication: 'Supabase Auth with email/password and social login',
    authorization: 'Row Level Security (RLS) policies',
    dataEncryption: 'TLS 1.3 in transit, AES-256 at rest',
    compliance: ['GDPR ready', 'SOC 2 Type II (via Supabase)'],
    features: [
      'Multi-factor authentication support',
      'Session management',
      'Audit logging',
      'Data encryption',
      'Secure file uploads',
      'Role-based permissions'
    ]
  },
  
  // Performance specifications
  performance: {
    targets: {
      firstContentfulPaint: '< 2 seconds',
      largestContentfulPaint: '< 2.5 seconds',
      firstInputDelay: '< 100ms',
      cumulativeLayoutShift: '< 0.1'
    },
    optimization: [
      'Code splitting and lazy loading',
      'Image optimization',
      'CDN delivery',
      'Caching strategies',
      'Bundle size optimization',
      'Database query optimization'
    ]
  },
  
  // API and integration capabilities
  api: {
    version: 'v1',
    type: 'REST API via Supabase',
    authentication: 'JWT tokens',
    rateLimiting: 'Per Supabase plan limits',
    documentation: 'Available in project documentation',
    webhooks: 'Supported via Supabase Edge Functions'
  },
  
  // Database schema version
  database: {
    version: '1.0.0',
    provider: 'PostgreSQL (via Supabase)',
    migrations: 'Supabase migrations',
    backup: 'Automated daily backups',
    replication: 'Multi-region support available'
  }
}

export const SYSTEM_CONFIGURATION = {
  // Default application settings
  defaults: {
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    timezone: 'America/New_York',
    language: 'en-US',
    theme: 'light',
    itemsPerPage: 10,
    maxFileSize: '10MB',
    sessionTimeout: 86400000 // 24 hours in milliseconds
  },
  
  // Limits and constraints
  limits: {
    organizations: {
      maxUsers: {
        free: 5,
        professional: 50,
        enterprise: 500
      },
      maxProjects: {
        free: 3,
        professional: 25,
        enterprise: 'unlimited'
      },
      storageLimit: {
        free: '1GB',
        professional: '100GB',
        enterprise: '1TB'
      }
    },
    
    files: {
      maxSize: 10485760, // 10MB in bytes
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
    },
    
    api: {
      requestsPerMinute: 100,
      maxPayloadSize: '1MB',
      timeout: 30000 // 30 seconds
    }
  },
  
  // Feature flags configuration
  features: {
    enableRegistration: true,
    enableSocialLogin: true,
    enableFileUploads: true,
    enableNotifications: true,
    enableAnalytics: true,
    enableMobileApp: false,
    enableAdvancedReporting: true,
    enableCustomBranding: true,
    enableMultiCurrency: false,
    enableAPIAccess: false
  },
  
  // Third-party service configurations
  integrations: {
    analytics: {
      googleAnalytics: {
        enabled: false,
        trackingId: process.env.VITE_GOOGLE_ANALYTICS_ID
      },
      hotjar: {
        enabled: false,
        siteId: process.env.VITE_HOTJAR_ID
      }
    },
    
    monitoring: {
      sentry: {
        enabled: false,
        dsn: process.env.VITE_SENTRY_DSN
      }
    },
    
    communication: {
      email: {
        provider: 'Supabase Auth',
        templates: 'Built-in templates'
      },
      sms: {
        enabled: false,
        provider: 'TBD'
      }
    }
  }
}

export const DEPLOYMENT_ENVIRONMENTS = {
  development: {
    name: 'Development',
    url: 'http://localhost:3000',
    database: 'Local Supabase',
    features: {
      debugMode: true,
      mockData: true,
      performanceMonitoring: true
    }
  },
  
  staging: {
    name: 'Staging',
    url: process.env.VITE_STAGING_URL || 'https://staging.jvflow.com',
    database: 'Staging Supabase',
    features: {
      debugMode: false,
      mockData: false,
      performanceMonitoring: true
    }
  },
  
  production: {
    name: 'Production',
    url: process.env.VITE_PRODUCTION_URL || 'https://app.jvflow.com',
    database: 'Production Supabase',
    features: {
      debugMode: false,
      mockData: false,
      performanceMonitoring: true,
      analytics: true,
      errorReporting: true
    }
  }
}

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'USD',
    billing: 'monthly',
    features: {
      users: 5,
      projects: 3,
      storage: '1GB',
      support: 'Community',
      advanced_features: false
    },
    limits: {
      api_requests: 1000,
      file_uploads: 100,
      export_reports: 10
    }
  },
  
  professional: {
    name: 'Professional',
    price: 49,
    currency: 'USD',
    billing: 'monthly',
    features: {
      users: 50,
      projects: 25,
      storage: '100GB',
      support: 'Email',
      advanced_features: true
    },
    limits: {
      api_requests: 10000,
      file_uploads: 1000,
      export_reports: 100
    }
  },
  
  enterprise: {
    name: 'Enterprise',
    price: 199,
    currency: 'USD',
    billing: 'monthly',
    features: {
      users: 500,
      projects: 'unlimited',
      storage: '1TB',
      support: 'Priority',
      advanced_features: true,
      custom_integrations: true,
      dedicated_support: true
    },
    limits: {
      api_requests: 100000,
      file_uploads: 10000,
      export_reports: 'unlimited'
    }
  }
}

// Export all metadata as a single object
export const METADATA = {
  application: APPLICATION_METADATA,
  configuration: SYSTEM_CONFIGURATION,
  environments: DEPLOYMENT_ENVIRONMENTS,
  subscriptions: SUBSCRIPTION_PLANS
}