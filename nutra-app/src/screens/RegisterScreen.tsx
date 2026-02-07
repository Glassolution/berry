import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { supabase } from '../lib/supabase';
import { useQuiz } from '../context/QuizContext';
import { signInWithGoogle } from '../services/socialAuth';
import Svg, { Path, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const BACKGROUND_ICONS = [
  'fitness-center', 'restaurant', 'directions-run', 'monitor-heart',
  'local-drink', 'timer', 'self-improvement', 'spa',
  'pool', 'pedal-bike', 'hiking', 'sports-tennis',
  'sports-soccer', 'sports-basketball', 'sports-volleyball', 'sports-rugby'
];

export default function RegisterScreen() {
  const router = useRouter();
  const { quizData } = useQuiz();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('https://shfhvlogmkfnqxcuumfl.supabase.co/rest/v1/', {
        method: 'HEAD',
        headers: {
          'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZmh2bG9nbWtmbnF4Y3V1bWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjM4NDksImV4cCI6MjA4MDk5OTg0OX0.ialrVY_ntBQ6vKkB5RxyyKXbAQSRMTM3fCKS2MYgM5o'
        }
      });
      if (response.ok || response.status === 401 || response.status === 200) {
        setNetworkStatus('ok');
      } else {
        console.warn('Network check failed with status:', response.status);
        setNetworkStatus('error');
      }
    } catch (e) {
      console.error('Network check error:', e);
      setNetworkStatus('error');
    }
  };

  const getInputStyle = (fieldName: string, value: string) => {
    if (focusedInput === fieldName) {
      return [styles.input, { borderColor: '#000000', backgroundColor: '#FFFFFF' }];
    } else if (value.length > 0) {
      return [styles.input, { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }];
    }
    return styles.input;
  };

  const handleGoogleLogin = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Erro no Cadastro', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setErrorMessage('');
    
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      // 3. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 4. Save Quiz Data to Profile
        const updates = {
          id: authData.user.id,
          email: email,
          quiz_data: quizData,
          gender: quizData.gender,
          age: quizData.age,
          activity_level: quizData.activityLevel,
          height: quizData.height,
          weight: quizData.weight,
          goal_weight: quizData.goalWeight,
          updated_at: new Date(),
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(updates);

        if (profileError) {
          console.warn('Error saving profile (ignoring to allow flow):', profileError);
        }

        if (authData.session) {
          router.replace('/diet-onboarding');
        } else {
          // Force sign out so user has to log in manually
          await supabase.auth.signOut();
          setErrorMessage('Conta criada! Verifique seu email para confirmar o cadastro antes de entrar.');
          router.replace('/login');
          // Add a slight delay to ensure the alert/message is seen if we were staying on this screen, 
          // but since we redirect to login, the user needs to see the message THERE or get an alert here.
          // Let's use Alert here as fallback since we are redirecting.
          Alert.alert('Sucesso', 'Conta criada! Verifique seu email para confirmar o cadastro.');
        }
      }

    } catch (error) {
      console.error('Registration error:', error);
      let msg = (error as Error).message;
      if (msg === 'Network request failed') {
        msg = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (msg.includes('Sem conexão')) {
        // keep original message
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.patternContainer}>
        <View style={styles.patternGrid}>
          {BACKGROUND_ICONS.map((icon, index) => (
            <MaterialIcons
              key={index}
              name={icon as any}
              size={40}
              color="#000"
              style={{ opacity: 0.03 }}
            />
          ))}
          {/* Repeat icons to fill screen if needed */}
          {BACKGROUND_ICONS.map((icon, index) => (
            <MaterialIcons
              key={`r-${index}`}
              name={icon as any}
              size={40}
              color="#000"
              style={{ opacity: 0.03 }}
            />
          ))}
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="arrow-back" size={24} color="#E11D48" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header / Logo */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Svg
                  width={40}
                  height={40}
                  viewBox="0 0 24 24"
                  style={{ transform: [{ rotate: '-12deg' }] }}
                >
                  <Path
                    d="M12 22C12 22 19 18 19 11.5C19 8.5 17 6 14.5 6C13.5 6 12.5 6.5 12 7C11.5 6.5 10.5 6 9.5 6C7 6 5 8.5 5 11.5C5 18 12 22 12 22Z"
                    fill="#E11D48"
                  />
                  <Path
                    d="M12 6C12 6 12.5 2 14 2"
                    stroke="#E11D48"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <Path
                    d="M12 6C12 6 10 3.5 8 4"
                    stroke="#E11D48"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <Circle cx="9" cy="11" r="0.5" fill="white" />
                  <Circle cx="12" cy="13" r="0.5" fill="white" />
                  <Circle cx="15" cy="10" r="0.5" fill="white" />
                  <Circle cx="10" cy="16" r="0.5" fill="white" />
                  <Circle cx="14" cy="17" r="0.5" fill="white" />
                </Svg>
                <Text style={styles.appName}>Berry</Text>
                <View style={{ width: 40 }} />
              </View>
              <Text style={styles.appTagline}>Nutrição que se adapta a você</Text>
            </View>

            {/* Network Status Indicator */}
            {networkStatus === 'error' && (
              <View style={styles.networkError}>
                 <MaterialIcons name="wifi-off" size={14} color="#B91C1C" />
                 <Text style={styles.networkErrorText}>Erro de conexão com o servidor</Text>
              </View>
            )}

            {/* Login Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Crie sua conta</Text>
                <Text style={styles.cardSubtitle}>Comece sua jornada hoje</Text>
              </View>

              <View style={styles.inputsContainer}>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>EMAIL</Text>
                  <TextInput
                    style={getInputStyle('email', email)}
                    placeholder="seu@email.com"
                    placeholderTextColor="#D1D5DB"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>SENHA</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={getInputStyle('password', password)}
                      placeholder="••••••••"
                      placeholderTextColor="#D1D5DB"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <MaterialIcons
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                 {/* Confirm Password Input */}
                 <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CONFIRMAR SENHA</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={getInputStyle('confirmPassword', confirmPassword)}
                      placeholder="••••••••"
                      placeholderTextColor="#D1D5DB"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      onFocus={() => setFocusedInput('confirmPassword')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <MaterialIcons
                        name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                activeOpacity={0.9}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Criar conta</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

              {/* Error Message */}
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={16} color="#E11D48" />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* Login Link */}
               <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Já tem uma conta?</Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.loginLink}>Entrar</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OU CONTINUE COM</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGoogleLogin}
                >
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                     <Path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <Path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <Path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <Path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                  </Svg>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome name="apple" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0, // Add top padding for Android
  },
  headerBar: {
    paddingHorizontal: 24,
    paddingTop: 16, // Increase top padding
    paddingBottom: 8,
    zIndex: 10, // Ensure it's above other elements
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
    zIndex: 0,
    overflow: 'hidden',
  },
  patternGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
    gap: 40,
  },
  keyboardView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    gap: 32,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 48,
    color: '#000000',
  },
  appTagline: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    letterSpacing: 1,
    color: '#000000',
    opacity: 0.6,
    textAlign: 'center',
  },
  networkError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  networkErrorText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    color: '#B91C1C',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 32,
    gap: 32,
    // Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.06,
    shadowRadius: 60,
    elevation: 10, // Android
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    color: '#000000',
  },
  cardSubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  inputsContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    letterSpacing: 1,
    color: '#000000',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Manrope_400Regular',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passwordInputContainer: {
    position: 'relative',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  loginButton: {
    height: 64,
    backgroundColor: '#E11D48',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#E11D48',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  dividerText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  registerText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: '#E11D48',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  errorText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: '#E11D48',
    textAlign: 'center',
  },
});
