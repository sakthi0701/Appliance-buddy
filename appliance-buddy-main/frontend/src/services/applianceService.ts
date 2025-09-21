import { supabase } from '@/lib/supabase'
import { Appliance, SupportContact, MaintenanceTask, LinkedDocument } from '../../../shared/types/appliance'
import { Database } from '../../../shared/types/database'

type DbAppliance = Database['public']['Tables']['appliances']['Row']
type DbSupportContact = Database['public']['Tables']['support_contacts']['Row']
type DbMaintenanceTask = Database['public']['Tables']['maintenance_tasks']['Row']
type DbLinkedDocument = Database['public']['Tables']['linked_documents']['Row']

// Transform database rows to frontend types
const transformDbAppliance = (
  dbAppliance: DbAppliance,
  supportContacts: DbSupportContact[] = [],
  maintenanceTasks: DbMaintenanceTask[] = [],
  linkedDocuments: DbLinkedDocument[] = []
): Appliance => ({
  id: dbAppliance.id,
  name: dbAppliance.name,
  brand: dbAppliance.brand,
  model: dbAppliance.model,
  purchaseDate: new Date(dbAppliance.purchase_date),
  warrantyDurationMonths: dbAppliance.warranty_duration_months,
  serialNumber: dbAppliance.serial_number || undefined,
  purchaseLocation: dbAppliance.purchase_location || undefined,
  notes: dbAppliance.notes || undefined,
  userId: dbAppliance.user_id,
  createdAt: new Date(dbAppliance.created_at),
  updatedAt: new Date(dbAppliance.updated_at),
  supportContacts: supportContacts.map(sc => ({
    id: sc.id,
    applianceId: sc.appliance_id,
    name: sc.name,
    company: sc.company || undefined,
    phone: sc.phone || undefined,
    email: sc.email || undefined,
    website: sc.website || undefined,
    notes: sc.notes || undefined,
    createdAt: new Date(sc.created_at)
  })),
  maintenanceTasks: maintenanceTasks.map(mt => ({
    id: mt.id,
    applianceId: mt.appliance_id,
    taskName: mt.task_name,
    scheduledDate: new Date(mt.scheduled_date),
    frequency: mt.frequency,
    serviceProvider: mt.service_provider_name ? {
      name: mt.service_provider_name,
      phone: mt.service_provider_phone || undefined,
      email: mt.service_provider_email || undefined,
      notes: mt.service_provider_notes || undefined
    } : undefined,
    notes: mt.notes || undefined,
    status: mt.status,
    completedDate: mt.completed_date ? new Date(mt.completed_date) : undefined,
    createdAt: new Date(mt.created_at)
  })),
  linkedDocuments: linkedDocuments.map(ld => ({
    id: ld.id,
    applianceId: ld.appliance_id,
    title: ld.title,
    url: ld.url,
    createdAt: new Date(ld.created_at)
  }))
})

// Transform frontend types to database inserts
const transformApplianceToDb = (appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments' | 'createdAt' | 'updatedAt'>, userId: string): Database['public']['Tables']['appliances']['Insert'] => ({
  name: appliance.name,
  brand: appliance.brand,
  model: appliance.model,
  purchase_date: appliance.purchaseDate.toISOString().split('T')[0],
  warranty_duration_months: appliance.warrantyDurationMonths,
  serial_number: appliance.serialNumber || null,
  purchase_location: appliance.purchaseLocation || null,
  notes: appliance.notes || null,
  user_id: userId
})

export class ApplianceService {
  static async getAppliances(): Promise<Appliance[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data: appliances, error: appliancesError } = await supabase
      .from('appliances')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (appliancesError) throw appliancesError

    // Get related data for all appliances
    const applianceIds = appliances.map(a => a.id)
    
    const [supportContactsResult, maintenanceTasksResult, linkedDocumentsResult] = await Promise.all([
      supabase.from('support_contacts').select('*').in('appliance_id', applianceIds),
      supabase.from('maintenance_tasks').select('*').in('appliance_id', applianceIds),
      supabase.from('linked_documents').select('*').in('appliance_id', applianceIds)
    ])

