# JV-Flow - Real Estate Joint Venture Management System

## Project Overview

JV-Flow is a comprehensive real estate Joint Venture management system built with React, TypeScript, and Supabase. The platform provides role-based dashboards, expense tracking with maker-checker workflows, sales management, automated commission calculations, and complete audit trails.

### Key Features

- **Authentication & Authorization**: SSO integration with multi-role RBAC/ABAC system
- **Organization Management**: Multi-tenant architecture with subscription plans
- **Project Management**: Complete project lifecycle management with milestone tracking
- **Financial Management**: Expense tracking, automated invoicing, commission calculations
- **Supply Chain Management**: Vendor management, material tracking, procurement workflows
- **User Management**: Enhanced user management with role-based permissions
- **Mobile Optimization**: Responsive design with dedicated mobile components
- **Customization**: Theme selection, logo uploads, and branding customization

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **Recharts** for data visualization
- **Motion/React** for animations
- **React Hook Form** for form management

### Backend
- **Supabase** for database, authentication, and storage
- **Supabase Edge Functions** with Hono web server
- **PostgreSQL** database with key-value store

### Development Tools
- **Vite** for build tooling
- **ESLint** and **Prettier** for code quality
- **TypeScript** for type safety

## Project Architecture

### Three-Tier Architecture
```
Frontend (React/TypeScript) → Server (Supabase Edge Functions) → Database (PostgreSQL)
```

### Component Structure
```
├── App.tsx (Main application entry point)
├── components/
│   ├── dashboards/ (Feature-specific dashboards)
│   ├── forms/ (Reusable form components)
│   ├── mobile/ (Mobile-optimized components)
│   └── ui/ (shadcn/ui components)
└── supabase/functions/server/ (Backend logic)
```

## File Structure Explanation

### Core Application Files
- **App.tsx**: Main application entry point with routing and state management
- **AuthProvider.tsx**: Authentication context and user session management
- **ResponsiveWrapper.tsx**: Main layout wrapper with navigation and responsiveness

### Dashboard Components
All dashboard components are located in `/components/dashboards/`:

- **OverviewDashboard.tsx**: Main dashboard with KPIs and summary metrics
- **ProjectSetupDashboard.tsx**: Project creation and management
- **ProjectMilestonesDashboard.tsx**: Milestone tracking and material requirements
- **ExpensesDashboard.tsx**: Expense tracking with approval workflows
- **BookingDashboard.tsx**: Sales and booking management
- **VendorManagementDashboard.tsx**: Vendor onboarding and management
- **MaterialManagementDashboard.tsx**: Material catalog and inventory
- **ProcurementDashboard.tsx**: Purchase requisitions and approvals
- **PurchaseOrderDashboard.tsx**: Purchase order creation and tracking
- **UserManagementDashboard.tsx**: User roles and permissions
- **SettingsDashboard.tsx**: System configuration and customization

### Forms and Workflows
Located in `/components/forms/`:
- Form components for data entry and approval workflows
- Validation and error handling
- Integration with backend APIs

### Mobile Components
Located in `/components/mobile/`:
- **MobileExpensesDashboard.tsx**: Mobile-optimized expense management
- **MobileDashboard.tsx**: General mobile dashboard wrapper
- **MobileOptimizedCard.tsx**: Touch-friendly card components

### Backend Structure
Located in `/supabase/functions/server/`:
- **index.tsx**: Main Hono server with routing
- **kv_store.tsx**: Key-value store utilities for data persistence

## Setup and Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Supabase CLI
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd jv-flow
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Start development server**
```bash
npm run dev
```

5. **Start Supabase locally** (optional)
```bash
supabase start
supabase functions serve
```

### Build for Production
```bash
npm run build
npm run preview
```

## Deployment Guide

### Google Cloud Platform (GCP) Deployment

#### Option 1: Google Cloud Run (Recommended)

1. **Setup GCP Project**
```bash
# Install Google Cloud CLI
gcloud auth login
gcloud config set project your-project-id
```

2. **Build and containerize**
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 8080;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

3. **Deploy to Cloud Run**
```bash
# Build and push container
gcloud builds submit --tag gcr.io/your-project-id/jv-flow

# Deploy to Cloud Run
gcloud run deploy jv-flow \
  --image gcr.io/your-project-id/jv-flow \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_SUPABASE_URL=your_url,VITE_SUPABASE_ANON_KEY=your_key
```

#### Option 2: Firebase Hosting

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase**
```bash
firebase init hosting
```

3. **Configure firebase.json**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. **Deploy**
```bash
npm run build
firebase deploy
```

### Amazon Web Services (AWS) Deployment

#### Option 1: AWS Amplify (Recommended)

