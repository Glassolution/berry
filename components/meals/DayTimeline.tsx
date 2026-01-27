import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { Meal, RoutineReminder } from '@/hooks/useNutritionStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';

interface Props {
  date: Date;
  meals: Meal[];
  reminders?: RoutineReminder[];
  hours?: number[];
  onDelete?: (id: string) => void;
  onDeleteReminder?: (id: string) => void;
}

export function DayTimeline({ date, meals, reminders = [], hours: hoursProp, onDelete, onDeleteReminder }: Props) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate hours 00:00 to 23:00
  const hours = hoursProp ?? Array.from({ length: 24 }, (_, i) => i);

  return (
    <View style={styles.container}>
      {hours.map((hour) => {
        // Find meals for this hour and sort by minute
        const mealsInHour = meals
          .filter(m => m.createdAt.getHours() === hour)
          .sort((a, b) => a.createdAt.getMinutes() - b.createdAt.getMinutes());
        
        // Find reminders for this hour and sort by minute
        const remindersInHour = reminders
          .filter(r => r.hour === hour)
          .sort((a, b) => a.minute - b.minute);

        const hasMeals = mealsInHour.length > 0;
        const hasReminders = remindersInHour.length > 0;
        const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

        return (
          <View key={hour} style={styles.hourRow}>
            {/* Time Column */}
            <View style={styles.timeCol}>
              <ThemedText style={StyleSheet.flatten([styles.timeText, { color: colors.mutedForeground }])}>
                {timeLabel}
              </ThemedText>
            </View>

            {/* Timeline Column */}
            <View style={styles.lineCol}>
              <View style={StyleSheet.flatten([styles.line, { backgroundColor: colors.border }])} />
              <View style={StyleSheet.flatten([styles.dot, { backgroundColor: colors.border }])} />
            </View>

            {/* Content Column */}
            <View style={styles.contentCol}>
              {/* Reminders */}
              {hasReminders && remindersInHour.map(rem => (
                 <View key={rem.id} style={styles.reminderCard}>
                    <View style={StyleSheet.flatten([styles.reminderIconBox, { backgroundColor: rem.type === 'water' ? '#eff6ff' : '#f0fdf4', borderColor: rem.type === 'water' ? '#bfdbfe' : '#bbf7d0' }])}>
                      <IconSymbol 
                        name={rem.type === 'water' ? 'bell' : 'fork.knife'} 
                        size={16} 
                        color={rem.type === 'water' ? '#3b82f6' : '#22c55e'} 
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={styles.reminderTitle}>{rem.name}</ThemedText>
                    </View>
                    <Pressable style={styles.trashBtn} onPress={() => onDeleteReminder?.(rem.id)}>
                      <IconSymbol name="trash" size={16} color={colors.mutedForeground} />
                    </Pressable>
                 </View>
              ))}

              {/* Meals */}
              {hasMeals ? (
                mealsInHour.map(meal => (
                  <View key={meal.id} style={styles.cardContainer}>
                     <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                     <View style={StyleSheet.flatten([
                       styles.card, 
                       { borderColor: colors.border }
                     ])}>
                      <View style={styles.cardHeader}>
                        <View style={styles.headerLeft}>
                          <View style={StyleSheet.flatten([styles.iconBox, { backgroundColor: isDark ? '#1f2937' : '#e5e7eb' }])}>
                            {meal.imageUri ? (
                              <Image
                                source={{ uri: meal.imageUri }}
                                style={styles.iconImage}
                                contentFit="cover"
                              />
                            ) : (
                              <IconSymbol name="bowl" size={22} color={colors.mutedForeground} />
                            )}
                          </View>
                          <View style={styles.badgesRow}>
                            <View style={StyleSheet.flatten([styles.badge, { backgroundColor: isDark ? '#111827' : '#f3f4f6', borderColor: colors.border }])}>
                              <IconSymbol name="flame" size={14} color={colors.calories} />
                              <ThemedText style={StyleSheet.flatten([styles.badgeText, { color: colors.calories }])}>
                                {meal.calories} kcal
                              </ThemedText>
                            </View>
                            <ThemedText style={StyleSheet.flatten([styles.timeTextTop, { color: colors.mutedForeground }])}>
                              {new Date(meal.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </ThemedText>
                          </View>
                        </View>
                        <Pressable style={styles.trashBtn} onPress={() => onDelete?.(meal.id)}>
                          <IconSymbol name="trash" size={18} color={colors.mutedForeground} />
                        </Pressable>
                      </View>

                      <ThemedText type="defaultSemiBold" style={styles.mealTitle}>{meal.name}</ThemedText>

                      <View style={StyleSheet.flatten([styles.macrosRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderColor: colors.border }])}>
                        <View style={styles.macroItem}>
                          <View style={StyleSheet.flatten([styles.macroDot, { backgroundColor: colors.protein }])} />
                          <ThemedText style={StyleSheet.flatten([styles.macroText, { color: colors.mutedForeground }])}>
                            {meal.protein || 0}g P
                          </ThemedText>
                        </View>
                        <View style={styles.macroItem}>
                          <View style={StyleSheet.flatten([styles.macroDot, { backgroundColor: colors.carbs }])} />
                          <ThemedText style={StyleSheet.flatten([styles.macroText, { color: colors.mutedForeground }])}>
                            {meal.carbs || 0}g C
                          </ThemedText>
                        </View>
                        <View style={styles.macroItem}>
                          <View style={StyleSheet.flatten([styles.macroDot, { backgroundColor: colors.fat }])} />
                          <ThemedText style={StyleSheet.flatten([styles.macroText, { color: colors.mutedForeground }])}>
                            {meal.fat || 0}g G
                          </ThemedText>
                        </View>
                      </View>
                     </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptySlot} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  hourRow: {
    flexDirection: 'row',
    minHeight: 60, // Height per hour slot
  },
  timeCol: {
    width: 50,
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingTop: 0,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: -6, // Align with dot
  },
  timeTextTop: {
    fontSize: 12,
    fontWeight: '600',
  },
  lineCol: {
    width: 20,
    alignItems: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 9, // Center of width 20
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 0, // Align with time
  },
  contentCol: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 24,
  },
  cardContainer: {
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent', // Border handled by inner or this?
    // Actually border should be on the container or overlay?
    // Let's put border on the view inside or here.
  },
  card: {
    padding: 16,
    // backgroundColor handled by BlurView? No, BlurView provides background blur.
    // We usually need a semi-transparent bg color too.
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconImage: {
    width: 36,
    height: 36,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
  },
  trashBtn: {
    padding: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  macrosRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptySlot: {
    // Empty space for empty hours
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  reminderIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  reminderSub: {
    fontSize: 12,
    opacity: 0.6,
  },
});
