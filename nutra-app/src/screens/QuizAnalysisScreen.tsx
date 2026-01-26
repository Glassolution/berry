import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Line, Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { Image } from 'expo-image';
import { useQuiz } from '../context/QuizContext';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizAnalysisScreen'>;

// Colors
const COLORS = {
  primary: '#000000',
  backgroundLight: '#FFFFFF',
  cardLight: '#F9FAFB',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  white: '#FFFFFF',
  green50: '#F0FDF4',
  green600: '#16A34A',
  red50: '#FEF2F2',
  red100: '#FEE2E2',
  red500: '#EF4444',
  indigo50: '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',
};

const QuizAnalysisScreen = () => {
  const router = useRouter();
  const { quizData } = useQuiz();
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentWeight = quizData.weight || 80;
  const goalWeight = quizData.goalWeight || 68;
  const weightDiff = currentWeight - goalWeight;
  const isWeightLoss = weightDiff > 0;
  const diffDisplay = Math.abs(weightDiff).toFixed(1);
  const unitLabel = quizData.unitSystem === 'imperial' ? 'lbs' : 'kg';
  const monthsToGoal = Math.max(1, Math.ceil(Math.abs(weightDiff) / 2)); // Assume 2kg/month loss

  useEffect(() => {
    // Animate progress bar to 100%
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
        router.push('/QuizCameraScreen');
    }, 100);
  };

  // Chart Logic
  // Y Axis: Top (40) is Start Weight (if loss) or Goal Weight (if gain)?
  // Actually, let's map value to Y.
  // We want the curve to go from Left to Right.
  // Start Point: (0, startY)
  // End Point: (400, endY)
  // If Loss: Start High (Top/Low Y? No SVG Y=0 is top). 
  // Let's say we want visual "High" to be "Top of chart".
  // But usually graph Y axis: Top is MAX value. Bottom is MIN value.
  // So if Weight 80 -> 60.
  // 80 is Top (Y=40). 60 is Bottom (Y=160).
  // Path: 0,40 -> 400,160.
  
  // If Gain: 60 -> 80.
  // 60 is Bottom (Y=160). 80 is Top (Y=40).
  // Path: 0,160 -> 400,40.
  
  const startY = isWeightLoss ? 40 : 160;
  const endY = isWeightLoss ? 160 : 40;
  
  // Control points for smooth S-curve
  // CP1: (150, startY) - horizontal out
  // CP2: (250, endY) - horizontal in
  const berryPath = `M0 ${startY} C 150 ${startY}, 250 ${endY}, 400 ${endY}`;
  
  // Common Diet (Yo-Yo) - Red line
  // If Loss: Drops then goes back up.
  // Start 40. Drop to 100. Back to 80.
  // M 0 40 C 100 40, 150 140 (Drop), 200 120 (Recover slightly), 300 80 (Back up), 400 80.
  // Let's keep the existing simple curve but adjusted.
  const commonPath = isWeightLoss 
    ? "M0 40 C 100 40, 150 140, 200 120 S 300 40, 400 60" // Yo-yo
    : "M0 160 C 100 160, 150 100, 200 120 S 300 160, 400 140"; // Struggle to gain

  const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['90%', '100%']
  });

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
            <Pressable style={styles.backButton} onPress={handleBack}>
                <MaterialIcons name="arrow-back" size={24} color={COLORS.slate900} />
            </Pressable>
            
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
            </View>
        </View>

        <View style={styles.contentContainer}>
            
            <Text style={styles.mainTitle}>Berry cria resultados sustentáveis</Text>

            {/* Chart Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardLabel}>PROJEÇÃO DE PESO</Text>
                        <Text style={styles.cardTitle}>Seu progresso</Text>
                    </View>
                    <View style={styles.badge}>
                        <MaterialIcons name={isWeightLoss ? "trending-down" : "trending-up"} size={16} color={isWeightLoss ? COLORS.green600 : COLORS.red500} />
                        <Text style={[styles.badgeText, !isWeightLoss && { color: COLORS.red500 }]}>
                            {isWeightLoss ? '-' : '+'}{diffDisplay}{unitLabel}
                        </Text>
                    </View>
                </View>

                {/* Chart Area */}
                <View style={styles.chartContainer}>
                    <Svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                        <Defs>
                            <LinearGradient id="gradient-berry" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0" stopColor="#000000" />
                                <Stop offset="1" stopColor="#4F46E5" />
                            </LinearGradient>
                        </Defs>
                        
                        {/* Grid Lines */}
                        <Line x1="0" y1="40" x2="400" y2="40" stroke={COLORS.slate100} strokeDasharray="4 4" strokeWidth="1" />
                        <Line x1="0" y1="100" x2="400" y2="100" stroke={COLORS.slate100} strokeDasharray="4 4" strokeWidth="1" />
                        <Line x1="0" y1="160" x2="400" y2="160" stroke={COLORS.slate100} strokeDasharray="4 4" strokeWidth="1" />

                        {/* Red Curve (Dieta Comum) */}
                        <Path 
                            d={commonPath} 
                            fill="none" 
                            stroke={COLORS.red500} 
                            strokeWidth="3" 
                            strokeOpacity="0.4"
                            strokeLinecap="round"
                        />

                        {/* Berry Curve */}
                        <Path 
                            d={berryPath} 
                            fill="none" 
                            stroke="url(#gradient-berry)" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                        />

                        {/* Points */}
                        <Circle cx="0" cy={startY} r="5" fill="white" stroke="black" strokeWidth="2" />
                        <Circle cx="400" cy={endY} r="6" fill="white" stroke={COLORS.indigo600} strokeWidth="2" />
                    </Svg>

                    {/* Labels on Chart */}
                    <View style={styles.labelCommonDiet}>
                        <Text style={styles.labelCommonDietText}>Dieta Comum</Text>
                    </View>
                    <View style={styles.labelBerryMethod}>
                        <MaterialIcons name="auto-awesome" size={12} color={COLORS.indigo600} />
                        <Text style={styles.labelBerryMethodText}>Método Berry</Text>
                    </View>
                </View>

                {/* X Axis Labels */}
                <View style={styles.xAxisLabels}>
                    <Text style={styles.axisLabel}>Hoje</Text>
                    <Text style={styles.axisLabel}>Mês {Math.ceil(monthsToGoal / 2)}</Text>
                    <Text style={styles.axisLabel}>Mês {monthsToGoal}</Text>
                </View>

                {/* Insight Box */}
                <View style={styles.insightBox}>
                    <MaterialIcons name="psychology" size={24} color={COLORS.indigo500} style={styles.insightIcon} />
                    <Text style={styles.insightText}>
                        Nossa IA ajusta seu plano para atingir <Text style={styles.insightTextBold}>{goalWeight}{unitLabel}</Text> em {monthsToGoal} meses sem efeito sanfona.
                    </Text>
                </View>
            </View>

            {/* Social Proof */}
            <View style={styles.socialProofContainer}>
                <View style={styles.avatarGroup}>
                     <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCw6O8P51x7kxVpWfpn0LSSKwB0KP_qdHJhGtY7JM37Tisi5JIhk0nMAfK-Ks7bJxDjzzCvH7PZypAmKFmkaaaqKqwrS-1VuDwMBjubHurDHRiDgHb-KRR4tDNm_bak4K3iSrkVdup9P4zRSBQBL3OjpfAKjoY2x9fw2SzIizUZRAUs47pXregAYYyMll4pDSbPkEbNv-VQPIqvW4KDfB_UeLt7QVjcyOerpc9t3O_sBZivpbv5qoOgh_ApYbHFeNZ4u6-BFyZ4eC2B" }} style={styles.avatar} />
                     <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdJhx6T5bdobBRbD714DxXIVURDZpD-4ipF3xTkR7j44tDtZtTjSWUtfA_e0OLCiys5QOX_pZQfpMSQ0V5zGvcinGBizFOx8RMIzM1sXoNhG5UMN245NAArpgSpDDpwuTdU-YfNUF9UMg-_gIC3FZ7WT-eE1KBbLCWgl-txumWPJM6CFCZopPeiounHKnvW-6RtCPBTz1oXV1wZSL7ryoVy0wBtCZXokZHmEIhUrvEF13yWKqAXRqM9KxOAYG994fPApw6PBrA1Kdo" }} style={[styles.avatar, { marginLeft: -8 }]} />
                     <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm9CV4N_d4FBIz3Hv9iDnJbp4x3-vs0GsGGYojZAhWAi69-PS9P8386aSKngTDyAUu6vCGW2JNPzMIsVnaFt72mq5LCyl-E40zCuPOeQTVCkMJa58JzhAI8Lghmnz8F-vHe-ck3YgLEq4BHknbLL0em5VcCo9zi97P1Osyxe0qJdCpI32UD-xSnym2rKy1NeasEj4Ogrcro-KDeqYoBhr49KkI89c61jWhz_SjGEhzXtmlQGzCIA4dUJh5fWNdJvmP0MZ_mKFuJkRI" }} style={[styles.avatar, { marginLeft: -8 }]} />
                </View>
                <Text style={styles.socialProofText}>
                    <Text style={styles.socialProofHighlight}>85% dos usuários</Text> mantêm o peso ideal
                </Text>
            </View>

        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
            <Pressable style={styles.continueButton} onPress={handleNext}>
                <Text style={styles.continueButtonText}>Continuar</Text>
                <MaterialIcons name="arrow-forward" size={24} color={COLORS.white} />
            </Pressable>
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.slate200,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 10,
    justifyContent: 'space-evenly', // Better distribution
  },
  mainTitle: {
    fontSize: 22, // Slightly smaller
    fontWeight: '800',
    color: COLORS.slate900,
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.cardLight,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    shadowColor: COLORS.slate200,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    flex: 1,
    maxHeight: 460, // Reduced max height
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.slate400,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.green50,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.green600,
  },
  chartContainer: {
    flex: 1,
    minHeight: 120, // Reduced
    width: '100%',
    marginBottom: 8,
    position: 'relative',
  },
  labelCommonDiet: {
    position: 'absolute',
    right: 0,
    top: 24,
    backgroundColor: COLORS.red50,
    borderWidth: 1,
    borderColor: COLORS.red100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  labelCommonDietText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.red500,
  },
  labelBerryMethod: {
    position: 'absolute',
    right: 40,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.indigo50,
    borderWidth: 1,
    borderColor: COLORS.indigo100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  labelBerryMethodText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.indigo600,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  axisLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate400,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.slate100,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate100,
  },
  insightIcon: {
    marginTop: 0,
  },
  insightText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.slate600,
  },
  insightTextBold: {
    color: COLORS.slate900,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  socialProofContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 4,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.white,
    backgroundColor: COLORS.slate200,
  },
  socialProofText: {
    fontSize: 13, // Smaller
    fontWeight: '600',
    color: COLORS.slate700,
  },
  socialProofHighlight: {
    color: COLORS.primary,
  },
  footer: {
    padding: 24,
    paddingTop: 10,
    paddingBottom: 20, // Add some bottom padding for safe area
    backgroundColor: COLORS.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16, // Reduced
    borderRadius: 16,
    gap: 8,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default QuizAnalysisScreen;