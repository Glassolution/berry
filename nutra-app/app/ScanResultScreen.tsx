import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  withTiming, 
  withDelay, 
  useAnimatedProps,
  Easing,
} from 'react-native-reanimated';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';
import { useNutrition } from '../src/context/NutritionContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Colors & Tokens
const COLORS = {
  primary: '#ff0000',
  background: '#F9FAFB',
  white: '#FFFFFF',
  text: '#181010',
  textMuted: '#8d5e5e',
  border: '#F4F4F5',
  protein: '#ff0000',
  carbs: '#F59E0B',
  fat: '#EF4444',
  success: '#22C55E',
};

const MacroRing = ({
  progress,
  color,
  value,
}: {
  progress: number;
  color: string;
  value: number;
}) => {
  const size = 64;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withDelay(
      150,
      withTiming(Math.max(0, Math.min(progress, 1)), {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <View style={styles.macroRingWrap}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={'#F3F4F6'}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.macroRingCenter}>
        <Text style={styles.macroRingValue}>{Math.round(value)}g</Text>
      </View>
    </View>
  );
};

const MacroCard = ({
  progress,
  color,
  label,
  value,
}: {
  progress: number;
  color: string;
  label: string;
  value: number;
}) => {
  return (
    <View style={styles.macroCard}>
      <MacroRing progress={progress} color={color} value={value} />
      <Text style={styles.macroCardLabel}>{label}</Text>
    </View>
  );
};

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const formatKcal = (calories: number) => {
  if (!Number.isFinite(calories)) return '0';
  const rounded = Math.max(0, Math.round(calories));
  return rounded.toLocaleString('pt-BR');
};

const formatTime = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const HeaderBar = ({
  onBack,
  title,
}: {
  onBack: () => void;
  title: string;
}) => {
  return (
    <View style={styles.topBar}>
      <Pressable style={styles.topBarIconButton} onPress={onBack} hitSlop={10}>
        <MaterialIcons name="arrow-back" size={22} color={COLORS.text} />
      </Pressable>
      <Text style={styles.topBarTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.topBarRight}>
        <Pressable style={styles.topBarIconButton} onPress={() => {}} hitSlop={10}>
          <MaterialIcons name="more-horiz" size={24} color={COLORS.text} />
        </Pressable>
      </View>
    </View>
  );
};

const DetectionDot = ({ top, left }: { top: `${number}%`; left: `${number}%` }) => {
  return <View style={[styles.detectionDot, { top, left }]} />;
};

const HeroImage = ({
  imageUri,
  isNonFood,
}: {
  imageUri: string | null;
  isNonFood: boolean;
}) => {
  return (
    <View style={styles.hero}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.heroImage} contentFit="cover" />
      ) : (
        <View style={styles.heroPlaceholder} />
      )}

      <View style={styles.heroShade} />
      <DetectionDot top={'30%'} left={'40%'} />
      <DetectionDot top={'60%'} left={'70%'} />
      <DetectionDot top={'55%'} left={'30%'} />

      <View style={styles.heroBadges}>
        <View style={[styles.heroBadge, isNonFood && styles.heroBadgeWarn]}>
          <Text style={styles.heroBadgeText}>
            {isNonFood ? 'NÃO IDENTIFICADO' : 'DETECÇÃO EM TEMPO REAL'}
          </Text>
        </View>
        <View style={styles.heroMeta}>
          <MaterialIcons name="schedule" size={14} color={'rgba(255,255,255,0.92)'} />
          <Text style={styles.heroMetaText}>{formatTime(new Date())}</Text>
        </View>
      </View>
    </View>
  );
};

const EstimatedCard = ({ calories }: { calories: number }) => {
  return (
    <View style={styles.calorieCard}>
      <Text style={styles.calorieLabel}>TOTAL DE CALORIAS ESTIMADO</Text>
      <View style={styles.calorieValueRow}>
        <Text style={styles.calorieValue}>{formatKcal(calories)}</Text>
        <Text style={styles.calorieUnit}>Kcal</Text>
      </View>
    </View>
  );
};

const NotFoodCard = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <View style={styles.notFoodCard}>
      <View style={styles.notFoodRow}>
        <View style={styles.notFoodIcon}>
          <MaterialIcons name="error-outline" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.notFoodTextCol}>
          <Text style={styles.notFoodTitle}>{title}</Text>
          <Text style={styles.notFoodSubtitle}>
            {subtitle || 'Tente apontar para um alimento, rótulo ou código de barras.'}
          </Text>
        </View>
      </View>
    </View>
  );
};

type IngredientItem = {
  name: string;
  portionLabel: string;
  calories: number;
  icon: 'restaurant' | 'water-drop' | 'spa';
};

