import { useState } from 'react';

export interface Meal {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: any[];
  createdAt: Date;
  isPlanned?: boolean;
}

export interface RoutineReminder {
  id: string;
  hour: number;
  minute: number;
  name: string;
}

export const useNutritionStore = () => {
  const [meals] = useState<Meal[]>([]);
  const [user] = useState({ id: 'user-1' });

  const getRoutineReminders = (): RoutineReminder[] => {
    return [
      { id: '1', hour: 8, minute: 0, name: 'Café da Manhã' },
      { id: '2', hour: 12, minute: 0, name: 'Almoço' },
      { id: '3', hour: 15, minute: 0, name: 'Lanche da Tarde' },
      { id: '4', hour: 19, minute: 0, name: 'Jantar' },
    ];
  };

  return {
    meals,
    user,
    getRoutineReminders,
  };
};
