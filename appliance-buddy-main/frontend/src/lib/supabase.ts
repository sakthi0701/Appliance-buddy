import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../shared/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey,
  keyPreview: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'undefined',
  origin: typeof window !== 'undefined' ? window.location.origin : 'server',
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
})

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase Environment Variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'undefined',
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD
  })
  throw new Error('Missing Supabase environment variables. Please check your environment configuration.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    // Add debug information for auth requests
    debug: import.meta.env.DEV,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helpers
export const auth = supabase.auth

// Database helpers
export const db = supabase.from