import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View, Platform, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { BlurView } from 'expo-blur';

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const activeIndex = state.index;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    border: isDark ? '#27272a' : '#f3f4f6',
    active: isDark ? '#FFFFFF' : '#000000',
    inactive: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
    fabBg: isDark ? '#FFFFFF' : '#000000',
    fabIcon: isDark ? '#000000' : '#FFFFFF',
    ring: isDark ? '#000000' : '#FFFFFF',
  };

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

  const TabItem = ({ name, icon, label }: { name: string; icon: any; label: string }) => {
    const focused = isFocused(name);
    return (
      <Pressable style={styles.item} onPress={() => go(name)}>
        <MaterialIcons 
          size={24} 
          color={focused ? colors.active : colors.inactive} 
          name={icon} 
        />
        <Text style={[
          styles.label, 
          { color: focused ? colors.active : colors.inactive }
        ]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrapper}>
      <BlurView 
        intensity={80} 
        tint={isDark ? 'dark' : 'light'} 
        style={StyleSheet.flatten([styles.bar, { borderTopColor: colors.border, backgroundColor: colors.background }])}
      >
        <TabItem name="index" icon="grid-view" label="INÍCIO" />
        <TabItem name="progress" icon="bar-chart" label="STATUS" />

        {/* Central Button Space */}
        <View style={styles.centerSpace} />

        {/* Using 'recipes' as placeholder for Social and 'meals' for Profile since we don't have those routes yet, 
            or we can just use existing routes but label them differently to match design */}
        <TabItem name="recipes" icon="group" label="SOCIAL" />
        <TabItem name="meals" icon="person" label="PERFIL" />
      </BlurView>

      <Pressable 
        style={StyleSheet.flatten([
          styles.fab, 
          { 
            backgroundColor: colors.fabBg, 
          }
        ])} 
        onPress={onScanPress}
      >
        <MaterialIcons size={32} color={colors.fabIcon} name="add" />
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
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderTopWidth: 1,
    width: '100%',
    height: 90,
    paddingBottom: 24, 
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  centerSpace: {
    width: 64,
  },
  fab: {
    position: 'absolute',
    top: -28, // Moved up to overlap
    width: 64,
    height: 64,
    borderRadius: 24, // Squared rounded
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
