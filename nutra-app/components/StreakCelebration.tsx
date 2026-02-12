import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function StreakCelebration({
  visible,
  streakDays,
  color,
  onDone,
}: {
  visible: boolean;
  streakDays: number;
  color: string;
  onDone: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const glow = useMemo(() => {
    return color;
  }, [color]);

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(0);
    scale.setValue(0.75);

    const inAnim = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.12, duration: 420, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
    ]);

    const settle = Animated.timing(scale, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    const outAnim = Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.92, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]);

    const sequence = Animated.sequence([inAnim, settle, Animated.delay(520), outAnim]);
    sequence.start(({ finished }) => {
      if (finished) onDone();
    });

    return () => {
      sequence.stop();
    };
  }, [visible, opacity, scale, onDone]);

  if (!visible) return null;

  return (
    <View style={styles.root} pointerEvents="none">
      <View style={styles.backdrop} />
      <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
        <View style={[styles.glow, { backgroundColor: glow }]} />
        <View style={styles.iconWrap}>
          <MaterialIcons name="local-fire-department" size={72} color={color} />
        </View>
        <Text style={styles.plusText}>+1 dia</Text>
        <Text style={styles.daysText}>🔥 {streakDays} dias</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  card: {
    width: 240,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -60,
    left: -60,
    right: -60,
    height: 160,
    opacity: 0.18,
    borderRadius: 999,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    marginBottom: 10,
  },
  plusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  daysText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
});

