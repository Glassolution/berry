import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, ScrollView, Dimensions, StatusBar, Switch } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useAuth } from '@/src/context/AuthContext';
import { useQuiz } from '@/src/context/QuizContext';
import { useNutrition } from '@/src/context/NutritionContext';
import { useTheme } from '@/context/ThemeContext';
import { calculateDietPlan } from '@/src/utils/nutritionCalculations';

// Colors from Design (Matching Dashboard)
const COLORS = {
  berryRed: "#ee2b5b",
  berryOrange: "#FF8C42",
  berryBg: "#FFFFFF",
  berryCard: "#FDFDFD",
  gray900: "#111827",
  gray700: "#374151",
  gray400: "#9CA3AF",
  gray300: "#D1D5DB",
  gray100: "#F3F4F6",
  white: "#FFFFFF",
  black: "#000000",
  success: "#22C55E",
};

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const { quizData } = useQuiz();
  const { theme, setTheme } = useTheme();
  
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  // User Data
  const userName = session?.user?.user_metadata?.full_name || "Floyd Miles";
  
  // Get Nutrition Data from Context
  const { 
    targetCalories, 
    remainingCalories,
    consumedCalories,
    consumedMacros 
  } = useNutrition();

  // Calculate Diet Plan (For Metadata Labels)
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

  // Macros (Display Consumed)
  const proteinGrams = consumedMacros.protein;
  const carbsGrams = consumedMacros.carbs;
  const fatGrams = consumedMacros.fats;

  // Goal & Meta Info
  const goalLabel = calculatedPlan.goalType === 'lose' ? 'Perda de Peso' : calculatedPlan.goalType === 'gain' ? 'Ganho de Massa' : 'Manter Peso';
  const activityLabel = { sedentary: 'Sedentário', light: 'Leve', moderate: 'Moderado', active: 'Ativo', very_active: 'Muito Ativo' }[quizData.activityLevel as string] || 'Moderado';

  // Progress (Visualizes Consumed Calories)
  // Bar starts empty (0%) and fills as calories are consumed
  const progress = Math.max(0, Math.min(consumedCalories / targetCalories, 1));
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        
        {/* HERO SECTION (Matches Dashboard) */}
        <View style={styles.heroSection}>
            <Image 
                source={require('@/assets/images/prato 1.png')}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
            />
            {/* Gradient Overlay */}
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.9)']}
                locations={[0, 0.3, 0.6, 1]}
                style={StyleSheet.absoluteFillObject}
            />
            
            {/* Header Overlay */}
            <SafeAreaView style={styles.headerOverlay} edges={['top']}>
                <View style={styles.headerContent}>
                    <View style={styles.userRow}>
                         <View style={styles.avatarContainer}>
                             <Image 
                                 source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA702fxZxwhXSBJzRRUZMTyGOjR5zeQsmNAaMFCpjMIwlfIEy_rwEqBEOPPHXos8jV2HKeZCQNRpuEFsP6OtGwvcFKmFiwOf9Gqo3qcy7hrcaT2WTLx_bmYhMujbND0iDkZjGR8ReTQxQcbmyt2oTKg28MgXc5ruzAwQtdk3tQQtg1o3TaOpC3RQ7f7zc6oKGQQfeqMF4-AmCMmsaC3WZGf8IRgwv_GJKRr_705JLdPgecSJf6mbJVXfwjzRPKa_EAcDKiF9IrgS6Et" }}
                                 style={styles.avatarImage}
                                 contentFit="cover"
                             />
                         </View>
                         <View>
                             <Text style={styles.greetingText}>MEU PERFIL</Text>
                             <Text style={styles.userName}>{userName}</Text>
                         </View>
                    </View>
                    <Pressable style={styles.searchButton}>
                        <MaterialIcons name="settings" size={24} color="white" />
                    </Pressable>
                </View>
            </SafeAreaView>

            {/* Bottom Hero Content */}
            <View style={styles.heroBottomContent}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>MEU PLANO</Text>
                </View>
                <Text style={styles.dishTitle}>Objetivo: {goalLabel}</Text>
                <View style={styles.dishMeta}>
                    <View style={styles.metaItem}>
                        <MaterialIcons name="fitness-center" size={16} color={COLORS.berryRed} />
                        <Text style={styles.metaText}>{activityLabel}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <MaterialIcons name="track-changes" size={16} color={COLORS.berryRed} />
                        <Text style={styles.metaText}>Meta: {quizData.goalWeight}kg</Text>
                    </View>
                </View>
            </View>
        </View>

        {/* STATS SECTION (Floating Card) */}
        <View style={styles.statsSection}>
             <View style={styles.statsCard}>
                 <View style={styles.statsHeader}>
                     <View style={styles.statsTextContainer}>
                         <View style={styles.kcalRow}>
                             <Text style={styles.kcalValue}>{consumedCalories}</Text>
                             <Text style={styles.kcalTarget}>/ {targetCalories}</Text>
                         </View>
                         <Text style={styles.kcalLabel}>KCAL CONSUMIDAS</Text>
                     </View>
                     
                     {/* Circular Chart */}
                     <View style={styles.chartContainer}>
                         <Svg height="96" width="96" viewBox="0 0 96 96">
                             <Circle cx="48" cy="48" r="40" stroke={COLORS.gray100} strokeWidth="8" fill="transparent" />
                             <Circle 
                                cx="48" 
                                cy="48" 
                                r="40" 
                                stroke={COLORS.berryRed} 
                                strokeWidth="8" 
                                fill="transparent" 
                                strokeDasharray={`${2 * Math.PI * 40}`} 
                                strokeDashoffset={`${strokeDashoffset}`}
                                strokeLinecap="round" 
                                transform="rotate(-90 48 48)" 
                             />
                         </Svg>
                         <View style={styles.chartIcon}>
                             <MaterialIcons name="local-fire-department" size={24} color={COLORS.berryRed} />
                         </View>
                     </View>
                 </View>
                 
                 <View style={styles.separator} />
                 
                 <View style={styles.macrosRow}>
                     <View style={styles.macroItem}>
                         <View style={[styles.dot, { backgroundColor: COLORS.berryRed }]} />
                         <Text style={styles.macroText}>{proteinGrams}g Prot</Text>
                     </View>
                     <View style={styles.macroItem}>
                         <View style={[styles.dot, { backgroundColor: COLORS.berryOrange }]} />
                         <Text style={styles.macroText}>{carbsGrams}g Carb</Text>
                     </View>
                     <View style={styles.macroItem}>
                         <View style={[styles.dot, { backgroundColor: COLORS.gray300 }]} />
                         <Text style={styles.macroText}>{fatGrams}g Gord</Text>
                     </View>
                 </View>
             </View>
        </View>

        {/* SETTINGS LIST */}
        <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>
            
            <View style={styles.settingsList}>
                {/* Conta */}
                <Pressable style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <View style={styles.settingIconBox}>
                            <MaterialIcons name="person" size={20} color={COLORS.gray900} />
                        </View>
                        <Text style={styles.settingText}>Conta</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={COLORS.gray400} />
                </Pressable>

                {/* Metas */}
                <Pressable style={styles.settingItem} onPress={() => router.push('/(tabs)/progress')}>
                    <View style={styles.settingLeft}>
                        <View style={styles.settingIconBox}>
                            <MaterialIcons name="track-changes" size={20} color={COLORS.gray900} />
                        </View>
                        <Text style={styles.settingText}>Metas</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={COLORS.gray400} />
                </Pressable>

                {/* Modo Escuro */}
                <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <View style={styles.settingIconBox}>
                            <MaterialIcons name="dark-mode" size={20} color={COLORS.gray900} />
                        </View>
                        <Text style={styles.settingText}>Modo Escuro</Text>
                    </View>
                    <Switch 
                        value={isDark} 
                        onValueChange={toggleTheme}
                        trackColor={{ false: COLORS.gray100, true: COLORS.gray900 }}
                        thumbColor={COLORS.white}
                    />
                </View>

                {/* Sair */}
                <Pressable style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={signOut}>
                    <View style={styles.settingLeft}>
                        <View style={[styles.settingIconBox, { backgroundColor: '#FEE2E2' }]}>
                            <MaterialIcons name="logout" size={20} color={COLORS.berryRed} />
                        </View>
                        <Text style={[styles.settingText, { color: COLORS.berryRed }]}>Sair</Text>
                    </View>
                </Pressable>
            </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.berryBg,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    height: 320, 
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  greetingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Manrope_800ExtraBold',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroBottomContent: {
    padding: 24,
    paddingBottom: 40, 
  },
  badge: {
    backgroundColor: COLORS.berryOrange,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: 'Manrope_800ExtraBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dishTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontFamily: 'Manrope_800ExtraBold',
    lineHeight: 34,
    marginBottom: 12,
  },
  dishMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginTop: -30, 
    zIndex: 10,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24, 
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsTextContainer: {
    flexDirection: 'column',
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  kcalValue: {
    fontSize: 48,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.berryRed,
    letterSpacing: -2,
    lineHeight: 56,
  },
  kcalTarget: {
    fontSize: 24,
    fontFamily: 'Manrope_700Bold',
    color: COLORS.gray300,
  },
  kcalLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  chartContainer: {
    width: 96,
    height: 96,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartIcon: {
    position: 'absolute',
  },
  separator: {
    height: 1,
    backgroundColor: '#F9FAFB', 
    marginVertical: 20,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroText: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingsSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.gray900,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  settingsList: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    color: COLORS.gray900,
  },
});
