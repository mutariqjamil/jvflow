import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from '../utils/supabase/info'

// Use the provided Supabase configuration
const supabaseUrl = `https://${projectId}.supabase.co`
const supabaseKey = publicAnonKey

// Create a mock supabase client for demo mode
const mockSupabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ error: null }),
    signOut: () => Promise.resolve({ error: null })
  }
}

// Connect to Supabase by default with provided credentials
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : mockSupabase
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey)

export type UserRole = 'investor' | 'builder' | 'marketing' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  avatar_url?: string
}

export interface Project {
  id: string
  name: string
  description: string
  total_budget: number
  cash_balance: number
  total_invested: number
  total_expenses: number
  total_revenue: number
  status: 'active' | 'completed' | 'on_hold'
  created_at: string
}

export interface Expense {
  id: string
  project_id: string
  category: string
  amount: number
  description: string
  vendor: string
  status: 'pending' | 'approved' | 'rejected'
  created_by: string
  approved_by?: string
  receipt_url?: string
  created_at: string
}

export interface Sale {
  id: string
  project_id: string
  unit_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  total_amount: number
  down_payment: number
  installment_plan: any
  status: 'pending' | 'booked' | 'completed'
  agent_id: string
  commission_rate: number
  created_at: string
}

export interface Commission {
  id: string
  agent_id: string
  sale_id: string
  amount: number
  status: 'pending' | 'paid'
  paid_at?: string
}