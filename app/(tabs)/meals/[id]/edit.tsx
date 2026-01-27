import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { MealForm } from '@/components/meals/MealForm';
import { useNutritionStore } from '@/hooks/useNutritionStore';

export default function EditMealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const { meals, updateMeal } = useNutritionStore();

  const meal = useMemo(() => meals.find((m) => m.id === id), [meals, id]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Editar Refeição</ThemedText>
      {meal ? (
        <MealForm
          initial={{
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            foods: meal.foods,
          }}
          submitLabel="Atualizar"
          onSubmit={async (data) => {
            await updateMeal(meal.id, {
              name: data.name,
              calories: data.calories,
              protein: data.protein,
              carbs: data.carbs,
              fat: data.fat,
              foods: data.foods,
            });
            router.replace('/meals');
          }}
        />
      ) : (
        <ThemedText>Refeição não encontrada</ThemedText>
      )}
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
