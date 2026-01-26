import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle, Line, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const QuizPlanReadyScreen = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/QuizSaveProgressScreen');
  };

  const handlePersonalize = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Add logic to open personalization modal/screen
    console.log("Personalizar valores");
  };

  return (
    <View style={styles.container}>
      {/* Background Icons (Low Opacity) */}
      <View style={styles.bgIconsContainer}>
        <MaterialIcons name="fitness-center" size={240} color="#000" style={[styles.bgIcon, { opacity: 0.03, top: -40, right: -40 }]} />
        <MaterialIcons name="restaurant-menu" size={200} color="#000" style={[styles.bgIcon, { opacity: 0.03, bottom: 160, left: -48 }]} />
        <MaterialIcons name="kitchen" size={180} color="#000" style={[styles.bgIcon, { opacity: 0.02, top: '50%', right: -64 }]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#000" style={{ marginLeft: 6 }} />
          </Pressable>
          
          <View style={styles.progressBadge}>
            <View style={styles.progressRing}>
               <Svg width={64} height={64} viewBox="0 0 64 64">
                 <Circle cx="32" cy="32" r="30" stroke="rgba(0,0,0,0.05)" strokeWidth="2" fill="none" />
                 <Circle cx="32" cy="32" r="30" stroke="#000" strokeWidth="2" fill="none" strokeDasharray={`${2 * Math.PI * 30}`} />
               </Svg>
            </View>
            <View style={styles.progressContent}>
              <Text style={styles.progressText}>100%</Text>
              <MaterialIcons name="check-circle" size={16} color="#000" />
            </View>
          </View>
          
          <View style={{ width: 40 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleMain}>
              Seu Plano{'\n'}
              está <Text style={styles.titleItalic}>Pronto</Text>
            </Text>
          </View>

          {/* Weight Goal Section */}
          <View style={styles.goalContainer}>
            <Text style={styles.goalLabel}>META DE PESO</Text>
            <View style={styles.goalValueContainer}>
              <Text style={styles.goalValue}>70</Text>
              <Text style={styles.goalUnit}>kg</Text>
            </View>
          </View>

          {/* Central Graphic Section */}
          <View style={styles.graphicContainer}>
            {/* SVG Lines and Rings */}
            <View style={StyleSheet.absoluteFill}>
               <Svg width="100%" height="100%" viewBox="0 0 400 400" style={{ opacity: 0.2 }}>
                 {/* Connecting lines for macros */}
                 {/* Top Left (Proteins) - adjusted to match card position */}
                 <Line x1="160" y1="160" x2="80" y2="80" stroke="#000" strokeWidth="1" />
                 {/* Top Right (Carbs) */}
                 <Line x1="240" y1="160" x2="320" y2="90" stroke="#000" strokeWidth="1" />
                 {/* Bottom Left (Fats) */}
                 <Line x1="160" y1="240" x2="70" y2="310" stroke="#000" strokeWidth="1" />
                 {/* Bottom Right (Water) */}
                 <Line x1="240" y1="240" x2="330" y2="300" stroke="#000" strokeWidth="1" />
                 
                 {/* Outer rings */}
                 <Circle cx="200" cy="200" r="140" stroke="#000" strokeWidth="1" strokeDasharray="4 4" />
                 <Circle cx="200" cy="200" r="180" stroke="#000" strokeWidth="0.5" opacity="0.5" />
               </Svg>
            </View>

            {/* Macro Cards - Absolute Positioned */}
            {/* Proteins - Top Left */}
            <View style={[styles.macroCard, styles.macroCardTopLeft]}>
                <View style={styles.macroHeader}>
                    <MaterialIcons name="restaurant" size={14} color="#EF4444" />
                    <Text style={styles.macroLabel}>PROTEÍNAS</Text>
                </View>
                <Text style={styles.macroValue}>140g</Text>
            </View>

            {/* Carbs - Top Right */}
            <View style={[styles.macroCard, styles.macroCardTopRight]}>
                <View style={styles.macroHeader}>
                    <MaterialIcons name="grass" size={14} color="#F59E0B" />
                    <Text style={styles.macroLabel}>CARBOS</Text>
                </View>
                <Text style={styles.macroValue}>200g</Text>
            </View>

            {/* Fats - Bottom Left */}
            <View style={[styles.macroCard, styles.macroCardBottomLeft]}>
                <View style={styles.macroHeader}>
                    <MaterialIcons name="water-drop" size={14} color="#10B981" />
                    <Text style={styles.macroLabel}>GORDURAS</Text>
                </View>
                <Text style={styles.macroValue}>60g</Text>
            </View>

            {/* Water - Bottom Right */}
            <View style={[styles.macroCard, styles.macroCardBottomRight]}>
                <View style={styles.macroHeader}>
                    <MaterialIcons name="water-drop" size={14} color="#3B82F6" />
                    <Text style={styles.macroLabel}>ÁGUA</Text>
                </View>
                <Text style={styles.macroValue}>2.5L</Text>
            </View>


            {/* Central Circle */}
            <View style={styles.centerCircleWrapper}>
                <View style={styles.centerCirclePulse} />
                <View style={styles.centerCirclePulseOuter} />
                <View style={styles.centerCircle}>
                    <Text style={styles.caloriesValue}>1.800</Text>
                    <Text style={styles.caloriesLabel}>KCAL</Text>
                    <MaterialIcons name="bolt" size={16} color="rgba(255,255,255,0.4)" style={{ marginTop: 4 }} />
                </View>
            </View>
          </View>

          {/* Personalize Link */}
          <Pressable onPress={handlePersonalize} style={styles.personalizeLink}>
            <MaterialIcons name="edit" size={16} color="#A1A1AA" />
            <Text style={styles.personalizeText}>Personalizar valores</Text>
          </Pressable>

          {/* Footer Action */}
          <View style={styles.footer}>
            <Pressable 
                style={({ pressed }) => [styles.continueButton, pressed && styles.buttonPressed]}
                onPress={handleContinue}
            >
                <Text style={styles.continueButtonText}>Vamos começar!</Text>
                <MaterialIcons name="auto-awesome" size={20} color="#fff" />
            </Pressable>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgIconsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  bgIcon: {
    position: 'absolute',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F4F4F5',
  },
  progressBadge: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 64,
    height: 64,
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
    marginBottom: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  titleMain: {
    fontSize: 38,
    fontWeight: '400', // Try to mimic serif weight
    color: '#000',
    textAlign: 'center',
    lineHeight: 44,
    // fontFamily: 'serif', // React Native serif fallback
  },
  titleItalic: {
    fontStyle: 'italic',
    fontWeight: '300',
  },
  goalContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  goalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A1A1AA',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  goalValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goalValue: {
    fontSize: 72,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -2,
  },
  goalUnit: {
    fontSize: 20,
    fontWeight: '300',
    color: '#A1A1AA',
    marginLeft: 4,
  },
  graphicContainer: {
    width: width - 24,
    height: width - 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  centerCircleWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10,
  },
  centerCirclePulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.05)',
    transform: [{ scale: 1.1 }],
  },
  centerCirclePulseOuter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.03)',
    transform: [{ scale: 1.25 }],
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
  },
  caloriesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    marginTop: 4,
  },
  
  // Macro Cards Styles
  macroCard: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 20,
    minWidth: 90,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  macroCardTopLeft: {
    top: '15%',
    left: '5%',
  },
  macroCardTopRight: {
    top: '18%',
    right: '5%',
  },
  macroCardBottomLeft: {
    bottom: '18%',
    left: '5%',
  },
  macroCardBottomRight: {
    bottom: '15%',
    right: '5%',
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A1A1AA',
    textTransform: 'uppercase',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    marginLeft: 18, // Indent to align with text
  },

  personalizeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  personalizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A1A1AA',
  },

  footer: {
    width: '100%',
    marginTop: 10,
  },
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#000',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});

export default QuizPlanReadyScreen;
