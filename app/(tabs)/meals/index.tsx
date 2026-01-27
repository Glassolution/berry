import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import Reanimated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue, scrollTo, runOnUI } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/context/ThemeContext';
import { CalendarStrip } from '@/components/meals/CalendarStrip';
import { useNutritionStore } from '@/hooks/useNutritionStore';
import { ScheduleMealDialog } from '@/components/meals/ScheduleMealDialog';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMealsLoop } from '@/hooks/useMealsLoop';
import { DayTimeline } from '@/components/meals/DayTimeline';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MealsPage() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isReminderOpen, setReminderOpen] = useState(false);
  const { getRoutineReminders, createMeal, deleteMeal, user, reminders, deleteReminder } = useNutritionStore();
  const { displayMeals, isFetching, refresh } = useMealsLoop(selectedDate);

  // Filter reminders for the selected date
  const dayReminders = reminders.filter(r => {
    // If no date is set, assume it's a daily recurring reminder
    if (!r.date) return true;
    
    const d = new Date(r.date);
    // Compare dates ignoring time
    return d.getFullYear() === selectedDate.getFullYear() &&
           d.getMonth() === selectedDate.getMonth() &&
           d.getDate() === selectedDate.getDate();
  });

  const scrollRef = useAnimatedRef<Reanimated.ScrollView>();
  const contentHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (contentHeight.value === 0) return;
      
      const y = event.contentOffset.y;
      if (y <= 0) {
        // Scrolled to top (start of Block 1) -> Jump to start of Block 2
        scrollTo(scrollRef, 0, contentHeight.value + y, false);
      } else if (y >= contentHeight.value * 2) {
        // Scrolled to bottom (start of Block 3) -> Jump to start of Block 2
        scrollTo(scrollRef, 0, y - contentHeight.value, false);
      }
    },
  });

  const barAnim = useRef(new Animated.Value(0)).current;
  const transAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: isFetching ? 0.25 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFetching]);
  useEffect(() => {
    transAnim.setValue(0);
    Animated.timing(transAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [selectedDate]);

  const breakfastHours = [6, 7, 8, 9, 10];
  const lunchHours = [11, 12, 13, 14];
  const snackHours = [15, 16, 17];
  const dinnerHours = [18, 19, 20, 21, 22, 23];
  const madrugadaHours = [0, 1, 2, 3, 4, 5];
  const sumCalories = (hours: number[]) =>
    displayMeals
      .filter((m) => hours.includes(m.createdAt.getHours()))
      .reduce((acc, m) => acc + (Number(m.calories) || 0), 0);
  const breakfastKcal = sumCalories(breakfastHours);
  const lunchKcal = sumCalories(lunchHours);
  const snackKcal = sumCalories(snackHours);
  const dinnerKcal = sumCalories(dinnerHours);
  const madrugadaKcal = sumCalories(madrugadaHours);

  useEffect(() => {
    const attachAuto = async () => {
      const uri = await AsyncStorage.getItem('nutra:pendingImageUri');
      if (!uri) return;
      const now = new Date();
      const when = new Date(selectedDate);
      when.setHours(now.getHours(), now.getMinutes(), 0, 0);
      
      // createMeal is now safe to call as it uses functional state updates internally
      await createMeal({
        userId: user.id,
        name: 'Refeição',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        foods: [],
        isPlanned: true,
        createdAt: when,
        imageUri: uri,
      });
      await AsyncStorage.removeItem('nutra:pendingImageUri');
      refresh();
    };
    
    // Check for pending images when screen mounts or comes into focus
    // We can use a simple interval or rely on navigation focus if available
    // For now, let's just check on mount and when date changes, but ideally should be on focus
    attachAuto();
    
    const interval = setInterval(attachAuto, 2000); // Check every 2s for pending images returning from camera
    return () => clearInterval(interval);
  }, [selectedDate, createMeal, refresh, user.id]);

  const renderContent = () => (
    <>
      <Animated.View
        style={StyleSheet.flatten([
          { height: 2, marginTop: 16, opacity: barAnim, backgroundColor: colors.accent },
        ])}
      />

      <Animated.View
        style={StyleSheet.flatten([
          {
            opacity: transAnim,
            transform: [
              {
                translateX: transAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
              },
            ],
          },
        ])}
      >
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>Café da Manhã</ThemedText>
          <ThemedText style={StyleSheet.flatten([styles.kcalBadge, { color: colors.calories }])}>
            {breakfastKcal} kcal
          </ThemedText>
        </View>
        <DayTimeline
          date={selectedDate}
          meals={displayMeals}
          reminders={dayReminders}
          hours={breakfastHours}
          onDelete={async (id) => { await deleteMeal(id); refresh(); }}
          onDeleteReminder={async (id) => { await deleteReminder(id); }}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>Almoço</ThemedText>
          <ThemedText style={StyleSheet.flatten([styles.kcalBadge, { color: colors.calories }])}>
            {lunchKcal} kcal
          </ThemedText>
        </View>
        <DayTimeline
          date={selectedDate}
          meals={displayMeals}
          reminders={dayReminders}
          hours={lunchHours}
          onDelete={async (id) => { await deleteMeal(id); refresh(); }}
          onDeleteReminder={async (id) => { await deleteReminder(id); }}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>Lanches</ThemedText>
          <ThemedText style={StyleSheet.flatten([styles.kcalBadge, { color: colors.calories }])}>
            {snackKcal} kcal
          </ThemedText>
        </View>
        <DayTimeline
          date={selectedDate}
          meals={displayMeals}
          reminders={dayReminders}
          hours={snackHours}
          onDelete={async (id) => { await deleteMeal(id); refresh(); }}
          onDeleteReminder={async (id) => { await deleteReminder(id); }}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>Jantar</ThemedText>
          <ThemedText style={StyleSheet.flatten([styles.kcalBadge, { color: colors.calories }])}>
            {dinnerKcal} kcal
          </ThemedText>
        </View>
        <DayTimeline
          date={selectedDate}
          meals={displayMeals}
          reminders={dayReminders}
          hours={dinnerHours}
          onDelete={async (id) => { await deleteMeal(id); refresh(); }}
          onDeleteReminder={async (id) => { await deleteReminder(id); }}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>Madrugada</ThemedText>
          <ThemedText style={StyleSheet.flatten([styles.kcalBadge, { color: colors.calories }])}>
            {madrugadaKcal} kcal
          </ThemedText>
        </View>
        <DayTimeline
          date={selectedDate}
          meals={displayMeals}
          reminders={dayReminders}
          hours={madrugadaHours}
          onDelete={async (id) => { await deleteMeal(id); refresh(); }}
          onDeleteReminder={async (id) => { await deleteReminder(id); }}
        />
      </View>
      </Animated.View>
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedView style={StyleSheet.flatten([styles.header, { backgroundColor: colors.background }])}>
        <View style={styles.headerRow}>
          <ThemedText type="title">Refeições</ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir lembrete de refeição"
            style={StyleSheet.flatten([styles.reminderLink])}
            onPress={() => setReminderOpen(true)}
          >
            <IconSymbol name={'calendar' as any} size={18} color={colors.accent} />
            <ThemedText style={StyleSheet.flatten([styles.reminderText, { color: colors.accent }])}>Lembrete</ThemedText>
        </Pressable>
      </View>
      <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
    </ThemedView>

      <Reanimated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View onLayout={(e) => { 
            const h = e.nativeEvent.layout.height;
            if (contentHeight.value === 0 && h > 0) {
              contentHeight.value = h;
              runOnUI(() => {
                scrollTo(scrollRef, 0, h, false);
              })();
            }
          }}>
          {renderContent()}
        </View>
        <View>
          {renderContent()}
        </View>
        <View>
          {renderContent()}
        </View>
        <View>
          {renderContent()}
        </View>
      </Reanimated.ScrollView>

      <ScheduleMealDialog isOpen={isReminderOpen} onClose={() => setReminderOpen(false)} selectedDate={selectedDate} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
    paddingTop: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerRow: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reminderText: {
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  labelsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  labelChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  kcalBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
});
