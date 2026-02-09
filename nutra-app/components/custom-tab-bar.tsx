import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View, Platform, Text, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

const COLORS = {
  berryRed: "#ee2b5b",
  berryRedLight: "#fee2e2",
  gray400: "#9CA3AF",
  white: "#FFFFFF",
  black: "#000000",
};

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const activeIndex = state.index;
  const { theme } = useTheme();
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

  const TabItem = ({ name, icon, label }: { name: string; icon: any; label: string }) => {
    const focused = isFocused(name);
    return (
      <Pressable style={styles.item} onPress={() => go(name)}>
        <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
          <MaterialIcons 
            size={24} 
            color={focused ? COLORS.berryRed : COLORS.gray400} 
            name={icon} 
          />
        </View>
        <Text style={[
          styles.label, 
          { color: focused ? COLORS.berryRed : COLORS.gray400 }
        ]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrapper}>
      {/* Tab Navigation Pill */}
      <View style={styles.tabPill}>
        <TabItem name="index" icon="home" label="Início" />
        <TabItem name="progress" icon="bar-chart" label="Progresso" />
        <TabItem name="recipes" icon="group" label="Grupos" />
        <TabItem name="meals" icon="person" label="Perfil" />
      </View>

      {/* Camera FAB */}
      <Pressable 
        style={styles.fab}
        onPress={onScanPress}
      >
        <MaterialIcons size={28} color="white" name="camera-alt" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    left: 0,
    right: 0,
    bottom: 30, // Lifted up from bottom
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
    zIndex: 100,
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 999, // Pill shape
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    height: 72,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: COLORS.berryRedLight,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Manrope_700Bold', 
  },
  fab: {
    width: 72,
    height: 72,
    borderRadius: 36, // Circle
    backgroundColor: COLORS.berryRed,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
