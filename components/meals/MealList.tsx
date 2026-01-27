import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Meal } from '@/hooks/useNutritionStore';
import { MealCard } from './MealCard';

interface Props {
  meals: Meal[];
  onDelete: (id: string) => void;
}

export function MealList({ meals, onDelete }: Props) {
  return (
    <View style={styles.container}>
      {meals.map((m) => (
        <MealCard key={m.id} meal={m} onDelete={onDelete} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
