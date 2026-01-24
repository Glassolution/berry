import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizAgeScreen'>;

const { width, height } = Dimensions.get('window');

// Colors
const COLORS = {
  primary: '#000000',
  backgroundLight: '#FFFFFF',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate900: '#0F172A',
  white: '#FFFFFF',
  green500: '#22c55e',
};

// Age config
const MIN_AGE = 10;
const MAX_AGE = 100;
const AGES = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i);
const ITEM_HEIGHT = 56; // h-[56px]
const VISIBLE_ITEMS = 5; // Show roughly this many items
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const SPACING_HEIGHT = (PICKER_HEIGHT - ITEM_HEIGHT) / 2;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const QuizAgeScreen = ({ navigation }: Props) => {
  const [selectedAge, setSelectedAge] = useState(18); // Default from HTML
  const scrollY = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const currentAgeIndexRef = useRef(AGES.indexOf(18));

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
    console.log('Next pressed, age:', selectedAge);
    navigation.navigate('QuizGoalScreen');
  };

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to initial selected age on mount
  useEffect(() => {
    const initialIndex = AGES.indexOf(selectedAge);
    if (initialIndex !== -1) {
      // Set initial scrollY value to match the initial position
      // IMPORTANT: Account for SPACING_HEIGHT only if needed for initial rendering before layout?
      // With ListHeaderComponent, index 0 is at offset 0 (start of list).
      // Wait, no. Header is at 0. Item 0 is at SPACING_HEIGHT.
      // So to center Item 0, we need to scroll to 0.
      // Because at scrollY=0, Header is at top, Item 0 is at SPACING_HEIGHT (middle).
      // So offset = index * ITEM_HEIGHT.
      
      scrollY.setValue(initialIndex * ITEM_HEIGHT);
      
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: initialIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        
        if (index >= 0 && index < AGES.length && index !== currentAgeIndexRef.current) {
          currentAgeIndexRef.current = index;
          Haptics.selectionAsync();
        }
      }
    }
  );

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, AGES.length - 1));
    setSelectedAge(AGES[clampedIndex]);
  };

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.8, 0.9, 1.2, 0.9, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.3, 0.5, 1, 0.5, 0.3],
      extrapolate: 'clamp',
    });
    
    const centerOffset = index * ITEM_HEIGHT;
    const range = ITEM_HEIGHT;

    // Sharp transition for active color to feel immediate
    const colorInputRange = [
      centerOffset - 30,
      centerOffset - 25,
      centerOffset + 25,
      centerOffset + 30,
    ];

    const color = scrollY.interpolate({
      inputRange: colorInputRange,
      outputRange: [COLORS.slate400, COLORS.primary, COLORS.primary, COLORS.slate400],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{ 
        height: ITEM_HEIGHT, 
        justifyContent: 'center', 
        alignItems: 'center',
        transform: [{ scale }],
        opacity
      }}>
        <Animated.Text 
          allowFontScaling={false}
          style={[
            styles.ageText,
            { color }
          ]}>
          {item} anos
        </Animated.Text>
      </Animated.View>
    );
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['25%', '50%'],
  });

  return (
    <View style={styles.container}>
      {/* Background Icons */}
      <View style={styles.backgroundIconsContainer} pointerEvents="none">
        <MaterialIcons name="fitness-center" size={128} color="#000" style={[styles.bgIcon, { top: 80, left: 40, transform: [{ rotate: '12deg' }] }]} />
        <MaterialIcons name="favorite-border" size={96} color="#000" style={[styles.bgIcon, { top: '50%', right: -20, transform: [{ rotate: '-12deg' }] }]} />
        <MaterialIcons name="bolt" size={120} color="#000" style={[styles.bgIcon, { bottom: 40, left: 40, transform: [{ rotate: '12deg' }] }]} />
        <MaterialIcons name="monitor-weight" size={100} color="#000" style={[styles.bgIcon, { top: '25%', right: '25%', transform: [{ rotate: '12deg' }] }]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={20} color={COLORS.slate900} />
            </Pressable>
            
            {/* Progress Bar: w-2/3 filled */}
            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} /> 
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>O tempo como aliado</Text>
              <Text style={styles.subtitle}>
                Sua idade é um dado fundamental para que a IA calibre as metas metabólicas com precisão.
              </Text>
            </View>

            {/* Age Picker Container */}
            <View style={styles.pickerContainer}>
              {/* Gradients */}
              <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
                style={styles.gradientTop}
                pointerEvents="none"
              />
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                style={styles.gradientBottom}
                pointerEvents="none"
              />

              {/* Center Highlight Bar */}
              <View style={styles.highlightBar} pointerEvents="none" />

              {/* Scrollable List */}
              <AnimatedFlatList
                ref={flatListRef}
                data={AGES}
                renderItem={renderItem}
                keyExtractor={(item) => item.toString()}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
                ListHeaderComponent={<View style={{ height: SPACING_HEIGHT }} />}
                ListFooterComponent={<View style={{ height: SPACING_HEIGHT }} />}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollEndDrag={onMomentumScrollEnd}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index + SPACING_HEIGHT, // Account for header in getItemLayout if needed by internal logic, but actually for offset based scrolling, we want index * ITEM_HEIGHT
                  index,
                })}
                style={{ height: PICKER_HEIGHT, width: '100%', zIndex: 15 }}
              />
            </View>
          </View>

          {/* Footer */}
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
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
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
  mainContent: {
    flex: 1,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.slate400,
    lineHeight: 26,
  },
  pickerContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: PICKER_HEIGHT,
    marginTop: 20,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 128,
    zIndex: 20,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 128,
    zIndex: 20,
  },
  highlightBar: {
    position: 'absolute',
    top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: COLORS.slate100,
    borderRadius: 999,
    zIndex: 10,
  },
  ageText: {
    fontSize: 24,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 24,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default QuizAgeScreen;
