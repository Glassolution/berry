import { Insight } from '../context/InsightsContext';

// Types derived from user requirements
export interface InsightData {
  targetCalories: number;
  consumedCalories: number;
  targetMacros: { protein: number; carbs: number; fats: number };
  consumedMacros: { protein: number; carbs: number; fats: number };
  waterIntake: number;
  waterTarget: number;
  goal: string; // 'EMAGRECER' | 'MANTER' | 'GANHAR_MASSA'
}

export const generateInsights = (data: InsightData): Insight[] => {
  const insights: Insight[] = [];
  const now = new Date();
  const currentHour = now.getHours();

  const pctCalories = data.targetCalories > 0 ? data.consumedCalories / data.targetCalories : 0;
  const pctProtein = data.targetMacros.protein > 0 ? data.consumedMacros.protein / data.targetMacros.protein : 0;
  const pctWater = data.waterTarget > 0 ? data.waterIntake / data.waterTarget : 0;

  // RULE 1: Protein Recovery (High Protein Intake)
  if (pctProtein >= 1.3) {
    const delta = Math.round((pctProtein - 1) * 100);
    insights.push({
      id: `recovery-${now.toDateString()}`,
      type: 'RECOVERY',
      title: 'Proteína acima do normal',
      message: `Você está consumindo ${delta}% mais proteínas que o normal. Ótimo para sua recuperação muscular hoje!`,
      evidence: { metric: 'protein', value: pctProtein },
      confidence: 0.9,
      created_at: now.toISOString(),
      is_read: false
    });
  }

  // RULE 2: Low Water (Afternoon check)
  if (pctWater < 0.35 && currentHour >= 15) {
    const mlNeeded = Math.round((data.waterTarget * 0.5) - data.waterIntake); // Aim for 50% catchup
    if (mlNeeded > 0) {
        insights.push({
            id: `water-low-${now.toDateString()}`,
            type: 'AGUA',
            title: 'Hidratação baixa',
            message: `Sua água está em ${Math.round(pctWater * 100)}% da meta. Se beber ${mlNeeded}ml agora, você já destrava um bom progresso.`,
            evidence: { metric: 'water', value: pctWater },
            confidence: 0.85,
            created_at: now.toISOString(),
            is_read: false
        });
    }
  }

  // RULE 3: High Calories
  if (pctCalories > 1.15) {
    const delta = Math.round((pctCalories - 1) * 100);
    insights.push({
      id: `cals-high-${now.toDateString()}`,
      type: 'CALORIAS',
      title: 'Acima da meta de calorias',
      message: `Hoje você passou ${delta}% da sua meta calórica. Quer que eu sugira um ajuste leve para equilibrar?`,
      evidence: { metric: 'calories', value: pctCalories },
      confidence: 0.9,
      created_at: now.toISOString(),
      is_read: false
    });
  }

  // RULE 4: Low Protein for Muscle Gain (Evening check)
  if ((data.goal === 'GANHAR_MASSA' || data.goal === 'HIPERTROFIA') && pctProtein < 0.7 && currentHour >= 18) {
    const gNeeded = Math.round(data.targetMacros.protein - data.consumedMacros.protein);
    insights.push({
      id: `protein-low-gain-${now.toDateString()}`,
      type: 'MACROS',
      title: 'Proteína abaixo do alvo',
      message: `Para ganho de massa, sua proteína está em ${Math.round(pctProtein * 100)}% do alvo. Uma refeição com ${gNeeded}g de proteína te ajuda a fechar o dia.`,
      evidence: { metric: 'protein', value: pctProtein },
      confidence: 0.95,
      created_at: now.toISOString(),
      is_read: false
    });
  }
  
  // RULE 5: Consistency (Mock logic as we don't have full history in this context yet)
  // In a real app, we'd check the last 7 days of logs.
  // For now, if they have logged > 50% calories today, give a positive reinforcement.
  if (pctCalories > 0.5 && pctCalories < 1.1) {
       insights.push({
          id: `consistency-${now.toDateString()}`,
          type: 'CONSISTENCIA',
          title: 'No caminho certo',
          message: `Você já atingiu ${Math.round(pctCalories * 100)}% da sua meta hoje. Continue assim!`,
          evidence: { metric: 'calories', value: pctCalories },
          confidence: 0.8,
          created_at: now.toISOString(),
          is_read: false
       });
  }

  return insights;
};
