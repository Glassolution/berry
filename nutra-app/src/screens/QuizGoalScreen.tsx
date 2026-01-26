import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useQuiz } from '../context/QuizContext';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizGoalScreen'>;

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

// Colors
const COLORS = {
  primary: '#000000',
  backgroundLight: '#FFFFFF',
  cardLight: '#F9FAFB',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate500: '#64748B',
  slate800: '#1E293B',
  slate900: '#0F172A',
  white: '#FFFFFF',
};

const QuizGoalScreen = () => {
  const router = useRouter();
  const { updateQuizData } = useQuiz();
  const [selectedActivity, setSelectedActivity] = useState<ActivityLevel>('light');

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
    console.log('Next pressed, activity:', selectedActivity);
    updateQuizData({ activityLevel: selectedActivity });
    router.push('/QuizSocialProofScreen');
  };

  const handleSelect = (id: ActivityLevel) => {
    if (selectedActivity !== id) {
      Haptics.selectionAsync();
      setSelectedActivity(id);
    }
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
              <View style={[styles.progressBarFill, { width: '75%' }]} />
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
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
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable style={styles.continueButton} onPress={handleNext}>
              <Text style={styles.continueButtonText}>Continuar</Text>
              <MaterialIcons name="arrow-forward" size={24} color={COLORS.white} />
            </Pressable>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
};

const GoalOptionCard = ({ label, value, selected, onSelect }: { label: string, value: string, selected: boolean, onSelect: () => void }) => (
  <Pressable 
    style={StyleSheet.flatten([
      styles.optionCard, 
      selected && styles.optionCardSelected
    ])}
    onPress={onSelect}
  >
    <View style={styles.optionHeader}>
      <Text style={StyleSheet.flatten([
          styles.optionLabel, 
          selected && styles.optionLabelSelected
      ])}>
          {label}
      </Text>
      <View style={StyleSheet.flatten([
        styles.radioButton,
        selected && styles.radioButtonSelected
      ])}>
        {selected && <View style={styles.radioButtonInner} />}
      </View>
    </View>
    <Text style={styles.optionDescription}>
        Selecione esta opção se for sua prioridade.
    </Text>
  </Pressable>
);

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
    paddingTop: 10,
    paddingBottom: 32,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    marginRight: 16,
    backgroundColor: COLORS.slate100,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.slate100,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%', // Updated progress to 100%
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  mainContent: {
    flex: 1,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30, // text-3xl
    fontWeight: 'bold',
    color: COLORS.slate900,
    marginBottom: 12, // mb-3
    letterSpacing: -0.5, // tracking-tight
  },
  subtitle: {
    fontSize: 18, // text-lg
    color: COLORS.slate500,
    lineHeight: 28, // leading-relaxed
  },
  sectionHeaderContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.slate900,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  sectionSubHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.slate900,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'serif',
    textAlign: 'center',
    marginTop: 8,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: COLORS.cardLight,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.slate100,
    padding: 20,
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
  optionLabelSelected: {
    // color: COLORS.primary, // The html doesn't change text color on select, only border/ring
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
    marginTop: 'auto',
    paddingTop: 24,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16, // rounded-xl default in theme
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
});

export default QuizGoalScreen;
