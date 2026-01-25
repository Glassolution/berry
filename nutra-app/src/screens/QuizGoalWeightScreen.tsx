import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, FlatList, Animated, NativeSyntheticEvent, NativeScrollEvent, TextInput, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useQuiz } from '../context/QuizContext';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizGoalWeightScreen'>;

const { width } = Dimensions.get('window');

// Colors
const COLORS = {
  primary: '#000000',
  backgroundLight: '#FFFFFF',
  accentGray: '#F4F4F4',
  infoBg: '#F9F9F9',
  textGray: '#6B7280',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  white: '#FFFFFF',
};

// Config
const MIN_WEIGHT_KG = 30;
const MAX_WEIGHT_KG = 300;
const ITEM_WIDTH = 16; 
const WEIGHTS_KG = Array.from({ length: MAX_WEIGHT_KG - MIN_WEIGHT_KG + 1 }, (_, i) => MIN_WEIGHT_KG + i);

const MIN_WEIGHT_LBS = Math.round(MIN_WEIGHT_KG * 2.20462);
const MAX_WEIGHT_LBS = Math.round(MAX_WEIGHT_KG * 2.20462);
const WEIGHTS_LBS = Array.from({ length: MAX_WEIGHT_LBS - MIN_WEIGHT_LBS + 1 }, (_, i) => MIN_WEIGHT_LBS + i);

