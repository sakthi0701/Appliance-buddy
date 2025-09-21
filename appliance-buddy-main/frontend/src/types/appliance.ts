export interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
  purchaseDate: Date;
  warrantyDurationMonths: number;
  serialNumber?: string;
  purchaseLocation?: string;
  notes?: string;
  userId?: string;
  supportContacts: SupportContact[];
  maintenanceTasks: MaintenanceTask[];
  linkedDocuments: LinkedDocument[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SupportContact {
  id: string;
  applianceId?: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
  createdAt?: Date;
}

export interface MaintenanceTask {
  id: string;
  applianceId: string;
  taskName: string;
  scheduledDate: Date;
  frequency: 'One-time' | 'Monthly' | 'Yearly' | 'Custom';
  serviceProvider?: {
    name: string;
    phone?: string;
    email?: string;
    notes?: string;
  };
  notes?: string;
  status: 'Upcoming' | 'Completed' | 'Overdue';
  completedDate?: Date;
  createdAt?: Date;
}

export interface LinkedDocument {
  id: string;
  applianceId?: string;
  title: string;
  url: string;
  createdAt?: Date;
}

export type WarrantyStatus = 'Active' | 'Expiring Soon' | 'Expired';