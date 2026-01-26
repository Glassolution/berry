import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizExerciseRoutineScreen'>;

// Activity Levels
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

interface ActivityOption {
  id: ActivityLevel;
  label: string;
  description: string;
}

const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    id: 'sedentary',
    label: 'Sedentário',
    description: 'Pouco ou nenhum exercício',
  },
  {
    id: 'light',
    label: 'Leve',
    description: 'Exercício leve 1-3 dias/semana',
  },
  {
    id: 'moderate',
    label: 'Moderado',
    description: 'Exercício moderado 3-5 dias/semana',
  },
  {
    id: 'active',
    label: 'Intenso',
    description: 'Exercício pesado 6-7 dias/semana',
  },
];

// Colors from existing palette
const COLORS = {
  primary: '#000000',
  backgroundLight: '#FFFFFF',
  cardLight: '#F9FAFB',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate500: '#64748B',
  slate800: '#1E293B',
  slate900: '#0F172A',
  white: '#FFFFFF',
};

const QuizExerciseRoutineScreen = () => {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<ActivityLevel>('light');
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animate Progress Bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['75%', '100%'], // Ends here
  });

  const handleSelect = (id: ActivityLevel) => {
    if (selectedActivity !== id) {
      Haptics.selectionAsync();
      setSelectedActivity(id);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
    console.log('Next pressed, activity:', selectedActivity);
    router.push('/QuizAnalysisScreen');
  };

  return (
    <View style={styles.container}>
      {/* Background Icons */}
      <View style={styles.backgroundIconsContainer} pointerEvents="none">
        <MaterialIcons name="fitness-center" size={128} color="#000" style={StyleSheet.flatten([styles.bgIcon, { top: 80, left: 40, transform: [{ rotate: '12deg' }] }])} />
        <MaterialIcons name="favorite" size={96} color="#000" style={StyleSheet.flatten([styles.bgIcon, { top: '25%', right: -20, transform: [{ rotate: '-12deg' }] }])} />
        <MaterialIcons name="timer" size={128} color="#000" style={StyleSheet.flatten([styles.bgIcon, { bottom: '25%', left: -10, transform: [{ rotate: '45deg' }] }])} />
        <MaterialIcons name="bolt" size={120} color="#000" style={StyleSheet.flatten([styles.bgIcon, { bottom: 40, right: 40, transform: [{ rotate: '-12deg' }] }])} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={20} color={COLORS.slate900} />
            </Pressable>
            
            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
            </View>
          </View>

          {/* Main Content */}
          <ScrollView 
            style={styles.mainContent} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleSection}>
              <Text style={styles.title}>Qual o seu nível de atividade?</Text>
              <Text style={styles.subtitle}>
                Isso ajuda a IA a calcular sua queima calórica diária com precisão.
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {ACTIVITY_OPTIONS.map((option) => {
                const isSelected = selectedActivity === option.id;
                return (
                  <Pressable
                    key={option.id}
                    style={StyleSheet.flatten([
                      styles.optionCard,
                      isSelected && styles.optionCardSelected
                    ])}
                    onPress={() => handleSelect(option.id)}
                  >
                    <View style={styles.optionHeader}>
                      <Text style={styles.optionLabel}>
                        {option.label}
                      </Text>
                      <View style={StyleSheet.flatten([
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected
                      ])}>
                        {isSelected && <View style={styles.radioButtonInner} />}
                      </View>
                    </View>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer Action Button */}
          <View style={styles.footer}>
            <Pressable 
              style={styles.continueButton} 
              onPress={handleNext}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
              <MaterialIcons name="arrow-forward" size={24} color={COLORS.white} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    position: 'relative',
  },
  backgroundIconsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    opacity: 0.03,
  },
  bgIcon: {
    position: 'absolute',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.slate100,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28, // text-3xl approx
    fontWeight: 'bold',
    color: COLORS.slate900,
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 18, // text-lg
    color: COLORS.slate500,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: COLORS.cardLight,
    borderRadius: 16, // rounded-2xl
    borderWidth: 2,
    borderColor: COLORS.slate100,
    padding: 20, // p-5
    flexDirection: 'column',
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 18, // text-lg
    fontWeight: 'bold', // font-bold
    color: COLORS.slate800,
  },
  optionDescription: {
    fontSize: 14, // text-sm
    color: COLORS.slate500,
    marginTop: 4, // mt-1
  },
  radioButton: {
    width: 24, // w-6
    height: 24, // h-6
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.slate200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    borderWidth: 0,
  },
  radioButtonInner: {
    width: 10, // w-2.5
    height: 10, // h-2.5
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },
  footer: {
    marginTop: 24,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default QuizExerciseRoutineScreen;
