# JV-Flow Local Development Setup Guide

## 🚀 Complete Step-by-Step Setup for Local Development

This guide will help you set up the JV-Flow real estate Joint Venture management system on your local machine for development.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 18.0 or higher** - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **Visual Studio Code** (recommended) - [Download from code.visualstudio.com](https://code.visualstudio.com/)

### Verify Prerequisites

Open your terminal and run:

```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show 9.0.0 or higher
git --version     # Should show git version info
```

## Step 1: Clone and Setup Project

### 1.1 Clone the Repository

```bash
# Navigate to your development folder
cd ~/Documents/Development  # or wherever you keep projects

# Clone the repository
git clone <your-repository-url> jv-flow
cd jv-flow

# Verify the project structure
ls -la  # Should show App.tsx, package.json, etc.
```

### 1.2 Install Dependencies

```bash
# Install all project dependencies
npm install

# If you encounter any permission issues on macOS/Linux:
# sudo npm install --unsafe-perm=true --allow-root

# Alternative with yarn (if you prefer):
# yarn install
```

### 1.3 Verify Installation

```bash
# Check if installation was successful
npm list --depth=0

# Should show all dependencies listed in package.json
```

## Step 2: Environment Configuration

### 2.1 Create Environment File

Create a `.env.local` file in the root directory:

```bash
# Create the environment file
touch .env.local

# Open it in your editor
code .env.local  # or nano .env.local
```

### 2.2 Add Environment Variables

Add the following to your `.env.local` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Development Configuration
VITE_NODE_ENV=development
VITE_APP_ENV=local

# Optional: Firebase Configuration (if using)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id

# Optional: Enable debug mode
VITE_DEBUG=true
```

**Note**: Replace the placeholder values with your actual credentials (see Step 3 for Supabase setup).

## Step 3: Supabase Setup (Backend)

### 3.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in with your GitHub account
3. Click "New Project"
4. Fill in project details:
   - **Name**: `jv-flow-dev`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your location
5. Wait 2-3 minutes for project creation

### 3.2 Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the following:
   - **Project URL** (looks like: `https://xyz.supabase.co`)
   - **Public anon key** (starts with `eyJ...`)
3. Update your `.env.local` file with these values

### 3.3 Setup Database Schema

```bash
# Install Supabase CLI (optional, for advanced users)
npm install -g supabase

# If you want to use the included migrations:
# supabase link --project-ref your-project-id
# supabase db push
```

## Step 4: Start Development Server

### 4.1 Start the Application

```bash
# Start the development server
npm run dev

# Alternative commands:
# npm start           # Also works
# yarn dev            # If using yarn
```

### 4.2 Verify Everything Works

1. **Check the terminal output**:
   ```
   VITE v5.0.0  ready in 1234 ms
   
   ➜  Local:   http://localhost:3000/
   ➜  Network: http://192.168.1.xxx:3000/
   ```

2. **Open your browser**: The app should automatically open at `http://localhost:3000`

3. **Verify the application loads**: You should see the JV-Flow login screen

### 4.3 Test the Application

1. **Check console for errors**: Open browser DevTools (F12) and check the Console tab
2. **Test responsive design**: Use DevTools to test mobile and tablet views
3. **Test internationalization**: Try switching languages if the feature is enabled

## Step 5: Additional Development Tools

### 5.1 Install Recommended VS Code Extensions

Open VS Code and install these extensions:

```
ext install bradlc.vscode-tailwindcss
ext install esbenp.prettier-vscode
ext install ms-vscode.vscode-typescript-next
ext install formulahendry.auto-rename-tag
ext install christian-kohler.path-intellisense
```

### 5.2 Configure VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### 5.3 Add Development Scripts

Your `package.json` already includes useful scripts:

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript

# Testing
npm run test           # Run tests (when implemented)
```

## Step 6: Flowbite Integration (Optional)

To integrate Flowbite design library as requested:

### 6.1 Install Flowbite

```bash
# Install Flowbite
npm install flowbite flowbite-react

# Install Flowbite types (if available)
npm install --save-dev @types/flowbite
```

### 6.2 Configure Tailwind for Flowbite

Create or update `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  plugins: [
    require('flowbite/plugin')
  ]
}
```

### 6.3 Import Flowbite Styles

Add to your `styles/globals.css`:

```css
@import 'flowbite';
```

## Step 7: Project Structure Overview

Understanding the project structure:

```
jv-flow/
├── App.tsx                    # Main application component
├── components/                # React components
│   ├── dashboards/           # Dashboard components
│   ├── forms/                # Form components  
│   ├── ui/                   # UI components (shadcn/ui)
│   ├── mobile/               # Mobile-specific components
│   └── providers/            # Context providers
├── styles/                   # Global styles and Tailwind CSS
├── lib/                      # Utility libraries
├── data/                     # Sample data and types
├── supabase/                 # Database migrations and functions
└── workflows/                # GitHub Actions for deployment
```

## Step 8: Common Development Commands

```bash
# Development Workflow
npm run dev                   # Start development server
npm run build                 # Test production build
npm run preview               # Preview production build locally

