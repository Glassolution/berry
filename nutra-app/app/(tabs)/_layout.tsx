import { Tabs } from 'expo-router';
import React from 'react';

import CustomTabBar from '@/components/custom-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Perfil',
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Receitas',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progresso',
        }}
      />
    </Tabs>
  );
}
