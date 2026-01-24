import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizActivityScreen'>;

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
  {
    id: 'very_active',
    label: 'Muito Intenso',
    description: 'Exercício muito pesado e trabalho físico',
  },
];

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
  slate800: '#1E293B',
  slate900: '#0F172A',
  white: '#FFFFFF',
};

const QuizActivityScreen = ({ navigation }: Props) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityLevel>('light');
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
    console.log('Next pressed, activity:', selectedActivity);
    navigation.navigate('QuizSocialProofScreen');
  };

  const handleSelect = (id: ActivityLevel) => {
    if (selectedActivity !== id) {
      Haptics.selectionAsync();
      setSelectedActivity(id);
    }
  };

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['50%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background Icons */}
      <View style={styles.backgroundIconsContainer} pointerEvents="none">
        <MaterialIcons name="fitness-center" size={128} color="#000" style={[styles.bgIcon, { top: 80, left: 40, transform: [{ rotate: '12deg' }] }]} />
        <MaterialIcons name="favorite-border" size={96} color="#000" style={[styles.bgIcon, { top: '25%', right: -20, transform: [{ rotate: '-12deg' }] }]} />
        <MaterialIcons name="bolt" size={120} color="#000" style={[styles.bgIcon, { bottom: 40, left: 40, transform: [{ rotate: '12deg' }] }]} />
        <MaterialIcons name="monitor-weight" size={100} color="#000" style={[styles.bgIcon, { top: '25%', right: '25%', transform: [{ rotate: '12deg' }] }]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={20} color={COLORS.slate900} />
            </Pressable>
            
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} /> 
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

            {/* Options List */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionsList}
            >
              {ACTIVITY_OPTIONS.map((option) => {
                const isSelected = selectedActivity === option.id;
                return (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected
                    ]}
                    onPress={() => handleSelect(option.id)}
                  >
                    <View style={styles.optionContent}>
                      <View style={styles.optionTextContainer}>
                        <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                          {option.label}
                        </Text>
                        <Text style={styles.optionDescription}>
                          {option.description}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected
                      ]}>
                        {isSelected && <View style={styles.radioButtonInner} />}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
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
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    backgroundColor: COLORS.slate100,
    borderRadius: 999,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.slate200,
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
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.slate900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.slate500,
    lineHeight: 24,
  },
  optionsList: {
    paddingBottom: 20,
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.slate900,
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: COLORS.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.slate500,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.slate200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  footer: {
    paddingVertical: 20,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default QuizActivityScreen;
