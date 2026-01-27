import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { Meal } from '@/hooks/useNutritionStore';
import { Link } from 'expo-router';

interface Props {
  meal: Meal;
  onDelete?: (id: string) => void;
}

export function MealCard({ meal, onDelete }: Props) {
  const { colors } = useTheme();

  return (
    <View style={StyleSheet.flatten([styles.card, { borderColor: colors.border }])}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">{meal.name}</ThemedText>
        <ThemedText style={StyleSheet.flatten([styles.kcal, { color: colors.calories }])}>
          {meal.calories} kcal
        </ThemedText>
      </View>
      <View style={styles.macros}>
        <ThemedText style={StyleSheet.flatten([styles.macro, { color: colors.protein }])}>
          P {meal.protein}g
        </ThemedText>
        <ThemedText style={StyleSheet.flatten([styles.macro, { color: colors.carbs }])}>
          C {meal.carbs}g
        </ThemedText>
        <ThemedText style={StyleSheet.flatten([styles.macro, { color: colors.fat }])}>
          G {meal.fat}g
        </ThemedText>
      </View>
      <View style={styles.actions}>
        <Link href={`/meals/${meal.id}/edit`} asChild>
          <Pressable style={[styles.button, { borderColor: colors.border }]}>
            <ThemedText>Editar</ThemedText>
          </Pressable>
        </Link>
        <Pressable
          style={[styles.buttonPrimary, { backgroundColor: colors.destructive }]}
          onPress={() => onDelete?.(meal.id)}
        >
          <ThemedText style={styles.buttonPrimaryText}>Excluir</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kcal: {
    fontWeight: '700',
  },
  macros: {
    flexDirection: 'row',
    gap: 12,
  },
  macro: {
    fontWeight: '600',
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});
