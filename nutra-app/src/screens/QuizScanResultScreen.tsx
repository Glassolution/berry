import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView, Animated } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const CircularProgress = ({ value, total, color, label, amount }: { value: number, total: number, color: string, label: string, amount: string }) => {
  const radius = 30;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / total) * circumference;
  
  return (
    <View style={styles.macroContainer}>
      <View style={styles.circularProgress}>
        <Svg width={72} height={72} viewBox="0 0 72 72">
          <Circle
            cx="36"
            cy="36"
            r={radius}
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx="36"
            cy="36"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 36 36)"
          />
        </Svg>
        <View style={styles.macroValueContainer}>
          <Text style={styles.macroValueText}>{amount}</Text>
        </View>
      </View>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
};

const QuizScanResultScreen = () => {
  const router = useRouter();
  const { imageUri, foodName, calories, protein, carbs, fat } = useLocalSearchParams();
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  // Default fallback image
  const displayImage = imageUri ? { uri: imageUri as string } : { uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt9skcTa4mMUZP0up8_to_z4c2UkxqJajQmw3Etxfkgt1vG-JHx9I7Dify9furrQgs64q_dGJKzHRJMWHv4AtFPYZaMRSL3sEONWQuwPsVXoUh7EU_Qms_ollfTiy05Z7XSvELvSkvANH9FxoVgKwf3yTSU1rZVy_qq0iTQAI174qubxvwCFrp5lx-HCHSMrB3hmg7RuUdZoGpVo4fkntDHiO9D2eBKBKYCxZLu_29NeMvJtzboXgEnjU0Z5tG2CjuTk_dNifX_Ags" };

  // Parse numeric values or use defaults
  const data = {
    name: (foodName as string) || "Salmão com Quinoa",
    calories: calories ? String(calories) : "452",
    protein: protein ? String(protein) : "32",
    carbs: carbs ? String(carbs) : "24",
    fat: fat ? String(fat) : "12",
  };

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/QuizAddActivityScreen');
  };

  return (
    <View style={styles.container}>
      {/* Top Image Section */}
      <View style={styles.imageSection}>
        <Image 
          source={displayImage}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
        
        <SafeAreaView style={styles.header} edges={['top']}>
          {/* Back button removed */}
        </SafeAreaView>

        <View style={styles.scanBadgeContainer}>
          <View style={styles.scanBadge}>
            <MaterialIcons name="check-circle" size={20} color="#22C55E" />
            <Text style={styles.scanBadgeText}>ANÁLISE CONCLUÍDA</Text>
          </View>
        </View>
      </View>

      {/* Bottom Content Section */}
      <View style={styles.contentSection}>
        <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContent}
      bounces={false}
      overScrollMode="never"
    >
          <View style={styles.headerTextContainer}>
            <Text style={styles.overline}>RESULTADO DA ANÁLISE</Text>
            <Text style={styles.title}>{data.name}</Text>
          </View>

          {/* Macros Grid */}
          <View style={styles.macrosGrid}>
            <CircularProgress 
              value={Number(data.protein)} 
              total={100} 
              color="#3B82F6" // Blue for Protein
              label="PROTEÍNAS" 
              amount={`${data.protein}g`}
            />
            <CircularProgress 
              value={Number(data.carbs)} 
              total={100} 
              color="#F59E0B" // Amber for Carbs
              label="CARBOS" 
              amount={`${data.carbs}g`} 
            />
            <CircularProgress 
              value={Number(data.fat)} 
              total={100} 
              color="#EF4444" // Red for Fats
              label="GORDURAS" 
              amount={`${data.fat}g`} 
            />
          </View>

          {/* Total Calories Card */}
          <View style={styles.caloriesCard}>
            <View>
              <Text style={styles.caloriesLabel}>TOTAL ESTIMADO</Text>
              <View style={styles.caloriesValueRow}>
                <Text style={styles.caloriesValue}>{data.calories}</Text>
                <Text style={styles.caloriesUnit}>kcal</Text>
              </View>
            </View>
            <View style={styles.fireIconContainer}>
               <MaterialIcons name="local-fire-department" size={32} color="#F97316" />
            </View>
          </View>

          {/* Confirm Button */}
          <Pressable 
            style={({ pressed }) => [
              styles.confirmButton,
              pressed && styles.confirmButtonPressed
            ]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirmar Refeição</Text>
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </Pressable>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {/* Transition Overlay */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFillObject,
          { 
            backgroundColor: 'white', 
            opacity: fadeAnim,
            zIndex: 9999,
            pointerEvents: 'none'
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageSection: {
    height: '45%',
    width: '100%',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingLeft: 24,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  scanBadgeContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  scanBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -48,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  headerTextContainer: {
    marginBottom: 32,
  },
  overline: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A1A1AA',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#18181B',
    lineHeight: 38,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  macroContainer: {
    alignItems: 'center',
    gap: 12,
  },
  circularProgress: {
    width: 72,
    height: 72,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroValueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181B',
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A1A1AA',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  caloriesCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  caloriesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A1A1AA',
    letterSpacing: 2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  caloriesValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: -1,
  },
  caloriesUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A1A1AA',
  },
  fireIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#E11D48',
    borderRadius: 24,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  confirmButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizScanResultScreen;
