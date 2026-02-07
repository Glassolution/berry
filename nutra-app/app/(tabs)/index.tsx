import { StyleSheet, Pressable, View, TextInput, ScrollView, ImageStyle, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Link } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useQuiz } from '@/src/context/QuizContext';

const CATEGORIES = [
  { name: 'VEGANO', icon: 'spa' },
  { name: 'CARBOS', icon: 'bakery-dining' },
  { name: 'PROTEÍNA', icon: 'dinner-dining' }, // meal_dinner -> dinner-dining
  { name: 'LANCHES', icon: 'fastfood' },
  { name: 'BEBIDAS', icon: 'local-cafe' },
];

const RECENTS = [
  { 
    name: 'Salmão Grelhado', 
    kcal: '550 kcal', 
    time: '12:37', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDykt7xFUAhYvZZKQsQ4uBlQtJDsXYo-YrUCk-4kUO7BjD9E21BHtpFqY4xTSR0V2slm2GKA40UEcPMXhIL-mxs8GghmT2ZDUzwo8b-qRqJvmreFJI9SBGM65qv1AMBsWKujEs_KYshZWKO3ylE4kB8hKxddXHK6Yw4cbGHMyR_nnmOsAfo5-emF_kBPmnkUhnGUEtEfr-ldjFVBsQxpScyU3kQzi9kOkTHCK7GtJQwHSCFWUXnEgk3ClJT5lffkYxgV8RDnjv84bMG' 
  },
  { 
    name: 'Bowl Mediterrâneo', 
    kcal: '320 kcal', 
    time: '08:15', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDltbdqPy6JRGVD9R_HQQFccstHiCZqhCam-WJr6OWi5jjXAs_GsZi-58SCmIkJB0lmP1FfDEAn-wvoQtYb3hokXWb8GNPrZD9AIf5z3BDFNkOeb41TiH8xMirrg81mSEYZEnwchsFL-tdlPpXn7eGLU4UAMcszenXUoRKErJ1S9uALoB9BM4iEsZ66foNqY8GH_QwKQwXgypX3OKpVTqRioZ72cOJaTJVP-P4PJBWOySITCw8wiZUbR9sI0xf4xFNWj1iDLpX1A1OU' 
  },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const { quizData } = useQuiz();
  const isDark = theme === 'dark';

  // Calculate Daily Calories (TDEE)
  const calculateTDEE = () => {
    // Mifflin-St Jeor Equation
    // Men: 10W + 6.25H - 5A + 5
    // Women: 10W + 6.25H - 5A - 161
    const { gender, weight, height, age, activityLevel } = quizData;
    
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += gender === 'homem' ? 5 : -161;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    return Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
  };

  const activePlan = (quizData as any).activeDietPlan as any;
  const targetCalories = typeof activePlan?.calories === 'number' ? activePlan.calories : calculateTDEE();
  // Assume 0 consumed for now
  const consumedCalories = 0; 
  const remainingCalories = targetCalories - consumedCalories;
  
  // Calculate Macros (30% P, 40% C, 30% F)
  const proteinGrams = typeof activePlan?.macros?.protein === 'number' ? activePlan.macros.protein : Math.round((targetCalories * 0.3) / 4);
  const carbsGrams = typeof activePlan?.macros?.carbs === 'number' ? activePlan.macros.carbs : Math.round((targetCalories * 0.4) / 4);
  const fatGrams = typeof activePlan?.macros?.fats === 'number' ? activePlan.macros.fats : Math.round((targetCalories * 0.3) / 9);

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

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.userRow}>
            <Link href="/meals" asChild>
              <Pressable style={StyleSheet.flatten([styles.avatarContainer, { borderColor: isDark ? '#27272a' : '#f3f4f6' }])}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA702fxZxwhXSBJzRRUZMTyGOjR5zeQsmNAaMFCpjMIwlfIEy_rwEqBEOPPHXos8jV2HKeZCQNRpuEFsP6OtGwvcFKmFiwOf9Gqo3qcy7hrcaT2WTLx_bmYhMujbND0iDkZjGR8ReTQxQcbmyt2oTKg28MgXc5ruzAwQtdk3tQQtg1o3TaOpC3RQ7f7zc6oKGQQfeqMF4-AmCMmsaC3WZGf8IRgwv_GJKRr_705JLdPgecSJf6mbJVXfwjzRPKa_EAcDKiF9IrgS6Et' }}
                  style={styles.avatarImage as ImageStyle}
                />
              </Pressable>
            </Link>
            <View>
              <ThemedText style={StyleSheet.flatten([styles.hello, { color: colors.textSecondary }])}>BEM-VINDO</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.userName, { color: colors.text }])}>Floyd Miles</ThemedText>
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

        {/* Search & Assistant */}
        <View style={styles.searchRow}>
          <View style={StyleSheet.flatten([styles.searchBox, { 
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            borderColor: colors.border
          }])}>
            <MaterialIcons name="search" size={24} color="#9ca3af" style={{ marginLeft: 16 }} />
            <TextInput
              placeholder="O que você comeu?"
              placeholderTextColor="#9ca3af"
              style={StyleSheet.flatten([styles.searchInput, { color: colors.text }])}
            />
          </View>
          <Pressable style={StyleSheet.flatten([styles.assistantButton, { backgroundColor: colors.primary }])}>
            <MaterialIcons name="auto-awesome" size={24} color={colors.primaryForeground} />
          </Pressable>
        </View>

        {/* Calories Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsInfo}>
            <View style={styles.statsValueRow}>
              <ThemedText style={StyleSheet.flatten([styles.statsValue, { color: colors.text }])}>{remainingCalories}</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.statsTarget, { color: colors.textSecondary }])}>/ {targetCalories}</ThemedText>
            </View>
            <ThemedText style={StyleSheet.flatten([styles.statsLabel, { color: colors.textSecondary }])}>KCAL RESTANTES HOJE</ThemedText>
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
              <Circle
                cx="50"
                cy="50"
                r="44"
                stroke={colors.primary}
                strokeWidth="7"
                strokeDasharray={276.46}
                strokeDashoffset={138.23}
                strokeLinecap="round"
                fill="transparent"
              />
            </Svg>
            <View style={styles.chartIconContainer}>
              <MaterialIcons name="local-fire-department" size={32} color={colors.primary} />
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
                <Circle cx="50" cy="50" r="42" stroke={colors.primary} strokeWidth="6" strokeDasharray={263.89} strokeDashoffset={131.9} strokeLinecap="round" fill="transparent" />
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="kebab-dining" size={20} color={colors.text} style={{ opacity: 0.4 }} />
              </View>
            </View>
            <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.textSecondary }])}>PROTEÍNA</ThemedText>
            <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>{proteinGrams}g</ThemedText>
          </View>

          {/* Carbs */}
          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={56} height={56} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={isDark ? '#27272a' : '#f3f4f6'} strokeWidth="4" fill="transparent" />
                <Circle cx="50" cy="50" r="42" stroke={colors.primary} strokeWidth="6" strokeDasharray={263.89} strokeDashoffset={100.2} strokeLinecap="round" fill="transparent" />
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="grass" size={20} color={colors.text} style={{ opacity: 0.4 }} />
              </View>
            </View>
            <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.textSecondary }])}>CARBOS</ThemedText>
            <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>{carbsGrams}g</ThemedText>
          </View>

          {/* Fat */}
          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={56} height={56} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={isDark ? '#27272a' : '#f3f4f6'} strokeWidth="4" fill="transparent" />
                <Circle cx="50" cy="50" r="42" stroke={colors.primary} strokeWidth="6" strokeDasharray={263.89} strokeDashoffset={184.7} strokeLinecap="round" fill="transparent" />
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="spa" size={20} color={colors.text} style={{ opacity: 0.4 }} />
              </View>
            </View>
            <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.textSecondary }])}>GORDURA</ThemedText>
            <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>{fatGrams}g</ThemedText>
          </View>
        </ScrollView>

        {/* Minha Dieta */}
        <View style={styles.sectionContainer}>
          <Link href="/diet" asChild>
            <Pressable style={StyleSheet.flatten([styles.dietCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
              <View style={styles.dietCardLeft}>
                <View style={StyleSheet.flatten([styles.dietIcon, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: colors.border }])}>
                  <MaterialIcons name="restaurant-menu" size={22} color={colors.text} />
                </View>
                <View style={{ gap: 2 }}>
                  <ThemedText style={StyleSheet.flatten([styles.dietTitle, { color: colors.text }])}>Minha Dieta</ThemedText>
                  <ThemedText style={StyleSheet.flatten([styles.dietSubtitle, { color: colors.textSecondary }])}>
                    {activePlan ? 'Plano ativo pronto' : 'Gerar plano ativo'}
                  </ThemedText>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </Pressable>
          </Link>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>CATEGORIAS</ThemedText>
            <Pressable>
              <ThemedText style={StyleSheet.flatten([styles.seeAllText, { color: colors.textSecondary }])}>VER TUDO</ThemedText>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList} style={{ marginHorizontal: -24, paddingHorizontal: 24 }}>
            {CATEGORIES.map((cat, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={StyleSheet.flatten([styles.categoryIcon, { 
                  backgroundColor: isDark ? '#18181b' : '#ffffff', 
                  borderColor: colors.border 
                }])}>
                  <MaterialIcons name={cat.icon as any} size={32} color={colors.text} />
                </View>
                <ThemedText style={StyleSheet.flatten([styles.categoryName, { color: colors.text }])}>{cat.name}</ThemedText>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Berry Insights */}
        <View style={styles.sectionContainer}>
          <View style={StyleSheet.flatten([styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.insightIconPos}>
               <MaterialIcons name="auto-awesome" size={24} color={colors.text} style={{ opacity: 0.2 }} />
            </View>
            <ThemedText style={StyleSheet.flatten([styles.insightLabel, { color: colors.textSecondary }])}>BERRY INSIGHTS</ThemedText>
            <ThemedText style={StyleSheet.flatten([styles.insightText, { color: isDark ? '#e4e4e7' : '#27272a' }])}>
              Sua ingestão de <ThemedText style={{ fontWeight: 'bold', color: colors.text, textDecorationLine: 'underline', textDecorationColor: 'rgba(255, 77, 141, 0.3)' }}>proteínas está 30% maior</ThemedText>. Excelente ritmo para recuperação muscular.
            </ThemedText>
          </View>
        </View>

        {/* Recentes */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>RECENTES</ThemedText>
            <Pressable>
              <ThemedText style={StyleSheet.flatten([styles.seeAllText, { color: colors.textSecondary }])}>VER TUDO</ThemedText>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentList} style={{ marginHorizontal: -24, paddingHorizontal: 24 }}>
             {RECENTS.map((item, index) => (
                <View key={index} style={StyleSheet.flatten([styles.recentCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
                  <View style={styles.recentImageContainer}>
                     <Image source={{ uri: item.image }} style={styles.recentImage} />
                     <View style={StyleSheet.flatten([styles.timeTag, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' }])}>
                       <ThemedText style={StyleSheet.flatten([styles.timeText, { color: colors.text }])}>{item.time}</ThemedText>
                     </View>
                  </View>
                  <View style={styles.recentContent}>
                    <ThemedText style={StyleSheet.flatten([styles.recentTitle, { color: colors.text }])}>{item.name}</ThemedText>
                    <View style={styles.recentMeta}>
                      <View style={StyleSheet.flatten([styles.dot, { backgroundColor: colors.accent }])} />
                      <ThemedText style={StyleSheet.flatten([styles.recentKcal, { color: colors.textSecondary }])}>{item.kcal}</ThemedText>
                    </View>
                  </View>
                </View>
             ))}
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
  sectionContainer: {
    marginBottom: 40,
  },
  dietCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dietCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dietIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dietTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  dietSubtitle: {
    fontSize: 12,
    fontWeight: '600',
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
