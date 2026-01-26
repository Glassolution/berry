import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Animated, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuiz } from '../context/QuizContext';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizMeasurementsScreen'>;

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Colors based on HTML
const COLORS = {
  primary: '#000000',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#0F172A',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate800: '#1E293B',
  slate900: '#0F172A',
  white: '#FFFFFF',
};

// Data Generators
const generateRange = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// Metric Data
const HEIGHT_CM = generateRange(120, 230); // 120cm to 230cm
const WEIGHT_KG = generateRange(30, 200);  // 30kg to 200kg

// Imperial Data
const HEIGHT_IN = generateRange(48, 90);   // 4ft to 7.5ft (inches)
const WEIGHT_LBS = generateRange(66, 440); // ~30kg to ~200kg

type UnitSystem = 'metric' | 'imperial';

const QuizMeasurementsScreen = () => {
  const router = useRouter();
  const { updateQuizData } = useQuiz();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  
  // Selection States (Indices or Values)
  // We track the *value* to easily switch between units
  const [heightVal, setHeightVal] = useState(175); // cm or in
  const [weightVal, setWeightVal] = useState(70);  // kg or lbs

  // Scroll Refs
  const scrollYHeight = useRef(new Animated.Value(0)).current;
  const scrollYWeight = useRef(new Animated.Value(0)).current;
  
  const heightListRef = useRef<FlatList>(null);
  const weightListRef = useRef<FlatList>(null);

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
    console.log('Next pressed, measurements:', { heightVal, weightVal, unitSystem });
    
    // Save to context
    // Normalize to metric for storage if needed, or store as is
    let finalHeight = heightVal;
    let finalWeight = weightVal;
    
    if (unitSystem === 'imperial') {
        // Store as metric
        finalHeight = Math.round(heightVal * 2.54);
        finalWeight = Math.round(weightVal / 2.20462);
    }
    
    updateQuizData({ 
        height: finalHeight, 
        weight: finalWeight,
        unitSystem 
    });
    
    // Navigate to next screen - Activity
    router.push('/QuizActivityScreen');
  };

  const toggleUnit = (system: UnitSystem) => {
    if (system === unitSystem) return;
    Haptics.selectionAsync();

    let newHeight = heightVal;
    let newWeight = weightVal;

    if (system === 'imperial') {
      // Metric -> Imperial
      // cm -> in (approx)
      newHeight = Math.round(heightVal / 2.54);
      // kg -> lbs
      newWeight = Math.round(weightVal * 2.20462);
      
      // Clamp
      newHeight = Math.max(HEIGHT_IN[0], Math.min(HEIGHT_IN[HEIGHT_IN.length - 1], newHeight));
      newWeight = Math.max(WEIGHT_LBS[0], Math.min(WEIGHT_LBS[WEIGHT_LBS.length - 1], newWeight));
    } else {
      // Imperial -> Metric
      // in -> cm
      newHeight = Math.round(heightVal * 2.54);
      // lbs -> kg
      newWeight = Math.round(weightVal / 2.20462);

      // Clamp
      newHeight = Math.max(HEIGHT_CM[0], Math.min(HEIGHT_CM[HEIGHT_CM.length - 1], newHeight));
      newWeight = Math.max(WEIGHT_KG[0], Math.min(WEIGHT_KG[WEIGHT_KG.length - 1], newWeight));
    }

    setUnitSystem(system);
    setHeightVal(newHeight);
    setWeightVal(newWeight);

    // We need to scroll to the new values after render
    // Using a small timeout to allow state update and re-render of list with new data
    setTimeout(() => {
        scrollToValue(heightListRef, newHeight, system === 'metric' ? HEIGHT_CM : HEIGHT_IN, scrollYHeight);
        scrollToValue(weightListRef, newWeight, system === 'metric' ? WEIGHT_KG : WEIGHT_LBS, scrollYWeight);
    }, 100);
  };

  const scrollToValue = (ref: any, value: number, data: number[], animValue: Animated.Value) => {
    const index = data.indexOf(value);
    if (index !== -1 && ref && ref.current) {
      ref.current.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated: true,
      });
      // We don't manually set animated value here, let the onScroll event handle it
      // But for initial load we might need to
    }
  };

  // Initial Scroll
  useEffect(() => {
    setTimeout(() => {
        scrollToValue(heightListRef, heightVal, HEIGHT_CM, scrollYHeight);
        scrollToValue(weightListRef, weightVal, WEIGHT_KG, scrollYWeight);
    }, 200);
  }, []);

  const renderPickerItem = ({ item, index }: { item: number, index: number }, type: 'height' | 'weight') => {
    const scrollY = type === 'height' ? scrollYHeight : scrollYWeight;
    const unit = type === 'height' 
      ? (unitSystem === 'metric' ? 'cm' : 'in') 
      : (unitSystem === 'metric' ? 'kg' : 'lbs');

    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.8, 0.8, 1.2, 0.8, 0.8],
      extrapolate: 'clamp',
    });

    const opacityActive = scrollY.interpolate({
      inputRange,
      outputRange: [0, 0, 1, 0, 0],
      extrapolate: 'clamp',
    });
    
    const opacityInactive = scrollY.interpolate({
        inputRange,
        outputRange: [0.3, 0.5, 0, 0.5, 0.3],
        extrapolate: 'clamp',
    });

    return (
      <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {/* Inactive Layer (Grey) */}
        <Animated.Text 
          style={[
            styles.pickerItemText,
            {
              position: 'absolute',
              transform: [{ scale }],
              opacity: opacityInactive,
              color: COLORS.slate400,
              // Force centering
              top: (ITEM_HEIGHT - 36) / 2, // (Container - LineHeight) / 2
            }
          ]}
          numberOfLines={1}
        >
          {item} <Text style={{ fontSize: 16, fontWeight: '500', lineHeight: 24 }}>{unit}</Text>
        </Animated.Text>

        {/* Active Layer (Black) */}
        <Animated.Text 
          style={[
            styles.pickerItemText,
            {
              position: 'absolute',
              transform: [{ scale }],
              opacity: opacityActive,
              color: COLORS.primary,
              // Force centering
              top: (ITEM_HEIGHT - 36) / 2,
            }
          ]}
          numberOfLines={1}
        >
          {item} <Text style={{ fontSize: 16, fontWeight: '500', lineHeight: 24 }}>{unit}</Text>
        </Animated.Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Icons */}
      <View style={styles.backgroundIconsContainer} pointerEvents="none">
        <MaterialIcons name="fitness-center" size={96} color={COLORS.primary} style={StyleSheet.flatten([styles.bgIcon, { top: 80, left: 40, transform: [{ rotate: '12deg' }] }])} />
        <MaterialIcons name="monitor-weight" size={120} color={COLORS.primary} style={StyleSheet.flatten([styles.bgIcon, { top: '40%', right: -20, transform: [{ rotate: '-15deg' }] }])} />
        <MaterialIcons name="directions-run" size={96} color={COLORS.primary} style={StyleSheet.flatten([styles.bgIcon, { bottom: 160, left: -10, transform: [{ rotate: '10deg' }] }])} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.slate900} style={{ marginLeft: 8 }} />
            </Pressable>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFill} />
            </View>
            
            <View style={{ width: 40 }} /> 
        </View>

        <View style={styles.content}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Métricas corporais</Text>
                <Text style={styles.subtitle}>
                    Peso e altura permitem calcular seu ponto de partida e traçar a evolução ideal.
                </Text>
            </View>

            {/* Unit Toggle */}
            <View style={styles.toggleContainer}>
                <View style={styles.toggleWrapper}>
                    <Pressable 
                        style={[styles.toggleButton, unitSystem === 'imperial' && styles.toggleButtonActive]}
                        onPress={() => toggleUnit('imperial')}
                    >
                        <Text style={[styles.toggleText, unitSystem === 'imperial' && styles.toggleTextActive]}>
                            Imperial
                        </Text>
                    </Pressable>
                    <Pressable 
                        style={[styles.toggleButton, unitSystem === 'metric' && styles.toggleButtonActive]}
                        onPress={() => toggleUnit('metric')}
                    >
                        <Text style={[styles.toggleText, unitSystem === 'metric' && styles.toggleTextActive]}>
                            Métrico
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Pickers */}
            <View style={styles.pickersContainer}>
                {/* Headers */}
                <View style={styles.pickersHeader}>
                    <Text style={styles.pickerLabel}>ALTURA</Text>
                    <Text style={styles.pickerLabel}>PESO</Text>
                </View>

                {/* Wheels Wrapper */}
                <View style={styles.wheelsWrapper}>
                    {/* Background Highlight */}
                    <View style={styles.activeHighlight} />

                    {/* Height Picker */}
                    <View style={styles.wheelContainer}>
                        <AnimatedFlatList
                            ref={heightListRef}
                            data={unitSystem === 'metric' ? HEIGHT_CM : HEIGHT_IN}
                            keyExtractor={(item) => `h-${item}`}
                            renderItem={(props) => renderPickerItem(props as any, 'height')}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={ITEM_HEIGHT}
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingVertical: 0 }} // Removed padding, using Header/Footer
                            ListHeaderComponent={<View style={{ height: ITEM_HEIGHT * 2 }} />}
                            ListFooterComponent={<View style={{ height: ITEM_HEIGHT * 2 }} />}
                            snapToAlignment="start"
                            getItemLayout={(data, index) => ({
                                length: ITEM_HEIGHT,
                                offset: ITEM_HEIGHT * index,
                                index,
                            })}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollYHeight } } }],
                                { useNativeDriver: true }
                            )}
                            onMomentumScrollEnd={(ev) => {
                                const index = Math.round(ev.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                                const data = unitSystem === 'metric' ? HEIGHT_CM : HEIGHT_IN;
                                if (data[index]) setHeightVal(data[index]);
                            }}
                        />
                    </View>

                    {/* Weight Picker */}
                    <View style={styles.wheelContainer}>
                        <AnimatedFlatList
                            ref={weightListRef}
                            data={unitSystem === 'metric' ? WEIGHT_KG : WEIGHT_LBS}
                            keyExtractor={(item) => `w-${item}`}
                            renderItem={(props) => renderPickerItem(props as any, 'weight')}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={ITEM_HEIGHT}
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingVertical: 0 }} // Removed padding, using Header/Footer
                            ListHeaderComponent={<View style={{ height: ITEM_HEIGHT * 2 }} />}
                            ListFooterComponent={<View style={{ height: ITEM_HEIGHT * 2 }} />}
                            snapToAlignment="start"
                            getItemLayout={(data, index) => ({
                                length: ITEM_HEIGHT,
                                offset: ITEM_HEIGHT * index,
                                index,
                            })}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollYWeight } } }],
                                { useNativeDriver: true }
                            )}
                            onMomentumScrollEnd={(ev) => {
                                const index = Math.round(ev.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                                const data = unitSystem === 'metric' ? WEIGHT_KG : WEIGHT_LBS;
                                if (data[index]) setWeightVal(data[index]);
                            }}
                        />
                    </View>

                    {/* Gradients */}
                    <LinearGradient
                        colors={[COLORS.backgroundLight, 'rgba(255,255,255,0)']}
                        style={styles.gradientTop}
                        pointerEvents="none"
                    />
                    <LinearGradient
                        colors={['rgba(255,255,255,0)', COLORS.backgroundLight]}
                        style={styles.gradientBottom}
                        pointerEvents="none"
                    />
                </View>
            </View>

            {/* Footer Button */}
            <View style={styles.footer}>
                <Pressable style={styles.continueButton} onPress={handleNext}>
                    <Text style={styles.continueButtonText}>Próximo</Text>
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
    opacity: 0.03,
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.slate100,
    borderRadius: 999,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '75%', // 3/4 as per HTML
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.slate500,
    lineHeight: 24,
  },
  toggleContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate100,
    borderRadius: 999,
    padding: 4,
    width: 256, // w-64
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate500,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  pickersContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pickersHeader: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 320,
    justifyContent: 'space-around',
    marginBottom: -24, // overlap with wheel container padding
    zIndex: 10,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate400,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  wheelsWrapper: {
    flexDirection: 'row',
    height: PICKER_HEIGHT, // Was 256, needs to be 300 for perfect alignment
    width: '100%',
    maxWidth: 320,
    position: 'relative',
    marginTop: 24,
  },
  wheelContainer: {
    flex: 1,
    height: '100%',
  },
  activeHighlight: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    marginTop: -ITEM_HEIGHT / 2,
    backgroundColor: COLORS.slate50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    zIndex: -1,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 20,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 20,
  },
  pickerItemText: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 36, // Slightly larger than font size
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false, // Android specific cleanup
  },
  footer: {
    paddingVertical: 24,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});

export default QuizMeasurementsScreen;
