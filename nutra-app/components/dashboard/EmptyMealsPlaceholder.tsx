import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export function EmptyMealsPlaceholder() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
           <IconSymbol name="fork.knife" size={32} color={colors.mutedForeground} />
        </View>
        <ThemedText type="defaultSemiBold" style={{ marginTop: 16 }}>Nenhuma refeição ainda</ThemedText>
        <ThemedText style={{ color: colors.mutedForeground, marginTop: 4, textAlign: 'center' }}>
          Tire uma foto do seu prato para começar
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
    minHeight: 200,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
