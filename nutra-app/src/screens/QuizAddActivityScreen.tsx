import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';

const QuizAddActivityScreen = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/QuizPlanReadyScreen');
  };

  return (
    <View style={styles.container}>
      {/* Top Image Section */}
      <View style={styles.imageSection}>
        <Image 
          source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt9skcTa4mMUZP0up8_to_z4c2UkxqJajQmw3Etxfkgt1vG-JHx9I7Dify9furrQgs64q_dGJKzHRJMWHv4AtFPYZaMRSL3sEONWQuwPsVXoUh7EU_Qms_ollfTiy05Z7XSvELvSkvANH9FxoVgKwf3yTSU1rZVy_qq0iTQAI174qubxvwCFrp5lx-HCHSMrB3hmg7RuUdZoGpVo4fkntDHiO9D2eBKBKYCxZLu_29NeMvJtzboXgEnjU0Z5tG2CjuTk_dNifX_Ags" }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
        <View style={styles.overlay} />
        
        <SafeAreaView style={styles.header} edges={['top']}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
        </SafeAreaView>
      </View>

      {/* Bottom Content Section */}
      <View style={styles.contentSection}>
        {/* Background Pattern (Simulated with simple view for now, or could use SVG pattern) */}
        <View style={styles.bgPattern} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Adicionar ao diário?</Text>

          <View style={styles.mainProgressContainer}>
            {/* Large Calorie Circle */}
            <View style={styles.calorieCircleContainer}>
              <Svg width={180} height={180} viewBox="0 0 180 180">
                <Circle
                  cx="90"
                  cy="90"
                  r="80"
                  stroke="#F1F5F9"
                  strokeWidth="12"
                  fill="none"
                />
                <Circle
                  cx="90"
                  cy="90"
                  r="80"
                  stroke="#000"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(452 / 600) * (2 * Math.PI * 80)} ${2 * Math.PI * 80}`}
                  strokeLinecap="round"
                  transform="rotate(-90 90 90)"
                />
              </Svg>
              <View style={styles.calorieTextContainer}>
                <Text style={styles.calorieValue}>452</Text>
                <Text style={styles.calorieUnit}>KCAL</Text>
                <View style={styles.calorieTag}>
                    <Text style={styles.calorieTagText}>TOTAL</Text>
                </View>
              </View>
            </View>

            {/* Simple Macros Grid */}
            <View style={styles.simpleMacrosGrid}>
                <View style={[styles.simpleMacroItem, styles.macroBorderRight]}>
                    <Text style={styles.simpleMacroLabel}>PROTEÍNA</Text>
                    <Text style={styles.simpleMacroValue}>32g</Text>
                </View>
                <View style={[styles.simpleMacroItem, styles.macroBorderRight]}>
                    <Text style={styles.simpleMacroLabel}>CARBOS</Text>
                    <Text style={styles.simpleMacroValue}>24g</Text>
                </View>
                <View style={styles.simpleMacroItem}>
                    <Text style={styles.simpleMacroLabel}>GORDURA</Text>
                    <Text style={styles.simpleMacroValue}>12g</Text>
                </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable 
                style={({ pressed }) => [
                    styles.yesButton,
                    pressed && styles.yesButtonPressed
                ]}
                onPress={handleContinue}
            >
                <Text style={styles.yesButtonText}>Continuar</Text>
            </Pressable>
          </View>
          
          {/* Home Indicator line simulation */}
          <View style={styles.indicatorContainer}>
            <View style={styles.indicator} />
          </View>
          
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageSection: {
    height: '40%',
    width: '100%',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // backdropFilter not supported natively on RN
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -32,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    position: 'relative',
  },
  bgPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
    // RN doesn't support complex CSS gradients easily without SVG. Keeping simple for now.
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  mainProgressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  calorieCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  calorieTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 48,
    letterSpacing: -1,
  },
  calorieUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  calorieTag: {
    marginTop: 8,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  calorieTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  simpleMacrosGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  simpleMacroItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  macroBorderRight: {
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  simpleMacroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  simpleMacroValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  yesButton: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 999,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#E2E8F0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  yesButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  yesButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  noButton: {
    paddingVertical: 8,
  },
  noButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  indicatorContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  indicator: {
    width: 128,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
  },
});

export default QuizAddActivityScreen;
