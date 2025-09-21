import { createClient } from '@supabase/supabase-js'
// import { Database } from '../../../shared/types/database'

// For now, we'll use a basic type definition
// TODO: Import proper database types from shared folder
type Database = any

// Initialize Supabase client with service role key for backend operations
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase environment variables not configured. Backend will run in mock mode.')
}

export const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey)
  : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null
}

// Appliance service functions
export class ApplianceBackendService {
  static async getAllAppliances(userId: string) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('appliances')
      .select(`
        *,
        support_contacts(*),
        maintenance_tasks(*),
        linked_documents(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async createAppliance(userId: string, applianceData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('appliances')
      .insert({
        ...applianceData,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateAppliance(userId: string, applianceId: string, updates: any) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('appliances')
      .update(updates)
      .eq('id', applianceId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteAppliance(userId: string, applianceId: string) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase
      .from('appliances')
      .delete()
      .eq('id', applianceId)
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  }
}