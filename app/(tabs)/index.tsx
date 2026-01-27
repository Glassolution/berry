import { StyleSheet, Pressable, View, TextInput, ScrollView, ImageStyle, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useNutritionContext } from '@/context/NutritionContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useQuiz } from '@/src/context/QuizContext';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { quizData } = useQuiz();
  const { meals } = useNutritionContext();
  const isDark = theme === 'dark';
  const [name, setName] = useState<string>('Cas');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [goalOverride, setGoalOverride] = useState<number | null>(null);

  // Get recent meals (last 5)
  const recentMeals = [...meals]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Calculate Daily Calories (TDEE)
  const calculateTDEE = () => {
    if (!quizData) return 2000; // Default fallback

    // Mifflin-St Jeor Equation
    // Men: 10W + 6.25H - 5A + 5
    // Women: 10W + 6.25H - 5A - 161
    const { gender, weight, height, age, activityLevel } = quizData;
    
    // Ensure all values are present
    if (!weight || !height || !age) return 2000;

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += gender === 'homem' ? 5 : -161;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const multiplier = activityLevel ? (activityMultipliers[activityLevel] || 1.2) : 1.2;
    return Math.round(bmr * multiplier);
  };

  const targetCalories = goalOverride ?? calculateTDEE();

  const colors = {
    background: isDark ? '#0A0A0A' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#111827', // gray-900
    textSecondary: isDark ? '#A1A1AA' : '#9CA3AF', // gray-400
    card: isDark ? '#161616' : '#F8F8F8',
    border: isDark ? '#27272a' : '#f3f4f6', // gray-100/zinc-800
    primary: isDark ? '#FFFFFF' : '#000000',
    primaryForeground: isDark ? '#000000' : '#FFFFFF',
    accent: '#FF4D8D',
  };

  // Calculate consumed calories and macros from meals
  const todayMeals = meals.filter(m => {
    const d = new Date(m.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const consumedCalories = todayMeals.reduce((acc, m) => acc + (Number(m.calories) || 0), 0);
  
  const diffCalories = targetCalories - consumedCalories;
  const isOver = diffCalories < 0;
  const displayCalories = consumedCalories;
  const caloriesProgress = Math.min(consumedCalories / targetCalories, 1);
  
  const progressColor = isOver 
    ? '#ef4444' 
    : caloriesProgress >= 1 
      ? '#22c55e' 
      : colors.primary;

  const consumedProtein = todayMeals.reduce((acc, m) => acc + (Number(m.protein) || 0), 0);
  const consumedCarbs = todayMeals.reduce((acc, m) => acc + (Number(m.carbs) || 0), 0);
  const consumedFat = todayMeals.reduce((acc, m) => acc + (Number(m.fat) || 0), 0);

  // Calculate Macros Targets (30% P, 40% C, 30% F)
  const targetProtein = Math.round((targetCalories * 0.3) / 4);
  const targetCarbs = Math.round((targetCalories * 0.4) / 4);
  const targetFat = Math.round((targetCalories * 0.3) / 9);

  useEffect(() => {
    (async () => {
      const savedName = await AsyncStorage.getItem('profile_name');
      const savedAvatar = await AsyncStorage.getItem('profile_avatar');
      if (savedName) setName(savedName);
      if (savedAvatar) setAvatarUri(savedAvatar);
      const savedGoal = await AsyncStorage.getItem('nutra:goal:calories');
      const v = savedGoal ? parseInt(savedGoal, 10) : NaN;
      setGoalOverride(!isNaN(v) ? v : null);
    })();
  }, []);

  const getInsight = () => {
    if (consumedCalories === 0) {
      return (
        <ThemedText style={StyleSheet.flatten([styles.insightText, { color: isDark ? '#e4e4e7' : '#27272a' }])}>
          Comece o dia registrando sua <ThemedText style={{ fontWeight: 'bold', color: colors.text }}>primeira refeição</ThemedText> para acompanhar seu progresso.
        </ThemedText>
      );
    }
    
    if (consumedProtein >= targetProtein) {
      return (
        <ThemedText style={StyleSheet.flatten([styles.insightText, { color: isDark ? '#e4e4e7' : '#27272a' }])}>
          Você atingiu sua meta de <ThemedText style={{ fontWeight: 'bold', color: colors.text, textDecorationLine: 'underline', textDecorationColor: 'rgba(255, 77, 141, 0.3)' }}>proteínas</ThemedText> hoje! Ótimo trabalho na construção muscular.
        </ThemedText>
      );
    }

    const progress = Math.round((consumedCalories / targetCalories) * 100);
    return (
      <ThemedText style={StyleSheet.flatten([styles.insightText, { color: isDark ? '#e4e4e7' : '#27272a' }])}>
        Você já consumiu <ThemedText style={{ fontWeight: 'bold', color: colors.text }}>{progress}%</ThemedText> da sua meta calórica diária. Continue assim!
      </ThemedText>
    );
  };

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.userRow}>
            <Link href="/settings" asChild>
              <Pressable style={StyleSheet.flatten([styles.avatarContainer, { borderColor: isDark ? '#27272a' : '#f3f4f6' }])}>
                {avatarUri && avatarUri.length > 0 ? (
                  <Image 
                    source={{ uri: avatarUri }} 
                    style={styles.avatarImage as ImageStyle} 
                    contentFit="cover"
                    onError={() => setAvatarUri(null)}
                  />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#18181b' : '#ffffff' }}>
                    <MaterialIcons name="person" size={24} color={isDark ? '#d1d5db' : '#4b5563'} />
                  </View>
                )}
              </Pressable>
            </Link>
            <View>
              <ThemedText style={StyleSheet.flatten([styles.hello, { color: colors.textSecondary }])}>BEM-VINDO</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.userName, { color: colors.text }])}>{name}</ThemedText>
            </View>
          </View>
          <Link href="/modal" asChild>
            <Pressable style={StyleSheet.flatten([styles.iconButton, { 
              backgroundColor: isDark ? '#18181b' : '#ffffff',
              borderColor: colors.border
            }])}>
              <MaterialIcons name="notifications-none" size={24} color={isDark ? '#d1d5db' : '#4b5563'} />
            </Pressable>
          </Link>
        </View>

        

        {/* Calories Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsInfo}>
            <View style={styles.statsValueRow}>
              <ThemedText style={StyleSheet.flatten([styles.statsValue, { color: isOver ? '#ef4444' : colors.text }])}>{displayCalories}</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.statsTarget, { color: colors.textSecondary }])}>/ {targetCalories}</ThemedText>
            </View>
            <ThemedText style={StyleSheet.flatten([styles.statsLabel, { color: isOver ? '#ef4444' : colors.textSecondary }])}>
              KCAL CONSUMIDAS HOJE
            </ThemedText>
          </View>
          
          <View style={styles.chartContainer}>
            <Svg width={128} height={128} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle
                cx="50"
                cy="50"
                r="44"
                stroke={isDark ? '#27272a' : '#f3f4f6'}
                strokeWidth="5"
                fill="transparent"
              />
              {caloriesProgress > 0 && (
                <Circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke={progressColor}
                  strokeWidth="7"
                  strokeDasharray={276.46}
                  strokeDashoffset={276.46 * (1 - caloriesProgress)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              )}
            </Svg>
            <View style={styles.chartIconContainer}>
              <MaterialIcons name="local-fire-department" size={32} color={progressColor} />
            </View>
          </View>
        </View>

        {/* Macro Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.macroList} style={{ marginHorizontal: -24, paddingHorizontal: 24, marginBottom: 40 }}>
          {/* Protein */}
          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={56} height={56} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={isDark ? '#27272a' : '#f3f4f6'} strokeWidth="4" fill="transparent" />
                {consumedProtein > 0 && (
                  <Circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    stroke={consumedProtein > targetProtein ? '#ef4444' : (consumedProtein >= targetProtein ? '#22c55e' : colors.primary)} 
                    strokeWidth="6" 
                    strokeDasharray={263.89} 
                    strokeDashoffset={263.89 * (1 - Math.min(consumedProtein / targetProtein, 1))} 
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                )}
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="kebab-dining" size={20} color={colors.text} style={{ opacity: 0.4 }} />
              </View>
            </View>
            <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.textSecondary }])}>PROTEÍNA</ThemedText>
            <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>{consumedProtein}g <ThemedText style={{ fontSize: 10, color: colors.textSecondary }}>/ {targetProtein}g</ThemedText></ThemedText>
          </View>

          {/* Carbs */}
          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={56} height={56} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={isDark ? '#27272a' : '#f3f4f6'} strokeWidth="4" fill="transparent" />
                {consumedCarbs > 0 && (
                  <Circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    stroke={consumedCarbs > targetCarbs ? '#ef4444' : (consumedCarbs >= targetCarbs ? '#22c55e' : colors.primary)} 
                    strokeWidth="6" 
                    strokeDasharray={263.89} 
                    strokeDashoffset={263.89 * (1 - Math.min(consumedCarbs / targetCarbs, 1))} 
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                )}
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="grass" size={20} color={colors.text} style={{ opacity: 0.4 }} />
              </View>
            </View>
            <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.textSecondary }])}>CARBOS</ThemedText>
            <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>{consumedCarbs}g <ThemedText style={{ fontSize: 10, color: colors.textSecondary }}>/ {targetCarbs}g</ThemedText></ThemedText>
          </View>

          {/* Fat */}
          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={56} height={56} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={isDark ? '#27272a' : '#f3f4f6'} strokeWidth="4" fill="transparent" />
                {consumedFat > 0 && (
                  <Circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    stroke={consumedFat > targetFat ? '#ef4444' : (consumedFat >= targetFat ? '#22c55e' : colors.primary)} 
                    strokeWidth="6" 
                    strokeDasharray={263.89} 
                    strokeDashoffset={263.89 * (1 - Math.min(consumedFat / targetFat, 1))} 
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                )}
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="spa" size={20} color={colors.text} style={{ opacity: 0.4 }} />
              </View>
            </View>
            <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.textSecondary }])}>GORDURA</ThemedText>
            <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>{consumedFat}g <ThemedText style={{ fontSize: 10, color: colors.textSecondary }}>/ {targetFat}g</ThemedText></ThemedText>
          </View>
        </ScrollView>



        {/* Berry Insights */}
        <View style={styles.sectionContainer}>
          <View style={StyleSheet.flatten([styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.insightIconPos}>
               <MaterialIcons name="auto-awesome" size={24} color={colors.text} style={{ opacity: 0.2 }} />
            </View>
            <ThemedText style={StyleSheet.flatten([styles.insightLabel, { color: colors.textSecondary }])}>BERRY INSIGHTS</ThemedText>
            {getInsight()}
          </View>
        </View>

        {/* Recentes */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>RECENTES</ThemedText>
            <Pressable onPress={() => router.push('/(tabs)/meals')}>
              <ThemedText style={StyleSheet.flatten([styles.seeAllText, { color: colors.textSecondary }])}>VER TUDO</ThemedText>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentList} style={{ marginHorizontal: -24, paddingHorizontal: 24 }}>
             {recentMeals.length > 0 ? recentMeals.map((item) => (
                <View key={item.id} style={StyleSheet.flatten([styles.recentCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
                  <View style={styles.recentImageContainer}>
                     {item.imageUri ? (
                       <Image source={{ uri: item.imageUri }} style={styles.recentImage} />
                     ) : (
                       <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#1f2937' : '#e5e7eb' }}>
                         <IconSymbol name="bowl" size={48} color={colors.textSecondary} />
                       </View>
                     )}
                     <View style={StyleSheet.flatten([styles.timeTag, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' }])}>
                       <ThemedText style={StyleSheet.flatten([styles.timeText, { color: colors.text }])}>
                         {item.createdAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                       </ThemedText>
                     </View>
                  </View>
                  <View style={styles.recentContent}>
                    <ThemedText style={StyleSheet.flatten([styles.recentTitle, { color: colors.text }])} numberOfLines={1}>{item.name}</ThemedText>
                    <View style={styles.recentMeta}>
                      <View style={StyleSheet.flatten([styles.dot, { backgroundColor: colors.accent }])} />
                      <ThemedText style={StyleSheet.flatten([styles.recentKcal, { color: colors.textSecondary }])}>{item.calories} KCAL</ThemedText>
                    </View>
                  </View>
                </View>
             )) : (
               <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 48 }}>
                 <ThemedText style={{ color: colors.textSecondary, textAlign: 'center' }}>Nenhuma refeição recente</ThemedText>
               </View>
             )}
          </ScrollView>
        </View>

        {/* Bottom spacing for TabBar */}
        <View style={{ height: 85 }} />

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
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  hello: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
    marginRight: 16,
    height: '100%',
  },
  assistantButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  statsInfo: {
    flex: 1,
  },
  statsValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 60,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 64,
  },
  statsTarget: {
    fontSize: 20,
    fontWeight: '500',
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  chartContainer: {
    position: 'relative',
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartIconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroList: {
    gap: 16,
  },
  macroCard: {
    minWidth: 120,
    padding: 20,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 8,
  },
  macroChartContainer: {
    width: 56,
    height: 56,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  macroIconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroLabel: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 1,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoriesSection: {
    marginBottom: 48,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  categoriesList: {
    gap: 32,
  },
  categoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    minWidth: 85,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryName: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sectionContainer: {
    marginBottom: 40,
  },
  insightCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  insightIconPos: {
    position: 'absolute',
    top: 24,
    right: 24,
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  insightText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
    paddingRight: 32,
  },
  recentList: {
    gap: 16,
  },
  recentCard: {
    width: 200,
    borderRadius: 36,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recentImageContainer: {
    height: 160,
    position: 'relative',
  },
  recentImage: {
    width: '100%',
    height: '100%',
  },
  timeTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  timeText: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  recentContent: {
    padding: 20,
    gap: 8,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  recentKcal: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
