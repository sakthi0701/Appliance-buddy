import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../shared/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Auth helpers
export const auth = supabase.auth

// Database helpers
export const db = supabase.from