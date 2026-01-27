import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useQuiz } from '../context/QuizContext';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizGenderScreen'>;

type GenderOption = 'homem' | 'mulher' | 'outro';

const { width, height } = Dimensions.get('window');

// Colors from Tailwind config & Slate palette
const COLORS = {
  primary: '#000000',
  backgroundLight: '#FFFFFF',
  cardLight: '#F9FAFB', // custom card-light
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate500: '#64748B',
  slate800: '#1E293B',
  slate900: '#0F172A',
  white: '#FFFFFF',
};

const QuizGenderScreen = () => {
  const router = useRouter();
  const { updateQuizData } = useQuiz();
  const [selectedGender, setSelectedGender] = useState<GenderOption>('mulher');

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
    console.log('Next pressed, gender:', selectedGender);
    updateQuizData({ gender: selectedGender });
    router.push('/QuizAgeScreen');
  };

  return (
    <View style={styles.container}>
      {/* Background Icons - Positioned to match HTML */}
      <View style={styles.backgroundIconsContainer} pointerEvents="none">
        {/* top-20 left-10 rotate-12 */}
        <MaterialIcons name="fitness-center" size={128} color="#000" style={StyleSheet.flatten([styles.bgIcon, { top: 80, left: 40, transform: [{ rotate: '12deg' }] }])} />
        
        {/* top-1/4 right-[-20px] -rotate-12 */}
        <MaterialIcons name="favorite-border" size={96} color="#000" style={StyleSheet.flatten([styles.bgIcon, { top: '25%', right: -20, transform: [{ rotate: '-12deg' }] }])} />
        
        {/* bottom-1/4 left-[-10px] rotate-45 */}
        <MaterialIcons name="timer" size={128} color="#000" style={StyleSheet.flatten([styles.bgIcon, { bottom: '25%', left: -10, transform: [{ rotate: '45deg' }] }])} />
        
        {/* bottom-10 right-10 -rotate-12 */}
        <MaterialIcons name="bolt" size={120} color="#000" style={StyleSheet.flatten([styles.bgIcon, { bottom: 40, right: 40, transform: [{ rotate: '-12deg' }] }])} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          
          {/* Header Bar: Back Button + Progress Bar */}
          {/* mb-8 */}
          <View style={styles.headerBar}>
            {/* w-10 h-10 rounded-full bg-slate-100 */}
            <Pressable style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={20} color={COLORS.slate900} />
            </Pressable>
            
            {/* flex-1 ml-4 h-1.5 bg-slate-100 rounded-full */}
            <View style={styles.progressBarContainer}>
              {/* w-1/4 h-full bg-primary */}
              <View style={styles.progressBarFill} />
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* mb-10 */}
            <View style={styles.titleSection}>
              {/* text-3xl font-bold text-slate-900 tracking-tight mb-3 */}
              <Text style={styles.title}>Qual o seu gênero?</Text>
              
              {/* text-lg text-slate-500 leading-relaxed */}
              <Text style={styles.subtitle}>Isso nos ajuda a calibrar seus planos e metas.</Text>
            </View>

            {/* space-y-4 */}
            <View style={styles.optionsContainer}>
              
              {/* Option: Homem */}
              <GenderOptionCard 
                label="Homem" 
                value="homem" 
                selected={selectedGender === 'homem'} 
                onSelect={() => setSelectedGender('homem')} 
              />

              {/* Option: Mulher */}
              <GenderOptionCard 
                label="Mulher" 
                value="mulher" 
                selected={selectedGender === 'mulher'} 
                onSelect={() => setSelectedGender('mulher')} 
              />

              {/* Option: Outro */}
              <GenderOptionCard 
                label="Outro" 
                value="outro" 
                selected={selectedGender === 'outro'} 
                onSelect={() => setSelectedGender('outro')} 
              />

            </View>
          </View>

          {/* Footer Action Button */}
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

// Helper component for options to reduce repetition
const GenderOptionCard = ({ label, value, selected, onSelect }: { label: string, value: string, selected: boolean, onSelect: () => void }) => (
  <Pressable 
    style={StyleSheet.flatten([
      styles.optionCard, 
      selected && styles.optionCardSelected
    ])}
    onPress={onSelect}
  >
    <Text style={styles.optionText}>{label}</Text>
    <View style={StyleSheet.flatten([
      styles.radioButton,
      selected && styles.radioButtonSelected
    ])}>
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
    paddingHorizontal: 24, // px-6
    paddingTop: 12, // pt-12 (approx adjusted for SafeArea)
    paddingBottom: 32, // pb-8
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32, // mb-8 (8 * 4 = 32)
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16, // ml-4 on the next item implies margin between
  },
  progressBarContainer: {
    flex: 1,
    height: 6, // h-1.5 (1.5 * 4 = 6)
    backgroundColor: COLORS.slate100,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '12%', // w-1/8
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  mainContent: {
    flex: 1,
  },
  titleSection: {
    marginBottom: 40, // mb-10 (10 * 4 = 40)
  },
  title: {
    fontSize: 30, // text-3xl
    fontWeight: '700', // font-bold
    color: COLORS.slate900,
    marginBottom: 12, // mb-3 (3 * 4 = 12)
    letterSpacing: -0.5, // tracking-tight
  },
  subtitle: {
    fontSize: 18, // text-lg
    color: COLORS.slate500,
    lineHeight: 28, // leading-relaxed
  },
  optionsContainer: {
    gap: 16, // space-y-4
  },
  optionCard: {
    width: '100%',
    padding: 24, // p-6
    borderRadius: 32, // rounded-[32px] matching dashboard
    borderWidth: 1, // border-1 for unselected
    borderColor: COLORS.slate100,
    backgroundColor: COLORS.white, // clean white bg
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionCardSelected: {
    borderColor: COLORS.primary, // peer-checked:border-primary
    borderWidth: 2, // Thicker border for selected
    backgroundColor: COLORS.cardLight, // Subtle highlight
  },
  optionText: {
    fontSize: 18, // Slightly refined
    fontWeight: '600', // font-semibold
    color: COLORS.slate900, // darker text
  },
  radioButton: {
    width: 24, // w-6
    height: 24, // h-6
    borderRadius: 12, // rounded-full
    borderWidth: 1.5,
    borderColor: COLORS.slate300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    backgroundColor: COLORS.primary, // peer-checked:bg-primary
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 10, // w-2.5 (2.5 * 4 = 10)
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

export default QuizGenderScreen;
