import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/src/context/AuthContext';
import { DietPreference, FoodRestriction, useQuiz } from '@/src/context/QuizContext';
import { useScan } from '@/src/context/ScanContext';
import { supabase } from '@/src/lib/supabase';
import { calculateDietPlan } from '@/src/utils/nutritionCalculations';

const RESTRICTION_OPTIONS: { key: FoodRestriction; label: string }[] = [
  { key: 'lactose', label: 'Lactose' },
  { key: 'gluten', label: 'Glúten' },
  { key: 'amendoim', label: 'Amendoim' },
  { key: 'frutos_do_mar', label: 'Frutos do mar' },
  { key: 'ovo', label: 'Ovo' },
  { key: 'outro', label: 'Outro' },
];

const DIET_PREFERENCES: { key: DietPreference; label: string }[] = [
  { key: 'sem_restricao', label: 'Sem restrição' },
  { key: 'low_carb', label: 'Low carb' },
  { key: 'vegetariana', label: 'Vegetariana' },
  { key: 'vegana', label: 'Vegana' },
  { key: 'pescetariana', label: 'Pescetariana' },
];

const BUDGET_OPTIONS: { key: 'baixo' | 'medio' | 'alto'; label: string }[] = [
  { key: 'baixo', label: 'Baixo' },
  { key: 'medio', label: 'Médio' },
  { key: 'alto', label: 'Alto' },
];

const uniqueTags = (values: string[]) => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const v = raw.trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
};

const parseTags = (value: string) => uniqueTags(value.split(','));

