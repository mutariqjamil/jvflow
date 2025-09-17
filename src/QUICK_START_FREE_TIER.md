# JV-Flow Free Tier Quick Start Guide

## 🚀 Deploy in 15 Minutes

This guide will get your JV-Flow application deployed for **FREE** using Firebase Hosting + Supabase.

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account (for automated deployments)

## Step 1: Clone and Setup

```bash
# Clone your repository
git clone <your-repo-url>
cd jv-flow

# Install dependencies
npm install

# Test local build
npm run build
```

## Step 2: Setup Supabase (Free - 500MB DB)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub
   - Click "New Project"
   - Choose a name (e.g., "jv-flow-bootstrap")
   - Set password and region
   - Wait 2-3 minutes for setup

2. **Get Your Keys**
   - Go to Settings > API
   - Copy your Project URL and Public Anon Key
   - Save these - you'll need them!

## Step 3: Setup Firebase Hosting (Free - 10GB bandwidth)

1. **Create Firebase Project**
   - Go to [console.firebase.google.com](https://console.firebase.google.com)
   - Click "Create a project"
   - Name it (e.g., "jv-flow-app")
   - Disable Google Analytics (for simplicity)
   - Wait for project creation

2. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```
   
   Select:
   - Use existing project → Choose your project
   - Public directory: `dist`
   - Single-page app: `Yes`
   - Automatic builds: `No`

## Step 4: Configure Environment

Create `.env.local` file:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 5: Test Locally

```bash
# Start development server
npm run dev

# Test production build
npm run build
npm run preview
```

## Step 6: Deploy to Firebase

```bash
# Build and deploy
npm run deploy:firebase
```

Your app will be live at: `https://your-project-id.web.app`

## Step 7: Setup Automated Deployments (Optional)

1. **Generate Firebase Service Account**
   - Go to Firebase Console > Project Settings
   - Service Accounts tab
   - Click "Generate new private key"
   - Save the JSON file

2. **Add GitHub Secrets**
   - Go to your GitHub repo > Settings > Secrets
   - Add these secrets:
     ```
     VITE_SUPABASE_URL: your-supabase-url
     VITE_SUPABASE_ANON_KEY: your-supabase-anon-key
     FIREBASE_SERVICE_ACCOUNT: (paste entire JSON content)
     FIREBASE_PROJECT_ID: your-firebase-project-id
     ```

3. **Enable Workflows**
   - The `.github/workflows/deploy-free-tier.yml` will automatically deploy on push to main

## Free Tier Limits

### Supabase Free Tier
- ✅ 500MB database storage
- ✅ 50k monthly active users
- ✅ 5GB bandwidth per month
- ✅ 500k edge function invocations
- ✅ 1GB file storage

### Firebase Free Tier
- ✅ 10GB hosting storage
- ✅ 10GB bandwidth per month
- ✅ Custom domain support
- ✅ SSL certificates
- ✅ Global CDN

### GitHub Actions Free Tier
- ✅ 2,000 minutes per month
- ✅ Unlimited public repositories

## Cost Breakdown

| Service | Monthly Cost | Usage Limit |
|---------|-------------|-------------|
| Supabase | $0 | 50k active users |
| Firebase Hosting | $0 | 10GB bandwidth |
| GitHub Actions | $0 | 2,000 build minutes |
| **Total** | **$0** | **Perfect for MVP** |

## Alternative Free Options

### Option B: Vercel (if you prefer)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option C: Netlify (if you prefer)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## Scaling Timeline

### Phase 1: Bootstrap (0-1,000 users)
- **Cost**: $0/month
- **Services**: Firebase + Supabase free tiers
- **Capacity**: 50k active users, 10GB bandwidth

### Phase 2: Growing (1,000-10,000 users)
- **Cost**: $25-50/month
- **Upgrade**: Supabase Pro plan
- **Capacity**: Unlimited users, 100GB bandwidth

### Phase 3: Scale (10,000+ users)
- **Cost**: $100-300/month
- **Services**: Add CDN, monitoring, analytics
- **Capacity**: Enterprise-ready

## Common Issues & Solutions

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working
- Double-check your `.env.local` file
- Ensure variables start with `VITE_`
- Restart development server after changes

### Supabase Connection Issues
- Verify your URL and key are correct
- Check Supabase project status
- Ensure you're using the public anon key, not service role key

### Firebase Deployment Fails
```bash
# Re-authenticate
firebase logout
firebase login
firebase use --add
```

## Quick Commands Reference

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run preview            # Preview production build

# Deployment
npm run deploy:firebase    # Deploy to Firebase
npm run deploy:vercel     # Deploy to Vercel
npm run deploy:netlify    # Deploy to Netlify

# Utilities
npm run type-check        # Check TypeScript
npm run lint              # Lint code
```

## Success Checklist

- [ ] Supabase project created and configured
- [ ] Firebase project created and configured
- [ ] Environment variables set
- [ ] Local development working
- [ ] Production build successful
- [ ] Deployed to Firebase successfully
- [ ] Application accessible via web URL
- [ ] Authentication working
- [ ] Database operations working

## Support

If you encounter issues:

1. Check the logs in Firebase Console
2. Verify Supabase project status
3. Test locally first with `npm run dev`
4. Check environment variables are set correctly

## Next Steps

Once deployed, you can:

1. **Add a custom domain** (free with Firebase)
2. **Set up monitoring** with Google Analytics
3. **Enable PWA features** for mobile experience
4. **Add error tracking** with Sentry (free tier available)
5. **Scale gradually** as your user base grows

---

**Congratulations!** 🎉 Your JV-Flow application is now live and running on a completely free tier setup that can handle significant traffic and users before you need to upgrade.

**Live URL**: `https://your-project-id.web.app`
**Admin Panel**: `https://console.firebase.google.com`
**Database**: `https://app.supabase.com`