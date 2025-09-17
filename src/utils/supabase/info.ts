// Supabase project configuration
// In demo mode, these are placeholder values
export const projectId = 'demo-project-id'
export const publicAnonKey = 'demo-anon-key'

// For production, these should be loaded from environment variables:
// export const projectId = import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'demo-project-id'
// export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key'