import React, { useMemo, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable, View, Animated, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { useNutritionContext } from '@/context/NutritionContext';

interface Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarStrip({ selectedDate, onSelectDate }: Props) {
  const { colors } = useTheme();
  const { meals, reminders } = useNutritionContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedAnim = useRef(new Animated.Value(0)).current;
  const ITEM_W = 60;
  const ITEM_GAP = 12;
  const { width: SCREEN_W } = Dimensions.get('window');

  const week = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - 182);
    
    const arr: { date: Date; label: string; dayNum: string }[] = [];
    
    for (let i = 0; i < 365; i++) {
      const nd = new Date(start);
      nd.setDate(start.getDate() + i);
      const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(nd);
      const clean = weekday.replace('-feira', '').replace('feira', '').trim();
      arr.push({ 
        date: nd, 
        label: clean, 
        dayNum: nd.getDate().toString() 
      });
    }
    return arr;
  }, [selectedDate]); // Re-calculating on select might jump the list. Ideally should be stable.
  
  useEffect(() => {
    selectedAnim.setValue(0);
    Animated.timing(selectedAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [selectedDate]);
  
  useEffect(() => {
    const idx = week.findIndex((w) => w.date.toDateString() === selectedDate.toDateString());
    if (idx >= 0) {
      const targetCenter = idx * (ITEM_W + ITEM_GAP) + ITEM_W / 2;
      const scrollX = Math.max(targetCenter - SCREEN_W / 2, 0);
      scrollViewRef.current?.scrollTo({ x: scrollX, animated: true });
    }
  }, [week, selectedDate]);
  
  return (
    <ScrollView 
      ref={scrollViewRef}
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {week.map((w) => {
        const isSel = w.date.toDateString() === selectedDate.toDateString();
        const scale = isSel
          ? selectedAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.06] })
          : 1;
        
        // Check for indicators
        const hasMeals = meals.some(m => 
          m.createdAt.getDate() === w.date.getDate() &&
          m.createdAt.getMonth() === w.date.getMonth() &&
          m.createdAt.getFullYear() === w.date.getFullYear()
        );

        const hasReminders = reminders.some(r => {
          if (!r.date) return true; // Daily reminder
          const d = new Date(r.date);
          return d.getDate() === w.date.getDate() &&
                 d.getMonth() === w.date.getMonth() &&
                 d.getFullYear() === w.date.getFullYear();
        });

        const hasDot = hasMeals || hasReminders;

        return (
          <Pressable key={w.date.toISOString()} onPress={() => onSelectDate(w.date)}>
            <Animated.View
              style={StyleSheet.flatten([
                styles.item,
                isSel && styles.itemActive,
                { 
                  backgroundColor: isSel ? colors.accent : colors.secondary,
                  transform: [{ scale }],
                },
              ])}
            >
              <ThemedText
                style={StyleSheet.flatten([
                  styles.label,
                  { color: isSel ? colors.accentForeground : colors.mutedForeground },
                ])}
              >
                {w.label}
              </ThemedText>
              <ThemedText
                style={StyleSheet.flatten([
                  styles.dayNum,
                  { color: isSel ? colors.accentForeground : colors.foreground },
                ])}
              >
                {w.dayNum}
              </ThemedText>
              
              {/* Indicator Dot */}
              <View 
                style={StyleSheet.flatten([
                  styles.dot, 
                  { backgroundColor: hasDot ? (isSel ? colors.accentForeground : colors.primary) : 'transparent' }
                ])} 
              />
            </Animated.View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  item: {
    width: 60,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  itemActive: {
    // bg color handled inline
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  dayNum: {
    fontSize: 20,
    fontWeight: '700',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});
