import { Stack } from 'expo-router';
import React from 'react';

export default function MealsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="new" options={{ headerShown: true, title: 'Nova Refeição' }} />
      <Stack.Screen name="[id]/edit" options={{ headerShown: true, title: 'Editar Refeição' }} />
    </Stack>
  );
}
