#!/bin/bash

# JV-Flow Demo Setup Script
# This script sets up the complete demo environment with sample data

set -e

echo "🚀 Setting up JV-Flow Demo Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    echo "🔍 Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_status "Node.js $(node --version) found"
    print_status "npm $(npm --version) found"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    npm install
    print_status "Dependencies installed successfully"
}

# Setup environment
setup_environment() {
    echo "⚙️ Setting up environment..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_warning "Created .env.local from .env.example"
            print_warning "Please update .env.local with your Supabase credentials"
        else
            print_error ".env.example not found. Please create .env.local manually."
            exit 1
        fi
    else
        print_status "Environment file already exists"
    fi
}

# Check Supabase configuration
check_supabase() {
    echo "🗄️ Checking Supabase configuration..."
    
    if [ ! -f ".env.local" ]; then
        print_error ".env.local not found. Please create it first."
        exit 1
    fi
    
    # Source the environment file
    source .env.local
    
    if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
        print_error "Supabase environment variables not set in .env.local"
        print_warning "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
        exit 1
    fi
    
    print_status "Supabase configuration found"
}

# Build the application
build_application() {
    echo "🔨 Building application..."
    
    npm run build
    print_status "Application built successfully"
}

# Setup demo data information
setup_demo_info() {
    echo "📊 Demo Data Information..."
    
    print_status "Demo organization: Prime Real Estate Ventures"
    print_status "Demo users:"
    echo "   • john.manager@primerealestate.com (Project Manager)"
    echo "   • sarah.sales@primerealestate.com (Sales Executive)"
    echo "   • mike.finance@primerealestate.com (Finance Manager)"
    
    print_status "Demo projects:"
    echo "   • Sunset Heights Residency (Residential - 65% complete)"
    echo "   • Metro Business Center (Commercial - 15% complete)"
    
    print_status "Sample data includes:"
    echo "   • 3 expenses (1 pending approval)"
    echo "   • 2 confirmed bookings"
    echo "   • 2 vendors and materials"
    echo "   • 1 purchase order"
    echo "   • Marketing campaigns"
    echo "   • Notifications and activity logs"
}

# Main setup function
main() {
    echo "=========================================="
    echo "🏢 JV-Flow Demo Environment Setup"
    echo "=========================================="
    echo ""
    
    check_requirements
    echo ""
    
    install_dependencies
    echo ""
    
    setup_environment
    echo ""
    
    check_supabase
    echo ""
    
    build_application
    echo ""
    
    setup_demo_info
    echo ""
    
    echo "=========================================="
    echo "🎉 Demo setup completed successfully!"
    echo "=========================================="
    echo ""
    print_status "Next steps:"
    echo "1. Ensure your Supabase database has the demo data"
    echo "   Run: supabase db reset (if using Supabase CLI)"
    echo "   Or manually run the SQL scripts in /supabase/migrations/"
    echo ""
    echo "2. Start the development server:"
    echo "   npm run dev"
    echo ""
    echo "3. Or deploy to your preferred platform:"
    echo "   npm run deploy:firebase"
    echo "   npm run deploy:vercel"
    echo "   npm run deploy:netlify"
    echo ""
    print_status "Demo is ready! 🚀"
}

# Run main function
main