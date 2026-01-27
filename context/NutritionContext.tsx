import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Meal, RoutineReminder } from '@/hooks/useNutritionStore';

interface NutritionContextType {
  meals: Meal[];
  reminders: RoutineReminder[];
  user: { id: string };
  loading: boolean;
  error: string | undefined;
  getMealsByDate: (date: Date) => Meal[];
  createMeal: (input: Omit<Meal, 'id' | 'createdAt'> & { createdAt?: Date }) => Promise<Meal>;
  updateMeal: (id: string, patch: Partial<Meal>) => Promise<Meal | undefined>;
  deleteMeal: (id: string) => Promise<void>;
  getRoutineReminders: () => RoutineReminder[];
  addReminder: (reminder: RoutineReminder) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

const NutritionContext = createContext<NutritionContextType | null>(null);

export function NutritionProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [reminders, setReminders] = useState<RoutineReminder[]>([]);
  const [user] = useState({ id: 'user-1' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const STORAGE_KEY = 'nutra:meals';
  const REMINDERS_KEY = 'nutra:reminders';

  const hydrate = async () => {
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as (Omit<Meal, 'createdAt'> & { createdAt: string })[];
        const parsed = arr.map((m) => ({ ...m, createdAt: new Date(m.createdAt) })) as Meal[];
        setMeals(parsed);
      } else {
        setMeals([]);
      }

      const rawReminders = await AsyncStorage.getItem(REMINDERS_KEY);
      if (rawReminders) {
        setReminders(JSON.parse(rawReminders));
      } else {
        setReminders([]);
      }
      setError(undefined);
    } catch (e: any) {
      setError('Falha ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, []);

  const persist = async (next: Meal[]) => {
    // Helper for direct persistence
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })))
    );
  };

  const getMealsByDate = (date: Date): Meal[] => {
    return meals.filter((m) => m.createdAt.toDateString() === date.toDateString());
  };

  const createMeal = async (input: Omit<Meal, 'id' | 'createdAt'> & { createdAt?: Date }) => {
    const id = 'meal-' + Math.random().toString(36).slice(2, 9);
    const createdAt = input.createdAt ?? new Date();
    
    let finalImageUri = input.imageUri;

    // Handle image persistence if URI is present and not remote
    if (input.imageUri && !input.imageUri.startsWith('http')) {
      try {
        const filename = `meal-${id}.jpg`;
        const newPath = `${FileSystem.documentDirectory}${filename}`;
        
        // Check if file exists before copying to avoid errors
        const fileInfo = await FileSystem.getInfoAsync(input.imageUri);
        if (fileInfo.exists) {
          await FileSystem.copyAsync({
            from: input.imageUri,
            to: newPath
          });
          finalImageUri = newPath;
        }
      } catch (e) {
        console.error('Failed to save meal image:', e);
        // Fallback to original URI if copy fails
      }
    }

    const newMeal: Meal = { ...input, id, createdAt, imageUri: finalImageUri };
    
    setMeals((currentMeals) => {
      const next = [newMeal, ...currentMeals];
      persist(next);
      return next;
    });
    return newMeal;
  };

  const updateMeal = async (id: string, patch: Partial<Meal>) => {
    let updated: Meal | undefined;
    setMeals((currentMeals) => {
      const next = currentMeals.map((m) => (m.id === id ? { ...m, ...patch } : m));
      updated = next.find((m) => m.id === id);
      persist(next);
      return next;
    });
    return updated;
  };

  const deleteMeal = async (id: string) => {
    setMeals((currentMeals) => {
      const next = currentMeals.filter((m) => m.id !== id);
      persist(next);
      return next;
    });
  };

  const getRoutineReminders = (): RoutineReminder[] => {
    return reminders;
  };

  const addReminder = async (reminder: RoutineReminder) => {
    setReminders((currentReminders) => {
      const next = [...currentReminders, reminder];
      AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteReminder = async (id: string) => {
    setReminders((currentReminders) => {
      const next = currentReminders.filter((r) => r.id !== id);
      AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <NutritionContext.Provider
      value={{
        meals,
        reminders,
        user,
        loading,
        error,
        getMealsByDate,
        createMeal,
        updateMeal,
        deleteMeal,
        getRoutineReminders,
        addReminder,
        deleteReminder,
        hydrate,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutritionContext() {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutritionContext must be used within a NutritionProvider');
  }
  return context;
}
