import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { MealForm } from '@/components/meals/MealForm';
import { useNutritionStore } from '@/hooks/useNutritionStore';

export default function NewMealScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, createMeal } = useNutritionStore();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Nova Refeição</ThemedText>
      <MealForm
        submitLabel="Salvar"
        onSubmit={async (data) => {
          await createMeal({
            userId: user.id,
            name: data.name,
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
            foods: data.foods,
            isPlanned: false,
            createdAt: new Date(),
          });
          router.replace('/meals');
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