const coerceIngredients = (raw: unknown): IngredientItem[] | null => {
  const parsed = typeof raw === 'string' ? (() => { try { return JSON.parse(raw); } catch { return null; } })() : raw;
  if (!Array.isArray(parsed)) return null;

  const out: IngredientItem[] = [];
  for (let i = 0; i < parsed.length; i++) {
    const item = parsed[i] as any;
    const name = typeof item?.name === 'string' ? item.name.trim() : '';
    const portionLabel = typeof item?.portionLabel === 'string' ? item.portionLabel.trim() : '';
    const calories = typeof item?.calories === 'number' ? item.calories : typeof item?.calories === 'string' ? Number(item.calories) : NaN;
    if (!name) continue;
    out.push({
      name,
      portionLabel: portionLabel || 'Porção estimada',
      calories: Number.isFinite(calories) ? Math.max(0, calories) : 0,
      icon: (i % 3 === 0 ? 'restaurant' : i % 3 === 1 ? 'water-drop' : 'spa'),
    });
  }
  return out.length ? out : null;
};

export default function ScanResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const { addMeal } = useNutrition();
  
  // Parse params
  const rawName =
    (typeof params.name === 'string' && params.name.trim()) ||
    (typeof (params as any).foodName === 'string' && String((params as any).foodName).trim()) ||
    '';
  const foodName = rawName || 'Alimento não identificado';
  const calories = Number(params.calories) || 0;
  const protein = Number(params.protein) || 0;
  const fat = Number(params.fat) || 0;
  const carbs = Number(params.carbs) || 0;
  const imageUri = typeof params.imageUri === 'string' ? params.imageUri : null;
  const fiber = typeof (params as any).fiber === 'string' || typeof (params as any).fiber === 'number' ? Number((params as any).fiber) : null;
  const sugar = typeof (params as any).sugar === 'string' || typeof (params as any).sugar === 'number' ? Number((params as any).sugar) : null;
  const salt = typeof (params as any).salt === 'string' || typeof (params as any).salt === 'number' ? Number((params as any).salt) : null;
  const sodium = typeof (params as any).sodium === 'string' || typeof (params as any).sodium === 'number' ? Number((params as any).sodium) : null;
  const saturatedFat =
    typeof (params as any).saturatedFat === 'string' || typeof (params as any).saturatedFat === 'number'
      ? Number((params as any).saturatedFat)
      : null;
  const quantityLabel = typeof (params as any).quantityLabel === 'string' ? (params as any).quantityLabel : null;
  const ingredients =
    coerceIngredients((params as any).ingredients) ??
    [
      {
        name: foodName,
        portionLabel: quantityLabel ? `Porção estimada: ${quantityLabel}` : 'Porção estimada',
        calories,
        icon: 'restaurant' as const,
      },
    ];

  const isFoodParam =
    typeof (params as any).isFood === 'string'
      ? (params as any).isFood !== 'false'
      : typeof (params as any).isFood === 'boolean'
        ? (params as any).isFood
        : true;
  const notes = typeof (params as any).notes === 'string' ? (params as any).notes : null;
  const hasAnyNutrition = calories > 0 || protein > 0 || carbs > 0 || fat > 0;
  const looksUnknown = !rawName || rawName.toLowerCase() === 'unknown food';
  const isNonFood = !isFoodParam || (!hasAnyNutrition && looksUnknown);

  // Calculate percentages
  const totalMacros = protein + fat + carbs;
  const proteinPct = totalMacros > 0 ? protein / totalMacros : 0;
  const fatPct = totalMacros > 0 ? fat / totalMacros : 0;
  const carbsPct = totalMacros > 0 ? carbs / totalMacros : 0;

  const handleSave = async () => {
    if (isNonFood) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const foodItem = {
      name: foodName,
      calories,
      protein,
      fat,
      carbs,
      image_url: imageUri,
      created_at: new Date().toISOString()
    };

    if (session?.user) {
      try {
        const { error } = await supabase.from('food_logs').insert({
          user_id: session.user.id,
          food_name: foodItem.name,
          calories: foodItem.calories,
          protein: foodItem.protein,
          fat: foodItem.fat,
          carbs: foodItem.carbs,
          image_url: foodItem.image_url,
          meal_type: 'snack', // Defaulting to snack for now
          date: new Date().toISOString().split('T')[0]
        });
        
        if (error) throw error;
      } catch (e) {
        console.error('Error saving to Supabase:', e);
      }
    }

    addMeal(
      foodItem.name,
      foodItem.calories,
      { protein: foodItem.protein, carbs: foodItem.carbs, fats: foodItem.fat },
      foodItem.image_url ?? undefined,
    );

    router.dismissTo('/(tabs)');
  };

  const bottomPadding = 24 + insets.bottom;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HeaderBar onBack={() => router.back()} title="Análise Berry AI" />

        <HeroImage imageUri={imageUri} isNonFood={isNonFood} />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.main}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultLabel}>{isNonFood ? 'NÃO PARECE SER UM ALIMENTO' : 'RESULTADO DA ANÁLISE'}</Text>
              <Text style={styles.resultTitle} numberOfLines={2}>
                {isNonFood ? 'Tente outra foto' : foodName}
              </Text>
              {!isNonFood && quantityLabel ? <Text style={styles.resultSubText}>Base: {quantityLabel}</Text> : null}
            </View>

            {isNonFood ? (
              <NotFoodCard 
                title={notes ? "Não foi possível identificar" : "Não foi possível identificar o alimento"} 
                subtitle={notes || undefined}
              />
            ) : (
              <>
                <EstimatedCard calories={calories} />

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Macronutrientes</Text>
                  <View style={styles.macroGrid}>
                    <MacroCard progress={proteinPct} color={COLORS.protein} label="Proteína" value={protein} />
                    <MacroCard progress={carbsPct} color={COLORS.carbs} label="Carbos" value={carbs} />
                    <MacroCard progress={fatPct} color={COLORS.fat} label="Gorduras" value={fat} />
                  </View>
                </View>

                {fiber != null || sugar != null || salt != null || sodium != null || saturatedFat != null ? (
                  <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Detalhes</Text>
                    {fiber != null ? (
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailsKey}>Fibras</Text>
                        <Text style={styles.detailsVal}>{fiber.toFixed(1)}g</Text>
                      </View>
                    ) : null}
                    {sugar != null ? (
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailsKey}>Açúcares</Text>
                        <Text style={styles.detailsVal}>{sugar.toFixed(1)}g</Text>
                      </View>
                    ) : null}
                    {saturatedFat != null ? (
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailsKey}>Gordura saturada</Text>
                        <Text style={styles.detailsVal}>{saturatedFat.toFixed(1)}g</Text>
                      </View>
                    ) : null}
                    {salt != null ? (
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailsKey}>Sal</Text>
                        <Text style={styles.detailsVal}>{salt.toFixed(2)}g</Text>
                      </View>
                    ) : null}
                    {sodium != null ? (
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailsKey}>Sódio</Text>
                        <Text style={styles.detailsVal}>{Math.round(sodium * 1000)}mg</Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                <View style={styles.ingredientsSection}>
                  <Text style={styles.ingredientsTitle}>Ingredientes Identificados</Text>
                  <View style={styles.ingredientsCard}>
                    {ingredients.map((it, idx) => (
                      <View
                        key={`${it.name}-${idx}`}
                        style={[styles.ingredientRow, idx > 0 && styles.ingredientRowBorder]}
                      >
                        <View style={styles.ingredientLeft}>
                          <View style={styles.ingredientIconWrap}>
                            <MaterialIcons name={it.icon} size={18} color={COLORS.primary} />
                          </View>
                          <View style={styles.ingredientTextCol}>
                            <Text style={styles.ingredientName} numberOfLines={1}>
                              {it.name}
                            </Text>
                            <Text style={styles.ingredientSub} numberOfLines={1}>
                              {it.portionLabel}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.ingredientKcal}>{Math.round(it.calories)} kcal</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.actionsRow}>
                    <Pressable style={styles.secondaryButton} onPress={() => {}}>
                      <Text style={styles.secondaryButtonText}>Editar{'\n'}Detalhes</Text>
                    </Pressable>
                    <Pressable style={styles.primaryButtonWide} onPress={handleSave}>
                      <Text style={styles.primaryButtonText}>Confirmar e Adicionar</Text>
                      <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safe: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF2',
  },
  topBarIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 16,
    color: COLORS.text,
    marginHorizontal: 12,
  },
  topBarRight: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: COLORS.white,
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  heroShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  scanningLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,0,0,0.85)',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  detectionDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  heroBadges: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroBadgeWarn: {
    backgroundColor: 'rgba(255,0,0,0.92)',
  },
  heroBadgeText: {
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.white,
    fontSize: 10,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroMetaText: {
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.92)',
    fontSize: 11,
  },
  main: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  resultHeader: {
    marginBottom: 12,
  },
  resultLabel: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  resultTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 28,
    lineHeight: 34,
    color: COLORS.text,
  },
  resultSubText: {
    marginTop: 8,
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  calorieCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F1F2F4',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  calorieLabel: {
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  calorieValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  calorieValue: {
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.primary,
    fontSize: 58,
    lineHeight: 58,
    letterSpacing: -1.8,
    includeFontPadding: false,
  },
  calorieUnit: {
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.primary,
    fontSize: 18,
    textTransform: 'uppercase',
  },
  section: {
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.text,
    fontSize: 18,
    marginBottom: 12,
  },
  macroGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  macroCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F2F4',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  macroRingWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  macroRingCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroRingValue: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 12,
    color: COLORS.text,
  },
  macroCardLabel: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 10,
    color: '#A3A3A3',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  primaryButtonWide: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 14,
    color: COLORS.white,
  },
  secondaryButton: {
    width: 118,
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  secondaryButtonText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 13,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 15,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F2F4',
  },
  detailsTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 12,
    color: COLORS.text,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  detailsKey: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    color: COLORS.text,
  },
  detailsVal: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 13,
    color: COLORS.text,
  },
  notFoodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F2F4',
  },
  notFoodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notFoodIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,0,0,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notFoodTextCol: {
    flex: 1,
  },
  notFoodTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
  },
  notFoodSubtitle: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  ingredientsSection: {
    marginTop: 14,
  },
  ingredientsTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 10,
  },
  ingredientsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F1F2F4',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  ingredientRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 10,
  },
  ingredientIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,0,0,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientTextCol: {
    flex: 1,
  },
  ingredientName: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 2,
  },
  ingredientSub: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  ingredientKcal: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 12,
    color: COLORS.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
});
