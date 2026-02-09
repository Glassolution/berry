import React from 'react';
import { StyleSheet, Pressable, View, Text, ScrollView, Dimensions, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import FloatingNav from '@/components/floating-nav';
import { useAuth } from '@/src/context/AuthContext';

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

// Mock Data for "Inspirado para você"
const INSPIRED_MEALS = [
  {
    id: 1,
    title: 'Salada de Verão',
    subtitle: 'Mix de folhas, abacate e sementes',
    kcal: 320,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&fit=crop',
    tag: 'LOW CARB',
  },
  {
    id: 2,
    title: 'Bowl de Açaí',
    subtitle: 'Whey protein, banana e granola',
    kcal: 450,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=600&fit=crop',
    tag: 'PROTEIN',
  },
  {
    id: 3,
    title: 'Wrap de Frango',
    subtitle: 'Frango grelhado e vegetais',
    kcal: 380,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=600&fit=crop',
    tag: null,
  }
];

const CATEGORIES = [
  { id: 1, name: 'Frutas', icon: 'apple-alt', color: '#FECDD3' }, // red-100
  { id: 2, name: 'Vegetais', icon: 'carrot', color: '#FFEDD5' }, // orange-100
  { id: 3, name: 'Carnes', icon: 'drumstick-bite', color: '#F3F4F6' }, // gray-100
  { id: 4, name: 'Suples', icon: 'pills', color: '#F3F4F6' },
];

export default function DashboardScreen() {
  const { session } = useAuth();
  
  // Design explicitly requested "Olá, Floyd"
  const userName = "Floyd"; 

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
                         <Link href="/settings" asChild>
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
                             <Text style={styles.kcalValue}>1250</Text>
                             <Text style={styles.kcalTarget}>/ 2500</Text>
                         </View>
                         <Text style={styles.kcalLabel}>KCAL RESTANTES HOJE</Text>
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
                                strokeDashoffset={`${2 * Math.PI * 40 * 0.5}`} // 50% progress
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
                         <Text style={styles.macroText}>Proteína</Text>
                     </View>
                     <View style={styles.macroItem}>
                         <View style={[styles.dot, { backgroundColor: COLORS.berryOrange }]} />
                         <Text style={styles.macroText}>Carbos</Text>
                     </View>
                     <View style={styles.macroItem}>
                         <View style={[styles.dot, { backgroundColor: COLORS.gray300 }]} />
                         <Text style={styles.macroText}>Gordura</Text>
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
                        Você está consumindo 30% mais proteínas que o normal. Ótimo para sua recuperação muscular hoje!
                    </Text>
                </View>
            </View>
        </View>

        {/* INSPIRED FOR YOU */}
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>INSPIRADO PARA VOCÊ</Text>
                <Pressable>
                    <Text style={styles.seeAllText}>VER TUDO</Text>
                </Pressable>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {INSPIRED_MEALS.map((meal) => (
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
                                <Pressable style={styles.addButton}>
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
                            {cat.icon === 'carrot' || cat.icon === 'apple-alt' || cat.icon === 'drumstick-bite' || cat.icon === 'pills' ? (
                                <FontAwesome5 name={cat.icon} size={20} color={COLORS.berryRed} />
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
      <FloatingNav active="index" />
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
    height: 320, // Adjusted to match HTML h-[320px]
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
    backdropFilter: 'blur(10px)', // Note: backdropFilter not supported in RN directly, but bg opacity helps
  },
  heroBottomContent: {
    padding: 24,
    paddingBottom: 40, // Extra padding for the overlap of the next section
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
    marginTop: -30, // Negative margin to overlap hero
    zIndex: 10,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24, // rounded-3xl
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
    backgroundColor: '#F9FAFB', // gray-50
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
    backgroundColor: '#FEF2F2', // bg-red-50/50 approx (using tailwind red-50 hex)
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
    fontSize: 18,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.gray900,
    textTransform: 'uppercase',
  },
  seeAllText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    color: COLORS.berryRed,
    textTransform: 'uppercase',
  },
  horizontalScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  mealCard: {
    width: 220,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  mealImageContainer: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.berryRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 8,
    fontFamily: 'Manrope_800ExtraBold',
    textTransform: 'uppercase',
  },
  mealContent: {
    gap: 4,
  },
  mealTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    color: COLORS.gray900,
  },
  mealSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    color: COLORS.gray400,
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  mealKcal: {
    fontSize: 14,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.gray900,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
