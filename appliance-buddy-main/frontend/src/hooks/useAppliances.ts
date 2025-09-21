import { useState, useEffect, useCallback } from 'react';
import { Appliance } from '../../../shared/types/appliance';
import { ApplianceService } from '@/services/applianceService';
import { generateMockAppliances } from '@/data/mockAppliances';
import { getMaintenanceStatus } from '@/utils/dateUtils';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export const useAppliances = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const loadAppliances = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ApplianceService.getAppliances();
      setAppliances(data);
    } catch (error) {
      console.error('Error loading appliances:', error);
      toast({
        title: "Error",
        description: "Failed to load appliances. Please try again.",
        variant: "destructive",
      });
      const stored = localStorage.getItem('appliances');
      if (stored) {
        const parsedAppliances = JSON.parse(stored).map((app: unknown) => {
          const typedApp = app as Record<string, unknown>;
          return {
            ...typedApp,
            purchaseDate: new Date(typedApp.purchaseDate as string),
            maintenanceTasks: (typedApp.maintenanceTasks as unknown[]).map((task: unknown) => {
              const typedTask = task as Record<string, unknown>;
              return {
                ...typedTask,
                scheduledDate: new Date(typedTask.scheduledDate as string),
                completedDate: typedTask.completedDate ? new Date(typedTask.completedDate as string) : undefined,
                status: getMaintenanceStatus(
                  new Date(typedTask.scheduledDate as string), 
                  typedTask.completedDate ? new Date(typedTask.completedDate as string) : undefined
                )
              };
            })
          };
        });
        setAppliances(parsedAppliances as Appliance[]);
      } else {
        setAppliances(generateMockAppliances());
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        loadAppliances();
      } else {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          loadAppliances();
        }
        if (event === 'SIGNED_OUT') {
          setAppliances([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadAppliances]);

  const saveAppliancesToLocal = (newAppliances: Appliance[]) => {
    localStorage.setItem('appliances', JSON.stringify(newAppliances));
  };

  const addAppliance = async (appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (user) {
        await ApplianceService.createAppliance(appliance);
        await loadAppliances();
        toast({
          title: "Success",
          description: "Appliance added successfully.",
        });
      } else {
        const newAppliance: Appliance = {
          ...appliance,
          id: crypto.randomUUID(),
          supportContacts: [],
          maintenanceTasks: [],
          linkedDocuments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const updated = [...appliances, newAppliance];
        saveAppliancesToLocal(updated);
        setAppliances(updated);
      }
    } catch (error) {
      console.error('Error adding appliance:', error);
      toast({
        title: "Error",
        description: "Failed to add appliance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateAppliance = async (id: string, updates: Partial<Appliance>) => {
    try {
      if (user) {
        await ApplianceService.updateAppliance(id, updates);
        await loadAppliances();
        toast({
          title: "Success",
          description: "Appliance updated successfully.",
        });
      } else {
        const updated = appliances.map(app =>
          app.id === id ? { ...app, ...updates, updatedAt: new Date() } : app
        );
        saveAppliancesToLocal(updated);
        setAppliances(updated);
      }
    } catch (error) {
      console.error('Error updating appliance:', error);
      toast({
        title: "Error",
        description: "Failed to update appliance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteAppliance = async (id: string) => {
    try {
      if (user) {
        await ApplianceService.deleteAppliance(id);
        await loadAppliances();
        toast({
          title: "Success",
          description: "Appliance deleted successfully.",
        });
      } else {
        const updated = appliances.filter(app => app.id !== id);
        saveAppliancesToLocal(updated);
        setAppliances(updated);
      }
    } catch (error) {
      console.error('Error deleting appliance:', error);
      toast({
        title: "Error",
        description: "Failed to delete appliance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetToSampleData = () => {
    localStorage.removeItem('appliances');
    const freshData = generateMockAppliances();
    setAppliances(freshData);
    toast({
      title: "Success",
      description: "Sample data loaded successfully.",
    });
  };

  return {
    appliances,
    loading,
    user,
    addAppliance,
    updateAppliance,
    deleteAppliance,
    resetToSampleData,
    refreshAppliances: loadAppliances
  };
};