    if (supportContactsResult.error) throw supportContactsResult.error
    if (maintenanceTasksResult.error) throw maintenanceTasksResult.error
    if (linkedDocumentsResult.error) throw linkedDocumentsResult.error

    // Group related data by appliance ID
    const supportContactsByAppliance = supportContactsResult.data.reduce((acc, sc) => {
      if (!acc[sc.appliance_id]) acc[sc.appliance_id] = []
      acc[sc.appliance_id].push(sc)
      return acc
    }, {} as Record<string, DbSupportContact[]>)

    const maintenanceTasksByAppliance = maintenanceTasksResult.data.reduce((acc, mt) => {
      if (!acc[mt.appliance_id]) acc[mt.appliance_id] = []
      acc[mt.appliance_id].push(mt)
      return acc
    }, {} as Record<string, DbMaintenanceTask[]>)

    const linkedDocumentsByAppliance = linkedDocumentsResult.data.reduce((acc, ld) => {
      if (!acc[ld.appliance_id]) acc[ld.appliance_id] = []
      acc[ld.appliance_id].push(ld)
      return acc
    }, {} as Record<string, DbLinkedDocument[]>)

    return appliances.map(appliance => 
      transformDbAppliance(
        appliance,
        supportContactsByAppliance[appliance.id] || [],
        maintenanceTasksByAppliance[appliance.id] || [],
        linkedDocumentsByAppliance[appliance.id] || []
      )
    )
  }

  static async createAppliance(appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments' | 'createdAt' | 'updatedAt'>): Promise<Appliance> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('appliances')
      .insert(transformApplianceToDb(appliance, user.id))
      .select()
      .single()

    if (error) throw error

    return transformDbAppliance(data)
  }

  static async updateAppliance(id: string, updates: Partial<Appliance>): Promise<Appliance> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const dbUpdates: Database['public']['Tables']['appliances']['Update'] = {}

    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.brand !== undefined) dbUpdates.brand = updates.brand
    if (updates.model !== undefined) dbUpdates.model = updates.model
    if (updates.purchaseDate !== undefined) dbUpdates.purchase_date = updates.purchaseDate.toISOString().split('T')[0]
    if (updates.warrantyDurationMonths !== undefined) dbUpdates.warranty_duration_months = updates.warrantyDurationMonths
    if (updates.serialNumber !== undefined) dbUpdates.serial_number = updates.serialNumber || null
    if (updates.purchaseLocation !== undefined) dbUpdates.purchase_location = updates.purchaseLocation || null
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null

    const { data, error } = await supabase
      .from('appliances')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    // Get updated appliance with related data
    const appliances = await this.getAppliances()
    const updatedAppliance = appliances.find(a => a.id === id)
    if (!updatedAppliance) throw new Error('Appliance not found after update')

    return updatedAppliance
  }

  static async deleteAppliance(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('appliances')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  // Support Contacts
  static async addSupportContact(applianceId: string, contact: Omit<SupportContact, 'id' | 'applianceId' | 'createdAt'>): Promise<SupportContact> {
    const { data, error } = await supabase
      .from('support_contacts')
      .insert({
        appliance_id: applianceId,
        name: contact.name,
        company: contact.company || null,
        phone: contact.phone || null,
        email: contact.email || null,
        website: contact.website || null,
        notes: contact.notes || null
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      applianceId: data.appliance_id,
      name: data.name,
      company: data.company || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      website: data.website || undefined,
      notes: data.notes || undefined,
      createdAt: new Date(data.created_at)
    }
  }

  static async updateSupportContact(id: string, updates: Partial<SupportContact>): Promise<SupportContact> {
    const dbUpdates: Database['public']['Tables']['support_contacts']['Update'] = {}

    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.company !== undefined) dbUpdates.company = updates.company || null
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone || null
    if (updates.email !== undefined) dbUpdates.email = updates.email || null
    if (updates.website !== undefined) dbUpdates.website = updates.website || null
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null

    const { data, error } = await supabase
      .from('support_contacts')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      applianceId: data.appliance_id,
      name: data.name,
      company: data.company || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      website: data.website || undefined,
      notes: data.notes || undefined,
      createdAt: new Date(data.created_at)
    }
  }

  static async deleteSupportContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('support_contacts')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Maintenance Tasks
  static async addMaintenanceTask(applianceId: string, task: Omit<MaintenanceTask, 'id' | 'createdAt'>): Promise<MaintenanceTask> {
    const { data, error } = await supabase
      .from('maintenance_tasks')
      .insert({
        appliance_id: applianceId,
        task_name: task.taskName,
        scheduled_date: task.scheduledDate.toISOString().split('T')[0],
        frequency: task.frequency,
        service_provider_name: task.serviceProvider?.name || null,
        service_provider_phone: task.serviceProvider?.phone || null,
        service_provider_email: task.serviceProvider?.email || null,
        service_provider_notes: task.serviceProvider?.notes || null,
        notes: task.notes || null,
        status: task.status,
        completed_date: task.completedDate ? task.completedDate.toISOString().split('T')[0] : null
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      applianceId: data.appliance_id,
      taskName: data.task_name,
      scheduledDate: new Date(data.scheduled_date),
      frequency: data.frequency,
      serviceProvider: data.service_provider_name ? {
        name: data.service_provider_name,
        phone: data.service_provider_phone || undefined,
        email: data.service_provider_email || undefined,
        notes: data.service_provider_notes || undefined
      } : undefined,
      notes: data.notes || undefined,
      status: data.status,
      completedDate: data.completed_date ? new Date(data.completed_date) : undefined,
      createdAt: new Date(data.created_at)
    }
  }

  static async updateMaintenanceTask(id: string, updates: Partial<MaintenanceTask>): Promise<MaintenanceTask> {
    const dbUpdates: Database['public']['Tables']['maintenance_tasks']['Update'] = {}

    if (updates.taskName !== undefined) dbUpdates.task_name = updates.taskName
    if (updates.scheduledDate !== undefined) dbUpdates.scheduled_date = updates.scheduledDate.toISOString().split('T')[0]
    if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency
    if (updates.serviceProvider !== undefined) {
      dbUpdates.service_provider_name = updates.serviceProvider?.name || null
      dbUpdates.service_provider_phone = updates.serviceProvider?.phone || null
      dbUpdates.service_provider_email = updates.serviceProvider?.email || null
      dbUpdates.service_provider_notes = updates.serviceProvider?.notes || null
    }
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.completedDate !== undefined) dbUpdates.completed_date = updates.completedDate ? updates.completedDate.toISOString().split('T')[0] : null

    const { data, error } = await supabase
      .from('maintenance_tasks')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      applianceId: data.appliance_id,
      taskName: data.task_name,
      scheduledDate: new Date(data.scheduled_date),
      frequency: data.frequency,
      serviceProvider: data.service_provider_name ? {
        name: data.service_provider_name,
        phone: data.service_provider_phone || undefined,
        email: data.service_provider_email || undefined,
        notes: data.service_provider_notes || undefined
      } : undefined,
      notes: data.notes || undefined,
      status: data.status,
      completedDate: data.completed_date ? new Date(data.completed_date) : undefined,
      createdAt: new Date(data.created_at)
    }
  }

  static async deleteMaintenanceTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('maintenance_tasks')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Linked Documents
  static async addLinkedDocument(applianceId: string, document: Omit<LinkedDocument, 'id' | 'applianceId' | 'createdAt'>): Promise<LinkedDocument> {
    const { data, error } = await supabase
      .from('linked_documents')
      .insert({
        appliance_id: applianceId,
        title: document.title,
        url: document.url
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      applianceId: data.appliance_id,
      title: data.title,
      url: data.url,
      createdAt: new Date(data.created_at)
    }
  }

  static async updateLinkedDocument(id: string, updates: Partial<LinkedDocument>): Promise<LinkedDocument> {
    const dbUpdates: Database['public']['Tables']['linked_documents']['Update'] = {}

    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.url !== undefined) dbUpdates.url = updates.url

    const { data, error } = await supabase
      .from('linked_documents')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      applianceId: data.appliance_id,
      title: data.title,
      url: data.url,
      createdAt: new Date(data.created_at)
    }
  }

  static async deleteLinkedDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('linked_documents')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}