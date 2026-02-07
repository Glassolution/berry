import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/src/context/AuthContext';
import { useQuiz } from '@/src/context/QuizContext';
import { supabase } from '@/src/lib/supabase';
import {
  calculateDietPlan,
  DietFoodId,
  DietMealItemCategory,
  DietPlan,
  formatDietMealItem,
  listDietFoodOptions,
  replaceDietPlanItem,
} from '@/src/utils/nutritionCalculations';
import { Share } from 'react-native';

export default function DietScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { quizData, updateQuizData } = useQuiz();
  const isDark = theme === 'dark';

  const [adjustMode, setAdjustMode] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMealIndex, setPickerMealIndex] = useState<number | null>(null);
  const [pickerItemIndex, setPickerItemIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const activePlan = (quizData as any).activeDietPlan as DietPlan | undefined;

  const colors = useMemo(
    () => ({
      background: isDark ? '#0A0A0A' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : '#111827',
      textSecondary: isDark ? '#A1A1AA' : '#9CA3AF',
      card: isDark ? '#161616' : '#F8F8F8',
      border: isDark ? '#27272a' : '#f3f4f6',
      primary: isDark ? '#FFFFFF' : '#000000',
      primaryForeground: isDark ? '#000000' : '#FFFFFF',
      accent: '#FF4D8D',
    }),
    [isDark]
  );

  const persistQuizData = async (payload: any) => {
    if (!user?.id) return;
    await supabase.from('profiles').upsert({
      id: user.id,
      quiz_data: payload,
      updated_at: new Date(),
    });
  };

  const openPicker = (mealIndex: number, itemIndex: number) => {
    setPickerMealIndex(mealIndex);
    setPickerItemIndex(itemIndex);
    setPickerOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setPickerMealIndex(null);
    setPickerItemIndex(null);
  };

  const getPickerData = () => {
    if (!activePlan?.meals?.[pickerMealIndex ?? -1]?.items?.[pickerItemIndex ?? -1]) return null;
    const item = activePlan.meals[pickerMealIndex!].items![pickerItemIndex!];
    const category = item.category as DietMealItemCategory;
    const options = listDietFoodOptions(category, {
      restrictions: (quizData as any).restrictions,
      restrictionOtherText: (quizData as any).restrictionOtherText,
      dietPreference: (quizData as any).dietPreference,
      foodsLike: (quizData as any).foodsLike,
      foodsDislike: (quizData as any).foodsDislike,
      mealsPerDay: (quizData as any).mealsPerDay,
      budget: (quizData as any).budget,
    });

    return { item, category, options };
  };

  const handleReplace = async (newFoodId: DietFoodId) => {
    if (!activePlan) return;
    if (pickerMealIndex == null || pickerItemIndex == null) return;
    setSaving(true);
    try {
      const nextPlan = replaceDietPlanItem(activePlan, pickerMealIndex, pickerItemIndex, newFoodId);
      const merged = { ...quizData, activeDietPlan: nextPlan };
      updateQuizData({ activeDietPlan: nextPlan } as any);
      await persistQuizData(merged);
      closePicker();
    } finally {
      setSaving(false);
    }
  };

  const handleRecalculate = () => {
    Alert.alert('Recalcular dieta', 'Gerar um novo plano com base no seu quiz atual?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Recalcular',
        onPress: async () => {
          setSaving(true);
          try {
            const plan = calculateDietPlan(
              (quizData as any).gender,
              (quizData as any).age,
              (quizData as any).height,
              (quizData as any).weight,
              (quizData as any).goalWeight,
              (quizData as any).activityLevel,
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

            const merged = { ...quizData, activeDietPlan: plan };
            updateQuizData({ activeDietPlan: plan } as any);
            await persistQuizData(merged);
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  const handleExport = async () => {
    if (!activePlan) return;
    const lines: string[] = [];
    lines.push(`Minha Dieta — ${activePlan.calories} kcal`);
    lines.push(`P ${activePlan.macros.protein}g • C ${activePlan.macros.carbs}g • G ${activePlan.macros.fats}g`);
    lines.push('');
    activePlan.meals.forEach((m) => {
      lines.push(m.name);
      m.foods.forEach((f) => lines.push(`- ${f}`));
      lines.push('');
    });
    await Share.share({ message: lines.join('\n') });
  };

  const handleGenerateNow = async () => {
    setSaving(true);
    try {
      const plan = calculateDietPlan(
        (quizData as any).gender,
        (quizData as any).age,
        (quizData as any).height,
        (quizData as any).weight,
        (quizData as any).goalWeight,
        (quizData as any).activityLevel,
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
      const merged = { ...quizData, activeDietPlan: plan };
      updateQuizData({ activeDietPlan: plan } as any);
      await persistQuizData(merged);
    } finally {
      setSaving(false);
    }
  };

  const pickerData = getPickerData();

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerIcon}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <ThemedText style={StyleSheet.flatten([styles.headerTitle, { color: colors.text }])}>Minha Dieta</ThemedText>
        <View style={styles.headerRight}>
          <Pressable
            onPress={() => setAdjustMode((v) => !v)}
            style={StyleSheet.flatten([styles.pill, { borderColor: colors.border, backgroundColor: colors.card }])}
          >
            <ThemedText style={StyleSheet.flatten([styles.pillText, { color: colors.text }])}>{adjustMode ? 'Concluir' : 'Ajustar'}</ThemedText>
          </Pressable>
        </View>
      </View>

      {!activePlan ? (
        <View style={styles.emptyState}>
          <ThemedText style={StyleSheet.flatten([styles.emptyTitle, { color: colors.text }])}>Nenhum plano ativo</ThemedText>
          <ThemedText style={StyleSheet.flatten([styles.emptySubtitle, { color: colors.textSecondary }])}>
            Gere sua dieta para começar.
          </ThemedText>
          <Pressable
            onPress={handleGenerateNow}
            disabled={saving}
            style={StyleSheet.flatten([styles.primaryButton, { backgroundColor: colors.primary, opacity: saving ? 0.6 : 1 }])}
          >
            <ThemedText style={StyleSheet.flatten([styles.primaryButtonText, { color: colors.primaryForeground }])}>Gerar agora</ThemedText>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={StyleSheet.flatten([styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <ThemedText style={StyleSheet.flatten([styles.summaryLabel, { color: colors.textSecondary }])}>PLANO ATIVO</ThemedText>
            <ThemedText style={StyleSheet.flatten([styles.summaryKcal, { color: colors.text }])}>{activePlan.calories} kcal</ThemedText>
            <View style={styles.summaryMacrosRow}>
              <ThemedText style={StyleSheet.flatten([styles.macroChip, { color: colors.text }])}>P {activePlan.macros.protein}g</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.macroChip, { color: colors.text }])}>C {activePlan.macros.carbs}g</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.macroChip, { color: colors.text }])}>G {activePlan.macros.fats}g</ThemedText>
            </View>
            <View style={styles.summaryButtonsRow}>
              <Pressable
                onPress={handleRecalculate}
                disabled={saving}
                style={StyleSheet.flatten([styles.secondaryButton, { borderColor: colors.border, opacity: saving ? 0.6 : 1 }])}
              >
                <ThemedText style={StyleSheet.flatten([styles.secondaryButtonText, { color: colors.text }])}>Recalcular</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleExport}
                disabled={saving}
                style={StyleSheet.flatten([styles.secondaryButton, { borderColor: colors.border, opacity: saving ? 0.6 : 1 }])}
              >
                <ThemedText style={StyleSheet.flatten([styles.secondaryButtonText, { color: colors.text }])}>Exportar</ThemedText>
              </Pressable>
            </View>
          </View>

          <View style={styles.mealsList}>
            {activePlan.meals.map((meal, mealIndex) => (
              <View key={`${meal.name}-${mealIndex}`} style={StyleSheet.flatten([styles.mealCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
                <View style={styles.mealHeader}>
                  <ThemedText style={StyleSheet.flatten([styles.mealTitle, { color: colors.text }])}>{meal.name}</ThemedText>
                  {meal.macros?.calories ? (
                    <ThemedText style={StyleSheet.flatten([styles.mealKcal, { color: colors.textSecondary }])}>
                      {meal.macros.calories} kcal
                    </ThemedText>
                  ) : null}
                </View>

                <View style={styles.itemsList}>
                  {(meal.items ?? []).length > 0 ? (
                    meal.items!.map((item, itemIndex) => {
                      const label = formatDietMealItem(item);
                      const canAdjust = adjustMode && item.category !== 'veg' && item.category !== 'other';
                      return (
                        <Pressable
                          key={`${mealIndex}-${itemIndex}-${item.foodId}`}
                          disabled={!canAdjust || saving}
                          onPress={() => openPicker(mealIndex, itemIndex)}
                          style={StyleSheet.flatten([styles.itemRow, { opacity: saving ? 0.6 : 1 }])}
                        >
                          <ThemedText style={StyleSheet.flatten([styles.itemText, { color: colors.text }])}>{label}</ThemedText>
                          {canAdjust ? <MaterialIcons name="swap-horiz" size={20} color={colors.textSecondary} /> : null}
                        </Pressable>
                      );
                    })
                  ) : (
                    meal.foods.map((f, idx) => (
                      <View key={`${mealIndex}-food-${idx}`} style={styles.itemRow}>
                        <ThemedText style={StyleSheet.flatten([styles.itemText, { color: colors.text }])}>{f}</ThemedText>
                      </View>
                    ))
                  )}
                </View>

                {meal.macros ? (
                  <View style={styles.mealMacrosRow}>
                    <ThemedText style={StyleSheet.flatten([styles.mealMacro, { color: colors.textSecondary }])}>P {Math.round(meal.macros.protein)}g</ThemedText>
                    <ThemedText style={StyleSheet.flatten([styles.mealMacro, { color: colors.textSecondary }])}>C {Math.round(meal.macros.carbs)}g</ThemedText>
                    <ThemedText style={StyleSheet.flatten([styles.mealMacro, { color: colors.textSecondary }])}>G {Math.round(meal.macros.fats)}g</ThemedText>
                  </View>
                ) : null}
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      <Modal transparent visible={pickerOpen} animationType="fade" onRequestClose={closePicker}>
        <Pressable style={styles.modalBackdrop} onPress={closePicker}>
          <Pressable style={StyleSheet.flatten([styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }])} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <ThemedText style={StyleSheet.flatten([styles.modalTitle, { color: colors.text }])}>Trocar alimento</ThemedText>
              <Pressable onPress={closePicker} style={styles.headerIcon}>
                <MaterialIcons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            {!pickerData ? (
              <ThemedText style={StyleSheet.flatten([styles.modalSubtitle, { color: colors.textSecondary }])}>Seleção inválida</ThemedText>
            ) : (
              <>
                <ThemedText style={StyleSheet.flatten([styles.modalSubtitle, { color: colors.textSecondary }])}>
                  Opções para {pickerData.category}
                </ThemedText>
                <ScrollView style={{ maxHeight: 320 }} contentContainerStyle={{ paddingTop: 12, paddingBottom: 8 }}>
                  {pickerData.options.map((opt) => (
                    <Pressable
                      key={opt.id}
                      onPress={() => void handleReplace(opt.id)}
                      disabled={saving}
                      style={StyleSheet.flatten([styles.optionRow, { borderColor: colors.border, opacity: saving ? 0.6 : 1 }])}
                    >
                      <ThemedText style={StyleSheet.flatten([styles.optionText, { color: colors.text }])}>{opt.name}</ThemedText>
                      <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  summaryKcal: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  summaryMacrosRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  macroChip: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryButtonsRow: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
  mealsList: {
    marginTop: 14,
    gap: 12,
  },
  mealCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  mealKcal: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemsList: {
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  mealMacrosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  mealMacro: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontWeight: '800',
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalSubtitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  optionRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

