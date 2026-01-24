import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizSocialProofScreen'>;

// Colors
const COLORS = {
  primary: '#000000',
  backgroundLight: '#FFFFFF',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate800: '#1E293B',
  slate900: '#0F172A',
  white: '#FFFFFF',
  yellow: '#FFB800',
};

const QuizSocialProofScreen = ({ navigation }: Props) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
    console.log('Next pressed from Social Proof');
    navigation.navigate('QuizGoalWeightScreen');
  };

  // Animate fade in
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      delay: 200,
    }).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['75%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background Icons */}
      <View style={styles.backgroundIconsContainer} pointerEvents="none">
        <MaterialIcons name="fitness-center" size={64} color={COLORS.primary} style={[styles.bgIcon, { top: 80, left: 40, transform: [{ rotate: '12deg' }] }]} />
        <MaterialIcons name="restaurant" size={64} color={COLORS.primary} style={[styles.bgIcon, { top: 150, right: 30, transform: [{ rotate: '-15deg' }] }]} />
        <MaterialIcons name="monitor-heart" size={64} color={COLORS.primary} style={[styles.bgIcon, { top: '40%', left: -10, transform: [{ rotate: '5deg' }] }]} />
        <MaterialIcons name="favorite" size={64} color={COLORS.primary} style={[styles.bgIcon, { bottom: 200, right: 40, transform: [{ rotate: '-10deg' }] }]} />
        <MaterialIcons name="local-fire-department" size={64} color={COLORS.primary} style={[styles.bgIcon, { bottom: 100, left: 80, transform: [{ rotate: '20deg' }] }]} />
        <MaterialIcons name="self-improvement" size={64} color={COLORS.primary} style={[styles.bgIcon, { top: '20%', right: '40%', transform: [{ rotate: '-5deg' }] }]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="chevron-left" size={32} color={COLORS.slate900} />
            </Pressable>
            
            {/* Progress Bar Removed */}
            <View style={{ flex: 1 }} />
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
            style={{ flex: 1 }}
          >
            
            <View style={styles.headerSection}>
              <Text style={styles.title}>
                O que dizem sobre o Berry
              </Text>
            </View>

            <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
              
              {/* Stars Section */}
              <View style={styles.starsContainer}>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <MaterialIcons key={i} name="star" size={36} color={COLORS.yellow} />
                  ))}
                </View>
              </View>

              {/* Users Section */}
              <View style={styles.usersContainer}>
                <View style={styles.avatarGroup}>
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlxgWmV0Uu4fyd8ASC9782pqeJHgHkS0sKH7BE-sII-ep2ucg6_i6hzMc0x_HedAjFm2UWkDqglUN7pnWosOoJfxh01IaK49GMBxBLpvjfsvj_ItufGR2ztisk1lCRGMrRAZRAXly4Ah3fNLI8rntAUhSAGOlgljkrJXEtew5WFPrllEuaToFq5nyqWCuyWaDgXLaGH0UhInSrxZTJ0rP6TAI4TiNbCEj3Bu3q4b8cqOWgbXjd3QMMY4ur_fTvVHUFxIilFY8Rt8ri' }}
                    style={[styles.avatar, { zIndex: 1 }]}
                  />
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYL7KkrvGYh8bRAcRxOUtGxILHtaE3va8b3fxFZBy5DLuK2B-vxY1TUVeen6oCbqP0yx0S6E_7bf2jymHrlDdBaW7Uo7z0n1CHhUMET16uBrmoH3XaBwpUvEgbN642oDHcTd13Y3RABJ9Dm2Sdbu79pAL4GFSyyOTN6HeFneG9mJNXNUTyA_nPjqNMD5BCbfncGg2ptJdcI32iVskcxjdD9b4tQ87vk4WyfNbajpshOUNLdBLekBrhAWLqGG-TEWjEe9L_l1b5-zzD' }}
                    style={[styles.avatar, styles.avatarLarge, { zIndex: 2 }]}
                  />
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_wlAxorM8AT6nFIVSX71UQH5Zqrp2XGmMlKcP6wA-Gw92wBbVCFgqZ8gSknPlYuJFNSyIRnj64scuvqHXk-NlcVBeXErHiXFMbeCYveW4ZcBxKJNdSERvYOc9ftSRd7w_eEHoUGbO5cBV1p2cy4Gjov5y_wkUJxHGw_VYLmTs9QM7f5wBPlyv1mo9db9Bw_RGgZZx1yXlOBCm5v69_LDZ8ytqMwSETQrP588iAi98B0RXoarPbR7yp-uk5u2jiQXMiJfEvrd_XYt1' }}
                    style={[styles.avatar, { zIndex: 1 }]}
                  />
                </View>
                
                <Text style={styles.userCountText}>+1.000.000 Usuários</Text>
              </View>

              {/* Big Stat */}
              <View style={styles.statSection}>
                <Text style={styles.statTitle}>80% dos usuários</Text>
                <Text style={styles.statSubtitle}>
                  alcançaram sua meta de peso com o Berry
                </Text>
              </View>

              {/* Testimonial Card */}
              <View style={styles.card}>
                {/* Decoratve Blur Circle */}
                <View style={styles.blurCircle} />
                
                <View style={styles.cardHeader}>
                  <View style={styles.cardUser}>
                    <Image 
                      source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0YXjBSARaQBsQQG72olCAfu1Dq7pZ_N5emsKDTumlJmgYuYUhrwj5tYhy4_SH0sZ36RcURfZzknCoGLOgBK5r3ydvfQVhz61LzGGzel1iqhjrlSwQjUu9R-uBdXpEJpjpTvVXyoI5I3msPf-VILV1XGjBIhj3aAIwlQa_czp1ATpk1EMSY_VBUjWhcV8gB4fb4lklrxlcJitMjuhtzsvQ5fARlzbtunFHPrgA65C08JAajSFXq1LF2VyHPYuxFZzkMT5pTE7IWp2M' }}
                      style={styles.cardAvatar}
                    />
                    <Text style={styles.cardUserName}>Jessica Parker</Text>
                  </View>
                  <View style={styles.cardStars}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <MaterialIcons key={i} name="star" size={14} color={COLORS.yellow} />
                    ))}
                  </View>
                </View>
                
                <Text style={styles.cardText}>
                  "O escaneamento por IA é incrível, facilitou muito minha dieta!"
                </Text>

                {/* Pagination Dots (from HTML cut off) */}
                <View style={styles.dotsContainer}>
                   <View style={[styles.dot, styles.dotActive]} />
                   <View style={styles.dot} />
                   <View style={styles.dot} />
                </View>
              </View>

            </Animated.View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable 
              style={({ pressed }) => [
                styles.continueButton,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
              ]}
              onPress={handleNext}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
              <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
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
    marginBottom: 20,
  },
  backButton: {
    padding: 0,
    marginRight: 16,
    marginLeft: -8,
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
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  headerSection: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.slate900,
    lineHeight: 34,
    width: '70%', // Reduced width to force wrap
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  starsContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  usersContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  starsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    gap: 4,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    height: 96, // Enough space for the large avatar
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.white,
    marginHorizontal: -10,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: COLORS.white,
    zIndex: 10,
    marginHorizontal: -10,
    transform: [{ scale: 1.1 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  userCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate500,
    letterSpacing: 0.5,
  },
  statSection: {
    alignItems: 'center',
    marginBottom: 0,
  },
  statTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 18,
    color: COLORS.slate600,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.slate100,
    borderRadius: 28,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  blurCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    backgroundColor: COLORS.slate200,
    borderRadius: 64,
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    zIndex: 1,
  },
  cardUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  cardUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  cardStars: {
    flexDirection: 'row',
    gap: 2,
  },
  cardText: {
    fontSize: 16,
    color: COLORS.slate800,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 16,
    zIndex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.slate300,
  },
  dotActive: {
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

export default QuizSocialProofScreen;
