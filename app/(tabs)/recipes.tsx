import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/ThemeContext';

export type Goal = 'lose' | 'maintain' | 'gain';
export const RECIPES: Record<Goal, { id: string; name: string; calories: number; protein: number; carbs: number; fat: number; desc: string }[]> = {
  lose: [
    { id: 'r1', name: 'Salada de frango grelhado', calories: 420, protein: 32, carbs: 28, fat: 18, desc: 'Leve e rica em proteína.' },
    { id: 'r2', name: 'Omelete de claras com legumes', calories: 280, protein: 24, carbs: 12, fat: 10, desc: 'Rápida e saciante.' },
  ],
  maintain: [
    { id: 'r3', name: 'Arroz, feijão e bife', calories: 620, protein: 35, carbs: 70, fat: 18, desc: 'Clássico equilibrado.' },
    { id: 'r4', name: 'Iogurte com frutas e granola', calories: 350, protein: 18, carbs: 46, fat: 10, desc: 'Opção prática para o dia.' },
  ],
  gain: [
    { id: 'r5', name: 'Macarrão com carne moída', calories: 780, protein: 40, carbs: 92, fat: 24, desc: 'Energia para treinos.' },
    { id: 'r6', name: 'Sanduíche de peito de peru', calories: 520, protein: 32, carbs: 48, fat: 16, desc: 'Refresco proteico.' },
  ],
};

export default function RecipesScreen() {
  const [goal, setGoal] = useState<Goal>('maintain');
  const current = RECIPES[goal];
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: colors.primary, dark: colors.primary }}
      headerImage={
        <IconSymbol
          size={280}
          color={colors.primaryForeground}
          name="fork.knife"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Receitas</ThemedText>
        <ThemedText style={styles.subtitle}>Sugestões educativas e estimativas</ThemedText>
      </ThemedView>

      <ThemedView style={styles.tabs}>
        {(['lose','maintain','gain'] as Goal[]).map((g) => (
          <Pressable
            key={g}
            onPress={() => setGoal(g)}
            style={StyleSheet.flatten([
              styles.tab, 
              { borderColor: colors.border, backgroundColor: 'transparent' },
              goal === g ? { backgroundColor: colors.primary, borderColor: colors.primary } : undefined
            ])}>
            <ThemedText style={StyleSheet.flatten([
              styles.tabText, 
              { color: colors.foreground },
              goal === g ? { color: colors.primaryForeground, fontWeight: '600' } : undefined
            ])}>
              {g === 'lose' ? 'Emagrecimento' : g === 'maintain' ? 'Manutenção' : 'Hipertrofia'}
            </ThemedText>
          </Pressable>
        ))}
      </ThemedView>

      <ThemedView style={styles.list}>
        {current.map((r) => (
          <View key={r.id} style={StyleSheet.flatten([styles.card, { borderColor: colors.border, backgroundColor: 'transparent' }])}>
             <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>{r.name}</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.calBadge, { color: colors.calories }])}>{r.calories} kcal</ThemedText>
            </View>
            <ThemedText style={styles.cardDesc}>{r.desc}</ThemedText>
            <View style={styles.macros}>
              <ThemedText style={styles.p}>P: {r.protein}g</ThemedText>
              <ThemedText style={styles.c}>C: {r.carbs}g</ThemedText>
              <ThemedText style={styles.f}>G: {r.fat}g</ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>

      <ThemedView style={StyleSheet.flatten([styles.disclaimer, { borderColor: colors.border }])}>
        <ThemedText>
          Sugestões educativas e estimativas. Ajuste conforme sua preferência.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -80,
    right: -30,
    position: 'absolute',
    opacity: 0.3,
  },
  titleContainer: {
    gap: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
  },
  list: {
    gap: 12,
    marginTop: 16,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  calBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 13,
    opacity: 0.8,
  },
  macros: {
    flexDirection: 'row',
    gap: 12,
  },
  p: { color: '#0ea5e9' },
  c: { color: '#eab308' },
  f: { color: '#ec4899' },
  disclaimer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 16,
  },
});
