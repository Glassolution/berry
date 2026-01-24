import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/ThemeContext';
import { useNutritionStore, Meal } from '@/hooks/useNutritionStore';
import { CalendarStrip } from '@/components/meals/CalendarStrip';
import { DayTimeline } from '@/components/meals/DayTimeline';
import { ScheduleMealDialog } from '@/components/meals/ScheduleMealDialog';

export default function MealsScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const { meals, user, getRoutineReminders } = useNutritionStore();
  const { colors } = useTheme();

  const routineReminders = getRoutineReminders();
  
  const combinedMeals: Meal[] = [
    ...meals,
    ...routineReminders.map((r) => {
      const d = new Date(selectedDate);
      const h = r.hour;
      // Logic from user code: if h <= 5, next day? (Maybe for night shifts?)
      // Keeping it as is.
      if (h <= 5) {
        d.setDate(d.getDate() + 1);
      }
      d.setHours(h, r.minute, 0, 0);
      return {
        id: `routine-${r.id}-${selectedDate.toDateString()}`,
        userId: user?.id || "guest",
        name: r.name,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        foods: [],
        createdAt: d,
        isPlanned: true,
      };
    })
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Fixed Header */}
        <View style={StyleSheet.flatten([styles.headerContainer, { borderBottomColor: colors.border }])}>
          <View style={styles.header}>
            <ThemedText type="title">Refeições</ThemedText>
            <Pressable 
              style={({ pressed }) => StyleSheet.flatten([
                styles.reminderButton, 
                { backgroundColor: pressed ? colors.card : 'transparent' }
              ])}
              onPress={() => setScheduleOpen(true)}
            >
              <IconSymbol name="plus" size={20} color={colors.primary} />
              <ThemedText style={StyleSheet.flatten([styles.reminderText, { color: colors.primary }])}>
                Lembrete
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.calendarStrip}>
            <CalendarStrip 
              selectedDate={selectedDate} 
              onSelectDate={setSelectedDate} 
            />
          </View>
        </View>

        {/* Scrollable Timeline */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <DayTimeline date={selectedDate} meals={combinedMeals} />
        </ScrollView>

        <ScheduleMealDialog 
          isOpen={scheduleOpen} 
          onClose={() => setScheduleOpen(false)} 
          selectedDate={selectedDate} 
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
  },
  reminderText: {
    fontWeight: '600',
  },
  calendarStrip: {
    paddingBottom: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Space for FAB
  },
});
