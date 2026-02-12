import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useStreak } from '@/src/context/StreakContext';

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '').trim();
  const full = normalized.length === 3 ? normalized.split('').map((c) => c + c).join('') : normalized;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return { r, g, b };
};

const toRgba = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function StreakPill() {
  const { streakDays, isLitToday, color, refresh } = useStreak();

  const bg = toRgba(color, 0.12);
  const border = toRgba(color, 0.22);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={refresh}
      style={({ pressed }) => [styles.pill, { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.85 : 1 }]}
    >
      <View style={styles.left}>
        <MaterialIcons name="local-fire-department" size={20} color={color} />
        {isLitToday ? <View style={[styles.dot, { backgroundColor: color }]} /> : null}
      </View>
      <Text style={styles.days}>{streakDays}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    opacity: 0.9,
  },
  days: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
});

