import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';

const WelcomeMemberScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Get user's first name or default to 'Membro'
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Membro';
  
  // Current Year for "Member since"
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-redirect after 4 seconds
    const timer = setTimeout(() => {
      handleContinue();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  return (
    <Pressable style={[styles.container, isDark && styles.containerDark]} onPress={handleContinue}>
      <SafeAreaView style={styles.safeArea}>
        {/* Status Bar Placeholder (Visual only, system handles actual bar) */}
        <View style={styles.statusBarPlaceholder} />

        <Animated.View 
          style={[
            styles.content, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.headerTextContainer}>
            <Text style={[styles.greeting, isDark && styles.textLight]}>
              Olá, {userName},
            </Text>
            <Text style={[styles.welcomeTitle, isDark && styles.textWhite]}>
              Bem-vindo ao Berry.
            </Text>
          </View>

          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
            Obrigado por se tornar um membro!
          </Text>

          <View style={styles.accentLine} />
        </Animated.View>

        <View style={styles.footer}>
          <Text style={[styles.memberSince, isDark && styles.memberSinceDark]}>
            MEMBRO DESDE {currentYear}
          </Text>
        </View>

        {/* Bottom indicator imitation (optional visual flair from design) */}
        {Platform.OS !== 'ios' && (
           <View style={[styles.bottomIndicator, isDark && styles.bottomIndicatorDark]} />
        )}
      </SafeAreaView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // background-light
  },
  containerDark: {
    backgroundColor: '#121212', // background-dark
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statusBarPlaceholder: {
    height: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  headerTextContainer: {
    marginBottom: 4,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '300', // font-light
    color: '#0F172A', // slate-900
    letterSpacing: -0.5,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: '700', // font-bold
    color: '#0F172A', // slate-900
    letterSpacing: -0.5,
  },
  textLight: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500', // font-medium
    color: '#64748B', // slate-500
  },
  subtitleDark: {
    color: 'rgba(156, 163, 175, 0.8)', // gray-400/80
  },
  accentLine: {
    marginTop: 48,
    height: 4,
    width: 48,
    borderRadius: 999,
    backgroundColor: '#C2185B', // primary
    opacity: 0.4,
  },
  footer: {
    paddingBottom: 48,
    alignItems: 'center',
    width: '100%',
  },
  memberSince: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2, // 0.2em approx
    color: '#94A3B8', // slate-400
  },
  memberSinceDark: {
    color: '#4B5563', // gray-600
  },
  bottomIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -64, // w-32 / 2
    height: 4,
    width: 128, // w-32
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.2)', // slate-900/20
  },
  bottomIndicatorDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // white/20
  },
});

export default WelcomeMemberScreen;
