import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { Meal } from '@/hooks/useNutritionStore';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Props {
  date: Date;
  meals: Meal[];
}

export function DayTimeline({ date, meals }: Props) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate hours 00:00 to 23:00
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <View style={styles.container}>
      {hours.map((hour) => {
        // Find meals for this hour
        const mealsInHour = meals.filter(m => m.createdAt.getHours() === hour);
        const hasMeals = mealsInHour.length > 0;
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
              {hasMeals ? (
                mealsInHour.map(meal => (
                  <View key={meal.id} style={styles.cardContainer}>
                     <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                     <View style={StyleSheet.flatten([
                       styles.card, 
                       { borderColor: colors.border }
                     ])}>
                      <View style={styles.cardHeader}>
                         <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>{meal.name}</ThemedText>
                         <View style={styles.kcalBadge}>
                           <IconSymbol name="flame" size={14} color={colors.mutedForeground} />
                           <ThemedText style={{ fontSize: 12, color: colors.mutedForeground }}>{meal.calories} kcal</ThemedText>
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
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle tint
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kcalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptySlot: {
    // Empty space for empty hours
  },
});
