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
  isInsightsHidden: boolean;
  dismissUntilNew: () => void;
  markAsRead: (id: string) => void;
  refreshInsights: () => void;
}

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

export const InsightsProvider = ({ children }: { children: ReactNode }) => {
  const nutrition = useNutrition();
  const { quizData } = useQuiz();
  
  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  const [lastGenerated, setLastGenerated] = useState<number>(0);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  // Frequency Policy Config
  const MIN_GAP_MS = 90 * 60 * 1000; // 90 minutes
  const MAX_INSIGHTS = 10;
  
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
    
    setAllInsights(prev => {
        const prevById = new Map(prev.map(i => [i.id, i]));
        const touchedIds = new Set<string>();
        const newOrUpdated: Insight[] = [];

        for (const next of newInsights) {
          const existing = prevById.get(next.id);
          touchedIds.add(next.id);

          if (!existing) {
            newOrUpdated.push(next);
            continue;
          }

          const existingTime = Date.parse(existing.created_at) || 0;
          const nextTime = Date.parse(next.created_at) || 0;

          if (nextTime > existingTime) {
            newOrUpdated.push({ ...next, is_read: false });
          } else {
            newOrUpdated.push(existing);
          }
        }

        const remaining = prev.filter(i => !touchedIds.has(i.id));
        return [...newOrUpdated, ...remaining].slice(0, MAX_INSIGHTS);
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

  const dismissUntilNew = () => {
    const now = Date.now();
    setDismissedAt(now);
    setAllInsights(prev => prev.map(i => ({ ...i, is_read: true })));
  };

  const unreadInsight = allInsights.find(i => !i.is_read) || null;
  const unreadTime = unreadInsight ? (Date.parse(unreadInsight.created_at) || 0) : 0;
  const isInsightsHidden = dismissedAt != null && (!unreadInsight || unreadTime <= dismissedAt);
  const activeInsight = isInsightsHidden ? null : unreadInsight;

  return (
    <InsightsContext.Provider value={{ activeInsight, allInsights, isInsightsHidden, dismissUntilNew, markAsRead, refreshInsights }}>
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
