-- Supabase Schema for Appliance Buddy Application
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables for appliance management system

-- Appliances table
CREATE TABLE IF NOT EXISTS public.appliances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  warranty_duration_months INTEGER NOT NULL,
  serial_number TEXT,
  purchase_location TEXT,
  notes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support contacts table
CREATE TABLE IF NOT EXISTS public.support_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appliance_id UUID REFERENCES public.appliances(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance tasks table
CREATE TABLE IF NOT EXISTS public.maintenance_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appliance_id UUID REFERENCES public.appliances(id) ON DELETE CASCADE NOT NULL,
  task_name TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  frequency TEXT CHECK (frequency IN ('One-time', 'Monthly', 'Yearly', 'Custom')) NOT NULL,
  service_provider_name TEXT,
  service_provider_phone TEXT,
  service_provider_email TEXT,
  service_provider_notes TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('Upcoming', 'Completed', 'Overdue')) DEFAULT 'Upcoming',
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Linked documents table
CREATE TABLE IF NOT EXISTS public.linked_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appliance_id UUID REFERENCES public.appliances(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linked_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Appliances policies
CREATE POLICY "Users can view their own appliances" ON public.appliances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appliances" ON public.appliances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appliances" ON public.appliances
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appliances" ON public.appliances
  FOR DELETE USING (auth.uid() = user_id);

-- Support contacts policies
CREATE POLICY "Users can view support contacts for their appliances" ON public.support_contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = support_contacts.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert support contacts for their appliances" ON public.support_contacts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = support_contacts.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update support contacts for their appliances" ON public.support_contacts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = support_contacts.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete support contacts for their appliances" ON public.support_contacts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = support_contacts.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

-- Maintenance tasks policies
CREATE POLICY "Users can view maintenance tasks for their appliances" ON public.maintenance_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = maintenance_tasks.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert maintenance tasks for their appliances" ON public.maintenance_tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = maintenance_tasks.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update maintenance tasks for their appliances" ON public.maintenance_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = maintenance_tasks.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete maintenance tasks for their appliances" ON public.maintenance_tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = maintenance_tasks.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

-- Linked documents policies
CREATE POLICY "Users can view linked documents for their appliances" ON public.linked_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = linked_documents.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert linked documents for their appliances" ON public.linked_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = linked_documents.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update linked documents for their appliances" ON public.linked_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = linked_documents.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete linked documents for their appliances" ON public.linked_documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.appliances 
      WHERE appliances.id = linked_documents.appliance_id 
      AND appliances.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appliances_user_id ON public.appliances(user_id);
CREATE INDEX IF NOT EXISTS idx_support_contacts_appliance_id ON public.support_contacts(appliance_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_appliance_id ON public.maintenance_tasks(appliance_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_status ON public.maintenance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_scheduled_date ON public.maintenance_tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_linked_documents_appliance_id ON public.linked_documents(appliance_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on appliances table
CREATE TRIGGER update_appliances_updated_at BEFORE UPDATE ON public.appliances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();