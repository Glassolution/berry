import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { signInWithGoogle } from '../services/socialAuth';
import Svg, { Path, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const BACKGROUND_ICONS = [
  'fitness-center', 'restaurant', 'directions-run', 'monitor-heart',
  'local-drink', 'timer', 'self-improvement', 'spa',
  'pool', 'pedal-bike', 'hiking', 'sports-tennis',
  'sports-soccer', 'sports-basketball', 'sports-volleyball', 'sports-rugby'
];

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setLoading(true);
      await signInWithGoogle();
      // Navigation is handled by auth state listener usually, or we can manually redirect
      // router.replace('/(tabs)'); // Or wherever
    } catch (error) {
      Alert.alert('Erro no Login', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Implement email login logic here
    console.log('Login with:', email, password);
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
                    fill="black"
                  />
                  <Path
                    d="M12 6C12 6 12.5 2 14 2"
                    stroke="black"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <Path
                    d="M12 6C12 6 10 3.5 8 4"
                    stroke="black"
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
              </View>
              <Text style={styles.appTagline}>AI FITNESS & NUTRITION</Text>
            </View>

            {/* Login Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Bem-vindo de volta</Text>
                <Text style={styles.cardSubtitle}>Sua jornada continua aqui</Text>
              </View>

              <View style={styles.inputsContainer}>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#D1D5DB"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.passwordHeader}>
                    <Text style={styles.inputLabel}>SENHA</Text>
                    <TouchableOpacity>
                      <Text style={styles.forgotPassword}>ESQUECEU?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#D1D5DB"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
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
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleEmailLogin}
                activeOpacity={0.9}
              >
                <Text style={styles.loginButtonText}>Entrar</Text>
                <MaterialIcons name="auto-awesome" size={20} color="white" />
              </TouchableOpacity>

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
                   <Svg width={24} height={24} viewBox="0 0 24 24" fill="black">
                     <Path d="M17.05 20.28c-.96.95-2.12 2.05-3.48 2.05-1.34 0-1.84-.82-3.41-.82s-2.11.81-3.41.81c-1.31 0-2.58-1.2-3.59-2.22-2.07-2.07-3.16-5.83-3.16-8.24 0-3.87 2.45-5.91 4.75-5.91 1.2 0 2.21.75 3.03.75.75 0 1.94-.82 3.28-.82 1.47 0 2.64.67 3.4 1.74-3.04 1.77-2.54 6.03.49 7.42-.71 1.78-1.63 3.51-2.9 5.24zm-2.9-15.63c-.01-1.92 1.6-3.56 3.48-3.65.17 2.1-1.95 3.84-3.48 3.65z" />
                   </Svg>
                 </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 48,
    color: '#000000',
  },
  appTagline: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    letterSpacing: 3,
    color: '#000000',
    opacity: 0.6,
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
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'Manrope_400Regular',
    color: '#000000',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  forgotPassword: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    bottom: 12,
  },
  loginButton: {
    height: 64,
    backgroundColor: '#000000',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
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
});
