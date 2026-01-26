import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizSocialProofScreen'>;

const { width } = Dimensions.get('window');

// Colors based on HTML
const COLORS = {
  primary: '#000000',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#121212',
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

const QuizSocialProofScreen = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
    console.log('Next pressed from Social Proof');
    router.push('/QuizGoalWeightScreen');
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      delay: 200,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Icons (Absolute Positioned) */}
      <View style={styles.backgroundIconsContainer} pointerEvents="none">
        <View style={styles.bgIconWrapper}>
            <MaterialIcons name="fitness-center" size={64} color={COLORS.primary} style={StyleSheet.flatten([styles.bgIcon, { top: 80, left: 40, transform: [{ rotate: '12deg' }] }])} />
            <MaterialIcons name="restaurant" size={64} color={COLORS.primary} style={StyleSheet.flatten([styles.bgIcon, { top: 150, right: 30, transform: [{ rotate: '-15deg' }] }])} />
            <MaterialIcons name="monitor-heart" size={64} color={COLORS.primary} style={StyleSheet.flatten([styles.bgIcon, { top: '40%', left: -10, transform: [{ rotate: '5deg' }] }])} />
            <MaterialIcons name="favorite" size={64} color={COLORS.primary} style={StyleSheet.flatten([styles.bgIcon, { bottom: 200, right: 40, transform: [{ rotate: '-10deg' }] }])} />
            <MaterialIcons name="local-fire-department" size={64} color={COLORS.primary} style={StyleSheet.flatten([styles.bgIcon, { bottom: 100, left: 80, transform: [{ rotate: '20deg' }] }])} />
            <MaterialIcons name="self-improvement" size={64} color={COLORS.primary} style={StyleSheet.flatten([styles.bgIcon, { top: '20%', right: '40%', transform: [{ rotate: '-5deg' }] }])} />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="chevron-left" size={32} color={COLORS.slate900} />
            </Pressable>
            <Text style={styles.headerTitle}>
                O que dizem sobre o Berry
            </Text>
        </View>

        <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                
                {/* Stars Row */}
                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <MaterialIcons key={i} name="star" size={36} color={COLORS.yellow} />
                    ))}
                </View>

                {/* Avatar Group */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarGroup}>
                        <Image 
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlxgWmV0Uu4fyd8ASC9782pqeJHgHkS0sKH7BE-sII-ep2ucg6_i6hzMc0x_HedAjFm2UWkDqglUN7pnWosOoJfxh01IaK49GMBxBLpvjfsvj_ItufGR2ztisk1lCRGMrRAZRAXly4Ah3fNLI8rntAUhSAGOlgljkrJXEtew5WFPrllEuaToFq5nyqWCuyWaDgXLaGH0UhInSrxZTJ0rP6TAI4TiNbCEj3Bu3q4b8cqOWgbXjd3QMMY4ur_fTvVHUFxIilFY8Rt8ri' }}
                            style={StyleSheet.flatten([styles.avatar, { zIndex: 1 }])}
                        />
                        <Image 
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYL7KkrvGYh8bRAcRxOUtGxILHtaE3va8b3fxFZBy5DLuK2B-vxY1TUVeen6oCbqP0yx0S6E_7bf2jymHrlDdBaW7Uo7z0n1CHhUMET16uBrmoH3XaBwpUvEgbN642oDHcTd13Y3RABJ9Dm2Sdbu79pAL4GFSyyOTN6HeFneG9mJNXNUTyA_nPjqNMD5BCbfncGg2ptJdcI32iVskcxjdD9b4tQ87vk4WyfNbajpshOUNLdBLekBrhAWLqGG-TEWjEe9L_l1b5-zzD' }}
                            style={StyleSheet.flatten([styles.avatar, styles.avatarLarge, { zIndex: 2 }])}
                        />
                        <Image 
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_wlAxorM8AT6nFIVSX71UQH5Zqrp2XGmMlKcP6wA-Gw92wBbVCFgqZ8gSknPlYuJFNSyIRnj64scuvqHXk-NlcVBeXErHiXFMbeCYveW4ZcBxKJNdSERvYOc9ftSRd7w_eEHoUGbO5cBV1p2cy4Gjov5y_wkUJxHGw_VYLmTs9QM7f5wBPlyv1mo9db9Bw_RGgZZx1yXlOBCm5v69_LDZ8ytqMwSETQrP588iAi98B0RXoarPbR7yp-uk5u2jiQXMiJfEvrd_XYt1' }}
                            style={StyleSheet.flatten([styles.avatar, { zIndex: 1 }])}
                        />
                    </View>
                    <Text style={styles.userCountText}>+1.000.000 Usuários</Text>
                </View>

                {/* Main Stat */}
                <View style={styles.statContainer}>
                    <Text style={styles.statTitle}>80% dos usuários</Text>
                    <Text style={styles.statSubtitle}>alcançaram sua meta de peso com o Berry</Text>
                </View>

                {/* Testimonial Card */}
                <View style={styles.card}>
                    {/* Blur Effect Circle (Simulated) */}
                    <View style={styles.blurCircle} />
                    
                    <View style={styles.cardHeader}>
                        <View style={styles.userInfo}>
                            <Image 
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0YXjBSARaQBsQQG72olCAfu1Dq7pZ_N5emsKDTumlJmgYuYUhrwj5tYhy4_SH0sZ36RcURfZzknCoGLOgBK5r3ydvfQVhz61LzGGzel1iqhjrlSwQjUu9R-uBdXpEJpjpTvVXyoI5I3msPf-VILV1XGjBIhj3aAIwlQa_czp1ATpk1EMSY_VBUjWhcV8gB4fb4lklrxlcJitMjuhtzsvQ5fARlzbtunFHPrgA65C08JAajSFXq1LF2VyHPYuxFZzkMT5pTE7IWp2M' }}
                                style={styles.userAvatar}
                            />
                            <Text style={styles.userName}>Jessica Parker</Text>
                        </View>
                        <View style={styles.smallStars}>
                             {[1, 2, 3, 4, 5].map((i) => (
                                <MaterialIcons key={i} name="star" size={16} color={COLORS.yellow} />
                            ))}
                        </View>
                    </View>

                    <Text style={styles.testimonialText}>
                        "O escaneamento por IA é incrível, facilitou muito minha dieta!"
                    </Text>

                    {/* Pagination Dots */}
                    <View style={styles.paginationDots}>
                        <View style={StyleSheet.flatten([styles.dot, styles.dotActive])} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>

            </Animated.View>
        </ScrollView>

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
  backgroundIconsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  bgIconWrapper: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  bgIcon: {
    position: 'absolute',
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800', // extrabold
    color: COLORS.primary,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  starsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate50,
    paddingVertical: 24,
    paddingHorizontal: 40, // wide padding
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    gap: 8,
    marginBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 96,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.white,
    marginHorizontal: -12, // negative margin for overlap
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: COLORS.white,
    marginHorizontal: -12,
    zIndex: 10,
    transform: [{ scale: 1.1 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  userCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.slate500,
    letterSpacing: 0.5,
  },
  statContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  statTitle: {
    fontSize: 36, // text-4xl
    fontWeight: '900', // black
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 18, // text-lg
    color: COLORS.slate600,
    fontWeight: '500', // medium
    textAlign: 'center',
    lineHeight: 26,
  },
  card: {
    width: '100%',
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  smallStars: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: 16, // base
    color: COLORS.slate800,
    fontWeight: '500',
    lineHeight: 24, // relaxed
    marginBottom: 16,
    zIndex: 1,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.slate300,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 6,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
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
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
});

export default QuizSocialProofScreen;