# Code Quality
npm run lint                  # Check for linting errors
npm run lint -- --fix        # Auto-fix linting errors
npm run type-check            # Check TypeScript types

# Database (if using Supabase CLI)
npm run db:reset              # Reset database
npm run db:migrate            # Run migrations

# Deployment Testing
npm run build                 # Build for production
npm run preview:firebase      # Test Firebase hosting locally
npm run preview:vercel        # Test Vercel deployment locally
npm run preview:netlify       # Test Netlify deployment locally
```

## Step 9: Troubleshooting Common Issues

### 9.1 Port Already in Use

```bash
# If port 3000 is occupied
npm run dev -- --port 3001

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows - find PID, then taskkill /PID xxxx
```

### 9.2 Node Modules Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

### 9.3 TypeScript Errors

```bash
# Check TypeScript errors
npm run type-check

# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) > "TypeScript: Restart TS Server"
```

### 9.4 Tailwind CSS Not Working

```bash
# Ensure Tailwind is properly installed
npm list tailwindcss

# Check if styles are being generated
npm run build
# Check dist/assets/index-*.css for Tailwind classes
```

### 9.5 Environment Variables Not Loading

1. Ensure `.env.local` file is in the root directory
2. Restart the development server after changing environment variables
3. Make sure all environment variables start with `VITE_`
4. Check that `.env.local` is not ignored in `.gitignore`

## Step 10: Development Best Practices

### 10.1 Code Organization

- Keep components small and focused
- Use TypeScript interfaces for props
- Follow the existing folder structure
- Use absolute imports with the configured aliases

### 10.2 Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the design system in `styles/globals.css`
- Use the provided UI components from `components/ui/`
- Maintain responsive design principles

### 10.3 State Management

- Use React Context for global state
- Keep component state local when possible
- Use the provided providers for shared functionality

### 10.4 Testing Your Changes

```bash
# Before committing, always run:
npm run type-check          # Check for TypeScript errors
npm run lint               # Check for linting issues
npm run build              # Ensure production build works
```

## Step 11: Next Steps

Once you have everything running:

1. **Explore the codebase**: Start with `App.tsx` and follow the component tree
2. **Understand the data flow**: Check the providers and how data moves through the app
3. **Set up your development workflow**: Create branches, make changes, test locally
4. **Read the documentation**: Check `PROJECT_DOCUMENTATION.md` for detailed architecture info
5. **Join the development**: Start with small changes and gradually tackle bigger features

## Success Checklist

- [ ] Node.js 18+ installed and verified
- [ ] Project cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Supabase project created and connected
- [ ] Development server starts without errors
- [ ] Application loads in browser
- [ ] No TypeScript or linting errors
- [ ] VS Code extensions installed
- [ ] Can build for production successfully

## Getting Help

If you encounter issues:

1. **Check the console**: Both terminal and browser console for error messages
2. **Verify environment**: Ensure all environment variables are set correctly
3. **Check dependencies**: Ensure all npm packages are installed correctly
4. **Review documentation**: Check `PROJECT_DOCUMENTATION.md` for more details
5. **Search existing issues**: Look for similar problems in the project documentation

## Development Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Supabase Documentation](https://supabase.com/docs)
- [Flowbite Documentation](https://flowbite.com/docs/getting-started/introduction/)

---

**Happy coding!** 🚀 You're now ready to develop the JV-Flow application locally.