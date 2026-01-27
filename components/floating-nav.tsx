import React from 'react';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/themed-text';
import { Link } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function FloatingNav({ active }: { active?: 'index' | 'meals' | 'recipes' }) {
  const { colors } = useTheme();
  const onScanPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permita acesso às imagens para escanear.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      alert(uri ? 'Imagem selecionada: ' + uri : 'Imagem selecionada.');
    }
  };

  const isActive = (k: string) => active === (k as any);

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <Link href="/" asChild>
          <Pressable style={styles.item}>
            <IconSymbol size={22} color={isActive('index') ? colors.primary : '#9ca3af'} name={'square.grid.2x2' as any} />
            <ThemedText style={StyleSheet.flatten([styles.label, isActive('index') ? styles.labelActive : styles.labelInactive])}>Dashboard</ThemedText>
          </Pressable>
        </Link>
        <Link href="/meals" asChild>
          <Pressable style={styles.item}>
            <IconSymbol size={22} color={isActive('index') ? colors.primary : '#9ca3af'} name={'fork.knife' as any} />
            <ThemedText style={StyleSheet.flatten([styles.label, isActive('index') ? styles.labelActive : styles.labelInactive])}>Refeições</ThemedText>
          </Pressable>
        </Link>

        <View style={styles.centerSpace} />

        <Link href="/recipes" asChild>
          <Pressable style={styles.item}>
            <IconSymbol size={22} color={isActive('recipes') ? colors.primary : '#9ca3af'} name={'book' as any} />
            <ThemedText style={StyleSheet.flatten([styles.label, isActive('recipes') ? styles.labelActive : styles.labelInactive])}>Receitas</ThemedText>
          </Pressable>
        </Link>
      </View>

      <Pressable style={StyleSheet.flatten([styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }])} onPress={onScanPress}>
        <IconSymbol size={28} color="#ffffff" name={'plus' as any} />
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
    zIndex: 1000,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0f1418',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    width: '100%',
  },
  item: {
    padding: 8,
    alignItems: 'center',
  },
  centerSpace: {
    width: 56,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 1001,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  labelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  labelInactive: {
    color: '#9ca3af',
  },
})