export default function DietOnboardingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const { quizData, updateQuizData } = useQuiz();
  const { pendingScan, setPendingScan } = useScan();

  const [restrictions, setRestrictions] = useState<FoodRestriction[]>(Array.isArray((quizData as any).restrictions) ? ((quizData as any).restrictions as FoodRestriction[]) : []);
  const [restrictionOtherText, setRestrictionOtherText] = useState<string>((quizData as any).restrictionOtherText ?? '');
  const [dietPreference, setDietPreference] = useState<DietPreference>(((quizData as any).dietPreference as DietPreference) ?? 'sem_restricao');
  const [foodsLikeInput, setFoodsLikeInput] = useState<string>(Array.isArray((quizData as any).foodsLike) ? ((quizData as any).foodsLike as string[]).join(', ') : '');
  const [foodsDislikeInput, setFoodsDislikeInput] = useState<string>(Array.isArray((quizData as any).foodsDislike) ? ((quizData as any).foodsDislike as string[]).join(', ') : '');
  const [mealsPerDay, setMealsPerDay] = useState<3 | 4 | 5 | 6>((([3, 4, 5, 6] as const).includes((quizData as any).mealsPerDay) ? (quizData as any).mealsPerDay : 4) as 3 | 4 | 5 | 6);
  const [budget, setBudget] = useState<'baixo' | 'medio' | 'alto' | undefined>((quizData as any).budget ?? undefined);
  const [saving, setSaving] = useState(false);

  const colors = useMemo(
    () => ({
      background: isDark ? '#0A0A0A' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : '#111827',
      textSecondary: isDark ? '#A1A1AA' : '#6B7280',
      card: isDark ? '#161616' : '#F8F8F8',
      border: isDark ? '#27272a' : '#f3f4f6',
      primary: isDark ? '#FFFFFF' : '#000000',
      primaryForeground: isDark ? '#000000' : '#FFFFFF',
      accent: '#FF4D8D',
    }),
    [isDark]
  );

  const toggleRestriction = (key: FoodRestriction) => {
    setRestrictions((prev) => {
      if (prev.includes(key)) return prev.filter((r) => r !== key);
      return [...prev, key];
    });
  };

  const foodsLike = useMemo(() => parseTags(foodsLikeInput), [foodsLikeInput]);
  const foodsDislike = useMemo(() => parseTags(foodsDislikeInput), [foodsDislikeInput]);

  const handleGenerate = async () => {
    if (!user?.id) {
      Alert.alert('Erro', 'Você precisa estar logado.');
      router.replace('/login');
      return;
    }

    if (restrictions.includes('outro') && !restrictionOtherText.trim()) {
      Alert.alert('Falta só um detalhe', 'Informe qual é a restrição em "Outro".');
      return;
    }

    setSaving(true);
    try {
      const mergedQuizData: any = {
        ...quizData,
        restrictions,
        restrictionOtherText,
        dietPreference,
        foodsLike,
        foodsDislike,
        mealsPerDay,
        budget,
      };

      const plan = calculateDietPlan(
        mergedQuizData.gender,
        mergedQuizData.age,
        mergedQuizData.height,
        mergedQuizData.weight,
        mergedQuizData.goalWeight,
        mergedQuizData.activityLevel,
        {
          restrictions,
          restrictionOtherText,
          dietPreference,
          foodsLike,
          foodsDislike,
          mealsPerDay,
          budget,
        }
      );

      mergedQuizData.activeDietPlan = plan;

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        quiz_data: mergedQuizData,
        gender: mergedQuizData.gender,
        age: mergedQuizData.age,
        activity_level: mergedQuizData.activityLevel,
        height: mergedQuizData.height,
        weight: mergedQuizData.weight,
        goal_weight: mergedQuizData.goalWeight,
        updated_at: new Date(),
      });

      if (error) {
        Alert.alert('Erro', 'Não foi possível salvar sua dieta. Tente novamente.');
        return;
      }

      updateQuizData({
        restrictions,
        restrictionOtherText,
        dietPreference,
        foodsLike,
        foodsDislike,
        mealsPerDay,
        budget,
        activeDietPlan: plan as any,
      } as any);

      if (pendingScan) {
        router.replace({
            pathname: '/ScanResultScreen',
            params: pendingScan as any // Type assertion to satisfy expo-router params
        });
        setPendingScan(null);
      } else {
        router.replace('/diet');
      }
    } catch (e) {
      Alert.alert('Erro', 'Falha ao gerar sua dieta. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <ThemedText style={StyleSheet.flatten([styles.title, { color: colors.text }])}>Preferências</ThemedText>
            <ThemedText style={StyleSheet.flatten([styles.subtitle, { color: colors.textSecondary }])}>
              Só o que falta para a IA montar seu plano.
            </ThemedText>
          </View>
        </View>

        <View style={StyleSheet.flatten([styles.card, { backgroundColor: colors.card, borderColor: colors.border }])}>
          <ThemedText style={StyleSheet.flatten([styles.cardTitle, { color: colors.text }])}>Alergias / restrições</ThemedText>
          <View style={styles.chipsWrap}>
            {RESTRICTION_OPTIONS.map((opt) => {
              const selected = restrictions.includes(opt.key);
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => toggleRestriction(opt.key)}
                  style={StyleSheet.flatten([
                    styles.chip,
                    { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? (isDark ? '#27272a' : '#ffffff') : 'transparent' },
                  ])}
                >
                  <ThemedText style={StyleSheet.flatten([styles.chipText, { color: selected ? colors.primary : colors.textSecondary }])}>{opt.label}</ThemedText>
                </Pressable>
              );
            })}
          </View>
          {restrictions.includes('outro') && (
            <TextInput
              value={restrictionOtherText}
              onChangeText={setRestrictionOtherText}
              placeholder="Qual?"
              placeholderTextColor={colors.textSecondary}
              style={StyleSheet.flatten([styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? '#18181b' : '#ffffff' }])}
            />
          )}
        </View>

        <View style={StyleSheet.flatten([styles.card, { backgroundColor: colors.card, borderColor: colors.border }])}>
          <ThemedText style={StyleSheet.flatten([styles.cardTitle, { color: colors.text }])}>Preferência de dieta</ThemedText>
          <View style={styles.chipsWrap}>
            {DIET_PREFERENCES.map((opt) => {
              const selected = dietPreference === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setDietPreference(opt.key)}
                  style={StyleSheet.flatten([
                    styles.chip,
                    { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? (isDark ? '#27272a' : '#ffffff') : 'transparent' },
                  ])}
                >
                  <ThemedText style={StyleSheet.flatten([styles.chipText, { color: selected ? colors.primary : colors.textSecondary }])}>{opt.label}</ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={StyleSheet.flatten([styles.card, { backgroundColor: colors.card, borderColor: colors.border }])}>
          <ThemedText style={StyleSheet.flatten([styles.cardTitle, { color: colors.text }])}>Alimentos que você gosta</ThemedText>
          <ThemedText style={StyleSheet.flatten([styles.helper, { color: colors.textSecondary }])}>Separe por vírgulas. Ex: arroz, frango, banana</ThemedText>
          <TextInput
            value={foodsLikeInput}
            onChangeText={setFoodsLikeInput}
            placeholder="Digite aqui..."
            placeholderTextColor={colors.textSecondary}
            style={StyleSheet.flatten([styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? '#18181b' : '#ffffff' }])}
          />
        </View>

        <View style={StyleSheet.flatten([styles.card, { backgroundColor: colors.card, borderColor: colors.border }])}>
          <ThemedText style={StyleSheet.flatten([styles.cardTitle, { color: colors.text }])}>Alimentos que você não gosta</ThemedText>
          <TextInput
            value={foodsDislikeInput}
            onChangeText={setFoodsDislikeInput}
            placeholder="Ex: peixe, aveia..."
            placeholderTextColor={colors.textSecondary}
            style={StyleSheet.flatten([styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? '#18181b' : '#ffffff' }])}
          />
        </View>

        <View style={StyleSheet.flatten([styles.card, { backgroundColor: colors.card, borderColor: colors.border }])}>
          <ThemedText style={StyleSheet.flatten([styles.cardTitle, { color: colors.text }])}>Refeições por dia</ThemedText>
          <View style={styles.chipsWrap}>
            {([3, 4, 5, 6] as const).map((v) => {
              const selected = mealsPerDay === v;
              return (
                <Pressable
                  key={v}
                  onPress={() => setMealsPerDay(v)}
                  style={StyleSheet.flatten([
                    styles.chip,
                    { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? (isDark ? '#27272a' : '#ffffff') : 'transparent' },
                  ])}
                >
                  <ThemedText style={StyleSheet.flatten([styles.chipText, { color: selected ? colors.primary : colors.textSecondary }])}>{v}</ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={StyleSheet.flatten([styles.card, { backgroundColor: colors.card, borderColor: colors.border }])}>
          <ThemedText style={StyleSheet.flatten([styles.cardTitle, { color: colors.text }])}>Orçamento (opcional)</ThemedText>
          <View style={styles.chipsWrap}>
            {BUDGET_OPTIONS.map((opt) => {
              const selected = budget === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setBudget(selected ? undefined : opt.key)}
                  style={StyleSheet.flatten([
                    styles.chip,
                    { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? (isDark ? '#27272a' : '#ffffff') : 'transparent' },
                  ])}
                >
                  <ThemedText style={StyleSheet.flatten([styles.chipText, { color: selected ? colors.primary : colors.textSecondary }])}>{opt.label}</ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={handleGenerate}
          disabled={saving}
          style={StyleSheet.flatten([styles.primaryButton, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }])}
        >
          {saving ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <ThemedText style={StyleSheet.flatten([styles.primaryButtonText, { color: colors.primaryForeground }])}>Gerar minha dieta</ThemedText>
          )}
        </Pressable>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  headerRow: {
    paddingTop: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  helper: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  input: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 10,
    borderRadius: 999,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});

