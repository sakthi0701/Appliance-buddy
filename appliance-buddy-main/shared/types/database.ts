export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appliances: {
        Row: {
          id: string
          name: string
          brand: string
          model: string
          purchase_date: string
          warranty_duration_months: number
          serial_number: string | null
          purchase_location: string | null
          notes: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          model: string
          purchase_date: string
          warranty_duration_months: number
          serial_number?: string | null
          purchase_location?: string | null
          notes?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          model?: string
          purchase_date?: string
          warranty_duration_months?: number
          serial_number?: string | null
          purchase_location?: string | null
          notes?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appliances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      support_contacts: {
        Row: {
          id: string
          appliance_id: string
          name: string
          company: string | null
          phone: string | null
          email: string | null
          website: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          appliance_id: string
          name: string
          company?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          appliance_id?: string
          name?: string
          company?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_contacts_appliance_id_fkey"
            columns: ["appliance_id"]
            isOneToOne: false
            referencedRelation: "appliances"
            referencedColumns: ["id"]
          }
        ]
      }
      maintenance_tasks: {
        Row: {
          id: string
          appliance_id: string
          task_name: string
          scheduled_date: string
          frequency: 'One-time' | 'Monthly' | 'Yearly' | 'Custom'
          service_provider_name: string | null
          service_provider_phone: string | null
          service_provider_email: string | null
          service_provider_notes: string | null
          notes: string | null
          status: 'Upcoming' | 'Completed' | 'Overdue'
          completed_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          appliance_id: string
          task_name: string
          scheduled_date: string
          frequency: 'One-time' | 'Monthly' | 'Yearly' | 'Custom'
          service_provider_name?: string | null
          service_provider_phone?: string | null
          service_provider_email?: string | null
          service_provider_notes?: string | null
          notes?: string | null
          status?: 'Upcoming' | 'Completed' | 'Overdue'
          completed_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          appliance_id?: string
          task_name?: string
          scheduled_date?: string
          frequency?: 'One-time' | 'Monthly' | 'Yearly' | 'Custom'
          service_provider_name?: string | null
          service_provider_phone?: string | null
          service_provider_email?: string | null
          service_provider_notes?: string | null
          notes?: string | null
          status?: 'Upcoming' | 'Completed' | 'Overdue'
          completed_date?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tasks_appliance_id_fkey"
            columns: ["appliance_id"]
            isOneToOne: false
            referencedRelation: "appliances"
            referencedColumns: ["id"]
          }
        ]
      }
      linked_documents: {
        Row: {
          id: string
          appliance_id: string
          title: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          appliance_id: string
          title: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          appliance_id?: string
          title?: string
          url?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "linked_documents_appliance_id_fkey"
            columns: ["appliance_id"]
            isOneToOne: false
            referencedRelation: "appliances"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}