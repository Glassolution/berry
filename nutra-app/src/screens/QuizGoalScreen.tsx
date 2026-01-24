import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizGoalScreen'>;

type GoalOption = 'lose_weight' | 'maintain_weight' | 'gain_muscle';

const { width } = Dimensions.get('window');

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

const QuizGoalScreen = ({ navigation }: Props) => {
  const [selectedGoal, setSelectedGoal] = useState<GoalOption>('lose_weight');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
    console.log('Next pressed, goal:', selectedGoal);
    navigation.navigate('QuizActivityScreen');
  };

  return (
    <View style={styles.container}>
      {/* Background Icons */}
      <View style={styles.backgroundIconsContainer} pointerEvents="none">
        <MaterialIcons name="fitness-center" size={128} color="#000" style={[styles.bgIcon, { top: 80, left: 40, transform: [{ rotate: '12deg' }] }]} />
        <MaterialIcons name="favorite-border" size={96} color="#000" style={[styles.bgIcon, { top: '25%', right: -20, transform: [{ rotate: '-12deg' }] }]} />
        <MaterialIcons name="timer" size={128} color="#000" style={[styles.bgIcon, { bottom: '25%', left: -10, transform: [{ rotate: '45deg' }] }]} />
        <MaterialIcons name="bolt" size={120} color="#000" style={[styles.bgIcon, { bottom: 40, right: 40, transform: [{ rotate: '-12deg' }] }]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={20} color={COLORS.slate900} />
            </Pressable>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFill} />
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Qual é o seu objetivo?</Text>
              <Text style={styles.subtitle}>Escolha a meta que melhor descreve o que você busca.</Text>
            </View>

            <View style={styles.optionsContainer}>
              
              <GoalOptionCard 
                label="Perder peso" 
                value="lose_weight" 
                selected={selectedGoal === 'lose_weight'} 
                onSelect={() => {
                  setSelectedGoal('lose_weight');
                  Haptics.selectionAsync();
                }} 
              />

              <GoalOptionCard 
                label="Manter peso" 
                value="maintain_weight" 
                selected={selectedGoal === 'maintain_weight'} 
                onSelect={() => {
                  setSelectedGoal('maintain_weight');
                  Haptics.selectionAsync();
                }} 
              />

              <GoalOptionCard 
                label="Ganhar massa muscular" 
                value="gain_muscle" 
                selected={selectedGoal === 'gain_muscle'} 
                onSelect={() => {
                  setSelectedGoal('gain_muscle');
                  Haptics.selectionAsync();
                }} 
              />

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
    style={[
      styles.optionCard, 
      selected && styles.optionCardSelected
    ]}
    onPress={onSelect}
  >
    <Text style={styles.optionText}>{label}</Text>
    <View style={[
      styles.radioButton,
      selected && styles.radioButtonSelected
    ]}>
      {selected && <View style={styles.radioButtonInner} />}
    </View>
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
    width: '40%', // Updated progress
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  mainContent: {
    flex: 1,
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.slate900,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.slate500,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.slate100,
    backgroundColor: COLORS.cardLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.slate800,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.slate200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
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
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
