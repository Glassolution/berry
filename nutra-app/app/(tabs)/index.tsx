import React from 'react';
import { StyleSheet, Pressable, View, Text, ScrollView, StatusBar, Alert } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useAuth } from '@/src/context/AuthContext';
import { useNutrition } from '@/src/context/NutritionContext';
import { useInsights } from '@/src/context/InsightsContext';
import { InsightCard } from '@/components/InsightCard';

// Colors from New Design
const COLORS = {
  primary: "#FF4B4B", 
  navy: "#1A1C2E",
  background: "#FAFBFC",
  white: "#FFFFFF",
  slate900: "#0F172A",
  slate400: "#94A3B8",
  slate100: "#F1F5F9",
  slate50: "#F8FAFC",
  orange50: "#FFF7ED",
  orange500: "#F97316",
  orange600: "#EA580C",
  red100: "#FEE2E2",
  red200: "#FECACA",
  blue500: "#3B82F6",
  yellow500: "#EAB308",
  pink500: "#EC4899",
};

export default function DashboardScreen() {
  const { session } = useAuth();
  const { 
    targetCalories, 
    remainingCalories, 
    consumedCalories, 
    consumedMacros, 
    mealLogs,
  } = useNutrition();

  const { activeInsight, isInsightsHidden, dismissUntilNew } = useInsights();

  // Progress Calculations
  const safeTargetCalories = Math.max(1, Number.isFinite(targetCalories) ? targetCalories : 0);
  const consumedProgress = Math.max(0, Math.min(consumedCalories / safeTargetCalories, 1));

  const formatKcal = (value: number) => {
    const rounded = Math.max(0, Math.round(value));
    return rounded.toLocaleString('pt-BR');
  };

  const arcSize = 280;
  const arcStrokeWidth = 10;
  const arcCenter = arcSize / 2;
  const arcRadius = 120;
  const arcCircumference = 2 * Math.PI * arcRadius;
  const arcRatio = 0.68;
  const arcLength = arcCircumference * arcRatio;
  const arcRotation = 150;

  // Macros Progress
  const macroRadius = 22;
  const macroCircumference = 2 * Math.PI * macroRadius;
  
  const getMacroProgress = (current: number, total: number = 150) => { 
      const p = Math.max(0, Math.min(current / total, 1));
      return macroCircumference * (1 - p);
  }

  const userMetadata = (session?.user?.user_metadata ?? {}) as any;
  const avatarUrl: string | undefined = userMetadata.avatar_url || userMetadata.picture;

  // Calendar Mock Data
  const weekDays = [
      { day: 'Dom', date: '8', active: false },
      { day: 'Seg', date: '9', active: false },
      { day: 'Ter', date: '10', active: true },
      { day: 'Qua', date: '11', active: false },
      { day: 'Qui', date: '12', active: false },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* HEADER */}
      <SafeAreaView style={styles.header} edges={['top']}>
          <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                    <View style={styles.logoBox}>
                        <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <Path d="M12 22C16.5 22 20 18.5 20 14C20 9.5 17 5 12 5C7 5 4 9.5 4 14C4 18.5 7.5 22 12 22Z" fill="white"/>
                            <Path d="M12 5C12 3 13 2 15 2M12 5C12 3 11 2 9 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            <Circle cx="9" cy="11" r="1" fill={COLORS.primary} />
                            <Circle cx="15" cy="11" r="1" fill={COLORS.primary} />
                            <Circle cx="12" cy="14" r="1" fill={COLORS.primary} />
                            <Circle cx="8" cy="16" r="1" fill={COLORS.primary} />
                            <Circle cx="16" cy="16" r="1" fill={COLORS.primary} />
                        </Svg>
                    </View>
                    <Text style={styles.logoText}>Berry</Text>
                </View>

              <View style={styles.headerRight}>
                  <View style={styles.streakBadge}>
                      <MaterialIcons name="local-fire-department" size={20} color={COLORS.orange600} />
                      <Text style={styles.streakText}>12</Text>
                  </View>
                  <Link href="/(tabs)/meals" asChild>
                      <Pressable style={styles.avatarContainer}>
                          {avatarUrl ? (
                              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} contentFit="cover" />
                          ) : (
                              <View style={styles.avatarFallback}>
                                  <Text style={styles.avatarFallbackText}>U</Text>
                              </View>
                          )}
                      </Pressable>
                  </Link>
              </View>
          </View>
      </SafeAreaView>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* CALENDAR STRIP */}
        <View style={styles.calendarContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
                {weekDays.map((item, index) => (
                    <View 
                        key={index} 
                        style={[
                            styles.calendarItem, 
                            item.active ? styles.calendarItemActive : styles.calendarItemInactive
                        ]}
                    >
                        <Text style={[styles.calendarDay, item.active ? styles.textWhite90 : styles.textSlate400]}>
                            {item.day}
                        </Text>
                        <Text style={[styles.calendarDate, item.active ? styles.textWhite : styles.textSlate400]}>
                            {item.date}
                        </Text>
                        {item.active && <View style={styles.activeDot} />}
                    </View>
                ))}
            </ScrollView>
        </View>

        {/* MAIN CONTENT AREA */}
        <View style={styles.mainContent}>
            
            {/* GAUGE CARD */}
            <View style={styles.mainCard}>
                <View style={styles.calorieCardContent}>
                    <View style={styles.arcWrapper}>
                        <Svg width={arcSize} height={arcSize} viewBox={`0 0 ${arcSize} ${arcSize}`} style={styles.arcSvg}>
                            <Defs>
                                <LinearGradient id="calArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <Stop offset="0%" stopColor={COLORS.primary} />
                                    <Stop offset="100%" stopColor="#FF904B" />
                                </LinearGradient>
                            </Defs>

                            <Circle
                                cx={arcCenter}
                                cy={arcCenter}
                                r={arcRadius}
                                stroke={COLORS.slate100}
                                strokeWidth={arcStrokeWidth}
                                fill="transparent"
                                strokeLinecap="round"
                                strokeDasharray={`${arcLength} ${arcCircumference}`}
                                transform={`rotate(${arcRotation} ${arcCenter} ${arcCenter})`}
                            />
                            <Circle
                                cx={arcCenter}
                                cy={arcCenter}
                                r={arcRadius}
                                stroke="url(#calArcGradient)"
                                strokeWidth={arcStrokeWidth}
                                fill="transparent"
                                strokeLinecap="round"
                                strokeDasharray={`${arcLength * consumedProgress} ${arcCircumference}`}
                                transform={`rotate(${arcRotation} ${arcCenter} ${arcCenter})`}
                            />
                        </Svg>

                        <View style={styles.calorieTextContent}>
                            <MaterialCommunityIcons name="fire" size={22} color={COLORS.primary} style={styles.calorieFireIcon} />
                            <Text style={styles.calorieValue}>{formatKcal(remainingCalories)}</Text>
                            <Text style={styles.calorieSubtitle}>CALORIAS RESTANTES</Text>

                            <View style={styles.calorieMetaPill}>
                                <Text style={styles.calorieMetaText}>META: {formatKcal(targetCalories)} KCAL</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* MACROS GRID */}
            <View style={styles.macrosGrid}>
                {/* Protein */}
                <View style={styles.macroCard}>
                    <View style={styles.macroRingContainer}>
                        <Svg height="56" width="56" viewBox="0 0 56 56">
                             <Circle cx="28" cy="28" r={macroRadius} stroke={COLORS.slate50} strokeWidth="4" fill="transparent" />
                             <Circle 
                                cx="28" 
                                cy="28" 
                                r={macroRadius} 
                                stroke={COLORS.blue500} 
                                strokeWidth="4" 
                                fill="transparent" 
                                strokeDasharray={`${macroCircumference}`} 
                                strokeDashoffset={`${getMacroProgress(consumedMacros.protein, 150)}`} 
                                strokeLinecap="round" 
                                transform="rotate(-90 28 28)" 
                             />
                        </Svg>
                        <View style={styles.absoluteCenter}>
                            <MaterialCommunityIcons name="food-drumstick" size={20} color={COLORS.blue500} />
                        </View>
                    </View>
                    <Text style={styles.macroValueLarge}>{Math.round(consumedMacros.protein)}g</Text>
                    <Text style={styles.macroLabel}>PROTEÍNA</Text>
                </View>

                {/* Carbs */}
                <View style={styles.macroCard}>
                    <View style={styles.macroRingContainer}>
                         <Svg height="56" width="56" viewBox="0 0 56 56">
                             <Circle cx="28" cy="28" r={macroRadius} stroke={COLORS.slate50} strokeWidth="4" fill="transparent" />
                             <Circle 
                                cx="28" 
                                cy="28" 
                                r={macroRadius} 
                                stroke={COLORS.yellow500} 
                                strokeWidth="4" 
                                fill="transparent" 
                                strokeDasharray={`${macroCircumference}`} 
                                strokeDashoffset={`${getMacroProgress(consumedMacros.carbs, 200)}`}
                                strokeLinecap="round" 
                                transform="rotate(-90 28 28)" 
                             />
                        </Svg>
                        <View style={styles.absoluteCenter}>
                            <MaterialCommunityIcons name="food-croissant" size={20} color={COLORS.yellow500} />
                        </View>
                    </View>
                    <Text style={styles.macroValueLarge}>{Math.round(consumedMacros.carbs)}g</Text>
                    <Text style={styles.macroLabel}>CARBO</Text>
                </View>

                {/* Fats */}
                <View style={styles.macroCard}>
                    <View style={styles.macroRingContainer}>
                        <Svg height="56" width="56" viewBox="0 0 56 56">
                             <Circle cx="28" cy="28" r={macroRadius} stroke={COLORS.slate50} strokeWidth="4" fill="transparent" />
                             <Circle 
                                cx="28" 
                                cy="28" 
                                r={macroRadius} 
                                stroke={COLORS.pink500} 
                                strokeWidth="4" 
                                fill="transparent" 
                                strokeDasharray={`${macroCircumference}`} 
                                strokeDashoffset={`${getMacroProgress(consumedMacros.fats, 60)}`}
                                strokeLinecap="round" 
                                transform="rotate(-90 28 28)" 
                             />
                        </Svg>
                         <View style={styles.absoluteCenter}>
                            <MaterialCommunityIcons name="cheese" size={20} color={COLORS.pink500} />
                        </View>
                    </View>
                    <Text style={styles.macroValueLarge}>{Math.round(consumedMacros.fats)}g</Text>
                    <Text style={styles.macroLabel}>GORDURAS</Text>
                </View>
            </View>

            {/* AI INSIGHTS */}
            {!isInsightsHidden ? (
              <View style={styles.sectionSpacing}>
                  {activeInsight ? (
                      <InsightCard 
                          insight={activeInsight} 
                          onDismiss={dismissUntilNew}
                      />
                  ) : (
                      <View style={styles.insightPlaceholder}>
                           <View style={styles.insightIconBox}>
                              <MaterialIcons name="auto-awesome" size={24} color="white" />
                          </View>
                          <View style={styles.insightContent}>
                              <View style={styles.insightHeaderRow}>
                                <Text style={styles.insightTitle}>SEM INSIGHTS AGORA</Text>
                                <Pressable onPress={dismissUntilNew} hitSlop={10}>
                                  <MaterialIcons name="close" size={16} color="white" style={{ opacity: 0.6 }} />
                                </Pressable>
                              </View>
                              <Text style={styles.insightText}>
                                  Continue registrando suas refeições para receber dicas personalizadas da IA.
                              </Text>
                          </View>
                      </View>
                  )}
              </View>
            ) : null}

             {/* RECENT MEALS */}
             <View style={styles.sectionSpacing}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recentes</Text>
                    <Pressable>
                        <Text style={styles.seeAllText}>Ver tudo</Text>
                    </Pressable>
                </View>
                
                {mealLogs.length === 0 ? (
                    <View style={styles.emptyState}>
                         <MaterialIcons name="camera-alt" size={32} color={COLORS.slate400} />
                         <Text style={styles.emptyStateText}>Sem registros hoje</Text>
                    </View>
                ) : (
                     <View style={styles.recentList}>
                        {mealLogs.slice(0, 3).map((log) => (
                            <Pressable 
                                key={log.id} 
                                style={styles.recentItem}
                                onPress={() => Alert.alert('Detalhes', `${log.name}\n${log.calories} kcal`)}
                            >
                                <Image 
                                    source={log.imageUri ? { uri: log.imageUri } : require('@/assets/images/prato 3.png')} 
                                    style={styles.recentImage} 
                                    contentFit="cover" 
                                />
                                <View style={styles.recentInfo}>
                                    <Text style={styles.recentName}>{log.name}</Text>
                                    <Text style={styles.recentTime}>
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                                <Text style={styles.recentKcal}>{log.calories} kcal</Text>
                            </Pressable>
                        ))}
                     </View>
                )}
             </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoBox: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.red200,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: -1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.orange50,
  },
  streakText: {
    color: COLORS.orange600,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 6,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: COLORS.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    fontWeight: 'bold',
    color: COLORS.slate400
  },
  scrollContent: {
    paddingBottom: 160,
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  calendarScroll: {
    gap: 8,
    paddingVertical: 8,
  },
  calendarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  calendarItemInactive: {
    minWidth: 70,
    height: 84,
    borderRadius: 24,
    backgroundColor: '#F8F9FB',
    borderColor: COLORS.slate50,
  },
  calendarItemActive: {
    minWidth: 85,
    height: 100,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.red200,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  calendarDay: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  calendarDate: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  textSlate400: { color: '#8E99AF' },
  textWhite: { color: COLORS.white, fontSize: 24, fontWeight: '900' },
  textWhite90: { color: 'rgba(255,255,255,0.9)' },
  activeDot: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.white,
    borderRadius: 3,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  mainContent: {
    padding: 24,
    gap: 24,
    backgroundColor: COLORS.background,
  },
  mainCard: {
    backgroundColor: COLORS.white,
    borderRadius: 48,
    padding: 32,
    borderWidth: 1,
    borderColor: COLORS.slate50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  calorieCardContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  arcWrapper: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  arcSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.95,
  },
  calorieTextContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieFireIcon: {
    marginBottom: 8,
  },
  calorieValue: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: -2,
    lineHeight: 70,
  },
  calorieSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginTop: 8,
  },
  calorieMetaPill: {
    marginTop: 20,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  calorieMetaText: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  macroCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.slate50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
  },
  macroRingContainer: {
    width: 56,
    height: 56,
    marginBottom: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroValueLarge: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSpacing: {
    marginTop: 8,
  },
  insightPlaceholder: {
    backgroundColor: COLORS.navy,
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  insightIconBox: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  insightTitle: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  insightText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.navy,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate400,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: COLORS.white,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.slate50,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    marginTop: 12,
    color: COLORS.slate400,
    fontWeight: '500',
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.slate50,
  },
  recentImage: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.slate50,
  },
  recentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 4,
  },
  recentTime: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.slate400,
  },
  recentKcal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