const RulerItem = React.memo(({ item, index, scrollX }: { item: number, index: number, scrollX: Animated.Value }) => {
  const isMajor = item % 5 === 0;
  
  // Opacity for the active state (black overlay)
  const activeOpacity = scrollX.interpolate({
    inputRange: [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  // Scale Y for height animation
  const scaleY = scrollX.interpolate({
    inputRange: [
      (index - 2) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 2) * ITEM_WIDTH,
    ],
    outputRange: [1, 1.8, 1], // Base 24/40 -> Max 56? Let's use scale.
    // If base is 30, 1.8x is 54. Close enough.
    extrapolate: 'clamp',
  });

  // Scale X for width animation
  const scaleX = scrollX.interpolate({
    inputRange: [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ],
    outputRange: [1, 1.5, 1], 
    extrapolate: 'clamp',
  });
  
  const textOpacity = scrollX.interpolate({
      inputRange: [
          (index - 5) * ITEM_WIDTH,
          index * ITEM_WIDTH,
          (index + 5) * ITEM_WIDTH,
      ],
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
  });

  return (
    <View style={{ width: ITEM_WIDTH, alignItems: 'center', justifyContent: 'flex-end', height: 80 }}>
      {isMajor && (
           <Animated.Text style={StyleSheet.flatten([styles.rulerText, { opacity: textOpacity }])}>
               {item}
           </Animated.Text>
      )}
      
      {/* Base Gray Line */}
      <Animated.View 
        style={{
          height: isMajor ? 40 : 24,
          width: 2,
          backgroundColor: isMajor ? COLORS.slate300 : COLORS.slate200,
          borderRadius: 999,
          position: 'absolute',
          bottom: 0,
          transform: [
             { scaleY },
             { scaleX }
          ]
        }} 
      />

      {/* Active Black Line Overlay */}
      <Animated.View 
        style={{
          height: isMajor ? 40 : 24,
          width: 2,
          backgroundColor: COLORS.primary,
          borderRadius: 999,
          position: 'absolute',
          bottom: 0,
          opacity: activeOpacity,
          transform: [
             { scaleY },
             { scaleX }
          ]
        }} 
      />
    </View>
  );
});

const QuizGoalWeightScreen = () => {
  const router = useRouter();
  const { quizData, updateQuizData } = useQuiz();
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  // We keep selectedWeight state for the final submission, but UI updates via ref
  const [selectedWeight, setSelectedWeight] = useState(70);
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const currentWeightRef = useRef(70);

  // Dynamic weights based on unit
  const weights = unit === 'kg' ? WEIGHTS_KG : WEIGHTS_LBS;
  const weightsRef = useRef(weights);
  weightsRef.current = weights;
  
  // Animation for progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Ref for the text input to update directly without re-renders
  const weightTextRef = useRef<TextInput>(null);

  // Initialize from context if available
  useEffect(() => {
    if (quizData.unitSystem === 'imperial') {
        setUnit('lbs');
        // Default goal logic could be refined
    }
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
    console.log('Next pressed, goal weight:', currentWeightRef.current, unit);
    
    // Save to context
    let finalGoalWeight = currentWeightRef.current;
    if (unit === 'lbs') {
      finalGoalWeight = Math.round(currentWeightRef.current / 2.20462);
    }
    updateQuizData({ goalWeight: finalGoalWeight });

    // Navigate to QuizAnalysisScreen instead of QuizGoalScreen to avoid loop
    router.push('/QuizAnalysisScreen'); 
  };

  // Initial scroll and animation
  useEffect(() => {
    // Scroll to default weight (70kg or equivalent)
    // If we ever start with lbs, this needs logic, but default is kg and 70.
    const initialWeight = 70;
    const initialIndex = WEIGHTS_KG.indexOf(initialWeight);

    if (initialIndex !== -1) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: initialIndex * ITEM_WIDTH,
          animated: false,
        });
      }, 100);
    }
    
    // Animate progress bar from start
    Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
    }).start();
  }, []);

  const lastHapticTime = useRef(0);
  
    const handleScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
      {
        useNativeDriver: true,
        listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / ITEM_WIDTH);
          const currentWeights = weightsRef.current;
          const newWeight = currentWeights[index];
          
          if (newWeight !== undefined && newWeight !== currentWeightRef.current) {
              currentWeightRef.current = newWeight;
              
              if (weightTextRef.current) {
                  weightTextRef.current.setNativeProps({ text: newWeight.toString() });
              }
              
              // Throttle haptics to prevent bridge overload
              const now = Date.now();
              if (now - lastHapticTime.current > 10) { 
                  Haptics.selectionAsync();
                  lastHapticTime.current = now;
              }
          }
        }
      }
    );

  // Toggle unit logic
  const toggleUnit = (newUnit: 'kg' | 'lbs') => {
      if (newUnit === unit) return;

      const currentVal = currentWeightRef.current;
      let convertedVal: number;
      let newWeightsArray: number[];

      if (newUnit === 'kg') {
          // lbs to kg
          convertedVal = Math.round(currentVal / 2.20462);
          newWeightsArray = WEIGHTS_KG;
      } else {
          // kg to lbs
          convertedVal = Math.round(currentVal * 2.20462);
          newWeightsArray = WEIGHTS_LBS;
      }

      // Clamp
      const min = newWeightsArray[0];
      const max = newWeightsArray[newWeightsArray.length - 1];
      if (convertedVal < min) convertedVal = min;
      if (convertedVal > max) convertedVal = max;

      setUnit(newUnit);
      
      // Update refs
      currentWeightRef.current = convertedVal;
      if (weightTextRef.current) {
          weightTextRef.current.setNativeProps({ text: convertedVal.toString() });
      }

      // Scroll to new position
      const newIndex = newWeightsArray.indexOf(convertedVal);
      if (newIndex !== -1 && flatListRef.current) {
          flatListRef.current.scrollToOffset({
              offset: newIndex * ITEM_WIDTH,
              animated: false,
          });
      }
      
      Haptics.selectionAsync();
  };


  // Sync state when scrolling stops for data consistency
  const handleMomentumScrollEnd = () => {
      if (currentWeightRef.current !== selectedWeight) {
          setSelectedWeight(currentWeightRef.current);
      }
  };

  const renderRulerItem = React.useCallback(({ item, index }: { item: number, index: number }) => {
    return <RulerItem item={item} index={index} scrollX={scrollX} />;
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['75%', '90%'], // Start from previous screen's progress
  });

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.bgPattern} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerBar}>
                    <Pressable style={styles.backButton} onPress={handleBack}>
                        <MaterialIcons name="arrow-back" size={20} color={COLORS.primary} />
                    </Pressable>
                    
                    {/* Continuous Progress Bar */}
                    <View style={styles.progressBarContainer}>
                        <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
                    </View>
                </View>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>Qual é o seu peso objetivo?</Text>
                    <Text style={styles.subtitle}>Essa informação ajuda a personalizar sua experiência.</Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Unit Toggle */}
                <View style={styles.toggleContainer}>
                    <Pressable 
                        style={StyleSheet.flatten([styles.toggleButton, unit === 'lbs' && styles.toggleButtonActive])}
                        onPress={() => toggleUnit('lbs')}
                    >
                        <Text style={StyleSheet.flatten([styles.toggleText, unit === 'lbs' && styles.toggleTextActive])}>lbs</Text>
                    </Pressable>
                    <Pressable 
                        style={StyleSheet.flatten([styles.toggleButton, unit === 'kg' && styles.toggleButtonActive])}
                        onPress={() => toggleUnit('kg')}
                    >
                        <Text style={StyleSheet.flatten([styles.toggleText, unit === 'kg' && styles.toggleTextActive])}>kg</Text>
                    </Pressable>
                </View>

                {/* Big Value Display - Optimized */}
                <View style={styles.valueDisplay}>
                    <TextInput
                        ref={weightTextRef}
                        style={styles.valueText}
                        editable={false}
                        defaultValue={selectedWeight.toString()}
                    />
                    <Text style={styles.unitText}>{unit}</Text>
                </View>

                {/* Ruler */}
                <View style={styles.rulerWrapper}>
                    <MaterialIcons name="arrow-drop-down" size={40} color={COLORS.primary} style={styles.indicatorIcon} />
                    
                    <View style={styles.rulerContainer}>
                        <Animated.FlatList<number>
                            ref={flatListRef}
                            data={weights}
                            renderItem={renderRulerItem}
                            keyExtractor={(item) => item.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={ITEM_WIDTH}
                            decelerationRate="fast"
                            bounces={false}
                            contentContainerStyle={{
                                paddingHorizontal: width / 2 - ITEM_WIDTH / 2
                            }}
                            onScroll={handleScroll}
                            onMomentumScrollEnd={handleMomentumScrollEnd}
                            scrollEventThrottle={16}
                            initialNumToRender={20}
                            maxToRenderPerBatch={20}
                            windowSize={10}
                            removeClippedSubviews={true}
                            getItemLayout={(_, index) => ({
                                length: ITEM_WIDTH,
                                offset: ITEM_WIDTH * index,
                                index,
                            })}
                        />
                         {/* Gradients for mask effect */}
                         <View style={styles.leftMask} pointerEvents="none" />
                         <View style={styles.rightMask} pointerEvents="none" />
                         
                         {/* Center Indicator Line (Visual Reference) */}
                         <View style={styles.centerLine} pointerEvents="none" />
                    </View>
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <MaterialIcons name="info-outline" size={20} color={COLORS.textGray} />
                    <Text style={styles.infoText}>
                        Peso objetivo dentro da faixa recomendada para sua altura.
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Pressable 
                    style={({ pressed }) => StyleSheet.flatten([
                        styles.continueButton,
                        pressed && { transform: [{ scale: 0.98 }] }
                    ])}
                    onPress={handleNext}
                >
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
  bgPattern: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.03,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  header: {
      marginBottom: 40,
  },
  headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
  },
  backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.slate100,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
  },
  progressBarContainer: {
      flex: 1,
      height: 6,
      backgroundColor: COLORS.slate100,
      borderRadius: 999,
      overflow: 'hidden',
  },
  progressBarFill: {
      height: '100%',
      backgroundColor: COLORS.primary,
      borderRadius: 999,
  },
  headerTextContainer: {
      gap: 8,
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.primary,
  },
  subtitle: {
      fontSize: 16,
      color: COLORS.textGray,
  },
  mainContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  toggleContainer: {
      flexDirection: 'row',
      backgroundColor: COLORS.accentGray,
      padding: 4,
      borderRadius: 999,
      marginBottom: 40,
  },
  toggleButton: {
      paddingHorizontal: 20,
      paddingVertical: 6,
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
      fontWeight: '500',
      color: COLORS.textGray,
  },
  toggleTextActive: {
      color: COLORS.white,
      fontWeight: '600',
  },
  valueDisplay: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 4,
      marginBottom: 32,
  },
  valueText: {
      fontSize: 72,
      fontWeight: 'bold',
      color: COLORS.primary,
      letterSpacing: -2,
      minWidth: 120, // Prevent layout shift
      textAlign: 'right',
      padding: 0,
  },
  unitText: {
      fontSize: 24,
      fontWeight: '600',
      color: COLORS.textGray,
  },
  rulerWrapper: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 48,
      position: 'relative',
  },
  indicatorIcon: {
      marginBottom: -14, // Keep this if relative, but let's try absolute for precision?
      // Actually, alignItems: 'center' is usually precise.
      // But let's stick to the previous layout which was working visually, just lagging.
      zIndex: 10,
  },
  rulerContainer: {
      width: '100%',
      height: 100,
      position: 'relative',
  },
  centerLine: {
      position: 'absolute',
      left: '50%',
      bottom: 0,
      height: 40,
      width: 2,
      backgroundColor: 'transparent', // Invisible, just for structure if needed
      marginLeft: -1,
  },
  rulerText: {
      position: 'absolute',
      top: 0,
      fontSize: 12,
      color: COLORS.textGray,
      width: 40, // Ensure text center alignment
      textAlign: 'center',
  },
  leftMask: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 60,
      backgroundColor: COLORS.backgroundLight,
      opacity: 0.9, 
  },
  rightMask: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 60,
      backgroundColor: COLORS.backgroundLight,
      opacity: 0.9,
  },
  infoBox: {
      flexDirection: 'row',
      backgroundColor: COLORS.infoBg,
      borderWidth: 1,
      borderColor: COLORS.accentGray,
      padding: 16,
      borderRadius: 16,
      gap: 12,
      alignItems: 'flex-start',
      width: '100%',
  },
  infoText: {
      flex: 1,
      fontSize: 14,
      color: COLORS.textGray,
      lineHeight: 20,
  },
  footer: {
      paddingBottom: 20,
      paddingTop: 10,
  },
  continueButton: {
      backgroundColor: COLORS.primary,
      width: '100%',
      paddingVertical: 18,
      borderRadius: 999,
      alignItems: 'center',
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
  },
  continueButtonText: {
      color: COLORS.white,
      fontSize: 18,
      fontWeight: 'bold',
  },
});

export default QuizGoalWeightScreen;
