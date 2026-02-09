import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';
import { useQuiz } from '../context/QuizContext';

type Props = NativeStackScreenProps<RootStackParamList, 'WelcomeScreen'>;

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const router = useRouter();
  const { resetQuiz } = useQuiz();

  const handleStart = () => {
    resetQuiz();
    router.push('/QuizGenderScreen');
  };

  return (
    <View style={styles.container}>
      {/* Background Icons */}
      <View style={styles.backgroundIconsContainer} pointerEvents="none">
        <MaterialIcons name="fitness-center" size={60} color="#000" style={StyleSheet.flatten([styles.bgIcon, { top: '25%', left: 40, transform: [{ rotate: '12deg' }] }])} />
        <MaterialIcons name="directions-run" size={72} color="#000" style={StyleSheet.flatten([styles.bgIcon, { top: '33%', right: 40, transform: [{ rotate: '-12deg' }] }])} />
        <MaterialIcons name="favorite-border" size={96} color="#000" style={StyleSheet.flatten([styles.bgIcon, { top: '50%', left: '25%', transform: [{ rotate: '45deg' }] }])} />
        <MaterialIcons name="restaurant" size={48} color="#000" style={StyleSheet.flatten([styles.bgIcon, { bottom: '33%', right: '25%', transform: [{ rotate: '-12deg' }] }])} />
        <MaterialIcons name="monitor-weight" size={60} color="#000" style={StyleSheet.flatten([styles.bgIcon, { bottom: '25%', left: '50%', transform: [{ rotate: '12deg' }] }])} />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.contentContainer}>
          
          {/* Hero Image Section - Top of screen */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/berry.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <MaskedView
            style={styles.blurOverlay}
            maskElement={
              <LinearGradient
                colors={['black', 'black', 'transparent']}
                locations={[0, 0.2, 1]}
                style={StyleSheet.absoluteFill}
              />
            }
          >
            <BlurView
              intensity={40}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          </MaskedView>
        </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <View style={styles.titleContainer}>
              <Text selectable style={styles.title}>
                Sua nutrição inteligente{' '}
                <View style={styles.inlineBadge}>
                  <Text selectable style={styles.highlightText}>com IA</Text>
                <MaterialIcons name="auto-awesome" size={28} color="#E11D48" />
              </View>
              </Text>
              <Text selectable style={styles.subtitle}>
                Treinos e dietas personalizados para o seu corpo e objetivos.
              </Text>
            </View>

            {/* Action Button */}
            <View style={styles.actionContainer}>
              <Pressable style={styles.primaryButton} onPress={handleStart}>
                <MaterialIcons name="auto-awesome" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.primaryButtonText}>Seu assistente</Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.footerLink}>Login</Text>
              </Pressable>
            </View>
          </View>

        </View>
        
        {/* Bottom Bar Indicator (Visual only) */}
        <View style={styles.bottomIndicatorContainer}>
          <View style={styles.bottomIndicator} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundIconsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
    opacity: 0.04,
  },
  imageContainer: {
    height: height * 0.58,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    marginTop: 0,
    position: 'relative',
  },
  heroImage: {
    width: '160%',
    height: '110%',
    marginTop: 0,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  textContainer: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 40,
    marginBottom: 12,
  },
  inlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    gap: 8,
  },
  highlightText: {
    fontSize: 36,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#E11D48',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    lineHeight: 28,
  },
  actionContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E11D48',
    borderRadius: 999,
    paddingVertical: 20,
    shadowColor: '#E11D48',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textDecorationLine: 'underline',
  },
  bottomIndicatorContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  bottomIndicator: {
    width: 128,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
  },
});

export default WelcomeScreen;
