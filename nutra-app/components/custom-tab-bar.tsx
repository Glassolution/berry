import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { BlurView } from 'expo-blur';

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const activeIndex = state.index;
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  const go = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    navigation.navigate(name as never);
  };

  const isFocused = (name: string) => state.routes[activeIndex]?.name === name;

  const onScanPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permita acesso às imagens para escanear.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      alert(uri ? 'Imagem selecionada: ' + uri : 'Imagem selecionada.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <BlurView 
        intensity={80} 
        tint={isDark ? 'dark' : 'light'} 
        style={StyleSheet.flatten([styles.bar, { borderTopColor: colors.border }])}
      >
        <Pressable style={styles.item} onPress={() => go('index')}>
          <IconSymbol size={24} color={isFocused('index') ? colors.primary : colors.mutedForeground} name={'square.grid.2x2' as any} />
          <ThemedText style={StyleSheet.flatten([styles.label, { color: isFocused('index') ? colors.primary : colors.mutedForeground }])}>Dashboard</ThemedText>
        </Pressable>
        <Pressable style={styles.item} onPress={() => go('meals')}>
          <IconSymbol size={24} color={isFocused('meals') ? colors.primary : colors.mutedForeground} name={'fork.knife' as any} />
          <ThemedText style={StyleSheet.flatten([styles.label, { color: isFocused('meals') ? colors.primary : colors.mutedForeground }])}>Refeições</ThemedText>
        </Pressable>

        <View style={styles.centerSpace} />

        <Pressable style={styles.item} onPress={() => go('recipes')}>
          <IconSymbol size={24} color={isFocused('recipes') ? colors.primary : colors.mutedForeground} name={'book' as any} />
          <ThemedText style={StyleSheet.flatten([styles.label, { color: isFocused('recipes') ? colors.primary : colors.mutedForeground }])}>Receitas</ThemedText>
        </Pressable>
        <Pressable style={styles.item} onPress={() => go('progress')}>
          <IconSymbol size={24} color={isFocused('progress') ? colors.primary : colors.mutedForeground} name={'chart.bar.fill' as any} />
          <ThemedText style={StyleSheet.flatten([styles.label, { color: isFocused('progress') ? colors.primary : colors.mutedForeground }])}>Progresso</ThemedText>
        </Pressable>
      </BlurView>

      <Pressable 
        style={StyleSheet.flatten([styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }])} 
        onPress={onScanPress}
      >
        <IconSymbol size={28} color={colors.primaryForeground} name={'plus' as any} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    width: '100%',
    height: 64,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  centerSpace: {
    width: 56,
  },
  fab: {
    position: 'absolute',
    top: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
});
