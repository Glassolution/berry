import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Gender = 'homem' | 'mulher' | 'outro';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type DietPreference = 'sem_restricao' | 'low_carb' | 'vegetariana' | 'vegana' | 'pescetariana';
export type FoodRestriction =
  | 'lactose'
  | 'gluten'
  | 'amendoim'
  | 'frutos_do_mar'
  | 'ovo'
  | 'outro';

interface QuizData {
  gender: Gender;
  age: number;
  activityLevel: ActivityLevel;
  height: number; // cm
  weight: number; // kg
  goalWeight: number; // kg
  unitSystem: 'metric' | 'imperial';
  restrictions: FoodRestriction[];
  restrictionOtherText: string;
  dietPreference: DietPreference;
  foodsLike: string[];
  foodsDislike: string[];
  mealsPerDay: 3 | 4 | 5 | 6;
  budget?: 'baixo' | 'medio' | 'alto';
  activeDietPlan?: unknown;
}

interface QuizContextType {
  quizData: QuizData;
  updateQuizData: (data: Partial<QuizData>) => void;
  resetQuiz: () => void;
}

const defaultData: QuizData = {
  gender: 'mulher',
  age: 30,
  activityLevel: 'moderate',
  height: 170,
  weight: 70,
  goalWeight: 60,
  unitSystem: 'metric',
  restrictions: [],
  restrictionOtherText: '',
  dietPreference: 'sem_restricao',
  foodsLike: [],
  foodsDislike: [],
  mealsPerDay: 4,
  budget: undefined,
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quizData, setQuizData] = useState<QuizData>(defaultData);

  const updateQuizData = (data: Partial<QuizData>) => {
    setQuizData((prev) => ({ ...prev, ...data }));
    console.log('Quiz Data Updated:', { ...quizData, ...data });
  };

  const resetQuiz = () => {
    setQuizData(defaultData);
  };

  return (
    <QuizContext.Provider value={{ quizData, updateQuizData, resetQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
