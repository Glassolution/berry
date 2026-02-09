import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuiz } from './QuizContext';
import { calculateDietPlan } from '../utils/nutritionCalculations';

interface MacroNutrients {
  protein: number;
  carbs: number;
  fats: number;
}

interface MealLog {
  id: string;
  name: string;
  calories: number;
  macros?: MacroNutrients;
  imageUri?: string;
  timestamp: number;
}

interface NutritionContextType {
  targetCalories: number;
  consumedCalories: number;
  remainingCalories: number;
  targetMacros: MacroNutrients;
  consumedMacros: MacroNutrients;
  mealLogs: MealLog[];
  addMeal: (name: string, calories: number, macros?: MacroNutrients, imageUri?: string) => void;
  removeMeal: (id: string) => void;
  resetDailyLog: () => void;
  waterIntake: number;
  waterTarget: number;
  addWater: (amount: number) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider = ({ children }: { children: ReactNode }) => {
  const { quizData } = useQuiz();

  // State for daily logs
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [waterIntake, setWaterIntake] = useState(0); // in ml

  // Calculate targets based on Quiz Data (Single Source of Truth)
  // This ensures Profile and Dashboard always see the same targets
  const activePlan = (quizData as any).activeDietPlan;
  
  const calculatedPlan = activePlan || calculateDietPlan(
    quizData.gender,
    quizData.age,
    quizData.height,
    quizData.weight,
    quizData.goalWeight,
    quizData.activityLevel,
    {
      restrictions: (quizData as any).restrictions,
      restrictionOtherText: (quizData as any).restrictionOtherText,
      dietPreference: (quizData as any).dietPreference,
      foodsLike: (quizData as any).foodsLike,
      foodsDislike: (quizData as any).foodsDislike,
      mealsPerDay: (quizData as any).mealsPerDay,
      budget: (quizData as any).budget,
    }
  );

  const targetCalories = calculatedPlan.calories;
  const targetMacros = {
    protein: calculatedPlan.macros.protein,
    carbs: calculatedPlan.macros.carbs,
    fats: calculatedPlan.macros.fats,
  };
  
  // Water target logic (simple heuristic: 35ml per kg of weight)
  const weight = Number(quizData.weight ?? 70);
  const waterTarget = Math.round(weight * 35); // e.g., 70kg * 35 = 2450ml

  // Calculate consumed totals
  const consumedCalories = mealLogs.reduce((acc, meal) => acc + meal.calories, 0);
  const consumedMacros = mealLogs.reduce(
    (acc, meal) => ({
      protein: acc.protein + (meal.macros?.protein || 0),
      carbs: acc.carbs + (meal.macros?.carbs || 0),
      fats: acc.fats + (meal.macros?.fats || 0),
    }),
    { protein: 0, carbs: 0, fats: 0 }
  );

  const remainingCalories = targetCalories - consumedCalories;

  const addMeal = (name: string, calories: number, macros?: MacroNutrients, imageUri?: string) => {
    const newMeal: MealLog = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      calories,
      macros,
      imageUri,
      timestamp: Date.now(),
    };
    setMealLogs((prev) => [newMeal, ...prev]); // Add to beginning for "Recent" order
  };

  const removeMeal = (id: string) => {
    setMealLogs((prev) => prev.filter((meal) => meal.id !== id));
  };

  const resetDailyLog = () => {
    setMealLogs([]);
    setWaterIntake(0);
  };
  
  const addWater = (amount: number) => {
    setWaterIntake(prev => prev + amount);
  };

  return (
    <NutritionContext.Provider
      value={{
        targetCalories,
        consumedCalories,
        remainingCalories,
        targetMacros,
        consumedMacros,
        mealLogs,
        addMeal,
        removeMeal,
        resetDailyLog,
        waterIntake,
        waterTarget,
        addWater
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
