import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNutrition } from './NutritionContext';
import { useQuiz } from './QuizContext';
import { generateInsights, InsightData } from '../services/InsightGenerator';

export type InsightType = 'MACROS' | 'CALORIAS' | 'AGUA' | 'CONSISTENCIA' | 'QUALIDADE' | 'RECOVERY' | 'SUGESTAO';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  message: string;
  confidence?: number;
  evidence: any;
  created_at: string;
  valid_until?: string;
  is_read: boolean;
}

interface InsightsContextType {
  activeInsight: Insight | null;
  allInsights: Insight[];
  markAsRead: (id: string) => void;
  refreshInsights: () => void;
}

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

export const InsightsProvider = ({ children }: { children: ReactNode }) => {
  const nutrition = useNutrition();
  const { quizData } = useQuiz();
  
  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  const [lastGenerated, setLastGenerated] = useState<number>(0);

  // Frequency Policy Config
  const MIN_GAP_MS = 90 * 60 * 1000; // 90 minutes
  
  const refreshInsights = () => {
    const now = Date.now();
    // Simple cooldown check
    if (now - lastGenerated < MIN_GAP_MS && allInsights.length > 0) {
        return; // Too soon, keep existing
    }

    const data: InsightData = {
        targetCalories: nutrition.targetCalories,
        consumedCalories: nutrition.consumedCalories,
        targetMacros: nutrition.targetMacros,
        consumedMacros: nutrition.consumedMacros,
        waterIntake: nutrition.waterIntake,
        waterTarget: nutrition.waterTarget,
        goal: (quizData as any).goal || 'MANTER', // Accessing potentially loose type from Quiz
    };

    const newInsights = generateInsights(data);
    
    // Merge logic: Don't duplicate IDs, prioritize unread
    setAllInsights(prev => {
        const existingIds = new Set(prev.map(i => i.id));
        const uniqueNew = newInsights.filter(i => !existingIds.has(i.id));
        return [...uniqueNew, ...prev].slice(0, 10); // Keep last 10
    });
    
    if (newInsights.length > 0) {
        setLastGenerated(now);
    }
  };

  // Trigger: On Mount & When Nutrition Data Changes significantly
  // Using a debounced effect or simple effect with cooldown
  useEffect(() => {
    refreshInsights();
  }, [
    nutrition.consumedCalories, 
    nutrition.waterIntake, 
    nutrition.mealLogs.length
  ]);

  const markAsRead = (id: string) => {
    setAllInsights(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i));
  };

  // Active insight is the most recent unread one, or the most recent one if all read
  const activeInsight = allInsights.find(i => !i.is_read) || allInsights[0] || null;

  return (
    <InsightsContext.Provider value={{ activeInsight, allInsights, markAsRead, refreshInsights }}>
      {children}
    </InsightsContext.Provider>
  );
};

export const useInsights = () => {
  const context = useContext(InsightsContext);
  if (!context) {
    throw new Error('useInsights must be used within an InsightsProvider');
  }
  return context;
};