1. **Install Amplify CLI**
```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. **Initialize Amplify**
```bash
amplify init
```

3. **Add hosting**
```bash
amplify add hosting
amplify publish
```

4. **Configure build settings**
Create `amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Option 2: AWS S3 + CloudFront

1. **Build the application**
```bash
npm run build
```

2. **Create S3 bucket**
```bash
aws s3 mb s3://jv-flow-app --region us-east-1
```

3. **Configure bucket for static hosting**
```bash
aws s3 website s3://jv-flow-app --index-document index.html --error-document index.html
```

4. **Upload files**
```bash
aws s3 sync dist/ s3://jv-flow-app --delete
```

5. **Create CloudFront distribution**
```bash
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

CloudFront config example:
```json
{
  "CallerReference": "jv-flow-$(date +%s)",
  "Aliases": {
    "Quantity": 1,
    "Items": ["your-domain.com"]
  },
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-jv-flow-app",
        "DomainName": "jv-flow-app.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-jv-flow-app",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 86400
      }
    ]
  },
  "Comment": "JV-Flow Application",
  "Enabled": true
}
```

#### Option 3: AWS ECS with Fargate

1. **Create ECR repository**
```bash
aws ecr create-repository --repository-name jv-flow
```

2. **Build and push Docker image**
```bash
# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

# Build and tag
docker build -t jv-flow .
docker tag jv-flow:latest your-account.dkr.ecr.us-east-1.amazonaws.com/jv-flow:latest

# Push
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/jv-flow:latest
```

3. **Create ECS cluster and service**
```bash
# Create cluster
aws ecs create-cluster --cluster-name jv-flow-cluster

# Create task definition (see task-definition.json below)
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster jv-flow-cluster \
  --service-name jv-flow-service \
  --task-definition jv-flow-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

## Environment Variables

### Required Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional Configuration
VITE_APP_NAME=JV-Flow
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

### Development Environment Variables
```env
# Development-specific
VITE_DEBUG=true
VITE_API_BASE_URL=http://localhost:54321/functions/v1
```

## Configuration Management

### Supabase Configuration
1. **Database Setup**: The application uses a key-value store table for flexible data storage
2. **Authentication**: Configure OAuth providers in Supabase dashboard
3. **Storage**: Set up buckets for file uploads (logos, documents)
4. **Edge Functions**: Deploy the server functions to Supabase

### Application Configuration
- **Theme Configuration**: Managed through SettingsDashboard component
- **Role-based Access**: Configured through UserManagementDashboard
- **Organization Settings**: Managed through OrganizationSetup component

## Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Implemented at dashboard level
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Using ImageWithFallback component
- **Mobile Optimization**: Dedicated mobile components

### Backend Optimizations
- **Edge Functions**: Serverless architecture for scalability
- **Database Indexing**: Proper indexing on frequently queried fields
- **Caching**: Implemented at component and API level

## Security Considerations

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions system
- **API Security**: Protected endpoints with proper authentication

### Data Protection
- **Input Validation**: Form validation and sanitization
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content sanitization
- **HTTPS Only**: Secure communication protocols

## Monitoring and Logging

### Application Monitoring
- **Error Tracking**: Console logging and error boundaries
- **Performance Metrics**: Core Web Vitals monitoring
- **User Analytics**: Usage tracking and insights

### Infrastructure Monitoring
- **Server Health**: Supabase dashboard monitoring
- **Database Performance**: Query performance tracking
- **Edge Function Logs**: Centralized logging system

## Maintenance and Updates

### Regular Maintenance Tasks
1. **Dependency Updates**: Regular npm audit and updates
2. **Security Patches**: Monitor and apply security updates
3. **Performance Review**: Regular performance audits
4. **Backup Verification**: Ensure data backup integrity

### Deployment Pipeline
1. **Development**: Local development and testing
2. **Staging**: Pre-production environment testing
3. **Production**: Automated deployment with rollback capability

## Troubleshooting Guide

### Common Issues
1. **Authentication Failures**: Check Supabase configuration
2. **Build Errors**: Verify Node.js version and dependencies
3. **Performance Issues**: Review network requests and optimizations
4. **Mobile Responsiveness**: Test across different device sizes

### Debug Commands
```bash
# Check build
npm run build

# Analyze bundle
npm run analyze

# Check for issues
npm run lint
npm audit
```

## Support and Documentation

### Internal Documentation
- Component documentation in code comments
- API documentation in server functions
- Database schema documentation

### External Resources
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## Contributing Guidelines

### Development Workflow
1. Create feature branch from main
2. Implement changes with proper testing
3. Submit pull request with detailed description
4. Code review and approval process
5. Merge to main and deploy

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Include proper documentation

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainers**: Development Team