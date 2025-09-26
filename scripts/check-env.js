#!/usr/bin/env node

/**
 * Environment Configuration Checker for JV-Flow
 * 
 * This script helps validate your environment setup and provides
 * helpful feedback about your Supabase configuration.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
  divider: () => console.log(`${colors.blue}${'─'.repeat(60)}${colors.reset}`)
};

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function readEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    
    content.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    return env;
  } catch (error) {
    return null;
  }
}

function validateSupabaseUrl(url) {
  if (!url) return { valid: false, message: 'URL is missing' };
  
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.endsWith('.supabase.co')) {
      const projectId = parsedUrl.hostname.split('.')[0];
      return { 
        valid: true, 
        projectId,
        message: `Valid Supabase URL for project: ${projectId}` 
      };
    } else {
      return { 
        valid: false, 
        message: 'URL does not appear to be a valid Supabase URL' 
      };
    }
  } catch (error) {
    return { 
      valid: false, 
      message: 'Invalid URL format' 
    };
  }
}

function validateAnonKey(key) {
  if (!key) return { valid: false, message: 'Anon key is missing' };
  
  if (key === 'your-anon-key-here' || key === 'demo-anon-key') {
    return { 
      valid: false, 
      message: 'Using placeholder anon key - replace with your actual key' 
    };
  }
  
  // Basic JWT validation (starts with eyJ)
  if (key.startsWith('eyJ')) {
    return { 
      valid: true, 
      message: 'Valid JWT format' 
    };
  } else {
    return { 
      valid: false, 
      message: 'Does not appear to be a valid JWT token' 
    };
  }
}

function main() {
  log.header('🔧 JV-Flow Environment Configuration Checker');
  
  const projectRoot = process.cwd();
  const envLocalPath = path.join(projectRoot, '.env.local');
  const envExamplePath = path.join(projectRoot, '.env.example');
  
  // Check for environment files
  log.info('Checking environment files...');
  log.divider();
  
  if (checkFileExists(envExamplePath)) {
    log.success('.env.example file found');
  } else {
    log.error('.env.example file missing');
  }
  
  if (checkFileExists(envLocalPath)) {
    log.success('.env.local file found');
  } else {
    log.warning('.env.local file not found');
    log.info('To get started, copy .env.example to .env.local and fill in your credentials');
    return;
  }
  
  // Read and validate environment variables
  log.header('📋 Environment Variables Analysis');
  
  const envConfig = readEnvFile(envLocalPath);
  
  if (!envConfig) {
    log.error('Failed to read .env.local file');
    return;
  }
  
  // Required variables
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  // Optional variables
  const optionalVars = [
    'VITE_APP_MODE',
    'VITE_DEBUG_MODE',
    'VITE_SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  let hasAllRequired = true;
  
  // Check required variables
  log.info('Required Environment Variables:');
  requiredVars.forEach(varName => {
    if (envConfig[varName]) {
      log.success(`${varName}: Present`);
    } else {
      log.error(`${varName}: Missing`);
      hasAllRequired = false;
    }
  });
  
  log.divider();
  log.info('Optional Environment Variables:');
  optionalVars.forEach(varName => {
    if (envConfig[varName]) {
      log.success(`${varName}: ${envConfig[varName]}`);
    } else {
      log.info(`${varName}: Not set (using default)`);
    }
  });
  
  // Validate Supabase configuration
  log.header('🔍 Supabase Configuration Validation');
  
  const supabaseUrl = envConfig['VITE_SUPABASE_URL'];
  const supabaseAnonKey = envConfig['VITE_SUPABASE_ANON_KEY'];
  
  // Validate URL
  const urlValidation = validateSupabaseUrl(supabaseUrl);
  if (urlValidation.valid) {
    log.success(`Supabase URL: ${urlValidation.message}`);
  } else {
    log.error(`Supabase URL: ${urlValidation.message}`);
  }
  
  // Validate Anon Key
  const keyValidation = validateAnonKey(supabaseAnonKey);
  if (keyValidation.valid) {
    log.success(`Anon Key: ${keyValidation.message}`);
  } else {
    log.error(`Anon Key: ${keyValidation.message}`);
  }
  
  // Overall status
  log.header('📊 Configuration Status');
  
  const isConfigured = hasAllRequired && urlValidation.valid && keyValidation.valid;
  
  if (isConfigured) {
    log.success('Environment is properly configured!');
    log.info('Your app will connect to Supabase with your credentials');
    log.info('Start your development server with: npm run dev');
  } else {
    log.warning('Environment configuration incomplete');
    log.info('Your app will run in demo mode with mock data');
    log.info('Fix the issues above to connect to your Supabase database');
  }
  
  // App mode information
  const appMode = envConfig['VITE_APP_MODE'] || 'development';
  const debugMode = envConfig['VITE_DEBUG_MODE'] === 'true';
  
  log.divider();
  log.info(`App Mode: ${appMode}`);
  log.info(`Debug Mode: ${debugMode ? 'Enabled' : 'Disabled'}`);
  
  if (debugMode) {
    log.info('Debug mode is enabled - you will see detailed logs in the console');
  }
  
  log.header('🚀 Next Steps');
  
  if (!isConfigured) {
    log.info('1. Get your Supabase credentials from https://supabase.com/dashboard');
    log.info('2. Update your .env.local file with the correct values');
    log.info('3. Run this script again to verify your configuration');
    log.info('4. Start your development server with: npm run dev');
  } else {
    log.info('1. Start your development server with: npm run dev');
    log.info('2. Test Supabase connectivity using the Admin area');
    log.info('3. Check the browser console for configuration logs');
  }
  
  console.log('\n');
}

if (require.main === module) {
  main();
}

module.exports = { main };