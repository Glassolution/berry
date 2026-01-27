import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { Meal } from '@/hooks/useNutritionStore';

interface Props {
  meals: Meal[];
}

export function DaySummary({ meals }: Props) {
  const { colors } = useTheme();

  const totals = meals.reduce(
    (acc, m) => {
      acc.calories += m.calories || 0;
      acc.protein += m.protein || 0;
      acc.carbs += m.carbs || 0;
      acc.fat += m.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <View style={StyleSheet.flatten([styles.container, { borderColor: colors.border }])}>
      <View style={styles.row}>
        <ThemedText style={StyleSheet.flatten([styles.label, { color: colors.protein }])}>Proteínas</ThemedText>
        <ThemedText style={styles.value}>{Math.round(totals.protein)} g</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={StyleSheet.flatten([styles.label, { color: colors.carbs }])}>Carbos</ThemedText>
        <ThemedText style={styles.value}>{Math.round(totals.carbs)} g</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={StyleSheet.flatten([styles.label, { color: colors.fat }])}>Gorduras</ThemedText>
        <ThemedText style={styles.value}>{Math.round(totals.fat)} g</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={StyleSheet.flatten([styles.label, { color: colors.calories }])}>Calorias</ThemedText>
        <ThemedText style={styles.value}>{Math.round(totals.calories)} kcal</ThemedText>
      </View>
      <ThemedText type="caption" style={styles.disclaimer}>
        Estimativas educativas; ajuste conforme sua preferência.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
  },
  value: {
    fontWeight: '700',
  },
  disclaimer: {
    marginTop: 8,
  },
});
