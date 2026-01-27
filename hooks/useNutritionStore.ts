import { useNutritionContext } from '@/context/NutritionContext';

export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods?: FoodItem[];
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: FoodItem[];
  createdAt: Date;
  isPlanned?: boolean;
  imageUri?: string;
}

export interface RoutineReminder {
  id: string;
  hour: number;
  minute: number;
  name: string;
  type?: 'water' | 'recipe';
  date?: string; // ISO date string
  active?: boolean;
}

export const useNutritionStore = () => {
  return useNutritionContext();
};
