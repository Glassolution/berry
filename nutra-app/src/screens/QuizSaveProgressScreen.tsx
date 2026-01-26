import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../services/socialAuth';

const QuizSaveProgressScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (user) {
      // User successfully logged in (e.g. via Deep Link callback)
      setIsGoogleLoading(false);
      router.replace('/WelcomeMemberScreen');
    }
  }, [user]);

  const handleBack = () => {
    router.back();
  };

  const handleAppleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Implement login logic or navigate
    console.log("Apple Login");
  };

  const handleGoogleLogin = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsGoogleLoading(true);
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Erro no Login', (error as Error).message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.bgPattern} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.navBar}>
            <Pressable onPress={handleBack} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </Pressable>
          </View>
          
          <Text style={styles.title}>Salvar seu progresso</Text>
          <Text style={styles.subtitle}>
            Crie sua conta para que a IA salve seus planos e histórico de evolução.
          </Text>
        </View>

        {/* Main Content - Illustration */}
        <View style={styles.mainContent}>
          <Animated.View style={[styles.illustrationContainer, { transform: [{ translateY: floatAnim }] }]}>
            {/* Background Icons (Low Opacity) */}
            <View style={styles.bgIconsContainer}>
              <MaterialIcons name="fitness-center" size={60} color="#000" style={[styles.bgIcon, { opacity: 0.1, transform: [{ rotate: '12deg' }], top: -20, left: -20 }]} />
              <MaterialIcons name="favorite" size={50} color="#000" style={[styles.bgIcon, { opacity: 0.1, transform: [{ rotate: '-12deg' }], bottom: -10, right: -25 }]} />
              <MaterialIcons name="bolt" size={40} color="#000" style={[styles.bgIcon, { opacity: 0.1, top: '50%', right: -30 }]} />
            </View>
            
            {/* Main Cloud Icon */}
            <View style={styles.cloudContainer}>
              <MaterialIcons name="cloud" size={160} color="#E5E7EB" />
              <View style={styles.cloudOverlay}>
                <MaterialIcons name="auto-awesome" size={40} color="#000" />
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Footer - Buttons */}
        <View style={styles.footer}>
          <Pressable 
            style={({ pressed }) => [styles.appleButton, pressed && styles.buttonPressed]}
            onPress={handleAppleLogin}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="white">
              <Path d="M17.05 20.28c-.96.95-2.12 2.05-3.48 2.05-1.34 0-1.84-.82-3.41-.82s-2.11.81-3.41.81c-1.31 0-2.58-1.2-3.59-2.22-2.07-2.07-3.16-5.83-3.16-8.24 0-3.87 2.45-5.91 4.75-5.91 1.2 0 2.21.75 3.03.75.75 0 1.94-.82 3.28-.82 1.47 0 2.64.67 3.4 1.74-3.04 1.77-2.54 6.03.49 7.42-.71 1.78-1.63 3.51-2.9 5.24zm-2.9-15.63c-.01-1.92 1.6-3.56 3.48-3.65.17 2.1-1.95 3.84-3.48 3.65z" />
            </Svg>
            <Text style={styles.appleButtonText}>Continuar com Apple</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.googleButton, (pressed || isGoogleLoading) && styles.buttonPressed]}
            onPress={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </Svg>
                <Text style={styles.googleButtonText}>Continuar com Google</Text>
              </>
            )}
          </Pressable>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Login</Text>
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
    backgroundColor: '#fff',
  },
  bgPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
    // Note: React Native doesn't support radial-gradient easily without Expo LinearGradient or SVG. 
    // We can leave it plain or add a subtle texture if needed later.
    backgroundColor: '#fff', 
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    lineHeight: 28,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bgIconsContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgIcon: {
    position: 'absolute',
  },
  cloudContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudOverlay: {
    position: 'absolute',
    paddingTop: 8, // Adjust to center the star in the cloud visually
  },
  footer: {
    paddingBottom: 48,
    gap: 16,
  },
  appleButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#000',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  appleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: '#64748B',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    textDecorationLine: 'underline',
  },
});

export default QuizSaveProgressScreen;
