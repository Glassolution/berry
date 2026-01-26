import React, { useMemo, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarStrip({ selectedDate, onSelectDate }: Props) {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const week = useMemo(() => {
    const d = new Date(selectedDate); // Center on selected date? Or start from today?
    // Guide says: "CalendarStrip horizontal com 15 dias (-7 a +7)"
    // Let's implement -7 to +7 centered on today or selectedDate.
    // Assuming selectedDate starts as Today.
    // Let's generate -7 to +7 from the current reference (which changes when user scrolls? No, usually static or infinite)
    // For simplicity, let's do -7 to +7 from selectedDate initially, or just a static 2 weeks.
    // The user screenshot shows "Segunda 19" to "Domingo 25". That's a week.
    // Let's stick to a simple week view centered or starting from slightly before.
    
    // Better: Generate 15 days around selectedDate? Or just a fixed window?
    // User guide says 15 days.
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - 7);
    
    const arr: { date: Date; label: string; dayNum: string }[] = [];
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    for (let i = 0; i < 15; i++) {
      const nd = new Date(start);
      nd.setDate(start.getDate() + i);
      arr.push({ 
        date: nd, 
        label: days[nd.getDay()], 
        dayNum: nd.getDate().toString() 
      });
    }
    return arr;
  }, [selectedDate]); // Re-calculating on select might jump the list. Ideally should be stable.
  // But for now let's keep it simple or fix it to a stable anchor if needed.
  // To avoid jumping, we might want to just generate a large range or manage scroll.
  // Let's generate a static range around "Today" and allow selecting.
  
  // Revert to stable week generation centered on "Today" or just a long list.
  // Let's generate 30 days starting from 15 days ago.
  
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
        
        return (
          <Pressable 
            key={w.date.toISOString()} 
            style={StyleSheet.flatten([
              styles.item,
              isSel && styles.itemActive,
              { backgroundColor: isSel ? colors.primary : 'transparent' }
            ])}
            onPress={() => onSelectDate(w.date)}
          >
            <ThemedText style={StyleSheet.flatten([
              styles.label, 
              { color: isSel ? '#fff' : colors.mutedForeground }
            ])}>
              {w.label.split(' ')[0]} {/* Full name or short? Screenshot has "Sexta" */}
            </ThemedText>
            <ThemedText style={StyleSheet.flatten([
              styles.dayNum,
              { color: isSel ? '#fff' : colors.foreground }
            ])}>
              {w.dayNum}
            </ThemedText>
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
    width: 60, // Slightly wider for full day names
    height: 80,
    borderRadius: 20, // 2xl
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
});
