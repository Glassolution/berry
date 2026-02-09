import React from 'react';
import { StyleSheet, Pressable, View, Text, ScrollView, Dimensions, StatusBar, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useAuth } from '@/src/context/AuthContext';
import { useNutrition } from '@/src/context/NutritionContext';
import { useInsights } from '@/src/context/InsightsContext';
import { InsightCard } from '@/components/InsightCard';

// Colors from Design
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

export default function DashboardScreen() {
  const { session } = useAuth();
  const { 
    targetCalories, 
    remainingCalories, 
    consumedCalories, 
    consumedMacros, 
    addMeal,
    mealLogs,
    addWater 
  } = useNutrition();

  const { activeInsight, markAsRead } = useInsights();

  // Logic for Banner Image
  // User requested static image (prato 3.png) always
  const bannerSource = require('@/assets/images/prato 3.png');

  // Progress (Visualizes Consumed Calories)
  const progress = Math.max(0, Math.min(consumedCalories / targetCalories, 1));
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - progress);

  const userMetadata = (session?.user?.user_metadata ?? {}) as any;
  const displayName: string =
    userMetadata.full_name ||
    userMetadata.name ||
    userMetadata.user_name ||
    userMetadata.username ||
    (typeof session?.user?.email === 'string' ? session.user.email.split('@')[0] : '') ||
    'Usuário';
  const userName = displayName.split(' ')[0] || displayName;
  const avatarUrl: string | undefined = userMetadata.avatar_url || userMetadata.picture;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join('');

  // Derived Recent Meals for Display
  const displayRecents = mealLogs.map(log => ({
    id: log.id,
    title: log.name,
    subtitle: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    kcal: log.calories,
    image: log.imageUri ? { uri: log.imageUri } : bannerSource,
    tag: 'REFEIÇÃO' // Could infer based on time (Cafe/Almoco/Jantar)
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
            <Image 
                source={bannerSource}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
                transition={1000}
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
                         <Link href="/(tabs)/meals" asChild>
                            <Pressable style={styles.avatarContainer}>
                                {avatarUrl ? (
                                  <Image source={{ uri: avatarUrl }} style={styles.avatarImage} contentFit="cover" />
                                ) : (
                                  <Text style={styles.avatarFallbackText}>{initials || 'U'}</Text>
                                )}
                            </Pressable>
                         </Link>
                         <View>
                             <Text style={styles.greetingText}>Olá, {userName}</Text>
                             <Text style={styles.subGreetingText}>Foco na meta! ⚡</Text>
                         </View>
                    </View>
                    <Pressable style={styles.searchButton}>
                        <MaterialIcons name="search" size={24} color="white" />
                    </Pressable>
                </View>
            </SafeAreaView>

            {/* Bottom Hero Content */}
            <View style={styles.heroBottomContent}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>PRATO DO DIA</Text>
                </View>
                <Text style={styles.dishTitle}>Bowl de Quinoa e Salmão</Text>
                <View style={styles.dishMeta}>
                    <View style={styles.metaItem}>
                        <MaterialIcons name="timer" size={16} color={COLORS.berryRed} />
                        <Text style={styles.metaText}>20 min</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <MaterialIcons name="local-fire-department" size={16} color={COLORS.berryRed} />
                        <Text style={styles.metaText}>480 kcal</Text>
                    </View>
                </View>
            </View>
        </View>

        {/* STATS SECTION */}
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
                         <Text style={styles.macroText}>{consumedMacros.protein}g Prot</Text>
                     </View>
                     <View style={styles.macroItem}>
                         <View style={[styles.dot, { backgroundColor: COLORS.berryOrange }]} />
                         <Text style={styles.macroText}>{consumedMacros.carbs}g Carb</Text>
                     </View>
                     <View style={styles.macroItem}>
                         <View style={[styles.dot, { backgroundColor: COLORS.gray300 }]} />
                         <Text style={styles.macroText}>{consumedMacros.fats}g Gord</Text>
                     </View>
                 </View>
             </View>
        </View>

        {/* AI INSIGHTS */}
        <View style={styles.insightsSection}>
            {activeInsight ? (
                <InsightCard 
                    insight={activeInsight} 
                    onDismiss={() => markAsRead(activeInsight.id)}
                />
            ) : (
                <View style={styles.insightCard}>
                    <View style={styles.insightIconBox}>
                        <MaterialIcons name="auto-awesome" size={24} color="white" />
                    </View>
                    <View style={styles.insightContent}>
                        <Text style={styles.insightTitle}>SEM INSIGHTS AGORA</Text>
                        <Text style={styles.insightText}>
                            Continue registrando suas refeições para receber dicas personalizadas da IA.
                        </Text>
                    </View>
                </View>
            )}
        </View>

        {/* RECENTES (History Log) */}
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>RECENTES</Text>
                {displayRecents.length > 0 && (
                    <Pressable>
                        <Text style={styles.seeAllText}>VER TUDO</Text>
                    </Pressable>
                )}
            </View>
            
            {displayRecents.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                    <MaterialIcons name="camera-alt" size={40} color={COLORS.gray300} />
                    <Text style={styles.emptyStateText}>Sem registros ainda</Text>
                    <Text style={styles.emptyStateSubText}>Tire uma foto para começar!</Text>
                </View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    {displayRecents.map((meal) => (
                        <Pressable 
                            key={meal.id} 
                            style={styles.mealCard}
                            onPress={() => Alert.alert('Detalhes', `${meal.title}\n${meal.kcal} kcal\n${meal.subtitle}`)}
                        >
                            <View style={styles.mealImageContainer}>
                                <Image source={meal.image} style={styles.mealImage} contentFit="cover" />
                                {meal.tag && (
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagText}>{meal.tag}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.mealContent}>
                                <Text style={styles.mealTitle} numberOfLines={1}>{meal.title}</Text>
                                <Text style={styles.mealSubtitle} numberOfLines={1}>{meal.subtitle}</Text>
                                
                                <View style={styles.mealFooter}>
                                    <Text style={styles.mealKcal}>{meal.kcal} kcal</Text>
                                    <View style={styles.infoIcon}>
                                        <MaterialIcons name="info-outline" size={20} color={COLORS.gray400} />
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            )}
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
    paddingBottom: 240,
  },
  heroSection: {
    height: 280, 
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(238, 43, 91, 0.9)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  avatarFallbackText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Manrope_800ExtraBold',
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
  subGreetingText: {
    color: COLORS.white,
    fontSize: 14,
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
    fontSize: 30,
    fontFamily: 'Manrope_800ExtraBold',
    lineHeight: 36,
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
    marginTop: -40, 
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
  insightsSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  insightCard: {
    backgroundColor: 'rgba(238, 43, 91, 0.05)', 
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(238, 43, 91, 0.1)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  insightIconBox: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: COLORS.berryRed,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.berryRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 12,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.berryRed,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Manrope_500Medium',
    color: COLORS.gray700,
    lineHeight: 20,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.gray900,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    color: COLORS.gray400,
  },
  horizontalScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  mealCard: {
    width: 220,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.gray100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 8, // for shadow
  },
  mealImageContainer: {
    height: 140,
    position: 'relative',
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: 'Manrope_800ExtraBold',
  },
  mealContent: {
    padding: 16,
  },
  mealTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  mealSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    color: COLORS.gray400,
    marginBottom: 12,
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealKcal: {
    fontSize: 14,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.berryRed,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    color: COLORS.gray900,
  },
  emptyStateSubText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    color: COLORS.gray400,
  },
  infoIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
