import { useEffect, useState } from 'react';
import { useNutritionStore, Meal } from '@/hooks/useNutritionStore';

export const useMealsLoop = (date: Date) => {
  const { meals, getMealsByDate } = useNutritionStore();
  const [displayMeals, setDisplayMeals] = useState<Meal[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const refresh = () => {
    setIsFetching(true);
    // Filter meals from the global store
    const list = meals.filter((m) => {
      const d = new Date(m.createdAt);
      return d.getFullYear() === date.getFullYear() &&
             d.getMonth() === date.getMonth() &&
             d.getDate() === date.getDate();
    });
    setDisplayMeals(list);
    setIsFetching(false);
  };

  useEffect(() => {
    refresh();
  }, [date, meals]); // React to date changes AND global meals changes

  return { displayMeals, isFetching, refresh };
};
