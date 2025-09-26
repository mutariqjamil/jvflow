# Environment Setup Guide - JV-Flow

This guide explains how to properly configure your environment variables for the JV-Flow application, enabling seamless switching between development, staging, and production environments.

## 🔧 Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your Supabase credentials:**
   ```env
   # Required Supabase Configuration
   VITE_SUPABASE_URL=your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   
   # App Configuration
   VITE_APP_MODE=development
   VITE_DEBUG_MODE=true
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📁 Environment Files

### `.env.local` (Your Development Environment)
This file contains your actual development credentials and should **never be committed to git**:

```env
# Supabase Development Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_MODE=development
VITE_DEBUG_MODE=true
```

### `.env.example` (Template)
This is a template file that shows what environment variables are needed:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration  
VITE_APP_MODE=development
VITE_DEBUG_MODE=false
```

### `.env.production` (Production Environment)
For production deployments:

```env
# Supabase Production Configuration
VITE_SUPABASE_URL=https://your-prod-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# App Configuration
VITE_APP_MODE=production
VITE_DEBUG_MODE=false
```

## 🔑 Environment Variables Explained

### Required Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdef123456.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiIs...` |

### Optional Variables

| Variable | Purpose | Default | Options |
|----------|---------|---------|---------|
| `VITE_APP_MODE` | Application environment mode | `development` | `development`, `staging`, `production` |
| `VITE_DEBUG_MODE` | Enable debug logging | `false` | `true`, `false` |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Admin-level Supabase key | - | For admin operations |

## 🏗️ How It Works

The application automatically detects and configures itself based on your environment variables:

### Demo Mode (No Environment Variables)
- Uses mock Supabase client
- Shows demo data
- All database operations are simulated
- Perfect for testing the UI without a database

### Development Mode (Environment Variables Present)
- Connects to real Supabase instance
- Enables debug logging (if `VITE_DEBUG_MODE=true`)
- Uses development database
- Hot reload and debugging features active

### Production Mode (`VITE_APP_MODE=production`)
- Optimized for performance
- Debug logging disabled
- Production database connection
- Error handling optimized for end users

## 🔍 Debugging Environment Issues

### Check Current Configuration

The app logs your current configuration in development mode. Look for these console messages:

```
🔧 Supabase Configuration: {
  projectId: "abcdef12...",
  hasCredentials: true,
  mode: "development",
  url: "https://abcdef123456.supabase..."
}

🔌 Supabase Client Setup: {
  hasCredentials: true,
  projectId: "abcdef12...",
  urlConfigured: true
}
```

### Common Issues

1. **"Running in demo mode" warning:**
   - Your environment variables are not properly set
   - Check that your `.env.local` file exists and has the correct variable names (starting with `VITE_`)

2. **"Failed to connect to Supabase" error:**
   - Your Supabase URL or anon key might be incorrect
   - Verify your credentials in the Supabase dashboard
   - Ensure your Supabase project is not paused

3. **Environment variables not loading:**
   - Make sure your environment file is named correctly (`.env.local`, not `.env`)
   - All variables must start with `VITE_` to be accessible in the browser
   - Restart your development server after changing environment variables

### Testing Your Configuration

Use the built-in test suites in the Super Admin area:

1. Navigate to Super Admin → System tab
2. Click "Test Supabase Connectivity" to verify database connection
3. Click "Comprehensive UI Test" to verify the entire application

## 🚀 Deployment Configurations

### Vercel Deployment
Add environment variables in your Vercel project settings:
- Go to your Vercel project dashboard
- Navigate to Settings → Environment Variables
- Add each `VITE_*` variable with appropriate values for each environment

### Netlify Deployment  
Add environment variables in your Netlify site settings:
- Go to Site settings → Environment variables
- Add each `VITE_*` variable
- Ensure production values are used for production deployments

### Docker Deployment
Create environment-specific Docker files:

```dockerfile
# Use build args for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_APP_MODE=production

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_APP_MODE=$VITE_APP_MODE
```

## 🔒 Security Best Practices

1. **Never commit real credentials:**
   - Add `.env.local` to your `.gitignore`
   - Use different credentials for development vs. production
   - Regularly rotate your Supabase keys

2. **Use appropriate key types:**
   - Use **anon/public key** for client-side operations
   - Use **service role key** only for admin/server operations
   - Never expose service role keys in client-side code

3. **Environment separation:**
   - Use separate Supabase projects for development and production
   - Use different database schemas/configurations per environment
   - Implement proper Row Level Security (RLS) policies

## 📞 Getting Support

If you encounter issues with environment setup:

1. Check the console for configuration debug messages
2. Use the built-in Supabase connectivity test
3. Verify your Supabase project settings and keys
4. Ensure all environment variables start with `VITE_`
5. Restart your development server after making changes

The application is designed to gracefully handle missing or incorrect environment variables by falling back to demo mode, so you can always run the application and test the UI even without a properly configured database.