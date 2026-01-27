import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { FoodItem, Meal } from '@/hooks/useNutritionStore';

type FormMeal = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: FoodItem[];
};

interface Props {
  initial?: Partial<FormMeal>;
  onSubmit: (data: FormMeal) => void | Promise<void>;
  submitLabel?: string;
}

export function MealForm({ initial, onSubmit, submitLabel = 'Salvar' }: Props) {
  const { colors } = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [calories, setCalories] = useState(String(initial?.calories ?? ''));
  const [protein, setProtein] = useState(String(initial?.protein ?? ''));
  const [carbs, setCarbs] = useState(String(initial?.carbs ?? ''));
  const [fat, setFat] = useState(String(initial?.fat ?? ''));

  const handleSubmit = async () => {
    const data: FormMeal = {
      name,
      calories: Number(calories || 0),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fat: Number(fat || 0),
      foods: initial?.foods ?? [],
    };
    await onSubmit(data);
  };

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <ThemedText>Nome</ThemedText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ex.: Almoço"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.fieldHalf}>
          <ThemedText>Calorias</ThemedText>
          <TextInput
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
            placeholder="kcal"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          />
        </View>
        <View style={styles.fieldHalf}>
          <ThemedText>Proteína</ThemedText>
          <TextInput
            value={protein}
            onChangeText={setProtein}
            keyboardType="numeric"
            placeholder="g"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.fieldHalf}>
          <ThemedText>Carbos</ThemedText>
          <TextInput
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
            placeholder="g"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          />
        </View>
        <View style={styles.fieldHalf}>
          <ThemedText>Gorduras</ThemedText>
          <TextInput
            value={fat}
            onChangeText={setFat}
            keyboardType="numeric"
            placeholder="g"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          />
        </View>
      </View>

      <Pressable style={[styles.primaryButton, { backgroundColor: colors.destructive }]} onPress={handleSubmit}>
        <ThemedText style={styles.primaryButtonText}>{submitLabel}</ThemedText>
      </Pressable>

      <ThemedText type="caption" style={styles.disclaimer}>
        Valores de macros são estimativas educativas.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  field: {
    gap: 6,
  },
  fieldHalf: {
    flex: 1,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  disclaimer: {
    marginTop: 8,
  },
});
