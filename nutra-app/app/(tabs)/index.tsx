import React from 'react';
import { StyleSheet, Pressable, View, Text, ScrollView, Dimensions, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useAuth } from '@/src/context/AuthContext';
import { useNutrition } from '@/src/context/NutritionContext';

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

// Original Data adapted to new visual style
const CATEGORIES = [
  { id: 1, name: 'VEGANO', icon: 'spa', color: '#FECDD3' }, // red-100
  { id: 2, name: 'CARBOS', icon: 'bakery-dining', color: '#FFEDD5' }, // orange-100
  { id: 3, name: 'PROTEÍNA', icon: 'dinner-dining', color: '#F3F4F6' }, // gray-100
  { id: 4, name: 'LANCHES', icon: 'fastfood', color: '#F3F4F6' },
  { id: 5, name: 'BEBIDAS', icon: 'local-cafe', color: '#F3F4F6' },
];

const RECENTS = [
  { 
    id: 1,
    title: 'Salmão Grelhado', 
    subtitle: '12:37',
    kcal: 550, 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDykt7xFUAhYvZZKQsQ4uBlQtJDsXYo-YrUCk-4kUO7BjD9E21BHtpFqY4xTSR0V2slm2GKA40UEcPMXhIL-mxs8GghmT2ZDUzwo8b-qRqJvmreFJI9SBGM65qv1AMBsWKujEs_KYshZWKO3ylE4kB8hKxddXHK6Yw4cbGHMyR_nnmOsAfo5-emF_kBPmnkUhnGUEtEfr-ldjFVBsQxpScyU3kQzi9kOkTHCK7GtJQwHSCFWUXnEgk3ClJT5lffkYxgV8RDnjv84bMG',
    tag: 'ALMOÇO' 
  },
  { 
    id: 2,
    title: 'Bowl Mediterrâneo', 
    subtitle: '08:15',
    kcal: 320, 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDltbdqPy6JRGVD9R_HQQFccstHiCZqhCam-WJr6OWi5jjXAs_GsZi-58SCmIkJB0lmP1FfDEAn-wvoQtYb3hokXWb8GNPrZD9AIf5z3BDFNkOeb41TiH8xMirrg81mSEYZEnwchsFL-tdlPpXn7eGLU4UAMcszenXUoRKErJ1S9uALoB9BM4iEsZ66foNqY8GH_QwKQwXgypX3OKpVTqRioZ72cOJaTJVP-P4PJBWOySITCw8wiZUbR9sI0xf4xFNWj1iDLpX1A1OU',
    tag: 'CAFÉ' 
  },
];

export default function DashboardScreen() {
  const { session } = useAuth();
  const { 
    targetCalories, 
    remainingCalories, 
    consumedCalories, 
    consumedMacros, 
    addMeal 
  } = useNutrition();

  // Progress (Visualizes Consumed Calories)
  const progress = Math.max(0, Math.min(consumedCalories / targetCalories, 1));
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - progress);

  const userName = session?.user?.user_metadata?.full_name?.split(' ')[0] || "Floyd"; 

  const handleQuickAdd = (meal: typeof RECENTS[0]) => {
    // Add simple mock macros for these quick adds since we don't have full data
    // Approximating: Protein = 25%, Carbs = 45%, Fat = 30%
    const p = Math.round((meal.kcal * 0.25) / 4);
    const c = Math.round((meal.kcal * 0.45) / 4);
    const f = Math.round((meal.kcal * 0.30) / 9);
    
    addMeal(meal.title, meal.kcal, { protein: p, carbs: c, fats: f });
  };
 

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
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDykt7xFUAhYvZZKQsQ4uBlQtJDsXYo-YrUCk-4kUO7BjD9E21BHtpFqY4xTSR0V2slm2GKA40UEcPMXhIL-mxs8GghmT2ZDUzwo8b-qRqJvmreFJI9SBGM65qv1AMBsWKujEs_KYshZWKO3ylE4kB8hKxddXHK6Yw4cbGHMyR_nnmOsAfo5-emF_kBPmnkUhnGUEtEfr-ldjFVBsQxpScyU3kQzi9kOkTHCK7GtJQwHSCFWUXnEgk3ClJT5lffkYxgV8RDnjv84bMG" }}
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
                         <Link href="/(tabs)/meals" asChild>
                            <Pressable style={styles.avatarContainer}>
                                <Image 
                                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA702fxZxwhXSBJzRRUZMTyGOjR5zeQsmNAaMFCpjMIwlfIEy_rwEqBEOPPHXos8jV2HKeZCQNRpuEFsP6OtGwvcFKmFiwOf9Gqo3qcy7hrcaT2WTLx_bmYhMujbND0iDkZjGR8ReTQxQcbmyt2oTKg28MgXc5ruzAwQtdk3tQQtg1o3TaOpC3RQ7f7zc6oKGQQfeqMF4-AmCMmsaC3WZGf8IRgwv_GJKRr_705JLdPgecSJf6mbJVXfwjzRPKa_EAcDKiF9IrgS6Et" }}
                                    style={styles.avatarImage}
                                    contentFit="cover"
                                />
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
            <View style={styles.insightCard}>
                <View style={styles.insightIconBox}>
                    <MaterialIcons name="auto-awesome" size={24} color="white" />
                </View>
                <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>INSIGHTS DA IA</Text>
                    <Text style={styles.insightText}>
                        Você está consumindo <Text style={{fontWeight: 'bold'}}>30% mais proteínas</Text> que o normal. Ótimo para sua recuperação muscular hoje!
                    </Text>
                </View>
            </View>
        </View>

        {/* RECENTES (Adapted from Inspired for you) */}
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>RECENTES</Text>
                <Pressable>
                    <Text style={styles.seeAllText}>VER TUDO</Text>
                </Pressable>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {RECENTS.map((meal) => (
                    <View key={meal.id} style={styles.mealCard}>
                        <View style={styles.mealImageContainer}>
                            <Image source={{ uri: meal.image }} style={styles.mealImage} contentFit="cover" />
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
                                <Pressable 
                                  style={styles.addButton}
                                  onPress={() => handleQuickAdd(meal)}
                                >
                                    <MaterialIcons name="add" size={20} color={COLORS.gray900} />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>

        {/* CATEGORIES */}
        <View style={[styles.sectionContainer, { paddingBottom: 120 }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>CATEGORIAS</Text>
            </View>
            
            <View style={styles.categoriesRow}>
                {CATEGORIES.map((cat) => (
                    <View key={cat.id} style={styles.categoryItem}>
                        <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                            {cat.icon === 'bakery-dining' || cat.icon === 'dinner-dining' || cat.icon === 'spa' || cat.icon === 'local-cafe' || cat.icon === 'fastfood' ? (
                                <MaterialIcons name={cat.icon as any} size={24} color={COLORS.berryRed} />
                            ) : (
                                <MaterialIcons name={cat.icon as any} size={24} color={COLORS.berryRed} />
                            )}
                        </View>
                        <Text style={styles.categoryLabel}>{cat.name}</Text>
                    </View>
                ))}
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
    paddingBottom: 20,
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
  insightsSection: {
    paddingHorizontal: 24,
    marginTop: 24,
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
    marginTop: 32,
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
    backdropFilter: 'blur(4px)',
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
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: COLORS.gray400,
    textTransform: 'uppercase',
  },
});
