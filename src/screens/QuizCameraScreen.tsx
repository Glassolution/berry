import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const QuizCameraScreen = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleCapture = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Simulate capture and move to Dashboard
    setTimeout(() => {
        router.push('/(tabs)');
    }, 300);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Header Layer */}
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <View style={styles.headerContent}>
            <Pressable onPress={handleBack} style={styles.backButton}>
                <MaterialIcons name="chevron-left" size={32} color="white" />
            </Pressable>
            
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                    <View style={styles.progressBarFill} />
                </View>
            </View>
            
            <View style={{ width: 40 }} /> 
        </View>
      </SafeAreaView>

      {/* Main Content - Image & Frame */}
      <View style={styles.imageContainer}>
        <Image 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmWlQ0VbMsp8K20vBRhiVr0b0IzxQUqctomyI-wf_Rl3PopLPsZb4oA396ODa9K_5Z6lfcAvgz4_dzjKpxVlfEldVJ3xv_xhN3Jl9JVdtLrR8AambvFP_i1h1GCniq9ZA4hQJd24jzVjFIPtIrVRVv_augErCYpjDpLCnupixNeoXFaUWw7qfnI_TDkXghOcTjinaEU8siCwJeJANXrSXjoeUW5rSNSJyWx3Tzg2fbEgKCEHgaP1eH_Xi7iFy3-jb29_jEpX_-2Vwt" }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
        />
        
        {/* Scanning Frame */}
        <View style={styles.frameContainer}>
            <View style={styles.scanFrame}>
                <View style={styles.scanFrameInner} />
            </View>
        </View>

        {/* Gradient Overlay for smooth transition to bottom sheet */}
        <LinearGradient
            colors={['transparent', 'rgba(0,0,0,1)']}
            style={styles.gradientOverlay}
        />
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomContent}>
            <Text style={styles.subtitle}>A CÂMERA RECONHECE SUA COMIDA</Text>
            <Text style={styles.title}>
                Tire uma foto —{'\n'}é mágico!
            </Text>

            <View style={styles.shutterContainer}>
                <View style={styles.shutterRing}>
                    <Pressable 
                        style={({ pressed }) => [
                            styles.shutterButton,
                            pressed && styles.shutterButtonPressed
                        ]}
                        onPress={handleCapture}
                    >
                        <View style={styles.shutterInner} />
                    </Pressable>
                </View>
            </View>
        </View>
        
        {/* Home Indicator */}
        <View style={styles.homeIndicatorContainer}>
            <View style={styles.homeIndicator} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
  },
  progressBarContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '66%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 999,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#333',
    position: 'relative',
  },
  frameContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100, // Offset to account for bottom sheet overlap
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 100, // Approximation of large shadow spread
    elevation: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrameInner: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 42,
    opacity: 0.2,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 10,
  },
  bottomSheet: {
    backgroundColor: '#000',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingBottom: 40,
    marginTop: -40,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  bottomContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  subtitle: {
    color: '#9CA3AF', // gray-400
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 38,
  },
  shutterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  shutterButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff', // Or slightly off-white if needed
  },
  homeIndicatorContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
});

export default QuizCameraScreen;
