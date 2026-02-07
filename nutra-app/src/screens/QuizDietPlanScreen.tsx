import React, { useMemo } from 'react';
import { Alert, View, Text, ScrollView, Pressable, useColorScheme, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useQuiz } from '../context/QuizContext';
import { calculateDietPlan } from '../utils/nutritionCalculations';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const QuizDietPlanScreen = () => {
  const router = useRouter();
  const { quizData } = useQuiz();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  // Force light mode as requested by user ("change background to white")
  const isDark = false;

  const dietPlan = useMemo(() => {
    return calculateDietPlan(
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
  }, [quizData]);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!user?.id) {
      router.push('/QuizSaveProgressScreen');
      return;
    }

    const hasDietPrefs =
      Array.isArray((quizData as any).restrictions) &&
      typeof (quizData as any).dietPreference === 'string' &&
      Array.isArray((quizData as any).foodsLike) &&
      Array.isArray((quizData as any).foodsDislike) &&
      [3, 4, 5, 6].includes(Number((quizData as any).mealsPerDay));

    const persistQuiz = async (payload: any) => {
      await supabase.from('profiles').upsert({
        id: user.id,
        quiz_data: payload,
        gender: payload.gender,
        age: payload.age,
        activity_level: payload.activityLevel,
        height: payload.height,
        weight: payload.weight,
        goal_weight: payload.goalWeight,
        updated_at: new Date(),
      });
    };

    if (!hasDietPrefs) {
      persistQuiz(quizData);
      router.replace('/diet-onboarding');
      return;
    }

    const hasExistingPlan = !!(quizData as any).activeDietPlan;

    const goNoRecalc = async () => {
      await persistQuiz(quizData);
      router.replace('/diet');
    };

    const goRecalc = async () => {
      const plan = dietPlan;
      const merged = { ...quizData, activeDietPlan: plan };
      await persistQuiz(merged);
      router.replace('/diet');
    };

    if (hasExistingPlan) {
      Alert.alert('Recalcular dieta?', 'Você atualizou o quiz. Deseja recalcular seu plano ativo agora?', [
        { text: 'Não', style: 'cancel', onPress: () => void goNoRecalc() },
        { text: 'Sim', onPress: () => void goRecalc() },
      ]);
      return;
    }

    void goRecalc();
  };

  const handleBack = () => {
    router.back();
  };

  // Helper for macro percentages
  const pCal = dietPlan.macros.protein * 4;
  const cCal = dietPlan.macros.carbs * 4;
  const fCal = dietPlan.macros.fats * 9;
  const totalCal = pCal + cCal + fCal;
  
  const pPercent = Math.round((pCal / totalCal) * 100);
  const cPercent = Math.round((cCal / totalCal) * 100);
  const fPercent = Math.round((fCal / totalCal) * 100);

  const themeStyles = isDark ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Header */}
        <View style={styles.header}>
            <Pressable onPress={handleBack} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="#ee2b5b" />
            </Pressable>
            <Text style={[styles.headerTitle, themeStyles.text]}>Sua Dieta Base</Text>
            <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
            {/* Intro Text */}
            <Text style={[styles.introText, themeStyles.subText]}>
                Com base nas suas respostas, criamos uma estimativa segura para o seu corpo e objetivo.
            </Text>

            {/* Meta Diária Card */}
            <View style={[styles.card, themeStyles.card]}>
                <View>
                    <Text style={[styles.cardLabel, styles.metaLabel]}>META DIÁRIA</Text>
                    <View style={styles.caloriesRow}>
                        <Text style={[styles.caloriesValue, themeStyles.text]}>
                            {dietPlan.calories}
                        </Text>
                        <Text style={[styles.caloriesUnit, themeStyles.subText]}>kcal</Text>
                    </View>
                    <Text style={styles.estimateText}>Estimativa sustentável</Text>
                </View>
                <View style={[styles.iconContainer, themeStyles.iconContainer]}>
                    <MaterialIcons name="local-fire-department" size={32} color="#ee2b5b" />
                </View>
            </View>

            {/* Distribuição de Nutrientes */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>Distribuição de Nutrientes</Text>
                <View style={styles.macrosRow}>
                    {/* Protein */}
                    <View style={[styles.macroCard, styles.macroCardProtein, themeStyles.macroCardProtein]}>
                        <Text style={[styles.macroValue, styles.textProtein]}>{dietPlan.macros.protein}g</Text>
                        <Text style={[styles.macroLabel, themeStyles.subText]}>Proteína</Text>
                    </View>

                    {/* Carbs */}
                    <View style={[styles.macroCard, styles.macroCardCarbs, themeStyles.macroCardCarbs]}>
                        <Text style={[styles.macroValue, styles.textCarbs]}>{dietPlan.macros.carbs}g</Text>
                        <Text style={[styles.macroLabel, themeStyles.subText]}>Carbos</Text>
                    </View>

                    {/* Fats */}
                    <View style={[styles.macroCard, styles.macroCardFats, themeStyles.macroCardFats]}>
                        <Text style={[styles.macroValue, styles.textFats]}>{dietPlan.macros.fats}g</Text>
                        <Text style={[styles.macroLabel, themeStyles.subText]}>Gorduras</Text>
                    </View>
                </View>
            </View>

            {/* Exemplo de Dia */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>Exemplo de Dia</Text>
                <View style={styles.mealsList}>
                    {dietPlan.meals.map((meal, index) => {
                        let iconName = 'restaurant';
                        if (index === 0) iconName = 'coffee-outline'; // Breakfast
                        else if (index === 1) iconName = 'silverware-fork-knife'; // Lunch
                        else if (index === 2) iconName = 'food-apple-outline'; // Snack
                        else iconName = 'moon-waning-crescent'; // Dinner

                        return (
                            <View key={index} style={[styles.mealCard, themeStyles.mealCard]}>
                                <View style={[styles.mealIconContainer, themeStyles.mealIconContainer]}>
                                    <MaterialCommunityIcons name={iconName as any} size={22} color="#4b5563" />
                                </View>
                                <View style={styles.mealContent}>
                                    <View style={styles.mealHeader}>
                                        <Text style={[styles.mealName, themeStyles.text]}>{meal.name}</Text>
                                        <Text style={[styles.mealCalories, themeStyles.subText]}>~{meal.approxCalories} kcal</Text>
                                    </View>
                                    <Text style={[styles.mealFoods, themeStyles.subText]}>
                                        {meal.foods.join(' • ')}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>

        </ScrollView>

        {/* Footer Button */}
        <View style={[styles.footer, themeStyles.footer]}>
            <Pressable 
                onPress={handleContinue}
                style={({pressed}) => [
                    styles.continueButton,
                    pressed && styles.buttonPressed
                ]}
            >
                <Text style={styles.buttonText}>Entendi, vamos continuar</Text>
                <MaterialIcons name="arrow-forward" size={20} color="white" />
            </Pressable>
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'Manrope_400Regular',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: 'Manrope_700Bold',
  },
  metaLabel: {
    color: '#9ca3af',
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  caloriesValue: {
    fontSize: 36,
    fontFamily: 'Manrope_800ExtraBold',
    fontWeight: '800',
  },
  caloriesUnit: {
    fontSize: 16,
    fontFamily: 'Manrope_500Medium',
    fontWeight: '500',
  },
  estimateText: {
    color: '#10b981', // emerald-500
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroCardProtein: {
    backgroundColor: '#fef2f2', // red-50
  },
  macroCardCarbs: {
    backgroundColor: '#fff7ed', // orange-50
  },
  macroCardFats: {
    backgroundColor: '#ecfdf5', // emerald-50
  },
  macroValue: {
    fontSize: 20,
    fontFamily: 'Manrope_800ExtraBold',
    fontWeight: '800',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    fontWeight: '500',
  },
  textProtein: { color: '#ee2b5b' },
  textCarbs: { color: '#f97316' },
  textFats: { color: '#10b981' },
  
  mealsList: {
    gap: 16,
  },
  mealCard: {
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  mealIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  mealContent: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    fontWeight: 'bold',
  },
  mealCalories: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    fontWeight: '500',
  },
  mealFoods: {
    fontSize: 14,
    fontFamily: 'Manrope_400Regular',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    borderTopWidth: 1,
  },
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#ee2b5b',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ee2b5b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    fontWeight: 'bold',
  },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#ffffff' },
  text: { color: '#111827' }, // gray-900
  subText: { color: '#6b7280' }, // gray-500
  card: { 
    backgroundColor: '#ffffff',
    borderColor: '#f3f4f6', // gray-100
  },
  iconContainer: { backgroundColor: '#fef2f2' }, // red-50
  macroCardProtein: { backgroundColor: '#fef2f2' },
  macroCardCarbs: { backgroundColor: '#fff7ed' },
  macroCardFats: { backgroundColor: '#ecfdf5' },
  mealCard: { backgroundColor: '#f9fafb' }, // gray-50
  mealIconContainer: { 
    backgroundColor: '#ffffff',
    borderColor: '#f3f4f6',
  },
  footer: { 
    backgroundColor: '#ffffff',
    borderColor: '#f9fafb',
  },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#1b0d11' },
  text: { color: '#ffffff' },
  subText: { color: '#9ca3af' }, // gray-400
  card: { 
    backgroundColor: '#18181b', // zinc-900
    borderColor: '#27272a', // zinc-800
  },
  iconContainer: { backgroundColor: 'rgba(127, 29, 29, 0.2)' }, // red-900/20
  macroCardProtein: { backgroundColor: 'rgba(127, 29, 29, 0.1)' },
  macroCardCarbs: { backgroundColor: 'rgba(124, 45, 18, 0.1)' },
  macroCardFats: { backgroundColor: 'rgba(6, 78, 59, 0.1)' },
  mealCard: { backgroundColor: 'rgba(24, 24, 27, 0.5)' }, // zinc-900/50
  mealIconContainer: { 
    backgroundColor: '#27272a',
    borderColor: '#3f3f46',
  },
  footer: { 
    backgroundColor: '#1b0d11',
    borderColor: '#27272a',
  },
});

export default QuizDietPlanScreen;
