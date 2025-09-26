// Supabase project configuration
// Automatically uses environment variables when available, falls back to demo mode

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const appMode = import.meta.env.VITE_APP_MODE || 'development'
const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true'

// Extract project ID from Supabase URL
export const projectId = envSupabaseUrl ? 
  envSupabaseUrl.split('//')[1]?.split('.')[0] : 
  'demo-project-id'

export const publicAnonKey = envSupabaseAnonKey || 'demo-anon-key'

// Configuration flags
export const isProduction = appMode === 'production'
export const isDevelopment = appMode === 'development'
export const isDebugMode = debugMode
export const hasSupabaseCredentials = !!(envSupabaseUrl && envSupabaseAnonKey)

// Full Supabase URL for client initialization
export const supabaseUrl = envSupabaseUrl || 'https://demo-project.supabase.co'

// Log configuration in development
if (isDevelopment && isDebugMode) {
  console.log('🔧 Supabase Configuration:', {
    projectId: projectId.substring(0, 8) + '...',
    hasCredentials: hasSupabaseCredentials,
    mode: appMode,
    url: supabaseUrl?.substring(0, 30) + '...'
  })
}
